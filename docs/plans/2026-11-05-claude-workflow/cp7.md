# Checkpoint 7 (backlog): "How I build with an AI agent" guide

## Context
This is backlog work. Start it only after CP6 is done **and** the repo is public. It's a site guide explaining the workflow, written from the real hooks, skills and measured numbers, and linking to the public files. It waits until then because a guide written before the tooling existed would describe things that weren't built or measured yet.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** new branch from `main`, e.g. `feat/workflow-guide` (the workflow branch will have merged)
**Prior CP commit:** `added a build log`

## Prerequisites
- [ ] The repo is public, and `https://github.com/<user>/<repo>/tree/main/.claude/skills` loads.
- [ ] `npm test -- --watchAll=false` passes.

## Decisions
### D1: A guide over a memo
- **Chosen:** a versioned guide in `src/content/guides/`.
- **Over:** a memo.
- **Because:** it's reference material that gets updated as the workflow changes, and guides have `version` / `updated` / `changes`.
- **Trade-off:** more structure to keep up. A short memo can announce it.

### D2: Tool-agnostic framing
- **Chosen:** explain the ideas (checkpoints, hooks vs skills, measuring) with Claude Code as the worked example.
- **Over:** a Claude-only how-to.
- **Because:** it matches the AI autonomy guide's tool-agnostic stance and ages better.
- **Trade-off:** less copy-paste setup detail. Links to the repo cover that.

## Steps
1. Use `plan-refine` to plan the guide's sections. Draft the outline, and Marc approves it.
2. Add the guide entry and component, following the existing guide pattern (`src/content/CLAUDE.md`). The guide gets its `version`, `updated` and `changes` entries.
3. Open with the same framing as the README: the tooling is intentional, a demonstration of the MyAutoTab workflow, not something a portfolio needs.
4. Use only the real numbers from the CP2, CP4 and CP5 `## Results` sections.

## Verification
- `npm test -- --watchAll=false` and `CI=true npm run build` both pass.
- The guide renders in both themes and at 390px.

## Commit
`added a guide on how i build with an ai agent`

## Handoff
This is the end of the plan. Mark the master plan `## Status: COMPLETE`.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: N/A, this is the final checkpoint
