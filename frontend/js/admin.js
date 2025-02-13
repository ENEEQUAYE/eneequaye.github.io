document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
  
    if (!token) {
      window.location.href = "index.html"
      return
    }
  
    function setProfile() {
      if (user) {
        document.querySelector(".profile img").src = user.profilePicture || "img/user.jpg"
        document.querySelector(".profile span").textContent = user.firstName || "Admin"
      }
    }
  
    async function updateDashboard() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/dashboard", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        })
  
        const data = await response.json()
        if (response.ok) {
          document.getElementById("total-students").textContent = data.totalStudents || 0
          document.getElementById("total-lecturers").textContent = data.totalLecturers || 0
          document.getElementById("total-courses").textContent = data.totalCourses || 0
        } else {
          alert("Failed to load dashboard data.")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        alert("An error occurred while updating the dashboard.")
      }
    }
  
    function logout() {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "index.html"
    }
  
    document.getElementById("logout").addEventListener("click", logout)
  
    setProfile()
    updateDashboard()
  
    // Navbar toggler for mobile
    document.querySelector(".navbar-toggler").addEventListener("click", () => {
      document.querySelector(".navbar-collapse").classList.toggle("show")
    })
  
    // Navigation handling
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault()
        document.querySelectorAll(".content-section").forEach((section) => section.classList.add("d-none"))
        document.querySelector(link.getAttribute("data-target")).classList.remove("d-none")
  
        // Auto-collapse navbar on mobile
        if (window.innerWidth < 992) {
          document.querySelector(".navbar-collapse").classList.remove("show")
        }
      })
    })
  
    // Update Date and Time
    function updateTime() {
      const date = new Date()
      document.getElementById("current-date").textContent = date.toDateString()
      document.getElementById("current-time").textContent = date.toLocaleTimeString()
    }
    updateTime()
    setInterval(updateTime, 1000)
  })
  
  // Function to Update My Profile section
  function updateMyProfile() {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      const profilePic = document.getElementById("profileImage")
      if (user.profilePicture) {
        profilePic.src = user.profilePicture
      }
      document.getElementById("userFullName").textContent = `${user.firstName} ${user.lastName}`
      document.getElementById("userPosition").innerHTML = `<i class="fas fa-user-tag"></i> ${user.position || "N/A"}`
      document.getElementById("userEmail").innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`
      document.getElementById("userPhone").innerHTML = `<i class="fas fa-phone"></i> ${user.contactNumber || "N/A"}`
    }
  }
  updateMyProfile()
  
  // Function to show the Edit Profile Modal
  function showEditProfileModal() {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      document.getElementById("userId").value = user.userId
      document.getElementById("fullName").value = `${user.firstName} ${user.lastName}`
      document.getElementById("position").value = user.position || ""
      document.getElementById("email").value = user.email
      document.getElementById("phone").value = user.contactNumber || ""
  
      new bootstrap.Modal(document.getElementById("editProfileModal")).show()
    }
  }
  
  // Function to handle updating user profile
  async function updateProfile() {
    const userId = document.getElementById("userId").value
    const [firstName, ...lastNameParts] = document.getElementById("fullName").value.split(" ")
    const lastName = lastNameParts.join(" ")
    const position = document.getElementById("position").value
    const email = document.getElementById("email").value
    const contactNumber = document.getElementById("phone").value
  
    const profileData = { firstName, lastName, position, email, contactNumber }
  
    try {
      const response = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(profileData),
      })
  
      const data = await response.json()
      if (response.ok) {
        // Update local storage
        const user = JSON.parse(localStorage.getItem("user"))
        Object.assign(user, profileData)
        localStorage.setItem("user", JSON.stringify(user))
  
        // Update the profile on the page
        updateMyProfile()
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById("editProfileModal")).hide()
        alert("Profile updated successfully")
      } else {
        throw new Error(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("An error occurred while updating your profile.")
    }
  }
  
  // Function to handle profile picture upload
  async function uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append("profilePicture", file)
  
    try {
      const response = await fetch("http://localhost:5000/api/user/profile/upload-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })
  
      const data = await response.json()
  
      if (response.ok) {
        // Update the profile picture in the UI
        document.getElementById("profileImage").src = data.profilePicture
        document.querySelector(".profile img").src = data.profilePicture
  
        // Update the user object in localStorage
        const user = JSON.parse(localStorage.getItem("user"))
        user.profilePicture = data.profilePicture
        localStorage.setItem("user", JSON.stringify(user))
  
        alert("Profile picture updated successfully!")
      } else {
        throw new Error(data.message || "Failed to upload profile picture")
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      alert("Failed to upload profile picture. Please try again.")
    }
  }
  
  // Event listener for profile picture upload
  document.getElementById("upload-pic").addEventListener("change", (event) => {
    const file = event.target.files[0]
    if (file) {
      uploadProfilePicture(file)
    }
  })
  
  // Function to add a student
  async function addStudent(event) {
    event.preventDefault()
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
      major: document.getElementById("studentMajor").value,
      enrollmentDate: document.getElementById("studentEnrollmentDate").value,
      academicYear: document.getElementById("studentAcademicYear").value,
      role: "Student",
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentData),
      })
  
      if (response.ok) {
        alert("Student added successfully")
        document.getElementById("addStudentForm").reset()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error adding student:", error)
      alert("An error occurred while adding the student")
    }
  }
  
  // Function to add a lecturer
  async function addLecturer(event) {
    event.preventDefault()
    const lecturerData = {
      firstName: document.getElementById("lecturerFirstName").value,
      lastName: document.getElementById("lecturerLastName").value,
      email: document.getElementById("lecturerEmail").value,
      dateOfBirth: document.getElementById("lecturerDateOfBirth").value,
      gender: document.getElementById("lecturerGender").value,
      contactNumber: document.getElementById("lecturerContactNumber").value,
      address: document.getElementById("lecturerAddress").value,
      emergencyContact: {
        name: document.getElementById("lecturerEmergencyContactName").value,
        phone: document.getElementById("lecturerEmergencyContactPhone").value,
      },
      department: document.getElementById("lecturerDepartment").value,
      position: document.getElementById("lecturerPosition").value,
      qualifications: document
        .getElementById("lecturerQualifications")
        .value.split(",")
        .map((q) => q.trim()),
      officeHours: document.getElementById("lecturerOfficeHours").value,
      role: "Lecturer",
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(lecturerData),
      })
  
      if (response.ok) {
        alert("Lecturer added successfully")
        document.getElementById("addLecturerForm").reset()
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.message}`)
      }
    } catch (error) {
      console.error("Error adding lecturer:", error)
      alert("An error occurred while adding the lecturer")
    }
  }
  
  // Event listeners for form submissions
  document.getElementById("addStudentForm").addEventListener("submit", addStudent)
  document.getElementById("addLecturerForm").addEventListener("submit", addLecturer)
  
  