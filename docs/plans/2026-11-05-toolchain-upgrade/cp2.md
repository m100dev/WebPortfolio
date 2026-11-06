# Checkpoint 2: Vite + Vitest + ESLint 9 (parity swap)

## Context
CP1 hardened the counter API and the contact form. This CP replaces Create React App with Vite and Jest with Vitest. **It changes behaviour nowhere**: React 18 and react-router 6 stay. That way any regression is the bundler's fault, and CP3 handles the library majors.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `added per-route throttles, access logs, cost alerts and a contact honeypot`

## Prerequisites
- [ ] On `chore/toolchain-upgrade`, and the CP1 commit (`c13aaa0 added per-route throttles, access logs, cost alerts and a contact honeypot`) is in `git log --oneline main..HEAD`. CP1 has about a dozen follow-up commits after it (the cold-start fix `b9d8ced`, evidence, plan notes), ending at `4d47532`.
- [ ] `npm test -- --watchAll=false` and `CI=true npm run build` pass.
- [ ] **Baseline numbers, recorded in Results before any change:**
  - `npm audit --omit=dev` summary line;
  - total `build/static/js` size;
  - build time;
  - test time.
- [x] **Amplify Node version (gate):** decided 2026-11-05, see D4. Marc sets Node 24 in the Amplify console build spec himself.
- [x] Local Node is ≥24.15.0: fnm 24.22.2. The system MSI is still 24.13.0, so shells without `fnm env` hit EBADENGINE.

## Decisions
### D1: Lint inside `npm run build`
- **Chosen:** `"build": "eslint . --max-warnings=0 && vite build"`.
- **Over:** a separate `lint` script that Amplify doesn't run.
- **Because:** CRA's `CI=true` failed the Amplify build on any lint warning. Keeping that guarantee inside the build script means the console needs no change.
- **Trade-off:** the build is slightly slower. `CI=true` is now a no-op, which is harmless.

### D2: `.md` imports with `?url`
- **Chosen:** `import file from './x.md?url'`.
- **Over:** `assetsInclude: ['**/*.md']`.
- **Because:** it's explicit at the import site. The memo loader fetches the URL either way.
- **Trade-off:** four import lines change.

### D3: Vitest with `globals: true` and jsdom
- **Chosen:** keep `describe`/`it`/`expect` as globals, and replace `jest.` with `vi.`.
- **Over:** explicit imports in every test.
- **Because:** the smallest diff, and the test bodies stay the same.
- **Trade-off:** globals need `eslint` globals config.

### D4: Pin Node 24 LTS in the repo
- **Chosen:** `engines.node: ">=24.15.0"`, `.nvmrc` set to `24`, and `engine-strict=true` in `.npmrc`. Marc installs and uses Node 24 in the Amplify console build spec.
- **Over:** Node 26, the newest LTS (Amplify supports only 20/22/24), or leaving it unpinned (nothing would catch drift).
- **Because:** 24.15 is the lowest version every current package accepts (jsdom 31 `^24.15`, vitest 5 `^24`, vite 8 `>=22.12`, eslint 10 `>=24`). With `engine-strict`, a build on the wrong Node fails at `npm ci` with a clear error, and Amplify keeps the last good deploy live.
- **Trade-off:** Amplify ignores `engines` and `.nvmrc`, so the console spec is the actual control and the repo files only declare the requirement and enforce it.

### D5: ESLint 10 without eslint-plugin-react and jsx-a11y
- **Chosen:** ESLint 10.14 with `@eslint/js` 10, react-hooks 7 and react-refresh 0.5.
- **Over:** ESLint 9.39.5 with eslint-plugin-react 7.37.5 and jsx-a11y 6.10.2, the only line both plugins support.
- **Because:** npm flags eslint 9.39.5 as "no longer supported", and an unsupported linter can't take security fixes. A probe showed ESLint 10 core marks JSX-only identifiers as used, so the main thing eslint-plugin-react did for us (`jsx-uses-vars`) is covered.
- **Trade-off:** CRA's jsx-a11y rules are gone until that plugin supports ESLint 10 (see [DISCOVERED]).

### D6: Parity lint rules, no component rewrites
- **Chosen:** CRA's `no-unused-vars` options (`args: 'none'`, `ignoreRestSiblings`) plus `varsIgnorePattern: '^React$'`, `no-useless-assignment` off, and react-refresh `allowExportNames` for the three data exports.
- **Over:** editing 31 components (unused `import React`) and `useCodeCopy.js` to satisfy rules CRA never ran.
- **Because:** this CP changes no behaviour. Each relaxed rule is logged for CP3.
- **Trade-off:** the lint config is looser than ESLint 10's defaults for now.

## Steps
0. **Node pin** per D4: `engines`, `.nvmrc`, `.npmrc`.
1. **Dependencies:**
   - remove `react-scripts`;
   - add as devDependencies: `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` and `globals`. Use current versions, and check them with `npm view <pkg> version`.
   - Move the testing-library and jest-dom packages to `devDependencies` (they were in `dependencies` because of CRA).
