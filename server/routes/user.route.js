const express = require("express");
const { registerUser } = require("../controllers/user.controller");
const { hadleNewUser } = require("../controllers/register.controller");
const { handleLogin } = require("../controllers/auth.controller");
const verifyJwt = require("../middleware/verifyJwt");
const {
  handleRefreshToken,
} = require("../controllers/refreshToken.controller");
const router = express.Router();

router.route("/users/register").get(verifyJwt, registerUser);

router.route("/users/new-register").post(hadleNewUser);

router.route("/users/login").post(handleLogin);

router.route("/users/refreshToken").get(handleRefreshToken);

module.exports = router;
