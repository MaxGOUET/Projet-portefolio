const express = require("express");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const app = express();
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user");
app.use(cookieParser());
app.use(express.json());

// capte toutes les erreur renvoyées par l'app

app.use((error, req, res, next) => {
  res
    .status(error.status || 400)
    .json({ message: error.message || "An error occurred" });
});

app.use("/api/auth", userRoutes);

module.exports = app;
