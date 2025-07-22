import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Syringe, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(null); // null | 'success' | 'error'
  const [forgotMessage, setForgotMessage] = useState('');
  const { login, forgotPassword, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      if (result.user && result.user.role === 'Doctor') {
        navigate('/doctor');
      } else if (result.user && result.user.role === 'Patient') {
        navigate('/patient');
      } else {
        navigate('/dashboard'); // fallback
      }
    }
    setLoading(false);
  };

  // Placeholder async function for password reset
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotStatus(null);
    setForgotMessage('');
    if (!forgotEmail) {
      setForgotStatus('error');
      setForgotMessage('Please enter your email address.');
      return;
    }
    try {
      const result = await forgotPassword(forgotEmail);
      if (result && result.success) {
        setForgotStatus('success');
        setForgotMessage(result.message || 'If this email is registered, a reset link has been sent.');
      } else {
        setForgotStatus('error');
        setForgotMessage((result && result.message) || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setForgotStatus('error');
      setForgotMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Faded Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <img
          src="/assets/Background Image.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
            <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg">
              <Syringe className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your DockSona account
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 border border-red-300 rounded px-4 py-2 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                className="ml-4 text-xs text-red-800 underline"
                onClick={clearError}
                type="button"
              >
                x
              </button>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline focus:outline-none"
                onClick={() => setShowForgot(v => !v)}
              >
                Forgot Password?
              </button>
            </div>
            {/* Forgot Password Form */}
            {showForgot && (
              <form className="mt-2 space-y-2" onSubmit={handleForgotPassword}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="input w-full pl-10"
                    placeholder="Enter your email for reset"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                >
                  Send Reset Link
                </button>
                {(forgotStatus && forgotMessage) && (
                  <div className={`text-sm ${forgotStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{forgotMessage}</div>
                )}
                {(forgotStatus === 'error' && !forgotMessage) && (
                  <div className="text-sm text-red-600">Something went wrong. Please try again.</div>
                )}
              </form>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center h-12 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Hospital Managment System © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 