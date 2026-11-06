"""Visitor counter Lambda (API Gateway HTTP API, payload format 2.0).

POST /visits -> atomically add 1 and return {"visits": N}
GET  /visits -> return {"visits": N} (0 before the first visit)

CORS headers come from the API Gateway cors_configuration, not from here.
"""
import json
import logging
import os

# Lambda sends anything I log here to CloudWatch (/aws/lambda/portfolio-visitor-counter).
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# The whole count lives in one DynamoDB item, and this is its key.
PK = "site"

# I build the DynamoDB client once, while Lambda is starting the function up,
# not inside the first request.
#
# Why: startup ("init") gets its own time allowance, separate from the
# 5-second timeout each request has. When I built the client lazily inside the
# first request, importing boto3 and creating the client at 128 MB could take
# more than 5 seconds by itself, so the first visitor on a fresh instance timed
# out and the footer counter didn't show. The CP1 burst test and a real visit
# both hit this.
#
# AWS_LAMBDA_FUNCTION_NAME is only set inside Lambda. Locally the unit tests pass
# in their own fake client, so they never need boto3 or AWS credentials.
if os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    import boto3  # ships with the Lambda Python runtime, so there's nothing to package

    _client = boto3.client("dynamodb")
else:
    _client = None


def increment(client, table):
    # POST: add 1 and get the new total back in the same call. ADD is atomic, so
    # two visitors at the same moment can't overwrite each other's count.
    resp = client.update_item(
        TableName=table,
        Key={"pk": {"S": PK}},
        UpdateExpression="ADD visits :one",
        ExpressionAttributeValues={":one": {"N": "1"}},
        ReturnValues="UPDATED_NEW",
    )
    return int(resp["Attributes"]["visits"]["N"])


def read(client, table):
    # GET: read the count without changing it. Before the first visit the item
    # doesn't exist yet, so I treat that as 0.
    resp = client.get_item(TableName=table, Key={"pk": {"S": PK}}, ProjectionExpression="visits")
    item = resp.get("Item") or {}
    return int(item["visits"]["N"]) if "visits" in item else 0


def _response(status, body):
    # Every reply is JSON, and no-store stops browsers and proxies from caching
    # an old count.
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json", "Cache-Control": "no-store"},
        "body": json.dumps(body),
    }


def lambda_handler(event, context, client=None):
    # API Gateway hands me the HTTP method inside requestContext. If anything
    # is missing I fall back to "", which gets a 405 below.
    method = ((event or {}).get("requestContext") or {}).get("http", {}).get("method", "")
    table = os.environ["TABLE_NAME"]  # set by Terraform on the function

    if method not in ("GET", "POST"):
        return _response(405, {"error": "method not allowed"})

    try:
        # The tests pass a fake client in; in Lambda I use the one built at startup.
        db = client or _client
        count = increment(db, table) if method == "POST" else read(db, table)
    except Exception:  # noqa: BLE001 - never leak internals to the browser
        # The full error goes to my logs; the visitor only gets a generic 500,
        # and the site hides the counter.
        logger.exception("visitor counter %s failed", method)
        return _response(500, {"error": "counter unavailable"})

    return _response(200, {"visits": count})
