const Post = require("../models/Post");

exports.allPosts = (req, res, next) => {
  Post.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};

exports.onePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

exports.createPost = (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
    tag: req.body.tag,
    userId: req.body.userId,
    imageUrl: req.body.imageUrl,
  });
  post
    .save()
    .then(() => res.status(201).json({ message: "Post created successfully!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) => {
  Post.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Post updated successfully!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Post deleted successfully!" }))
    .catch((error) => res.status(400).json({ error }));
};
