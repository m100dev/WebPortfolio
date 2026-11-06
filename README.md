# marcbastien.com

The source for my portfolio site: my projects and experience, long-form guides, and short memos.

## Stack
- **Frontend:** React 19, routed with `react-router` 7, built with Vite 8 and tested with Vitest and React Testing Library.
- **Hosting:** AWS Amplify (static hosting with an SPA rewrite).
- **Visitor counter:** an API Gateway HTTP API, a Python 3.12 Lambda and DynamoDB, managed with Terraform in [`infra/visitor-counter/`](infra/visitor-counter/README.md).
- **Contact form:** EmailJS, sent straight from the browser, with a honeypot field against bots ([`src/components/contact/README.md`](src/components/contact/README.md)).

## Requirements
Node 24.15 or later. `.npmrc` sets `engine-strict`, so npm refuses older versions.

## Commands
| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm start` | Dev server at http://localhost:3000 |
| `npm test` | Vitest in watch mode |
| `npm run test:once` | Run the tests once |
| `npm run build` | Lint (zero warnings allowed), then the production build into `build/`. Amplify runs the same command |
| `npm run preview` | Serve `build/` at http://localhost:3000 |

Set `REACT_APP_VISITOR_API_URL` at build time to show the visitor counter. Without it, the counter stays hidden.

## More
- [`LAUNCH.md`](LAUNCH.md): the launch checklist (Amplify rewrites, the counter rollout).
- [`infra/visitor-counter/README.md`](infra/visitor-counter/README.md): the counter's architecture, cost and abuse limits.
- [`docs/plans/`](docs/plans/): the checkpointed plans behind larger changes.
- [`CLAUDE.md`](CLAUDE.md): architecture notes and conventions for working in the repo.

Guides are licensed CC BY 4.0, as noted on each guide.
