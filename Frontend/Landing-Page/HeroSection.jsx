import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/femaleDoctor-removebg.png';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-16 pt-32 pb-16 bg-gradient-to-br from-blue-100 via-purple-100 to-white">
      {/* Left Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] leading-tight">
          Making healthcare easier, smarter, and accessible.
        </h1>
        <p className="text-gray-600 mt-6 text-base md:text-lg">
          DocSona is your digital medical companion, built to streamline patient-doctor interaction and bring your medical history to your fingertips.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-block bg-[#1D4ED8] text-white px-6 py-3 rounded-full text-sm font-medium bg-sky-500 hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Right Image Section */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={heroImage}
          alt="Doctor Illustration"
          className="w-full max-w-md object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;
