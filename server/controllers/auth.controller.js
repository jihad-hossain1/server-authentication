const userDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;
const path = require("path");
const jwt = require("jsonwebtoken");

// console.log(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  const foundUser = userDb.users.find((person) => person.username === user);

  if (!foundUser)
    return res.sendStatus(409).json({ message: "user are not found" });

  try {
    const match = await bcrypt.compare(pwd, foundUser.password);
    //store the new user

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    const otherUsers = userDb.users.filter(
      (person) => person.username !== foundUser.username
    );

    const currentUser = { ...foundUser, refreshToken };

    userDb.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDb.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin };
