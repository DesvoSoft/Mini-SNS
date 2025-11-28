# Components & Design System

This document provides a deep dive into the Mini SNS UI architecture, database models, hybrid styling approach, design tokens, and component reference.

## Table of Contents

- [Database Models](#database-models)
- [Design System](#design-system)
- [CSS Architecture](#css-architecture)
- [Component Reference](#component-reference)
- [State Management](#state-management)

---

## Database Models

### User Model (`models/user.js`)

**Purpose**: Stores user authentication and profile data.

**Fields**:

- `username` (String, unique) - User login identifier
- `password` (String) - Authentication credential (plain text, TODO: bcrypt)
- `avatarPath` (String, nullable) - Path to profile picture
- `redirect` (String, default: "/posts") - Post-login destination

**Usage**:

```javascript
const user = await User.findOne({ username });
await User.updateOne({ username }, { avatarPath });
```

### Feed Model (`models/feed.js`)

**Purpose**: Stores posts and embedded comments.

**Fields**:

- `uuid` (String, unique) - Auto-generated post identifier
- `content` (String) - Post text content
- `author` (String) - Username of post creator
- `comments` (Array) - Embedded comment subdocuments
  - `content` (String) - Comment text
  - `author` (String) - Comment author username
  - `createdAt` (Date) - Comment timestamp
- `createdAt` (Date) - Post creation timestamp

**Usage**:

```javascript
// Create post
await Feed.create({ author, content });

// Add comment
await Feed.updateOne({ uuid }, { $push: { comments: { content, author } } });

// Fetch posts
const posts = await Feed.find().sort({ createdAt: -1 });
```

---

## Design System

### Typography

- **Font Family**: `Quantico` (Google Fonts)
- **Classes**:
  - `font-body-gamer`: Main body text.
- **Usage**: Applied globally to `body` and specific components.

### Colors & Theme

- **Background**: Animated Gradient (`linear-gradient(-45deg, #0d1117, #c1eb74, #00d2ff, #0d1117)`)
- **Glassmorphism**: Heavy use of `backdrop-blur`, semi-transparent backgrounds (e.g., `bg-gray-900/40`), and borders.
- **Accents**:
  - **Cyan**: `#00d2ff` / `text-cyan-500` (Links, Highlights)
  - **Lime**: `#c1eb74` / `text-lime-400` (Brand, Success)
  - **Dark**: `#0d1117` (Base background)

## CSS Architecture

We use a **Hybrid Styling Approach** consisting of 4 distinct patterns. Understanding this is crucial for contributing.

### 1. Inline Tailwind Utility

_Used for: Layouts, one-off elements, and simple components._

- **Where**: `_header.ejs`, `_footer.ejs`, page templates.
- **Example**: `<div class="flex items-center space-x-4">`
- **Pros**: Rapid development, explicit styles.

### 2. Global Helpers (Raw CSS)

_Used for: Common UI elements that need consistency across the app._

- **Where**: `views/components/_ui-helpers.ejs`
- **Method**: Standard CSS classes defined in a `<style>` block.
- **Available Classes**:

  **Layout**

  - `.app-body`: Sets the animated gradient background and global font.
  - `.page-shell`: Main container with glassmorphism effect, max-width, and padding.
  - `.page-shell--narrow`: Modifier for narrower content (e.g., login/register forms).
  - `.page-title`: Standard styling for page headers (large, centered, cyan).
  - `.action-row`: Flex container for action buttons (space-between).
  - `.action-row--left`: Modifier to align actions to the start.
  - `.content-card`: Semi-transparent container for distinct sections of content.

  **Buttons**

  - `.btn`: Base class for buttons (flex, rounded, transition).
  - `.btn-primary`: Blue background (Action).
  - `.btn-secondary`: Gray background (Neutral).
  - `.btn-success`: Green background (Confirmation/Submit).

  **Forms**

  - `.input-label`: Label styling (bold, light gray).
  - `.input-field`: Standard text input (dark bg, border, focus ring).
  - `.input-ghost`: Minimalist input for less emphasis.
  - `.textarea-primary`: Standard textarea styling matching inputs.

### 3. Component Classes (@apply)

_Used for: Complex components with many repeated sub-elements._

- **Where**: `views/components/_categories.ejs`
- **Method**: Tailwind's `@apply` directive inside `<style type="text/tailwindcss">`.
- **Available Classes**:
  - `.category-wrap`: Container with glassmorphism and border.
  - `.category-title`: Section header with tracking and cyan color.
  - `.category-grid`: Flex wrap container for pills.
  - `.category-pill`: Interactive category chip with hover effects and shadow.
  - `.category-dot`: Decorative glowing dot inside the pill.

**Example Usage**:

```html
<div class="category-wrap">
  <h3 class="category-title">Topics</h3>
  <div class="category-grid">
    <a href="#" class="category-pill">
      <span class="category-dot"></span>
      Gaming
    </a>
  </div>
</div>
```

### 4. External Styles

_Used for: Global animations, base resets, and legacy styles._

- **Where**: `public/css/bg.css`, `public/css/posts.css`, `public/css/global.css`, `public/css/write.css`
- **Content**:
  - **Background**: Keyframe animations (`@keyframes gradientShift`) in `bg.css`.
  - **Posts (`posts.css`)**:
    - `.post`: Legacy container style (often overridden by Tailwind).
    - `.add-comment`: Blue submit button style.
    - `.comments`: Flex container for comments.
    - `.comment-count`: Small gray text for counts.
  - **Global (`global.css`)**:
    - Legacy base styles for `body`, `header`, `footer`, and `form`.
    - _Note: Often overridden by Tailwind classes in newer components._
  - **Write (`write.css`)**:
    - Specific form styles for the "Write Post" page (`form`, `input`, `textarea`, `button`).
    - _Note: Legacy styling, likely replaced by Tailwind in newer forms._

---

## Component Reference

### Core Layout

#### `_header.ejs`

- **Role**: Sticky top navigation bar.
- **Props**: `username` (String, optional) - If present, shows user menu; otherwise shows nothing (or login/register links if we add them).
- **Styling**:
  - **Container**: `fixed top-0 w-full z-10 bg-[#0D1117] border-b-2 border-[#34495e]`
  - **Brand**: `text-lime-400 hover:animate-pulse`

#### `_footer.ejs`

- **Role**: Fixed bottom bar with copyright and clock.
- **Props**: None.
- **Styling**: `fixed bottom-0 w-full bg-gray-900 border-t-2 border-gray-700`
- **Behavior**: Contains a script to update `#datetime` every second.

#### `_ui-helpers.ejs`

- **Role**: **CRITICAL**. Must be included in `<head>` to load global CSS classes.
- **Exports**: `.page-shell`, `.btn-*`, `.input-*`.
- **Usage**:
  ```ejs
  <%- include('components/_ui-helpers') %>
  <body class="app-body">
    <div class="page-shell">
      <!-- Content -->
    </div>
  </body>
  ```

### Feature Components

#### `_categories.ejs`

- **Role**: Displays a list of categories as "chips" or "pills".
- **Props**: `categories` (Array of Strings).
- **Styling**: Uses **Pattern #3 (@apply)**.
  - `.category-wrap`: Glass container.
  - `.category-pill`: Interactive chip with hover effects.

#### `feed.ejs` (Post Card)

- **Role**: Renders a single post with comments.
- **Props**: `post` (Object from Feed model).
  - `post.author` (String) - Post creator username
  - `post.content` (String) - Post text
  - `post.uuid` (String) - Unique post identifier
  - `post.comments` (Array) - Array of comment objects
- **Styling**:
  - Uses `bg-black/70` with glassmorphism effects.
  - Comment form submits to `/posts/:uuid/comments`.
  - Comments rendered server-side from `post.comments` array.
- **Features**:
  - Displays comment count
  - Comment submission form (POST to backend)
  - Comment list with author and content

---

## State Management

### Client-Side State

Mini SNS uses a **minimalist approach** to client-side state, relying mostly on server-rendered HTML.

- **Forms**: Native HTML form submissions.
- **Interactivity**: Vanilla JS for simple toggles (e.g., language switcher in docs).

### Server-Side State

- **Session**: `req.session` stores:
  - `username`: Current logged-in user.
  - `avatarPath`: Path to user's avatar.
  - `loginError`: Flash message for login failures.
- **Persistence**: MongoDB stores all permanent data (Users, Feed).

### Data Flow Pattern

1. **Request**: User performs action (POST /login).
2. **Update**: Server updates DB and Session.
3. **Response**: Server redirects or renders new HTML.
4. **Render**: Client receives fresh state via full page load.
