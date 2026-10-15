const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: Number,
    department: String,
    marks: Number
});

// Student Model
const Student = mongoose.model("Student", studentSchema);

// CREATE - Add Student
app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ - Get All Students
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// READ - Get Student by ID
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        res.status(400).json({ error: "Invalid student ID" });
    }
});

// UPDATE - Update Student
app.put("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE - Delete Student
app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid student ID" });
    }
});

// Start Server
mongoose.connection.once("open", () => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});