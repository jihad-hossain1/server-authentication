// const asyncHandler = require(' ')

const registerUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "you are user now" });
  } catch (error) {
    return res.status(500).json({ message: `Error from server: ${error}` });
  }
};

module.exports = { registerUser };
