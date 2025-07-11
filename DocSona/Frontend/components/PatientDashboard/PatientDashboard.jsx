import React, { useState } from 'react';
import { FiHome, FiCalendar, FiUser, FiBell, FiSettings, FiLogOut, FiPlus, FiMessageSquare } from 'react-icons/fi';
import DashboardOverview from './DashboardOverview';
import AppointmentManagement from './AppointmentManagement';
import DoctorInformation from './DoctorInformation';
import ProfileSettings from './ProfileSettings';
import Notifications from './Notifications';
import MessageCenter from './MessageCenter';
import BookingWizard from './BookingWizard';

const PatientDashboard = ({ onLogout, user }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const [showBookingWizard, setShowBookingWizard] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'doctors', label: 'Doctors', icon: FiUser },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveSection} onOpenBookingWizard={() => setShowBookingWizard(true)} />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'doctors':
        return <DoctorInformation />;
      case 'messages':
        return <MessageCenter />;
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <div className="p-6">Settings coming soon...</div>;
      default:
        return <DashboardOverview onNavigate={setActiveSection} onOpenBookingWizard={() => setShowBookingWizard(true)} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">DocSona</h1>
          <p className="text-sm text-gray-500">Patient Portal</p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button 
            onClick={onLogout}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-gray-500">Welcome back, {user?.firstName || 'Patient'}</p>
            </div>
            <button 
              onClick={() => setShowBookingWizard(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Booking Wizard Modal */}
      {showBookingWizard && (
        <BookingWizard onClose={() => setShowBookingWizard(false)} />
      )}
    </div>
  );
};

export default PatientDashboard; 