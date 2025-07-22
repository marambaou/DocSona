import React, { useState, useEffect } from 'react';

const PrescriptionForm = ({ prescription, patients, onSubmit, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    medication: '',
    dosage: '',
    frequency: '',
    datePrescribed: '',
    endDate: '',
    instructions: '',
    refills: 0,
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Set initial form data if editing a prescription
  useEffect(() => {
    if (prescription) {
      setFormData({
        patientId: prescription.patientId || '',
        patientName: prescription.patientName || '',
        medication: prescription.medication || '',
        dosage: prescription.dosage || '',
        frequency: prescription.frequency || '',
        datePrescribed: prescription.datePrescribed ? new Date(prescription.datePrescribed).toISOString().split('T')[0] : '',
        endDate: prescription.endDate ? new Date(prescription.endDate).toISOString().split('T')[0] : '',
        instructions: prescription.instructions || '',
        refills: prescription.refills || 0,
      });
    } else {
      // Set default date to today for new prescriptions
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        ...formData,
        datePrescribed: today,
      });
    }
  }, [prescription]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'patientId' && value) {
      // Find the patient name from the patient ID
      const patient = patients.find(p => p._id === value);
      if (patient) {
        setFormData({
          ...formData,
          patientId: value,
          patientName: patient.name,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (!formData.medication) {
      newErrors.medication = 'Medication is required';
    }
    
    if (!formData.dosage) {
      newErrors.dosage = 'Dosage is required';
    }
    
    if (!formData.frequency) {
      newErrors.frequency = 'Frequency is required';
    }
    
    if (!formData.datePrescribed) {
      newErrors.datePrescribed = 'Prescription date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert refills to number
      const prescriptionData = {
        ...formData,
        refills: Number(formData.refills),
      };
      
      onSubmit(prescriptionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Selection */}
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
        <select
          id="patientId"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.patientId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>{patient.name}</option>
          ))}
        </select>
        {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
      </div>

      {/* Medication */}
      <div>
        <label htmlFor="medication" className="block text-sm font-medium text-gray-700">Medication</label>
        <input
          type="text"
          id="medication"
          name="medication"
          value={formData.medication}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${errors.medication ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.medication && <p className="mt-1 text-sm text-red-600">{errors.medication}</p>}
      </div>

      {/* Dosage and Frequency row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dosage */}
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">Dosage</label>
          <input
            type="text"
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g., 500mg"
            className={`mt-1 block w-full px-3 py-2 border ${errors.dosage ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.dosage && <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>}
        </div>

        {/* Frequency */}
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
          <input
            type="text"
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="e.g., Twice daily"
            className={`mt-1 block w-full px-3 py-2 border ${errors.frequency ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.frequency && <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>}
        </div>
      </div>

      {/* Date Prescribed and End Date row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Prescribed */}
        <div>
          <label htmlFor="datePrescribed" className="block text-sm font-medium text-gray-700">Date Prescribed</label>
          <input
            type="date"
            id="datePrescribed"
            name="datePrescribed"
            value={formData.datePrescribed}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.datePrescribed ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.datePrescribed && <p className="mt-1 text-sm text-red-600">{errors.datePrescribed}</p>}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Refills */}
      <div>
        <label htmlFor="refills" className="block text-sm font-medium text-gray-700">Refills</label>
        <input
          type="number"
          id="refills"
          name="refills"
          min="0"
          value={formData.refills}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Instructions */}
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows="3"
          placeholder="e.g., Take with food, avoid alcohol, etc."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {prescription ? 'Update Prescription' : 'Add Prescription'}
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;