const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Course = require("../models/Course")
const { authenticate } = require("../middleware/authMiddleware")

// GET student info
router.get("/info", authenticate, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select("-password")
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" })
    }

    const courses = await Course.find({ _id: { $in: student.courses } })

    // Calculate GPA (this is a simplified version)
    const gpa = calculateGPA(courses)

    // Get upcoming assignments (this would require an Assignment model)
    const upcomingAssignments = await getUpcomingAssignments(student.courses)

    res.json({
      ...student.toObject(),
      courses,
      gpa,
      upcomingAssignments,
    })
  } catch (error) {
    console.error("Error fetching student info:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to calculate GPA
function calculateGPA(courses) {
  // Implement GPA calculation logic
  return 3.5 // Placeholder
}

// Helper function to get upcoming assignments
async function getUpcomingAssignments(courseIds) {
  // Implement logic to fetch upcoming assignments
  return 5 // Placeholder
}

module.exports = router