2. **`vite.config.js`:** react plugin, `envPrefix: ['VITE_', 'REACT_APP_']`, `build.outDir: 'build'`, `server.port: 3000` (CORS allows `localhost:3000`), and a `test` block (jsdom, globals, `setupFiles: 'src/setupTests.js'`).
3. **`index.html`:** move it from `public/` to the root, remove `%PUBLIC_URL%`, and add `<script type="module" src="/src/index.jsx">`.
   - Keep the inline theme script exactly as it is: it sets `data-theme` before first paint.
   - `public/favicon.svg` and `manifest.json` stay in `public/`.
4. **JSX file extensions:** rename `src/index.js` → `index.jsx`, and any other `.js` file that really contains JSX (check `useReveal.js` and `useCodeCopy.js` by parsing, not by grep). Update the imports.
5. **Env and mode:**
   - `useVisitorCount.js:5` → `import.meta.env.REACT_APP_VISITOR_API_URL`;
   - `memos/index.js:51` → `!import.meta.env.PROD`. Its tests pass `preview` explicitly, so check they still do.
6. **`.md` imports** (`memos/index.js:1-4`) get `?url`.
7. **Tests:** `jest.useFakeTimers` / `advanceTimersByTime` / `useRealTimers` → `vi.*` (`AskMarc.test.jsx:17-30`). In `setupTests.js`, use `import '@testing-library/jest-dom/vitest'` and keep the shims.
8. **`eslint.config.js`** (flat, ESLint 10, current as of 2026-11-05): recommended rules, react, react-hooks and react-refresh, with browser globals plus vitest globals for `*.test.*`. Remove `eslintConfig` from `package.json`.
9. **Scripts:**
   - `start` → `vite`, `build` per D1, `preview` → `vite preview --port 3000`;
   - `test` → `vitest`, so `npm test -- --run` runs once;
   - remove `eject`.
10. **Compatibility:** keep `npm test -- --watchAll=false` working. Add `"test:once": "vitest run"`, and note in CLAUDE.md (CP4) that `--watchAll=false` is gone.

## Verification
- `npm run test:once`: all tests pass. The count matches the baseline (18).
- `npm run build`: eslint passes with 0 warnings and Vite builds into `build/`. Paste the size output (`build/assets/*.js`; Vite has no `build/static/js`).
- `npm audit --omit=dev`: record after vs before.
- **Route parity**, with `vite preview` plus the headless Chrome recipe from memory:
  - `/`, `/guides`, `/guides/ai-autonomy-levels`, `/memos/ai-made-my-anki-cards` (the markdown body renders), and `/nope` (NotFound);
  - the theme script runs before first paint;
  - the `alv4` checklist persists across reload;
  - the counter is hidden without the env var, and with `REACT_APP_VISITOR_API_URL` set the request reaches the API.
- `index.html` theme script byte-identical to the old `public/index.html` script (diff them).

## Results
- `/context` at start: 39.2k / 1M (4%) total. The 3.1k first reported here was the `CLAUDE.md` row, which this branch doesn't track (masterplan "Session protocol").
- **Baseline before any change** (2026-11-05, `4d47532`, Node 24.13.0):
  - `npm audit --omit=dev`: 78 vulnerabilities (21 low, 22 moderate, 30 high, 5 critical);
  - `build/static/js`: 802,892 bytes of `.js` across 5 files, source maps excluded;
  - build (`CI=true npm run build`): ~10s;
  - tests (`npm test -- --watchAll=false`): 4 suites, 18 tests, Jest 2.65s (~5s wall).
