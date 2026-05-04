const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);
router.get("/isAuth", auth, userController.verifyAuth);

module.exports = router;
