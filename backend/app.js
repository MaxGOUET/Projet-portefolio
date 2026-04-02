const express = require("express");

const mongoose = require("mongoose");

// const postRoutes = require("./routes/postRoutes");
// const userRoutes = require("./routes/userRoutes");

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const app = express();

app.use(express.json());

// capte toutes les erreur renvoyées par l'app

app.use((error, req, res, next) => {
  res
    .status(error.status || 400)
    .json({ message: error.message || "An error occurred" });
});

module.exports = app;
