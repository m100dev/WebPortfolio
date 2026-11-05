# Checkpoint 1: Abuse hardening (counter API + contact form)

## Context
CP0 wrote `brief.md`. It confirmed that one caller can blank the visitor counter: the throttle is 5 rps with a burst of 10, shared by everyone (`infra/visitor-counter/main.tf:155-164`). It found the cost of abuse capped at about $26 a month, with no alerting, and that the contact form (`src/components/contact/Contact.jsx:44-62`) has no bot filter. Marc's decisions in `brief.md` O1–O3 set the scope here. **If a decision line is blank, STOP and ask.**

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `added the toolchain upgrade plan and security brief`

## Prerequisites
- [ ] `git branch --show-current` shows `chore/toolchain-upgrade`, and the CP0 commit is in `git log --oneline -3`.
- [ ] `brief.md` O1–O3 "Marc's decision" lines are filled in.
- [ ] `npm test -- --watchAll=false` passes, and `cd infra/visitor-counter/lambda && python -m unittest` passes.
- [ ] `terraform -version` works, and `terraform validate` passes in `infra/visitor-counter`.

## Decisions
### D1: Separate throttle buckets per route
- **Chosen:** `route_settings` on the stage: `POST /visits` 2 rps / burst 5, `GET /visits` 5 / 10. Keep `default_route_settings` as a ceiling.
- **Over:** raising the shared limit.
- **Because:** a POST flood (the one that costs DynamoDB writes and inflates the count) can't starve the reads real visitors make, and the worst-case writes drop by 60%.
- **Trade-off:** the counter can still be blanked per route, just not across routes.

### D2: Alerting
- **Chosen:**
  - an `aws_budgets_budget` (monthly cost, $5, email to Marc at 80% actual and 100% forecast);
  - an `aws_cloudwatch_metric_alarm` on the API's `4xx` (throttles show up as 429s) above a threshold for 15 minutes, notifying through SNS email.
- **Over:** checking the bill by hand.
- **Because:** abuse is bounded, but right now it's invisible.
- **Trade-off:** the deployer IAM policy may need `budgets:*Budget*`, `sns:*Topic*`/`Subscribe` and `cloudwatch:PutMetricAlarm`. Name the exact actions, least privilege. Marc updates the policy, which isn't tracked yet.
- The alert email address goes in a variable with no default, set in `terraform.tfvars`. Never commit it.

### D3: Contact honeypot
- **Chosen:** a visually hidden, `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"` text input (e.g. `company`). If it's filled in, pretend success and skip `emailjs.sendForm`.
- **Over:** reCAPTCHA in code.
- **Because:** it's free, adds no third-party script, and keeps accessibility. reCAPTCHA is an EmailJS dashboard setting if Marc wants it (brief O3).
- **Trade-off:** it only catches naive bots.

## Steps
1. **`infra/visitor-counter/variables.tf`:** add `post_rate_limit` / `post_burst_limit`, `get_rate_limit` / `get_burst_limit`, `budget_limit_usd` (default 5), `alert_email` (no default), and `access_log_retention_days` (14).
2. **`main.tf`:**
   - stage `route_settings` for both route keys;
   - an `aws_cloudwatch_log_group` for access logs, plus `access_log_settings` in JSON format with `requestId`, `ip`, `routeKey`, `status` and `responseLatency`;
   - an SNS topic and email subscription, the 4xx alarm, and the budget.
   - Keep the comment style used in the existing sections.
3. **`outputs.tf`:** add the access log group name.
4. **Docs:**
   - `infra/visitor-counter/README.md`: add the abuse model (link to `brief.md`), new costs and limits, and how to read the access logs.
   - `infra/visitor-counter/CLAUDE.md`: per-route limits, and the alert email lives only in tfvars.
