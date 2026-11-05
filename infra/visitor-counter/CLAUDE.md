# Visitor counter stack

Terraform for DynamoDB, a Python 3.12 Lambda and an API Gateway HTTP API. Architecture, cost and deploy steps are in `README.md` in this folder.

- **Never run `terraform apply` or `destroy` without asking.** The stack is deployed by hand. `terraform plan`, `validate` and `fmt` are fine.
- **State is local and git-ignored** (`terraform.tfstate`, `terraform.tfvars`). Never commit it, and never print its contents.
- **AWS provider is `~> 6.0`.** `default_tags` were removed on purpose, because tagging API Gateway resources needs `apigateway:TagResource`, which the least-privilege deployer policy doesn't grant.
- **Least privilege:**
  - the Lambda role may only `GetItem` / `UpdateItem` on its table and write its own log group;
  - keep CORS pinned to the site origins plus `http://localhost:3000`.
- **Tests:** `cd lambda && python -m unittest` (stubbed DynamoDB, no AWS needed).
- **Frontend contract:** `src/hooks/useVisitorCount.js` sends one `POST` per browser session, then a `GET` every 60 seconds while the tab is visible. Keep `POST /visits` (increment) and `GET /visits` (read) returning `{"visits": n}`.
