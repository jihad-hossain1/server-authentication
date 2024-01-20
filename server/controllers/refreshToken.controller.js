const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = await req?.cookies;

    if (!cookies?.jwt)
      return res.status(401).json({ message: "cookies are not found" });

    const refreshToken = await cookies?.jwt;

    const foundUser = await User.findOne({ refreshToken });

    if (!foundUser)
      return res.sendStatus(409).json({ message: "user are not found" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (error, decoded) => {
        if (error || foundUser.username !== decoded.username)
          return res
            .status(403)
            .json({ message: "founded user and decoded user are not same" });
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = { handleRefreshToken };
