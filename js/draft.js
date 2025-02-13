
    //fromtend/js/admin.js
    //make any API calls to a backend service to fetch data for all the sections

    // Navbar toggler for mobile
    document.querySelector('.navbar-toggler').addEventListener('click', () => {
        document.querySelector('.navbar-collapse').classList.toggle('show');
    });

    // Navigation handling
    document.querySelector('.nav-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.content-section').forEach(section => section.classList.add('d-none'));
        document.querySelector(e.target.getAttribute('data-target')).classList.remove('d-none');

        // Auto-collapse navbar on mobile
        if (window.innerWidth < 992) {
            document.querySelector('.navbar-collapse').classList.remove('show');
        }
    });

    // Update Date and Time
    function updateDateTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        document.getElementById('current-date').textContent = date.toDateString();
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Logout
    document.querySelector('.logout').addEventListener('click', () => {
        // Make API call to logout
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => console.log(data))

        // Redirect to login page
        window.location.href = 'index.html';
    });

    // Function to update profile information
    function updateProfile() {
        // Make API call to update profile
        fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: document.getElementById('userId').value,
                fullName: document.getElementById('fullName').value,
                position: document.getElementById('position').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
            }),
        })
        .then(response => response.json())
        .then(data => console.log(data))
    }
    document.querySelector('.update-profile').addEventListener('click', updateProfile);

    // Function to update My Profile section
    function updateMyProfile() {
        // Make API call to update My Profile section
        fetch('/update-my-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => console.log(data))
    }
    updateMyProfile();
    
    // Function to show the Edit Profile Modal
    function showEditProfileModal() {
        document.getElementById('edit-profile-modal').style.display = 'block';
    }
    document.querySelector('.edit-profile').addEventListener('click', showEditProfileModal);

    // Function to save the updated profile information
    function saveUpdatedProfile() {
        // Make API call to save updated profile information
        fetch('/save-updated-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: document.getElementById('userId').value,
                    fullName: document.getElementById('fullName').value,
                    position: document.getElementById('position').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                }),
            })
            .then(response => response.json())
            .then(data => console.log(data))
        }
        document.querySelector('.save-updated-profile').addEventListener('click', saveUpdatedProfile);

        // Function to show the Add Course Modal
        function showAddCourseModal() {
            document.getElementById('add-course-modal').style.display = 'block';
        }


    //admin.js

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

    // Logout
    document.getElementById('logout').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Function to update profile information
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
    updateProfile();

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
            userPhone.innerHTML = `<i class="fas fa-phone"></i> ${user.contactNumber || 'N/A'}`; // Display the contact number
            }
        }
        updateMyProfile();

        // Function to show the Edit Profile Modal
        function showEditProfileModal() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('userId').value = user.userId;
                document.getElementById('fullName').value = user.firstName + ' ' + user.lastName;
                document.getElementById('position').value = user.position || '';
                document.getElementById('email').value = user.email;
                document.getElementById('phone').value = user.contactNumber || '';
                $('#editProfileModal').modal('show');
            }
        }

        // Function to save the updated profile information
        function saveUpdatedProfile() {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = document.getElementById('userId').value;
            const fullName = document.getElementById('fullName').value;
            const position = document.getElementById('position').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            if (user) {
                user.userId = userId;
                user.firstName = fullName.split(' ')[0];
                user.lastName = fullName.split(' ')[1];
                user.position = position;
                user.email = email;
                user.contactNumber = phone;
                localStorage.setItem('user', JSON.stringify(user));
                updateMyProfile();
                $('#editProfileModal').modal('hide');
            }
        }

        // Function to show the Add Course Modal
        function showAddCourseModal() {
            document.getElementById('courseId').value = '';
            document.getElementById('courseCode').value = '';
            document.getElementById('courseName').value = '';
            document.getElementById('department').value = '';
            document.getElementById('credits').value = '';
            document.getElementById('modalTitle').textContent = 'Add Course';
            $('#courseModal').modal('show');
        }

        // Function to save the course information
        function saveCourse() {
            const courseId = document.getElementById('courseId').value;
            const courseCode = document.getElementById('courseCode').value;
            const courseName = document.getElementById('courseName').value;
            const department = document.getElementById('department').value;
            const credits = document.getElementById('credits').value;
            if (courseCode && courseName && department && credits) {
                // Save the course information
                console.log('Course saved successfully');
                $('#courseModal').modal('hide');
            } else {
                alert('Please fill in all the fields');
            }
        }

        // Function to display courses in the table(We are assuming that the courses are fetched from the backend)
        function displayCourses() {
            const courses = JSON.parse(localStorage.getItem('courses'));
            if (courses) {
                const courseTable = document.getElementById('courseTable');
                courseTable.innerHTML = '';
                courses.forEach(course => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${course.courseCode}</td>
                        <td>${course.courseName}</td>
                        <td>${course.department}</td>
                        <td>${course.credits}</td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editCourse('${course._id}')">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
                        </td>
                    `;
                    courseTable.appendChild(tr);
                });
            }
        }
        displayCourses();

        // Function to edit a course
        function editCourse(courseId) {
            const courses = JSON.parse(localStorage.getItem('courses'));
            if (courses) {
                const course = courses.find(course => course._id === courseId);
                if (course) {
                    document.getElementById('courseId').value = course._id;
                    document.getElementById('courseCode').value = course.courseCode;
                    document.getElementById('courseName').value = course.courseName;
                    document.getElementById('department').value = course.department;
                    document.getElementById('credits').value = course.credits;
                    document.getElementById('modalTitle').textContent = 'Edit Course';
                    $('#courseModal').modal('show');
                }
            }
        }

    //backend/models/Course.js

    const mongoose = require("mongoose");

// Course Schema
const CourseSchema = new mongoose.Schema(
    {
        courseCode: { type: String, required: true, unique: true },
        courseName: { type: String, required: true },
        department: { type: String, required: true },
        credits: { type: Number, required: true },
    },
    { timestamps: true }
);

// Course Model
const Course = mongoose.model("Course", CourseSchema);

    //backend/routes/course.js

const express = require("express");
const { Course } = require("../models/Course");
const router = express.Router();
// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get a specific course
router.get("/:id", getCourse, (req, res) => {
    res.json(res.course);
});
// Create a new course
router.post("/", async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
        } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Update a course
router.put("/:id", getCourse, async (req, res) => {
    try {
        Object.keys(req.body).forEach(key => {
            res.course[key] = req.body[key];
        });
        await res.course.save();
        res.json(res.course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete a course
router.delete("/:id", getCourse, async (req, res) => {
    try {
        await res.course.remove();
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Middleware to get course by ID
function getCourse(req, res, next) {
    Course.findById(req.params.id)
    .then(course => {
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.course = course;
        next();
    })
    .catch(error => {
        res.status(500).json({ message: error.message });
    });
}
module.exports = router;

//backend/models/User.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// User Schema
const UserSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        role: { type: String, enum: ["Admin", "Lecturer", "Student"], required: true },
        position: { type: String, default: 'N/A' },
        profilePicture: { type: String, default: null },
        contactNumber: { type: String, default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true, discriminatorKey: "role" } // Discriminator key is mandatory
);

// Base User Model
const User = mongoose.model("User", UserSchema);

// Admin Schema
const AdminSchema = new Schema({
    department: { type: String, default: null },
    permissions: [{ type: String, default: [] }], // e.g., ['ManageUsers', 'EditCourses']
});

// Lecturer Schema
const LecturerSchema = new Schema({
    specialization: { type: String, required: true },
    assignedCourses: [{ type: Schema.Types.ObjectId, ref: "Course", default: [] }],
    officeHours: { type: String, default: null },
    bio: { type: String, default: null },
    qualifications: [{ type: String, default: [] }],
});

// Student Schema
const StudentSchema = new Schema({
    enrollmentNumber: { type: String, required: true, unique: true },
    coursesEnrolled: [
        {
            courseId: { type: Schema.Types.ObjectId, ref: "Course" },
            status: { type: String, enum: ["Active", "Completed", "Dropped"], default: "Active" },
            progress: { type: Number, default: 0 }, // Course completion percentage
        },
    ],
    dateOfBirth: { type: Date, required: true },
    address: {
        street: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        postalCode: { type: String, default: null },
    },
    emergencyContact: {
        name: { type: String, default: null },
        relationship: { type: String, default: null },
        contactNumber: { type: String, default: null },
    },
});

// Discriminator Models
const Admin = User.discriminator("Admin", AdminSchema);
const Lecturer = User.discriminator("Lecturer", LecturerSchema);
const Student = User.discriminator("Student", StudentSchema);

module.exports = { User, Admin, Lecturer, Student };

//backend/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");
const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.status(200).json({
            token,
            role: user.role, // Make sure this is sent in the response
            user: {
                userId: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profilePicture: user.profilePicture,
                contactNumber: user.contactNumber,
                isActive: user.isActive,
            },
        });
    } catch (err) {
        console.error("Server error during login:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

//backend/routes/user.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// Set up multer for profile picture upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-pictures');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const upload = multer({ storage });

// GET user profile (returns profile details)
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming you're using JWT for authentication
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST user profile (update details)
router.post('/profile', upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming you're using JWT for authentication
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Update user details
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.position = req.body.position || user.position;
        user.email = req.body.email || user.email;
        user.contactNumber = req.body.contactNumber || user.contactNumber;

        // If a new profile picture is uploaded, update the profile picture URL
        if (req.file) {
            user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        }

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//update user profile from edit modal
router.put('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.position = req.body.position || user.position;
        user.email = req.body.email || user.email;
        user.contactNumber = req.body.contactNumber || user.contactNumber;

        await user.save();
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;