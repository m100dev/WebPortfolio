# Branch Strategy Decision Tree

Apply at plan creation time. Record the result in the master plan's `## Branch strategy` section.

---

## Decision flow

```
Does every checkpoint contribute to one initiative?
|
+-- YES --> SINGLE-BRANCH (default for this repo)
|   All CPs commit to one branch: <type>/<name>. One PR at the end.
|
+-- NO --> Are the checkpoints independent changes that could PR separately?
    |
    +-- YES --> MULTI-BRANCH (parallel)
    |   Each CP (or group) gets its own branch, in any order.
    |
    +-- NO --> Does CP N have to be live before CP N+1 can work?
        |
        +-- YES --> MULTI-BRANCH (sequential)
        |   CP N merges and deploys first; CP N+1 branches from the updated main.
        |
        +-- NO --> SINGLE-BRANCH
```

## Ordering hazards in this repo

If any of these apply, split the work so the risky step happens first, or make it an explicit user gate:

1. **Amplify rewrite rules before a deploy that removes or moves files.** Old URLs 404 if the build ships before the rules (`infra/amplify/redirects.json`) are pasted into the console. New static file types also need adding to the SPA rewrite's extension allowlist.
2. **`terraform apply` before the build that uses its output.** `REACT_APP_VISITOR_API_URL` is baked in at build time, so the stack must exist and the Amplify env var must be set before the redeploy.
3. **The CI build gate.** Amplify builds with `CI=true`, so lint warnings fail the deploy. A CP that changes lint config or adds files under `src/` has to pass `CI=true npm run build` before anything merges.

## Recording the decision

```
Decision: SINGLE-BRANCH
Branch: chore/claude-workflow
Rationale: every CP builds the same tooling and docs initiative; none is useful on its own.
```

```
Decision: MULTI-BRANCH (sequential)
Branches:
  CP1: fix/guide-urls (moves guide files; redirects pasted first)
  CP2-CP3: feat/guide-search (depends on the new URLs being live)
Merge order: fix/guide-urls merges and deploys first.
Rationale: CP1 changes public URLs that CP2 links to.
```
