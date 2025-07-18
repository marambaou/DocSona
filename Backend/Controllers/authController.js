const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'Patient',
      phone
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email, role: savedUser.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success response (without password)
    const userResponse = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      role: savedUser.role,
      phone: savedUser.phone,
      createdAt: savedUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success response (without password)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    // Always return success for security, but only send email if user exists
    if (user) {
      // Create Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      // Generate a placeholder reset link (in production, use a real token)
      const resetLink = `https://your-app.com/reset-password?email=${encodeURIComponent(email)}`;
      // Send email
      await transporter.sendMail({
        from: `"MernStackers Support" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `<p>Hello ${user.firstName || ''},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>If you did not request this, you can ignore this email.</p>`
      });
    }
    return res.status(200).json({
      success: true,
      message: 'If this email is registered, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword
}; 