# Serverless visitor counter for marcbastien.com
#   API Gateway (HTTP API)  ->  Lambda (Python 3.12)  ->  DynamoDB (one item, atomic ADD)
# POST /visits increments and returns the count; GET /visits returns it.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ---------------------------------------------------------------------------
# DynamoDB: a single item { pk = "site", visits = N }
# ---------------------------------------------------------------------------

resource "aws_dynamodb_table" "counter" {
  name         = var.project_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"

  attribute {
    name = "pk"
    type = "S"
  }

  server_side_encryption {
    enabled = true
  }
}

# ---------------------------------------------------------------------------
# Lambda
# ---------------------------------------------------------------------------

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/handler.py"
  output_path = "${path.module}/.build/handler.zip"
}

# Created here (not by Lambda on first run) so retention is set and IAM can be scoped to it
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project_name}"
  retention_in_days = var.log_retention_days
}

data "aws_iam_policy_document" "assume_lambda" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${var.project_name}-lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_lambda.json
}

# Least privilege: read/increment this one table, write to this one log group
data "aws_iam_policy_document" "lambda" {
  statement {
    sid       = "CounterTable"
    actions   = ["dynamodb:GetItem", "dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.counter.arn]
  }

  statement {
    sid       = "OwnLogs"
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.lambda.arn}:*"]
  }
}

resource "aws_iam_role_policy" "lambda" {
  name   = "${var.project_name}-lambda"
  role   = aws_iam_role.lambda.id
  policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_lambda_function" "counter" {
  function_name    = var.project_name
  role             = aws_iam_role.lambda.arn
  runtime          = "python3.12"
  handler          = "handler.lambda_handler"
  architectures    = ["arm64"]
  memory_size      = 128
  timeout          = 5
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.counter.name
    }
  }

  depends_on = [
    aws_cloudwatch_log_group.lambda,
    aws_iam_role_policy.lambda,
  ]
}

# ---------------------------------------------------------------------------
# API Gateway HTTP API (CORS is handled here, not in the Lambda)
# ---------------------------------------------------------------------------

resource "aws_apigatewayv2_api" "counter" {
  name          = var.project_name
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["GET", "POST"]
    allow_headers = ["content-type"]
    max_age       = 86400
  }
}

resource "aws_apigatewayv2_integration" "counter" {
  api_id                 = aws_apigatewayv2_api.counter.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.counter.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_visits" {
  api_id    = aws_apigatewayv2_api.counter.id
  route_key = "GET /visits"
  target    = "integrations/${aws_apigatewayv2_integration.counter.id}"
}

resource "aws_apigatewayv2_route" "post_visits" {
  api_id    = aws_apigatewayv2_api.counter.id
  route_key = "POST /visits"
  target    = "integrations/${aws_apigatewayv2_integration.counter.id}"
}

# Access logs: one JSON line per request, including API Gateway and integration errors,
# so a burst shows whether failures came from the throttle (429) or from Lambda (5xx).
# They hold caller IPs, so retention is short.
resource "aws_cloudwatch_log_group" "access" {
  name              = "/aws/apigateway/${var.project_name}"
  retention_in_days = var.access_log_retention_days
}

# Throttling caps abuse (and cost). Each route has its own limits; the default covers any route added later.
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.counter.id
  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = var.throttle_rate_limit
    throttling_burst_limit = var.throttle_burst_limit
  }

  route_settings {
    route_key              = aws_apigatewayv2_route.post_visits.route_key
    throttling_rate_limit  = var.post_rate_limit
    throttling_burst_limit = var.post_burst_limit
  }

  route_settings {
    route_key              = aws_apigatewayv2_route.get_visits.route_key
    throttling_rate_limit  = var.get_rate_limit
    throttling_burst_limit = var.get_burst_limit
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.access.arn
    format = jsonencode({
      requestId         = "$context.requestId"
      ip                = "$context.identity.sourceIp"
      routeKey          = "$context.routeKey"
      status            = "$context.status"
      responseLatency   = "$context.responseLatency"
      error             = "$context.error.message"
      integrationError  = "$context.integrationErrorMessage"
      integrationStatus = "$context.integrationStatus"
    })
  }
}

resource "aws_lambda_permission" "api" {
  statement_id  = "AllowApiGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.counter.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.counter.execution_arn}/*/*/visits"
}

# ---------------------------------------------------------------------------
# Alerting: abuse is bounded by the throttle, but without these it's invisible
# ---------------------------------------------------------------------------

# Unencrypted on purpose: CloudWatch alarms can't publish to a topic using the AWS-managed SNS key,
# and the messages hold only alarm names and metric values.
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-alerts"
}

# Stays "pending confirmation" until the link in the first email is clicked
resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# A sustained flood past the throttle: 429s (and probes for routes that don't exist) for 15 minutes
resource "aws_cloudwatch_metric_alarm" "api_4xx" {
  alarm_name          = "${var.project_name}-4xx"
  alarm_description   = "Visitor counter API: sustained 4xx (throttled 429s). Check the access logs for the caller."
  namespace           = "AWS/ApiGateway"
  metric_name         = "4xx"
  dimensions          = { ApiId = aws_apigatewayv2_api.counter.id }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 3
  threshold           = var.alarm_4xx_threshold
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# Server-side failures. The CP1 burst test showed a burst gets 500/503s, not 429s, so this is the
# signal that fires first under load as well as when the Lambda or table breaks.
resource "aws_cloudwatch_metric_alarm" "api_5xx" {
  alarm_name          = "${var.project_name}-5xx"
  alarm_description   = "Visitor counter API: 5xx responses. Check the access logs (integrationStatus, integrationError)."
  namespace           = "AWS/ApiGateway"
  metric_name         = "5xx"
  dimensions          = { ApiId = aws_apigatewayv2_api.counter.id }
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = var.alarm_5xx_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

# Covers the whole account (no cost filter), so any runaway spend shows up, not just this stack
resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-monthly"
  budget_type  = "COST"
  limit_amount = tostring(var.budget_limit_usd)
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type             = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = [var.alert_email]
  }
}
