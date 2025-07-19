import React from 'react';
import useSWR from 'swr';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Activity
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
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsService } from '../services/api';
import MetricCard from '../components/MetricCard';

const Analytics = () => {
  const { data: analytics } = useSWR('/analytics/overview', analyticsService.getOverview);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const analyticsData = analytics.data;

  // Prepare data for charts
  const weeklyData = analyticsData.weeklyAppointments.map(item => ({
    week: `Week ${item._id.week}`,
    appointments: item.count
  }));

  const revenueData = analyticsData.revenueData.map(item => ({
    date: new Date(item._id).toLocaleDateString(),
    revenue: item.revenue
  }));

  const statusData = analyticsData.statusDistribution.map(item => ({
    name: item._id,
    value: item.count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="text-sm text-gray-500">
          Last 30 days overview
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Appointments"
          value={analyticsData.weeklyAppointments.reduce((sum, item) => sum + item.count, 0)}
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analyticsData.revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Active Patients"
          value={analyticsData.activePatients.length}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Peak Hours"
          value={analyticsData.peakHours[0]?._id || 'N/A'}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Weekly Appointments</h2>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Revenue Trend</h2>
            <DollarSign className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Patients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Most Active Patients</h2>
          <div className="space-y-4">
            {analyticsData.activePatients.map((patient, index) => (
              <div key={patient._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.appointmentCount} appointments</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{patient.appointmentCount}</div>
                  <div className="text-xs text-gray-500">visits</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Peak Hours Analysis</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {analyticsData.peakHours.map((hour) => (
            <div key={hour._id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{hour._id}:00</div>
              <div className="text-sm text-gray-500">{hour.count} appointments</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;