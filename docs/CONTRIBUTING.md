# Contributing to Mini SNS

## Standards

### Authentication

- **Session**: Use `req.session.username` to check auth.
- **Middleware**: Future: Centralize session checks.

### Data

- **Mocks**: `posts` are in-memory and reset on restart.
- **Categories**: Defined in `app.js`.

### UI/UX

- **Styles**: Use `_ui-helpers.ejs` classes (`btn`, `page-shell`).
- **Icons**: Use standard emojis or SVG icons consistent with the theme.

### Testing

- **Manual**:
  1.  Login (Desvo/123).
  2.  Create a post.
  3.  Check profile.
  4.  Logout.
