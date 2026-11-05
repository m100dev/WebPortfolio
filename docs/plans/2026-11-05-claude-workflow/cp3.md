# Checkpoint 3: vuln-check tool, tests and skill; security-audit skill

## Context
CP2 made `CLAUDE.md` lean, with the security-first principles at the top. This CP builds the two security skills those principles name:
- `vuln-check`: code-level. Finds code that parses fine but is unsafe, using a tested script.
- `security-audit`: repo-level. Covers secrets in history, dependency advisories, IAM and Terraform, and external links.

**Master plan:** `docs/plans/2026-11-05-claude-workflow/masterplan.md`
**Branch:** `chore/claude-workflow` (continue)
**Prior CP commit:** `added security first principles and split claude.md into nested files`

## Prerequisites
- [ ] The CP2 commit is in `git log --oneline -5`.
- [ ] `npm test -- --watchAll=false` passes.
- [ ] `gitleaks version` and `node --version` (24+) both work.

## Decisions
### D1: Test runner for tooling
- **Chosen:** Node's built-in `node:test` (`node --test tools/`).
- **Over:** extending CRA's Jest.
- **Because:** CRA's Jest only sees `src/`. Putting fixtures in `src/` risks webpack and lint touching vulnerable sample code.
- **Trade-off:** two test commands (`npm test`, `npm run test:security`).

### D2: Fake key in the fixture
- **Chosen:** AWS's documented dummy key `AKIAIOSFODNN7EXAMPLE`.
- **Over:** a random fake key.
- **Because:** it's the documented example, and scanners and push protection recognise it.
- **Trade-off:** none worth noting. The fixture path is still allowlisted in `.gitleaks.toml`.

## Steps
1. **Dependencies:** add `@babel/parser` and `@babel/traverse` as explicit `devDependencies`, at the versions already installed.
2. **`tools/vuln-check/vuln-check.js`**
   - **CLI:** takes paths (files or folders), scans `.js` / `.jsx`, prints `file:line rule message`, and exits 1 on any finding. A parse failure is reported as rule `syntax-error`.
   - **Rules:**
     - `unsafe-html`: `dangerouslySetInnerHTML` whose `__html` isn't a string literal;
     - `eval`: `eval(...)` or `new Function(...)`;
     - `inner-html`: assignment to `.innerHTML` / `.outerHTML`;
     - `javascript-url`: an `href` / `src` attribute starting with `javascript:`;
     - `blank-without-rel`: `target="_blank"` without `rel` containing `noreferrer` or `noopener`;
     - `hardcoded-secret`: string literals matching `AKIA[0-9A-Z]{16}`, `-----BEGIN .*PRIVATE KEY-----`, or `sk-[A-Za-z0-9]{20,}`.
   - **Exports** `scan(paths)` so it can be tested.
3. **`tools/vuln-check/fixtures/`**, all valid syntax:
   - `unsafe-html.jsx`: renders `dangerouslySetInnerHTML={{ __html: props.bio }}`;
   - `eval-input.js`: `eval(new URLSearchParams(location.search).get('q'))`;
   - `leaked-key.js`: `const key = 'AKIAIOSFODNN7EXAMPLE'`;
   - `safe-link.jsx`: an external link with `rel="noreferrer"`, and nothing unsafe.
4. **`tools/vuln-check/vuln-check.test.js`** (`node:test`):
   - each of the 3 vulnerable fixtures is flagged with its expected rule;
   - `safe-link.jsx` has zero findings;
   - a file with a real syntax error is reported as `syntax-error`. This one is generated in a temp dir, not committed, so it doesn't break the build.
5. **`package.json` scripts:**
   - `"vuln-check": "node tools/vuln-check/vuln-check.js"`
   - `"test:security": "node --test tools/"`
6. **`.gitleaks.toml`:** extend the default config and allowlist `tools/vuln-check/fixtures/`.
7. **Run on the real code:** `npm run vuln-check -- src`. Fix real findings, and document false positives in the skill's notes.
8. **`.claude/skills/vuln-check/SKILL.md`**
   - Header: why it exists (code-level, deterministic) and when not to use it (repo-wide concerns belong in `security-audit`).
   - Steps: run the script on the changed paths, explain each finding in plain words, propose a fix, then re-run.
9. **`.claude/skills/security-audit/SKILL.md`**: a read-only checklist that reports a findings table and never edits files.
   - `gitleaks detect` (full history);
   - `npm audit --omit=dev`;
   - Terraform/IAM review: no `*` actions or resources, PassRole scoped, CORS origins pinned;
   - EmailJS IDs (public by design, but note it);
   - external links have `rel`;
   - `.gitignore` covers state, tfvars and env files;
   - nothing in `public/` leaks internal notes.
   - Header: why it exists and when not to use it (single-file code checks belong in `vuln-check`).
