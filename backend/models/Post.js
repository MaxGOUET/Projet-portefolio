const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  repoGithubUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: false },
});

module.exports = mongoose.model("Post", postSchema);
