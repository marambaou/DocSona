import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';

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

// @route   GET /api/appointments
// @desc    Get all appointments for the authenticated patient
// @access  Private
router.get('/', authenticatePatient, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { patientId: req.patient._id };
    
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/appointments/upcoming
// @desc    Get upcoming appointments for the authenticated patient
// @access  Private
router.get('/upcoming', authenticatePatient, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      patientId: req.patient._id,
      date: { $gte: today },
      status: { $in: ['scheduled', 'confirmed'] }
    })
    .sort({ date: 1, time: 1 })
    .limit(10);

    res.json({ appointments });

  } catch (error) {
    console.error('Get upcoming appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/appointments/past
// @desc    Get past appointments for the authenticated patient
// @access  Private
router.get('/past', authenticatePatient, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      patientId: req.patient._id,
      date: { $lt: today }
    })
    .sort({ date: -1, time: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Appointment.countDocuments({
      patientId: req.patient._id,
      date: { $lt: today }
    });

    res.json({
      appointments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get past appointments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private
router.post('/', [
  authenticatePatient,
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('doctorInfo.name').notEmpty().withMessage('Doctor name is required'),
  body('doctorInfo.specialty').notEmpty().withMessage('Doctor specialty is required'),
  body('doctorInfo.practice').notEmpty().withMessage('Practice name is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/).withMessage('Valid time format is required (HH:MM AM/PM)'),
  body('reason').notEmpty().withMessage('Reason for appointment is required'),
  body('location').notEmpty().withMessage('Appointment location is required'),
  validateRequest
], async (req, res) => {
  try {
    const { doctorId, doctorInfo, date, time, reason, location, symptoms, notes } = req.body;

    // Check if the requested date is in the future
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ error: 'Cannot book appointments in the past' });
    }

    // Check if the time slot is available
    const [hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hour, parseInt(minutes), 0, 0);

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      time,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create the appointment
    const appointment = new Appointment({
      patientId: req.patient._id,
      doctorId,
      doctorInfo,
      date: appointmentDate,
      time,
      reason,
      location,
      symptoms: symptoms || [],
      notes: {
        patient: notes?.patient || ''
      }
    });

    await appointment.save();

    // Create notification for appointment confirmation
    await Notification.createAppointmentConfirmation(appointment);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available time slots for a specific date (mock data)
// @access  Public
router.get('/available-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Mock available slots (9 AM to 5 PM, 30-minute intervals)
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Convert to 12-hour format
        let displayHour = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour >= 12 ? 'PM' : 'AM';
        const timeString = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        
        // Check if this slot is already booked
        const isBooked = await Appointment.findOne({
          date: requestedDate,
          time: timeString,
          status: { $in: ['scheduled', 'confirmed'] }
        });

        if (!isBooked) {
          slots.push(timeString);
        }
      }
    }

    res.json({ slots: slots });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get a specific appointment
// @access  Private
router.get('/:id', authenticatePatient, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.patient._id
    }).populate('doctorId', 'firstName lastName specialty practice rating phone email');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id/reschedule
// @desc    Reschedule an appointment
// @access  Private
router.put('/:id/reschedule', [
  authenticatePatient,
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/).withMessage('Valid time format is required'),
  validateRequest
], async (req, res) => {
  try {
    const { date, time } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.patient._id
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!appointment.canBeRescheduled()) {
      return res.status(400).json({ error: 'Appointment cannot be rescheduled (too close to appointment time)' });
    }

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: new Date(date),
      time,
      status: { $in: ['scheduled', 'confirmed'] },
      _id: { $ne: appointment._id }
    });

    if (conflictingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Update appointment
    appointment.date = new Date(date);
    appointment.time = time;
    await appointment.save();

    await appointment.populate('doctorId', 'firstName lastName specialty practice rating');

    // Create notification for rescheduling
    await Notification.create({
      patientId: req.patient._id,
      type: 'appointment_rescheduled',
      title: 'Appointment Rescheduled',
      message: `Your appointment with Dr. ${appointment.doctorId.fullName} has been rescheduled to ${appointment.date.toLocaleDateString()} at ${appointment.time}`,
      priority: 'medium',
      relatedAppointment: appointment._id,
      relatedDoctor: appointment.doctorId
    });

    res.json({
      message: 'Appointment rescheduled successfully',
      appointment
    });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id/cancel
// @desc    Cancel an appointment
// @access  Private
router.put('/:id/cancel', [
  authenticatePatient,
  body('reason').optional().isLength({ max: 200 }).withMessage('Cancellation reason cannot exceed 200 characters'),
  validateRequest
], async (req, res) => {
  try {
    const { reason } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patientId: req.patient._id
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (!appointment.canBeCancelled()) {
      return res.status(400).json({ error: 'Appointment cannot be cancelled (too close to appointment time)' });
    }

    // Cancel appointment
    appointment.status = 'cancelled';
    appointment.cancelledBy = 'patient';
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    await appointment.save();

    await appointment.populate('doctorId', 'firstName lastName specialty practice rating');

    // Create notification for cancellation
    await Notification.createAppointmentCancellation(appointment, reason);

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 