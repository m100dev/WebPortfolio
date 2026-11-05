# Launch checklist

These are the steps to take the `portfolio-redesign` branch live. They cover the new routes, guides, theme and memos, and the AWS visitor counter. Do them in order. Each step ends with a **✓ Check**.

> **⚠ Update the Amplify rewrite rules *before* the new build deploys (step 2).**
> The rules live on Amplify right now still include a `/guides/<*>` passthrough to the old HTML files. Those files are deleted on this branch. If the new build goes out first, refreshing `/guides/ai-autonomy-levels` returns a 404, and so do the old `.html` links.

---

## Part 1: Ship the site

### 1. Sanity check before pushing
PowerShell (the VS Code default on Windows):
```powershell
$env:CI = 'true'; npm run build; Remove-Item Env:CI   # builds like Amplify (warnings fail the build)
npm test -- --watchAll=false
```
Git Bash / macOS / Linux: `CI=true npm run build`. That form fails in PowerShell or cmd with "The term 'CI=true' is not recognized".
- In the Amplify Console, note which branch the app builds from. It's probably `main`.

✓ **Check:** both commands finish clean.

### 2. Paste the new rewrite rules into Amplify
1. Go to Amplify Console → your app → **Hosting → Rewrites and redirects → Manage redirects → Open text editor**.
2. Replace everything with the contents of `amplify-redirects.json`. It's in the repo root but untracked on purpose.
3. Save.

The file contains four rules, and their order matters:
1. `https://marcbastien.com` → `https://www.marcbastien.com` (302)
2. `/guides/AVD_Enterprise_Project_Guide.html` → `/guides/avd-enterprise-workspace` (301)
3. `/guides/Marc-Bastien-AI-Autonomy-Levels.html` → `/guides/ai-autonomy-levels` (301)
4. The SPA rewrite to `/index.html` (200). It must be **last**.

The SPA rewrite skips any path whose extension is in its allowlist. That list now includes `md`, because memos load `.md` files. Without it, a memo would show the page's HTML source instead of its text.

✓ **Check:** the rules list shows four entries in that order.

### 3. Push and merge
```bash
git push -u origin portfolio-redesign
```
- Open a PR into `main` and merge it. Amplify starts a build automatically.

✓ **Check:** the Amplify build finishes green.

### 4. Check the live site
- [x] Hard-refresh (Ctrl+Shift+R) `https://www.marcbastien.com/guides/ai-autonomy-levels` and `/guides/avd-enterprise-workspace`. Both load, not a 404.
- [x] `/guides/AVD_Enterprise_Project_Guide.html` redirects to `/guides/avd-enterprise-workspace`.
- [x] `/guides/Marc-Bastien-AI-Autonomy-Levels.html` redirects to `/guides/ai-autonomy-levels`.
- [x] `/some-made-up-page` shows the site's 404 page.
- [x] The sun/moon toggle switches themes, and the choice survives a reload.
- [x] `/memos` says "Nothing published yet", and there's no Memos link in the nav. That's expected.
- [x] The footer has **no** visitor counter yet. That's expected; Part 2 adds it.

---

## Part 2: Turn on the visitor counter

### 5. AWS prerequisites
- Install the AWS CLI and Terraform ≥ 1.5. Check with `aws --version` and `terraform version`.
- Sign in with `aws configure`, or use `aws sso login --profile <name>` and set `AWS_PROFILE`.
- Confirm you're in the right account:
  ```bash
  aws sts get-caller-identity
  ```
- The identity needs permission to create **DynamoDB, Lambda, IAM role/policy, API Gateway (v2), and CloudWatch Logs** resources. An admin user is fine for a personal account.
- The region defaults to `us-east-1`. To change it, copy `infra/visitor-counter/terraform.tfvars.example` to `terraform.tfvars` and edit it there.
- *Optional but smart:* set up an AWS Budgets alert at $1/month (Billing → Budgets).

✓ **Check:** `get-caller-identity` prints the account you expect.

### 6. Deploy the stack
```bash
cd infra/visitor-counter
terraform init
terraform plan
```
- Review the plan. It should create **11 resources**:
  - the DynamoDB table;
  - the log group;
  - the IAM role and its policy;
  - the Lambda function;
  - the HTTP API, its integration, the 2 routes and the stage;
  - the Lambda permission.

Then:
```bash
terraform apply
terraform output api_url
```

✓ **Check:** `api_url` prints something like `https://abc123.execute-api.us-east-1.amazonaws.com/visits`.

### 7. Smoke-test the API
```bash
URL=$(terraform output -raw api_url)
curl -X POST "$URL"       # {"visits":1}
curl "$URL"               # {"visits":1}  (GET doesn't increment)
curl -i -H "Origin: https://www.marcbastien.com" "$URL"
```
- The last call's headers should include `access-control-allow-origin: https://www.marcbastien.com`.

✓ **Check:** you get JSON counts and the CORS header.

### 8. Point the site at the API
1. Go to Amplify Console → **Hosting → Environment variables → Manage variables**.
2. Add `REACT_APP_VISITOR_API_URL` = the `api_url` value.
3. **Redeploy:** open the latest build and choose **Redeploy this version**, or push any commit. `REACT_APP_*` values are baked in at build time, so the counter won't appear until a new build runs.

✓ **Check:** the new build finishes green.

### 9. Check the counter
- [ ] The footer shows `● N visits · counted by AWS Lambda + DynamoDB`. The number counts up once.
- [ ] DevTools → Network → filter `visits`: there's **one POST** on the first load.
- [ ] Reloading the tab sends a **GET**, not another POST. A visit counts once per browser session.
- [ ] Leave the tab open. A GET fires about every 60 seconds while the tab is visible.

---

## Part 3: After launch

- **Keep `infra/visitor-counter/terraform.tfstate` safe.** It's git-ignored. Back it up, or move it to an S3 backend. Without it, Terraform can't manage or destroy the stack.
- **To publish your first memo:**
  1. Copy `src/content/memos/_template.md` to `<slug>.md` and write the post.
  2. In `src/content/memos/index.js`, import it and add an entry: `slug`, `title`, `date` (YYYY-MM-DD), `summary`, `draft: false`, `file`.
  3. Push. The Memos link appears in the nav once one memo is published.
- **Rollback, counter:** run `terraform destroy` in `infra/visitor-counter`, remove `REACT_APP_VISITOR_API_URL` in Amplify, and redeploy. The footer line disappears by itself.
- **Rollback, site:** in Amplify, redeploy the previous successful build.
- **Nice-to-haves:**
  - Per-page Open Graph tags: shared guide links currently preview as the generic site card.
  - A "Serverless visitor counter" project card showing off the Terraform stack.

More detail on the counter (architecture, cost, tests) is in `infra/visitor-counter/README.md`.
