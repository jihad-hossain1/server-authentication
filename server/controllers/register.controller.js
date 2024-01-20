const userDb = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const hadleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  const duplicate = userDb.users.find((person) => person.username === user);

  if (duplicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = { username: user, password: hashedPwd };

    userDb.setUsers([...userDb.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(userDb.users)
    );

    console.log(userDb.users);

    res.status(200).json({ message: `new user ${user} create` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { hadleNewUser };
