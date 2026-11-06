---
name: vuln-check
description: >
  Use when a change adds or edits JS/JSX under src/ or tools/, especially anything
  that renders HTML, builds URLs or links, runs strings as code, or holds keys.
  Runs the repo's tested AST scanner (tools/vuln-check/) on the changed paths,
  explains each finding in plain words, proposes a fix and re-runs until clean.
  Code-level only: repo-wide concerns (git history, dependencies, IAM) belong in
  security-audit.
---

# vuln-check

**Why this exists:** a linter catches code that's broken. This catches code that works but is unsafe. It's a small script with readable rules, tested against fixtures, so a clean result means something and the same input always gives the same answer.
**When not to use it:** secrets in git history, dependency advisories, Terraform/IAM, `.gitignore` coverage. Those are repo-level and belong in `security-audit`.

## Rules (`tools/vuln-check/vuln-check.js`)
| Rule | Flags |
|------|-------|
| `unsafe-html` | `dangerouslySetInnerHTML` whose `__html` isn't a string literal |
| `eval` | `eval(...)` or `new Function(...)` |
| `inner-html` | assigning to `.innerHTML` / `.outerHTML` |
| `javascript-url` | an `href` / `src` that starts with `javascript:` |
| `blank-without-rel` | `target="_blank"` without `rel` containing `noreferrer` or `noopener` |
| `hardcoded-secret` | strings shaped like an AWS key ID, a PEM private key, or an `sk-` API key |
| `syntax-error` | a file that doesn't parse (it can't be checked, so it isn't treated as clean) |

## Steps
1. **Scope:** list the changed `.js` / `.jsx` files (`git diff --name-only` plus staged and untracked). Scan the whole of `src` when the change is broad.
2. **Run:** `npm run vuln-check -- <paths>`. Exit 0 means clean. Exit 1 prints `file:line rule message`.
3. **Explain each finding in plain words:** what an attacker could do, and whether the input can actually reach that line (user input, URL, markdown, API response, or a static constant).
4. **Fix it.** Prefer the safe pattern over a suppression:
   - render text, not HTML; or sanitize, then render;
   - add `rel="noreferrer"` to every `target="_blank"`;
   - read secrets from env/config at build or run time, never as literals.
5. **Re-run** until it exits 0, and report the before and after.

## Suppressions
- Only for a reviewed, intentional case. Put it on the line itself or the line above: `// vuln-check-ignore <rule>: <why it is safe>`.
- A suppression without a reason doesn't count, and the finding still fails.
- Every suppression gets mentioned in the change's review, never added silently.

## Known false-positive policy
- **Expressions the scanner can't resolve are flagged, not trusted.** For example `rel={relValue}` next to `target="_blank"`. Write a literal `rel`, or suppress it with a reason.
- A literal `rel` followed by `{...props}` counts as safe. Spread props can override it, so check the source when the props come from outside (e.g. `src/pages/Memo.jsx` gets them from `react-markdown`, which doesn't set `rel`).
- Current suppressions:
  - `src/content/guides/ai-autonomy/Icon.jsx`: SVG bodies are static literals in `icons.js`, and `name` only picks a key.

## Tests
`npm run test:security` runs `tools/vuln-check/vuln-check.test.js` (`node:test`): 3 vulnerable fixtures, 1 clean fixture, a generated syntax error, and the suppression contract. The fixtures are allowlisted in `.gitleaks.toml` because they're vulnerable on purpose. Never copy fixture contents anywhere else.
