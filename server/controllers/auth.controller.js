const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  const foundUser = await User.findOne({ username });

  if (!foundUser)
    return res.sendStatus(409).json({ message: "user are not found" });

  try {
    const match = await bcrypt.compare(password, foundUser.password);
    //store the new user

    if (match) {
      const roles = Object.values(foundUser?.roles);

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2m" }
      );

      foundUser.refreshToken = refreshToken;

      const result = await foundUser.save();

      console.log(result);

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        // secure: true,
        sameSite: "None",
      });
      res.status(200).json({ accessToken });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin };
