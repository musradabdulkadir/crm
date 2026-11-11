const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function generateToken(id) {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not configured correctly on the server.");
  }

  return jwt.sign({ id: id.toString() }, secret, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
}

exports.registerUser = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      console.error("Registration blocked: JWT_SECRET is missing or too short.");
      return res.status(500).json({ message: "Server authentication is not configured. Please contact the administrator." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists. Please sign in." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: publicUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists. Please sign in." });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration could not be completed. Check the server logs." });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      token: generateToken(user._id),
      user: publicUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login could not be completed. Check the server logs." });
  }
};

exports.getUserProfile = async (req, res) => {
  return res.status(200).json({ user: publicUser(req.user) });
};
