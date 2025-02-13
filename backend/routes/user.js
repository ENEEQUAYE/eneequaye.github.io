const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Assuming you have a User model
const { authenticate } = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');
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

// Middleware to authenticate token and set req.user
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token format
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// GET user profile (returns profile details)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Use the authenticated user's ID
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user); // Return user profile data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST user profile (update details)
router.post('/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Use the authenticated user's ID
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

// PUT user profile (update profile based on ID)
router.put('/profile/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Use the ID passed in the URL
        if (!user) return res.status(404).json({ message: 'User not found' });

        // If the user is not an admin, they can only update their own profile
        if (req.user.id !== user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this profile' });
        }

        // Update user details
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

// POST route for adding a new lecturer
router.post("/lecturer", authenticate, async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContact,
        department,
        qualifications,
        position,
        officeHours,
        courses,
        specialization,
        bio,
      } = req.body
  
      // Check if user already exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "User already exists" })
      }
  
      // Generate a random password
      const password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
  
      // Create new lecturer
      user = new Lecturer({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "Lecturer",
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContact,
        department,
        qualifications,
        position,
        officeHours,
        courses,
        lecturerId: generateLecturerId(),
        specialization,
        bio,
      })
  
      await user.save()
  
      // TODO: Send email to lecturer with their credentials
  
      res.status(201).json({ message: "Lecturer added successfully" })
    } catch (error) {
      console.error("Error adding lecturer:", error)
      res.status(500).json({ message: "Server error" })
    }
  })
  
  // POST route for adding a new student
  router.post("/student", authenticate, async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContact,
        department,
        enrollmentDate,
        academicYear,
      } = req.body
  
      // Check if user already exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "User already exists" })
      }
  
      // Generate a random password
      const password = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
  
      // Create new student
      user = new Student({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "Student",
        dateOfBirth,
        gender,
        contactNumber,
        address,
        emergencyContact,
        department,
        enrollmentDate,
        academicYear,
        studentId: generateStudentId(),
      })
  
      await user.save()
  
      // TODO: Send email to student with their credentials
  
      res.status(201).json({ message: "Student added successfully" })
    } catch (error) {
      console.error("Error adding student:", error)
      res.status(500).json({ message: "Server error" })
    }
  })
  
  // Helper function to generate lecturer ID
  function generateLecturerId() {
    return "L" + Math.random().toString().slice(2, 8)
  }
  
  // Helper function to generate student ID
  function generateStudentId() {
    return "S" + Math.random().toString().slice(2, 8)
  }
  
// Get all users
router.get("/", authenticate, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID
// router.get('/:id', async (req, res) => {
//   try {
//       const user = await User.findById(req.params.id);
//       if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//       }
//       res.json(user);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//   }
// });

module.exports = router;
