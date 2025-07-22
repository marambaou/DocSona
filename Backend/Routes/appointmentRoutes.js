const express = require('express');
const router = express.Router();
const appointmentController = require('../Controllers/appointmentController');

// GET all appointments
router.get('/', appointmentController.getAppointments);

// GET today's appointments
router.get('/today', appointmentController.getTodayAppointments);

// GET single appointment
router.get('/:id', appointmentController.getAppointmentById);

// POST create new appointment
router.post('/', appointmentController.createAppointment);

// PUT update appointment
router.put('/:id', appointmentController.updateAppointment);

// DELETE appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;