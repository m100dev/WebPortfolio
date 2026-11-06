# Checkpoint Detail File Template

Use this template when generating per-checkpoint detail files (`cpN.md`, next to the master plan in `docs/plans/<date>-<slug>/`).
Each file must be self-contained: executable in a fresh session with only CLAUDE.md,
the master plan, and this CP file loaded. Target <=150 lines.

---

## Template

```markdown
# Checkpoint N: <title>

## Context

2-3 sentences: what this CP does, why it matters, and what prior CPs accomplished
that this one builds on. Build this from the prior CP's Handoff section — restate
the facts directly. No "as discussed earlier" references.

**Master plan:** `docs/plans/<date>-<slug>/masterplan.md`
**Branch:** `<branch-name>` [(create from <base>) | (continue)]
**Prior CP commit:** `<expected commit subject from CP N-1>` [or "N/A" for CP1]

## Prerequisites

Run these checks before any implementation. If any fail, STOP and report to user.

- [ ] Verify branch: `git branch --show-current` should show `<branch-name>`
- [ ] Verify prior CP (if N > 1): `git log --oneline -3` should include `<prior commit subject>`
- [ ] Verify tests pass: `npm run test:once` and `npm run test:security`

## Decisions

Include for any non-trivial choice (architecture, data model, dependencies, library,
approach). Omit only for purely mechanical CPs. When in doubt, include.

### D1: <decision title>
- **Chosen:** <approach>
- **Over:** <strongest alternative>
- **Because:** <why chosen wins — explain so the user learns the tradeoff>
- **Trade-off:** <what you lose with the chosen approach>

## Steps

Numbered, specific, with file paths and line numbers. Reference existing functions
and utilities to reuse rather than creating new ones.

1. **<action>** — `path/to/file.jsx:line`
   <what to change, in 1-3 sentences>

2. ...

## Verification

Run: `<exact command>`
Expected: `<observable pass state>`
On failure: `<first place to look>`

(Repeat for each verification target.)

## Commit

`<lowercase, past tense, one line, e.g. "added the vuln check script and fixtures">`

## Key source files

- `path/to/file.jsx` (lines N-M) — <one sentence on what it does>
- ...

## Handoff

2-3 sentences: what was accomplished, what state the codebase is in, what the next
CP should expect. This becomes the basis for CP N+1's Context section.

## Resume paths

Master plan: `docs/plans/<date>-<slug>/masterplan.md`
Next CP: `docs/plans/<date>-<slug>/cpN+1.md` [or "N/A — final checkpoint"]

At the end of the CP, report the verification results and give the handoff prompt
for the next session (see `handoff-protocol.md`, steps 4–5).
```

---

## Self-containment checklist

Before finalizing a CP file, verify:

- [ ] File paths include line numbers where relevant
- [ ] Prior CP outcomes are stated in Context, not assumed from conversation
- [ ] Dependencies are explicit (file exists, function available, migration applied)
- [ ] Verification commands are copy-paste ready
- [ ] Handoff section tells the next session what it inherits
- [ ] Resume paths point to real files
