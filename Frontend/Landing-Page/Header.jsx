import React from 'react';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between px-8 py-6 absolute top-0 left-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-semibold text-[#1D3557] tracking-wide">
        DocSona
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-8 text-[#1D3557] font-normal text-base">
        <a href="#" className="hover:text-blue-600 transition">Home</a>
        <a href="#" className="hover:text-blue-600 transition">About</a>
        <a href="#" className="hover:text-blue-600 transition">Services</a>
        <a href="#" className="hover:text-blue-600 transition">Contact</a>
      </nav>

      {/* Get Started Button */}
      <button className="hidden md:block bg-[#1D4ED8] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
        Get Started
      </button>
    </header>
  );
};

export default Header;
