const express = require('express');
const authMiddleware = require('../Middleware/auth');
const Appointment = require('../Models/Appointment');

const router = express.Router();

// Get all appointments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;
    const filter = { doctor: req.user._id };

    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone age')
      .populate('doctor', 'name specialization')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      appointments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get today's appointments
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const appointments = await Appointment.find({
      doctor: req.user._id,
      date: { $gte: startOfToday, $lt: endOfToday }
    })
      .populate('patient', 'name email phone age')
      .sort({ time: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get appointment statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await Appointment.aggregate([
      {
        $match: {
          doctor: req.user._id,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get upcoming schedule
router.get('/upcoming', authMiddleware, async (req, res) => {
  try {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcoming = await Appointment.find({
      doctor: req.user._id,
      date: { $gte: now, $lte: nextWeek },
      status: { $in: ['scheduled', 'confirmed'] }
    })
      .populate('patient', 'name email phone')
      .sort({ date: 1, time: 1 })
      .limit(10);

    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create appointment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      doctor: req.user._id
    });

    await appointment.save();
    await appointment.populate('patient', 'name email phone age');

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update appointment
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user._id },
      req.body,
      { new: true }
    ).populate('patient', 'name email phone age');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete appointment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      doctor: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;