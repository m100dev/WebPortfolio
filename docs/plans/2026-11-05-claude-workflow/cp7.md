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
