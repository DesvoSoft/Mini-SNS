# Profile Picture Upload Walkthrough

This guide demonstrates how to use and verify the new profile picture upload feature.

## Prerequisites

- Ensure the server is running: `npm start`
- Ensure `data/users.json` exists and contains user data.

## Steps to Verify

1.  **Login**

    - Go to `http://localhost:4000/`
    - Login with username: `Desvo` and password: `123`
    - _Note: Authentication now checks against `data/users.json`._

2.  **View Profile**

# Profile Picture Upload Walkthrough

This guide demonstrates how to use and verify the new profile picture upload feature.

## Prerequisites

- Ensure the server is running: `npm start`
- Ensure `data/users.json` exists and contains user data.

## Steps to Verify

1.  **Login**

    - Go to `http://localhost:4000/`
    - Login with username: `Desvo` and password: `123`
    - _Note: Authentication now checks against `data/users.json`._

2.  **View Profile**

    - Navigate to the Profile page (click user name in header or go to `/profile`).
    - **Observe**: You should see a default gray SVG avatar instead of the previous DiceBear avatar.
    - **Observe**: The "Joined" date and "Bio" should now pull from the JSON data (e.g., "Joined 2024-05-01").

3.  **Upload Avatar**

    - Hover over the avatar image. You should see a "Change" overlay.
    - Click the avatar. **A modal window will appear** (no page redirect).
    - Click "Select Image" and choose a JPG, PNG, or WEBP file (max 2MB).
    - Click "Upload".

4.  **Verify Upload**

    - The page will reload automatically.
    - **Success**: You should see a green "Avatar updated successfully!" message at the top.
    - **Visual**: The new image should be displayed as your avatar.
    - **Persistence**: Restart the server (`Ctrl+C` then `npm start`). Refresh the page. The uploaded avatar should still be there.

5.  **Verify Delete**

    - Click the avatar again to open the modal.
    - You should see a red "Delete Current Avatar" button.
    - Click it and confirm the dialog.
    - **Success**: You should see a green "Avatar deleted successfully!" message.
    - **Visual**: The avatar should revert to the default gray SVG.

6.  **Check Other Views**
    - The "Recent Posts" section on your profile should also show your new avatar next to your posts.

## Troubleshooting

- **Error: "No file uploaded"**: Ensure you selected a file.
- **Error: "File upload only supports images..."**: Ensure the file is an image (jpg, png, webp).
- **Avatar doesn't change**: Try doing a hard refresh (Ctrl+F5) to clear browser cache.
