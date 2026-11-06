---
name: plan-refine
description: >
  Use when planning multi-part work on this portfolio (changes across sections,
  tooling, infra or docs) before writing code. Produces a master plan under 200
  lines with checkpoints, branch strategy, steelmanned decisions and verification
  gates, plus one self-contained detail file per checkpoint that a fresh session
  can execute after /clear. Plans are committed under docs/plans/.
---

# Plan Refinement

**Why this exists:** some work needs me hands-on at review gates instead of letting the agent run start to finish. Checkpoints give me those gates and keep each session's context small.
**When not to use it:** a single-file fix, a copy edit, or anything that fits in one session and one commit. Just do it.

Output is a **master plan** (<=200 lines) plus **per-checkpoint detail files** (<=150 lines each) in `docs/plans/<YYYY-MM-DD>-<slug>/`.

---

## 1. Before planning: read the codebase

1. Use the built-in Explore agent to map the affected area(s): relevant files, existing patterns and utilities to reuse.
2. Read the root `CLAUDE.md` (principles and constraints) and any nested `CLAUDE.md` in the folders the work touches.
3. If the work touches `infra/`, read the Terraform files and the runbook. If it touches content, read `src/content/CLAUDE.md`.

No guessing at files and no inventing patterns. If the codebase doesn't have what the plan assumes, flag it `[NEEDS DESIGN]`.

## 2. Branch strategy

Decide before writing the plan. Apply `references/branch-strategy.md` and record the result in the master plan's `## Branch strategy` section.

## 3. Master plan structure (required sections, <=200 lines)

````markdown
# <title>

## Status: PLANNING | IN PROGRESS | COMPLETE
## Created: YYYY-MM-DD

## Problem summary
2-4 sentences: what's broken or missing, and why fixing it matters.

## Branch strategy
Decision: SINGLE-BRANCH | MULTI-BRANCH (parallel) | MULTI-BRANCH (sequential)
Branch(es): <branch-name(s)>
Rationale: <one sentence why>

## Codebase findings
Only what affects the work: patterns to follow (by path), coupling, risk.

## Decision log
### D1: <decision title>
- **Chosen:** <approach>
- **Over:** <strongest alternative>
- **Because:** <why chosen wins>
- **Trade-off:** <what you lose>

## Checkpoint overview
| CP | Title | Depends on | Gate | Status |
|----|-------|------------|------|--------|
| 1  | ...   | --         | ...  | [ ]    |

## Session protocol
- One CP per session. /clear between checkpoints.
- Before CP N+1: verify CP N's commit exists (`git log --oneline -5`).
- This file is shared state: update status here before /clear.

## Status tracker
- [ ] CP1 — <title>
````

## 4. Per-checkpoint detail files

For each checkpoint, create `cpN.md` next to the master plan using `references/checkpoint-template.md`. Each one must run in a fresh session with only `CLAUDE.md`, the master plan and that file loaded.

## 5. Steelmanning

Every non-trivial decision (architecture, dependency, library, approach) gets the Chosen/Over/Because/Trade-off format, in the master plan for plan-level calls and in the CP file for implementation calls. Omit only for purely mechanical checkpoints. When in doubt, include it. The point is to understand the trade-off, not just see the result.

## 6. Session handoff

Follow `references/handoff-protocol.md`. In short:
- **End of CP:** verify → commit → mark `[x]` in the master plan → show the verification results → give a copy-paste handoff prompt for the next session → user runs /clear.
- **Start of CP:** load the master plan + CP file → run prerequisites (the gate) → execute.

## 7. Rules

- Security over quality over speed (root `CLAUDE.md`). A checkpoint that touches auth, user input, secrets, infra or dependencies must list "run `security-audit` and `vuln-check`" in its verification.
- Every checkpoint lists at least one verification command from `CLAUDE.md` (`npm run test:once`, `npm run build`, `npm run test:security`).
- Commit messages follow the repo style: lowercase, past tense, one line.
- Reference files by `path:line`. Never paste source code into plans.
- Mark issues found along the way `[DISCOVERED]` with a one-line justification.
- Say explicitly when checkpoints can run in parallel.
- Anything outward-facing (`terraform apply`, Amplify settings, pushing, repo visibility) is a gate for the user, never a step the agent takes on its own.
- Keep plans scannable: headings, tables, short bullets. Don't copy this file's structure into the plan.
- If the planning session passes about 60% context (`/context`), finalize the current state and continue in a new session.

---

Adapted from the planning skill I use on MyAutoTab (private repo). I removed its database-migration and multi-tenant rules and pointed it at this repo's commands, risks and `docs/plans/` folder.
