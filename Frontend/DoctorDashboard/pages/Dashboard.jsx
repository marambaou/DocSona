import React from 'react';
import useSWR from 'swr';
import { 
  Users, 
  Calendar, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { dashboardService, appointmentService } from '../services/api';
import MetricCard from '../components/MetricCard';
import AppointmentCard from '../components/AppointmentCard';

const Dashboard = () => {
  const { data: metrics } = useSWR('/dashboard/metrics', dashboardService.getMetrics);
  const { data: todayAppointments } = useSWR('/appointments/today', appointmentService.getTodayAppointments);
  const { data: appointmentStats } = useSWR('/appointments/stats', appointmentService.getStats);
  const { data: upcomingAppointments } = useSWR('/appointments/upcoming', appointmentService.getUpcoming);

  if (!metrics || !todayAppointments || !appointmentStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const metricsData = metrics.data;
  const todayAppointmentsData = todayAppointments.data;
  const appointmentStatsData = appointmentStats.data;
  const upcomingAppointmentsData = upcomingAppointments?.data || [];

  const chartData = appointmentStatsData.map(stat => ({
    date: new Date(stat._id).toLocaleDateString(),
    appointments: stat.count
  }));

  const upcomingData = upcomingAppointmentsData.slice(0, 5).map((appointment, index) => ({
    time: appointment.time,
    patient: appointment.patient?.name || 'Unknown',
    count: index + 1
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value={metricsData.totalPatients}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Today's Appointments"
          value={metricsData.todayAppointments}
          icon={Calendar}
          color="green"
        />
        <MetricCard
          title="Prescriptions"
          value={metricsData.totalPrescriptions}
          icon={FileText}
          color="purple"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${metricsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {todayAppointmentsData.length > 0 ? (
              todayAppointmentsData.slice(0, 4).map((appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        {/* Appointment Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Appointment Statistics</h2>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Schedule</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={upcomingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;