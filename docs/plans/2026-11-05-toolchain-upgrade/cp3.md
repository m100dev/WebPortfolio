# Checkpoint 3: Runtime majors + dependency cleanup

## Context
CP2 moved the build to Vite and the tests to Vitest, keeping parity: React 18 and react-router 6. This CP brings the runtime libraries to their current majors. It includes react-router 7, which fixes GHSA-wrjc-x8rr-h8h6 (open redirect, not reachable here today, per `brief.md` V5). It also removes unused dependencies.

**Master plan:** `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
**Branch:** `chore/toolchain-upgrade` (continue)
**Prior CP commit:** `replaced create react app with vite and jest with vitest`

## Prerequisites
- [ ] On `chore/toolchain-upgrade`, and the CP2 commit is in `git log --oneline -3`.
- [ ] `npm run test:once` and `npm run build` pass.
- [ ] Record `npm outdated` in Results before any change.

## Decisions
### D1: One package family per commit-sized step, tests after each
- **Chosen:** upgrade in this order, running `npm run test:once && npm run build` after each one:
  1. React 19;
  2. testing-library;
  3. react-router 7;
  4. emailjs 5;
  5. react-markdown 10;
  6. react-icons 5;
  7. the removals.
- **Over:** a single `npm install` of everything.
- **Because:** a failure points at one library.
- **Trade-off:** slower. There's still one commit for the CP.

### D2: Import from `react-router`, not `react-router-dom`
- **Chosen:** v7's single package, `react-router`, with imports updated in the 13 files that use it.
- **Over:** keeping `react-router-dom` v7 (a re-export shim).
- **Because:** it's the documented v7 path, and one fewer dependency.
- **Trade-off:** touches 13 import lines.

### D3: Remove the `browserslist` field (decided in CP3)
- **Chosen:** delete it from `package.json`.
- **Over:** keeping it, or wiring it into Vite with `browserslist-to-esbuild`.
- **Because:** nothing reads it. Vite 8 targets its own baseline, there's no PostCSS config, and the only browserslist install is `@babel/helper-compilation-targets` under `eslint-plugin-react-hooks`, which parses for lint and compiles nothing. A field that looks like it controls output and doesn't is misleading.
- **Trade-off:** the browser support target is now only implicit (Vite's default, baseline widely available). If it ever needs widening, set `build.target` in `vite.config.mjs`.

### D4: Stay on react-router 7, not 8 (decided in CP3)
- **Chosen:** `react-router` 7.18.5.
- **Over:** 8.5.1 (released 2026-06-17, after this plan was scoped. Peers: React ≥19.2.7, Node ≥22.22).
- **Because:** the plan scoped v7 for Marc's review, and 7.x is still patched (7.18.5 shipped the same day as 8.5.1) and clears GHSA-wrjc-x8rr-h8h6. Two router majors in one diff would blur what broke if something did (D1's reasoning).
- **Trade-off:** `npm outdated` isn't empty. RR8 is a follow-up for Marc to schedule. The imports already use `react-router`, so the jump touches `package.json` plus whatever 8 changes.

## Steps
1. **React 19:** `react`, `react-dom`. Check for removed APIs. CP0's grep found no `propTypes`, `defaultProps`, `forwardRef`, `findDOMNode` or `ReactDOM.render`, so re-grep to confirm. `src/index.jsx` already uses `createRoot`.
2. **Testing:** `@testing-library/react` 16 plus its new peer `@testing-library/dom`, and the current `@testing-library/jest-dom`.
3. **react-router 7:** run `npm i react-router` and remove `react-router-dom`, then update the imports in the 13 files that use it (`grep -rl "from 'react-router-dom'" src`):
   - `src/App.jsx`, `src/index.jsx`;
   - `src/components/about/AskMarc.jsx` and `AskMarc.test.jsx`;
   - `src/components/guides/GuideLayout.jsx`, `src/components/nav/Nav.jsx`, `src/components/portfolio/Portfolio.jsx`;
   - `src/hooks/useHashScroll.js`;
   - `src/pages/Guide.jsx`, `src/pages/Guides.jsx`, `src/pages/Memo.jsx`, `src/pages/Memos.jsx`, `src/pages/NotFound.jsx`.

   Hash links (`Nav.jsx:28`) and scroll restoration (`useHashScroll.js`) are the risky areas, so test them in the browser.
4. **`@emailjs/browser` 5:** `sendForm(SERVICE_ID, TEMPLATE_ID, form.current, { publicKey: PUBLIC_KEY })` (`Contact.jsx:51`). Read the v4/v5 changelog for error-shape changes, because `error.text` is used at `Contact.jsx:57`.
5. **react-markdown 10:** check the changelog for removed props. `Memo.jsx:59` uses `remarkPlugins` and `components` only.
6. **react-icons 5:** check that every imported icon name still exists (`npm run build` fails on a missing export).
7. **Remove** `web-vitals` and `@testing-library/user-event`, after confirming there are no imports with `grep -r "web-vitals\|user-event" src`.
8. **CP2 lint follow-ups** (`cp2.md` Results, [DISCOVERED]):
   - remove the unused `import React` lines, then the `varsIgnorePattern`;
   - turn on `no-useless-assignment` (`useCodeCopy.js:13`);
   - re-add jsx-a11y if it supports ESLint 10, and drop the `minimatch` override if ESLint's own dependency is patched;
   - decide whether to keep or remove the unused `browserslist` field.

   After the RTL 16 bump, recheck the AskMarc `(asked)` regex (`AskMarc.test.jsx:35-37`). Keep it if jsdom still drops the space.
9. **In-range bumps** for everything else (`npm update`). Then record `npm outdated` again: it should be empty, or every remaining entry explained.

## Verification
- `npm run test:once` passes, and `npm run build` passes with 0 lint warnings.
- `npm audit --omit=dev`: record the count. Expected: 0 high or critical. Any left gets named, with a reachability check like the one in `brief.md`.
- **Headless Chrome route parity** (same list as CP2), plus:
  - nav hash links from `/guides` back to `/#portfolio` scroll to the section;
  - the browser back button works;
  - a memo's markdown links open with `rel="noreferrer"`;
  - the contact form error path still shows a message. Use an invalid public key in a local run only, never against the real service.
