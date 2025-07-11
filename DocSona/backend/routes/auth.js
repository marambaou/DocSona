import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import Patient from '../models/Patient.js';

const router = express.Router();

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new patient
// @access  Public
router.post('/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('dateOfBirth').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Please provide a valid gender'),
  body('address.street').notEmpty().withMessage('Street address is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.zipCode').notEmpty().withMessage('ZIP code is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
  body('emergencyContact.phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid emergency contact phone'),
  body('emergencyContact.email').isEmail().normalizeEmail().withMessage('Please provide a valid emergency contact email'),
  validateRequest
], async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalHistory
    } = req.body;

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ error: 'Patient with this email already exists' });
    }

    // Create new patient
    const patient = new Patient({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalHistory: medicalHistory || {}
    });

    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      { patientId: patient._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      patient: patient.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login patient
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find patient by email
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if patient is active
    if (!patient.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    patient.lastLogin = new Date();
    await patient.save();

    // Generate JWT token
    const token = jwt.sign(
      { patientId: patient._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      patient: patient.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current patient profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const patient = await Patient.findById(decoded.patientId);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      patient: patient.getPublicProfile()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update patient profile
// @access  Private
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('address.street').optional().notEmpty().withMessage('Street address is required'),
  body('address.city').optional().notEmpty().withMessage('City is required'),
  body('address.state').optional().notEmpty().withMessage('State is required'),
  body('address.zipCode').optional().notEmpty().withMessage('ZIP code is required'),
  validateRequest
], async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const patient = await Patient.findById(decoded.patientId);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'address', 'emergencyContact', 
      'medicalHistory', 'insurance', 'notificationPreferences'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        patient[field] = req.body[field];
      }
    });

    await patient.save();

    res.json({
      message: 'Profile updated successfully',
      patient: patient.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change patient password
// @access  Private
router.post('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validateRequest
], async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const patient = await Patient.findById(decoded.patientId);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await patient.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    patient.password = newPassword;
    await patient.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout patient (client-side token removal)
// @access  Private
router.post('/logout', async (req, res) => {
  try {
    // In a stateless JWT setup, logout is handled client-side
    // You could implement a blacklist here if needed
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 