# Security brief: can someone take this site down?

## Status: CODE DONE, MERGE PENDING (2026-11-06) · O1–O3 applied in CP1 (EmailJS dashboard: no changes, see O3); O4 done in CP2–CP3. Measured before/after: `cp4.md` Results
## Written: 2026-11-05 · researched and drafted by Claude Code, decided by Marc

## Why this brief exists
My hypothesis, going in: *"I'm pretty sure someone can exploit the current site and cause denial of service. I just haven't researched the vulnerabilities due to time."*

Two things changed my calculus:
- **The site isn't static-only anymore.** The footer's visitor counter calls an AWS API backend, and anything with a backend can be abused.
- **AI made the research cheap.** Before, "upgrade later" was a time decision. Now an agent can do the research and the grunt work, so the decision comes down to judgment.

I asked the agent to brief me first: verify or refute the hypothesis with evidence, steelman the options, and leave the decisions to me. This file is that brief. The "Marc's decision" lines are mine.

## Method (what the agent actually checked)
- **Read** `infra/visitor-counter/main.tf`, `variables.tf`, `lambda/handler.py`, `src/hooks/useVisitorCount.js` and `src/components/contact/Contact.jsx`.
- **Ran** `npm audit --omit=dev` (with a `--json` filter for direct dependencies), `npm outdated`, and grepped `src/` for every `Link`/`NavLink`/`useNavigate` target.
- **Checked** pricing and capabilities against official pages (links at the bottom). Nothing was run against the live API yet. That waits for my OK in CP1.

## Verdicts
| # | Suspected vector | Verdict | Evidence |
|---|------------------|---------|----------|
| V1 | Take the **site** down (pages stop loading) | **Refuted** at hobby-attacker scale | The site is static files served by Amplify on CloudFront. There's no server of mine to overload. |
| V2 | The **77 npm advisories** make the live site exploitable | **Refuted** for the live site | All 4 criticals (`form-data`, `proxy-addr`, `shell-quote`, `websocket-driver`) and most highs are CRA build or dev-server code. It never ships in `build/`. The one browser package affected is `react-router-dom` 6.30.6 (V5). |
| V3 | Knock out the **visitor counter** | **Confirmed** | The throttle is 5 rps with a burst of 10, **shared by every caller** (`main.tf:155-164`, `variables.tf:23-33`). One script above 5 rps gets every real visitor a 429, and the hook hides the counter on any error (`useVisitorCount.js:36-43`). The site stays up, and the counter goes blank for as long as the flood lasts. |
| V4 | Run up my **AWS bill** (denial-of-wallet) | **Bounded** | The throttle also caps cost. Worst case is a POST flood at 5 rps for a whole month (see the table below). |
| V5 | Open redirect via `react-router-dom` (GHSA-wrjc-x8rr-h8h6) | **Not reachable today** | Every link target is a constant or a content slug (`AskMarc.jsx:27`, `Nav.jsx:28,89`, `Guides.jsx:28`, `Memos.jsx:27`), and there's no `useNavigate`. The fix is v7. |
| V6 | **Inflate the count** | **Confirmed** (integrity, not availability) | CORS only binds browsers, so `curl -X POST` in a loop adds up to 5 per second. |
| V7 | **Contact form** abuse (spam the inbox, use up the EmailJS quota) | **Plausible, partly mitigated by EmailJS** | The public key is in the browser by design, and `Contact.jsx:44-62` has no honeypot or CAPTCHA. EmailJS says it applies IP-based rate limits and offers an origin allowlist and reCAPTCHA. The developer has to turn reCAPTCHA on. Plan gating to confirm in the dashboard. |
| V8 | Abuse "Ask Marc" | **Refuted** | Canned answers, no backend. |

