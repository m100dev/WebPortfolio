output "api_url" {
  description = "Full URL of the counter endpoint. Set this as REACT_APP_VISITOR_API_URL in Amplify."
  value       = "${aws_apigatewayv2_api.counter.api_endpoint}/visits"
}

output "table_name" {
  description = "DynamoDB table holding the count."
  value       = aws_dynamodb_table.counter.name
}

output "access_log_group" {
  description = "CloudWatch Logs group holding the API's access logs."
  value       = aws_cloudwatch_log_group.access.name
}
