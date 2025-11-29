# Contributing to Mini SNS

Thank you for your interest in contributing to Mini SNS! This guide will help you understand our development standards and workflow.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Development Setup

### Prerequisites

1. **Node.js** (LTS version)
2. **MongoDB** (6.0+) running locally
3. **Git** for version control

### Local Setup

```bash
# Clone the repository
git clone <repository-url>
cd mini-sns

# Install dependencies
npm install

# Start MongoDB
mongod  # or: brew services start mongodb-community

# Start the application
npm start
```

The app will connect to `mongodb://localhost:27017/mydb` and auto-seed users from `data/users.json` if the database is empty.

---

## Code Standards

### Authentication

- **Session Management**: Always check `req.session.username` for authentication.
- **Protected Routes**: Redirect to `/` if `!req.session.username`.
- **Future**: Centralize auth checks with middleware.

**Example**:

```javascript
app.get("/protected", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }
  // ... route logic
});
```

### Database Operations

- **Use Async/Await**: All MongoDB operations must use `async/await`.
- **Error Handling**: Wrap database calls in try/catch blocks.
- **Models**: Always interact with the database through Mongoose models.

**Example**:

```javascript
app.post("/posts", async (req, res) => {
  try {
    await Feed.create({ author: req.session.username, content });
    res.redirect("/posts");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Server error");
  }
});
```

### Data Models

**Current Collections:**

- `users` - User accounts (username, password, avatarPath, redirect)
- `feed` - Posts and embedded comments

**Schema Guidelines:**

- Use descriptive field names
- Add validation where appropriate (`required`, `unique`)
- Use defaults for optional fields
- Document schema changes in `docs/ARCHITECTURE.md`

### UI/UX Standards

- **Styles**: Use classes from `_ui-helpers.ejs` (`.btn-*`, `.page-shell`, `.input-*`).
- **Components**: Follow the 4-pattern hybrid styling approach (see `COMPONENTS.md`).
- **Icons**: Use emojis or SVG icons consistent with the cyan/lime theme.
- **Flash Messages**: Use session-based flash messages for user feedback.

**Example**:

```javascript
req.session.successMessage = "Action completed!";
res.redirect("/profile");
```

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a pull request, verify:

1. **Authentication**

   - [ ] Login with `Desvo/123` and `Tom/1234`
   - [ ] Logout clears session
   - [ ] Protected routes redirect unauthenticated users

2. **Posts**

   - [ ] Create a new post from `/write`
   - [ ] Post appears in feed at `/posts`
   - [ ] Posts are sorted by newest first

3. **Comments**

   - [ ] Add a comment to a post
   - [ ] Comment appears immediately after page reload
   - [ ] Comment count updates correctly

4. **Profile**

   - [ ] View profile shows user's posts
   - [ ] Upload avatar (max 2MB, jpg/png/webp)
   - [ ] Delete avatar reverts to default

5. **Database Persistence**
   - [ ] Restart server
   - [ ] Verify data persists (posts, comments, avatars)

### MongoDB Verification

Use MongoDB Compass or the mongo shell to inspect data:

```bash
mongosh
use mydb
db.users.find()
db.feed.find()
```

---

## Pull Request Process

### Before Submitting

1. **Branch Naming**: Use descriptive names
   - `feature/comment-system`
   - `fix/avatar-upload`
   - `docs/update-readme`
2. **Commit Messages**: Clear, present tense
   - "Add comment feature" (Good)
   - "Added comments" (Bad)
3. **Test Locally**: Complete the manual testing checklist
4. **Update Docs**: If you changed functionality, update relevant `.md` files

```bash
# Example Workflow
git checkout -b feature/amazing-feature
# ... make changes ...
git add .
git commit -m "Implement amazing feature"
git push origin feature/amazing-feature
```

### PR Checklist

- [ ] Code follows existing patterns and conventions
- [ ] All routes use async/await for database operations
- [ ] Error handling is implemented
- [ ] Flash messages provide user feedback
- [ ] Manual testing completed
- [ ] Documentation updated (if needed)

### Review Process

1. Submit PR with descriptive title and summary
2. Address reviewer feedback
3. Ensure CI checks pass (when implemented)
4. Await approval and merge

---

## Common Patterns

### Adding a New Route

```javascript
// GET route
app.get("/new-page", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    const data = await Model.find();
    res.render("new-page", {
      username: req.session.username,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.redirect("/");
  }
});

// POST route
app.post("/new-action", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  try {
    await Model.create({ ...req.body });
    req.session.successMessage = "Success!";
    res.redirect("/success-page");
  } catch (error) {
    console.error("Error:", error);
    req.session.errorMessage = "Something went wrong.";
    res.redirect("/error-page");
  }
});
```

### Adding a New Schema Field

1. Update the Mongoose schema in `models/`
2. Test with seed data or manual creation
3. Update documentation in `docs/ARCHITECTURE.md`
4. Consider migration needs for existing documents

---

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Review existing documentation in `/docs`
- Check the in-app docs at `http://localhost:4000/docs`

Thank you for contributing! 🎉
