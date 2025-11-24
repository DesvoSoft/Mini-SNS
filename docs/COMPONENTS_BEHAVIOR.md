# Behavior of the EJS components

This document describes what each component in `views/components` does, what data it expects, and which views use it. Use it as a quick reference to keep consistency when adding new pages or refactoring existing ones.

## `_header.ejs`
- **Role**: Sticky top bar with the "Mini SNS" title and session action.
- **Required data**: `username` (optional string). If present, it shows the name and a `Logout` button; otherwise, the button says `Login` and links back to `/`.
- **Dependencies**: Uses classes defined in `_ui-helpers.ejs` (`app-header`, `btn` and its variants).
- **Where it is used**: All top-level views (`index.ejs`, `posts.ejs`, `write.ejs`, `profile.ejs`). Always include it right after opening `<body>` so it reserves space for the background gradient.

## `_footer.ejs`
- **Role**: Fixed footer that shows the brand and a live clock.
- **Required data**: None.
- **Dependencies**: Requires the style block from `_ui-helpers.ejs` for the `app-footer` class. Uses inline JavaScript to update the time every second.
- **Where it is used**: All top-level views. Place it at the end of `<body>` so the main content respects its height.

## `_gfont.ejs`
- **Role**: Injects the `Quantico` font from Google Fonts and declares the `font-body-gamer` utility.
- **Required data**: None.
- **Dependencies**: Depends on the Google Fonts CDN; no additional stylesheets needed.
- **Where it is used**: All views. Include it in `<head>` before local styles so the font is available.

## `_ui-helpers.ejs`
- **Role**: Shared stylesheet with helpers for layout, buttons, forms, and cards.
- **Required data**: None.
- **Dependencies**: Relies on the Tailwind CDN for the basic reset but defines plain CSS to keep consistency even if Tailwind is missing.
- **Where it is used**: All views. Load it in `<head>` after Tailwind and `_gfont.ejs`.

## `_categories.ejs`
- **Role**: Renders the list of categories as clickable chips with `@apply` styles for hover and selection.
- **Required data**: `categories` (array of strings). It does not implement selection logic; it only renders labels.
- **Dependencies**: Uses `@layer components` inside `<style type="text/tailwindcss">`, so Tailwind must be available on the page.
- **Where it is used**: `posts.ejs` (listing) and `write.ejs` (form), but it can be reused in new filtering views.

## `feed.ejs`
- **Role**: Single post card (author, content, faux actions, and quick comment box).
- **Required data**: `post` with `username` and `content` properties.
- **Dependencies**: Expects the parent container to provide the background (`app-body`) and the button/input utilities defined in `_ui-helpers.ejs`.
- **Where it is used**: `posts.ejs` via `include("feed", { post })`. It can be reused for paginated feeds or summaries.

## Usage conventions
- Keep the include order in the views: first Tailwind CDN, then `_gfont.ejs`, followed by `_ui-helpers.ejs`, and finally specific stylesheets (`/css/bg.css`).
- When creating new pages, replicate the current structure (`<body class="app-body">`, header, `<main class="page-shell">`, footer) so the animated background and spacing stay consistent.
- If a component needs new data, document the expected props in this file and add sample values in the consuming view to avoid silent failures.
