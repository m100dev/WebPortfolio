# Checkpoint 4: Before/after numbers, security review, PR

## Context
CP1 hardened the counter and the form. CP2 swapped CRA for Vite and Vitest. CP3 moved the runtime to current majors. CP3d already brought the docs in line (`cp3d.md`), which covers steps 1–3 below. This CP publishes the measured before/after, runs the security review, and hands the PR to Marc. After the merge, `chore/claude-workflow` is rebased onto `main` and its CP3b continues.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `updated the docs for vite, react 19 and react router 7` (CP3d)

## Prerequisites
- [ ] On `chore/toolchain-upgrade`, and the CP3d commit is in `git log --oneline -3`.
- [ ] `npm run test:once` and `npm run build` pass.

## Decisions
### D1: Where the before/after lives
- **Chosen:** a `## Results` table in this file, linked from `brief.md`.
- **Over:** the README now.
- **Because:** the README is rewritten in claude-workflow CP6, which pulls these numbers from here. (CP3d replaced the CRA boilerplate with a short factual README; CP6 builds on that one.)
- **Trade-off:** the numbers aren't visible on the repo front page until CP6.

## Steps
1. ~~`CLAUDE.md`~~: done in CP3d (every stale fact, `cp3d.md` D2).
2. ~~`LAUNCH.md`~~: done in CP3d (step 1 commands, Node 24 note).
3. ~~`infra/visitor-counter/README.md`~~: checked in CP3d, already matches the applied stack.
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
- **Docs grep** (re-run from CP3d, to catch regressions): `grep -rnIE "react-scripts|Create React App|\bCRA\b|watchAll|webpack|PUBLIC_URL|public/index\.html|react-router-dom|CI=true|\beject\b" CLAUDE.md LAUNCH.md README.md src infra --exclude-dir=.terraform` finds only the three deliberate notes in `CLAUDE.md` (lines 9, 10, 18; `cp3d.md` Results).

## Commit
`recorded the upgrade numbers and drafted the pr`

