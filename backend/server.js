//backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require('./routes/user');
const courseRoutes = require("./routes/course");
const profileRoutes = require("./routes/profile");
const adminRoutes = require("./routes/admin")
const studentRoutes = require("./routes/student")
const lecturerRoutes = require("./routes/lecturer")



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);



// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
