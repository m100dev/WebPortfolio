"""Visitor counter Lambda (API Gateway HTTP API, payload format 2.0).

POST /visits -> atomically add 1 and return {"visits": N}
GET  /visits -> return {"visits": N} (0 before the first visit)

CORS headers come from the API Gateway cors_configuration, not from here.
"""
import json
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

PK = "site"
_client = None


def _dynamodb():
    # boto3 ships with the Lambda runtime; importing lazily keeps the unit tests dependency-free
    global _client
    if _client is None:
        import boto3

        _client = boto3.client("dynamodb")
    return _client


def increment(client, table):
    resp = client.update_item(
        TableName=table,
        Key={"pk": {"S": PK}},
        UpdateExpression="ADD visits :one",
        ExpressionAttributeValues={":one": {"N": "1"}},
        ReturnValues="UPDATED_NEW",
    )
    return int(resp["Attributes"]["visits"]["N"])


def read(client, table):
    resp = client.get_item(TableName=table, Key={"pk": {"S": PK}}, ProjectionExpression="visits")
    item = resp.get("Item") or {}
    return int(item["visits"]["N"]) if "visits" in item else 0


def _response(status, body):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps(body),
    }


def lambda_handler(event, context, client=None):
    method = ((event or {}).get("requestContext") or {}).get("http", {}).get("method", "")
    table = os.environ["TABLE_NAME"]

    if method not in ("GET", "POST"):
        return _response(405, {"error": "method not allowed"})

    try:
        db = client or _dynamodb()
        count = increment(db, table) if method == "POST" else read(db, table)
    except Exception:  # noqa: BLE001 - never leak internals to the browser
        logger.exception("visitor counter %s failed", method)
        return _response(500, {"error": "counter unavailable"})

    return _response(200, {"visits": count})