## After merge (Marc's gate, then a new session on chore/claude-workflow)
1. Marc merges the PR, watches the Amplify build go green, and spot-checks `/`, `/guides/ai-autonomy-levels`, a memo, and the counter.
2. `git switch chore/claude-workflow && git rebase main`. The expected conflicts:
   - `package.json` / `package-lock.json` (babel devDeps, `test:security`, `vuln-check`): keep both, then `npm install`;
   - `CLAUDE.md`: keep claude-workflow's split structure and port CP3d's facts into it (`cp3d.md` D2):
     - root `CLAUDE.md` intro line: "Vite 8 + React 19 with `react-router` v7" (it says "Create React App with react-router v6");
     - Principles: `CI=true npm run build` → `npm run build`;
     - Commands: `npm test` (watch), `npm run test:once [pattern]`, `npm run build` (lint + Vite), `npm run preview`, Node ≥24.15 with `engine-strict`;
     - Hard rules: drop "Never run `npm run eject`";
     - Map: "webpack fingerprints" → "Vite fingerprints"; the counter reads `import.meta.env.REACT_APP_VISITOR_API_URL`; add the `.mjs` config note (why there's no `"type": "module"`);
     - `src/components/CLAUDE.md:12`: `public/index.html` → root `index.html`;
     - `src/content/CLAUDE.md`: memos imported with `?url` (check its wording).
   - **Skills that name old commands** (no conflict, just stale): plan-refine `SKILL.md:89` and `references/checkpoint-template.md:30` (`npm test -- --watchAll=false` → `npm run test:once`, `CI=true npm run build` → `npm run build`), `references/branch-strategy.md:34` (the `CI=true` gate → `npm run build`'s `--max-warnings=0`), `security-audit/SKILL.md:28` (`react-router-dom` → `react-router`; drop the `react-scripts` note).
   - `README.md`: claude-workflow still has the CRA boilerplate, so take `main`'s (CP3d) version;
   - `src/content/guides/ai-autonomy/Icon.jsx`: keep the suppression comment.
   - **Checked in CP2:** claude-workflow's `tools/vuln-check/` is CommonJS. That's why `package.json` has no `"type": "module"` and the configs are `.mjs`. With that tree copied in, `eslint .` passed (fixtures ignored, `tools/**/*.js` linted as Node CJS), Vitest stayed on its 18 `src/` tests, and `node --test "tools/**/*.test.js"` passed 6/6. After the rebase, `npm run test:security` and `npm run vuln-check` need Node ≥24.15 like everything else.
3. **[DISCOVERED] in CP1:** on the rebased branch, update `infra/visitor-counter/CLAUDE.md` (which only exists on claude-workflow):
   - per-route limits (POST 2/5, GET 5/10);
   - `alert_email` lives only in the git-ignored `terraform.tfvars`;
   - the deployer user can't read logs or metrics, on purpose.
4. Re-run CP3's verification on the rebased branch (`npm run test:security`, `npm run vuln-check -- src`, gitleaks). Then CP3b, with its check 7 (`--audit-level=high` blocks) now enforceable, and `npm test` replaced by `npm run test:once` in the hook.

## Results
- **Session:** Claude Opus 5.5 (`claude-opus-5-5`). `/context` 42.1k/1m (4%) at start; end total: Marc's `/context` at /clear.
- **How measured (2026-11-06):** "Before" is `4d47532` (last CRA commit) rebuilt in a throwaway worktree with `npm ci` on Node 24.13.0. "After" is `47f14d6` on Node 24.22.2. Times are wall clock (`real`), single run. `npm outdated` counts are against the registry today. The pre-filled "77 / 4 critical" and "12" were wrong: CP2 measured 78, and today's run agrees.

| Metric | Before (CRA, `4d47532`) | After (Vite, `47f14d6`) |
|--------|--------------|--------------|
| `npm audit --omit=dev` | 78 (21 low, 22 moderate, 30 high, 5 critical) | **0** (also 0 with dev deps) |
| `npm outdated` | 10 | 1 (`react-router` 7 → 8, deferred in `cp3.md` D4) |
| JS shipped (total) | 802,892 bytes, 5 files | 803,181 bytes, 4 files (+0.04%) |
| Largest JS chunk | 286,020 bytes (AVD guide, 59.4 kB gzip) | 338,214 bytes (main, 111.3 kB gzip) |
| Main entry chunk | 270,412 bytes (94.7 kB gzip) | 338,214 bytes (111.3 kB gzip) |
| Build (lint + bundle) | 26.2s (`CI=true npm run build`) | 2.0s (`npm run build`; `vite build` 0.27s) |
| Tests (18) | 7.8s (Jest 5.4s) | 2.1s (Vitest 1.06s) |

- **Reading the bundle row:** total JS is flat, but the main entry grew because react-dom 19 is +78 kB (`cp3.md` Results attributes it). The home page pays that cost, while the guides and memos stay lazy chunks. CP2's Vite swap on React 18 alone had cut JS by 12%.
- **Build time vs CP2's "~10s":** CP2 recorded ~10s in the main tree. Today's 26s was the first build in a fresh worktree (cold cache). Either way, CRA took 5–13× longer than the Vite build.

### Security review (step 5, by hand: `security-audit` isn't on this branch)
| Check | Result | Verdict |
|---|---|---|
| `gitleaks git` (no `.gitleaks.toml` on this branch) | 173 commits, no leaks | pass |
| `gitleaks dir .` (working tree incl. untracked) | no leaks | pass |
| `npm audit --omit=dev --audit-level=high` | exit 0, 0 advisories | pass |
| IAM (`infra/visitor-counter/main.tf:76-93`) | Lambda: `dynamodb:GetItem`/`UpdateItem` on the table ARN only, log writes on its own log group only | least privilege |
| CORS (`main.tf:127-131`, `variables.tf:13-21`) | GET/POST, `content-type` header, www + apex + `http://localhost:3000` | acceptable: CORS isn't the access control here (the per-route throttles are). A localhost origin only matches pages running on that same machine |
| Infra ignores (`infra/visitor-counter/.gitignore`) | `terraform.tfvars`, `*.tfstate`, `.terraform/` confirmed by `git check-ignore`; only `terraform.tfvars.example` is tracked | pass |
| `build/` | no `.map` files, no `sourceMappingURL` | pass |
| `public/` | `favicon.svg`, `manifest.json` only | pass |
| Root `.gitignore` | ignores `.env.local` / `.env.*.local`, but not `.env` or `.env.production`, which Vite also loads | **[DISCOVERED]** low: nothing was tracked. **Fixed in `55e3335`**: `.env` and `.env.*` are now ignored, with an exception for `.env.example` (checked with `git check-ignore`) |

### PR
Draft in `pr.md`, next to this file. Not pushed; Marc pushes and opens it.

## Handoff
The toolchain is current, the docs match it, and the numbers are recorded. After Marc merges, the claude-workflow plan resumes at CP3b on the rebased branch.

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: N/A, the final checkpoint. Continue in `docs/plans/2026-11-05-claude-workflow/cp3b.md` after the rebase.
