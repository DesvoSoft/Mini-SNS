# MongoDB Migration Plan

## Goal

Migrate the current local JSON file persistence (`data/users.json`) to a local MongoDB database using Mongoose. This will improve scalability, data integrity, and allow for more complex queries.

## Prerequisites

- MongoDB installed locally (Community Edition) or a cloud Atlas URI.
- Node.js environment (already set up).

## 1. Dependencies

Install the necessary packages:

```bash
npm install mongoose dotenv
```

## 2. Configuration

Create a `.env` file to store the database connection string and other secrets.

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mini-sns
SESSION_SECRET=your_secret_key
```

## 3. Database Connection

Create `config/db.js` to handle the connection logic.

```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 4. Data Models (Schemas)

Create Mongoose schemas in a `models/` directory.

### `models/User.js`

```javascript
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Note: Should hash passwords in future
  avatarPath: { type: String, default: null },
  bio: { type: String, default: "" },
  joinedDate: { type: Date, default: Date.now },
  redirect: { type: String, default: "/posts" },
});

module.exports = mongoose.model("User", UserSchema);
```

### `models/Post.js` (Future)

Currently posts are hardcoded in `app.js`. We should also migrate them.

```javascript
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Could reference User model
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
```

## 5. Data Migration Script

Create a script `scripts/migrate-data.js` to move data from `users.json` to MongoDB.

1. Connect to MongoDB.
2. Read `data/users.json`.
3. Iterate through users and use `User.create()` or `User.insertMany()`.
4. Log success/failure.
5. Exit.

## 6. Application Refactoring (`app.js`)

Replace the file-based persistence logic with Mongoose calls.

- **Remove**: `fs`, `DATA_FILE`, `loadUsers`, `saveUsers`, `getUserByUsername`, `updateUserAvatar`.
- **Import**: `connectDB`, `User` model.
- **Initialize**: Call `connectDB()` at startup.
- **Update Routes**:
  - `POST /login`: Use `await User.findOne({ username })`.
  - `GET /profile`: Use `await User.findOne({ username })`.
  - `POST /profile/avatar`: Use `await User.findOneAndUpdate(...)`.
  - `POST /profile/avatar/delete`: Use `await User.findOneAndUpdate(...)`.

## 7. Verification

- Verify data exists in MongoDB (using Compass or Shell).
- Test Login, Profile View, Avatar Upload, and Delete features.
- Ensure no regressions in UI/UX.
