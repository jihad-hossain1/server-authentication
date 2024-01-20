const User = require("../models/users.model");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(204);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(403);
  }
  foundUser.refreshToken = "";

  const result = await foundUser.save();

  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.sendStatus(204);
};

module.exports = { handleLogout };
