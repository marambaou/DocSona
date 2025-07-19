import express from 'express';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middleware/auth.js';
import Doctor from '../models/Doctor.js';

const router = express.Router();

// Update doctor profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Don't allow password update through this route

    const doctor = await Doctor.findByIdAndUpdate(
      req.doctor._id,
      updates,
      { new: true }
    ).select('-password');

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get doctor with password
    const doctor = await Doctor.findById(req.doctor._id);
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await Doctor.findByIdAndUpdate(req.doctor._id, { password: hashedPassword });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;