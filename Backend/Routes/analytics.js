import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get analytics overview
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const doctorId = req.doctor._id;
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Weekly appointment trends
    const weeklyAppointments = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            week: { $week: '$date' },
            year: { $year: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      }
    ]);

    // Revenue trends
    const revenueData = await Payment.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Most active patients
    const activePatients = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$patient',
          appointmentCount: { $sum: 1 }
        }
      },
      {
        $sort: { appointmentCount: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: '_id',
          as: 'patient'
        }
      },
      {
        $unwind: '$patient'
      },
      {
        $project: {
          name: '$patient.name',
          appointmentCount: 1
        }
      }
    ]);

    // Appointment status distribution
    const statusDistribution = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Peak hours analysis
    const peakHours = await Appointment.aggregate([
      {
        $match: {
          doctor: doctorId,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $substr: ['$time', 0, 2] },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      weeklyAppointments,
      revenueData,
      activePatients,
      statusDistribution,
      peakHours
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;