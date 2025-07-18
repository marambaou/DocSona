import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="w-full flex items-center justify-between px-8 py-6 absolute top-0 left-0 z-50 bg-white bg-opacity-90">
      {/* Logo */}
      <div className="text-2xl font-semibold text-[#1D3557] tracking-wide">
        DocSona
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 text-[#1D3557] font-normal text-base">
        <a href="#about" className="hover:text-blue-600 transition">About</a>
        <a href="#services" className="hover:text-blue-600 transition">Services</a>
        <Link to="/Contact" className="hover:text-blue-600 transition">Contact</Link>
      </nav>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-4">
        <Link
          to="/login"
          className="text-[#1D4ED8] border border-[#1D4ED8] px-6 py-2 rounded-full text-sm font-medium bg-white hover:bg-blue-50 hover:text-blue-700 transition shadow-sm"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="bg-[#1D4ED8] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-[#1D3557] mb-1 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#1D3557] mb-1 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#1D3557] transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl flex flex-col items-center py-4 md:hidden animate-fade-in z-50">
          <a href="#about" className="py-2 px-4 w-full text-center text-[#1D3557] hover:bg-blue-50" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" className="py-2 px-4 w-full text-center text-[#1D3557] hover:bg-blue-50" onClick={() => setMenuOpen(false)}>Services</a>
          <Link to="/contact" className="py-2 px-4 w-full text-center text-[#1D3557] hover:bg-blue-50" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="border-t w-3/4 my-2" />
          <Link
            to="/login"
            className="py-2 px-4 w-full text-center text-[#1D4ED8] border border-[#1D4ED8] rounded-full text-sm font-medium bg-white hover:bg-blue-50 hover:text-blue-700 transition shadow-sm mb-2"
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="py-2 px-4 w-full text-center bg-[#1D4ED8] text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
