# Burst test evidence: visitor counter API

## Status: fix committed (`b9d8ced`), after-fix numbers pending
## Date: 2026-11-05 · redacted log excerpts from my AWS account

This file is the proof behind CP1's findings. I ran a small, read-only burst against my own counter API, then read the access logs, Lambda logs and alarm emails to find out what really happened.

**Redacted:** IP addresses, the AWS account ID, ARNs, email addresses, subscription IDs, the API ID and its URL. Request IDs are shortened.
**Kept:** timestamps, status codes, error messages, latencies and Lambda REPORT figures.

## The test
- 30 concurrent `GET /visits` requests from one machine (`curl` with `xargs -P 30`), counted by status code.
- **GET only, never POST**, so the visit count wasn't inflated.
- Run twice: once before CP1's changes, and once after `terraform apply` (per-route throttle: GET 5 rps, burst 6).

## Results
| Run | 200 | 500 | 503 | 429 |
|-----|-----|-----|-----|-----|
| Before CP1 (shared throttle 5 rps / burst 10) | 0 | 10 | 20 | 0 |
| After CP1 apply (2026-11-05 20:45:21 UTC) | 3 | 10 | 17 | 0 |

**What I expected:** about 6–10 × 200, with the rest throttled by API Gateway (429).
**What I got:** no 429s at all; the failures were server errors.

## The access logs: two different failures
API Gateway access log lines (`/aws/apigateway/portfolio-visitor-counter`), trimmed to one of each kind:

**500: the Lambda ran and timed out**
```json
{"routeKey":"GET /visits","status":"500","responseLatency":"5232","integrationStatus":"200","error":"Internal Server Error","integrationError":"The Lambda function returned the following error: RequestId: bcad25be-… Error: Task timed out after 5.00 seconds."}
```

**503: Lambda refused the call because the account's concurrency was used up**
```json
{"routeKey":"GET /visits","status":"503","responseLatency":"13","integrationStatus":"429","error":"Service Unavailable","integrationError":"The Lambda function is being throttled. Try again later."}
```

In this run, all 10 × 500 had `responseLatency` around 5,200–5,300 ms, and all 17 × 503 came back in 9–14 ms.

## The Lambda logs: where the 5 seconds went
From `/aws/lambda/portfolio-visitor-counter` during the burst. Ten new instances started within about 120 ms:
```
20:45:20.485Z  INIT_START Runtime Version: python:3.12…
20:45:20.497Z  INIT_START Runtime Version: python:3.12…
   … (10 INIT_START lines in total, 20:45:20.485 → 20:45:20.601)
20:45:20.559Z  START RequestId: ea8754e2-… Version: $LATEST
20:45:20.569Z  START RequestId: c70b0d76-… Version: $LATEST
   … (10 START lines in total)
```
Startup itself (`INIT_START` → `START`) took about **90 ms**. The 5 seconds were spent **inside the first request**.

## The real-world case (not part of the test)
A REPORT line from **03:39:40 UTC on 2026-11-05**, hours before either burst test, so this was a single real request:
```
REPORT Duration: 5000.00 ms  Billed Duration: 5087 ms  Memory Size: 128 MB  Max Memory Used: 82 MB  Init Duration: 86.28 ms  Status: timeout
```
One visitor and one cold start, and it still timed out. This is why the fix was worth doing even though it isn't an attack scenario.

## Alerting worked end to end
The burst set off the 5xx alarm, and the email reached me (redacted excerpt):
```
ALARM: "portfolio-visitor-counter-5xx" in US East (N. Virginia)
State Change:            OK -> ALARM
Reason for State Change: Threshold Crossed: 1 datapoint [18.0 (05/11/26 20:41:00)]
                         was greater than or equal to the threshold (5.0).
Timestamp:               Thursday 05 November, 2026 20:46:19 UTC
```
The 4xx alarm correctly stayed OK, because a 30-request burst never reaches its threshold of more than 50 per 5 minutes, sustained for 15 minutes. A 4xx-only alarm, which was the original plan, would have missed this completely.

## Root cause
1. **Slow cold start.** The handler imported boto3 and created the DynamoDB client *inside the first request*. At 128 MB (a small slice of CPU), that alone used up the 5-second request timeout. So the first visitor on a fresh instance timed out.
2. **The account's Lambda concurrency limit is 10.** The 10 stuck instances held every slot for 5 seconds, so Lambda throttled every other request (503).
3. **API Gateway's per-route throttle let a sub-second burst through.** AWS documents throttles as "targets rather than guaranteed request ceilings". In practice, the 10-instance Lambda limit is the cap. It still holds cost and DynamoDB writes down, because Lambda refuses calls before any DynamoDB request is made.

## Fix (`b9d8ced`)
- Create the DynamoDB client while Lambda starts the function up (`infra/visitor-counter/lambda/handler.py`). Startup has its own time allowance, separate from the 5-second request timeout.
- Raise `memory_size` from 128 to 256 MB (`infra/visitor-counter/main.tf`), which doubles the CPU. Compute still fits in the free tier.

## After the fix
_Pending `terraform apply`._
- Cold-start REPORT line: `Duration` ___ ms, `Init Duration` ___ ms
- Optional re-burst (30 GETs, no POST): ___ × 200, ___ × 500, ___ × 503, ___ × 429
