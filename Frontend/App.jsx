import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Integrity from "./Landing-Page/integrity.jsx";
import Footer from "./Landing-Page/footer.jsx";
import Header from './Landing-Page/Header';
import HeroSection from './Landing-Page/HeroSection';
import AboutUsSection from './Landing-Page/AboutUsSection';
import SpecialtySection from './Landing-Page/Specialty';
import Reviews from './Landing-Page/reviews.jsx';



export default function App() {
  return (
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

        {/* Doctor Dashboard */}
        {/* <Route path="/doctor" element={<DashboardHome />} /> */}

        {/* Patient Dashboard */}
        {/* <Route path="/patient" element={<PatientHome />} /> */}
      </Routes>
    </Router>
  );
}
