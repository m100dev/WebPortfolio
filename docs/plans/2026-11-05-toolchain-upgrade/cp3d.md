# Checkpoint 3d: docs brought in line with Vite, React 19 and react-router 7

## Context
CP2 (`15d63d8`) and CP3 (`0e6ea47`) changed the toolchain, but the docs still described Create React App. The root `CLAUDE.md`, which every session loads, told agents to run `npm test -- --watchAll=false` (Vitest rejects the flag) and `CI=true npm run build` (now a no-op), never to eject (there's nothing to eject), and that the router is `react-router-dom` v6 in `src/index.js`. Marc asked for the docs before CP4, so CP4 starts from correct instructions. This CP pulls `cp4.md` steps 1–3 forward.

**Branch:** `chore/toolchain-upgrade`. **Prior commit:** `824e3be recorded the cp3 lockfile check and review notes`.

## Decisions
### D1: Docs now, as their own commit, not inside CP4
- **Chosen:** a docs-only commit before CP4. CP4 keeps the numbers, the security review and the PR.
- **Over:** leaving the docs in CP4 as planned.
- **Because:** the docs went wrong the moment the code commits landed, and every session in between, CP4 included, would load wrong commands.
- **Trade-off:** `cp4.md` has to be edited, and the plan gains a row.

### D2: Fix every stale fact in `CLAUDE.md`, not just the Commands lines
- **Chosen:** change each stale line: Commands, the eject rule, the Architecture stack line, the theme-script path, "webpack", and the env var and `?url` wording.
- **Over:** the master plan's earlier rule to touch only the Commands lines, to keep the rebase small.
- **Because:** `chore/claude-workflow` rewrote `CLAUDE.md` completely into a split structure, so the rebase conflicts on the whole file however few lines change here. The resolution is the same either way: take claude-workflow's version and port the facts. Leaving the stack line stale would put wrong facts on `main` until the rebase.
- **Trade-off:** a longer port list, written out in `cp4.md` "After merge".

### D3: Edit in place, don't restructure
- **Chosen:** line-level edits, keeping the current headings and order.
- **Over:** rewriting into claude-workflow's split shape now.
- **Because:** that split already exists on the other branch. Doing it twice would make the rebase worse.
- **Trade-off:** `CLAUDE.md` stays at about 3.1k tokens here until the rebase.

### D4: Fix live pointers, keep provenance comments
- **Chosen:** fix `src/hooks/useTheme.js:3` and `src/index.css:14`, which pointed at the deleted `public/index.html`. The grep found the second one after the plan was written.
- **Kept on purpose:**
  - `ai-autonomy/data.js:1` and `AvdEnterpriseWorkspace.jsx:1`, which say where the content came from;
  - the "as under CRA" rationale in `vite.config.mjs` and `eslint.config.mjs`;
  - plan history.
- **Over:** scrubbing every "CRA" mention.
- **Because:** a comment that explains why a setting exists, or where content came from, is still true after the migration.
- **Trade-off:** none in the grep, as it turned out. The provenance comments say `public/guides/…`, which the grep doesn't match.

### D5: Short real README; old site plan archived (Marc's answers)
- `README.md`: the CRA boilerplate is replaced by a plain one covering what the site is, the stack, Node ≥24.15, the commands, and links.
- `site-update-plan.md` → `docs/plans/archive/`, with a "historical (superseded)" note. Its stack notes (TypeScript, CRA, Render) were wrong, and agents could have read them as current.

### D6: In `LAUNCH.md`, change only the commands
- It's a completed launch record, so only step 1's commands change, plus a Node 24 note for the Amplify build spec.

## Changes
- `CLAUDE.md`:
  - Commands: `npm start`, `npm test`, `npm run test:once`, `npm run build`, `npm run preview`, Node ≥24.15 with `engine-strict`; the eject rule is removed;
  - Architecture: Vite 8, React 19, `react-router` v7, `src/index.jsx`, the `.mjs` configs and why;
  - `index.html` path, "Vite fingerprints", `?url`, `import.meta.env`.
- `README.md` rewritten. `LAUNCH.md` step 1.
- `src/components/contact/README.md:48` → `npm run test:once -- Contact`.
- Comments in `src/hooks/useTheme.js:3` and `src/index.css:14`.
- `site-update-plan.md` moved to `docs/plans/archive/`.
- `infra/visitor-counter/README.md`: read through, already matches the applied stack (per-route throttles, alarms, budget, burst-test cause). No change. This was `cp4.md` step 3.

## Verification
- `npm run test:once` and `npm run build` pass.
- Docs grep (`cp4.md` Verification) shows only the D4 provenance hits.
- Every path and npm script named in `README.md` and `CLAUDE.md` exists.

## Results
- `npm run test:once`: 4 files, 18 tests pass. `npm run build`: 0 lint warnings, built in about 0.3s.
- Docs grep (`cp4.md` Verification): the only hits are the three deliberate "don't use the old thing" notes in `CLAUDE.md` (lines 9, 10, 18). The first version of the grep matched "reject" and binary files, so it now uses `\beject\b`, `-I` and `--exclude-dir=.terraform`.
- Every path named in `README.md` and `CLAUDE.md` exists, and all five npm scripts (`start`, `test`, `test:once`, `build`, `preview`) are in `package.json`.
- The diff is docs, two code comments and one rename.

## Commit
`updated the docs for vite, react 19 and react router 7`
