---
name: pre-commit-checklist
description: >
  Use before proposing or making any commit in this repo. The judgment layer on top
  of the pre-commit hook: checks that tests cover the new behaviour, that security-
  sensitive changes got security-audit, that guide and memo metadata were set on
  purpose, that Ask Marc copy still comes from the site, that the right CLAUDE.md
  was updated, and that the message is in Marc's style. It doesn't replace the hook.
---

# pre-commit-checklist

**Why this exists:** the hook (`.githooks/pre-commit` → `tools/precommit/check.js`) blocks what a script can decide: secrets, unsafe code, a broken build, failing tests, an untested logic file, a vulnerable dependency. It can't tell whether a test checks the right thing, or whether a guide's version bump is honest. That's this list.
**When not to use it:** as a substitute for the hook. If the hook fails, fix the cause. Never bypass it with `--no-verify`, `-n` or a `core.hooksPath` override (the Claude hook refuses all three).

## Before proposing the commit
Go through each item that applies to the staged diff (`git diff --cached`), and say which ones you checked.

1. **Tests cover the new behaviour, not just exist.** For each changed logic file, name the test that would fail if the change were reverted. If none would, write one. The hook only checks that a test file is there.
2. **Security review.** If the change touches auth, user input, secrets, `infra/` or dependencies, run `security-audit` (and `vuln-check` on changed JS/JSX) and report the result.
3. **Guides.** If a guide's content changed, bump `version` and `updated` in `src/content/guides/index.js` and add a `changes` line, newest first. `guides.test.js` checks the top entry matches.
4. **Memos.** Drafts live in the `drafts` array with `load: () => import(...)`, never a static import (that ships them in the build). `draft` and `date` are set on purpose: `draft: true`, or `draft: false` with today's date to publish, or a future date to schedule. A memo is in Marc's own voice, with no invented details.
5. **Ask Marc.** Every answer in `src/components/about/AskMarc.jsx` still comes from existing site copy.
6. **Conventions.** If the change alters how something works (a command, a pattern, a rule), update the `CLAUDE.md` that covers it: the root file, `src/components/`, `src/content/` or `infra/visitor-counter/`.
7. **Commit message.** Lowercase, past tense, one short line, no body except the Co-Authored-By trailer. Example: `added pre-commit and pre-push hooks with the pre-commit checklist skill`.

## Then
Commit normally and let the hook run. If it blocks, read its list of failed checks, fix them, and commit again.
