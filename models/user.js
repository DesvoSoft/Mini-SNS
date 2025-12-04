const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  friends: { type: [String], default: [] },
  avatarPath: { type: String, default: null },
  redirect: { type: String, default: "/posts" },
});

module.exports = mongoose.model("User", userSchema);
