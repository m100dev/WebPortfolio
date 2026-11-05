# CLAUDE.md

Marc Bastien's portfolio (marcbastien.com). Vite 8 + React 19 with `react-router` v7, hosted on AWS Amplify, with a Terraform-managed AWS API for the visitor counter.

## Principles
- **Security over quality over speed.** Never skip a security check or a review to ship faster. Changes that touch auth, user input, secrets, infra or dependencies get a security review before commit.
- **Quality:** tests and `npm run build` pass before every commit, and every change gets Marc's review.
- **Best patterns over clever one-offs:** established React and Terraform practice, design tokens, least-privilege IAM.

## Commands
Node ≥24.15 is required: `engines` in `package.json` plus `engine-strict=true` in `.npmrc` make npm refuse older versions. Amplify's build spec installs Node 24.
- `npm start`: Vite dev server at http://localhost:3000.
- `npm test`: Vitest in watch mode. `npm run test:once [pattern]` runs once, optionally filtered. `src/setupTests.js` shims `matchMedia`, `IntersectionObserver` and `scrollTo`.
- `npm run build`: `eslint . --max-warnings=0`, then `vite build` into `build/`. Exactly what Amplify runs, so a lint warning fails it.
- `npm run preview`: serves `build/` at http://localhost:3000 with the SPA fallback.
- Lambda tests: `cd infra/visitor-counter/lambda && python -m unittest`.

## Hard rules
- Import routing from `react-router`, never `react-router-dom`.
- Never `terraform apply`, change Amplify settings, push, merge or change repo visibility without asking.
- Commit messages: lowercase, past tense, one line.

## Map
- **Config:** `vite.config.mjs` (build + Vitest; `envPrefix` keeps the `REACT_APP_` names, output goes to `build/`, `.md` is never inlined) and `eslint.config.mjs`. They're `.mjs` because `package.json` deliberately has no `"type": "module"`: the CommonJS `tools/` scripts use `require()`.
- **Routes** (`src/App.jsx`, inside a shared `Layout` of `Nav`, `<Outlet/>` and `Footer`):
  - `/` → `pages/Home.jsx` (every home section, in order);
  - `/guides` and `/guides/:slug`;
  - `/memos` and `/memos/:slug` (lazy-loaded);
  - `*` → `NotFound`.
- **New pages:** add a `<Route>` in `App.jsx`, a nav entry in `Nav.jsx`'s `pages` list if it belongs in the nav, a `<title>` via `useDocumentTitle`, and use the shared `.page` / `.page-intro` styles in `src/pages/pages.css`.
- **Assets:** import images from `src/assets/` as modules so Vite fingerprints them. Never reference them by path from `public/`.
- **Colours:** always CSS custom properties from `src/index.css`, never hardcoded values.
- **Visitor counter hook:** `src/hooks/useVisitorCount.js` reads `import.meta.env.REACT_APP_VISITOR_API_URL` at build time, and the counter is hidden without it.
- **Hosting:** Amplify's rewrite rules live in the untracked `amplify-redirects.json` and are pasted into the console by hand, with the SPA rewrite last. That rewrite sends any extension missing from its allowlist to `index.html`, so a new static file type (`.md`, `.pdf`) must be added to the list.
- **Nested CLAUDE.md files** load when you work in their folder:
  - `src/components/CLAUDE.md`: sections, nav, styling, Ask Marc, contact form;
  - `src/content/CLAUDE.md`: guides and memos;
  - `infra/visitor-counter/CLAUDE.md`: the counter's AWS stack.

## Skills (`.claude/skills/`)
- `plan-refine`: checkpointed plans for multi-part work. Plans live in `docs/plans/`.
- `vuln-check`: code-level scan of changed JS/JSX (`npm run vuln-check -- <paths>`, tests via `npm run test:security`).
- `security-audit`: read-only repo-level audit (git history, deps, IAM, CORS, `.gitignore`, `public/`) that reports a findings table.
