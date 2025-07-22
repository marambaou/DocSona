import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Integrity from "./Landing-Page/integrity.jsx";
import Footer from "./Landing-Page/footer.jsx";
import Header from './Landing-Page/Header';
import HeroSection from './Landing-Page/HeroSection';
import AboutUsSection from './Landing-Page/AboutUsSection';
import SpecialtySection from './Landing-Page/Specialty';
import Reviews from './Landing-Page/reviews.jsx';
import Login from './Landing-Page/Login';
import Register from './Landing-Page/Register';
import ContactSection from './Landing-Page/Contact';

//DoctorDashboardImports
import DoctorDashboard from './DoctorDashboard/components/Dashboard';
import DashboardHeader from './DoctorDashboard/components/Header';
import Sidebar from './DoctorDashboard/components/Sidebar';
import Dashboard from './DoctorDashboard/components/Dashboard';
import Patients from './DoctorDashboard/components/patients/Patients';
import Appointments from './DoctorDashboard/components/appointments/Appointments';
import Prescriptions from './DoctorDashboard/components/prescriptions/Prescriptions';
import Settings from './DoctorDashboard/components/settings/Settings';

import PatientDashboard from './PatientDashboard/PatientDashboard';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={
            <>
              <Header />
              <HeroSection />
              <AboutUsSection />
              <SpecialtySection />
              <Integrity />
              <Reviews />
              <Footer />
            </>
          } />

          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Register route */}
          <Route path="/register" element={<Register />} />

          {/* Contact route */}
          <Route path="/contact" element={<ContactSection />} />

          {/* Patient Dashboard */}
          <Route path="/patient" element={<PatientDashboard />} />

                  // ...existing code...
          {/* Doctor Dashboard main */}
          <Route path="/doctor" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <DashboardHeader />
                <Dashboard />
              </div>
            </div>
          } />

          {/* Doctor Dashboard sub-pages */}
          <Route path="/doctor/patients" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <DashboardHeader />
                <Patients />
              </div>
            </div>
          } />
          <Route path="/doctor/appointments" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <DashboardHeader />
                <Appointments />
              </div>
            </div>
          } />
          <Route path="/doctor/prescriptions" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <DashboardHeader />
                <Prescriptions />
              </div>
            </div>
          } />
          <Route path="/doctor/settings" element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <DashboardHeader />
                <Settings />
              </div>
            </div>
          } />
          // ...existing code...
          
          {/* <Route path="/patient" element={<PatientHome />} /> */}
        </Routes>
          
          
      </Router>
    </AuthProvider>
  );
}
