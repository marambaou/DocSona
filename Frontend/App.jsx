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
import DoctorDashboard from './DoctorDashboard/pages/Dashboard';
import DoctorLayout from './DoctorDashboard/components/Layout';
import DoctorAppointments from './DoctorDashboard/pages/Appointments';
import DoctorPatients from './DoctorDashboard/pages/Patients';
import DoctorPrescriptions from './DoctorDashboard/pages/Prescriptions';
import DoctorAnalytics from './DoctorDashboard/pages/Analytics';
import DoctorSettings from './DoctorDashboard/pages/Settings';



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

          {/* Doctor Dashboard */}
          <Route path="/dashboard" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="analytics" element={<DoctorAnalytics />} />
            <Route path="settings" element={<DoctorSettings />} />
          </Route>
          
          {/* <Route path="/patient" element={<PatientHome />} /> */}
        </Routes>
          
          
      </Router>
    </AuthProvider>
  );
}
