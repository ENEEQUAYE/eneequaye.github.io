document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "index.html"
      return
    }
  
    // Fetch and display lecturer information
    fetchLecturerInfo()
  
    // Set up navigation
    setupNavigation()
  
    // Logout functionality
    document.getElementById("logout").addEventListener("click", logout)
  })
  
  async function fetchLecturerInfo() {
    try {
      const response = await fetch("http://localhost:5000/api/lecturer/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        updateDashboard(data)
        updateProfile(data)
        updateCourses(data.courses)
        updateGradesManagement(data.courses)
        updateSchedule(data.schedule)
      } else {
        console.error("Failed to fetch lecturer info:", data.message)
      }
    } catch (error) {
      console.error("Error fetching lecturer info:", error)
    }
  }
  
  function updateDashboard(data) {
    document.getElementById("lecturer-name").textContent = `${data.firstName} ${data.lastName}`
    document.getElementById("courses-teaching").textContent = data.courses.length
    document.getElementById("total-students").textContent = data.totalStudents
    document.getElementById("upcoming-classes").textContent = data.upcomingClasses
  }
  
  function updateProfile(data) {
    const profileSection = document.getElementById("my-profile")
    profileSection.innerHTML = `
          <h2>My Profile</h2>
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">${data.firstName} ${data.lastName}</h5>
                  <p class="card-text">Lecturer ID: ${data.lecturerId}</p>
                  <p class="card-text">Email: ${data.email}</p>
                  <p class="card-text">Department: ${data.department}</p>
                  <p class="card-text">Position: ${data.position}</p>
                  <p class="card-text">Office Hours: ${data.officeHours}</p>
              </div>
          </div>
      `
  }
  
  function updateCourses(courses) {
    const coursesList = document.getElementById("courses-list")
    coursesList.innerHTML = ""
    courses.forEach((course) => {
      const courseCard = document.createElement("div")
      courseCard.className = "col-md-4 mb-3"
      courseCard.innerHTML = `
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title">${course.courseName}</h5>
                      <p class="card-text">Code: ${course.courseCode}</p>
                      <p class="card-text">Students: ${course.studentsEnrolled}</p>
                  </div>
              </div>
          `
      coursesList.appendChild(courseCard)
    })
  }
  
  function updateGradesManagement(courses) {
    const courseSelect = document.getElementById("course-select")
    courseSelect.innerHTML = '<option value="">Select a course</option>'
    courses.forEach((course) => {
      const option = document.createElement("option")
      option.value = course.courseId
      option.textContent = course.courseName
      courseSelect.appendChild(option)
    })
  
    courseSelect.addEventListener("change", function () {
      if (this.value) {
        fetchGradesForCourse(this.value)
      } else {
        document.getElementById("grades-table-body").innerHTML = ""
      }
    })
  }
  
  async function fetchGradesForCourse(courseId) {
    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/course/${courseId}/grades`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        displayGrades(data)
      } else {
        console.error("Failed to fetch grades:", data.message)
      }
    } catch (error) {
      console.error("Error fetching grades:", error)
    }
  }
  
  function displayGrades(grades) {
    const gradesTableBody = document.getElementById("grades-table-body")
    gradesTableBody.innerHTML = ""
    grades.forEach((grade) => {
      const row = document.createElement("tr")
      row.innerHTML = `
              <td>${grade.studentName}</td>
              <td>${grade.grade}</td>
              <td>
                  <button class="btn btn-sm btn-primary" onclick="editGrade('${grade.studentId}', '${grade.grade}')">Edit</button>
              </td>
          `
      gradesTableBody.appendChild(row)
    })
  }
  
  function editGrade(studentId, currentGrade) {
    const newGrade = prompt(`Enter new grade for student ${studentId}:`, currentGrade)
    if (newGrade !== null) {
      updateGrade(studentId, newGrade)
    }
  }
  
  async function updateGrade(studentId, newGrade) {
    const courseId = document.getElementById("course-select").value
    try {
      const response = await fetch(`http://localhost:5000/api/lecturer/course/${courseId}/grade/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ grade: newGrade }),
      })
      const data = await response.json()
      if (response.ok) {
        alert("Grade updated successfully")
        fetchGradesForCourse(courseId)
      } else {
        console.error("Failed to update grade:", data.message)
        alert("Failed to update grade")
      }
    } catch (error) {
      console.error("Error updating grade:", error)
      alert("Error updating grade")
    }
  }
  
  function updateSchedule(schedule) {
    // Implement schedule display logic here
    // This could involve using a calendar library or creating a custom schedule view
  }
  
  function setupNavigation() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault()
        document.querySelectorAll(".content-section").forEach((section) => section.classList.add("d-none"))
        document.querySelector(this.getAttribute("data-target")).classList.remove("d-none")
      })
    })
  }
  
  function logout() {
    localStorage.removeItem("token")
    window.location.href = "index.html"
  }
  
  