document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "index.html"
      return
    }
  
    // Fetch and display student information
    fetchStudentInfo()
  
    // Set up navigation
    setupNavigation()
  
    // Logout functionality
    document.getElementById("logout").addEventListener("click", logout)
  })
  
  async function fetchStudentInfo() {
    try {
      const response = await fetch("http://localhost:5000/api/student/info", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        updateDashboard(data)
        updateProfile(data)
        updateCourses(data.courses)
        updateGrades(data.grades)
        updateSchedule(data.schedule)
      } else {
        console.error("Failed to fetch student info:", data.message)
      }
    } catch (error) {
      console.error("Error fetching student info:", error)
    }
  }
  
  function updateDashboard(data) {
    document.getElementById("student-name").textContent = `${data.firstName} ${data.lastName}`
    document.getElementById("enrolled-courses").textContent = data.courses.length
    document.getElementById("gpa").textContent = data.gpa.toFixed(2)
    document.getElementById("upcoming-assignments").textContent = data.upcomingAssignments
  }
  
  function updateProfile(data) {
    const profileSection = document.getElementById("my-profile")
    profileSection.innerHTML = `
          <h2>My Profile</h2>
          <div class="card">
              <div class="card-body">
                  <h5 class="card-title">${data.firstName} ${data.lastName}</h5>
                  <p class="card-text">Student ID: ${data.studentId}</p>
                  <p class="card-text">Email: ${data.email}</p>
                  <p class="card-text">Department: ${data.department}</p>
                  <p class="card-text">Major: ${data.major}</p>
                  <p class="card-text">Academic Year: ${data.academicYear}</p>
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
                      <p class="card-text">Instructor: ${course.instructor}</p>
                  </div>
              </div>
          `
      coursesList.appendChild(courseCard)
    })
  }
  
  function updateGrades(grades) {
    const gradesTableBody = document.getElementById("grades-table-body")
    gradesTableBody.innerHTML = ""
    grades.forEach((grade) => {
      const row = document.createElement("tr")
      row.innerHTML = `
              <td>${grade.courseName}</td>
              <td>${grade.grade}</td>
          `
      gradesTableBody.appendChild(row)
    })
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
  
  