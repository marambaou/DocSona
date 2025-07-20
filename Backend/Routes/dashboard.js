const express = require('express');
const authMiddleware = require('../Middleware/auth');
const Patient = require('../Models/Patient');
const Appointment = require('../Models/Appointment');
const Prescription = require('../Models/Prescription');
const Payment = require('../Models/Payment');

const router = express.Router();

// Get dashboard metrics
router.get('/metrics', authMiddleware, async (req, res) => {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Total patients
    const totalPatients = await Patient.countDocuments({ doctor: doctorId });

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      date: { $gte: startOfToday, $lt: endOfToday }
    });

    // Total prescriptions
    const totalPrescriptions = await Prescription.countDocuments({ doctor: doctorId });

    // Total revenue (this month)
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const revenueResult = await Payment.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalPatients,
      todayAppointments,
      totalPrescriptions,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;