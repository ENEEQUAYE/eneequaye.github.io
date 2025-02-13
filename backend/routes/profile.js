const express = require("express");
const { User } = require("../models/User");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

// Fetch user profile
router.get("/", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update user profile
router.put("/update", authenticate, async (req, res) => {
    try {
        const { firstName, lastName, position, email, contactNumber } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { firstName, lastName, position, email, contactNumber },
            { new: true }
        );
        res.status(200).json({ message: "Profile updated", updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;