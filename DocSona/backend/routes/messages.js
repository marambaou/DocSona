import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import Message from '../models/Message.js';

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

// Middleware to authenticate patient
const authenticatePatient = async (req, res, next) => {
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

    req.patient = patient;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/messages/conversations
// @desc    Get all conversations for the authenticated patient
// @access  Private
router.get('/conversations', authenticatePatient, async (req, res) => {
  try {
    const conversations = await Message.getRecentConversations(req.patient._id);

    // Map doctor IDs to mock doctor data
    const doctorData = {
      'doc1': { firstName: 'Dr. Sarah', lastName: 'Johnson', specialty: 'Cardiology' },
      'doc2': { firstName: 'Dr. Michael', lastName: 'Chen', specialty: 'Dermatology' },
      'doc3': { firstName: 'Dr. Lisa', lastName: 'Williams', specialty: 'Neurology' },
      'doc4': { firstName: 'Dr. Emily', lastName: 'Davis', specialty: 'Pediatrics' },
      'doc5': { firstName: 'Dr. Robert', lastName: 'Brown', specialty: 'Orthopedics' }
    };

    const populatedConversations = conversations.map(conversation => {
      const doctorId = conversation.lastMessage.otherParticipant;
      const doctorInfo = doctorData[doctorId] || { firstName: 'Dr.', lastName: 'Smith', specialty: 'General Medicine' };
      
      return {
        ...conversation,
        doctor: {
          _id: doctorId,
          ...doctorInfo,
          profilePicture: null
        }
      };
    });

    res.json({ conversations: populatedConversations });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/messages/conversations/:doctorId
// @desc    Get conversation with a specific doctor
// @access  Private
router.get('/conversations/:doctorId', authenticatePatient, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Map doctor IDs to mock doctor data
    const doctorData = {
      'doc1': { firstName: 'Dr. Sarah', lastName: 'Johnson', specialty: 'Cardiology' },
      'doc2': { firstName: 'Dr. Michael', lastName: 'Chen', specialty: 'Dermatology' },
      'doc3': { firstName: 'Dr. Lisa', lastName: 'Williams', specialty: 'Neurology' },
      'doc4': { firstName: 'Dr. Emily', lastName: 'Davis', specialty: 'Pediatrics' },
      'doc5': { firstName: 'Dr. Robert', lastName: 'Brown', specialty: 'Orthopedics' }
    };

    const doctorInfo = doctorData[doctorId] || { firstName: 'Dr.', lastName: 'Smith', specialty: 'General Medicine' };
    const doctor = {
      _id: doctorId,
      ...doctorInfo,
      profilePicture: null
    };

    const messages = await Message.getConversation(
      req.patient._id,
      doctorId,
      parseInt(limit),
      skip
    );

    const total = await Message.countDocuments({
      patientId: req.patient._id,
      doctorId
    });

    res.json({
      messages: messages.reverse(), // Show oldest first
      doctor,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/messages/conversations/:doctorId
// @desc    Send a message to a doctor
// @access  Private
router.post('/conversations/:doctorId', [
  authenticatePatient,
  body('content').notEmpty().withMessage('Message content is required'),
  body('content').isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  validateRequest
], async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { content, relatedAppointment, replyTo } = req.body;

    // Map doctor IDs to mock doctor data
    const doctorData = {
      'doc1': { firstName: 'Dr. Sarah', lastName: 'Johnson', specialty: 'Cardiology' },
      'doc2': { firstName: 'Dr. Michael', lastName: 'Chen', specialty: 'Dermatology' },
      'doc3': { firstName: 'Dr. Lisa', lastName: 'Williams', specialty: 'Neurology' },
      'doc4': { firstName: 'Dr. Emily', lastName: 'Davis', specialty: 'Pediatrics' },
      'doc5': { firstName: 'Dr. Robert', lastName: 'Brown', specialty: 'Orthopedics' }
    };

    const doctorInfo = doctorData[doctorId] || { firstName: 'Dr.', lastName: 'Smith', specialty: 'General Medicine' };
    const doctor = {
      _id: doctorId,
      ...doctorInfo,
      profilePicture: null
    };

    // Create the message
    const message = new Message({
      patientId: req.patient._id,
      doctorId,
      sender: 'patient',
      content,
      relatedAppointment: relatedAppointment || null,
      replyTo: replyTo || null
    });

    await message.save();

    // Populate the message for response
    await message.populate('relatedAppointment', 'date time status');
    if (replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    res.status(201).json({
      message: 'Message sent successfully',
      messageData: message
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark a message as read
// @access  Private
router.put('/:id/read', authenticatePatient, async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      patientId: req.patient._id,
      sender: 'doctor'
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await message.markAsRead();

    res.json({ message: 'Message marked as read' });

  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/messages/conversations/:doctorId/read-all
// @desc    Mark all messages in a conversation as read
// @access  Private
router.put('/conversations/:doctorId/read-all', authenticatePatient, async (req, res) => {
  try {
    const { doctorId } = req.params;

    await Message.updateMany(
      {
        patientId: req.patient._id,
        doctorId,
        sender: 'doctor',
        read: false
      },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All messages marked as read' });

  } catch (error) {
    console.error('Mark all messages read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', authenticatePatient, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.patient._id);
    res.json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message (only if sent by patient)
// @access  Private
router.delete('/:id', authenticatePatient, async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      patientId: req.patient._id,
      sender: 'patient'
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found or cannot be deleted' });
    }

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 