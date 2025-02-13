// Global variables
let students = []
const API_URL = "http://localhost:5000/api"

// Function to fetch students from the server
async function fetchStudents() {
  try {
    const response = await fetch(`${API_URL}/user/students`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    if (!response.ok) {
      throw new Error("Failed to fetch students")
    }
    students = await response.json()
    displayStudents()
  } catch (error) {
    console.error("Error fetching students:", error)
    alert("Failed to load students. Please try again.")
  }
}

// Function to display students in the table
function displayStudents() {
  const tableBody = document.getElementById("studentTableBody")
  tableBody.innerHTML = ""

  students.forEach((student, index) => {
    const row = tableBody.insertRow()
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.department}</td>
            <td>${student.academicYear}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editStudent('${student._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
            </td>
        `
  })
}

// Function to show the add student modal
function showAddStudentModal() {
  document.getElementById("add-edit-student-modal-title").textContent = "Add Student"
  document.getElementById("studentId").value = ""
  document.getElementById("studentFirstName").value = ""
  document.getElementById("studentLastName").value = ""
  document.getElementById("studentEmail").value = ""
  document.getElementById("studentDateOfBirth").value = ""
  document.getElementById("studentGender").value = ""
  document.getElementById("studentContactNumber").value = ""
  document.getElementById("studentAddress").value = ""
  document.getElementById("studentEmergencyContactName").value = ""
  document.getElementById("studentEmergencyContactPhone").value = ""
  document.getElementById("studentDepartment").value = ""
  document.getElementById("studentEnrollmentDate").value = ""
  document.getElementById("studentAcademicYear").value = ""
  const bootstrap = window.bootstrap
  new bootstrap.Modal(document.getElementById("add-edit-student-modal")).show()
}

// Function to edit a student
function editStudent(studentId) {
  const student = students.find((s) => s._id === studentId)
  if (student) {
    document.getElementById("add-edit-student-modal-title").textContent = "Edit Student"
    document.getElementById("studentId").value = student._id
    document.getElementById("studentFirstName").value = student.firstName
    document.getElementById("studentLastName").value = student.lastName
    document.getElementById("studentEmail").value = student.email
    document.getElementById("studentDateOfBirth").value = student.dateOfBirth.split("T")[0]
    document.getElementById("studentGender").value = student.gender
    document.getElementById("studentContactNumber").value = student.contactNumber
    document.getElementById("studentAddress").value = student.address
    document.getElementById("studentEmergencyContactName").value = student.emergencyContact.name
    document.getElementById("studentEmergencyContactPhone").value = student.emergencyContact.phone
    document.getElementById("studentDepartment").value = student.department
    document.getElementById("studentEnrollmentDate").value = student.enrollmentDate.split("T")[0]
    document.getElementById("studentAcademicYear").value = student.academicYear
    const bootstrap = window.bootstrap
    new bootstrap.Modal(document.getElementById("add-edit-student-modal")).show()
  }
}

// Function to save a student (create or update)
async function saveStudent() {
  const studentId = document.getElementById("studentId").value
  const studentData = {
    firstName: document.getElementById("studentFirstName").value,
    lastName: document.getElementById("studentLastName").value,
    email: document.getElementById("studentEmail").value,
    dateOfBirth: document.getElementById("studentDateOfBirth").value,
    gender: document.getElementById("studentGender").value,
    contactNumber: document.getElementById("studentContactNumber").value,
    address: document.getElementById("studentAddress").value,
    emergencyContact: {
      name: document.getElementById("studentEmergencyContactName").value,
      phone: document.getElementById("studentEmergencyContactPhone").value,
    },
    department: document.getElementById("studentDepartment").value,
    enrollmentDate: document.getElementById("studentEnrollmentDate").value,
    academicYear: document.getElementById("studentAcademicYear").value,
  }

  try {
    const url = studentId ? `${API_URL}/user/student/${studentId}` : `${API_URL}/user/student`
    const method = studentId ? "PUT" : "POST"
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(studentData),
    })

    if (!response.ok) {
      throw new Error("Failed to save student")
    }

    const bootstrap = window.bootstrap
    bootstrap.Modal.getInstance(document.getElementById("add-edit-student-modal")).hide()
    fetchStudents()
  } catch (error) {
    console.error("Error saving student:", error)
    alert("Failed to save student. Please try again.")
  }
}

// Function to delete a student
async function deleteStudent(studentId) {
  if (confirm("Are you sure you want to delete this student?")) {
    try {
      const response = await fetch(`${API_URL}/user/student/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete student")
      }

      fetchStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      alert("Failed to delete student. Please try again.")
    }
  }
}

// Initial fetch of students when the page loads
document.addEventListener("DOMContentLoaded", fetchStudents)

// Event listener for the save student button
document.getElementById("saveStudentBtn").addEventListener("click", saveStudent)

