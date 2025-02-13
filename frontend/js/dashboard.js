/////////////////////////////////////////////////////////////////////Navbar toggler for mobile///////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////////// Update Date and Time///////////////////////////////////////////////////////////////////////
function updateTime() {
    let date = new Date();
    document.getElementById('current-date').textContent = date.toDateString();
    document.getElementById('current-time').textContent = date.toLocaleTimeString();
}
updateTime();
setInterval(updateTime, 1000);

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

//////////////////////////////////////////////////// Function to update profile information////////////////////////////////////////////////////////////
function updateProfile() {
const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    // Update the profile picture if available
    const profilePic = document.getElementById('profile-pic');
    if (user.profilePicture) {
        profilePic.src = user.profilePicture; // If the user has a profile picture, update the image
    }

    // Update the username with the user's first name
    const profileName = document.getElementById('profile-name');
    profileName.textContent = user.firstName; // Display the first name
}
}

// Call the function to update the profile
updateProfile();



////////////////////////////////////////////////////////////////Manage Courses/////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
});

function fetchCourses() {
    fetch("/api/courses")
        .then(response => response.json())
        .then(data => {
            let rows = "";
            data.forEach(course => {
                rows += `
                    <tr>
                        <td>${course.courseCode}</td>
                        <td>${course.courseName}</td>
                        <td>${course.department}</td>
                        <td>${course.credits}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editCourse('${course._id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCourse('${course._id}')">Delete</button>
                        </td>
                    </tr>
                `;
            });
            document.getElementById("courseTableBody").innerHTML = rows;
        });
}

function showAddCourseModal() {
    document.getElementById("modalTitle").innerText = "Add Course";
    document.getElementById("courseId").value = "";
    document.getElementById("courseCode").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("department").value = "";
    document.getElementById("credits").value = "";
    $("#courseModal").modal("show");
}

function saveCourse() {
    const id = document.getElementById("courseId").value;
    const course = {
        courseCode: document.getElementById("courseCode").value,
        courseName: document.getElementById("courseName").value,
        department: document.getElementById("department").value,
        credits: document.getElementById("credits").value,
    };

    fetch(`/api/courses/${id ? "update/" + id : "add"}`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
    }).then(() => {
        $("#courseModal").modal("hide");
        fetchCourses();
    });
}

function deleteCourse(id) {
    fetch(`/api/courses/delete/${id}`, { method: "DELETE" }).then(fetchCourses);
}

function editCourse(courseId) {
    fetch(`/api/courses/${courseId}`)
        .then(response => response.json())
        .then(course => {
            document.getElementById("courseId").value = course._id;
            document.getElementById("courseCode").value = course.courseCode;
            document.getElementById("courseName").value = course.courseName;
            document.getElementById("department").value = course.department;
            document.getElementById("credits").value = course.credits;
            document.getElementById("modalTitle").textContent = 'Edit Course';
            $('#courseModal').modal('show');
        });
}

////////////////////////////////////////////////////////////////My Profile/////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    fetchProfile();
});

function fetchProfile() {
    fetch("/api/profile")
        .then(response => response.json())
        .then(data => {
            document.getElementById("profileImage").src = data.profileImage || "img/user.jpg";
            document.getElementById("userFullName").innerText = data.fullName;
            document.getElementById("userPosition").innerText = data.position;
            document.getElementById("userEmail").innerText = data.email;
            document.getElementById("userPhone").innerText = data.phone;
        });
}

function showEditProfileModal() {
    fetch("/api/profile")
        .then(response => response.json())
        .then(data => {
            document.getElementById("userId").value = data._id;
            document.getElementById("fullName").value = data.fullName;
            document.getElementById("position").value = data.position;
            document.getElementById("email").value = data.email;
            document.getElementById("phone").value = data.phone;
            $("#editProfileModal").modal("show");
        });
}

function updateProfile() {
    const profile = {
        fullName: document.getElementById("fullName").value,
        position: document.getElementById("position").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
    };

    fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
    }).then(() => {
        $("#editProfileModal").modal("hide");
        fetchProfile();
    });
}