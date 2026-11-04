# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server at http://localhost:3000
- `npm run build` — production build into `build/`
- `npm test` — Jest in watch mode (CRA's React Testing Library setup). `src/setupTests.js` shims `matchMedia`, `IntersectionObserver` and `scrollTo` for jsdom
- `npm test -- --watchAll=false <pattern>` — run a single test file or pattern non-interactively
- `CI=true npm run build` (Bash) / `$env:CI='true'; npm run build` (PowerShell) — build the way Amplify does (ESLint warnings fail the build). Plain `npm run build` works everywhere but treats lint warnings as warnings
- `cd infra/visitor-counter/lambda && python -m unittest` — visitor-counter Lambda tests (stubbed DynamoDB, no AWS needed)

Do not run `npm run eject` — it is a one-way operation that abandons CRA's managed config.

## Architecture

Personal portfolio built on Create React App (react-scripts 5) with `react-router-dom` v6 (`BrowserRouter` in `src/index.js`). `src/App.jsx` defines the routes inside a shared `Layout` (`Nav` + `<Outlet/>` + `Footer`):

- `/` → `src/pages/Home.jsx`, which renders every home section in order (`Header`, `Portfolio`, `AiEngineering`, `Experience`, `About`, `Testimonials`, `Contact`, plus the floating `ScrollButton`).
- `/guides`, `/guides/:slug` → `src/pages/Guides.jsx` / `Guide.jsx`, driven by `src/content/guides/index.js`.
- `/memos`, `/memos/:slug` → `src/pages/Memos.jsx` / `Memo.jsx` (lazy-loaded; it pulls in react-markdown).
- `*` → `src/pages/NotFound.jsx`.

Home sections are reached by anchor `id`s. On the home page the nav (`src/components/nav/Nav.jsx`) uses plain `<a href="#id">` links so `html { scroll-behavior: smooth }` in `src/index.css` animates them; on other pages the same links become router links to `/#id`, and `src/hooks/useHashScroll.js` scrolls to the hash after the route changes (or to the top when there is no hash). `useActiveSection` only tracks on `/`. New home sections need a matching `id` on the `<section>` plus an entry in `Nav.jsx`; new pages need a `<Route>` in `App.jsx` and, if they belong in the nav, an entry in its `pages` list. Pages set their `<title>` with `useDocumentTitle`, and shared page styles (`.page`, `.page-intro`) live in `src/pages/pages.css`.

Hosting is AWS Amplify. Its rewrite rules are kept in the untracked `amplify-redirects.json` and pasted into the Amplify Console by hand: apex → www, 301s from the retired `/guides/*.html` files to their routes, then the SPA rewrite to `/index.html` last. The SPA rewrite sends any path whose extension isn't in its allowlist to `index.html`, so a new kind of static asset (e.g. `.md` for memos, `.pdf`) must be added to that list or it will be served as the HTML shell.

Each home section lives in `src/components/<name>/` as a paired `<Name>.jsx` + `<name>.css`, and the component imports its own stylesheet. Section content (portfolio cards, experience items, testimonials, Ask Marc answers) is hardcoded as a `data` array at the top of the component and rendered with `.map()`; there is no CMS or backend for content.

Long-form content lives in `src/content/`:

- **Guides** (`src/content/guides/`): `index.js` holds each guide's metadata (slug, title, summary, tags, reading time, optional explicit `toc`, license flag) and a `lazy()` component, so every guide is its own chunk. `src/components/guides/GuideLayout.jsx` renders the hero, a sticky table of contents with scroll-spy (the guide's `toc`, or else its h2s), and the CC BY 4.0 line.
  - `AiAutonomyLevels.jsx` is data-driven from `ai-autonomy/data.js`. Its checklist persists in `localStorage` under `alv4` with the shape `{ "<level>-<skill>": bool }`. Keep both the key and the shape: they match the retired standalone page, so visitors keep their progress.
  - `AvdEnterpriseWorkspace.jsx` was generated from the old standalone HTML. Text sits in `{"..."}` expressions so `<pre>` whitespace survives. Its class vocabulary (`phase`, `sec`, `steps`/`step`, `ib note|tip|warn|danger`, `tbl`, `code` + `kk/ks/kv/km/kc`, `card`, `arch-*`, `split-*`) is styled in `avd/guide-avd.css`, scoped under `.avd`.
- **Memos** (`src/content/memos/`): one `.md` file per memo, imported as a URL and fetched at runtime, then rendered with `react-markdown` + `remark-gfm` inside `.prose` (in `src/pages/pages.css`).
  - Metadata goes in `index.js`.
  - `draft: true` memos only render in development; in production they 404.
  - The Memos nav link appears only once a non-draft memo exists.
  - `_template.md` is a permanent draft that documents the format.

Global styling lives in `src/index.css` and defines the design system as CSS custom properties. Component CSS should consume these variables rather than hardcoding colours.

- **Theme:** dark is the default on `:root`; `:root[data-theme="light"]` overrides it.
- **Inline script:** one in `public/index.html` sets `data-theme` before first paint, from `localStorage` key `theme`, falling back to `prefers-color-scheme`. `src/hooks/useTheme.js` drives the nav's toggle.
- **`--color-white` means "strongest text":** it turns dark in light mode.
- **Translucent colours:** use the comma-separated RGB helpers, e.g. `rgba(var(--rgb-primary), 0.35)`.
- **Card surfaces:** add `box-shadow: var(--shadow-card)` so they still separate in light mode.
- **Global `<header>`/`<footer>` rules:** `header.css` and `footer.css` style the bare elements, so use divs for headers and footers inside pages.
- **Overriding global rules:** `src/index.css` is imported after `App`, so its global rules (e.g. `.btn`, `.container { margin: 0 auto }`) beat single-class component rules. Use compound selectors (`.container.guide-cards`, `.btn.contact__copy`) to override them.
- **Breakpoints:** `max-width: 1024px` (medium; the nav collapses into its menu sheet here too) and `max-width: 600px` (small). Each CSS file has its own media query blocks at the bottom.

The About section's "Ask Marc" panel (`src/components/about/AskMarc.jsx`) is a scripted chat: prompt chips with canned answers that type in. Every answer must come from existing site copy. The full bio stays in a "Read full bio" `<details>` below it.

The footer's visitor counter (`src/hooks/useVisitorCount.js`) calls the API in `infra/visitor-counter/`: Terraform for DynamoDB, a Python 3.12 Lambda and an API Gateway HTTP API.

- The hook reads `REACT_APP_VISITOR_API_URL` at build time. With no value, the counter is hidden.
- It sends one `POST` per browser session, then a `GET` every 60 seconds while the tab is visible.
- The stack is deployed by hand with `terraform apply` (see its README). Don't apply it, or change Amplify settings, without asking.

The contact form (`src/components/contact/Contact.jsx`) sends mail via EmailJS (`@emailjs/browser`) directly from the browser. The EmailJS service ID, template ID, and public key are committed in the source — they are intentionally public-key credentials, not secrets, but treat the template/service IDs as load-bearing when editing the form.

Images and other assets are imported as ES modules from `src/assets/` (e.g. `import IMG1 from '../../assets/expense-tracker-project.png'`) so webpack fingerprints them; do not reference them by string paths from `public/`.
