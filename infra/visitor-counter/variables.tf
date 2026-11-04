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
  description = "Steady-state requests per second allowed across the API (all callers combined)."
  type        = number
  default     = 5
}

variable "throttle_burst_limit" {
  description = "Burst of requests allowed above the steady rate."
  type        = number
  default     = 10
}

variable "log_retention_days" {
  description = "How long to keep the Lambda's CloudWatch logs."
  type        = number
  default     = 14
}
