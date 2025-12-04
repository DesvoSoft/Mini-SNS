const mongoose = require("mongoose");

const { v4: uuidv4 } = require("uuid");

// agregar más información (por ejemplo, datos de comentarios y likes)
const feedSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    comments: [
      {
        content: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feed" }
);

module.exports = mongoose.model("Feed", feedSchema);
