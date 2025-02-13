// Global variables
let lecturers = []
const API_URL = "http://localhost:5000/api"

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
  //Import bootstrap here.  This is a placeholder, the actual import will depend on your project setup.
  const bootstrap = window.bootstrap // Assuming bootstrap is available globally
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
    const bootstrap = window.bootstrap // Assuming bootstrap is available globally
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
async function createLecturer(lecturerData) {
  try {
    const response = await fetch(`${API_URL}/user/lecturer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(lecturerData),
    })
    const data = await response.json()
    if (response.ok) {
      fetchLecturers()
      const bootstrap = window.bootstrap // Assuming bootstrap is available globally
      new bootstrap.Modal(document.getElementById("lecturerModal")).hide()
    } else {
      alert("Failed to create lecturer: " + data.message)
    }
  } catch (error) {
    console.error("Error creating lecturer:", error)
    alert("Failed to create lecturer. Please try again.")
  }
}

// Function to update a lecturer
async function updateLecturer(lecturerId, lecturerData) {
  try {
    const response = await fetch(`${API_URL}/user/lecturer/${lecturerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(lecturerData),
    })
    const data = await response.json()
    if (response.ok) {
      fetchLecturers()
      const bootstrap = window.bootstrap // Assuming bootstrap is available globally
      new bootstrap.Modal(document.getElementById("lecturerModal")).hide()
    } else {
      alert("Failed to update lecturer: " + data.message)
    }
  } catch (error) {
    console.error("Error updating lecturer:", error)
    alert("Failed to update lecturer. Please try again.")
  }
}

// Function to delete a lecturer
async function deleteLecturer(lecturerId) {
  if (confirm("Are you sure you want to delete this lecturer?")) {
    try {
      const response = await fetch(`${API_URL}/user/lecturer/${lecturerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        fetchLecturers()
      } else {
        alert("Failed to delete lecturer: " + data.message)
      }
    } catch (error) {
      console.error("Error deleting lecturer:", error)
      alert("Failed to delete lecturer. Please try again.")
    }
  }
}

// Initial fetch of lecturers when the page loads
document.addEventListener("DOMContentLoaded", fetchLecturers)

