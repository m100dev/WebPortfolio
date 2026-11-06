# Checkpoint 4: Docs, before/after numbers, PR

## Context
CP1 hardened the counter and the form. CP2 swapped CRA for Vite and Vitest. CP3 moved the runtime to current majors. This CP makes the docs match the new toolchain, publishes the measured before/after, and hands the PR to Marc. After the merge, `chore/claude-workflow` is rebased onto `main` and its CP3b continues.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `upgraded to react 19, react router 7 and current libraries and dropped unused deps`

## Prerequisites
- [ ] On `chore/toolchain-upgrade`, and the CP3 commit is in `git log --oneline -3`.
- [ ] `npm run test:once` and `npm run build` pass.

## Decisions
### D1: Where the before/after lives
- **Chosen:** a `## Results` table in this file, linked from `brief.md`.
- **Over:** the README now.
- **Because:** the README is rewritten in claude-workflow CP6, which pulls these numbers from here.
- **Trade-off:** the numbers aren't visible on the repo front page until CP6.

## Steps
1. **`CLAUDE.md` (root, as it is on this branch, before the claude-workflow split):**
   - Commands: `npm start` (Vite on :3000), `npm run test:once`, `npm run build` (lint plus Vite; `CI=true` is no longer needed), `npm run preview`.
   - Remove the eject rule and the CRA and webpack wording ("webpack fingerprints" becomes "Vite fingerprints").
   - The `public/index.html` theme-script reference becomes the root `index.html`.
2. **`LAUNCH.md`:** build command wording, plus the Node version note for Amplify.
3. **`infra/visitor-counter/README.md`:** make sure CP1's abuse section matches what's applied. Mark anything not applied yet.
4. **Results table:** fill in before (CP2 baseline) and after for:
   - `npm audit --omit=dev`, by severity;
   - `npm outdated` count;
   - JS bundle size (total and largest chunk);
   - build time;
   - test time.
   Measured, not estimated.
5. **Security review:** invoke `security-audit` if the skill exists on this branch. It doesn't yet, since it arrives with the rebase, so run its checklist by hand: gitleaks, `npm audit --omit=dev --audit-level=high`, IAM and CORS reread, `.gitignore`, `public/`. Save the table in Results.
6. **Draft the PR description**, covering:
   - what changed and why (link `brief.md`);
   - the Amplify Node version prerequisite;
   - rollback: revert the merge commit and redeploy the previous build in Amplify.
   - End it with the attribution line.
   Marc pushes and opens it, or asks me to.

## Verification
- `npm run test:once` and `npm run build` pass.
- `gitleaks git --config .gitleaks.toml` (if the config is present) or `gitleaks git`: no leaks.
- `npm audit --omit=dev --audit-level=high` exits 0. If not, every remaining advisory is listed with a reachability verdict.
- **Docs grep:** `grep -rn "react-scripts\|CRA\|watchAll\|webpack\|PUBLIC_URL" CLAUDE.md LAUNCH.md src infra docs/plans/2026-11-05-toolchain-upgrade` finds only historical mentions in the plan files.

## Commit
`updated the docs for vite and recorded the upgrade numbers`

## After merge (Marc's gate, then a new session on chore/claude-workflow)
1. Marc merges the PR, watches the Amplify build go green, and spot-checks `/`, `/guides/ai-autonomy-levels`, a memo, and the counter.
2. `git switch chore/claude-workflow && git rebase main`. The expected conflicts:
   - `package.json` / `package-lock.json` (babel devDeps, `test:security`, `vuln-check`): keep both, then `npm install`;
   - `CLAUDE.md`: keep claude-workflow's split structure, and apply this branch's command changes to it;
   - `src/content/guides/ai-autonomy/Icon.jsx`: keep the suppression comment.
   - **Checked in CP2:** claude-workflow's `tools/vuln-check/` is CommonJS. That's why `package.json` has no `"type": "module"` and the configs are `.mjs`. With that tree copied in, `eslint .` passed (fixtures ignored, `tools/**/*.js` linted as Node CJS), Vitest stayed on its 18 `src/` tests, and `node --test "tools/**/*.test.js"` passed 6/6. After the rebase, `npm run test:security` and `npm run vuln-check` need Node ≥24.15 like everything else.
3. **[DISCOVERED] in CP1:** on the rebased branch, update `infra/visitor-counter/CLAUDE.md` (which only exists on claude-workflow):
   - per-route limits (POST 2/5, GET 5/10);
   - `alert_email` lives only in the git-ignored `terraform.tfvars`;
   - the deployer user can't read logs or metrics, on purpose.
4. Re-run CP3's verification on the rebased branch (`npm run test:security`, `npm run vuln-check -- src`, gitleaks). Then CP3b, with its check 7 (`--audit-level=high` blocks) now enforceable, and `npm test` replaced by `npm run test:once` in the hook.

## Results
| Metric | Before (CRA) | After (Vite) |
|--------|--------------|--------------|
| npm audit --omit=dev | 77 (21 low, 22 moderate, 30 high, 4 critical) | ___ |
| npm outdated | 12 | ___ |
| JS bundle (total / largest) | ___ | ___ |
| Build time | ___ | ___ |
| Test time | ___ | ___ |

## Handoff
The toolchain is current, the docs match it, and the numbers are recorded. After Marc merges, the claude-workflow plan resumes at CP3b on the rebased branch.

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: N/A, the final checkpoint. Continue in `docs/plans/2026-11-05-claude-workflow/cp3b.md` after the rebase.
