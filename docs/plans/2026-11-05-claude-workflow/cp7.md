# Checkpoint 7: Visual results guide (and no draft memos in the build)

## Context
Re-planned on 2026-11-06 (master plan D7). It was a backlog prose guide. It's now a visual-first guide that presents the workflow's **measured** results, built before the repo goes public, so the README from CP6 can link to it ("See the visual version"). Reviewers skim. A designed page with real numbers, including the null ones, also shows design and data presentation.

The page opens with the same framing as the README: the tooling is intentional overkill, a public slice of how I build MyAutoTab. A static site doesn't need it, and the savings show up on large codebases with agents.

This CP also closes a leak found while planning. Draft memo bodies ship in the production build today.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue, so the README and the page merge together)
**Prior CP commit:** `added a build log` (CP6)

## Prerequisites
- [ ] `git log --oneline -5` shows the CP6 commits.
- [ ] `npm run test:once`, `npm run test:security` and `npm run build` pass.
- [ ] The CP2, CP3, CP3b, CP4 and CP5 `## Results` sections are filled in. They are the only allowed source of numbers.

## Decisions
### D1: One data source
- **Chosen:** `src/content/guides/workflow/data.js` holds every number on the page. Each number carries a `source` field naming the CP file it came from.
- **Over:** numbers written inline in JSX.
- **Because:** the README, the build log and this page must never disagree. One file, checked against the CP Results, prevents drift.
- **Trade-off:** a little indirection for a one-page guide.

### D2: Hand-built SVG/CSS charts
- **Chosen:** small SVG and CSS visuals using the `src/index.css` tokens.
- **Over:** a chart library (Recharts, Chart.js).
- **Because:**
  - no new runtime dependency to audit;
  - a small lazy chunk;
  - full control of both themes;
  - it shows the skill rather than a library's defaults.
- **Trade-off:** more code per chart. Keep to 4–5 simple visuals.

### D3: Null results presented on purpose
- **Chosen:** near-zero results (dedupe −0.03 kB, graphify −0.5%) shown as an annotated "measured, expected at this size" callout, with the fixed overhead shaded.
- **Over:** bars of the same style as the big wins, which would read as failure.
- **Because:** the page's point is *measured, not claimed*. An honest null result, clearly explained, is the strongest data-presentation signal.
- **Trade-off:** it needs careful copy, which Marc reviews.

## Content (sections, in order)
1. **Framing:** one short paragraph, as in the README (intentional, MyAutoTab slice, payoff at scale). Tool-agnostic, with Claude Code as the worked example (matches the AI autonomy guide).
2. **How I build:** a flow diagram: spec → checkpointed plan → tests → hooks (enforce) → skills (judge) → my review.
3. **Context** (`cp2.md`): `CLAUDE.md` 3.1k → 1.2k tokens per session (−61%). Nested files load only in their folder.
4. **Gates** (`cp3.md`, `cp3b.md`):
   - security tests 6 → 32;
   - a matrix of every bypass attempt and its result, including the 2 discovered and fixed (`--no-veri`, `core.hooksPath` + commit);
   - the eval probe blocked (CP3b, and again in CP5).
5. **Quality** (`cp4.md`): total JS/CSS gz before and after (227.29 → 227.27 kB, 13.25 → 13.24 kB); 236 kB of unused assets deleted; visual diff byte-identical.
6. **graphify** (`cp5.md`): 3 questions × with/without, 161.6k → 160.8k tokens, all answers correct. The D3 treatment, plus a one-line note on why (a small repo; grep finds the file in 1–2 calls).
7. **Links:** the repo's `.claude/skills/`, `tools/`, `.githooks/` and `docs/plans/`.

