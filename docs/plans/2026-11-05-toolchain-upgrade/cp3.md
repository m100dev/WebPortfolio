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
8. **In-range bumps** for everything else (`npm update`). Then record `npm outdated` again: it should be empty, or every remaining entry explained.

## Verification
- `npm run test:once` passes, and `npm run build` passes with 0 lint warnings.
- `npm audit --omit=dev`: record the count. Expected: 0 high or critical. Any left gets named, with a reachability check like the one in `brief.md`.
- **Headless Chrome route parity** (same list as CP2), plus:
  - nav hash links from `/guides` back to `/#portfolio` scroll to the section;
  - the browser back button works;
  - a memo's markdown links open with `rel="noreferrer"`;
  - the contact form error path still shows a message. Use an invalid public key in a local run only, never against the real service.
- Bundle size: record before (CP2 Results) and after.

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
