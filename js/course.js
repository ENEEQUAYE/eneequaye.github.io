// Global variables
let courses = []
let lecturers = []
const API_URL = "http://localhost:5000/api"

// Function to fetch courses from the server
async function fetchCourses() {
  try {
    const response = await fetch(`${API_URL}/course`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch courses")
    }
    courses = await response.json()
    displayCourses()
  } catch (error) {
    console.error("Error fetching courses:", error)
    alert("Failed to load courses. Please try again.")
  }
}

// Function to display courses in the table
function displayCourses() {
  const tableBody = document.getElementById("courseTableBody")
  tableBody.innerHTML = ""

  courses.forEach((course) => {
    const row = tableBody.insertRow()
    row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.department}</td>
            <td>${course.credits}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCourse('${course._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
            </td>
        `
  })
}

// Function to show the add course modal
function showAddCourseModal() {
  document.getElementById("modalTitle").textContent = "Add Course"
  document.getElementById("courseId").value = ""
  document.getElementById("courseCode").value = ""
  document.getElementById("courseName").value = ""
  document.getElementById("department").value = ""
  document.getElementById("credits").value = ""
  new bootstrap.Modal(document.getElementById("courseModal")).show()
}

// Function to edit a course
function editCourse(courseId) {
  const course = courses.find((c) => c._id === courseId)
  if (course) {
    document.getElementById("modalTitle").textContent = "Edit Course"
    document.getElementById("courseId").value = course._id
    document.getElementById("courseCode").value = course.courseCode
    document.getElementById("courseName").value = course.courseName
    document.getElementById("department").value = course.department
    document.getElementById("credits").value = course.credits
    new bootstrap.Modal(document.getElementById("courseModal")).show()
  }
}

// Function to save a course (create or update)
async function saveCourse() {
  const courseId = document.getElementById("courseId").value
  const courseData = {
    courseCode: document.getElementById("courseCode").value,
    courseName: document.getElementById("courseName").value,
    department: document.getElementById("department").value,
    credits: Number.parseInt(document.getElementById("credits").value),
  }

  try {
    const url = courseId ? `${API_URL}/course/${courseId}` : `${API_URL}/course`
    const method = courseId ? "PUT" : "POST"
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      throw new Error("Failed to save course")
    }

    bootstrap.Modal.getInstance(document.getElementById("courseModal")).hide()
    fetchCourses()
  } catch (error) {
    console.error("Error saving course:", error)
    alert("Failed to save course. Please try again.")
  }
}

// Function to delete a course
async function deleteCourse(courseId) {
  if (confirm("Are you sure you want to delete this course?")) {
    try {
      const response = await fetch(`${API_URL}/course/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      fetchCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Failed to delete course. Please try again.")
    }
  }
}



// Function to fetch lecturers from the server
async function fetchLecturers() {
    try {
        const response = await fetch(`${API_URL}/lecturer`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        })
        if (!response.ok) {
        throw new Error("Failed to fetch lecturers")
        }
        lecturers = await response.json()
        displayLecturers()
    } catch (error) {
        console.error("Error fetching lecturers:", error)
        alert("Failed to load lecturers. Please try again.")
    }
}

    // Function to fetch courses from the server
    async function fetchCourses() {
        try {
            const response = await fetch(`${API_URL}/course`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            })
            if (!response.ok) {
            throw new Error("Failed to fetch courses")
            }
            courses = await response.json()
            displayCourses()
        } catch (error) {
            console.error("Error fetching courses:", error)
            alert("Failed to load courses. Please try again.")
        }
    }

    // Function to display lecturers in the table
    function displayLecturers() {
    const tableBody = document.getElementById("lecturerTableBody")
    tableBody.innerHTML = ""

    lecturers.forEach((lecturer) => {
        const row = tableBody.insertRow()
        row.innerHTML = `
                <td>${lecturer.fullName}</td>
                <td>${lecturer.department}</td>
                <td>${lecturer.course}</td>
                <td>${lecturer.email}</td>
                <td>${lecturer.contactNumber}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editLecturer('${lecturer._id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLecturer('${lecturer._id}')">Delete</button>
                </td>
            `
        })
    }

