variable "aws_region" {
  description = "AWS region to deploy the counter into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for every resource name."
  type        = string
  default     = "portfolio-visitor-counter"
}

variable "allowed_origins" {
  description = "Origins allowed to call the API from a browser (CORS)."
  type        = list(string)
  default = [
    "https://www.marcbastien.com",
    "https://marcbastien.com",
    "http://localhost:3000",
  ]
}

variable "throttle_rate_limit" {
  description = "Stage default: steady-state requests per second for any route without its own limits below (all callers combined)."
  type        = number
  default     = 5
}

variable "throttle_burst_limit" {
  description = "Stage default: burst of requests allowed above the steady rate."
  type        = number
  default     = 10
}

# Per-route limits: a POST flood (DynamoDB writes, count inflation) can't use up the reads real visitors make.
# Keep post_burst_limit + get_burst_limit under the account's Lambda concurrency limit.
variable "post_rate_limit" {
  description = "Steady-state requests per second for POST /visits (all callers combined)."
  type        = number
  default     = 2
}

variable "post_burst_limit" {
  description = "Burst allowed for POST /visits."
  type        = number
  default     = 5
}

variable "get_rate_limit" {
  description = "Steady-state requests per second for GET /visits (all callers combined)."
  type        = number
  default     = 5
}

variable "get_burst_limit" {
  description = "Burst allowed for GET /visits."
  type        = number
  default     = 10
}

variable "log_retention_days" {
  description = "How long to keep the Lambda's CloudWatch logs."
  type        = number
  default     = 14
}

variable "access_log_retention_days" {
  description = "How long to keep the API's access logs (they hold caller IPs)."
  type        = number
  default     = 14
}

# ---------------------------------------------------------------------------
# Alerting
# ---------------------------------------------------------------------------

variable "alert_email" {
  description = "Where budget and alarm emails go. Set it in terraform.tfvars (git-ignored); never commit it."
  type        = string
  sensitive   = true
}

variable "budget_limit_usd" {
  description = "Monthly cost budget for the whole account, in USD. Emails at 80% actual and 100% forecast."
  type        = number
  default     = 5
}

variable "alarm_4xx_threshold" {
  description = "4xx responses (throttling shows up as 429) per 5 minutes that count as abuse; must hold for 15 minutes."
  type        = number
  default     = 50
}

variable "alarm_5xx_threshold" {
  description = "5xx responses per 5 minutes before alarming. Normal traffic produces none."
  type        = number
  default     = 5
}
