import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';

const router = express.Router();

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

// Helper to get patientId as ObjectId
function getPatientObjectId(patient) {
  return (typeof patient._id === 'string') ? new mongoose.Types.ObjectId(patient._id) : patient._id;
}

// @route   GET /api/notifications
// @desc    Get all notifications for the authenticated patient
// @access  Private
router.get('/', authenticatePatient, async (req, res) => {
  try {
    const { read, type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const patientId = getPatientObjectId(req.patient);
    let query = { patientId };

    // Filter by read status
    if (read !== undefined) {
      query.read = read === 'true';
    }

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .populate('relatedAppointment', 'date time status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      patientId,
      read: false
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', authenticatePatient, async (req, res) => {
  try {
    const patientId = getPatientObjectId(req.patient);
    const count = await Notification.countDocuments({
      patientId,
      read: false
    });

    res.json({ unreadCount: count });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', authenticatePatient, async (req, res) => {
  try {
    const patientId = getPatientObjectId(req.patient);
    const notification = await Notification.findOne({
      _id: req.params.id,
      patientId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.markAsRead();

    res.json({ message: 'Notification marked as read' });

  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', authenticatePatient, async (req, res) => {
  try {
    const patientId = getPatientObjectId(req.patient);
    await Notification.updateMany(
      { patientId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });

  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', authenticatePatient, async (req, res) => {
  try {
    const patientId = getPatientObjectId(req.patient);
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      patientId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/clear-read
// @desc    Delete all read notifications
// @access  Private
router.delete('/clear-read', authenticatePatient, async (req, res) => {
  try {
    const patientId = getPatientObjectId(req.patient);
    const result = await Notification.deleteMany({
      patientId,
      read: true
    });

    res.json({ 
      message: 'Read notifications cleared successfully',
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Clear read notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 