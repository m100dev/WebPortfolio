# Toolchain modernization + abuse hardening

## Status: IN PROGRESS
## Created: 2026-11-05

## Problem summary
- **Supply chain:** the site builds on Create React App (`react-scripts` 5.0.1, deprecated Feb 2025), which pulls in 77 npm advisories (4 critical). They're build-time only, but no fixes are coming, and the pre-commit audit gate planned in `2026-11-05-claude-workflow` CP3b can't work on top of them.
- **Abuse surface:** the site now has an API backend (the visitor counter) and a browser-side mail form. The security brief (`brief.md`) checked the "someone can DoS this site" hypothesis:
  - the site itself can't be knocked over;
  - the counter can, and the form can be spammed;
  - the cost of abuse is capped at about $26 a month, but nothing would alert me.
- This plan fixes the abuse gaps first, then leaves CRA.

## Relationship to the claude-workflow plan
- **This plan unblocks `docs/plans/2026-11-05-claude-workflow/masterplan.md`. It doesn't replace it.**
- That plan is **paused at CP3b**, with CP0–CP3 done. It resumes on `chore/claude-workflow` after this branch merges and that branch is rebased (see `cp4.md` "After merge").
- Its open items move here:
  - the CRA advisories;
  - the react-router advisory;
  - the enforceability of CP3b's audit gate.
- Its own tracking stays there: CP2's measured `CLAUDE.md` tokens (3.1k → 1.2k) and CP5's graphify token measurement. This plan measures supply-chain and build numbers instead (`cp4.md` Results).

## Branch strategy
Decision: SINGLE-BRANCH, separate from the Claude workflow plan
Branch: `chore/toolchain-upgrade`, created from `main` (`9215eda`, redesign merged and live)
Rationale: this changes the production build, so it gets its own PR and its own rollback. `chore/claude-workflow` (unpushed, CP3 done) is rebased onto `main` after this merges, and its CP3b waits for that.

## Codebase findings
- **CRA-specific code to migrate:**
  - `process.env.REACT_APP_VISITOR_API_URL` (`src/hooks/useVisitorCount.js:5`);
  - `process.env.NODE_ENV` (`src/content/memos/index.js:51`);
  - `.md` imported as URLs (`src/content/memos/index.js:1-4`);
  - `%PUBLIC_URL%` (`public/index.html:6-7`);
  - JSX in `.js` (`src/index.js`; check `src/hooks/useReveal.js` and `src/content/guides/avd/useCodeCopy.js`);
  - `jest.*` timers (`src/components/about/AskMarc.test.jsx:17-30`);
  - `eslintConfig` in `package.json`.
- **Amplify:**
  - the build spec lives in the console (no `amplify.yml`), and its artifact folder is presumably `build/`;
  - the rewrite allowlist is by extension (`amplify-redirects.json`, untracked) and already includes `js`, `css` and `md`;
  - `REACT_APP_VISITOR_API_URL` is set in the console.
- **Router surface is small and unchanged in v7:** `Routes`, `Route`, `Outlet`, `Link`, `NavLink`, `useLocation`, `useParams`, `BrowserRouter`, `MemoryRouter`. There's no `useNavigate`.
- **Unused dependencies:** `web-vitals` and `@testing-library/user-event` (no imports in `src/`).
- **Infra:** HTTP API; WAF can't attach to HTTP APIs. At CP0 it had one stage-wide throttle and no access logs, budget or alarm. CP1 (`c13aaa0`) added per-route throttles, access logs, 4xx/5xx alarms and a budget (`infra/visitor-counter/main.tf:154-198` stage and access logs, `:208-283` alerting), not yet applied.

## Decision log
### D1: Harden before migrating
- **Chosen:** CP1 (abuse hardening) before CP2–3 (toolchain).
- **Over:** migrate first while in the dependency headspace.
- **Because:** security over quality over speed. The counter DoS and form spam are live exposures. The CRA advisories aren't reachable from the live site.
- **Trade-off:** the toolchain work starts a session later.

### D2: Parity swap, then runtime majors, in separate CPs
- **Chosen:** CP2 swaps only the build and test tooling (React 18, RR6 kept). CP3 does the runtime majors.
- **Over:** one big-bang upgrade.
- **Because:** when something regresses, I know whether it was the bundler or a library.
- **Trade-off:** two verification passes.

