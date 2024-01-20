const express = require("express");
const { registerUser } = require("../controllers/user.controller");
const { hadleNewUser } = require("../controllers/register.controller");
const router = express.Router();

router.route("/users/register").get(registerUser);

router.route("/users/new-register").post(hadleNewUser);

module.exports = router;
