const User = require("../models/users.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `Error from server: ${error}` });
  }
};

module.exports = { getAllUsers };
