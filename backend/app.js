const express = require("express");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

// capte toutes les erreur renvoyées par l'app

app.use((error, req, res, next) => {
  res
    .status(error.status || 400)
    .json({ message: error.message || "An error occurred" });
});

module.exports = app;
