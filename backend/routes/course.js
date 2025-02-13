const express = require("express");
const Course = require("../models/Course");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// GET all courses
router.get("/", authenticate, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST create a new course
router.post("/", authenticate, async (req, res) => {
  const { courseCode, courseName, department, credits } = req.body;

  try {
    const course = new Course({
      courseCode,
      courseName,
      department,
      credits,
    });

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT update a course
router.put("/:id", authenticate, async (req, res) => {
  const { courseCode, courseName, department, credits } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    course.courseCode = courseCode;
    course.courseName = courseName;
    course.department = department;
    course.credits = credits;

    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE a course (Fixed)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    // Corrected delete method
    await Course.findByIdAndDelete(req.params.id);

    res.json({ msg: "Course removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
