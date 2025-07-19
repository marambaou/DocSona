import React from 'react';
import { Clock, User, MapPin } from 'lucide-react';

const AppointmentCard = ({ appointment }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-800">{appointment.patient?.name}</h3>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{appointment.time}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;