10. Add `.claude/settings.local.json` to `.gitignore`.
11. Add both skills to the root `CLAUDE.md` skills list.

## Verification
- Run `npm run test:security`. Expected: 4 fixture tests plus the syntax-error test pass.
- Run `npm run vuln-check -- src`. Expected: exit 0 after the fixes.
- Run `gitleaks detect --config .gitleaks.toml`. Expected: no leaks.
- `npm test -- --watchAll=false` and `CI=true npm run build` both pass, and no fixture appears in `build/`.
- Invoke `/security-audit` once and save the findings table under `## Results`.

## Commit
`added the vuln check script with fixtures and the security audit skills`

## Results
- **Findings in `src/`:** 1, a reviewed false positive:
  - `src/content/guides/ai-autonomy/Icon.jsx:20` `unsafe-html`. The `__html` values are static string literals in `icons.js`, and `name` only picks a key.
  - Suppressed with a reasoned `vuln-check-ignore` comment (a suppression without a reason doesn't count). Recorded in the skill's notes. `npm run vuln-check -- src` now exits 0.
- **Tests:** `npm run test:security` reports 6/6 passing: 3 vulnerable fixtures, 1 clean, the generated syntax error, and the suppression contract (added).
- **gitleaks:**
  - staged scan with the config: no leaks;
  - full history: no leaks.
  - The default rules already skip `...EXAMPLE` keys, so a clean run doesn't prove the allowlist works. I proved it separately in a scratch dir: the same random fake key was caught in `src/` and skipped under `tools/vuln-check/fixtures/`.
- **security-audit:** run by hand from `.claude/skills/security-audit/SKILL.md`. The skill was created mid-session, so the Skill tool couldn't invoke it yet. Invoke `/security-audit` for real in CP3b.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Secrets in history | PASS | `gitleaks git --config .gitleaks.toml`: no leaks found |
| 2 | Secrets staged | PASS | `gitleaks git --staged`: no leaks found |
| 3 | Code patterns | PASS | vuln-check exit 0, 1 reasoned suppression |
| 4 | Dependencies | NOTE | `npm audit --omit=dev`: 77 (21 low, 22 moderate, 30 high, 4 critical), all transitive through `react-scripts` (build/dev-server tooling under `dependencies`), none in browser runtime packages. Accepted; never `--force`. See the deviation below for the one I fixed |
| 5 | IAM | PASS | `infra/visitor-counter/main.tf:79-86`: DynamoDB Get/UpdateItem on the table ARN; logs on the log-group ARN; no `*` actions; no PassRole in this stack |
| 6 | CORS | PASS | `main.tf:127-129`: origins from `var.allowed_origins` (pinned marcbastien.com domains); methods GET, POST |
| 7 | EmailJS | NOTE | `src/components/contact/Contact.jsx:8-10`: service, template and public key IDs. Public by design for the browser SDK. No private key present |
| 8 | External links | PASS | covered by #3; every `target="_blank"` has `rel` |
| 9 | `.gitignore` | NOTE | state, tfvars (`infra/visitor-counter/.gitignore`), `.env.local` and `.claude/settings.local.json` are ignored, and none are tracked. `.env` isn't ignored. No `.env` file exists, and CRA embeds `REACT_APP_*` in the bundle anyway, so it can't hold a secret |
| 10 | `public/` | PASS | only `favicon.svg`, `index.html` and `manifest.json` |

- **Deviation (security over the step's wording):** step 1 said to add babel "at the versions already installed" (7.22.10). `npm audit` flagged `@babel/traverse <7.23.2` as critical (CVE-2023-45133). Pinning a direct dependency at that version was the wrong call, so both are `^7.29.13`.
  - npm deduped all 4 traverse copies in the tree to 7.29.13, which also fixed the copy react-scripts uses.
  - The lockfile change is confined to the babel family. Tests, build and vuln-check all re-passed.
- **Recommended for Marc:**
  - (low) Add `.env` to `.gitignore` only if non-`REACT_APP_` values ever need to live there.
  - (info) The remaining CRA advisories go away only by leaving CRA (e.g. for Vite). That's out of scope here.

## Handoff
`vuln-check` and `gitleaks` both run clean and can be scripted. CP3b wires them into hooks that block commits.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp3b.md`
