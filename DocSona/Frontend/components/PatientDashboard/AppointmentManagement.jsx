import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiPhone, FiMail, FiEdit, FiTrash2, FiLoader } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Load both upcoming and past appointments in parallel
      const [upcomingData, pastData] = await Promise.all([
        appointmentAPI.getUpcoming(),
        appointmentAPI.getPast()
      ]);

      setUpcomingAppointments(upcomingData.appointments || []);
      setPastAppointments(pastData.appointments || []);
      
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Failed to load appointments');
      setUpcomingAppointments([]);
      setPastAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReschedule = (appointmentId) => {
    console.log('Reschedule appointment:', appointmentId);
    // TODO: Open reschedule modal
  };

  const handleCancel = (appointmentId) => {
    console.log('Cancel appointment:', appointmentId);
    // TODO: Open cancel confirmation modal
  };

  const renderAppointmentCard = (appointment) => (
    <div key={appointment._id} className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{appointment.doctorInfo?.name || 'Doctor'}</h3>
            <p className="text-sm text-gray-600">{appointment.doctorInfo?.specialty || 'Specialty'}</p>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-2" />
                {new Date(appointment.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiClock className="w-4 h-4 mr-2" />
                {appointment.time}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <FiMapPin className="w-4 h-4 mr-2" />
                {appointment.location}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <strong>Reason:</strong> {appointment.reason}
              </p>
              {appointment.symptoms && appointment.symptoms.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Symptoms:</strong> {appointment.symptoms.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
          
          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleReschedule(appointment._id)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Reschedule
              </button>
              <button
                onClick={() => handleCancel(appointment._id)}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="w-4 h-4 mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadAppointments}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Appointments ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past Appointments ({pastAppointments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map(renderAppointmentCard)
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                    Book your first appointment
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastAppointments.length > 0 ? (
                pastAppointments.map(renderAppointmentCard)
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No past appointments</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement; 