- Bundle size: record before (CP2 Results) and after.

## Results
- **Session:** model Claude Opus 5.5 (`claude-opus-5-5`, 1M window). `/context` total 41.9k (4%) at start. End total: Marc's `/context` before /clear, recorded in a follow-up commit.
- **Baseline `npm outdated`** (before any change, `a49aaa9`): `@emailjs/browser` 3.11.0 → 5.0.3, `@testing-library/jest-dom` 6.9.1 → 7.0.1, `@testing-library/react` 13.4.0 → 16.3.3, `@testing-library/user-event` 13.5.0 → 14.6.8, `react`/`react-dom` 18.2.0 → 19.3.1, `react-icons` 4.10.1 → 5.7.0, `react-markdown` 9.1.0 → 10.1.0, `react-router-dom` 6.30.6 → 7.18.5, `web-vitals` 2.1.4 → 6.2.3.
- **After `npm outdated`:** one entry, `react-router` 7.18.5 (latest 8.5.1), explained in D4.
- **Installed:** react/react-dom 19.3.1, @testing-library/react 16.3.3 + @testing-library/dom 10.4.2 (new peer), jest-dom 7.0.1 (its `/vitest` entry is unchanged), react-router 7.18.5, @emailjs/browser 5.0.3, react-markdown 10.1.0, react-icons 5.7.0. Removed: react-router-dom, web-vitals, @testing-library/user-event.
- **Deviation from D1:** steps 1 and 2 were installed together. RTL 13 declares a `react ^18` peer, so React 19 on its own would have left a broken peer tree. No `--force` or `--legacy-peer-deps` anywhere.
- **Verification:**

  | Check | Result |
  |---|---|
  | `npm run test:once` | 4 files, 18 tests pass. No React Router future-flag warnings in stderr (CP2 had them) |
  | `npm run build` | `eslint . --max-warnings=0` clean, `vite build` ~0.3s |
  | `npm audit --omit=dev` | **0** (CP2: 2 moderate, react-router) |
  | `npm audit` (incl. dev) | **0**, with the minimatch override |
  | `vuln-check` (from `chore/claude-workflow`, on `src` + configs) | 1 finding, pre-existing: `Icon.jsx:18` static SVG (was `:19` before the React import line went). Nothing new |
  | Headless Chrome (`vite preview` :5056, CDP) | 21/21 checks (detail below) |

