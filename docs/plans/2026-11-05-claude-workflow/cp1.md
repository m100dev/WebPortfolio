# Checkpoint 1: AWS certs, archived sysadmin plan, Terraform tag

## Context
CP0 adapted the `plan-refine` skill into `.claude/skills/plan-refine/` and wrote this plan. This CP makes the visible site changes:
- the expired AWS certs, shown honestly with date ranges;
- `site-update-plan.md` moved, unedited, into the plan archive (its certs were true on 2026-05-20);
- Terraform added as a skill tag (no cert claim).

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (create it from `main` after the redesign merges; see the master plan's fallback)
**Prior CP commit:** `planned the claude workflow checkpoints and adapted plan-refine`

## Prerequisites
- [ ] `git branch --show-current` shows `chore/claude-workflow`.
- [ ] `git log --oneline -5` includes the CP0 commit.
- [ ] `npm test -- --watchAll=false` passes.
- [x] Cert years confirmed by Marc: both AWS certs earned in 2023, expired June 2026.

## Decisions
### D1: Wording of the lapsed certs
- **Chosen:** the date range, plus `renewal planned` (SAA) and `expired` (Cloud Practitioner).
- **Over:** `retake planned`, which is the literal AWS process: an expired cert can't be recertified.
- **Because:** Marc's wording reads naturally, and the date range already says it's lapsed.
- **Trade-off:** slightly less precise than "retake".

## Steps
1. **Certs:** `src/components/about/About.jsx:14-20`. Add, after the Azure entry:
   - `{ name: 'AWS Solutions Architect – Associate (2023–2026)', status: 'renewal planned' }`
   - `{ name: 'AWS Cloud Practitioner (2023–2026)', status: 'expired' }`
2. **Bio line:** `src/components/about/About.jsx:66`. Change it to: "CCNA and Azure Fundamentals certified, previously AWS Solutions Architect – Associate (renewal planned), working toward Security+. U.S. citizen, eligible for a security clearance."
3. **Ask Marc:** `src/components/about/AskMarc.jsx:32`. Change the certs answer to match the new site copy, including AWS SAA and Cloud Practitioner (2023–2026, renewal planned).
4. **Terraform tag:** `src/components/experience/Experience.jsx:17`. Add `'Terraform'` to the current role's tags.
5. **Archive the plan:** `git mv site-update-plan.md docs/plans/2026-05-20-sysadmin-reposition.md`. Prepend one line:
   > Archived plan from May 2026, since superseded. Certs and roles are as of that date.

   Don't change anything else in the file.
6. **References:** grep for `site-update-plan` and update any links that point to it.

## Verification
- Run `npm test -- --watchAll=false`. Expected: all pass.
- Run `CI=true npm run build` (Bash). Expected: "Compiled successfully".
- Visual check (headless Chrome recipe in memory): the About cert row shows two pending-style AWS badges, and they wrap cleanly at 390px.

## Commit
`added my aws certs with renewal status, a terraform tag and archived the sysadmin plan`

## Key source files
- `src/components/about/About.jsx`: the cert list, `status` styling and the bio.
- `src/components/about/AskMarc.jsx`: the scripted chat answers, which must match site copy.
- `src/components/experience/Experience.jsx`: the role timeline and its tags.

## Handoff
The site shows AWS SAA and Cloud Practitioner with date ranges and statuses. Terraform is a tag on the current role. The old plan lives in `docs/plans/`. CP2 restructures `CLAUDE.md`.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp2.md`
