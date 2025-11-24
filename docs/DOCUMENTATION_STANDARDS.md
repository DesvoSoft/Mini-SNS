# Documentation and standardization opportunities

Brief list of areas that can be documented or aligned to make future contributions easier.

## Authentication and session flow
- Document in the README how `POST /login` behaves (mock users, role-based redirects) and `GET /logout`.
- Centralize a `requireSession` middleware to reuse validation in `/posts`, `/write`, `/profile`, and new routes.

## Data handling and mocks
- Explain in a "Demo data" section that `posts` is an in-memory array and how the state is reset on every restart.
- Add instructions for extending the categories (`categories`) and how to propagate changes to all views that consume them.

## Styles and UI
- Maintain a component catalog (see `docs/COMPONENTS_BEHAVIOR.md`) and document any new utility class in `_ui-helpers.ejs`.
- Standardize the use of buttons (`btn`, `btn-primary`, `btn-secondary`, `btn-success`) instead of ad-hoc classes.
- Create a size guide for titles and containers (`page-title`, `page-shell`, `content-card`) so new pages follow the same layout.

## Post form
- Note in the README or a dedicated section that `/posts` expects `content` and how it is trimmed with `trim()`.
- Add examples of future validations (character limit, HTML blocking) and document how visible errors should appear in the UI.

## Assets
- Document the `/public` structure and reserve a subdirectory for uploads (e.g., `/public/uploads`) if the profile image is added.
- Keep references to common stylesheets (`/css/bg.css`) and explain how to replace the Tailwind CDN with a local build if needed.

## Quality and tests
- Define in `package.json` or a `docs/TESTING.md` file how to run `npm test` and what it covers (currently syntax validation with `node --check app.js`).
- List minimal manual tests: login with mock users, create a post, and navigate protected views.
