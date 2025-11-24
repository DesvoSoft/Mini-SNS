# Components and Tailwind in Mini-SNS

This document summarizes the reusable components available in `views/components` and how TailwindCSS is used in the EJS views to keep styles consistent.

## EJS Components

### `_header.ejs`
Sticky top bar with the title and, if a session exists, the username and a logout button. Include it at the start of the `body` on every authenticated page.

### `_footer.ejs`
Fixed bottom bar with a message and live date/time. It should go at the end of the `body` to preserve the same visual closure.

### `_gfont.ejs`
Loads the `Quantico` family from Google Fonts and defines the utility class `font-body-gamer` used in headings and highlighted text.

### `_ui-helpers.ejs`
Shared style block that normalizes layout and controls:
- `.app-body` applies the animated gradient background and the spacing needed for the fixed header and footer.
- `.page-shell` and `.page-shell--narrow` create centered containers with blur and shadow.
- `.page-title`, `.action-row`, `.btn` (and variants `btn-primary`, `btn-secondary`, `btn-success`) define consistent typography and buttons.
- `.content-card` groups cards with border and blur.
- `.input-label` and `.input-field` standardize form fields with a highlighted focus state.
- `.textarea-primary` keeps a coherent style for text areas.

Include this file in any page that uses those styles to avoid duplicating definitions.

### `_categories.ejs`
Renders categories with Tailwind utilities created via `@layer components` inside a `<style type="text/tailwindcss">` block. Useful on pages that list or filter content.

### `feed.ejs`
Single post card with title, content, and a comment box. It relies on Tailwind base classes and the background provided by `.app-body`.

## TailwindCSS usage

- **Loading**: All views include Tailwind through the CDN `<script src="https://cdn.tailwindcss.com"></script>`, with no build step.
- **Local extensions**: Some components declare styles inside `<style type="text/tailwindcss">` (for example, `_categories.ejs`) to leverage `@apply` and create custom utilities.
- **Global helpers**: `_ui-helpers.ejs` uses traditional CSS for layout and controls, complementing Tailwind utilities when `@apply` is not needed.
- **Animated backgrounds**: `public/css/bg.css` defines `gradientShift` and the `.animated-bg` class, consumed by `.app-body` to keep a single source for the animated background.

## Best practices

- Reuse `_header`, `_footer`, and `_ui-helpers` on every page to maintain visual coherence.
- Prefer `.input-field` and `.textarea-primary` for forms instead of ad-hoc styles.
- Place Tailwind customizations in `type="text/tailwindcss"` blocks within specific components to avoid duplicated styles.
- Keep the Tailwind CDN at the page level; there is no configuration or additional build step.
