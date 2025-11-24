# Profile Image Implementation Guide

## Checklist

### 1. Storage & Validation

- [ ] **Storage**: Use `/public/uploads` or cloud storage.
- [ ] **Validation**: Max 2MB, `jpg/png/webp`.

### 2. Backend

- [ ] **Dependencies**: Install `multer`.
- [ ] **Routes**:
  - `GET /profile/avatar`: Edit form.
  - `POST /profile/avatar`: Handle upload.

### 3. Frontend

- [ ] **View**: Update `profile.ejs` with edit link.
- [ ] **Form**: Create `profile-avatar.ejs` with file input.
- [ ] **Styles**: Use `.avatar-ring` for styling.
