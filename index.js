const express = require("express");
const mongoose = require("mongoose");
const studentModel = require("./models/student.model");
const app = express();
require("dotenv").config();
app.use(express.json());

// GET all students
app.get("/student-list", async (req, res) => {
  try {
    const studentData = await studentModel.find();
    res.status(200).json(studentData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
});

// GET single student by ID
app.get("/student/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const student = await studentModel.findById(_id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching student", error: error.message });
  }
});

// CREATE new student
app.post("/student-insert", async (req, res) => {
  const { sName, sEmail } = req.body;

  if (!sName || !sEmail) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const insertStudent = new studentModel({ sName, sEmail });
  try {
    const savedStudent = await insertStudent.save();
    res
      .status(201)
      .json({ message: "Student created successfully", student: savedStudent });
  } catch (error) {
    res
      .status(409)
      .json({ message: "Error creating student", error: error.message });
  }
});

// DELETE student
app.delete("/student-delete/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteRes = await studentModel.deleteOne({ _id });

    if (deleteRes.deletedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Student deleted successfully", result: deleteRes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
});

// DELETE MANY students
app.delete("/students-delete-many", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Valid array of student IDs is required" });
    }

    const deleteRes = await studentModel.deleteMany({ _id: { $in: ids } });

    if (deleteRes.deletedCount === 0) {
      return res.status(404).json({ message: "No students found to delete" });
    }

    res.status(200).json({
      message: `Successfully deleted ${deleteRes.deletedCount} students`,
      result: deleteRes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting students", error: error.message });
  }
});

// UPDATE student
app.put("/student-update/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const { sName, sEmail } = req.body;

    if (!sName && !sEmail) {
      return res
        .status(400)
        .json({ message: "At least one field to update is required" });
    }

    const updateData = {};
    if (sName) updateData.sName = sName;
    if (sEmail) updateData.sEmail = sEmail;

    const updateRes = await studentModel.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateRes) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Student updated successfully", student: updateRes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
});

// UPDATE MANY students
app.put("/students-update-many", async (req, res) => {
  try {
    const { filter, update } = req.body;

    if (
      !filter ||
      !update ||
      Object.keys(filter).length === 0 ||
      Object.keys(update).length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Both filter and update objects are required" });
    }

    const updateRes = await studentModel.updateMany(
      filter,
      { $set: update },
      {
        runValidators: true,
      }
    );

    if (updateRes.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: "No students found matching the filter" });
    }

    res.status(200).json({
      message: `Successfully updated ${updateRes.modifiedCount} of ${updateRes.matchedCount} matched students`,
      result: updateRes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating students", error: error.message });
  }
});

mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log("Mongodb Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
