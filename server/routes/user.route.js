const express = require("express");
const { getAllUsers } = require("../controllers/user.controller");
const { hadleNewUser } = require("../controllers/register.controller");
const { handleLogin } = require("../controllers/auth.controller");
const verifyJwt = require("../middleware/verifyJwt");
const {
  handleRefreshToken,
} = require("../controllers/refreshToken.controller");
const { handleLogout } = require("../controllers/logout.controller");
const roleList = require("../config/role.list");
const verifyRoles = require("../middleware/verifyRoles");

const router = express.Router();

router.route("/users").get(getAllUsers);

router.route("/users/new-register").post(hadleNewUser);

router.route("/users/login").post(handleLogin);

router.route("/users/refreshToken").get(handleRefreshToken);
// router
//   .route("/users/refreshToken")
//   .get(verifyRoles(roleList.Admin, roleList.Editor), handleRefreshToken);

router.route("/users/logout").get(verifyJwt, handleLogout);

module.exports = router;
