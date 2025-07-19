import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  Calendar, 
  Clock, 
  User, 
  Filter,
  Plus,
  Search
} from 'lucide-react';
import { appointmentService } from '../services/api';
import NewAppointmentModal from '../components/NewAppointmentModal';

const Appointments = () => {s
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false); // ✅ Added

  const { data: appointments, mutate } = useSWR(
    `/appointments?page=${page}&status=${status}&date=${date}&search=${search}`,
    () => appointmentService.getAll({ page, status, date, search })
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.update(appointmentId, { status: newStatus });
      mutate();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  if (!appointments) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const appointmentsData = appointments.data.appointments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <button
          onClick={() => setShowModal(true)} // ✅ Added
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointmentsData.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patient?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.patient?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {appointment.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.reason}</div>
                    <div className="text-sm text-gray-500">{appointment.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                      className="text-blue-600 hover:text-blue-900 border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No Show</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {appointments.data.appointments.length} of {appointments.data.total} appointments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {appointments.data.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === appointments.data.totalPages}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showModal && (
        <NewAppointmentModal
          onClose={() => setShowModal(false)} // ✅ Added
          onAppointmentCreated={mutate} // ✅ Added to refresh appointments after creation
        />
      )}
    </div>
  );
};

export default Appointments;
