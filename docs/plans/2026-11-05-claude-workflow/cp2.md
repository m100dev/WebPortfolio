# Checkpoint 2: Principles + CLAUDE.md split

## Context
CP1 shipped the cert, tag and archive changes. This CP makes `CLAUDE.md` lean and puts "security over quality over speed" first. It keeps every load-bearing gotcha by moving the detail into nested `CLAUDE.md` files, which Claude Code loads only when it works in those folders.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added my aws certs with renewal status, a terraform tag and archived the sysadmin plan`

## Prerequisites
- [ ] On `chore/claude-workflow`, and the CP1 commit is in `git log --oneline -5`.
- [ ] `npm test -- --watchAll=false` passes.
- [ ] **Before** editing, run `/context` and record the "Memory files" tokens (about 3.1k for `CLAUDE.md`).

## Decisions
### D1: Where the detail goes
- **Chosen:** nested files:
  - `src/content/CLAUDE.md`: guides, memos and Ask Marc rules;
  - `src/components/CLAUDE.md`: the section pattern, design tokens and CSS gotchas;
  - `infra/visitor-counter/CLAUDE.md`: the counter, its hook and the "no apply without asking" rule.
- **Over:** a `docs/` reference file that the root links to.
- **Because:** nested files load automatically in the right place. A linked doc only gets read if the agent decides to read it.
- **Trade-off:** four files to keep in sync. The `pre-commit-checklist` skill (CP3b) reminds me to update them.

## Steps
1. **Root `CLAUDE.md`**, about 25–35 lines, in this order:
   - **Principles:**
     - Security over quality over speed. Never skip a security check or review to ship faster.
     - Run `security-audit` and `vuln-check` for changes that touch auth, input, secrets, infra or dependencies.
     - Tests and `CI=true npm run build` pass before every commit. Every change gets Marc's review.
     - Best patterns over clever one-offs: established React and Terraform practice, design tokens, least-privilege IAM.
     - A placeholder line for the commit hook, which CP3b fills in.
   - **Commands:** the current list, condensed. Don't eject.
   - **Hard rules:**
     - don't `terraform apply`, change Amplify settings, push or change repo visibility without asking;
     - commit style is lowercase, past tense, one line.
   - **Map:** routes in one line, plus where the nested `CLAUDE.md` files are.
   - **Skills:** the list in `.claude/skills/`, one line each, filled in as later CPs add them.
2. **Move the content from the current `CLAUDE.md`, without dropping any rule:**
   - lines covering Guides, Memos and Ask Marc → `src/content/CLAUDE.md`;
   - the styling section and the per-section component pattern → `src/components/CLAUDE.md`;
   - the visitor counter paragraph → `infra/visitor-counter/CLAUDE.md`;
   - Amplify hosting and the redirects allowlist stay in the root, short, because they're cross-cutting.
3. **Check nothing was lost:** diff the old file against the union of the new files. Every rule appears exactly once.

## Verification
- Run `/context` after the split. Expected: noticeably fewer "Memory files" tokens. Record before and after in this file under `## Results`.
- **Spot check:** in a fresh session, read `src/content/memos/index.js`. `src/content/CLAUDE.md` should show up as loaded.
- `npm test -- --watchAll=false` passes. This is docs only, so the build isn't needed.

## Commit
`added security first principles and split claude.md into nested files`

## Key source files
- `CLAUDE.md`: the current single file, the source for the split.

## Results
- Before: `/context` showed Memory files = 3.4k tokens, of which `CLAUDE.md` = 3.1k (7,690 chars, 64 lines).
- After, root `CLAUDE.md`: 2,776 chars, 38 lines. That's 36% of the old size, so about 1.1k tokens estimated by character ratio.
- Measured after, in a fresh session (2026-11-05): `/context` shows Memory files = 1.5k tokens, of which `CLAUDE.md` = 1.2k (`MEMORY.md` = 373). That's 3.1k → 1.2k for `CLAUDE.md`, about 61% fewer tokens every session.
- **Re-measured 2026-11-06,** after the CP3b–CP7 lines (hooks, skills, graphify) grew the root to 4,830 chars and 49 lines. A fresh session's `/context` shows 41.1k total, with `CLAUDE.md` = 2.2k. That's 3.1k → 2.2k now, about 29% fewer tokens every session. The split alone had reached 1.2k.
- Spot check passed: reading `src/content/memos/index.js` in a fresh session loaded `src/content/CLAUDE.md` automatically (its Guides and Memos rules appeared in context).
- Nested files, loaded only in their folder:
  - `src/components/CLAUDE.md`: 2,636 chars;
  - `src/content/CLAUDE.md`: 1,909 chars;
  - `infra/visitor-counter/CLAUDE.md`: 1,146 chars.
- Deviations from the steps:
  - The Ask Marc rule went to `src/components/CLAUDE.md`, because `AskMarc.jsx` lives there, so the rule loads where it's needed.
  - No hook placeholder line was added. CP3b adds the commit-hook line itself.
- Additions (facts, not new policy):
  - why `default_tags` were removed;
  - plan, validate and fmt are fine, and state must never be printed;
  - the memo voice rule.

## Handoff
The root `CLAUDE.md` is lean and starts with the principles. The detail lives in three nested files. CP3 builds the security tooling those principles point to.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp3.md`
