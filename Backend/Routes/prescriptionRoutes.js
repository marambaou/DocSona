const express = require('express');
const router = express.Router();
const prescriptionController = require('../Controllers/prescriptionController');

// GET all prescriptions
router.get('/', prescriptionController.getPrescriptions);

// GET single prescription
router.get('/:id', prescriptionController.getPrescriptionById);

// GET prescriptions by patient
router.get('/patient/:patientId', prescriptionController.getPrescriptionsByPatient);

// POST create new prescription
router.post('/', prescriptionController.createPrescription);

// PUT update prescription
router.put('/:id', prescriptionController.updatePrescription);

// DELETE prescription
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;