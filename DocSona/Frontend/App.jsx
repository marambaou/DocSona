import './App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Integrity from "./Landing-Page/integrity.jsx";
import Footer from "./Landing-Page/footer.jsx";
import Header from './Landing-Page/Header';
import HeroSection from './Landing-Page/HeroSection';
import AboutUsSection from './Landing-Page/AboutUsSection';
import SpecialtySection from './Landing-Page/Specialty';
import Reviews from './Landing-Page/reviews.jsx';
import PatientDashboard from './components/PatientDashboard/PatientDashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    
    setLoading(false);
  }, []);

  const handleLoginSuccess = (response) => {
    setIsAuthenticated(true);
    setUser(response.patient);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowLogin(true);
  };

  const handleRegisterSuccess = (response) => {
    // After successful registration, show login
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Patient Dashboard with Authentication */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <PatientDashboard onLogout={handleLogout} user={user} />
            ) : (
              <>
                <Header />
                <HeroSection />
                <AboutUsSection />
                <SpecialtySection />
                <Integrity />
                <Reviews />
                <Footer />
              </>
            )
          } 
        />

        {/* Landing Page (optional, can redirect to /) */}
        <Route path="/landing" element={
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

        {/* Patient Dashboard */}
        <Route 
          path="/patient" 
          element={
            isAuthenticated ? (
              <PatientDashboard onLogout={handleLogout} user={user} />
            ) : (
              <>
                <Header />
                <HeroSection />
                <AboutUsSection />
                <SpecialtySection />
                <Integrity />
                <Reviews />
                <Footer />
              </>
            )
          } 
        />
      </Routes>
    </Router>
  );
}
