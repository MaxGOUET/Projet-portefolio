const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Inscription utilisateur
exports.signup = async (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => this.login(req, res, next))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Connexion utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "combinaison utilisateur/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: "combinaison utilisateur/mot de passe incorrecte",
            });
          }
          const JWTtoken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            },
          );
          res.cookie("JWTtoken", JWTtoken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.status(200).json({ message: "Connexion réussie !" });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Déconnexion utilisateur
exports.logout = (req, res, next) => {
  res.clearCookie("JWTtoken");
  res.status(200).json({ message: "Déconnexion réussie !" });
};
