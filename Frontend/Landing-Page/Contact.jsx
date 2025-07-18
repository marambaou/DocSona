import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTiktok, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope } from 'react-icons/fa';
import Footer from './footer';

const ContactSection = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [feedback, setFeedback] = useState('');
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setFeedback('');
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus('error');
      setFeedback('Please fill in all required fields.');
      return;
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFeedback('Message sent successfully!');
        setForm({ name: '', email: '', subject: '', phone: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.message || 'Failed to send message.');
      }
    } catch {
      setStatus('error');
      setFeedback('Failed to send message. Please try again later.');
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Faded Background Image */}
        <div className="fixed inset-0 w-full h-full z-0">
          <img
            src="/assets/Background Image.jpg"
            alt="Background"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        {/* Back to Home Button */}
        <div className="absolute top-8 left-8 z-20">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="max-w-4xl w-full flex flex-col lg:flex-row gap-10 relative z-10 bg-white rounded-xl shadow-lg p-8">
          {/* Left Section */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4">Contact Us</h2>
            <p className="mb-6 text-gray-600 leading-relaxed">
              Have questions or need assistance? Our team is here to help you with any inquiries about our hospital services, appointments, or support. Reach out and we'll get back to you as soon as possible.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mb-8">
              {[FaFacebookF, FaTiktok, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                <div key={i} className="text-blue-600 p-3 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300">
                  <Icon size={20} />
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <FaPhone className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-blue-600 font-semibold">Phone</p>
                <p>(+254) 0115040564</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <FaEnvelope className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-blue-600 font-semibold">Email</p>
                <p>marambaalphonce@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-[#1D3557]">
              Send Us a Message
            </h3>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="flex-1 bg-blue-50 text-[#1D3557] p-3 rounded-md outline-none border border-blue-100 focus:border-blue-400"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="flex-1 bg-blue-50 text-[#1D3557] p-3 rounded-md outline-none border border-blue-100 focus:border-blue-400"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="bg-blue-50 text-[#1D3557] p-3 rounded-md outline-none border border-blue-100 focus:border-blue-400"
                value={form.subject}
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number (optional)"
                className="bg-blue-50 text-[#1D3557] p-3 rounded-md outline-none border border-blue-100 focus:border-blue-400"
                value={form.phone}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="bg-blue-50 text-[#1D3557] p-3 rounded-md h-32 resize-none outline-none border border-blue-100 focus:border-blue-400"
                value={form.message}
                onChange={handleChange}
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow-lg transition-all duration-300"
              >
                Send Message
              </button>
              {status && (
                <div className={`text-sm mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback}</div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactSection;
