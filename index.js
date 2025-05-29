const express = require("express");
const mongoose = require("mongoose");
const studentModel = require("./models/student.model");
const app = express();
require("dotenv").config();
app.use(express.json());

app.get("/student-list", async (req, res) => {
  const studentData = await studentModel.find();
  res.status(200).json(studentData);
});
app.post("/student-insert", async (req, res) => {
  const { sName, sEmail } = req.body;
  const insertStudent = new studentModel({ sName, sEmail });
  try {
    await insertStudent.save();
    res.status(201).json("Saved");
  } catch (error) {
    res.status(409).json(error);
  }
});

(async () => {
  try {
    await mongoose.connect(process.env.DBURL);
    console.log("Mongodb Connected");
    app.listen(process.env.PORT);
  } catch (error) {
    console.log(error);
  }
})();
