This file is the starting point for a new memo. It's marked `draft: true` in `index.js`, so it never shows in production (the route 404s there), but you can preview it locally at `/memos/_template`.

## How to publish a memo

1. Copy this file to `src/content/memos/<slug>.md` (lowercase, hyphenated slug).
2. Import it at the top of `src/content/memos/index.js` and add an entry to the `memos` array with `slug`, `title`, `date` (`YYYY-MM-DD`), a one-line `summary`, `draft: false`, and `file`.
3. Build and check `/memos` and `/memos/<slug>`. The **Memos** link appears in the nav once at least one memo is live.

## Scheduling a release

`date` is both the date shown on the memo and its release date:

| `draft` | `date` | In production |
| --- | --- | --- |
| `true` | anything | Hidden until you set `draft: false` |
| `false` | in the future | Scheduled: appears on its own on that date |
| `false` | today or earlier | Live |

So you can finish several memos, give each a different future `date`, and ship them in one deploy. They roll out one by one with no further deploys. In development everything shows, with a **Draft** or **Scheduled** badge.

## What renders

Standard Markdown plus GitHub-flavoured extras (via `remark-gfm`):

- **Bold**, *italic*, `inline code`, and [links](https://www.marcbastien.com)
- ~~Strikethrough~~ and task lists:
  - [x] Write the memo
  - [ ] Publish it
- Tables:

| Section | Purpose |
| --- | --- |
| Title | Set in `index.js`, not here |
| Body | Everything in this file |

> Blockquotes work too.

```powershell
# Fenced code blocks keep their formatting
Get-Service | Where-Object Status -eq 'Running'
```

The memo title, date and summary come from `index.js`, so start the file with the body, not a `#` heading.
