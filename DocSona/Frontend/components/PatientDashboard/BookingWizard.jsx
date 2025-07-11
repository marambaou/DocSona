import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiUser, FiCalendar, FiClock, FiCheck, FiLoader } from 'react-icons/fi';
import { doctorAPI, appointmentAPI } from '../../services/api';

const BookingWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctor: null,
    date: '',
    time: '',
    reason: '',
    symptoms: []
  });
  
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpecialties();
  }, []);

  useEffect(() => {
    if (bookingData.specialty) {
      loadDoctors(bookingData.specialty);
    }
  }, [bookingData.specialty]);

  useEffect(() => {
    if (bookingData.date) {
      loadAvailableSlots(bookingData.date);
    }
  }, [bookingData.date]);

  const loadSpecialties = async () => {
    try {
      const response = await doctorAPI.getSpecialties();
      setSpecialties(response.specialties || []);
    } catch (err) {
      console.error('Error loading specialties:', err);
      setError('Failed to load specialties');
    }
  };

  const loadDoctors = async (specialty) => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorAPI.getAll({ specialty });
      setDoctors(response.doctors || []);
    } catch (err) {
      console.error('Error loading doctors:', err);
      setError('Failed to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (date) => {
    try {
      setError(null);
      console.log('Loading time slots for date:', date);
      const response = await appointmentAPI.getAvailableSlots(date);
      console.log('Time slots response:', response);
      setTimeSlots(response.slots || []);
    } catch (err) {
      console.error('Error loading time slots:', err);
      setTimeSlots([]);
      setError('Failed to load available time slots. Please try again.');
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const appointmentData = {
        doctorId: bookingData.doctor._id,
        doctorInfo: {
          name: `${bookingData.doctor.firstName} ${bookingData.doctor.lastName}`,
          specialty: bookingData.specialty,
          practice: bookingData.doctor.practice?.name || 'Medical Center'
        },
        date: bookingData.date,
        time: bookingData.time,
        reason: bookingData.reason,
        symptoms: bookingData.symptoms,
        location: bookingData.doctor.practice?.address?.street || 'Main Clinic'
      };

      const response = await appointmentAPI.create(appointmentData);
      
      console.log('Appointment created:', response);
      
      // Close the wizard
      onClose();
      
      // Optionally refresh the appointments list
      // You could pass a callback to refresh the parent component
      
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Specialty</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="w-6 h-6 text-blue-600 animate-spin mr-2" />
            <span>Loading specialties...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialties.map((specialty, index) => (
              <button
                key={`specialty-${index}`}
                onClick={() => setBookingData({ ...bookingData, specialty })}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  bookingData.specialty === specialty
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-medium text-gray-900">{specialty}</h4>
                <p className="text-sm text-gray-500">Find doctors in this specialty</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <FiLoader className="w-6 h-6 text-blue-600 animate-spin mr-2" />
            <span>Loading doctors...</span>
          </div>
        ) : doctors.length > 0 ? (
          <div className="space-y-4">
            {doctors.map((doctor, index) => (
              <button
                key={doctor._id || `doctor-${index}`}
                onClick={() => setBookingData({ ...bookingData, doctor })}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  bookingData.doctor?._id === doctor._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{`${doctor.firstName} ${doctor.lastName}`}</h4>
                    <p className="text-sm text-gray-500">{bookingData.specialty}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-600">
                        ⭐ {typeof doctor.rating === 'object' ? doctor.rating.average || 'N/A' : doctor.rating || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({doctor.experience || 'N/A'} experience)</span>
                    </div>
                  </div>
                  {bookingData.doctor?._id === doctor._id && (
                    <FiCheck className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No doctors available for this specialty</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <select
              value={bookingData.time}
              onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!bookingData.date}
            >
              <option value="">
                {!bookingData.date ? 'Select a date first' : 
                 timeSlots.length === 0 ? 'No available slots' : 'Select a time'}
              </option>
              {timeSlots.map((time, index) => (
                <option key={`time-${index}`} value={time}>{time}</option>
              ))}
            </select>
            {bookingData.date && timeSlots.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">Loading available time slots...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Doctor:</span>
            <span className="font-medium">{bookingData.doctor ? `${bookingData.doctor.firstName} ${bookingData.doctor.lastName}` : ''}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Specialty:</span>
            <span className="font-medium">{bookingData.specialty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{bookingData.time}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
          <textarea
            value={bookingData.reason}
            onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
            rows={3}
            placeholder="Please describe your symptoms or reason for the appointment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: 'Specialty', icon: FiUser },
    { number: 2, title: 'Doctor', icon: FiUser },
    { number: 3, title: 'Schedule', icon: FiCalendar },
    { number: 4, title: 'Confirm', icon: FiCheck }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 1: return bookingData.specialty;
      case 2: return bookingData.doctor;
      case 3: return bookingData.date && bookingData.time;
      case 4: return bookingData.reason;
      default: return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="mt-6 flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <FiCheck className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            
            {currentStep === 4 ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm Booking
                <FiCheck className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <FiArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard; 