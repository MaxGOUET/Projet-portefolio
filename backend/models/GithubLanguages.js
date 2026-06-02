const mongoose = require("mongoose");

const githubLanguagesSchema = mongoose.Schema({
  repoGithubUrl: { type: String, required: true },
  languages: { type: Object, required: true },
  date: { type: Date, required: true },
});

exports.GithubLanguages = mongoose.model(
  "GithubLanguages",
  githubLanguagesSchema,
);
