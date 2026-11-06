# Skills

A static site doesn't need these. They're here on purpose: a public slice of the Claude Code workflow I use on MyAutoTab, the SaaS I'm building to production standards, where they carry real weight.

I design each skill (what it's for, its rules, when not to use it) and write it with Claude Code. Each `SKILL.md` opens with why it exists and when not to use it.

| Skill | Source | Why | Instead of |
|---|---|---|---|
| [`plan-refine`](plan-refine/SKILL.md) | Mine, adapted from the one I use on MyAutoTab | Multi-part work gets checkpoints, so I review at each gate and every session starts with a small context | One long agent run I only review at the end |
| [`security-audit`](security-audit/SKILL.md) | Mine | Read-only, repo-level checks before a release or an infra or dependency change: secrets across git history, advisories, IAM, CORS, `.gitignore`, `public/` | A diff-only review, which can't see history or config |
| [`vuln-check`](vuln-check/SKILL.md) | Mine | Runs my AST scanner (`tools/vuln-check/`) on changed JS/JSX, explains each finding and re-runs until clean | `eslint-plugin-security` or a SaaS scanner |
| [`pre-commit-checklist`](pre-commit-checklist/SKILL.md) | Mine | The judgment calls the pre-commit hook can't make: whether tests check the right thing, honest guide versions, Ask Marc copy | Trusting the hook alone |
| [`comment-in-my-voice`](comment-in-my-voice/SKILL.md) | Mine | Sparse first-person "why" comments, using only reasons on record. It asks me when there isn't one | Generic commenting, or no comments |
| [`dedupe`](dedupe/SKILL.md) | Mine | A whole-repo duplication sweep: report first, apply only the rows I approve, and prove with gzipped sizes that the bundle didn't grow | `/simplify`, which only sees one diff |
| [`graphify`](graphify/SKILL.md) | Third-party (`graphifyy` 0.9.103) | A code knowledge graph. Measured here at −0.5% tokens over 3 questions, so it's a demo of the install, the hook review and the measurement. It pays off on large codebases with agents working across them | Grep, which already finds the right file in 1–2 calls at this size |
| `/simplify`, `/code-review`, `/security-review` | Built into Claude Code | Diff-level review of a single change | — |

## Considered, not used
| Skill | Why not |
|---|---|
| A database security audit | This site has no database. I use one on MyAutoTab. |
| Generic commenting skills | They don't write in my voice, and they comment the obvious. |
| A third-party vulnerability linter | A few readable rules aimed at this codebase's real risks are easier to trust and explain. `security-audit` and `npm audit` cover the rest. |
