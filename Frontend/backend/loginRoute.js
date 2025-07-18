import express from 'express';
import bcrypt from 'bcrypt';
import User from './models.js';
import jwt from "jsonwebtoken";
import { verifyToken, requireRole } from "./middleware.js";;

const loginRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a user (for testing)

/*loginRouter.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});*/

 // login route

loginRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


//  TEST ROUTE - any logged-in user
loginRouter.get("/dashboard-data", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.role}, you are authorized!` });
});

// Doctor-only route
loginRouter.get("/doctor-data",verifyToken,  requireRole("doctor"), (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
});

//  Patient-only route
loginRouter.get("/patient-data", verifyToken, requireRole("patient"), (req, res) => {
  res.json({ message: `Welcome ${req.user.role}` });
});

export default loginRouter;