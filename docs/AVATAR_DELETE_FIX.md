# Avatar Delete Feature & Success Messages - Implementation Guide

## Issue Summary

1. **Delete button shows "Please select a file"** - The delete form was nested inside the upload form
2. **No success messages** - Need to add session-based flash messages after upload/delete

## Solution Overview

The delete form needs to be separated from the upload form, and we need to add session-based success/error messages.

## Files to Modify

### 1. `views/profile-avatar.ejs` - ALREADY FIXED ✅

The file has been corrected to:

- Move the delete form OUTSIDE the upload form (into its own separate form)
- Add message display boxes at the top of the page for success/error messages
- The delete button now appears below the upload form, separated by a border

**Changes made:**

- Added success message display (green background)
- Added error message display (red background)
- Moved delete form after the upload form closes (not nested inside)

### 2. `app.js` - NEEDS MANUAL FIX

Since automated edits keep corrupting the file, here are the exact changes needed:

#### Change 1: Update `GET /profile/avatar` route (around line 188-197)

**Find this:**

```javascript
app.get("/profile/avatar", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const user = getUserByUsername(req.session.username);
  res.render("profile-avatar", {
    username: req.session.username,
    user: user,
  });
});
```

**Replace with:**

```javascript
app.get("/profile/avatar", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  const user = getUserByUsername(req.session.username);

  // Get flash messages from session
  const successMessage = req.session.successMessage;
  const errorMessage = req.session.errorMessage;
  delete req.session.successMessage;
  delete req.session.errorMessage;

  res.render("profile-avatar", {
    username: req.session.username,
    user: user,
    successMessage: successMessage,
    errorMessage: errorMessage,
  });
});
```

#### Change 2: Update `POST /profile/avatar` route (around line 199-215)

**Find this:**

```javascript
app.post("/profile/avatar", upload.single("avatar"), (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Path relative to public folder for frontend use
  const avatarPath = "/uploads/avatars/" + req.file.filename;

  // Update user data
  updateUserAvatar(req.session.username, avatarPath);

  // Update session
  req.session.avatarPath = avatarPath;

  res.redirect("/profile");
});
```

**Replace with:**

```javascript
app.post("/profile/avatar", upload.single("avatar"), (req, res) => {
  if (!req.session.username) {
    return res.redirect("/");
  }

  if (!req.file) {
    req.session.errorMessage = "No file uploaded. Please select an image.";
    return res.redirect("/profile/avatar");
  }

  // Path relative to public folder for frontend use
  const avatarPath = "/uploads/avatars/" + req.file.filename;

  // Update user data
  updateUserAvatar(req.session.username, avatarPath);

  // Update session
  req.session.avatarPath = avatarPath;
  req.session.successMessage = "Avatar updated successfully!";

  res.redirect("/profile");
});
```

#### Change 3: Update `POST /profile/avatar/delete` route (around line 237-243)

**Find this:**

```javascript
    // Update session
    req.session.avatarPath = null;
  }

  res.redirect("/profile");
});
```

**Replace with:**

```javascript
    // Update session
    req.session.avatarPath = null;
    req.session.successMessage = "Avatar deleted successfully!";
  }

  res.redirect("/profile");
});
```

## Testing After Changes

1. Restart the server

2. **Test Delete**:

   - Go to `/profile/avatar` with a user who has an avatar
   - Click "Delete Current Avatar"
   - Should NOT show "Please select a file" error
   - Should redirect to profile with success message

3. **Test Upload Success**:

   - Upload a new avatar
   - Should see "Avatar updated successfully!" message

4. **Test Upload Error**:
   - Click "Upload New Avatar" without selecting a file
   - Should see error message and stay on avatar page

## Summary of Changes

- ✅ `profile-avatar.ejs` - Fixed (delete form separated, messages added)
- ⏳ `app.js` - Needs manual update (3 small changes to add flash messages)

The functionality will work correctly once the `app.js` changes are applied.
