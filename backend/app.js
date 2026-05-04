// Importation des dépendances nécessaires
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Impossible de se connecter à MongoDB", err));

// Création de l'application Express
const app = express();

// Configuration de Helmet pour sécuriser les headers HTTP
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
  }),
);

// Configuration du limiteur de requêtes pour prévenir les attaques par force brute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de temps: 15 minutes
  limit: 100, // Limite de 100 requêtes par IP par fenêtre de temps
  standardHeaders: true, // Retourne les infos de rate limit dans les headers RateLimit-*
  legacyHeaders: false, // Désactive les headers X-RateLimit-*
  ipv6Subnet: 56, // Configuration du subnet IPv6
});
app.use(limiter);

// Servir les fichiers statiques images depuis le dossier "images"
app.use("/images", express.static(path.join(__dirname, "images")));

// Importation des routes utilisateur
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

// Middlewares pour parser les cookies et les requêtes JSON
app.use(cookieParser());
app.use(express.json());

// Middleware CORS pour gérer les requêtes cross-origin
app.use((req, res, next) => {
  // Autorise les requêtes depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Définit les headers autorisés dans les requêtes
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
  );
  // Définit les méthodes HTTP autorisées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

// Middleware de gestion des erreurs - Capture toutes les erreurs renvoyées par l'application
app.use((error, req, res, next) => {
  res
    .status(error.status || 400)
    .json({ message: error.message || "Une erreur est survenue" });
});

// Routes de l'application
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Exporte l'application Express
module.exports = app;
