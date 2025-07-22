// Mock data for Doctor Dashboard

//Color
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Mock Statistics Cards
export const mockStats = [
  {
    title: 'Total Patients',
    value: '472',
    change: '+5.2%',
    trend: 'up',
    icon: {
      path: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      bgColor: 'bg-blue-500',
    },
  },
  {
    title: 'Appointments',
    value: '28',
    change: '+12.5%',
    trend: 'up',
    icon: {
      path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      bgColor: 'bg-green-500',
    },
  },
  {
    title: 'Prescriptions',
    value: '96',
    change: '+3.8%',
    trend: 'up',
    icon: {
      path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      bgColor: 'bg-purple-500',
    },
  },
  {
    title: 'Completion Rate',
    value: '89%',
    change: '-2.3%',
    trend: 'down',
    icon: {
      path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'bg-yellow-500',
    },
  },
];

// Mock Monthly Appointments Data
export const monthlyAppointmentsData = [
  { month: 'Jan', count: 18 },
  { month: 'Feb', count: 24 },
  { month: 'Mar', count: 30 },
  { month: 'Apr', count: 35 },
  { month: 'May', count: 28 },
  { month: 'Jun', count: 32 },
  { month: 'Jul', count: 38 },
  { month: 'Aug', count: 42 },
  { month: 'Sep', count: 35 },
  { month: 'Oct', count: 30 },
  { month: 'Nov', count: 28 },
  { month: 'Dec', count: 25 },
];

// Mock Appointment Status Data
export const appointmentStatusData = [
  { name: 'Scheduled', value: 45 },
  { name: 'Completed', value: 35 },
  { name: 'Cancelled', value: 15 },
  { name: 'No-show', value: 5 },
];

// Mock Appointment Type Data
export const appointmentTypeData = [
  { name: 'Check-up', value: 30 },
  { name: 'Follow-up', value: 25 },
  { name: 'Consultation', value: 20 },
  { name: 'Urgent Care', value: 15 },
  { name: 'Procedure', value: 10 },
];

// Mock Patient Growth Data
export const lineChartData = [
  { month: 'Jul 2024', count: 12 },
  { month: 'Aug 2024', count: 15 },
  { month: 'Sep 2024', count: 10 },
  { month: 'Oct 2024', count: 18 },
  { month: 'Nov 2024', count: 20 },
  { month: 'Dec 2024', count: 22 },
  { month: 'Jan 2025', count: 25 },
  { month: 'Feb 2025', count: 28 },
  { month: 'Mar 2025', count: 30 },
  { month: 'Apr 2025', count: 35 },
  { month: 'May 2025', count: 38 },
  { month: 'Jun 2025', count: 42 },
];


// Mock Bar Chart Data
export const barChartData = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];


// Mock Recent Patients
export const recentPatients = [
  { id: 1, name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '(555) 123-4567', registeredDate: '2025-06-18' },
  { id: 2, name: 'James Rodriguez', email: 'james.r@example.com', phone: '(555) 987-6543', registeredDate: '2025-06-17' },
  { id: 3, name: 'Sarah Johnson', email: 's.johnson@example.com', phone: '(555) 456-7890', registeredDate: '2025-06-15' },
  { id: 4, name: 'Michael Chen', email: 'michael.c@example.com', phone: '(555) 246-8135', registeredDate: '2025-06-12' },
  { id: 5, name: 'Olivia Davis', email: 'olivia.d@example.com', phone: '(555) 369-8521', registeredDate: '2025-06-10' },
];

// Mock Upcoming Appointments
export const upcomingAppointments = [
  { 
    id: 1, 
    patient: { id: 1, name: 'Emma Wilson', email: 'emma.wilson@example.com' },
    date: '2025-07-22',
    time: '09:00 AM',
    type: 'Check-up',
    status: 'Scheduled'
  },
  { 
    id: 2, 
    patient: { id: 3, name: 'Sarah Johnson', email: 's.johnson@example.com' },
    date: '2025-07-22',
    time: '11:30 AM',
    type: 'Follow-up',
    status: 'Scheduled'
  },
  { 
    id: 3, 
    patient: { id: 5, name: 'Olivia Davis', email: 'olivia.d@example.com' },
    date: '2025-07-23',
    time: '10:15 AM',
    type: 'Consultation',
    status: 'Scheduled'
  },
  { 
    id: 4, 
    patient: { id: 2, name: 'James Rodriguez', email: 'james.r@example.com' },
    date: '2025-07-23',
    time: '02:00 PM',
    type: 'Urgent Care',
    status: 'Scheduled'
  },
  { 
    id: 5, 
    patient: { id: 4, name: 'Michael Chen', email: 'michael.c@example.com' },
    date: '2025-07-24',
    time: '03:30 PM',
    type: 'Procedure',
    status: 'Scheduled'
  },
];