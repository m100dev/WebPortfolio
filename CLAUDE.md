# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server at http://localhost:3000
- `npm run build` — production build into `build/`
- `npm test` — Jest in watch mode (CRA's React Testing Library setup; no tests are currently authored in this repo)
- `npm test -- --watchAll=false <pattern>` — run a single test file or pattern non-interactively

Do not run `npm run eject` — it is a one-way operation that abandons CRA's managed config.

## Architecture

Single-page personal portfolio built on Create React App (react-scripts 5). There is no router: `src/App.jsx` renders every section in order (`Header`, `Nav`, `About`, `Experience`, `Services`, `Portfolio`, `Testimonials`, `Contact`, `Footer`), and the nav bar (`src/components/nav/Nav.jsx`) uses anchor links (`#home`, `#about`, `#experience`, `#services`, `#contact`) against `id`s on each section. `html { scroll-behavior: smooth }` in `src/index.css` powers the scroll transitions, so new sections must keep this pattern (matching `id` on the `<section>` plus an entry in `Nav.jsx`) for navigation to work.

Each section lives in `src/components/<name>/` as a paired `<Name>.jsx` + `<name>.css`, and the component imports its own stylesheet. Section content (portfolio cards, services, experience items, testimonials) is hardcoded as a `data` array at the top of the component and rendered with `.map()` — there is no CMS, JSON file, or backend; updating a project card means editing the array in the relevant component.

Global styling lives in `src/index.css` and defines the design system as CSS custom properties (`--color-bg`, `--color-primary`, `--container-width-lg/md/sm`, `--transition`). Component CSS should consume these variables rather than hardcoding colors. The site has two responsive breakpoints — `max-width: 1024px` (medium) and `max-width: 600px` (small) — and each component CSS file follows the same pattern with its own media query blocks at the bottom.

The contact form (`src/components/contact/Contact.jsx`) sends mail via EmailJS (`@emailjs/browser`) directly from the browser. The EmailJS service ID, template ID, and public key are committed in the source — they are intentionally public-key credentials, not secrets, but treat the template/service IDs as load-bearing when editing the form.

Images and other assets are imported as ES modules from `src/assets/` (e.g. `import IMG1 from '../../assets/expense-tracker-project.png'`) so webpack fingerprints them; do not reference them by string paths from `public/`.
