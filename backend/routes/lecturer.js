const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Course = require("../models/Course")
const { authenticate } = require("../middleware/authMiddleware")

// GET lecturer info
router.get("/info", authenticate, async (req, res) => {
  try {
    const lecturer = await User.findById(req.user.id).select("-password")
    if (!lecturer || lecturer.role !== "Lecturer") {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    const courses = await Course.find({ _id: { $in: lecturer.courses } })

    // Get total students
    const totalStudents = await getTotalStudents(lecturer.courses)

    // Get upcoming classes
    const upcomingClasses = await getUpcomingClasses(lecturer.courses)

    res.json({
      ...lecturer.toObject(),
      courses,
      totalStudents,
      upcomingClasses,
    })
  } catch (error) {
    console.error("Error fetching lecturer info:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// GET grades for a specific course
router.get("/course/:courseId/grades", authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if the lecturer is teaching this course
    if (!course.lecturer.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to view grades for this course" })
    }

    const grades = await getGradesForCourse(req.params.courseId)
    res.json(grades)
  } catch (error) {
    console.error("Error fetching grades:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// PUT update grade for a student in a course
router.put("/course/:courseId/grade/:studentId", authenticate, async (req, res) => {
  try {
    const { grade } = req.body
    const course = await Course.findById(req.params.courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if the lecturer is teaching this course
    if (!course.lecturer.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to update grades for this course" })
    }

    // Update the grade
    const updatedGrade = await updateStudentGrade(req.params.courseId, req.params.studentId, grade)
    if (!updatedGrade) {
      return res.status(404).json({ message: "Student not found in this course" })
    }

    res.json({ message: "Grade updated successfully", grade: updatedGrade })
  } catch (error) {
    console.error("Error updating grade:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to get total students
async function getTotalStudents(courseIds) {
  // Implement logic to get total unique students across all courses
  return 50 // Placeholder
}

// Helper function to get upcoming classes
async function getUpcomingClasses(courseIds) {
  // Implement logic to fetch upcoming classes
  return 3 // Placeholder
}

// Helper function to get grades for a course
async function getGradesForCourse(courseId) {
  // Implement logic to fetch grades for a specific course
  return [] // Placeholder
}

// Helper function to update student grade
async function updateStudentGrade(courseId, studentId, newGrade) {
  // Implement logic to update a student's grade
  return newGrade // Placeholder
}

module.exports = router

