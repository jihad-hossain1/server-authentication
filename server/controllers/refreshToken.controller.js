const userDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.status(401);
  console.log(cookies?.jwt);

  const refreshToken = cookies.jwt;

  const foundUser = userDb.users.find(
    (person) => person.refreshToken === refreshToken
  );

  if (!foundUser)
    return res.sendStatus(409).json({ message: "user are not found" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || foundUser.username !== decoded.username)
        return res.sendStatus(403);

      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
