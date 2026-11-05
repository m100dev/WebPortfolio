# Session Handoff Protocol

Defines the lifecycle for checkpoint-based multi-session work.

---

## End of checkpoint (before /clear)

Run these steps in order after completing a checkpoint's implementation:

1. **Verify** — run every command in the CP's `## Verification` section. All must pass. The pre-commit hook re-checks secrets, vuln-check, lint and tests; never bypass it with `--no-verify`.
2. **Commit** — use the exact commit message from the CP's `## Commit` section.
3. **Update master plan** — mark the completed CP as `[x]` (replacing `[ ]`) in both
   the `## Checkpoint overview` table and `## Status tracker`.
4. **Output resume paths** — print:
   ```
   Master plan: docs/plans/<date>-<slug>/masterplan.md
   Next CP: docs/plans/<date>-<slug>/cpN+1.md
   ```
5. **User runs `/clear`** — Claude cannot do this programmatically.

## Start of next checkpoint (fresh session)

1. **Load context** — read the master plan file and the next CP's detail file.
2. **Run prerequisites** — execute every check in the CP's `## Prerequisites` section.
   If any fail, **STOP and report to the user.** Do not proceed.
3. **Verify prior CP** — `git log --oneline -5` must show the prior CP's commit subject.
4. **Branch check:**
   - Single-branch: verify you are on the correct branch.
   - Multi-branch sequential: if the prior branch was merged, create a new branch from main.
   - Multi-branch parallel: checkout or create the CP's designated branch.
5. **Execute** — follow the CP's `## Steps` section.

## What "self-contained" means

A CP detail file is self-contained when a fresh Claude Code session with only:
- CLAUDE.md (loaded automatically)
- The master plan file
- The CP detail file
- Git history

...can execute the checkpoint without asking the user for context about prior sessions.

Concretely:
- File paths include line numbers
- Prior CP outcomes are stated in Context, not assumed from conversation
- Dependencies are explicit (file exists, function available, migration applied)
- No "as discussed earlier" or "per our previous session" references

## Token efficiency notes

- Each session loads only the master plan (~200 lines) + current CP (~150 lines).
  Total context cost per session: ~350 lines of plan content.
- Delegate codebase exploration to the built-in Explore agent — keeps the main session clean.
- If the planning session reaches 60% context usage (visible via `/context`), finalize
  the current state and continue in a new session. Do not wait until 90%.
- Reference files by `path:line` — never paste source code into plans.
