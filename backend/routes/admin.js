const express = require("express")
const User = require("../models/User")
const Course = require("../models/Course")
const { authenticate } = require("../middleware/authMiddleware")
const router = express.Router()

// GET dashboard data
router.get("/dashboard", authenticate, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "Student" })
    const totalLecturers = await User.countDocuments({ role: "Lecturer" })
    const totalCourses = await Course.countDocuments()

    res.json({
      totalStudents,
      totalLecturers,
      totalCourses,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

