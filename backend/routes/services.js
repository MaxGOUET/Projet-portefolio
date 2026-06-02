const express = require("express");
const router = express.Router();
const servicesController = require("../services/github");

router.post("/github/languages", servicesController.getGithubRepoLanguages);

module.exports = router;
