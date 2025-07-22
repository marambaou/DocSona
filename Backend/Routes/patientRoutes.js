const express = require('express');
const router = express.Router();
const patientController = require('../Controllers/patientController');

// GET all patients
router.get('/', patientController.getPatients);

// GET single patient
router.get('/:id', patientController.getPatientById);

// POST create new patient
router.post('/', patientController.createPatient);

// PUT update patient
router.put('/:id', patientController.updatePatient);

// DELETE patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;
