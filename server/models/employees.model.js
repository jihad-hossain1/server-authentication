const mongoose = require("mongoose");

const employeeScema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeScema);

module.exports = Employee;
