# Checkpoint 6: README, runbook, infra files, build log, skills table

## Context
CP1–5 produced the site changes, a lean `CLAUDE.md` with before/after token numbers, the security tooling and hooks, the quality skills with a measured size delta, and graphify with measured token numbers. This CP turns all of that into what a reviewer reads first:
- a real README (currently the CRA boilerplate);
- a reusable runbook (from `LAUNCH.md`);
- the versioned infra config;
- a dated build log;
- a skills table that shows judgment.

After this, Marc makes the repo public.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added graphify and measured its token savings on this repo` (or the last CP4 commit if CP5 ran first)

## Prerequisites
- [ ] The CP2, CP4 and CP5 `## Results` sections are filled in.
- [ ] `npm test -- --watchAll=false` and `npm run test:security` pass.

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
   - **Architecture:** an ASCII or Mermaid diagram of Amplify → React SPA → API Gateway → Lambda → DynamoDB, deployed with Terraform.
   - **Stack table:** run locally, repo layout.
   - **"Why this much tooling on a portfolio site?"** A short section placed right before the skills table, so no reviewer reads it as over-engineering. Marc's framing:
     - A static site doesn't need pre-commit hooks, checkpointed plans or a security audit skill. I added them on purpose.
     - They're a small slice of how I use Claude Code on MyAutoTab, the SaaS I'm building to production standards, where they *are* load-bearing.
     - This repo is public and MyAutoTab isn't, so this is where I can show the workflow.
     - Tone: one confident paragraph, not an apology.
     - Say "built to production standards", not "production SaaS", because the site's MyAutoTab card says it's in staging with test users. The two claims have to agree.
   - **Skills table:** Skill | Source | Why | Instead of. The same content as `.claude/skills/README.md`, including the "considered, not used" rows.
   - **Numbers:** `CLAUDE.md` before/after tokens, graphify measurements, the dedupe size delta.
   - **Copyright:** © Marc Bastien, code all rights reserved; guides CC BY 4.0.
2. **`.claude/skills/README.md`:** opens with the same one-line framing (intentional, a demo of the MyAutoTab workflow, not something a static site needs), then the skills table with one line per skill.
   - **Mine, new:** `security-audit`, `vuln-check`, `pre-commit-checklist`, `comment-in-my-voice`, `dedupe`.
   - **Mine, adapted:** `plan-refine`.
   - **Third-party, measured:** graphify.
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
- `npm test -- --watchAll=false`, `npm run test:security` and `CI=true npm run build` all pass.
- Marc reviews the README, runbook and build log copy before commit.

## Commit
Commit each change separately:
- `rewrote the readme with the story and how i build`
- `turned the launch checklist into a runbook and tracked the amplify and iam config`
- `added a build log`

## Handoff
The repo is ready to go public.

Marc's steps:
- push and open a PR, then merge;
- flip the repo to public;
- switch the site card's `repo` to the GitHub URL;
- save the live site on web.archive.org.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp7.md` (backlog)
