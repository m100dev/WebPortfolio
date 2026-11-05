# Visitor counter (AWS serverless)

The footer's "● N visits · counted by AWS Lambda + DynamoDB" line.

```
Browser ──POST/GET /visits──▶ API Gateway (HTTP API) ──▶ Lambda (Python 3.12, arm64, 256 MB) ──▶ DynamoDB
          CORS: marcbastien.com,                          ADD visits :1 (atomic)          1 item, on-demand
          www, localhost:3000
          throttle: POST 2 rps/burst 5, GET 5 rps/burst 10
          access logs + 4xx/5xx alarms + $5 budget ──▶ SNS email
```

- **DynamoDB**: one item (`pk = "site"`) with a `visits` number. On-demand billing, encrypted at rest.
- **Lambda** (`lambda/handler.py`):
  - `POST /visits` increments the count with an atomic `UpdateItem ADD` and returns the new total.
  - `GET /visits` reads the count.
  - Errors return a generic 500, and the details go to the logs only.
- **API Gateway HTTP API**:
  - CORS is limited to the site's origins plus `http://localhost:3000`.
  - Per-route throttling caps abuse and cost: `POST /visits` 2 rps (burst 5), `GET /visits` 5 rps (burst 10). The limits apply to all callers combined, not per IP. The stage default (5 rps, burst 10) only covers routes added later.
  - Access logs go to `/aws/apigateway/portfolio-visitor-counter`, kept 14 days (see [Abuse model](#abuse-model)).
- **IAM**: the function's role can only `GetItem`/`UpdateItem` on this table and write to its own log group.
- **Logs**: `/aws/lambda/portfolio-visitor-counter`, kept 14 days.

The frontend (`src/hooks/useVisitorCount.js`) sends one `POST` per browser session, then `GET` every 60 seconds while the tab is visible. If `REACT_APP_VISITOR_API_URL` isn't set, the counter is simply hidden, so the site works fine before any of this exists.

## Deploy

Prerequisites:
- Terraform ≥ 1.5.
- AWS credentials for the target account (e.g. `aws configure` or `AWS_PROFILE`) with the actions in [Deployer IAM](#deployer-iam).
- A git-ignored `terraform.tfvars` that sets `alert_email` (copy `terraform.tfvars.example`). The address lives only there; never commit it.

```bash
cd infra/visitor-counter
terraform init
terraform plan          # review: 1 table, 1 function, 1 role + policy, 2 log groups, 1 HTTP API (+ routes/stage/permission),
                        #         1 SNS topic + email subscription, 2 alarms, 1 budget
terraform apply
terraform output api_url
```

After the first apply, click the confirmation link AWS sends to `alert_email`. Until you do, the SNS subscription stays "pending confirmation" and the alarms email nobody. The budget emails you directly and needs no confirmation.

Then wire up the site:

1. In the Amplify Console, go to **App settings → Environment variables** and add `REACT_APP_VISITOR_API_URL` with the `api_url` output, for example `https://abc123.execute-api.us-east-1.amazonaws.com/visits`.
2. **Redeploy** the site. `REACT_APP_*` variables are baked in at build time, so the counter only appears after a new build.

To try it locally, run `REACT_APP_VISITOR_API_URL=<api_url> npm start` (Bash) or `$env:REACT_APP_VISITOR_API_URL='<api_url>'; npm start` (PowerShell). `localhost:3000` is already an allowed CORS origin.

State is stored locally in `terraform.tfstate`, which is git-ignored. Keep it somewhere safe, or add an S3 backend if you want remote state.

## Cost

This should be about **$0/month** at portfolio traffic. Rough free-tier headroom:

- **Lambda:** 1M requests and 400k GB-s per month, always free.
- **DynamoDB on-demand:** a fraction of a cent per thousand requests. Each visit is one write plus a few reads, and a single small item stays far below the 25 GB free storage.
- **API Gateway HTTP API:** $1.00 per million requests after the 12-month free tier.
- **CloudWatch Logs:** small; 14-day retention keeps both groups bounded.
- **Alerting:** two standard alarms at $0.10 each. The budget and the first 1,000 SNS emails are free.

**Worst case:** both routes flooded at their limits for a whole month (POST 2 rps + GET 5 rps = 18.1M requests), at us-east-1 on-demand prices, ignoring the free tier:

| Service | Worst case |
|---------|-----------|
| API Gateway (18.1M × $1.00/M) | $18.14 |
| Lambda requests (18.1M × $0.20/M) | $3.63 |
| Lambda compute (256 MB, ~91k GB-s, under the 400k free tier) | ~$0 |
| DynamoDB writes (5.2M POSTs × $0.625/M) | $3.24 |
| DynamoDB reads (13.0M eventually consistent GETs) | $0.81 |
| Lambda logs (~6.4 GB × $0.50) | $3.18 |
| Access logs (~5.4 GB × $0.50) | $2.72 |
| Alarms | $0.20 |
| **Total** | **≈ $32/month** |

That's higher than the brief's ≈ $26, for two reasons:
- the brief assumed one 5 rps limit shared by every route, with all of it POST;
- the reads and the new access logs are now counted.

Writes, the line that also inflates the count, drop from $8.10 to $3.24. AWS calls throttles "targets rather than guaranteed request ceilings", so treat this as an estimate, not a hard cap. The budget alert is the backstop.

## Abuse model

The full analysis is in [`brief.md`](../../docs/plans/2026-11-05-toolchain-upgrade/brief.md). In short:

- **The site can't be taken down through this API.** At worst the footer counter goes blank, because `useVisitorCount.js` hides it on any error.
- **The counter can be blanked** by anyone sending more than the route limits.
  - Per-route limits mean a POST flood no longer starves the GETs real visitors make.
  - Per-IP limiting would need CloudFront + WAF in front (WAF can't attach to HTTP APIs). That costs more per month than the abuse it would prevent.
- **The count can be inflated** with `curl -X POST` in a loop, up to 2 per second. It's a vanity metric, so that's accepted.
- **Under a burst, callers see 5xx, not just 429.**
  - The CP1 burst test (30 concurrent GETs, before these changes) got 10 × 500 and 20 × 503, with no 200s and no 429s. A single GET right after returned 200.
  - **Cause (confirmed from the access and Lambda logs, 2026-11-05):**
    - The 500s were cold-start Lambda invocations timed out at 5 s (`handler.py:19-26` imports boto3 and builds the client inside the first request, at 128 MB).
    - The 503s were Lambda's own throttle (`integrationStatus` 429, "The Lambda function is being throttled"): the stuck instances held all 10 of the account's concurrent executions.
    - API Gateway's route throttle returned no 429s for a sub-second burst of 30. AWS calls these limits best-effort targets, so in practice the account's Lambda concurrency limit (10) is the cap. Keep `post_burst_limit + get_burst_limit` below it.

**Alerts** (all go to `alert_email`):

| Alert | Fires when |
|-------|-----------|
| `portfolio-visitor-counter-5xx` | 5 or more server errors in 5 minutes. It fires first under a burst, and also if the Lambda or table breaks. |
| `portfolio-visitor-counter-4xx` | More than 50 4xx responses (throttled 429s, probes for missing routes) per 5 minutes, for 15 minutes. |
| Budget `portfolio-visitor-counter-monthly` | Account spend passes 80% of $5, or is forecast to pass 100%. It covers the **whole account**, not just this stack. |

**Reading the access logs:**
- Each request is one JSON line: `requestId`, `ip`, `routeKey`, `status`, `responseLatency`, `error`, `integrationError`, `integrationStatus`.
- The deployer user can't read logs, on purpose. Use your own credentials, or Logs Insights in the CloudWatch console:

```
fields @timestamp, ip, routeKey, status, error, integrationStatus
| filter status >= 400
| stats count() by ip, routeKey, status
| sort count() desc
```

The logs hold caller IP addresses, which is personal data. Retention is 14 days (`access_log_retention_days`), and they're only for spotting abuse.

## Deployer IAM

The deployer policy isn't tracked in this repo. The alerting and access logs need these actions on top of what it already grants.
- Replace `ACCOUNT` with the account ID.
- If `plan` or `apply` fails with AccessDenied, add the named action, scoped the same way.

| Purpose | Actions | Resource |
|---------|---------|----------|
| Access-log delivery (from AWS's HTTP API logging page; no resource scoping) | `logs:CreateLogDelivery`, `logs:GetLogDelivery`, `logs:UpdateLogDelivery`, `logs:DeleteLogDelivery`, `logs:ListLogDeliveries`, `logs:PutResourcePolicy`, `logs:DescribeResourcePolicies` | `*` |
| Access-log group (skip any your Lambda log-group grant already covers) | `logs:CreateLogGroup`, `logs:DeleteLogGroup`, `logs:PutRetentionPolicy`, `logs:ListTagsForResource`; plus `logs:DescribeLogGroups` on `*` | `arn:aws:logs:us-east-1:ACCOUNT:log-group:/aws/apigateway/portfolio-visitor-counter*` |
| SNS topic + subscription | `sns:CreateTopic`, `sns:DeleteTopic`, `sns:GetTopicAttributes`, `sns:SetTopicAttributes`, `sns:ListTagsForResource`, `sns:Subscribe`, `sns:Unsubscribe`, `sns:GetSubscriptionAttributes`, `sns:SetSubscriptionAttributes`, `sns:ListSubscriptionsByTopic` | `arn:aws:sns:us-east-1:ACCOUNT:portfolio-visitor-counter-alerts` |
| Alarms | `cloudwatch:PutMetricAlarm`, `cloudwatch:DeleteAlarms`, `cloudwatch:DescribeAlarms`, `cloudwatch:ListTagsForResource` | `arn:aws:cloudwatch:us-east-1:ACCOUNT:alarm:portfolio-visitor-counter-*` |
| Budget | `budgets:ModifyBudget`, `budgets:ViewBudget`, `budgets:ListTagsForResource` | `arn:aws:budgets::ACCOUNT:budget/portfolio-visitor-counter-monthly` |

None of these let the deployer read logs or metrics. That stays with your own credentials.

## Tests

```bash
cd infra/visitor-counter/lambda
python -m unittest -v
```

These use a stubbed DynamoDB client, so they need no AWS access and no boto3.

## Teardown

```bash
cd infra/visitor-counter
terraform destroy
```

Then remove `REACT_APP_VISITOR_API_URL` from Amplify and redeploy. The footer line disappears on its own once the variable is unset.
