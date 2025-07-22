import React, { useState, useEffect } from 'react';

const AppointmentForm = ({ appointment, patients, onSubmit, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    type: 'Check-up',
    status: 'Scheduled',
    notes: '',
    duration: 30,
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Set initial form data if editing an appointment
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        patientName: appointment.patientName || '',
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        time: appointment.time || '',
        type: appointment.type || 'Consultation',
        status: appointment.status || 'Scheduled',
        notes: appointment.notes || '',
        duration: appointment.duration || 30,
      });
    }
  }, [appointment]);

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
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Appointment type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
    onSubmit({
      patient: formData.patientId, // <-- must be 'patient', not 'patientId'
      date: formData.date,
      time: formData.time,
      type: formData.type, // must match backend enum exactly
      status: formData.status === 'Cancelled' ? 'Canceled' : formData.status, // fix spelling for backend
      notes: formData.notes,
      duration: formData.duration
    });
  }
};

  // Appointment type options
  const appointmentTypes = [
    'Consultation',
    'Follow-up',
    'Emergency',
    'Routine Check-up'
  ];

  // Appointment status options
  const appointmentStatuses = [
    'Scheduled',
    'Completed',
    'Canceled',
    'No-show'
  ];

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

      {/* Date and Time row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
        </div>
      </div>

      {/* Type and Status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            {appointmentTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {appointmentStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="5"
          step="5"
          value={formData.duration}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
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
          {appointment ? 'Update Appointment' : 'Add Appointment'}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;