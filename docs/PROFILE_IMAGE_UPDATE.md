# Guide to add or update the profile image

These steps outline how to implement an editable profile photo for authenticated users.

## 1) Image source
- **Quick mock**: Accept a remote URL and store it in the session (`req.session.avatarUrl`).
- **Persistence**: If real storage is added, use disk (`/public/uploads`) or a bucket. Avoid storing binaries in the session.
- **Validation**: Enforce a max size (e.g., 2 MB) and allowed types (`image/jpeg`, `image/png`, `image/webp`).

## 2) Back-end
- **Dependencies**: Add `multer` to handle `multipart/form-data` if file uploads are supported.
- **Suggested routes**:
  - `GET /profile/avatar`: Renders a form with the current image and a file or URL input.
  - `POST /profile/avatar`: Processes the form, validates the file/URL, saves the path (session or database), and redirects to `/profile`.
- **Protection**: Requires an active session. Use middleware to reuse validation across any profile route.

## 3) Views
- **`profile.ejs`**:
  - Show the image with a default placeholder (e.g., `/css/avatar-placeholder.png`).
  - Add a link to `GET /profile/avatar` to edit.
- **`profile-avatar.ejs` (new)**:
  - Form with `input type="file"` and/or `input type="url"`.
  - Live preview using an `<img>` that reacts to input changes.

## 4) Styles and components
- Reuse `_ui-helpers.ejs` utilities for buttons and inputs.
- Create a utility class `.avatar-ring` for consistent borders (`border-4 border-cyan-300 rounded-full`).
- If a reusable EJS component (`_avatar.ejs`) is added, document its props (`src`, `alt`, `size`) in `docs/COMPONENTS_BEHAVIOR.md`.

## 5) Manual testing
- Upload a valid image and confirm it renders in `profile.ejs`.
- Try a file with a disallowed type and verify an error is shown.
- Load a broken URL and check the fallback to the placeholder.
- Confirm that logging out clears the avatar path stored in the session.

## 6) Deployment checklist
- Ignore `/public/uploads` in `.gitignore` to avoid committing local files.
- Add a size limit in `multer` (`limits.fileSize`) and global error handling.
- If using a CDN/bucket, document environment variables (e.g., `AVATAR_BUCKET_URL`) in `.env.example` and README.
