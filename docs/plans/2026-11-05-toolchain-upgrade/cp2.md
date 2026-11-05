# Checkpoint 2: Vite + Vitest + ESLint 9 (parity swap)

## Context
CP1 hardened the counter API and the contact form. This CP replaces Create React App with Vite and Jest with Vitest. **It changes behaviour nowhere**: React 18 and react-router 6 stay. That way any regression is the bundler's fault, and CP3 handles the library majors.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `added per-route throttles, access logs, cost alerts and a contact honeypot`

## Prerequisites
- [ ] On `chore/toolchain-upgrade`, and the CP1 commit is in `git log --oneline -3`.
- [ ] `npm test -- --watchAll=false` and `CI=true npm run build` pass.
- [ ] **Baseline numbers, recorded in Results before any change:**
  - `npm audit --omit=dev` summary line;
  - total `build/static/js` size;
  - build time;
  - test time.
- [ ] **Marc has confirmed Amplify's build Node version.** Vite 8 needs ≥20.19 or ≥22.12. If it's lower, STOP: Marc picks either a console build spec change or a committed `amplify.yml`.

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

## Steps
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
8. **`eslint.config.js`** (flat): recommended rules, react, react-hooks and react-refresh, with browser globals plus vitest globals for `*.test.*`. Remove `eslintConfig` from `package.json`.
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