- **Bundle:** JS shipped 705,673 → **803,181 bytes** (+97.5 kB, +14%), 4 files. Main chunk 241.5 → 338.2 kB (gzip 82.6 → 111.3 kB). A per-library chunk split of both trees (throwaway build, scratchpad) attributes it:

  | Library | CP2 raw (gzip) | CP3 raw (gzip) | Δ raw |
  |---|---|---|---|
  | react-dom 18 → 19 | 129.0 (41.7) kB | 207.0 (64.5) kB | +78.1 kB |
  | react-router 6 → 7 | 23.0 (8.5) kB | 37.6 (13.4) kB | +14.6 kB |
  | react-icons 4 → 5 | 19.0 kB | 21.4 kB | +2.5 kB |
  | @emailjs/browser 3 → 5 | 1.5 kB | 3.5 kB | +2.0 kB |
  | app code | 64.7 kB | 64.7 kB | 0 |

  About 80% of the growth is React 19's react-dom, the cost of the major itself. Total JS is now back to the CRA figure (802,892), but with 0 advisories instead of 78.
- **Headless Chrome detail** (every non-localhost request intercepted over CDP `Fetch`: EmailJS got a faked 400, Google Fonts was failed, nothing left the machine):
  - Routes: `/`, `/guides`, both guides, `/memos`, `/memos/ai-made-my-anki-cards` (prose 1,593 chars) render with the right titles. `/memos/_template` and `/nope` show NotFound. 0 page exceptions.
  - Hash links: `/guides` → `/#portfolio`, `/memos` → `/#portfolio`, `/guides/avd-enterprise-workspace` → `/#about` each land with the section top at 80px (nav offset). A no-hash route change resets scroll to 0.
  - Back button: returns to `/guides`, `/memos` and the AVD guide with their content rendered. My first script expected an `<h1>` on `/guides` and `/memos`, which those pages don't have. A re-probe confirmed the content (2 guide cards).
  - Memo links: both external links in `index-0-local-ai-tutor` have `rel="noreferrer" target="_blank"`, and no `node` attribute leaks onto the DOM.
  - Contact error path: one intercepted EmailJS request answered `400 The Public Key is invalid…`. The page shows "Sorry, your message couldn't be sent: The Public Key is invalid…", so v5's error still carries `.text`. Honeypot filled: success dialog, 0 EmailJS requests.
  - Theme: stored `light` gives `data-theme="light"`, theme-color `#F2F3F5`. `alv4`: one box ticked survives reload as `{"1-0":true}`.
  - Counter (build with the URL pointed at a local stub on :5057): one `POST /count` per session, then `GET`s. The footer shows "4,242 visits". The production build has no API URL in `build/assets`.
- **[DISCOVERED]**
  - **AskMarc `(asked)` regex:** with the space made required, the test fails under RTL 16 / dom 10 / jsdom 31 ("Unable to find … `/^What are you building right now\? \(asked\)$/`"). Kept the optional space (`AskMarc.test.jsx:35-37`).
  - **EmailJS 5** still accepts a bare public-key string, but the call now uses the documented `{ publicKey }` options object (`Contact.jsx:70`). The error type is unchanged (`EmailJSResponseStatus { status, text }`).
  - **react-markdown 10** removed `className`. `Memo.jsx` doesn't use it, and `MarkdownLink` already drops `node`.
  - **Lint follow-ups:** 27 unused `import React` lines removed, one per file (CP2's "31" was an over-count; `React.*` is used nowhere), `varsIgnorePattern` dropped, `no-useless-assignment` on (from ESLint's recommended set; `useCodeCopy.js:13` now `let ok`, behaviour unchanged).
  - **jsx-a11y** 6.10.2 is still the latest and still peers ESLint ≤9, so it stays off.
  - **minimatch override stays:** without it ESLint 10.14 resolves minimatch 10.2.6, and `npm audit` reports 4 moderate (dev only). Re-check when ESLint moves to minimatch 11.
  - **Bash heredocs** with nested template literals failed in this shell ("unexpected EOF"). The CDP scripts were written with the Write tool instead.

## Commit
`upgraded to react 19, react router 7 and current libraries and dropped unused deps`

## Key source files
- `src/components/contact/Contact.jsx` (lines 44-62): EmailJS call and error handling
- `src/pages/Memo.jsx` (lines 15, 59): markdown link component and renderer
- `src/components/nav/Nav.jsx` (lines 28, 89): hash links and `NavLink`
- `src/hooks/useHashScroll.js`: scroll after route change

## Handoff
The runtime is on current majors, unused dependencies are gone, and the audit is clean or every remaining advisory is explained. CP4 updates the docs, records the before/after numbers and opens the PR.

## Resume paths
Master plan: `docs/plans/2026-11-05-toolchain-upgrade/masterplan.md`
Next CP: `docs/plans/2026-11-05-toolchain-upgrade/cp4.md`
