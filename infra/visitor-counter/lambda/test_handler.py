"""Unit tests for handler.py with a stubbed DynamoDB client (no AWS, no boto3 needed).

Run from this folder:  python -m unittest
"""
import json
import os
import unittest

import handler


class StubDynamo:
    """Mimics the two low-level client calls the handler uses."""

    def __init__(self, visits=None, fail=False):
        self.visits = visits
        self.fail = fail
        self.calls = []

    def update_item(self, **kwargs):
        self.calls.append(("update_item", kwargs))
        if self.fail:
            raise RuntimeError("boom")
        self.visits = (self.visits or 0) + int(kwargs["ExpressionAttributeValues"][":one"]["N"])
        return {"Attributes": {"visits": {"N": str(self.visits)}}}

    def get_item(self, **kwargs):
        self.calls.append(("get_item", kwargs))
        if self.fail:
            raise RuntimeError("boom")
        return {} if self.visits is None else {"Item": {"visits": {"N": str(self.visits)}}}


def event(method):
    return {"requestContext": {"http": {"method": method, "path": "/visits"}}}


class HandlerTests(unittest.TestCase):
    def setUp(self):
        os.environ["TABLE_NAME"] = "test-table"

    def body(self, resp):
        return json.loads(resp["body"])

    def test_post_increments_atomically_and_returns_new_count(self):
        db = StubDynamo(visits=41)
        resp = handler.lambda_handler(event("POST"), None, client=db)
        self.assertEqual(resp["statusCode"], 200)
        self.assertEqual(self.body(resp), {"visits": 42})
        name, kwargs = db.calls[0]
        self.assertEqual(name, "update_item")
        self.assertEqual(kwargs["TableName"], "test-table")
        self.assertEqual(kwargs["Key"], {"pk": {"S": "site"}})
        self.assertEqual(kwargs["UpdateExpression"], "ADD visits :one")

    def test_first_post_creates_the_count(self):
        resp = handler.lambda_handler(event("POST"), None, client=StubDynamo())
        self.assertEqual(self.body(resp), {"visits": 1})

    def test_get_reads_without_incrementing(self):
        db = StubDynamo(visits=7)
        resp = handler.lambda_handler(event("GET"), None, client=db)
        self.assertEqual(self.body(resp), {"visits": 7})
        self.assertEqual([c[0] for c in db.calls], ["get_item"])

    def test_get_before_any_visit_is_zero(self):
        resp = handler.lambda_handler(event("GET"), None, client=StubDynamo())
        self.assertEqual(self.body(resp), {"visits": 0})

    def test_other_methods_are_rejected(self):
        db = StubDynamo(visits=3)
        resp = handler.lambda_handler(event("DELETE"), None, client=db)
        self.assertEqual(resp["statusCode"], 405)
        self.assertEqual(db.calls, [])

    def test_dynamodb_errors_become_a_generic_500(self):
        with self.assertLogs(handler.logger, level="ERROR"):
            resp = handler.lambda_handler(event("POST"), None, client=StubDynamo(fail=True))
        self.assertEqual(resp["statusCode"], 500)
        self.assertEqual(self.body(resp), {"error": "counter unavailable"})

    def test_responses_are_json_and_never_cached(self):
        resp = handler.lambda_handler(event("GET"), None, client=StubDynamo(visits=1))
        self.assertEqual(resp["headers"]["Content-Type"], "application/json")
        self.assertEqual(resp["headers"]["Cache-Control"], "no-store")
        self.assertNotIn("Access-Control-Allow-Origin", resp["headers"])


if __name__ == "__main__":
    unittest.main()
