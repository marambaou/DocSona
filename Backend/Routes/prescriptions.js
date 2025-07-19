import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Prescription from '../models/Prescription.js';

const router = express.Router();

// Get all prescriptions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, patient } = req.query;
    const filter = { doctor: req.doctor._id };

    if (patient) filter.patient = patient;

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'name email phone age')
      .populate('appointment', 'date time reason')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(filter);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get prescription by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      doctor: req.doctor._id
    })
      .populate('patient', 'name email phone age')
      .populate('appointment', 'date time reason');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create prescription
router.post('/', authMiddleware, async (req, res) => {
  try {
    const prescription = new Prescription({
      ...req.body,
      doctor: req.doctor._id
    });

    await prescription.save();
    await prescription.populate('patient', 'name email phone age');

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update prescription
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, doctor: req.doctor._id },
      req.body,
      { new: true }
    ).populate('patient', 'name email phone age');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete prescription
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({
      _id: req.params.id,
      doctor: req.doctor._id
    });

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;