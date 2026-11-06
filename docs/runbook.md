# Runbook

How I deploy, check and roll back marcbastien.com and its visitor counter. Each procedure ends with a **✓ Check**.

The site is a static Vite build on AWS Amplify. Amplify builds `main` on every push. The visitor counter is a separate Terraform stack in [`infra/visitor-counter/`](../infra/visitor-counter/README.md), deployed by hand.

---

## Deploy the site

### 1. Check locally
```bash
npm run build      # lint (zero warnings) + Vite build, exactly what Amplify runs
npm run test:once
```
- Both need Node 24.15 or later (`engine-strict`). Locally I run Node 26. Amplify's build spec installs Node 24 (`nvm install 24` + `nvm use 24` in preBuild), matching `.nvmrc`, so production builds one major version behind. Both satisfy `engines`. If Amplify ever builds on 26, update `.nvmrc` with it.
- The pre-commit and pre-push hooks already run these, so this step is a sanity check.

✓ **Check:** both finish clean.

### 2. Update the rewrite rules first, if they changed
**Rule:** if a change adds, renames or removes a route, a redirect, or a static file type, paste the new rules **before** the build that needs them deploys. If the build goes first, refreshing an affected URL can 404 or serve the wrong file until the rules catch up.

1. Amplify Console → the app → **Hosting → Rewrites and redirects → Manage redirects → Open text editor**.
2. Replace everything with the contents of [`infra/amplify/redirects.json`](../infra/amplify/redirects.json).
3. Save.

Order matters:
1. `https://marcbastien.com` → `https://www.marcbastien.com` (302).
2. The old guide `.html` URLs → their React routes (301).
3. The SPA rewrite to `/index.html` (200). It must be **last**.

The SPA rewrite sends every path whose extension isn't in its allowlist to `index.html`. A new static file type (memos need `md`; a PDF would need `pdf`) must be added to that list, or the browser gets the app's HTML instead of the file.

✓ **Check:** the console shows the rules in the same order as the file.

### 3. Merge to `main`
Open a PR into `main` and merge it. Amplify starts a build automatically.

✓ **Check:** the Amplify build finishes green.

---

## Deploy or update the visitor counter

### 1. Credentials
- Terraform ≥ 1.5 and the AWS CLI (`aws --version`, `terraform version`).
- Use the deployer user, which has the two policies in `infra/visitor-counter/deployer-policy*.json`. It can't read logs or metrics, on purpose.
- Confirm the account: `aws sts get-caller-identity`.
- `infra/visitor-counter/terraform.tfvars` (git-ignored) sets `alert_email` and `budget_limit_usd = 11`. Copy `terraform.tfvars.example` the first time.

✓ **Check:** `get-caller-identity` prints the account you expect.

### 2. Plan and apply
```bash
cd infra/visitor-counter
terraform init
terraform plan
```
- On a fresh account, the plan creates 17 resources: the table, Lambda, its role and policy, two log groups, the HTTP API with its integration, 2 routes, stage and permission, the SNS topic and email subscription, 2 alarms and the budget.
- On an update, read every change. A replace (`-/+`) of the table would reset the count.

Then `terraform apply`. After a first apply, click the confirmation link AWS emails to `alert_email`, or the alarms email nobody.

✓ **Check:** `terraform output -raw api_url` prints `https://<id>.execute-api.us-east-1.amazonaws.com/visits`.

### 3. Point the site at the API (first deploy, or if the URL changed)
1. Amplify Console → **Hosting → Environment variables** → set `REACT_APP_VISITOR_API_URL` to the `api_url` output.
2. Redeploy. `REACT_APP_*` values are baked in at build time, so the counter only appears after a new build.

✓ **Check:** the new build finishes green.

### 4. Keep the state safe
`terraform.tfstate` is local and git-ignored. Back it up after every apply, or move it to an S3 backend. Without it, Terraform can't manage or destroy the stack.

---

## Smoke test

### Site
Hard-refresh (Ctrl+Shift+R) each of these:
- `/`, `/guides/ai-autonomy-levels` and `/guides/avd-enterprise-workspace` load directly, not as a 404.
- `/guides/AVD_Enterprise_Project_Guide.html` and `/guides/Marc-Bastien-AI-Autonomy-Levels.html` redirect to their React routes.
- `/some-made-up-page` shows the site's 404 page.
- `/memos/<a-live-slug>` shows the memo's text, not HTML source (the `md` allowlist entry).
- The theme toggle switches, and the choice survives a reload.

### Counter API
```bash
cd infra/visitor-counter
URL=$(terraform output -raw api_url)
curl "$URL"                                              # {"visits":N}, doesn't increment
curl -i -H "Origin: https://www.marcbastien.com" "$URL"  # has access-control-allow-origin
```
Skip the `POST`. It adds a real visit.

### Counter in the browser
- The footer shows `● N visits · counted by AWS Lambda + DynamoDB`.
- DevTools → Network, filter `visits`: one POST on the first load, a GET on reload (one visit per browser session), then a GET about every 60 seconds while the tab is visible.

✓ **Check:** every item above holds.

---

## Rollback

- **Site:** in Amplify, open the last good build and choose **Redeploy this version**. Then revert the bad commit on `main`, so the next push doesn't bring it back.
- **Rewrite rules:** paste the previous `infra/amplify/redirects.json` from git history (`git show <commit>:infra/amplify/redirects.json`).
- **Counter config:** `git revert` the Terraform change, then `terraform plan` and `apply`.
- **Counter, entirely:** `terraform destroy` in `infra/visitor-counter`, remove `REACT_APP_VISITOR_API_URL` in Amplify, and redeploy. The footer line disappears by itself, because the hook hides the counter without the variable.

✓ **Check:** run the smoke test again.

---

## Publish a memo
The rules are in `src/content/CLAUDE.md`. In short:
1. Copy `src/content/memos/_template.md` to `<slug>.md` and write it.
2. While it's a draft, add its entry to the `drafts` array in `src/content/memos/index.js`: `slug`, `title`, `date` (YYYY-MM-DD), `summary`, `draft: true`, and `load: () => import('./<slug>.md?url')`. Never a static import: that ships the draft in the production build.
3. To publish, move the entry to `published` with `draft: false` and a static `file` import. Today's `date` publishes it. A future `date` schedules it: it stays hidden until that day, with no redeploy needed.
4. Merge to `main`. The Memos nav link appears once one memo is live.
