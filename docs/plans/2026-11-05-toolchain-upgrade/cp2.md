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
- [ ] Local Node is ≥24.15.0 (`node --version`). jsdom 31 requires it.

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
- `npm run test:once`: all tests pass. The count matches the baseline (14, plus CP1's).
- `npm run build`: eslint passes with 0 warnings and Vite builds into `build/`. Paste the size output.
- `npm audit --omit=dev`: record after vs before.
- **Route parity**, with `vite preview` plus the headless Chrome recipe from memory:
  - `/`, `/guides`, `/guides/ai-autonomy-levels`, `/memos/ai-made-my-anki-cards` (the markdown body renders), and `/nope` (NotFound);
  - the theme script runs before first paint;
  - the `alv4` checklist persists across reload;
  - the counter is hidden without the env var, and with `REACT_APP_VISITOR_API_URL` set the request reaches the API.
- `index.html` theme script byte-identical to the old `public/index.html` script (diff them).

## Results
- `/context` at start: 3.1
- **Baseline before any change** (2026-11-05, `4d47532`, Node 24.13.0):
  - `npm audit --omit=dev`: 78 vulnerabilities (21 low, 22 moderate, 30 high, 5 critical);
  - `build/static/js`: 802,892 bytes of `.js` across 5 files, source maps excluded;
  - build (`CI=true npm run build`): ~10s;
  - tests (`npm test -- --watchAll=false`): 4 suites, 18 tests, Jest 2.65s (~5s wall).
- **Verification note:** the env-var check must not POST to the live counter (Marc's rule). Point `REACT_APP_VISITOR_API_URL` at a local stub and confirm the request reaches the stub.

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
