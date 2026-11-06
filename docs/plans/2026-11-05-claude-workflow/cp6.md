# Checkpoint 6: README, runbook, infra files, build log, skills table

## Context
CP1–5 produced the site changes, a lean `CLAUDE.md` with before/after token numbers, the security tooling and hooks, the quality skills with a measured size delta, and graphify with measured token numbers. This CP turns all of that into what a reviewer reads first:
- a real README (currently the short factual one from toolchain CP3d);
- a reusable runbook (from `LAUNCH.md`);
- the versioned infra config;
- a dated build log;
- a skills table that shows judgment.

After this, CP7 builds the visual results guide the README links to. Marc makes the repo public after CP7, not here.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added graphify and measured its token savings on this repo` (or the last CP4 commit if CP5 ran first)

## Prerequisites
- [ ] The CP2, CP4 and CP5 `## Results` sections are filled in.
- [ ] `npm run test:once` and `npm run test:security` pass.

## Decisions
### D1: Commit the redirects file and the deployer policy
- **Chosen:** track both, with the account ID replaced by `<ACCOUNT_ID>`.
- **Over:** keeping them ignored.
- **Because:** they're config-as-code with no secrets, and a least-privilege policy is a strong cloud signal.
- **Trade-off:** slightly more surface area. The account ID never appears.

### D2: Honest authorship framing
- **Chosen:** "I design each skill (what it's for, its rules, when not to use it) and write it with Claude Code."
- **Over:** "skills I wrote".
- **Because:** the whole site's story is AI leverage plus my review. Overclaiming would contradict it.
- **Trade-off:** none.

## Steps
1. **`README.md`**, first person and professional, with these sections:
   - **Pitch:** one paragraph with the site link. Cloud, DevOps & AI engineer; the goal is AI product engineering.
   - **The story**, with dates from `git log --date=short`:
     - Aug 2023: v1, hand-built CRA components, Swiper and EmailJS;
     - Sep 2024: cloud developer focus;
     - May 2026: sysadmin/cloud reposition (link `docs/plans/2026-05-20-sysadmin-reposition.md`);
     - Nov 2026: v2, rebuilt with Claude Code.
   - **How I build:** spec → checkpointed plan → tests → hooks → my review. AI for speed, never at the cost of security or review. Links to `docs/plans/`.
   - **Architecture:** an ASCII or Mermaid diagram of Route 53 (domain registration and DNS) → Amplify → React SPA → API Gateway → Lambda → DynamoDB, with the counter deployed by Terraform.
   - **Stack table:** run locally, repo layout.
   - **"Why this much tooling on a portfolio site?"** A short section placed right before the skills table, so no reviewer reads it as over-engineering. Marc's framing:
     - A static site doesn't need pre-commit hooks, checkpointed plans or a security audit skill. I added them on purpose.
     - They're a small slice of how I use Claude Code on MyAutoTab, the SaaS I'm building to production standards, where they *are* load-bearing.
     - This repo is public and MyAutoTab isn't, so this is where I can show the workflow.
     - Tone: one confident paragraph, not an apology.
     - **What I'd add serving clients** (from `cp3b.md` D4): say plainly that local hooks can be bypassed, so in production the gate is server-side: protected `main` with no admin bypass, CI as the required check, `CODEOWNERS` review on the guard rails, secret-scanning push protection, deploy only from `main`, and the agent sandboxed with managed hooks. Keep it to a short list; it shows I know where this demo stops.
     - Say "built to production standards", not "production SaaS", because the site's MyAutoTab card says it's in staging with test users. The two claims have to agree.
   - **Skills table:** Skill | Source | Why | Instead of. The same content as `.claude/skills/README.md`, including the "considered, not used" rows.
   - **Numbers:** only 2–3 headlines (`CLAUDE.md` 3.1k → 1.2k tokens; hooks block every bypass tried; graphify measured at −0.5%), then "See the visual version: https://www.marcbastien.com/guides/how-i-build-with-ai-agents". CP7 builds that page and holds the full numbers in one `data.js`, so don't repeat the tables here.
     - graphify's −0.5% gets the framing from `cp5.md` "Why it's here anyway". I wouldn't run a code graph on a small site. It's here to show the install, the hook review and the measurement. The savings come on large codebases with agents. Don't put a number on that unless it's measured.
   - **Copyright:** © Marc Bastien, code all rights reserved; guides CC BY 4.0.
