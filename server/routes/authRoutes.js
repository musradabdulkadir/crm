
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile
} = require("../controllers/authController");

const protect = require("../middleware/Auth");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get logged-in user
router.get("/me", protect, getUserProfile);

module.exports = router;
