const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword } = require('../Controllers/authController');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Forgot Password route
router.post('/forgot-password', forgotPassword);

module.exports = router;
