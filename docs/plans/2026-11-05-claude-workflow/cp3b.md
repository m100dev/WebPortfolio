# Checkpoint 3b: Pre-commit enforcement

## Context
CP3 added `vuln-check` (a tested script) and the `security-audit` skill. On their own those are optional, so this CP makes them, the tests and lint **mandatory** before any commit. Commits made by Claude and commits made by me both go through the same checks.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added the vuln check script with fixtures and the security audit skills`

## Prerequisites
- [ ] The CP3 commit is in `git log --oneline -5`.
- [ ] `npm run test:security` and `npm test -- --watchAll=false` pass.
- [ ] Load the `update-config` skill before writing `.claude/settings.json`.

## Decisions
### D1: Hooks enforce, the skill judges
- **Chosen:** a Node checker called from a Claude `PreToolUse` hook and from a git `pre-commit` hook. The `pre-commit-checklist` skill handles the judgment items.
- **Over:** the skill alone.
- **Because:** only a hook that exits non-zero actually blocks.
- **Trade-off:** each commit takes longer (tests run every time).

### D2: Plain `.githooks/` over Husky
- **Chosen:** `.githooks/`, with `"prepare": "git config core.hooksPath .githooks"` in `package.json`.
- **Over:** Husky.
- **Because:** no extra dependency, and it's easy to read.
- **Trade-off:** each clone needs `npm install` to activate it (`prepare` runs automatically).

### D3: Where the full build runs
- **Chosen:** `pre-push` runs `CI=true npm run build`.
- **Over:** running it on every commit.
- **Because:** the build takes 30–60 seconds. ESLint on staged files already catches what makes Amplify's CI build fail.
- **Trade-off:** a build-only break shows up at push, not at commit.

## Steps
1. **`tools/precommit/check.js`** reads `git diff --cached --name-only --diff-filter=ACMR` and classifies the staged files. Checks, in order (block = exit 1 with a clear reason):
   1. `gitleaks git --staged --config .gitleaks.toml` (gitleaks 8.30 form, verified in CP3; the config flag is required for the fixtures allowlist);
   2. `vuln-check` on staged `.js` / `.jsx`, **excluding `tools/vuln-check/fixtures/`** (vulnerable on purpose; also exclude them from the test heuristic in 6);
   3. `npx eslint --max-warnings=0` on staged `src/**/*.{js,jsx}`;
   4. `npm test -- --watchAll=false` and `npm run test:security`;
   5. `python -m unittest` in `infra/visitor-counter/lambda` if staged files are under it; `terraform fmt -check` if `*.tf` files are staged;
   6. **Test heuristic:** staged logic files (`src/hooks/*.js`, `src/content/**/index.js`, `tools/**/*.js`, `lambda/*.py`) with no test file → **block**. A test file exists but isn't staged → **warn**;
   7. `npm audit --omit=dev --audit-level=high` → block on findings, **warn** if offline.
   - **Docs-only commits** (only `.md` or images) run checks 1 and 7.
   - Export the classifier for tests.
2. **`tools/precommit/check.test.js`** (`node:test`): file classification (docs-only, logic, infra, lambda) and the test-heuristic decisions.
3. **`tools/precommit/claude-hook.js`** reads the hook JSON from stdin.
   - If `tool_input.command` contains `--no-verify` → exit 2: "Don't bypass the pre-commit hook".
   - If it contains `git commit` → run `check.js`. On failure, exit 2 with its output on stderr.
   - Otherwise → exit 0.
4. **`.claude/settings.json`** (committed): a `PreToolUse` hook, matcher `Bash`, command `node tools/precommit/claude-hook.js`.
5. **`.githooks/pre-commit`** → `node tools/precommit/check.js`. **`.githooks/pre-push`** → `CI=true npm run build`. Both are POSIX sh, which Git for Windows runs in its bash.
6. Add the `prepare` script to `package.json`, then run `npm run prepare` once.
7. **`.claude/skills/pre-commit-checklist/SKILL.md`**: the judgment layer Claude runs before proposing a commit:
   - tests cover the new behaviour, not just exist;
   - touches auth, input, secrets, infra or deps → run `security-audit`;
   - guide changed → bump `version` / `updated` and add a `changes` entry;
   - memo → `draft` and `date` set on purpose;
   - Ask Marc copy still comes from site copy;
   - conventions changed → update the right `CLAUDE.md`;
   - commit message in Marc's style.
   - Header: why it exists, and when not to use it (it doesn't replace the hook).
8. **Root `CLAUDE.md` Principles:** replace the placeholder with: "Commits go through the pre-commit hook (secrets, vuln-check, lint, tests). Never bypass it. Run `pre-commit-checklist` before proposing a commit. Pre-push runs the CI build." Add the skill to the skills list.

## Verification
- **Blocked case:** stage a scratch file in `src/` that contains `eval(location.hash)`, then `git commit`. Expected: blocked with a `vuln-check` reason. Unstage it and delete it.
- **Bypass case:** ask Claude to `git commit --no-verify`. Expected: the hook refuses.
- **Clean case:** the CP's real commit goes through the hook and passes.
- `npm run test:security` passes, including the classifier tests.

## Commit
`added pre-commit and pre-push hooks with the pre-commit checklist skill`

## Handoff
Every commit now passes secrets, vuln-check, lint and tests, and every push passes the CI build. CP4 and CP5 can run in either order.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp4.md`
