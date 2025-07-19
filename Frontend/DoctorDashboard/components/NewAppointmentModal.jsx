import React, { useState } from 'react';
import { appointmentService } from '../services/api';

const NewAppointmentModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    patient: '',
    date: '',
    time: '',
    reason: '',
    type: '',
    status: 'scheduled'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        ...form,
        date: new Date(form.date).toISOString() // convert date to ISO format
      };

      await appointmentService.create(appointmentData);
      onCreated(); // refetch appointments in parent
      onClose();   // close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-blue bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">New Appointment</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="text"
              name="patient"
              value={form.patient}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <input
              type="text"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;