5. **`src/components/contact/Contact.jsx`** and `contact.css`: add the honeypot (D3), plus a test in a new `Contact.test.jsx`: a filled honeypot means `sendForm` is never called (mock `@emailjs/browser`).
6. **Live burst test (needs Marc's explicit OK):**
   - get the URL with `terraform output -raw api_url` (it's a public value, but don't print state);
   - send 30 concurrent `GET /visits` and count the status codes. Expect about 10 × 200 (burst) and the rest 429;
   - once `apply` is done, repeat for GET at the new limits;
   - **never POST** in the test, since that inflates the count.
7. **Deployer IAM:** write the exact extra actions into the README. Marc applies them.

## Verification
- `terraform fmt -check && terraform validate` pass. `terraform plan` shows only additions plus the stage update, and no replacements. Paste the summary line.
- `python -m unittest` passes, and the handler is unchanged.
- `npm test -- --watchAll=false` passes, including the new honeypot test. `CI=true npm run build` passes.
- vuln-check isn't on this branch yet; it arrives with the rebase. Grep the new code for `dangerouslySetInnerHTML` / `eval` by hand instead.
- Burst test results (if approved): the counts before, and after apply.
- Security review: this CP touches infra and user input. Walk through the security-audit checklist from `brief.md`'s Method by hand, and record the IAM actions added.

## Results (2026-11-05)
- **Context:** `/context` wasn't run in this session (it's a user command), so this is not measured.
- **Prerequisites:** all passed. Branch and CP0 commit OK; O1–O4 filled (Marc clarified O1 as "shared throttle, split, and alarm"); 14 Jest + 7 Lambda tests; Terraform 1.12.2 validate.
- **Terraform:** `fmt -check` and `validate` pass. `plan` (with `-var alert_email=placeholder@example.invalid`) gives `Plan: 6 to add, 1 to change, 0 to destroy.` The change is the stage, in place.
- **Tests:**
  - `python -m unittest`: 7 OK, and `handler.py` is unchanged.
  - `npm test -- --watchAll=false`: 17/17, including 3 new in `Contact.test.jsx` (filled honeypot never calls `sendForm`; empty honeypot calls it once; the field is hidden from assistive tech).
  - `CI=true npm run build`: passes.
- **Hand security grep:** no `dangerouslySetInnerHTML`, `eval` or `innerHTML` in the new code. The only email in the diff is the `you@example.com` placeholder.
- **Burst test, before** (Marc approved GET-only; 31 GETs sent in total, no POST): 30 concurrent → **10 × 500, 20 × 503, no 200s and no 429s**. One GET after that → 200.
  - **[DISCOVERED]** step 6's expectation of "~10 × 200, rest 429" was wrong. The cause was confirmed later (see the after-apply entry). The deployer user can't read logs or metrics (AccessDenied on `logs:FilterLogEvents`, `cloudwatch:GetMetricStatistics`, `lambda:GetAccountSettings`).
- **Burst test, after apply** (2026-11-05 20:45:21 UTC, Marc approved, 30 concurrent GETs, no POST, GET burst 6): **3 × 200, 10 × 500, 17 × 503, still no 429s.** The extra requests are failing with server errors, not being throttled. **Cause (from Marc's access and Lambda log export):** the 10 × 500 were cold-start invocations that hit `Task timed out after 5.00 seconds` (~5,200 ms; `INIT_START` → `START` was only ~90 ms, so the time went into the first request: `handler.py:19-26` imports boto3 and builds the client lazily at 128 MB). The 17 × 503 were `integrationStatus` 429 "The Lambda function is being throttled", because those 10 stuck instances held all 10 concurrent executions. API Gateway's route throttle (burst 6) rejected nothing: 27 of 30 requests reached Lambda. **[DISCOVERED]** This is a real cold-start bug, not only an abuse issue. A REPORT line at 03:39:40 UTC (outside both tests) showed the same timeout on a single real visit (`Init Duration` 86 ms, then `Duration` 5000 ms timeout, 82 of 128 MB used). **Fixed:** the boto3 client is now built at init, only inside Lambda (`AWS_LAMBDA_FUNCTION_NAME`), so the tests stay boto3-free; `memory_size` 128 → 256; the handler is commented in Marc's voice. Lambda tests: 7 OK. `plan`: `0 to add, 1 to change, 0 to destroy` (the function's memory and code). **Applied and verified (21:29:01 UTC):** cold start `Init Duration` 485 ms, `Duration` 157 ms (was a 5,000 ms timeout), then 8 ms warm. **Re-burst skipped by Marc (2026-11-05):** the cold-start REPORT line already proves the fix, and the remaining 503s are the expected cap from the 10-instance Lambda limit. **The alerting works end to end:** `portfolio-visitor-counter-5xx` went OK → ALARM at 20:46:19 UTC on a datapoint of 18 (the 20:41 period), and the email reached Marc. So AWS did return the 5xx, ruling out a sandbox or proxy artifact on the client side. The 4xx alarm stayed OK, as expected for 30 requests. The 18 AWS-counted errors vs 27 client-side is not investigated further; the logs account for all 27.
- **[DISCOVERED] D2 widened:** a `5xx` alarm was added next to the `4xx` one. The burst produced no 4xx, so a 4xx-only alarm would have missed it.
  - Access logs also capture `$context.error.message`, `integrationErrorMessage` and `integrationStatus`.
  - Thresholds are variables: 4xx > 50 per 5 min for 15 min; 5xx ≥ 5 per 5 min.