**[DISCOVERED] in CP1, corrections to V3/V4:**
- **Live burst test (2026-11-05, 30 concurrent GETs, before CP1's changes):** 10 × 500 and 20 × 503, with no 200s and no 429s. A single GET right after returned 200.
  - So under a burst, even the admitted requests failed, which is worse than "real visitors get a 429".
  - **Cause, confirmed from Marc's log export after the CP1 apply:** cold-start Lambda invocations timed out at 5 s (`handler.py:19-26` imports boto3 and builds the client inside the first request, at 128 MB), and those stuck instances held all 10 of the account's concurrent executions, so Lambda throttled the rest. API Gateway's route throttle returned no 429s. A fix to the handler's cold start is proposed in `cp1.md`.
  - CP1 added a 5xx alarm and error fields in the access logs to find out.
- **AWS's throttling page doesn't say** whether `default_route_settings` is one bucket shared by every route or a default applied to each route. If it's per route, today's worst case was 5 rps per route, not 5 in total. CP1 overrides both routes, so that ambiguity no longer matters.
- **The worst case is recomputed** in `infra/visitor-counter/README.md` at ≈ $32/month: POST 2 + GET 5 rps, now counting the reads and the access logs.

## Worst-case monthly cost of a sustained counter flood (V4)
5 rps × 2,592,000 s = **12.96M requests a month**, on-demand prices in us-east-1, ignoring the free tier:

| Service | Rate (official page) | Worst case |
|---------|----------------------|------------|
| API Gateway HTTP API | $1.00 per million | $12.96 |
| Lambda requests | $0.20 per million | $2.59 |
| Lambda compute | 128 MB, ~20 ms → about 32k GB-s, under the 400k GB-s free tier | ~$0 |
| DynamoDB writes (all POST) | $0.625 per million WRU | $8.10 |
| CloudWatch Logs | ~350 B per invocation → ~4.5 GB at $0.50 per GB | ~$2.27 |
| **Total** | | **≈ $26/month** |

Two takeaways: it's annoying, not ruinous, and with no alarm I'd only find out from the bill.

## Options (steelmanned)
### O1: Per-IP limiting for the counter
- **Recommended:** keep the shared throttle, but split it per route (POST 2/5, GET 5/10, so a POST flood can't starve reads), add stage access logs, a $5 budget alert and a CloudWatch alarm on 429s.
- **Over:** CloudFront + AWS WAF with a rate-based rule in front of the API.
- **Because:**
  - WAF can't attach to an HTTP API (REST is supported, HTTP isn't), so per-IP limits mean adding CloudFront in front of the API.
  - That's at least $6 a month ($5 web ACL plus $1 per rule) plus $0.60 per million requests, every month, to protect a vanity counter whose worst-case abuse is about $26.
  - Switching to a REST API to get WAF raises the per-request price to $3.50 per million, which makes a flood about 3.5× more expensive.
- **Trade-off:** a determined or distributed attacker can still blank the counter. The alarm makes it visible, and the site is never affected.
- **Marc's decision:** Keep the shared throttle, split and I'll add the alarm. if the alarm triggers I can take immediate manual action at that time. Cheap, quick to implement.

### O2: Count inflation
- **Recommended:** accept it and document it as a vanity metric.
- **Over:** dedup by IP hash plus day in DynamoDB with a TTL.
- **Because:** dedup doubles the writes and keeps IP-derived data, a privacy cost I'd have to disclose, for a number with no business meaning.
- **Trade-off:** the count isn't trustworthy under attack.
- **Marc's decision:** Accept the count inflation. This implementation is for demonstration of cloud tool use, making use of an api, and deploying resources via Terraform. 

### O3: Contact form
- **Recommended:**
  - a hidden honeypot field that the code checks before calling EmailJS (free, catches naive bots);
  - in the EmailJS dashboard: origin allowlist, rate limit, and reCAPTCHA if the plan allows it.
- **Over:** a backend relay (Lambda + SES) with my own rate limit.
- **Because:** a relay is a second API to secure and pay for, just to replace a vendor that already rate-limits by IP.
- **Trade-off:** a determined bot that skips the honeypot still depends on EmailJS's limits.
- **Marc's decision:** Yes, we can add the honeypot, but also I'm able to easily see spam come into my inbox from that contact form. I can quickly take action if needed. I'll check for the additional EmailJS features and any potential costs.
- **Marc's follow-up (2026-11-05, after checking the dashboard):** a judgement call to keep the form frictionless:
  - **Origin allowlist: skipped.** It needs a paid EmailJS subscription. It would only stop other sites from using the key in browsers, and scripts can fake the origin anyway.
  - **reCAPTCHA: skipped, even though it's free.** The extra step could put off a recruiter trying to reach me, and that costs more than the spam it would stop. It's too much for a portfolio site.
  - **What protects the form:** the honeypot, EmailJS's own IP-based rate limit, and me watching the inbox. If spam gets past the honeypot, I'll revisit reCAPTCHA v2 (checkbox, loaded when the form is focused). The code has to deploy before the dashboard toggle is turned on, or every message fails.

### O4: Leave CRA now, even though V2 is refuted
- **Recommended:** migrate (Vite + Vitest, then the runtime majors), on its own branch, merged before the Claude workflow branch.
- **Over:** stay on CRA and accept about 75 advisories as build-time noise.
- **Because:**
  - CRA was deprecated in Feb 2025, so no fixes are coming;
  - "77 vulnerabilities" on a public repo reads badly even when it's harmless;
  - the planned pre-commit audit gate can't work while CRA's noise is there;
  - the AI-assisted migration costs roughly one session per checkpoint, not a weekend.
- **Trade-off:** a production build change with real regression risk, mitigated by a parity-only CP, a headless browser route check, and an isolated PR that can be reverted on its own.
- **Marc's decision:** 100% agree with the recommended. Vite is way faster and CRA is deprecated. I also perform manual testing anyway so I'll catch any issues and resolve them before pushing to prod.
- **Outcome (CP4):** `npm audit --omit=dev` went from 78 advisories to 0. The before/after numbers and the security review are in [`cp4.md` Results](cp4.md#results).

## Sources
- AWS WAF protected resource types: https://docs.aws.amazon.com/waf/latest/developerguide/waf-chapter.html
- API Gateway pricing: https://aws.amazon.com/api-gateway/pricing/
- Lambda pricing: https://aws.amazon.com/lambda/pricing/
- DynamoDB on-demand pricing: https://aws.amazon.com/dynamodb/pricing/on-demand/
- CloudWatch pricing: https://aws.amazon.com/cloudwatch/pricing/
- AWS WAF pricing: https://aws.amazon.com/waf/pricing/
- EmailJS spam FAQ: https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/
- react-router advisory: https://github.com/advisories/GHSA-wrjc-x8rr-h8h6
