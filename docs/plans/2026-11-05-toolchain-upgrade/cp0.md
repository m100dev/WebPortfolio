# Checkpoint 0: Security brief + plan

## Context
The claude-workflow plan's CP3 (`chore/claude-workflow`, commit `d1f7ce4`) left four open items:
- 77 npm advisories through CRA;
- the `react-router-dom` 6 advisory;
- a CP3b audit gate that can't be enforced on CRA;
- a security-audit run done by hand.

Marc chose full modernization on its own branch, merged first, plus a written brief that tests his hypothesis that the site can be DoS'd. The brief should show that the AI researched and briefed him, and that he made the decisions.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (created from `main` at `9215eda`)
**Prior CP commit:** N/A

## Steps (done in the planning session)
1. Read the counter stack, hook and contact form. Ran `npm audit --omit=dev` with the direct-dependency filter, and `npm outdated`.
2. Checked AWS pricing (API Gateway, Lambda, DynamoDB, CloudWatch, WAF), WAF's supported resources and EmailJS's abuse controls against the official pages.
3. Wrote `brief.md`: verdicts V1–V8, the worst-case cost table, options O1–O4 steelmanned, and blank "Marc's decision" lines.
4. Wrote this plan (`masterplan.md`, `cp1`–`cp4.md`).

## Verification
- Every claim in `brief.md` cites a `path:line` or an official source URL.
- No live requests were made to the API, and no console or infra changes.

## Commit
`added the toolchain upgrade plan and security brief`

## Results
- Verdicts:
  - site DoS: refuted;
  - CRA advisories exploitable live: refuted;
  - counter DoS: confirmed;
  - denial-of-wallet: bounded at about $26 a month;
  - count inflation: confirmed;
  - contact abuse: plausible, partly mitigated by EmailJS.
- **Gate:** Marc fills in the O1–O4 decisions in `brief.md`. CP1 doesn't start until he has.

## Handoff
The brief and plan are committed. CP1 implements Marc's O1–O3 decisions (abuse hardening), and CP2–3 implement O4 (the toolchain).

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: `docs/plans/2026-11-05-toolchain-upgrade/cp1.md`
