const Post = require("../models/Post");
const GithubLanguages = require("../models/GithubLanguages").GithubLanguages;
const {
  saveGithubRepoLanguages,
  fetchGithubRepoLanguages,
} = require("../services/github");
const fs = require("fs");

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.getPostById = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

exports.createPost = async (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id;
  delete postObject._userId;
  const post = new Post({
    ...postObject,
    userId: req.auth.userId,
    imageUrl: req.body.imageUrl,
  });
  post
    .save()
    .then(async () => {
      const repoGithubUrlSplited = postObject.repoGithubUrl.split(".com/")[1];
      const languages = new GithubLanguages({
        repoGithubUrl: postObject.repoGithubUrl,
        languages: await fetchGithubRepoLanguages(repoGithubUrlSplited),
        date: new Date(),
      });
      await languages.save();
    })
    .then(() => res.status(201).json({ message: "Post créé avec succès !" }))

    .catch((error) =>
      res
        .status(400)
        .json({ message: error.message || "Une erreur est survenue" }),
    );
};

exports.updatePost = (req, res, next) => {
  Post.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: "Post mis à jour avec succès !" }),
    )
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => {
      fs.unlink(`images/${req.params.id}.webp`, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image :", err);
        }
      });
      res.status(200).json({ message: "Post supprimé avec succès !" });
    })
    .catch((error) => res.status(400).json({ error }));
};
