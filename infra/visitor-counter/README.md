# Visitor counter (AWS serverless)

The footer's "● N visits · counted by AWS Lambda + DynamoDB" line.

```
Browser ──POST/GET /visits──▶ API Gateway (HTTP API) ──▶ Lambda (Python 3.12, arm64) ──▶ DynamoDB
          CORS: marcbastien.com,                          ADD visits :1 (atomic)          1 item, on-demand
          www, localhost:3000
          throttle: 5 rps, burst 10
```

- **DynamoDB**: one item (`pk = "site"`) with a `visits` number. On-demand billing, encrypted at rest.
- **Lambda** (`lambda/handler.py`):
  - `POST /visits` increments the count with an atomic `UpdateItem ADD` and returns the new total.
  - `GET /visits` reads the count.
  - Errors return a generic 500, and the details go to the logs only.
- **API Gateway HTTP API**:
  - CORS is limited to the site's origins plus `http://localhost:3000`.
  - Stage-wide throttling caps abuse and cost. The limit applies to all callers combined, not per IP.
- **IAM**: the function's role can only `GetItem`/`UpdateItem` on this table and write to its own log group.
- **Logs**: `/aws/lambda/portfolio-visitor-counter`, kept 14 days.

The frontend (`src/hooks/useVisitorCount.js`) sends one `POST` per browser session, then `GET` every 60 seconds while the tab is visible. If `REACT_APP_VISITOR_API_URL` isn't set, the counter is simply hidden, so the site works fine before any of this exists.

## Deploy

Prerequisites: Terraform ≥ 1.5, and AWS credentials for the target account (e.g. `aws configure` or `AWS_PROFILE`).

```bash
cd infra/visitor-counter
terraform init
terraform plan          # review: 1 table, 1 function, 1 role + policy, 1 log group, 1 HTTP API (+ routes/stage/permission)
terraform apply
terraform output api_url
```

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
- **CloudWatch Logs:** small; 14-day retention keeps it bounded.

The throttle (5 requests per second, burst 10) puts a hard ceiling on what a misbehaving client can cost.

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
