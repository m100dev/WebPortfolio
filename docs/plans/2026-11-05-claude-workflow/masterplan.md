# Claude Code workflow: skills, guardrails, lean context, build log

## Status: IN PROGRESS
## Created: 2026-11-05

## Problem summary
The repo is going public, and it should show *how* I build with an AI coding agent, not just the finished site. That means project skills I designed for specific jobs, hooks that actually enforce security and tests before every commit, a lean always-loaded `CLAUDE.md`, measured (not claimed) token savings, and a dated build log. The README is still the Create React App boilerplate.

**This is intentional overkill.** A static site doesn't need hooks, checkpointed plans or security skills. They're a small, public slice of the workflow I use on MyAutoTab, the SaaS I'm building to production standards, where they're load-bearing. The README, `.claude/skills/README.md` and the CP7 guide all say so, so reviewers read it as a demonstration, not over-engineering.

## Branch strategy
Decision: SINGLE-BRANCH
Branch: `chore/claude-workflow`, created from `main` after `portfolio-redesign` merges
Rationale: every CP builds one tooling-and-docs initiative. The redesign merges first because it's the biggest visible fix and shouldn't wait on tooling.
Fallback: if the redesign hasn't merged yet, branch from `portfolio-redesign`.

## Codebase findings
- Content is hardcoded `data` arrays mapped in each component (`src/components/<name>/<Name>.jsx`). Ask Marc answers must come from site copy.
- The cert list already supports a `status` that renders with `about__cert--pending` (`src/components/about/About.jsx:14-20`).
- `@babel/parser` and `@babel/traverse` are in `node_modules` (transitively, via react-scripts). `gitleaks` and `uv` are installed locally.
- CRA's Jest only runs tests under `src/`, so tooling tests use Node's built-in `node:test` under `tools/`.
- The current `CLAUDE.md` is about 3.1k tokens and is loaded every session.
- [DISCOVERED] `amplify-redirects.json` and the IAM deployer policy aren't tracked. Both are config worth versioning (sanitized).

## Decision log
### D1: Hooks enforce, skills judge
- **Chosen:** deterministic checks (secrets, vuln-check, lint, tests) run in a Claude `PreToolUse` hook and a git `pre-commit` hook. The `pre-commit-checklist` skill covers the judgment calls.
- **Over:** a skill alone.
- **Because:** a skill is instructions the agent can skip. A hook that exits non-zero can't be skipped.
- **Trade-off:** commits get slower (the slow full build moves to `pre-push`).

### D2: Own vuln-check script over a third-party linter
- **Chosen:** a small AST script (`tools/vuln-check/`) with a few rules I can read, tested against fixtures (3 vulnerable, 1 clean).
- **Over:** `eslint-plugin-security` or a SaaS scanner.
- **Because:** a few readable rules aimed at this codebase's real risks (`dangerouslySetInnerHTML`, `eval`, `innerHTML`, `javascript:` URLs, `target=_blank` without `rel`, key-shaped strings) are easier to trust and explain.
- **Trade-off:** narrower coverage. `security-audit` and `npm audit` cover the rest.

### D3: Nested CLAUDE.md files over one long root file
- **Chosen:** a root file of about 25 lines (principles, commands, hard rules) plus `src/content/`, `src/components/` and `infra/visitor-counter/` files that load only when work happens there.
- **Over:** deleting detail to get lean.
- **Because:** the gotchas are load-bearing (stylesheet order, Amplify allowlist, the `alv4` key), but they don't need to be in every session.
- **Trade-off:** rules are spread across four files.

### D4: Measure graphify before claiming savings
- **Chosen:** install it and compare 3 fixed questions with and without the graph, then publish the real numbers.
- **Over:** quoting third-party figures.
- **Because:** the official README has no open-source token number, and gains scale with repo size. This repo has about 100 files.
- **Trade-off:** the number may be small. A small honest number is still the stronger signal.

### D5: Publish the adapted plan-refine, not the original
- **Chosen:** commit only the adapted skill, with an "Adapted from" note.
- **Over:** publishing a before/after diff.
- **Because:** MyAutoTab is private. The original reveals its internals and can't be verified anyway.
- **Trade-off:** reviewers see the result, not the full adaptation.

### D6: Show expired AWS certs with date ranges
- **Chosen:** `AWS Solutions Architect – Associate (2023–2026) · renewal planned` and `AWS Cloud Practitioner (2023–2026) · expired`.
- **Over:** leaving them off, or listing them like active certs.
- **Because:** recruiters keyword-match on them, and the skills are real. Clearance roles check for active status, so the dates keep it honest.
- **Trade-off:** shows a lapse. Years confirmed: both earned in 2023, expired June 2026.

## Checkpoint overview
| CP | Title | Depends on | Gate | Status |
|----|-------|------------|------|--------|
| 0 | Adapt plan-refine, write this plan | -- | Marc reviews the plan | [x] |
| 1 | AWS certs, archived sysadmin plan, Terraform tag | 0 | Marc checks the badges | [ ] |
| 2 | Principles + CLAUDE.md split | 1 | before/after token numbers recorded | [ ] |
| 3 | vuln-check tool + tests + skill; security-audit skill | 2 | 4/4 security tests, gitleaks clean | [ ] |
| 3b | Pre-commit checker, hooks, pre-commit-checklist skill | 3 | bad change blocked, clean one commits | [ ] |
| 4 | comment-in-my-voice + demo; dedupe + run | 3b | Marc approves comments and dedupe fixes | [ ] |
| 5 | graphify install + measurement | 3b | Marc reviews the hooks it adds | [ ] |
| 6 | README, runbook, infra files, build log, skills table | 2, 4, 5 | Marc reviews copy, then makes the repo public | [ ] |
| 7 | Backlog: "How I build with an AI agent" site guide | 6 + public repo | -- | [ ] |

CP4 and CP5 are independent and can run in either order.

## Session protocol
- One CP per session. Run /clear between checkpoints.
- Before CP N+1: verify CP N's commit exists (`git log --oneline -5`).
- This file is shared state: mark `[x]` here before /clear.
- Detail files: `cpN.md` in this folder.
- Outward-facing steps (push, merge, `terraform apply`, Amplify console, repo visibility) are Marc's, never the agent's.

## Status tracker
- [x] CP0 — adapted plan-refine, wrote this plan
- [ ] CP1 — AWS certs, archived sysadmin plan, Terraform tag
- [ ] CP2 — principles + CLAUDE.md split
- [ ] CP3 — vuln-check + security-audit
- [ ] CP3b — pre-commit enforcement
- [ ] CP4 — comment-in-my-voice + dedupe
- [ ] CP5 — graphify
- [ ] CP6 — README, runbook, infra files, build log
- [ ] CP7 — backlog: workflow guide
