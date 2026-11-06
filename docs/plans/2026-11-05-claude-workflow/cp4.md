# Checkpoint 4: comment-in-my-voice and dedupe

## Context
CP3b made the security checks, lint and tests mandatory on every commit. This CP adds two quality skills:
- `comment-in-my-voice`: sparse "why" comments that sound like me;
- `dedupe`: finds real duplication and proves with measured bundle sizes that refactors don't inflate the site.

Each one runs once, and I approve the results before commit. This CP doesn't depend on CP5, so they can run in either order.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added pre-commit and pre-push hooks with the pre-commit checklist skill`

## Prerequisites
- [ ] The CP3b commit is in `git log --oneline -5`.
- [ ] `npm run test:once` and `npm run test:security` pass.
- [ ] Run `npm run build` and **record the gzipped `build/assets/index-*.js` / `index-*.css` sizes** it prints (the baseline).

## Decisions
### D1: Rule of three for extraction
- **Chosen:** only extract a shared component, hook or CSS rule when there are 3 or more real copies.
- **Over:** extracting at 2.
- **Because:** two similar cards often diverge later, and the wrong abstraction costs more than duplication.
- **Trade-off:** some pairs of near-duplicates stay.

### D2: A custom dedupe skill next to `/simplify`
- **Chosen:** a project skill that knows this repo's patterns and measures the size delta.
- **Over:** only the built-in `/simplify`.
- **Because:** `/simplify` reviews a diff. `dedupe` sweeps the whole codebase against this repo's conventions (data arrays, design tokens, shared `.page` / `.prose` styles) and reports numbers.
- **Trade-off:** one more skill. Its header says when to use `/simplify` instead.

## Steps
1. **`.claude/skills/comment-in-my-voice/SKILL.md`**
   - Rules:
     - explain *why*, never restate *what*;
     - first person, plain and short: "I chose this because…", "this has to run before…";
     - no punchy closers or aphorisms;
     - never invent a reason, and if the reason isn't in the code, git history or plan docs, ask me;
     - only comment non-obvious spots (the 2–3 per file a new reader would trip on);
     - JSX comments use `{/* */}`.
   - Header: why it exists, and when not to use it (self-explanatory code, generated files).
2. **Demo** on 3 spots, then show me the diff before committing:
   - `src/content/memos/index.js`: why `date` doubles as the release date and uses the visitor's local date;
   - `src/hooks/useVisitorCount.js`: why one POST per browser session, then GETs only while the tab is visible;
   - `src/hooks/useHashScroll.js`: why it scrolls after the route change instead of relying on the browser.
3. **`.claude/skills/dedupe/SKILL.md`**
   - Find:
     - repeated JSX blocks across components;
     - duplicate CSS rules and media-query blocks;
     - hardcoded colours that should be `var(--…)` tokens;
     - near-duplicate hooks;
     - unused assets and exports.
   - Report first: a table with Finding | Copies | Proposed change | Risk.
   - Apply only the rows I approve.
   - Tests and the CI build stay green, and behaviour doesn't change.
   - Measure the gzipped JS and CSS before and after.
   - Header: why it exists, when not to use it (use `/simplify` for a single diff), and the rule of three.
4. **Run `dedupe` on `src/`**, present the table, and apply the approved rows.
5. Add both skills to the root `CLAUDE.md` skills list.

## Verification
- `npm run test:once`, `npm run test:security` and `npm run build` all pass.
- Record the size delta under `## Results`. It should be ≤ 0, or explained.
- Visual spot check: home, a guide and a memo look unchanged (headless Chrome).

## Commit
Commit each skill and its change separately:
- `added the comment in my voice skill and commented the tricky hooks`
- `added the dedupe skill and removed duplicate code`

## Results
- Baseline JS/CSS gz (2026-11-06, `567a313`, Node 26.13): `index-*.js` **111.53 kB** / `index-*.css` **8.71 kB**. After: ___ / ___.
- Baseline lazy chunks gz (so a dedupe can't just move bytes between chunks): `Memo` js 49.56; `AvdEnterpriseWorkspace` js 59.43 / css 1.99; `AiAutonomyLevels` js 6.77 / css 2.55. **Total JS 227.29 kB, total CSS 13.25 kB.** After: ___ / ___.
- Dedupe rows applied: ___ of ___.

## Handoff
The two quality skills exist, the demo comments are in, and the duplicates are reduced with a measured size delta. CP6 cites these numbers in the build log.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp5.md`
