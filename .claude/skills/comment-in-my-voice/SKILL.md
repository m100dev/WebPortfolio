---
name: comment-in-my-voice
description: >
  Use when adding or rewriting code comments in this repo, or when asked to explain
  a tricky spot in the code itself. Writes sparse "why" comments in Marc's voice:
  first person, plain and short, only where a new reader would trip, and only with
  reasons that are on record in the code, git history or plan docs. Asks Marc when
  the reason isn't written down anywhere.
---

# comment-in-my-voice

**Why this exists:** the code says *what* it does. What a reader can't recover is *why* I did it that way, and that's the part that gets lost first. The repo is public, so comments that sound like me (not like generated filler) are part of the point.
**When not to use it:** self-explanatory code, generated or vendored files, tests whose names already say what they check, and fixtures. If a comment would only restate the line below it, don't write it.

## Rules
1. **Why, never what.** "I scroll after the route change because the section isn't on the page yet" beats "scrolls to the section".
2. **First person, plain and short.** "I chose this because…", "this has to run before…", "I tried X, but…". One to three lines, or a short `Why:` paragraph for something genuinely subtle (see `infra/visitor-counter/lambda/handler.py` for the longest I go).
3. **No punchy closers or aphorisms.** End on the fact, not a moral.
4. **Never invent a reason.** Every reason must come from one of:
   - the code itself (a constraint you can point at);
   - git history (`git log --format='%h %s' -- <file>`, `git show <sha>`);
   - plan docs under `docs/plans/`, a `CLAUDE.md`, or a README.
   If it isn't in any of those, **ask me** and leave the comment out until I answer.
5. **Sparse.** Only the 2–3 spots per file a new reader would trip on. Remove or shorten an existing comment if it only says *what*.
6. **Syntax.** JSX comments use `{/* */}`. Keep `eslint-disable-next-line` directly above the line it disables, with nothing in between, or the build fails (`--max-warnings=0`).
7. **Keep the facts in sync.** If a comment states a contract that's also written in a `CLAUDE.md` or README (for example the visitor counter's POST/GET rhythm), the wording can differ but the facts must match.

## Process
1. Read the file and its history, and find the 2–3 non-obvious spots.
2. For each one, find the reason and note where it's recorded.
3. Draft the comments. In the diff you show me, label each reason **on record** (cite the file or commit) or **derived from code**, and list the open questions separately.
4. If the file is under `src/hooks/`, is a content `index.js`, is under `tools/`, or is a Lambda `.py` (which needs `test_<name>.py`), the pre-commit hook needs a test beside it. A comment-only change still counts as staged logic. Make sure the test checks the behaviour the comment claims.
5. Show me the diff before committing. Comments are copy in my voice, so they get my review like any other copy.
