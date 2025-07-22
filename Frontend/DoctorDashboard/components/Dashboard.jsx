import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from './StatsCard';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { dashboardApi, appointmentApi } from '../services/api';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalPrescriptions: 0
  });
  const [patientGrowth, setPatientGrowth] = useState([]);
  const [appointmentsByDate, setAppointmentsByDate] = useState([]);
  const [prescriptionStats, setPrescriptionStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [error, setError] = useState(null);

  // Date formatter
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time remaining
  const getTimeRemaining = (dateString) => {
    const appointmentTime = new Date(dateString);
    const now = new Date();
    const diffTime = appointmentTime - now;
    
    // If the appointment has passed
    if (diffTime < 0) return 'Past';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} day(s)`;
    
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hour(s)`;
    
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffMinutes} minute(s)`;
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get general stats
        const statsData = await dashboardApi.getStats();
        setStats(statsData);

        // Get patient growth data (last 6 months)
        const growthData = await dashboardApi.getPatientGrowth(6);
        setPatientGrowth(growthData);

        // Get appointments by date (last 7 days)
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        
        const formattedStart = weekAgo.toISOString().split('T')[0];
        const formattedEnd = today.toISOString().split('T')[0];
        
        const appointmentsData = await dashboardApi.getAppointmentsByDate(formattedStart, formattedEnd);
        setAppointmentsByDate(appointmentsData);

        // Get prescription statistics
        const prescriptionsData = await dashboardApi.getPrescriptionStats();
        setPrescriptionStats(prescriptionsData);

        // Get upcoming appointments
        const upcoming = await appointmentApi.getUpcoming();
        setUpcomingAppointments(upcoming);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        // Set mock data for demonstration
        setStats({
          totalPatients: 152,
          totalAppointments: 425,
          todayAppointments: 8,
          totalPrescriptions: 310
        });

        setPatientGrowth([
          { month: 'Jan', patients: 89 },
          { month: 'Feb', patients: 103 },
          { month: 'Mar', patients: 112 },
          { month: 'Apr', patients: 125 },
          { month: 'May', patients: 137 },
          { month: 'Jun', patients: 152 }
        ]);

        setAppointmentsByDate([
          { date: '2023-06-15', count: 6 },
          { date: '2023-06-16', count: 8 },
          { date: '2023-06-17', count: 5 },
          { date: '2023-06-18', count: 0 },
          { date: '2023-06-19', count: 9 },
          { date: '2023-06-20', count: 7 },
          { date: '2023-06-21', count: 8 }
        ]);

        setPrescriptionStats([
          { name: 'Antibiotics', value: 95 },
          { name: 'Pain Relief', value: 85 },
          { name: 'Chronic Disease', value: 65 },
          { name: 'Mental Health', value: 40 },
          { name: 'Other', value: 25 }
        ]);

        setUpcomingAppointments([
          {
            _id: '1',
            patientName: 'Jane Cooper',
            date: '2023-06-21T10:30:00',
            purpose: 'Follow-up'
          },
          {
            _id: '2',
            patientName: 'Robert Fox',
            date: '2023-06-21T11:15:00',
            purpose: 'Consultation'
          },
          {
            _id: '3',
            patientName: 'Emily Wilson',
            date: '2023-06-21T13:00:00',
            purpose: 'Annual Check-up'
          },
          {
            _id: '4',
            patientName: 'Michael Brown',
            date: '2023-06-21T14:30:00',
            purpose: 'Prescription Renewal'
          },
          {
            _id: '5',
            patientName: 'Sarah Johnson',
            date: '2023-06-22T09:15:00',
            purpose: 'New Patient'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="text-gray-500">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="mt-2 md:mt-0 bg-blue-50 text-blue-800 rounded-md px-4 py-1.5">
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
          <p>{error}</p>
          <p className="text-sm mt-1">Using mock data for demonstration purposes.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="blue"
          trend={5.2}
        />
        <StatsCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="green"
          trend={2.8}
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="purple"
          trend={0}
        />
        <StatsCard
          title="Total Prescriptions"
          value={stats.totalPrescriptions}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="yellow"
          trend={3.6}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Patient Growth</h3>
            <select className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <LineChart 
            data={patientGrowth.map(item => ({
              name: item.month,
              value: item.patients
            }))} 
            xDataKey="name" 
            lineDataKey="value" 
            stroke="#3B82F6"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Prescription Types</h3>
            <button className="text-sm text-blue-500 hover:text-blue-600">View all</button>
          </div>
          <PieChart 
            data={prescriptionStats} 
            dataKey="value" 
            nameKey="name" 
            colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Appointments This Week</h3>
            <button className="text-sm text-blue-500 hover:text-blue-600">View all</button>
          </div>
          <BarChart 
            data={appointmentsByDate.map(item => ({
              name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
              value: item.count
            }))} 
            xDataKey="name" 
            barDataKey="value"
            barFill="#3B82F6"
          />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            <Link to="/appointments" className="text-sm text-blue-500 hover:text-blue-600">View all</Link>
          </div>
          {upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Left
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.purpose}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getTimeRemaining(appointment.date)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No upcoming appointments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;