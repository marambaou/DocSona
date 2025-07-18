import React from 'react';
import { Link } from 'react-router-dom';
import doctorImage from '../assets/aboutpicture.jpg';

const AboutUsSection = () => {
  return (
    <section id="about" className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <div>
          <img
            src={doctorImage}
            alt="Doctors discussing"
            className="max-w-[547px] max-h-[422px] rounded-3xl shadow-lg w-200 h-300"
          />
        </div>

        {/* Right: Text Content */}
        <div>
          <p className="text-blue-600 font-semibold mb-2">About Us</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D3557] leading-snug mb-4">
            World-Class Preventive, <br className="hidden md:block" />
            Prescriptive & Curative <br className="hidden md:block" />
            Medical Practices
          </h2>
          <p className="text-gray-600 mb-6">
            Being in the healthcare sector, we consider it our paradigm duty to ensure
            safety of our patients, effectiveness of our treatments, transparency in our
            practices, and absolute timely care.
          </p>
          <Link to="/contact" className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