- **Honeypot:** the field is named `website`, not `company`. Browser autofill can fill organisation fields even with `autocomplete="off"`, which would silently drop a real visitor's message. The input is in a wrapper with `aria-hidden`, positioned off-screen (`contact__hp`).
- **[DISCOVERED] `infra/visitor-counter/CLAUDE.md`** exists only on `chore/claude-workflow`. Creating it here would conflict at rebase, so its facts went into the README, and cp4 "After merge" step 4 carries the update.
- **Security walkthrough:**
  - the throttle is still a shared cap;
  - CORS, the Lambda IAM role and the handler are unchanged;
  - the alert email is only a no-default, `sensitive` variable (`terraform.tfvars` is git-ignored);
  - the SNS topic is unencrypted on purpose (alarms can't publish to the AWS-managed key; the messages hold no data);
  - access logs hold IPs for 14 days, which the README notes;
  - the budget covers the whole account.
  - The deployer IAM actions are listed in the README's "Deployer IAM" table (logs delivery, SNS, CloudWatch alarms, budgets), with no read access to logs or metrics.

### Marc's gate (outward-facing, not done by the agent)
1. ~~Add the README's "Deployer IAM" actions to the deployer policy.~~ **Done 2026-11-05** (separate managed policy `portfolio-visitor-counter-alerting`).
2. ~~Create `terraform.tfvars`, plan and apply.~~ **Applied 2026-11-05.** A follow-up `terraform plan -detailed-exitcode` reported "No changes" (exit 0), so the tfvars bursts (6/3) and the budget ($11) are live. Still to do: click the SNS confirmation email if you haven't.
3. ~~Check the account's Lambda concurrency limit.~~ **Checked 2026-11-05: unreserved account concurrency is 10** (the new-account default). Marc's decisions:
   - Set `get_burst_limit = 6` and `post_burst_limit = 3` in `terraform.tfvars` (9 at once, under 10). The defaults in `variables.tf` stay 10/5 for a normal account.
   - The other domain runs no Lambda in us-east-1, so a counter flood can't starve it.
   - **Declined:** a Service Quotas increase. Without it, no `reserved_concurrent_executions` (AWS keeps at least 10 unreserved), so the tfvars bursts are the only guard. Don't reopen this unless the access logs show the limit causing real failures.
   - **Budget:** `budget_limit_usd = 11` in tfvars, matching Marc's existing account budget (the account also hosts another domain, so $5 would alert every month).
   - The limit of 10 is a likely contributor to the burst test's 500/503s, not a confirmed cause. Confirm it with the access logs after the apply.
4. OK the "after" burst test (30 GETs, no POST) in a later session, and read the access logs.
5. ~~EmailJS dashboard (brief O3).~~ **Decided 2026-11-05:** no origin allowlist (it needs a paid plan) and no reCAPTCHA (a recruiter's message matters more than stopping spam). The reasoning is in brief O3 "Marc's follow-up". No dashboard changes.
6. **Passed 2026-11-05 (Chrome address autofill, on `localhost:3000` on this branch):** after autofill, `website` was `''`. Chrome only offered autofill from the email field and left the name empty (no `autocomplete` hint). **If `autoComplete="name"`/`"email"` are ever added, re-run this check.** Password-manager identity fill wasn't tested.
   - Original item: check autofill on the honeypot.
   - How: save an address at `chrome://settings/addresses`, then click "Your Full Name" and pick it from the dropdown. In DevTools, `document.querySelector('input[name="website"]').value` must be `''`.
   - Fill the contact form with Chrome autofill, then with your password manager's identity fill (and Safari AutoFill if you have it). Submit, and confirm the email actually arrives.
   - The tests only check attributes, so they can't catch this. If autofill fills the hidden `website` field, a real message gets a success dialog and is silently dropped.
   - If that happens, rename `HONEYPOT` in `Contact.jsx` to a name that doesn't map to any profile field.

Redacted proof for the burst tests, alarm and fix: `burst-test-evidence.md` (in this folder).

## Commit
`added per-route throttles, access logs, cost alerts and a contact honeypot`

## Key source files
- `infra/visitor-counter/main.tf` (lines 125-172): the API, routes, stage and throttle
- `infra/visitor-counter/variables.tf` (lines 23-33): the current throttle variables
- `src/components/contact/Contact.jsx` (lines 44-62): `sendEmail`
- `src/hooks/useVisitorCount.js` (lines 36-43): fails quietly on any error, so a 429 just hides the counter

## Handoff
The counter has separate read and write limits, access logs and cost and abuse alerts (once Marc applies them). The form filters naive bots. CP2 starts the CRA → Vite parity swap.

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: `docs/plans/2026-11-05-toolchain-upgrade/cp2.md`
