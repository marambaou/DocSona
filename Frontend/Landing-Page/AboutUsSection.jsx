import React from 'react';

import doctorImage from '../assets/aboutpicture.jpg';
import { useState } from "react";

const AboutUsSection = () => {
 const [showModal, setShowModal] = useState(false);

     
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
 {/* form validation */}
    const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to send');

    console.log('Message sent:', data.message);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTimeout(() => setShowModal(false), 2000);
  } catch (err) {
    setErrors({ form: err.message });
    console.error(err.message);
  
}

  };

  return (
    <section className="py-20 px-6 md:px-14 bg-white">
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
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition">
            Contact Us
          </button>
        </div>
      </div>
      {/* Modal for contact form*/}
      {showModal && (
        <div className="fixed inset-0 bg-[#757575] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-[#234A6B] mb-4">Contact Us</h2>

 {/* form*/}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

                <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 p-2 rounded"
                 value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 p-2 rounded"
                 value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
               </div>

               <div>
              <textarea
                placeholder="Your Message"
                className="w-full border border-gray-300 p-2 rounded h-24"
                 value={formData.message}
      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
 {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
             </div>

               {isSubmitted && (
    <p className="text-green-600 text-sm">Message sent! We'll get back to you soon.</p>
  )}
              <button
                type="submit"
                className="bg-[#0086FF] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>


          </div>
        </div>

   )}

    </section>
  );
};

export default AboutUsSection;
