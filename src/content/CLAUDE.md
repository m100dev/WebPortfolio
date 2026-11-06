# Content

## Guides (`guides/`)
- `index.js` holds each guide's metadata:
  - slug, title, summary, tags and reading time;
  - an optional explicit `toc`;
  - a license flag;
  - `version` plus `updated` date, and a `changes` list for the Version history;
  - a `lazy()` component, so every guide is its own chunk.
- **Whenever a guide's content changes,** bump `version` / `updated` and add a `changes` line.
- `src/components/guides/GuideLayout.jsx` renders the hero, a sticky table of contents with scroll-spy (the guide's `toc`, or else its h2s), and the CC BY 4.0 line.
- `AiAutonomyLevels.jsx` is data-driven from `ai-autonomy/data.js`.
  - Its checklist persists in `localStorage` under `alv4`, with the shape `{ "<level>-<skill>": bool }`.
  - Keep both the key and the shape: they match the retired standalone page, so visitors keep their progress.
- `HowIBuildWithAiAgents.jsx` is data-driven from `workflow/data.js`.
  - Every number there cites its plan file (`source`) and the exact text (`quote`). `workflow/data.test.js` fails if a quote leaves its source or the README's headline numbers stop matching.
  - Add numbers only from a plan's `## Results`.
- `AvdEnterpriseWorkspace.jsx` was generated from the old standalone HTML.
  - Text sits in `{"..."}` expressions so `<pre>` whitespace survives.
  - Its class vocabulary (`phase`, `sec`, `steps`/`step`, `ib note|tip|warn|danger`, `tbl`, `code` + `kk/ks/kv/km/kc`, `card`, `arch-*`, `split-*`) is styled in `avd/guide-avd.css`, scoped under `.avd`.

## Memos (`memos/`)
- One `.md` file per memo, imported as a URL (`?url`) and fetched at runtime, then rendered with `react-markdown` + `remark-gfm` inside `.prose` (`src/pages/pages.css`). Metadata goes in `memos/index.js`.
- **Release rules:**
  - `draft: true` memos only render in development; in production they 404.
  - `date` doubles as the release date. A non-draft memo with a future `date` is scheduled and stays hidden (404) in production until that day, in the visitor's local time.
  - The Memos nav link appears only once a memo is live.
- `_template.md` is a permanent draft that documents the format.
- **Drafts go in the `drafts` array** (inside `import.meta.env.DEV ? [...] : []`) with `load: () => import('./x.md?url')`, never a static import. Otherwise the body and title ship in the production build.
  - When a draft goes live, move it to `published` with a static `file` import. Scheduled memos are `published` too.
  - `memoUrl()` resolves either form.
- **Voice:** first person and plain, in Marc's own phrasing. Never invent personal details.
