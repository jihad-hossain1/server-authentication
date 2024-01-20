const userDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  // on client , also delete the accesstoken

  const cookies = req.cookies;
  //   console.log(cookies);
  if (!cookies?.jwt) return res.status(204); // No content send back
  //   console.log(cookies?.jwt);

  const refreshToken = cookies.jwt;

  const foundUser = userDb.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(403);
  }

  // delete refresh token

  const otherUsers = userDb.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: "" };
  userDb.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(userDb.users)
  );

  res.clearCookie("jwt", { httpOnly: true }); // secure: true only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };