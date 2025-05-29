let mongoose = require("mongoose");

let studentSchema = mongoose.Schema({
  sName: {
    type: String,
    required: true,
  },
  sEmail: {
    type: String,
    required: true,
    unique: true,
  },
});

const studentModel = mongoose.model("students", studentSchema);

module.exports = studentModel;
