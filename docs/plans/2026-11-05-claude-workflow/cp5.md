# Checkpoint 5: graphify install and measurement

## Context
The pre-commit hooks are in place (CP3b), and CP4 may or may not be done yet, since the two are independent. This CP installs graphify, which builds a knowledge graph of the codebase so the agent can query structure instead of reading raw files. Then it **measures** whether that actually cuts tokens on a repo this size, about 100 files. graphify is third party and installs its own hooks, so I review them before anything is committed.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** the CP4 commits, or `added pre-commit and pre-push hooks with the pre-commit checklist skill`

## Prerequisites
- [ ] The prior commit is in `git log --oneline -5`.
- [ ] `uv --version` and `python --version` (3.10+) both work.
- [ ] The official source is https://github.com/Graphify-Labs/graphify and the package is **`graphifyy`**. Its README warns that other `graphify*` packages aren't affiliated.

## Decisions
### D1: Measure, then claim
- **Chosen:** 3 fixed questions, each asked in a fresh session with and without the graph, recording total tokens from `/context`.
- **Over:** quoting published numbers.
- **Because:** the open-source README has no token figure. Third-party reports range from about 1× on tiny repos to 5–10× in normal use.
- **Trade-off:** small sample. It's labelled as such.

### D2: Project install, no CLAUDE.md section
- **Chosen:** `graphify install --project`.
- **Over:** `graphify claude install`, which adds always-on guidance.
- **Because:** the always-on guidance works against the lean `CLAUDE.md` from CP2.
- **Trade-off:** the agent relies on the skill and hooks to know about the graph.

## Steps
1. **Install:** `uv tool install graphifyy==<latest>`. Check the version against the official repo's releases or tags, and record it.
2. **Register:** run `graphify install --project` and review every file it writes, especially any hook in `.claude/settings.json`.
   - Show me the diff.
   - Don't use `--strict`, because it would block normal Read/Grep.
   - Make sure its hooks sit alongside the CP3b pre-commit hook without replacing it.
3. **`.graphifyignore`:** exclude `build/`, `node_modules/`, `src/assets/`, `infra/visitor-counter/.terraform/` and `*.tfstate*`.
4. **Build the graph:** run `/graphify .`. Code goes through tree-sitter, so it uses no LLM credits. Skip the docs/images semantic pass unless it's cheap.
5. **Measure** these 3 questions, each in a fresh session with and without the graph:
   - (a) "How does a memo go from a `.md` file to the page, and where is the release-date rule?"
   - (b) "What calls the visitor counter API and when?"
   - (c) "Which components consume the theme tokens for card surfaces?"
   - For each, record the tokens used and whether the answer was correct.
6. **Commit** `graphify-out/GRAPH_REPORT.md` and `graph.json`, and gitignore `graph.html` and any cache. If `graph.json` is large, commit only the report.
7. Add graphify to the root `CLAUDE.md` skills list as **third-party**, with its version.

## Verification
- `npm run test:once` passes, and the pre-commit hook passes on this commit.
- Running `gitleaks git --staged --config .gitleaks.toml --no-banner` (the form `tools/precommit/check.js` uses) on the graph files finds nothing. A graph can capture string literals.
- Record the measurements under `## Results`.

## Commit
`added graphify and measured its token savings on this repo`

## Results
Run 2026-11-06. graphify version: **0.9.103** (`graphifyy` on PyPI; the repo has no release tags).

| Question | Without graph (tokens) | With graph (tokens) | Δ | Correct both ways? |
|---|---|---|---|---|
| a | 53,054 (4 tool calls) | 55,355 (3) | +4.3% | yes / yes |
| b | 54,014 (5) | 52,083 (5) | −3.6% | yes / yes |
| c | 54,546 (5) | 53,371 (4) | −2.2% | yes / yes. The graph has no CSS, so it fell back to grep |
| total | 161,614 | 160,809 | **−0.5%** | |

**Verdict:** no measurable saving on this repo. Each run's ~50k total is mostly fixed session overhead (system prompt, tools, `CLAUDE.md`). On a ~155-file repo, grep already finds the right file in 1–2 calls, so the graph saves at most a call. Question (c) is about CSS tokens, which graphify doesn't index.

**Why it's here anyway:** I wouldn't normally put a code graph on a small web project. This is a demonstration: installing a third-party agent tool, reviewing the hooks it adds, and measuring it instead of quoting someone else's numbers. The savings come on large codebases, where agents would otherwise read their way through many files to orient. CP6 should say exactly that in the README and build log.

**Method:**
- Each cell is one fresh general-purpose subagent (Marc's choice over manual `/context` sessions), and the tokens are its reported `subagent_tokens`. n=1 per cell, so this is a small sample.
- The answer key was written from the code before any run.
- The without-graph runs went first, before graphify was installed, so no hook could nudge them.
- The with-graph prompts said to run `graphify query` first. graphify's `cache/last_query_stamp` and per-agent hook-session files confirm the graph was queried during the runs. Per-run proof is weaker, because the subagent transcripts came back empty.

**Install notes:**
- The build is `graphify extract . --code-only` plus `graphify cluster-only . --no-viz --no-label`: 7 s, no LLM calls, 74 code files, 383 nodes, 728 edges, `graph.json` 292 KB.
- `graphify install --project --platform claude` wrote:
  - 3 nudge-only hooks (`hook-guard search|read|compact`): exit 0, fail open, no network, never `--strict`;
  - the skill;
  - a `.claude/CLAUDE.md`;
  - and a `## graphify` section in the root `CLAUDE.md`, despite D2.
- Marc approved the hooks and skill. The two `CLAUDE.md` additions and the `.bak` were removed.
- The CP3b hook entries, `.githooks/`, `core.hooksPath` and the user settings are unchanged (checksummed). An `eval` probe commit was still blocked by vuln-check.
- Leak checks: there are no absolute paths in the committed files (`.graphify_root` holds one, so it's gitignored). The EmailJS IDs and the API URL are absent; only the package name `@emailjs/browser` appears.
- Not done:
  - `graphify hook install` (post-commit git hooks);
  - the Terraform extra;
  - the semantic docs pass.

## Handoff
graphify is installed at the project level, its hooks have been reviewed, and real numbers are recorded. CP6 publishes them in the build log and README.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp6.md`
