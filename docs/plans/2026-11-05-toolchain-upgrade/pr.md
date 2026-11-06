# PR draft: chore/toolchain-upgrade → main

**Title:** replaced create react app with vite, moved to react 19 and router 7, and hardened the counter and form

## What and why
The site built on Create React App, which was deprecated in Feb 2025 and carried 78 npm advisories (5 critical). They were build-time only, but no fixes were coming. The site has also grown an API backend (the visitor counter) and a browser-side mail form. The security brief ([`brief.md`](docs/plans/2026-11-05-toolchain-upgrade/brief.md)) found that the counter could be flooded and the form spammed, with nothing to alert me. This PR fixes both, in order:

- **Abuse hardening (CP1):** per-route API throttles, access logs, 4xx/5xx alarms, a budget alert, and a honeypot on the contact form. The Terraform part is **already applied**, so merging deploys frontend code only.
- **Vite + Vitest + ESLint 10 (CP2):** a parity swap that keeps React 18 and RR6. It keeps `build/` and the `REACT_APP_` env names, so Amplify needs no artifact or env changes.
- **Runtime majors (CP3):** React 19, `react-router` 7 (replaces `react-router-dom`), and current libraries. Removed the unused `web-vitals` and `@testing-library/user-event`.
- **Docs (CP3d):** `CLAUDE.md`, `README.md`, `LAUNCH.md` and the contact README now match the new toolchain.

## Numbers (measured, `cp4.md` Results)
| | Before (CRA) | After |
|---|---|---|
| `npm audit --omit=dev` | 78 (5 critical) | 0 |
| `npm outdated` | 10 | 1 (`react-router` 8, deferred) |
| JS shipped | 802,892 bytes | 803,181 bytes |
| Build | 10–26s | 2s |
| Tests (18) | 7.8s | 2.1s |

## Before merging: Amplify build spec
- **Node ≥ 24.15.** `package.json` `engines` and `.npmrc` `engine-strict=true` make `npm ci` fail on anything older, including an older 24.x. After the first build, check `node --version` in the Amplify build log.
- Build command (`npm run build`) and artifact folder (`build/`) are unchanged.

## Verification
- `npm run test:once`: 4 files, 18 tests pass. `npm run build`: 0 lint warnings.
- Headless Chrome route check on `vite preview` (CP2 and CP3): every route, theme persistence, the `alv4` checklist, and the counter against a local stub.
- Clean-worktree `npm ci` reproduces the lockfile (CP3).
- `gitleaks` (history and tree): no leaks. IAM and CORS reread. No source maps in `build/`.

## After merge (my checks)
Watch the Amplify build go green, then spot-check `/`, `/guides/ai-autonomy-levels`, a memo, and the footer counter.

## Known open items
- `react-router` 8 is deferred (`cp3.md` D4).
- Total JS is +14% vs the React 18 Vite build (CP2), about 80% of it react-dom 19, so it's back to CRA's total. The main chunk carries it: 111 kB gzip, up from CRA's 95 kB.
- `eslint-plugin-jsx-a11y` is off until it supports ESLint 10.

## Rollback
Revert the merge commit and push, or redeploy the previous build from the Amplify console. The Terraform changes are independent of this code and stay applied.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
