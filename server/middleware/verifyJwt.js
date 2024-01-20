const jwt = require("jsonwebtoken");
// console.log(process.env.ACCESS_TOKEN_SECRET, process.env.REFRESH_TOKEN_SECRET);

const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "unauthorized or accesstoken are expire" });
    // console.log(authHeader);

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
      if (error) {
        return res.sendStatus(403).json({ message: `Invalid token: ${error}` });
      } else {
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next();
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server got error: ", error });
  }
};

module.exports = verifyJwt;
