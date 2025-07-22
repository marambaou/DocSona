const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');

// GET dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// GET patient growth data
router.get('/patient-growth', dashboardController.getPatientGrowth);

module.exports = router;