// Function to show the add lecturer modal
function showAddLecturerModal() {
document.getElementById("modalTitle").textContent = "Add Lecturer"
document.getElementById("lecturerId").value = ""
document.getElementById("lecturerFirstName").value = ""
document.getElementById("lecturerLastName").value = ""
document.getElementById("lecturerEmail").value = ""
document.getElementById("lecturerDateOfBirth").value = ""
document.getElementById("lecturerGender").value = ""
document.getElementById("lecturerContactNumber").value = ""
document.getElementById("lecturerAddress").value = ""
document.getElementById("lecturerEmergencyContactName").value = ""
document.getElementById("lecturerEmergencyContactPhone").value = ""
document.getElementById("lecturerDepartment").value = ""
document.getElementById("lecturerCourse").value = ""
document.getElementById("lecturerQualifications").value = ""
document.getElementById("lecturerPosition").value = ""
document.getElementById("lecturerOfficeHours").value = ""
new bootstrap.Modal(document.getElementById("lecturerModal")).show()
}


// Function to edit a lecturer
function editLecturer(lecturerId) {
    const lecturer = lecturers.find((l) => l._id === lecturerId)
    if (lecturer) {
        document.getElementById("lecturerModal-title").textContent = "Edit Lecturer"
        document.getElementById("lecturerId").value = lecturer._id
        document.getElementById("lecturerFirstName").value = lecturer.firstName
        document.getElementById("lecturerLastName").value = lecturer.lastName
        document.getElementById("lecturerEmail").value = lecturer.email
        document.getElementById("lecturerDateOfBirth").value = lecturer.dateOfBirth
        document.getElementById("lecturerGender").value = lecturer.gender
        document.getElementById("lecturerContactNumber").value = lecturer.contactNumber
        document.getElementById("lecturerAddress").value = lecturer.address
        document.getElementById("lecturerEmergencyContactName").value = lecturer.emergencyContactName
        document.getElementById("lecturerEmergencyContactPhone").value = lecturer.emergencyContactPhone
        document.getElementById("lecturerDepartment").value = lecturer.department
        document.getElementById("lecturerCourse").value = lecturer.course
        document.getElementById("lecturerQualifications").value = lecturer.qualifications
        document.getElementById("lecturerPosition").value = lecturer.position
        document.getElementById("lecturerOfficeHours").value = lecturer.officeHours
        new bootstrap.Modal(document.getElementById("lecturerModal")).show()
    }
}

// Function to save a lecturer (create or update)
function saveLecturer() {
    const lecturerId = document.getElementById("lecturerId").value
    const lecturerData = {
        firstName: document.getElementById("lecturerFirstName").value,
        lastName: document.getElementById("lecturerLastName").value,
        email: document.getElementById("lecturerEmail").value,
        dateOfBirth: document.getElementById("lecturerDateOfBirth").value,
        gender: document.getElementById("lecturerGender").value,
        contactNumber: document.getElementById("lecturerContactNumber").value,
        address: document.getElementById("lecturerAddress").value,
        emergencyContactName: document.getElementById("lecturerEmergencyContactName").value,
        emergencyContactPhone: document.getElementById("lecturerEmergencyContactPhone").value,
        department: document.getElementById("lecturerDepartment").value,
        course: document.getElementById("lecturerCourse").value,
        qualifications: document.getElementById("lecturerQualifications").value,
        position: document.getElementById("lecturerPosition").value,
        officeHours: document.getElementById("lecturerOfficeHours").value,
    }
    if (lecturerId) {
        updateLecturer(lecturerId, lecturerData)
    } else {
        createLecturer(lecturerData)
    }
}

// Function to create a new lecturer
function createLecturer(lecturerData) {
    fetch('/lecturers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecturerData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchLecturers()
            new bootstrap.Modal(document.getElementById("lecturerModal")).hide()
        } else {
            alert('Failed to create lecturer.')
        }
    })
}

// Function to update a lecturer
function updateLecturer(lecturerId, lecturerData) {
    fetch(`/lecturers/${lecturerId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecturerData),
    })
    .then(response => response.json())

    .then(data => {
        if (data.success) {
            fetchLecturers()
            new bootstrap.Modal(document.getElementById("lecturerModal")).hide()
        } else {
            alert('Failed to update lecturer.')
        }
    })
}

// Function to delete a lecturer
function deleteLecturer(lecturerId) {
    fetch(`/lecturers/${lecturerId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchLecturers()
        } else {
            alert('Failed to delete lecturer.')
        }
    })
}

// Initial fetch of lecturers when the page loads
document.addEventListener("DOMContentLoaded", fetchLecturers)

// Initial fetch of courses when the page loads
document.addEventListener("DOMContentLoaded", fetchCourses)

