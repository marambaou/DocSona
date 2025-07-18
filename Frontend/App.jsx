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
          
          {/* <Route path="/patient" element={<PatientHome />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}