2. **`.claude/skills/README.md`:** opens with the same one-line framing (intentional, a demo of the MyAutoTab workflow, not something a static site needs), then the skills table with one line per skill.
   - **Mine, new:** `security-audit`, `vuln-check`, `pre-commit-checklist`, `comment-in-my-voice`, `dedupe`.
   - **Mine, adapted:** `plan-refine`.
   - **Third-party, measured:** graphify. A demo at this size (−0.5%, measured). It's worth it on large agent-driven codebases.
   - **Built-in:** `/simplify`, `/code-review`, `/security-review`.
   - **Considered, not used:**
     - a DB security audit skill: this site has no database;
     - generic commenting skills: they don't match my voice;
     - a third-party vuln linter: the readable script wins here.
3. **Runbook:** `git mv LAUNCH.md docs/runbook.md` and rewrite it as reusable procedures:
   - deploy the site (including the redirects-first rule);
   - deploy or update the counter;
   - smoke test;
   - rollback;
   - drop the completed checkboxes and the one-time warnings.
4. **Infra files:**
   - `git mv`-equivalent: move the untracked `amplify-redirects.json` to `infra/amplify/redirects.json`, now tracked;
   - copy the scratchpad deployer policy into `infra/visitor-counter/deployer-policy.json`, replacing the account ID with `<ACCOUNT_ID>`;
   - update the root `CLAUDE.md` Amplify line, which says "untracked", and the runbook paths.
5. **`docs/build-log.md`:** dated entries grouped by release.
   - Each entry: date, what shipped, and the one-line why or decision. Include:
     - the Ask Marc scripted chat (answers only from site copy);
     - the autonomy scale instead of pills;
     - the cobalt light theme;
     - scheduled memos;
     - the provider v6 upgrade and the TagResource fix;
     - the dual-track positioning;
     - this workflow (one line on adapting plan-refine).
   - Leave out prompts and full specs.
   - Footer: provenance. Dated commits, GitHub push timestamps, a Wayback snapshot after deploy.

## Verification
- Run `git grep --untracked -nE '[0-9]{12}'` and check every hit. Expected: no AWS account ID (the pattern is generic, so the plan never has to contain the ID).
- `gitleaks detect --config .gitleaks.toml` is clean. Run the `security-audit` skill one final time.
- `npm run test:once`, `npm run test:security` and `npm run build` all pass.
- Marc reviews the README, runbook and build log copy before commit.

## Commit
Commit each change separately:
- `rewrote the readme with the story and how i build`
- `turned the launch checklist into a runbook and tracked the amplify and iam config`
- `added a build log`

## Results (2026-11-06)
- **Prerequisites:** `200bdf6` at HEAD; 35/35 Vitest, 32/32 security, build clean; CP2/4/5 Results filled.
- **Commits:** `f057f18` runbook + infra config, `2b61662` README + skills README, `179b0f6` build log. Each passed the pre-commit hook. Marc reviewed the copy and confirmed both policy files.
- **Deviations from the steps:**
  - The deployer IAM is **two** managed policies, so both are tracked: `deployer-policy.json` (the core stack, rebuilt from the 2026-11-04 scratchpad) and `deployer-policy-alerting.json` (what toolchain CP1 attached). The infra README's table was replaced by pointers to the files, and the three wildcard resources AWS forces are named with their reasons.
  - Commit order: the runbook commit went first, because `git mv` had already staged the rename.
  - The README headline doesn't say "blocks every bypass". It says every bypass in the test matrix was refused, two found in testing were fixed, and the remaining limits are documented (links to `cp3b.md` D4).
  - The runbook recounts the stack at 17 resources (LAUNCH said 11, before CP1's alerting), and notes that Amplify builds on Node 24 while local is 26.
- **[DISCOVERED] Account ID in history.** This file's own step 4 and its verification line contained the AWS account ID, committed in `0935855` (plus `2c35a9f` on `backup/claude-workflow-pre-rebase`) and carried by 34 commits. Neither branch had been pushed. At Marc's request, both branches were rewritten (`git filter-branch --index-filter`, changing only those two lines), the reflog expired and old objects pruned. A scan of all objects in `.git` finds 0 matches. Every hash on this branch changed (e.g. `200bdf6` → `5df6fc0`, `a3969b8` → `14573d2`); `cp4.md`'s two citations were updated. The ID remains only in the git-ignored tfstate.
- **Verification:**
  - account-ID grep (tracked + untracked) clean;
  - gitleaks clean on every new file and the full history;
  - `security-audit`: all PASS except the EmailJS NOTE (public by design) and the deployer wildcards, which are now documented;
  - `npm run test:once`, `npm run test:security`, `npm run build` and the Lambda tests (7/7) pass.
- **For CP7:** the build log's "in review" heading needs the PR number and merge date; use npm audit 78 → 0.

## Handoff
The README links to the CP7 guide, which doesn't exist yet. Don't push or merge until CP7 is done. The repo going public, and Marc's other launch steps, are now in CP7's handoff.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp7.md` (visual results guide, same branch)
