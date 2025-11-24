# Components & Tailwind

## Core Components

| Component             | Role                                                 | Usage                                         |
| :-------------------- | :--------------------------------------------------- | :-------------------------------------------- |
| **`_header.ejs`**     | Sticky top bar with title and auth actions.          | Inside `<body>`, first element.               |
| **`_footer.ejs`**     | Fixed bottom bar with brand and live clock.          | Inside `<body>`, last element.                |
| **`_gfont.ejs`**      | Loads `Quantico` font and defines `font-body-gamer`. | Inside `<head>`.                              |
| **`_ui-helpers.ejs`** | Shared CSS for layout, buttons, and cards.           | Inside `<head>`, after Tailwind.              |
| **`_categories.ejs`** | Renders category chips.                              | In lists/forms. Requires `@layer components`. |
| **`feed.ejs`**        | Post card with author, content, and comment box.     | Included in loops (e.g., `posts.ejs`).        |

## Tailwind Usage

- **CDN**: Loaded via `<script src="https://cdn.tailwindcss.com"></script>`.
- **Custom Utilities**: Defined in `_ui-helpers.ejs` (layout/buttons) or specific components (e.g., `_categories.ejs`).
- **Background**: `public/css/bg.css` handles the animated gradient via `.app-body`.

## Best Practices

1.  **Structure**: `<body>` -> `_header` -> `<main class="page-shell">` -> `_footer`.
2.  **Styles**: Use `_ui-helpers.ejs` classes (`btn`, `input-field`) for consistency.
3.  **Extensions**: Add component-specific styles in `<style type="text/tailwindcss">` blocks.
