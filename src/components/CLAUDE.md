# Components

## Sections and nav
- Each home section lives in `src/components/<name>/` as `<Name>.jsx` plus `<name>.css`, and the component imports its own stylesheet.
- Content (portfolio cards, experience items, testimonials, Ask Marc answers) is a hardcoded `data` array at the top of the component, rendered with `.map()`. There's no CMS or backend.
- Sections are reached by anchor `id`s. A new section needs an `id` on its `<section>` and an entry in `nav/Nav.jsx`.
- On `/`, the nav uses plain `<a href="#id">` links so `html { scroll-behavior: smooth }` animates them. On other pages the same links become router links to `/#id`, and `src/hooks/useHashScroll.js` scrolls to the hash after the route changes (or to the top when there's no hash).
- `useActiveSection` only tracks on `/`.

## Styling
`src/index.css` defines the design system as CSS custom properties. Component CSS consumes those variables instead of hardcoding colours.
- **Theme:** dark is the default on `:root`, and `:root[data-theme="light"]` overrides it. An inline script in the root `index.html` sets `data-theme` before first paint, from `localStorage` key `theme` and falling back to `prefers-color-scheme`. `src/hooks/useTheme.js` drives the nav toggle.
- **`--color-white` means "strongest text":** it turns dark in light mode.
- **Translucent colours:** use the comma-separated RGB helpers, e.g. `rgba(var(--rgb-primary), 0.35)`.
- **Colours that stay the same in both themes** (diagram backdrop, the always-dark code block, black shadows) are still tokens: `--color-diagram-bg`, `--color-code-bg`, `--color-code-text`, `--rgb-shadow`, set on `:root` only, so the light block doesn't override them.
- **Card surfaces:** add `box-shadow: var(--shadow-card)` so they still separate in light mode.
- **Global `<header>` / `<footer>` rules:** `header.css` and `footer.css` style the bare elements, so use divs for headers and footers inside pages.
- **Overriding global rules:** `src/index.css` is imported after `App`, so its global rules (`.btn`, `.container { margin: 0 auto }`) beat single-class component rules. Override with compound selectors (`.container.guide-cards`, `.btn.contact__copy`).
- **Breakpoints:**
  - `max-width: 1024px` (medium); the nav collapses into its menu sheet here too;
  - `max-width: 600px` (small).
  - Each CSS file keeps its own media query blocks at the bottom.

## Ask Marc (`about/AskMarc.jsx`)
A scripted chat: prompt chips with canned answers that type in. **Every answer must come from existing site copy.** The full bio stays in a "Read full bio" `<details>` below it.

## Contact form (`contact/Contact.jsx`)
- Sends mail via EmailJS (`@emailjs/browser`) directly from the browser.
- The service ID, template ID and public key are committed on purpose. They're public-key credentials, not secrets, but the template and service IDs are load-bearing, so don't change them casually.
