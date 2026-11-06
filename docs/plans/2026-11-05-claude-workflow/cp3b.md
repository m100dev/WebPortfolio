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

### D3: Where the full build runs (re-decided 2026-11-06, confirmed by Marc)
- **Chosen:** pre-commit runs `npm run build` (whole-repo `eslint . --max-warnings=0`, then `vite build`) for any non-docs commit, replacing the planned staged-only ESLint. Pre-push runs `npm run build` again.
- **Over:** the original plan, build at pre-push only and ESLint on staged files at commit.
- **Because:** the original "Because" was a 30–60s CRA build. Measured on Vite: `eslint .` 1.8s, `vite build` 0.27s, `npm run build` about 2s (toolchain `cp4.md` Results). At that cost, a build-only break (bad import, missing asset) should surface at commit. Pre-push stays as the backstop for commits that never ran pre-commit (rebase, cherry-pick, `git commit` made before `prepare`).
- **Trade-off:** the checks run on the working tree, not the staged snapshot, so unstaged broken work in another file can block an unrelated commit. Accepted: `git stash --keep-index` in a hook risks losing work.

### D4: Local hooks are the demo; a production gate would be server-side (decided 2026-11-06, Marc)
- **Chosen for this portfolio:** keep the remaining bypass paths as documented known limits (Results): a nested shell, the hook failing open, and push without `--verify`. No more client-side hardening.
- **Over:** chasing every bypass in `claude-hook.js`.
- **Because:** anything on the developer's machine can be bypassed: `--no-verify`, another shell, editing the hook, or deleting `.githooks/`. Better parsing can't close that. For a public portfolio with one author, the local layer shows the workflow, and the cost of a bypass is a bad commit Marc reviews anyway.
- **Trade-off:** for real client work this isn't enough. The production path below treats local hooks as fast feedback, and makes the server the gate that a bypassed commit can't get past:
  1. **Protected `main`** (GitHub ruleset or branch protection): changes only through a PR, no force-push or deletion, linear history, and **no admin bypass**.
  2. **CI as the required status check:** the same checks as `check.js` (gitleaks over the PR range, vuln-check, `npm run build`, both test suites, Lambda tests, `terraform fmt`/`validate`, `npm audit --audit-level=high`), run on every PR. A commit made with `--no-verify` still fails here before it can merge.
  3. **Required human review plus `CODEOWNERS`** for the guard rails themselves: `.githooks/`, `.claude/`, `tools/precommit/`, `infra/`, `package.json`, `package-lock.json`. Weakening a check then needs a second person.
  4. **Platform scanning:** GitHub secret scanning with push protection (blocks a secret at `git push`, before it's in the remote), Dependabot alerts and security updates.
  5. **Deploy only from protected `main` after CI passes.** Amplify builds only the protected branch, triggered after the checks rather than on every push. Production AWS credentials never sit on a developer machine or with the agent.
  6. **Agent side:** run Claude Code sandboxed, deny `git push` and edits to `.claude/settings.json` and `.githooks/` in permissions, and deliver the hooks via managed settings (`allowManagedHooksOnly`) with `"onFailure": "block"`, so a repo edit can't turn the guard off and a crash fails closed.
  7. **Signed commits required** on `main`, so the author on every merged change is verified.
  - With 1–3 in place, the nested-shell and fail-open limits stop mattering: a bypassed commit can still be made locally, but it can't reach `main` or production.

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

## Results (2026-11-06)
- **Session:** Claude Opus 5.5 (`claude-opus-5-5`, 1M window). The same session did the rebase (toolchain `cp4.md` "After merge" 2–4). `/context` 42.1k/1m (4%) at start → 283.4k (28%) at the end, rebase included (Messages row 241.5k). That's under the 60% handoff line.
- **Node:** the machine default was 24.13 (`C:\Program Files\nodejs`, ahead of fnm on PATH), below `engines`, and git hooks inherit it. Marc upgraded the system Node to **26.13.0** (LTS). `npm ci`, the build, both test suites and the audit pass on it. **[DISCOVERED]** Amplify still builds on Node 24, so local and production now differ by one major version. Low risk for this stack. To match, Marc sets Node 26 in the Amplify build spec.
- **Files:** `tools/precommit/` (`check.js`, `claude-hook.js`, `install-hooks.js`, each with a `node:test` file), `.githooks/pre-commit` and `pre-push`, `.claude/settings.json`, the `pre-commit-checklist` skill, `src/content/guides/guides.test.js`, the `prepare` script, and two root `CLAUDE.md` lines.
- **Implementation calls:**
  - **Test lookup:** a file is covered by `<name>.test.js(x)` or `test_<name>.py` beside it. An `index.js` is covered by any test in its folder. Stricter than "any test in the folder", so `claude-hook.js` can't pass on `check.test.js`.
  - **Claude hook:** it always refuses `--no-verify`, `-n` (including clusters like `-nm`) and `git -c core.hooksPath=…`. It runs `check.js` itself only when `core.hooksPath` isn't `.githooks`; otherwise the git hook already runs it at commit time. That avoids running the checks twice, and the git hook sees what `git commit -a` actually stages.
  - **Path:** the hook command uses `$CLAUDE_PROJECT_DIR`, because the session's cwd moves into subfolders.
  - **`check.js` runs every check before reporting,** so one run lists all the failures.
- **Verification:**

| Case | Result |
|---|---|
| Bypass via Bash: `git commit --no-verify` | refused by the PreToolUse hook (live) |
| Bypass via PowerShell: `git commit -n` | refused (live) |
| Pipe-test from `infra/` (`--no-verify`, `-nm`, `ls`) | exit 2, 2, 0 |
| Blocked: staged `src/scratch-vuln.js` with `eval(location.hash)`, Node 26 with no PATH prefix | blocked: `vuln-check: src/scratch-vuln.js:1 eval`; scratch file removed |
| `npm run prepare` | sets `core.hooksPath` to `.githooks`; exits 0 from a copy with no `.git` (`install-hooks.test.js`) |
| **[DISCOVERED]** Bypass via an abbreviated `git commit --no-veri` (git accepts unambiguous prefixes) | got through at first; fixed, now refused (live) |
| **[DISCOVERED]** `git config core.hooksPath … && git commit` in one command | fixed: refused when a commit follows a `core.hooksPath` change |
| `npm run test:security` | 32/32 (6 vuln-check + 26 new) |
| `npm run test:once` | 24/24 (18 + 6 guides) |
| `sh .githooks/pre-push` | exit 0 (lint + build) |
| Clean case | this CP's commit went through the hook: all checks passed in 6.0s |

- **`security-audit`** (the skill on this branch, read-only):

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Secrets in history | PASS | `gitleaks git --config .gitleaks.toml`: no leaks |
| 2 | Pending changes | PASS | `gitleaks git --staged` and `gitleaks dir` on `tools/precommit`, `.claude`, `.githooks`, `src/content/guides`: no leaks |
| 3 | Code patterns | PASS | `vuln-check src tools/precommit`: no findings; the one suppression (`Icon.jsx:18`) has a reason |
| 4 | Dependencies | PASS | `npm audit`: 0, with and without dev deps |
| 5 | IAM | PASS | `main.tf:79-86`: DynamoDB `GetItem`/`UpdateItem` on the table ARN and log writes on its own log group; no `"*"`, no `PassRole` |
| 6 | CORS | PASS | `main.tf:128-130`, `variables.tf:13-21`: www + apex + localhost:3000; GET/POST; `content-type` |
| 7 | EmailJS | NOTE | `Contact.jsx:8-9,70`: service, template and public key, public by design; no private key |
| 8 | External links | PASS | covered by #3 |
| 9 | `.gitignore` | PASS | tfstate, tfvars, `.env`, `.env.production`, `.env.local`, `.claude/settings.local.json` ignored; none tracked |
| 10 | `public/` | PASS | `favicon.svg`, `manifest.json` only |

- **New build-path code:** `prepare` (`install-hooks.js`) runs on every `npm install` and `npm ci`, Amplify's included. It only runs `git config core.hooksPath .githooks` and always exits 0, which is tested.
- **Known limits (accepted for this portfolio, D4; the production fix for each is in D4's list):**
  - A nested shell (`sh -c "git commit --no-verify"`, `pwsh -c ...`) isn't parsed, because the quoted string stays one token. The git hook doesn't run under `--no-verify`, so this is the one remaining bypass path.
  - The Claude hook's `onFailure` defaults to `continue`, so if the script crashes, the guard fails open. `"onFailure": "block"` would fail closed, but a broken hook would then stop every shell call.
  - `git push --no-verify` isn't guarded. Pushing is Marc's gate anyway. If guarded later, don't treat `-n` as a bypass for push: there it means `--dry-run`.

## Handoff
Every commit now passes secrets, vuln-check, the build, tests and the audit, and every push passes the build again. CP4 and CP5 can run in either order.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp4.md`
