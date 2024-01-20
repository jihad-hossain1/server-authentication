// const userDb = {
//   users: require("../models/users.json"),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };

// const fsPromises = require("fs").promises;
// const path = require("path");

const bcrypt = require("bcrypt");
const User = require("../models/users.model");

const hadleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  const duplicate = await User.findOne({ username });
  if (duplicate)
    return res.status(409).json({ message: "user are already exist" });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    await User.create({
      username,
      password: hashedPwd,
    });

    res.status(200).json({ message: `user created successfull` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { hadleNewUser };
