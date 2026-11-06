---
name: dedupe
description: >
  Use when asked to find or remove duplication across this repo (repeated JSX, duplicate
  CSS rules or media queries, hardcoded colours that should be design tokens,
  near-duplicate hooks, unused assets or exports). Sweeps the whole codebase against
  this repo's conventions, reports a table first, applies only the rows Marc approves,
  and proves with measured gzipped bundle sizes that the refactor didn't grow the site.
---

# dedupe

**Why this exists:** duplication creeps in one "quick copy" at a time, and a refactor that removes it can still make the site bigger or change how it looks. This skill finds the real copies, lets me choose, and measures the result instead of claiming it.
**When not to use it:** to review a single diff. Use the built-in `/simplify` for that. It looks at what changed, and this looks at the whole of `src/`.

## Rule of three
Only extract a shared component, hook or CSS rule when there are **3 or more real copies**. Two similar cards often grow apart later, and the wrong abstraction costs more than the duplication. Pairs go in the report as "keep" so the decision is visible. Exceptions that don't need three copies:
- a hardcoded colour where a `var(--…)` token from `src/index.css` already exists (it's a rule in the root `CLAUDE.md`);
- dead code: an unused asset, export or CSS class.

## 1. Baseline
Run `npm run build` and record the gzipped size of **every** JS and CSS chunk it prints (`index-*` and the lazy guide/memo chunks), plus the totals. A refactor can move bytes between chunks, so `index-*` alone isn't enough.

## 2. Find
Sweep `src/` for:
- **repeated JSX:** the same markup block in 3+ components where the repo convention is a `data` array mapped once (see `src/components/CLAUDE.md`);
- **duplicate CSS:** identical rule bodies and repeated `@media` blocks across component stylesheets. Shared page styles belong in `src/pages/pages.css` (`.page`, `.page-intro`, `.prose`);
- **hardcoded colours:** hex, `rgb()` or `hsl()` values in `.css`/`.jsx` outside `src/index.css`, when a token exists or should;
- **near-duplicate hooks** in `src/hooks/`;
- **unused assets and exports:** files in `src/assets/` that nothing imports, and exports with no importer.

Check each candidate by reading the code, not just matching text. Leave out generated or ported files whose shape is on purpose (for example `AvdEnterpriseWorkspace.jsx` and its scoped `avd/` stylesheet, see `src/content/CLAUDE.md`), and note them as excluded.

## 3. Report first
Show a table and stop:

| # | Finding | Copies | Proposed change | Risk |
|---|---------|--------|-----------------|------|

- **Copies:** the file paths with line numbers.
- **Risk:** what could change visually or behaviourally (stylesheet order, specificity, a theme's token value).
- Then list the pairs you're keeping under the rule of three.

## 4. Apply only the approved rows
- One row at a time. Keep behaviour and appearance the same.
- Swapping a hex for a token only counts as "no change" if the token has the same value in both themes. Otherwise say so in the Risk column.
- Tests and the build stay green: `npm run test:once` and `npm run build`.

## 5. Measure and verify
- Rebuild and report before → after for each chunk and for the totals. The delta should be ≤ 0, or explained.
- Visual spot check in headless Chrome: home, a guide and a memo, in both themes if colours changed.
- Run `vuln-check` on any changed JS/JSX.