- **Verification note:** the env-var check must not POST to the live counter (Marc's rule). Point `REACT_APP_VISITOR_API_URL` at a local stub and confirm the request reaches the stub.
- **After** (Node 24.22.2, clean `npm ci`):

  | Metric | CRA (before) | Vite (after) |
  |---|---|---|
  | `npm audit --omit=dev` | 78 (21 low, 22 mod, 30 high, 5 crit) | 2 moderate (react-router, CP3) |
  | `npm audit` (incl. dev) | n/a | 2 moderate, same two |
  | JS shipped | 802,892 bytes, 5 files (`build/static/js`) | 705,673 bytes, 4 files (`build/assets`), −12% |
  | Build | ~10s | ~2s with lint (`vite build` 0.37s) |
  | Tests | 18 pass, Jest 2.65s (~5s wall) | 18 pass, Vitest 1.3–2.9s (~3s wall) |
  | `npm ci` | n/a | 8s |
- **Engine-strict check:** `npm ci` on system Node 24.13.0 fails at once with `EBADENGINE … Required: {"node":">=24.15.0"}`. The root `engines` field is what fired.
- **Route parity** (`vite preview` + headless Chrome over CDP): `/`, `/guides`, both guides, `/memos` and `/memos/ai-made-my-anki-cards` (prose 1,593 chars from the emitted `.md`) render with the right titles. `/memos/_template` and `/nope` show NotFound. No page exceptions.
  - Theme: stored `light` gives `data-theme="light"` and theme-color `#F2F3F5`. The inline script is byte-identical in `index.html` and in the built `build/index.html`, and it runs before the module script.
  - `alv4`: one box ticked, still ticked after reload, stored as `{"1-0":true}`.
  - Counter: hidden with no env var (no API URL in `build/assets`). With the URL set to a local stub, one `POST /count` reached the stub and the footer showed "4,242 visits" once scrolled into view.
  - Amplify rewrite allowlist already covers every emitted extension (css, html, js, json, md, png, svg, webp). No console change.
- **[DISCOVERED]**
  - **AskMarc test:** jsdom 31's accessible-name code (dom-accessibility-api 0.5 and 0.6 alike) drops the space in `<span> (asked)</span>`. It passed under CRA only because jsdom 16 reported every element as `display: block`. Real Chrome's AX tree gives "What are you building right now? (asked)", so the test now accepts an optional space (`AskMarc.test.jsx:35-37`). The component is unchanged.
  - **Memo `.md` files were inlined as `data:` URLs** (all under Vite's 4 KB limit). `assetsInlineLimit` now never inlines `.md` (`vite.config.js`), so they ship as files as under CRA.
  - **jsx-a11y lint lost** (no ESLint 10 support in 6.10.2). The one disable comment (`AvdEnterpriseWorkspace.jsx:15`) became a plain note. Re-add the plugin once it supports ESLint 10 (CP3 or later).
  - **CP3 cleanup:** remove the 31 unused `import React` lines and then the `varsIgnorePattern`, turn `no-useless-assignment` on (`useCodeCopy.js:13`), and drop the `minimatch` override once ESLint ships minimatch ≥11.0.1 (GHSA, ReDoS, dev only).
  - **`browserslist` is ignored by Vite:** output now targets Vite 8's default (baseline widely available browsers). The `browserslist` field in `package.json` is unused; CP3 decides whether to remove it.
  - **React Router v7 future-flag warnings** in test stderr: CP3's router major removes them.
  - **Shells on 24.13:** no profile found (PowerShell `$PROFILE`, `~/.bashrc`, `~/.bash_profile`) sets up fnm, so new shells, Claude Code's included, resolve the 24.13.0 MSI and npm fails EBADENGINE. Fix: add `fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression` to `$PROFILE` (and `eval "$(fnm env --use-on-cd)"` to `~/.bashrc`), or upgrade or remove the MSI. Until then, prefix Bash calls with `export PATH="/c/Users/Mbast/AppData/Roaming/fnm/node-versions/v24.22.2/installation:$PATH"`.
  - **Rebase safety** (follow-up commit): `"type": "module"` dropped and the configs renamed to `.mjs`, because claude-workflow's `tools/vuln-check/*.js` use `require()`. Vitest is scoped to `src/**/*.test.*`, and ESLint ignores `tools/**/fixtures/`. Verified with that tree copied in (`cp4.md` "After merge").
  - **`npm test -- --watchAll=false` no longer works:** Vitest stops at once with `Unknown option --watchAll` (it doesn't hang). Use `npm run test:once`.
  - **Dev server:** `npm start` serves drafts (`/memos/_template` renders with its body, a 1,512-char prose block), and the production build 404s them.
  - **Bundle scan:** no `process.env`, `process.browser`, `process.nextTick` or `global.` left in `build/assets/*.js`, so no Node globals that CRA used to polyfill.
  - **Source maps:** Vite emits none by default (CRA did). A known difference, and it means less source shipped.
  - **Security skills:** the plan-refine rule asks for `security-audit` and `vuln-check`. They live on chore/claude-workflow, so `npm audit` (78 → 2) stood in. `vuln-check` run from that branch on `src/` reports one pre-existing finding (`Icon.jsx:19`, static SVG, already in `cp4.md`'s rebase notes) and nothing new from CP2.
  - **Stray process:** an older `server.js` serving `build/` on port 5055 (PID 47136, not started this session) is still running.
  - **CP4 docs:** CLAUDE.md commands are stale (`npm start` still works; `npm test -- --watchAll=false` → `npm run test:once`; `CI=true` is a no-op; `public/index.html` → `index.html`; `process.env` → `import.meta.env`).

## Commit
`replaced create react app with vite and jest with vitest`

## Key source files
- `package.json`: scripts, `eslintConfig`, dependencies
- `public/index.html` (lines 6-7): `%PUBLIC_URL%` links and the inline theme script
- `src/content/memos/index.js` (lines 1-4, 51): `.md` URL imports and the preview flag
- `src/hooks/useVisitorCount.js` (line 5): the build-time env var
- `src/components/about/AskMarc.test.jsx` (lines 17-30): Jest fake timers
- `src/setupTests.js`: jsdom shims to keep

## Handoff
The app builds and tests on Vite and Vitest with the same output, routes and env var, and the Amplify settings haven't changed (except the Node version, if Marc changed it). CP3 upgrades the runtime libraries.

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: `docs/plans/2026-11-05-toolchain-upgrade/cp3.md`
