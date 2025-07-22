const Prescription = require('../Models/Prescription');

// Get all prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'name email')
      .populate('appointment')
      .sort({ prescribedDate: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('appointment');
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};

// Create new prescription
exports.createPrescription = async (req, res) => {
  try {
    const newPrescription = new Prescription(req.body);
    const savedPrescription = await newPrescription.save();
    
    // Populate relations before returning
    const populatedPrescription = await Prescription.findById(savedPrescription._id)
      .populate('patient', 'name email')
      .populate('appointment');
    
    res.status(201).json(populatedPrescription);
  } catch (error) {
    res.status(400).json({ message: 'Error creating prescription', error: error.message });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
  try {
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('patient', 'name email')
    .populate('appointment');
    
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json(updatedPrescription);
  } catch (error) {
    res.status(400).json({ message: 'Error updating prescription', error: error.message });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    res.json({ message: 'Prescription removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prescription', error: error.message });
  }
};

// Get prescriptions by patient ID
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('patient', 'name email')
      .populate('appointment')
      .sort({ prescribedDate: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient prescriptions', error: error.message });
  }
};
