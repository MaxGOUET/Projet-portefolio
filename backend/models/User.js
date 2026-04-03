// Modèle User
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Schéma de l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Applique le plugin de validation unique au schéma
userSchema.plugin(uniqueValidator.default);

module.exports = mongoose.model("User", userSchema);
