# Checkpoint 3b: Pre-commit enforcement

## Context
CP3 added `vuln-check` (a tested script) and the `security-audit` skill. On their own those are optional, so this CP makes them, the tests and lint **mandatory** before any commit. Commits made by Claude and commits made by me both go through the same checks.

**Refreshed 2026-11-06 after the rebase onto the toolchain upgrade** (`3e5c25a`): Vite 8, Vitest, ESLint 10 flat config, Node ≥24.15. Commands, D3 and the gaps marked `[DISCOVERED]` below changed; the rest is as planned.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added the vuln check script with fixtures and the security audit skills` (rebased; the post-rebase fix-up `ported the toolchain facts into the split claude.md files after the rebase` follows it)

## Prerequisites
- [ ] The CP3 commit is in `git log --oneline -5`.
- [ ] `npm run test:security` and `npm run test:once` pass.
- [ ] `node --version` is ≥24.15 **without** a PATH prefix (the hooks inherit the default Node; Marc runs `fnm default 24.22.2` if it shows 24.13).
- [ ] Load the `update-config` skill before writing `.claude/settings.json`.

## Decisions
### D1: Hooks enforce, the skill judges
- **Chosen:** a Node checker called from a Claude `PreToolUse` hook and from a git `pre-commit` hook. The `pre-commit-checklist` skill handles the judgment items.
- **Over:** the skill alone.
- **Because:** only a hook that exits non-zero actually blocks.
- **Trade-off:** each commit takes longer (tests run every time).

### D2: Plain `.githooks/` over Husky
- **Chosen:** `.githooks/`, set by a `prepare` script in `package.json`.
- **Over:** Husky.
- **Because:** no extra dependency, and it's easy to read.
- **Trade-off:** each clone needs `npm install` to activate it (`prepare` runs automatically).
- **[DISCOVERED]** `prepare` also runs in Amplify's `npm ci`, so it now sits in the production build path. It must never fail: `node tools/precommit/install-hooks.js`, which sets `core.hooksPath` only when `.git` exists and `git` succeeds, and otherwise exits 0.

### D3: Where the full build runs (re-decided 2026-11-06)
- **Chosen:** pre-commit runs `npm run build` (whole-repo `eslint . --max-warnings=0`, then `vite build`) for any non-docs commit, replacing the planned staged-only ESLint. Pre-push runs `npm run build` again.
- **Over:** the original plan, build at pre-push only and ESLint on staged files at commit.
- **Because:** the original "Because" was a 30–60s CRA build. Measured on Vite: `eslint .` 1.8s, `vite build` 0.27s, `npm run build` about 2s (toolchain `cp4.md` Results). At that cost, a build-only break (bad import, missing asset) should surface at commit. Pre-push stays as the backstop for commits that never ran pre-commit (rebase, cherry-pick, `git commit` made before `prepare`).
- **Trade-off:** the checks run on the working tree, not the staged snapshot, so unstaged broken work in another file can block an unrelated commit. Accepted: `git stash --keep-index` in a hook risks losing work.

## Steps
1. **`tools/precommit/check.js`** reads `git diff --cached --name-only --diff-filter=ACMR` and classifies the staged files. Checks, in order (block = exit 1 with a clear reason):
   1. `gitleaks git --staged --config .gitleaks.toml` (gitleaks 8.30 form, verified in CP3; the config flag is required for the fixtures allowlist);
   2. `vuln-check` on staged `.js` / `.jsx`, **excluding `tools/vuln-check/fixtures/`** (vulnerable on purpose; also exclude them from the test heuristic in 6);
   3. `npm run build` (D3). It lints `src/` and `tools/` (the flat config lints `tools/**/*.js` as Node CJS). **[DISCOVERED]** If a later change goes back to passing file lists to ESLint, add `--no-warn-ignored`: an ignored fixture passed explicitly gives a warning, and `--max-warnings=0` turns it into exit 1 (checked 2026-11-06);
   4. `npm run test:once` and `npm run test:security`. **Never plain `npm test`**, which is now Vitest watch mode and can hang a hook that has a TTY;
   5. `python -m unittest` in `infra/visitor-counter/lambda` if staged files are under it; `terraform fmt -check` if `*.tf` files are staged;
   6. **Test heuristic:** staged logic files (`src/hooks/*.js`, `src/content/*/index.js`, `tools/**/*.js`, `lambda/*.py`) with no test → **block**. A test exists but isn't staged → **warn**.
      - **"Has a test"** means a `*.test.js` / `*.test.jsx` (or `test_*.py`) in the same folder, not only `<name>.test.*`. Example: `src/content/memos/index.js` is covered by `memos.test.js`.
      - **[DISCOVERED]** `src/content/guides/index.js` has no test, and every guide edit bumps its `version`, so the heuristic would block every guide change. Add `src/content/guides/guides.test.js`: unique slugs, and every guide has `version`, `updated` and a non-empty `changes`.
      - The other hooks without tests (`useActiveSection`, `useDocumentTitle`, `useHashScroll`, `useReveal`, `useVisitorCount`) block when staged. That's on purpose: the next edit to one of them brings a test.
   7. `npm audit --omit=dev --audit-level=high` → block on findings, **warn** if offline. Enforceable since the toolchain upgrade (0 advisories).
   - **Docs-only commits** (only `.md` or images) run checks 1 and 7.
   - Export the classifier for tests.
2. **`tools/precommit/check.test.js`** (`node:test`): file classification (docs-only, logic, infra, lambda), the same-folder test lookup, and the test-heuristic decisions.
3. **`tools/precommit/claude-hook.js`** reads the hook JSON from stdin.
   - If `tool_input.command` is a `git commit` with `--no-verify` or `-n` (including combined short flags such as `-nm`) → exit 2: "Don't bypass the pre-commit hook".
   - Otherwise, if it contains `git commit` → run `check.js`. On failure, exit 2 with its output on stderr.
   - Otherwise → exit 0.
   - Export the matcher. **[DISCOVERED]** Add `tools/precommit/claude-hook.test.js`, or the heuristic in 1.6 blocks this CP's own commit. It covers the bypass forms, `git commit` vs `git commit-tree`/`git log`, and commands chained with `&&` / `;`.
4. **`.claude/settings.json`** (committed): a `PreToolUse` hook, matcher **`Bash|PowerShell`**, command `node tools/precommit/claude-hook.js`. **[DISCOVERED]** The harness also has a PowerShell tool; a Bash-only matcher lets `git commit --no-verify` through it.
5. **`.githooks/pre-commit`** → `node tools/precommit/check.js`. **`.githooks/pre-push`** → `npm run build`. Both are POSIX sh, which Git for Windows runs in its bash.
6. Write `tools/precommit/install-hooks.js` (D2) with a test, add `"prepare": "node tools/precommit/install-hooks.js"` to `package.json`, then run `npm run prepare` once.
7. **`.claude/skills/pre-commit-checklist/SKILL.md`**: the judgment layer Claude runs before proposing a commit:
   - tests cover the new behaviour, not just exist;
   - touches auth, input, secrets, infra or deps → run `security-audit`;
   - guide changed → bump `version` / `updated` and add a `changes` entry;
   - memo → `draft` and `date` set on purpose;
   - Ask Marc copy still comes from site copy;
   - conventions changed → update the right `CLAUDE.md`;
   - commit message in Marc's style.
   - Header: why it exists, and when not to use it (it doesn't replace the hook).
8. **Root `CLAUDE.md` Principles:** add: "Commits go through the pre-commit hook (secrets, vuln-check, build, tests, audit). Never bypass it. Run `pre-commit-checklist` before proposing a commit. Pre-push runs `npm run build`." Add the skill to the skills list.

## Verification
Run the git-hook cases **without** the fnm PATH prefix, so they see the same Node the hooks do.
- **Blocked case:** stage a scratch file in `src/` that contains `eval(location.hash)`, then `git commit`. Expected: blocked with a `vuln-check` reason. Unstage it and delete it.
- **Bypass case:** ask Claude to `git commit --no-verify`, once through Bash and once through PowerShell, plus `git commit -n`. Expected: the hook refuses all three.
- **Clean case:** the CP's real commit goes through the hook and passes.
- **`prepare` safety:** `npm run prepare` exits 0 in the repo, and also from a copy with no `.git` (e.g. a scratch folder).
- `npm run test:security` passes, including the classifier, Claude hook and install tests. `npm run test:once` passes with the new guides test.

## Commit
`added pre-commit and pre-push hooks with the pre-commit checklist skill`

## Handoff
Every commit now passes secrets, vuln-check, the build, tests and the audit, and every push passes the build again. CP4 and CP5 can run in either order.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp4.md`
