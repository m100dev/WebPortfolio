# Build log

What shipped, when, and the one-line reason. Newest first, grouped by release. The detail behind each 2026 release is in [`docs/plans/`](plans/).

## Claude Code workflow (PR #4, merged 2026-11-06)
- **2026-11-05:** adapted my planning skill from MyAutoTab into `plan-refine`: a master plan with steelmanned decisions, plus one detail file per checkpoint that a fresh session can run. I removed its database and multi-tenant rules, which don't apply here.
- **2026-11-05:** added my AWS certs with their dates (2023–2026) and renewal status. Recruiters search for them, and the dates keep the lapse honest.
- **2026-11-05:** put security first in the principles and split `CLAUDE.md` into a lean root plus three folder files. It went from 3.1k to 1.2k tokens per session, and the gotchas still load where they matter.
- **2026-11-05:** wrote `vuln-check`, a small AST scanner with fixture tests, and the `security-audit` skill. A few readable rules aimed at this codebase are easier to trust than a generic linter.
- **2026-11-06:** added pre-commit and pre-push hooks (secrets, vuln-check, build, tests, audit) and a Claude hook that refuses `--no-verify`. A skill is advice the agent can skip; a hook that exits non-zero isn't. Testing found two bypasses (`--no-veri`, a `core.hooksPath` change chained before a commit), and both are fixed. The limits that are left are documented.
- **2026-11-06:** added the `comment-in-my-voice` and `dedupe` skills. Dedupe removed 236 kB of unused images and duplicate CSS, and the measured bundle went down 0.03 kB gzipped, not up.
- **2026-11-06:** installed graphify (a code knowledge graph) and measured it on 3 fixed questions: −0.5% tokens. That's no real saving at about 155 files, which I expected. It's here to show the install, the hook review and an honest measurement. The payoff is on large codebases with agents working across them.
- **2026-11-06:** wrote the README, this log and a reusable runbook, and started tracking the Amplify rewrite rules and the deployer IAM policies (account ID removed).
- **2026-11-06:** published [How I Build with AI Agents](https://www.marcbastien.com/guides/how-i-build-with-ai-agents), a visual version of these results. Every number on it comes from one data file that a test checks against the plan files, so the page, the README and this log can't drift apart. I also stopped draft memos from shipping in the production build. Their bodies and titles had been in the bundle even though the routes 404.

## Toolchain upgrade (PR #3, merged 2026-11-06)
- **2026-11-05:** hardened the visitor counter: per-route throttles, API access logs, 4xx/5xx alarms, a $5 budget alert, and a honeypot on the contact form. The counter is public, so its cost and abuse needed a ceiling.
- **2026-11-05:** a burst test fired the 5xx alarm, and the access logs traced it to Lambda cold starts. I moved the DynamoDB client to init and raised memory to 256 MB.
- **2026-11-05:** replaced Create React App with Vite and Jest with Vitest. CRA was deprecated and carried 78 npm advisories with no fixes coming. The swap alone took the audit from 78 to 2.
- **2026-11-06:** upgraded to React 19 and React Router 7 and dropped unused dependencies. Across the whole upgrade, npm audit went from 78 to 0, builds from 10–26 s to about 2 s, and the JS bundle stayed flat.

## v2 follow-ups (PR #2, merged 2026-11-05)
- **2026-11-04:** upgraded the counter to AWS provider v6 and dropped `default_tags`. Tagging API Gateway needs `apigateway:TagResource`, which my least-privilege deployer policy doesn't grant. Removing the tags beat widening the policy.
- **2026-11-04:** added release dates to memos, so a memo can be scheduled and appear on its day without a redeploy.
- **2026-11-04:** repositioned as a cloud, DevOps and AI engineer, two tracks on one page, and added this site as a project.
- **2026-11-05:** published the first two memos.

## v2: rebuilt with Claude Code (PR #1, merged 2026-11-04)
- **2026-11-04:** a new type system and design tokens, a hero with metrics, a résumé timeline, and fuller project cards.
- **2026-11-04:** added routing, with guides, memos and a 404 page. The two standalone HTML guides became React pages with version history.
- **2026-11-04:** added Ask Marc, a scripted chat in the About section. Every answer comes from copy already on the site, so it can't say anything I haven't.
- **2026-11-04:** added a light/dark toggle, then swapped the light theme to cobalt on cool grey. The first version read like an AI vendor's palette, and the site should look like mine.
- **2026-11-04:** gave the AI autonomy guide its own level colours and an autonomy scale instead of pill chips (squared, with meaning carried by shape, for the same reason), and made it tool-agnostic.
- **2026-11-04:** added a serverless visitor counter (API Gateway, Lambda, DynamoDB) deployed with Terraform.
- **2026-11-04:** added memos with drafts, and dropped Swiper for a grid of endorsements.

## 2026 repositioning
- **2026-07-01:** added a lab and AI guides section linked from the portfolio, then soft-rolled it back the same day.
- **2026-05-20:** repositioned the site for sysadmin and cloud engineer roles, added an AI & Automation section, and switched to a navy and amber palette ([plan](plans/2026-05-20-sysadmin-reposition.md)).

## v1 and updates (2023–2024)
- **2024-09:** refocused the copy on cloud development and linked an online résumé instead of a PDF.
- **2023-10 to 2023-12:** copy updates to About, Experience and Services as my IT skills grew.
- **2023-08 to 2023-09:** v1: hand-built React components on Create React App, a Swiper carousel for testimonials, and an EmailJS contact form.

---

**Provenance.** Every entry matches dated commits in this repo's history, and GitHub records when each branch was pushed. A Wayback Machine snapshot of the live site, taken after deploy, adds a third, independent record.
