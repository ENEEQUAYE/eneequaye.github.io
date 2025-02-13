// frontend/js/admin-dashboard.js

// Function to fetch admin profile
document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // Redirect to login
        return;
    }

    function setProfile() {
        if (user) {
            document.querySelector(".profile img").src = user.profilePicture || "img/user.jpg";
            document.querySelector(".profile span").textContent = user.firstName || "Admin";
        }
    }

    // async function updateDashboard() {
    //     try {
    //         const response = await fetch("http://localhost:5000/api/admin/dashboard", {
    //             method: "GET",
    //             headers: { "Authorization": `Bearer ${token}` }
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             document.getElementById("total-students").textContent = data.totalStudents || 0;
    //             document.getElementById("total-lecturers").textContent = data.totalLecturers || 0;
    //             document.getElementById("total-courses").textContent = data.totalCourses || 0;
    //         } else {
    //             alert("Failed to load dashboard data.");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching dashboard data:", error);
    //         alert("An error occurred while updating the dashboard.");
    //     }
    // }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    }

    document.getElementById("logout").addEventListener("click", logout);

    setProfile();
    // updateDashboard();

    // Navbar toggler for mobile
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show');
    });

    // Navigation handling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            document.querySelectorAll('.content-section').forEach(section => section.classList.add('d-none'));
            document.querySelector(link.getAttribute('data-target')).classList.remove('d-none');

            // Auto-collapse navbar on mobile
            if (window.innerWidth < 992) {
                document.querySelector('.navbar-collapse').classList.remove('show');
            }
        });
    });

    // Update Date and Time
    function updateTime() {
        let date = new Date();
        document.getElementById('current-date').textContent = date.toDateString();
        document.getElementById('current-time').textContent = date.toLocaleTimeString();
    }
    updateTime();
    setInterval(updateTime, 1000);
});

// Function to Update My Profile section
function updateMyProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Update the profile picture if available
        const profilePic = document.getElementById('profile-pic');
        if (user.profilePicture) {
            profilePic.src = user.profilePicture; // If the user has a profile picture, update the image
        }
        // Update the fullName with the user's first name and last name
        const userFullName = document.getElementById('userFullName');
        userFullName.textContent = user.firstName + ' ' + user.lastName; // Display the full name

        // Update the position with the user's position
        const userPosition = document.getElementById('userPosition');
        userPosition.innerHTML = `<i class="fas fa-user-tag"></i> ${user.position || 'N/A'}`; // Display the position

        // Update the email with the user's email
        const userEmail = document.getElementById('userEmail');
        userEmail.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`; // Display the email

        // Update the phone with the user's contact number
        const userPhone = document.getElementById('userPhone');
        userPhone= // Display the contact number
    }
}
updateMyProfile();

// Function to show the Edit Profile Modal
function showEditProfileModal() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Populate the modal form with current user data
        document.getElementById('userId').value = user.userId;
        document.getElementById('fullName').value = user.firstName + ' ' + user.lastName;
        document.getElementById('position').value = user.position || '';
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.contactNumber || '';
        
        // Show the modal
        $('#editProfileModal').modal('show');
    }
}

// Function to handle updating user profile
function updateProfile() {
    const userId = document.getElementById('userId').value;
    const firstName = document.getElementById('fullName').value.split(' ')[0];
    const lastName = document.getElementById('fullName').value.split(' ')[1];
    const position = document.getElementById('position').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    const profileData = { firstName, lastName, position, email, phone };

    fetch(`http://localhost:5000/api/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profileData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the profile on the page
            updateMyProfile();
            // Close the modal
            $('#editProfileModal').modal('hide');
        } else {
            alert('Failed to update profile.');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating your profile.');
    });
}


// Global variables
let courses = []
let lecturers = []
let students = []
let users = [];
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

// Global variables



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

///////////////////////// Manage Users Section /////////////////////////
// function fetchUsers() {
//   fetch('http://localhost:5000/api/users') // Adjust URL if necessary
//       .then(response => response.json())
//       .then(users => {
//           const tableBody = document.getElementById('userTableBody');
//           tableBody.innerHTML = ''; // Clear existing rows

//           users.forEach((user, index) => {
//               const row = document.createElement('tr');
//               row.innerHTML = `
//                   <td>${index + 1}</td>
//                   <td>${user.first_name} ${user.last_name}</td>
//                   <td>${user.email}</td>
//                   <td>${user.role}</td>
//                   <td>${user.phone || 'N/A'}</td>
//                   <td>
//                       <button class="btn btn-primary btn-sm" onclick="showEditModal('${user._id}')">Edit</button>
//                       <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
//                   </td>
//               `;
//               tableBody.appendChild(row);
//           });
//       })
//       .catch(error => console.error('Error fetching users:', error));
// }

// Global variables


// Function to fetch users from the server
async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        users = await response.json();
        displayUsers();
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users. Please try again.");
    }
}

// Function to display users in the table
function displayUsers() {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
    });
}

// Function to show the add user modal
function showAddUserModal() {
    document.getElementById("userModalLabel").textContent = "Add User";
    document.getElementById("userId").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("role").value = "";
    new bootstrap.Modal(document.getElementById("userModal")).show();
}

// Function to edit a user
function editUser(userId) {
    const user = users.find((u) => u._id === userId);
    if (user) {
        document.getElementById("userModalLabel").textContent = "Edit User";
        document.getElementById("userId").value = user._id;
        document.getElementById("firstName").value = user.firstName;
        document.getElementById("lastName").value = user.lastName;
        document.getElementById("email").value = user.email;
        document.getElementById("role").value = user.role;
        new bootstrap.Modal(document.getElementById("userModal")).show();
    }
}

// Function to save a user (create or update)
async function saveUser() {
    const userId = document.getElementById("userId").value;
    const userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
    };

    try {
        const url = userId ? `${API_URL}/user/${userId}` : `${API_URL}/user`;
        const method = userId ? "PUT" : "POST";
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Failed to save user");
        }

        bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
        fetchUsers();
    } catch (error) {
        console.error("Error saving user:", error);
        alert("Failed to save user. Please try again.");
    }
}

// Function to delete a user
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete user");
            }

            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user. Please try again.");
        }
    }
}

// Function to handle user search
function searchUsers() {
    const searchTerm = document.getElementById("search-users").value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    displayFilteredUsers(filteredUsers);
}

// Function to display filtered users
function displayFilteredUsers(filteredUsers) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    filteredUsers.forEach((user, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
    });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    document.getElementById("search-users").addEventListener("input", searchUsers);
});

