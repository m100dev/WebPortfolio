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
- Findings in `src/`: ___
- security-audit: ___

## Handoff
`vuln-check` and `gitleaks` both run clean and can be scripted. CP3b wires them into hooks that block commits.

## Resume paths
Master plan: `docs/plans/2026-11-05-claude-workflow/masterplan.md`
Next CP: `docs/plans/2026-11-05-claude-workflow/cp3b.md`