**Honesty rules:**
- `npm audit` 78 → 0 (the toolchain plan's measured number; CP3 here saw 77 before the babel fix) came from the Vite toolchain upgrade, not this workflow. Leave it out or attribute it correctly.
- No claims about large-repo savings with a number unless measured.
- MyAutoTab is "built to production standards" (it's in staging).
- The site's palette only; no vendor look.

## Steps
1. **Guide entry** in `src/content/guides/index.js`:
   - `slug: 'how-i-build-with-ai-agents'` (the README already links to it);
   - eyebrow, title, summary, tags, `readingTime`, `license: true`;
   - `version: '1.0'`, `updated`, `changes: [{ version: '1.0', date, note: 'First published.' }]`;
   - `Component: lazy(() => import('./HowIBuildWithAiAgents'))`.
2. **Body** `src/content/guides/HowIBuildWithAiAgents.jsx` plus `workflow/data.js` and `workflow/workflow.css`, following the `ai-autonomy/` pattern (component + data + scoped CSS). Rendered inside the existing `src/components/guides/GuideLayout.jsx` (hero, table of contents from the h2s).
3. **Charts:** each is a `<figure>` with a `<figcaption>` stating the numbers in words, plus a visually hidden table where the chart encodes more than 2 values. Colours only through tokens. Card surfaces use `box-shadow: var(--shadow-card)` (`src/components/CLAUDE.md`).
4. **Draft memos out of production** (separate commit):
   - `src/content/memos/index.js:1-4` statically imports every `.md?url`, so `_template-*.md` lands in `build/assets/` and its URL is in the main bundle.
   - Give draft entries a loader only in development, so a production build drops it (a dev-only dynamic `import()` behind `import.meta.env.PROD`). `src/pages/Memo.jsx:29` then resolves the loader before `fetch`.
   - Scheduled memos (`draft: false`, future date) must still ship.
   - Add or extend a memo test for the loader behaviour.

## Verification
- `npm run test:once` passes (`guides.test.js` checks the version entries), as do `npm run test:security` and `npm run build`.
- `npm run vuln-check -- src/content/guides src/content/memos src/pages` is clean.
- Every number in `workflow/data.js` matches its CP `## Results` line. Spot-check them all.
- Visual check:
  - headless Chrome screenshots (see the `portfolio-browser-testing` memory recipe) of `/guides/how-i-build-with-ai-agents`;
  - light and dark, 390px and desktop;
  - no horizontal scroll.
- Run the `design:accessibility-review` skill on the page: contrast, chart text alternatives, heading order.
- After `npm run build`: `ls build/assets | grep _template` returns nothing, and `grep -l _template build/assets/*.js` returns nothing.
- `pre-commit-checklist` before each commit.

## Commit
- `stopped draft memos from shipping in the production build`
- `added a visual guide to the claude workflow results`

## Results (2026-11-06)
- **Prerequisites:** `4d35f14` at HEAD. 35/35 Vitest, 32/32 security, build clean.
- **Commits:**
  - `92cfb74`: draft memos out of the build;
  - `ce6adc5`: the guide.
  - Both passed the pre-commit hook.

**Draft memos out of the build**
- Drafts moved to a `drafts` array inside `import.meta.env.DEV ? [...] : []`, with `load: () => import('./x.md?url')`. `memoUrl()` resolves `file` or `load`, and `Memo.jsx` fetches through it.
- **Deviation:** the planned per-entry loader wasn't enough.
  - **[DISCOVERED]** A `devOnly(load)` helper isn't constant-folded: `_template-*.md` and a chunk still shipped.
  - **[DISCOVERED]** With the condition inlined, the draft's slug, title and summary still sat in the main bundle. For a real unreleased memo, that leaks its title.
  - Folding the whole drafts array drops all three.
- **After `npm run build`:**
  - `ls build/assets | grep -i template` and `grep -l -e _template -e "Memo template" build/assets/*.js` both return nothing;
  - the 3 published memos' `.md` still ship.
- **Dev preview:** `/memos/_template` on the dev server renders with the "Draft · not published" badge.
- **Tests:** 3 new memo tests (no static `file` on drafts, `memoUrl` paths, the real loader in dev).

**Guide**
- **Route:** `/guides/how-i-build-with-ai-agents`. A lazy chunk of 4.78 kB gz JS + 1.20 kB gz CSS. The main entry is 111.65 kB gz (+0.15 kB: the guide's metadata).
- **Data:** `workflow/data.js` holds every number, each with a `source` and an exact `quote`.
  - `workflow/data.test.js` (31 cases) checks each quote is in its source file, each charted value appears in its quote, and the README's 3 headline numbers match.
  - **[DISCOVERED]** It caught one mis-citation while I wrote it: "all answers correct both ways" is in the master plan, not cp5. Fixed.
- **Numbers spot-checked:** all of them, mechanically, by the test.
  - cp2: 3.1k → 1.2k, −61%;
  - cp3 → cp3b: 6 → 32 tests, plus the 6 matrix rows (2 found and fixed, eval blocked, nested shell as a known limit);
  - cp4: 227.29 → 227.27 / 13.25 → 13.24 kB gz, −0.03 kB, 236 kB, byte-identical;
  - cp5: a/b/c and 161,614 → 160,809, −0.5%;
  - toolchain cp4: npm audit 78 → 0, credited to the toolchain upgrade, not this workflow.
- **Deviations:**
  - No shaded "fixed overhead" on the graphify bars. cp5 only says "~50k, mostly fixed", which isn't measured, so the callout says it in words.
  - "See the code" lists the paths as plain text (Marc's call: the repo URL isn't recorded yet).
  - Guide `repo: null` until the repo is public.
- **Visual** (headless Chrome, `vite preview`; screenshots in the session scratchpad):
  - light and dark at 1440 and 390;
  - `scrollWidth == clientWidth` in all 4.
  - **[DISCOVERED]** `.visually-hidden` on a `<table>` doesn't clip (tables ignore width/overflow). It pushed the 390px layout to 608px. Fixed with a wrapper div.
- **Accessibility** (`design:accessibility-review`, measured in the page):
  - every text style passes AA in both themes (lowest 4.52:1, light);
  - bars and swatches are 4.86:1 or better (3:1 needed);
  - heading order h1 → 8 h2s;
  - every chart is a `<figure>` with a `<figcaption>` stating the numbers;
  - the graphify chart is `aria-hidden` with a hidden table carrying all 8 values;
  - the bypass matrix is a real table with a caption;
  - outcome badges are text, not colour alone;
  - no interactive controls added.
- **Checks:**
  - vuln-check on `src/content/guides src/content/memos src/pages`: no findings;
  - `npm run test:once` 70/70, `test:security` 32/32, build clean;
  - 12-digit scan of the staged diff: none.
- **Copy corrections (follow-up commit, review pass):** the drift test only checks numbers, not the prose around them. Three sentences overclaimed against the records:
  - "the screenshots were byte-identical". cp4 says only the touched sections were, apart from the carousel, and the tag style changed on purpose;
  - "each in a fresh session". cp5 used fresh subagents;
  - "a hook … can't be skipped" and "Every bypass attempt". These became the D1 wording and "Bypass attempts from the test matrix, plus the known limit".
  - The guide stays at v1.0, because it's unpublished.
  - **For Marc:** the first-person lines, e.g. "Then I tested the hooks against bypass attempts", are his call.

## Handoff
The code is done. Marc's launch steps:
1. Push, open a PR, review it and merge. Amplify deploys. Then replace the build log's "in review" heading with the PR number and merge date.
2. Check the guide live, then make the repo public.
3. Switch the site card's `repo` to the GitHub URL, and save the live site on web.archive.org.
4. Release the memos per Marc's local launch plan.

Then mark the master plan `## Status: COMPLETE`.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: none, this is the final checkpoint
