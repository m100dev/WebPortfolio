---
name: security-audit
description: >
  Use before committing a change that touches auth, user input, secrets, infra or
  dependencies, before a release or making the repo public, or when asked to audit
  the repo's security. Read-only, repo-level checklist: secrets across git history,
  dependency advisories, Terraform/IAM least privilege, CORS, EmailJS IDs, external
  links, .gitignore coverage and public/ contents. Reports a findings table and
  never edits files.
---

# security-audit

**Why this exists:** "security over quality over speed" (root `CLAUDE.md`) only means something if there's a repeatable check behind it. This is the repo-wide half. It covers the things no single file shows: git history, the dependency tree, the AWS stack, and what ships in `public/`.
**When not to use it:** checking a single file's code for unsafe patterns. That's `vuln-check`, which is faster and deterministic.

## Rules
- **Read-only.** Never edit, stage, commit, `npm audit fix`, or rewrite git history. Report only. Marc decides on every fix.
- Never print secret values, Terraform state, or `terraform.tfvars` contents. Name the file and line instead.
- Never `terraform apply`. `terraform validate` and `fmt -check` are fine.

## Checklist
| # | Check | How | Pass when |
|---|-------|-----|-----------|
| 1 | Secrets in history | `gitleaks git --config .gitleaks.toml` | no leaks (fixtures are allowlisted) |
| 2 | Secrets in pending changes | `gitleaks git --staged --config .gitleaks.toml` | no leaks |
| 3 | Code patterns | `npm run vuln-check -- src` | exit 0, and every suppression has a reason |
| 4 | Dependencies | `npm audit --omit=dev`, then list the direct ones: `npm audit --omit=dev --json` and filter `isDirect` | every advisory on a browser-runtime package (`react-router-dom`, `react-markdown`, `@emailjs/browser`, ...) has its reachability checked and reported. Advisories that come in only through `react-scripts` / testing-library (both under `dependencies` in CRA) are noted as accepted, never "fixed" with `--force` |
| 5 | IAM | read `infra/visitor-counter/main.tf` | no `"*"` actions or resources; any `iam:PassRole` is scoped to specific role ARNs with a `PassedToService` condition |
| 6 | CORS / API | read `main.tf` | allowed origins pinned to the real domains, not `*`; methods limited to what's used |
| 7 | EmailJS | grep `src` for the service/template/public key IDs | they're public by design (browser SDK). Note it, and confirm no *private* key is present |
| 8 | External links | covered by #3 (`blank-without-rel`) | every `target="_blank"` has `rel` |
| 9 | `.gitignore` coverage | `git check-ignore -v` on state, tfvars, `.env*`, `.claude/settings.local.json`; `git ls-files` for any of them | all ignored and none tracked |
| 10 | `public/` contents | list `public/`, skim text files | nothing internal: notes, plans, drafts, emails or keys |

## Output
One table: `#`, check, result (PASS / NOTE / FAIL), and evidence (command output summary or `path:line`). Then a short list of recommended fixes, ordered by severity, for Marc to approve.
