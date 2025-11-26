# Profile Image Implementation Guide

# Profile Image Implementation Guide

## Status: Implemented ✅

### 1. Storage & Persistence

- **Storage**: Local file system in `/public/uploads/avatars/`.
- **Persistence**: User data and avatar paths stored in `data/users.json`.
- **Validation**: Max 2MB, `jpg/png/webp` images only.

### 2. Backend

- **Dependencies**: `multer` installed and configured.
- **Routes**:
  - `GET /profile`: Renders profile with avatar and modal logic.
  - `POST /profile/avatar`: Handles file upload and updates JSON database.
  - `POST /profile/avatar/delete`: Deletes avatar file and updates JSON database.
- **Feedback**: Session-based flash messages for success/error notifications.

### 3. Frontend

- **View**: `profile.ejs` updated with:
  - Avatar display with "Change" button.
  - **Modal UI** for uploading/deleting avatars (no separate page).
  - Flash message display for user feedback.
- **Assets**: Default avatar SVG added at `/public/images/default-avatar.svg`.
- **DiceBear**: Removed completely.
