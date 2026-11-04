# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server at http://localhost:3000
- `npm run build` — production build into `build/`
- `npm test` — Jest in watch mode (CRA's React Testing Library setup; no tests are currently authored in this repo)
- `npm test -- --watchAll=false <pattern>` — run a single test file or pattern non-interactively

Do not run `npm run eject` — it is a one-way operation that abandons CRA's managed config.

## Architecture

Personal portfolio built on Create React App (react-scripts 5) with `react-router-dom` v6 (`BrowserRouter` in `src/index.js`). `src/App.jsx` defines the routes inside a shared `Layout` (`Nav` + `<Outlet/>` + `Footer`):

- `/` → `src/pages/Home.jsx`, which renders every home section in order (`Header`, `Portfolio`, `AiEngineering`, `Experience`, `About`, `Testimonials`, `Contact`, plus the floating `ScrollButton`).
- `/guides`, `/guides/:slug` → `src/pages/Guides.jsx` / `Guide.jsx`, driven by `src/content/guides/index.js`.
- `/memos`, `/memos/:slug` → `src/pages/Memos.jsx` / `Memo.jsx`.
- `*` → `src/pages/NotFound.jsx`.

Home sections are reached by anchor `id`s. On the home page the nav (`src/components/nav/Nav.jsx`) uses plain `<a href="#id">` links so `html { scroll-behavior: smooth }` in `src/index.css` animates them; on other pages the same links become router links to `/#id`, and `src/hooks/useHashScroll.js` scrolls to the hash after the route changes (or to the top when there is no hash). `useActiveSection` only tracks on `/`. New home sections need a matching `id` on the `<section>` plus an entry in `Nav.jsx`; new pages need a `<Route>` in `App.jsx` and, if they belong in the nav, an entry in its `pages` list. Pages set their `<title>` with `useDocumentTitle`, and shared page styles (`.page`, `.page-intro`) live in `src/pages/pages.css`.

Hosting is AWS Amplify. Its rewrite rules are kept in the untracked `amplify-redirects.json` and pasted into the Amplify Console by hand: apex → www, 301s from the retired `/guides/*.html` files to their routes, then the SPA rewrite to `/index.html` last.

Each section lives in `src/components/<name>/` as a paired `<Name>.jsx` + `<name>.css`, and the component imports its own stylesheet. Section content (portfolio cards, services, experience items, testimonials) is hardcoded as a `data` array at the top of the component and rendered with `.map()` — there is no CMS, JSON file, or backend; updating a project card means editing the array in the relevant component.

Global styling lives in `src/index.css` and defines the design system as CSS custom properties (`--color-bg`, `--color-primary`, `--container-width-lg/md/sm`, `--transition`). Component CSS should consume these variables rather than hardcoding colors. The site has two responsive breakpoints — `max-width: 1024px` (medium) and `max-width: 600px` (small) — and each component CSS file follows the same pattern with its own media query blocks at the bottom.

The contact form (`src/components/contact/Contact.jsx`) sends mail via EmailJS (`@emailjs/browser`) directly from the browser. The EmailJS service ID, template ID, and public key are committed in the source — they are intentionally public-key credentials, not secrets, but treat the template/service IDs as load-bearing when editing the form.

Images and other assets are imported as ES modules from `src/assets/` (e.g. `import IMG1 from '../../assets/expense-tracker-project.png'`) so webpack fingerprints them; do not reference them by string paths from `public/`.