### D3: Vite + Vitest, not Next.js or another meta-framework
- **Chosen:** Vite 8, `@vitejs/plugin-react`, Vitest 5, ESLint 10 flat config (9 when planned; 9.39 is now unsupported, see `cp2.md` D5).
- **Over:** Next.js (React's recommended framework).
- **Because:** the site is a client-rendered SPA on Amplify static hosting. Next would add SSR and routing changes and a new Amplify build type, none of which the site needs. Vite keeps the same architecture.
- **Trade-off:** no SSR or SEO pre-rendering, which is the same as today.

### D4: Keep Amplify settings unchanged where possible
- **Chosen:**
  - `envPrefix: ['VITE_', 'REACT_APP_']`;
  - `build.outDir: 'build'`;
  - `"build": "eslint . --max-warnings=0 && vite build"`.
- **Over:** idiomatic `VITE_` names and `dist/`.
- **Because:** zero console changes means the deploy risk is in the code only, and a revert is a clean rollback.
- **Trade-off:** a non-idiomatic env prefix. The Node version is the one console change: Marc sets Node 24 in the build spec, and the repo pins `>=24.15.0` (`cp2.md` D4).

### D5: Abuse controls sized to the asset
- Shared throttle split per route, access logs, budget alert and 4xx + 5xx alarms (5xx added in CP1 after the burst test returned 500/503s, not 429s), plus a contact-form honeypot. CloudFront + WAF and IP dedup were rejected.
- The full steelman is in `brief.md` O1–O3. **Marc's decisions there override this line.**

## Checkpoint overview
| CP | Title | Depends on | Gate | Status |
|----|-------|------------|------|--------|
| 0 | Security brief + this plan | -- | Marc fills in the "Marc's decision" lines in `brief.md` | [x] decided |
| 1 | Abuse hardening (Terraform + contact honeypot) | 0 | Marc approves the live burst test, then runs `terraform apply` (EmailJS dashboard: no changes, brief O3) | [x] applied, verified, autofill check passed (see `cp1.md` "Marc's gate") |
| 2 | Vite + Vitest + ESLint 10 (parity swap) | 1 | Marc confirms Amplify's Node version (decided: Node 24, `cp2.md` D4) | [x] done; Marc sets Node 24 in the Amplify build spec before merge |
| 3 | Runtime majors + dependency cleanup | 2 | Marc reviews the diff | [x] done; Marc reviews the diff (RR8 deferred, `cp3.md` D4) |
| 4 | Docs, before/after numbers, PR | 3 | Marc merges and checks the live site, then the claude-workflow rebase | [ ] |

These run strictly in sequence. CP1's frontend honeypot and its Terraform are independent, so `terraform apply` can happen any time after CP1.

## Session protocol
- One CP per session, with /clear between them. Before CP N+1, check that CP N's commit is in `git log --oneline -5`.
- **Context budget:**
  - run `/context` at the start and end of each CP, and note both top-line totals (e.g. `39.2k/1m (4%)`, not the `CLAUDE.md` row) plus the model ID in that CP's Results;
  - if a session passes 60%, finalize and hand off (plan-refine rule).
  - CP2 and CP3 are the heavy ones, because of the dependency output, so delegate long `npm` output reading to an Explore agent.
- **`CLAUDE.md` tokens:** this branch still has the old ~3.1k-token root `CLAUDE.md` from `main`. Don't re-measure it here, and keep CP4's edits to its Commands lines so the rebase onto the split version stays small.
- This file is shared state: mark `[x]` here before /clear.
- Every CP ends with the verification results, then "Here is the prompt for the next session:".
- Outward-facing steps (push, merge, `terraform apply`, Amplify or EmailJS console, live API requests) are Marc's, or need his explicit OK.
- **Prerequisites cheat sheet:** in this branch the plan-refine skill isn't on disk. It lives on `chore/claude-workflow`. Read it with `MSYS_NO_PATHCONV=1 git show "chore/claude-workflow:.claude/skills/plan-refine/SKILL.md"`.

## Status tracker
- [x] CP0 — security brief + plan (decisions filled 2026-11-05)
- [x] CP1 — abuse hardening (applied, verified and honeypot autofill check passed, 2026-11-05)
- [x] CP2 — Vite + Vitest parity swap (2026-11-05; audit 78 → 2, JS −12%, build 10s → 2s; Amplify build spec must use Node 24 before merge)
- [x] CP3 — runtime majors (2026-11-06; audit 2 → 0, React 19 + RR7, JS +14% vs CP2 from react-dom 19, now equal to CRA's total)
- [ ] CP4 — docs, numbers, PR
