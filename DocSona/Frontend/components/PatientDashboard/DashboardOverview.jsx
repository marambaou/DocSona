import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiUser, FiLoader, FiArrowRight } from 'react-icons/fi';
import { appointmentAPI, doctorAPI, notificationAPI, messageAPI } from '../../services/api';

const DashboardOverview = ({ onNavigate, onOpenBookingWizard }) => {
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [upcomingAppts, notifications, messages] = await Promise.all([
        appointmentAPI.getUpcoming(),
        notificationAPI.getUnreadCount(),
        messageAPI.getUnreadCount()
      ]);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = upcomingAppts.appointments?.filter(apt => 
        apt.date === today
      ) || [];

      const statsData = [
        {
          title: 'Upcoming Appointments',
          value: upcomingAppts.appointments?.length || '0',
          icon: FiCalendar,
          color: 'bg-blue-500',
          textColor: 'text-blue-600',
          onClick: () => onNavigate('appointments')
        },
        {
          title: 'Today\'s Appointments',
          value: todayAppointments.length.toString(),
          icon: FiClock,
          color: 'bg-green-500',
          textColor: 'text-green-600',
          onClick: () => onNavigate('appointments')
        },
        {
          title: 'Unread Notifications',
          value: notifications.unreadCount || '0',
          icon: FiCheckCircle,
          color: 'bg-purple-500',
          textColor: 'text-purple-600',
          onClick: () => onNavigate('notifications')
        },
        {
          title: 'Unread Messages',
          value: messages.unreadCount || '0',
          icon: FiUser,
          color: 'bg-orange-500',
          textColor: 'text-orange-600',
          onClick: () => onNavigate('messages')
        }
      ];

      setStats(statsData);
      setUpcomingAppointments(upcomingAppts.appointments || []);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      
      // Set empty data on error
      setStats([]);
      setUpcomingAppointments([]);
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
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-lg shadow-sm p-6 border hover:shadow-md transition-all duration-200 text-left w-full cursor-pointer hover:border-gray-300"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <FiArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={onOpenBookingWizard}
            className="flex items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <FiCalendar className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Book New Appointment</span>
          </button>
          <button 
            onClick={() => onNavigate('doctors')}
            className="flex items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <FiUser className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Find Doctors</span>
          </button>
          <button 
            onClick={() => onNavigate('appointments')}
            className="flex items-center justify-center p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <FiClock className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">View Schedule</span>
          </button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
        </div>
        <div className="p-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.doctorInfo?.name || 'Doctor'}</h4>
                      <p className="text-sm text-gray-500">{appointment.doctorInfo?.specialty || 'Specialty'}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <button 
                      onClick={() => onNavigate('appointments')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
              <button 
                onClick={onOpenBookingWizard}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 