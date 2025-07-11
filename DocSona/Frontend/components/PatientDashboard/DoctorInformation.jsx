import React, { useState } from 'react';
import { FiUser, FiStar, FiMapPin, FiPhone, FiMail, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';

const DoctorInformation = () => {
  const [activeTab, setActiveTab] = useState('my-doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Mock data
  const myDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      reviews: 127,
      location: 'Medical Center A',
      phone: '+1 (555) 123-4567',
      email: 'dr.johnson@medicalcenter.com',
      image: 'https://via.placeholder.com/60',
      nextAppointment: '2024-01-15T10:00:00Z',
      experience: '15 years'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      rating: 4.6,
      reviews: 89,
      location: 'Medical Center B',
      phone: '+1 (555) 987-6543',
      email: 'dr.chen@medicalcenter.com',
      image: 'https://via.placeholder.com/60',
      nextAppointment: '2024-01-18T14:30:00Z',
      experience: '12 years'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'General Medicine',
      rating: 4.9,
      reviews: 203,
      location: 'Medical Center A',
      phone: '+1 (555) 456-7890',
      email: 'dr.davis@medicalcenter.com',
      image: 'https://via.placeholder.com/60',
      nextAppointment: '2024-01-22T09:15:00Z',
      experience: '18 years'
    }
  ];

  const allDoctors = [
    ...myDoctors,
    {
      id: 4,
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedics',
      rating: 4.7,
      reviews: 156,
      location: 'Medical Center C',
      phone: '+1 (555) 321-6540',
      email: 'dr.wilson@medicalcenter.com',
      image: 'https://via.placeholder.com/60',
      experience: '20 years'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Pediatrics',
      rating: 4.9,
      reviews: 234,
      location: 'Medical Center B',
      phone: '+1 (555) 789-0123',
      email: 'dr.thompson@medicalcenter.com',
      image: 'https://via.placeholder.com/60',
      experience: '14 years'
    }
  ];

  const specialties = ['all', 'Cardiology', 'Dermatology', 'General Medicine', 'Orthopedics', 'Pediatrics'];

  const filteredDoctors = allDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const renderDoctorCard = (doctor, showNextAppointment = false) => (
    <div key={doctor.id} className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start space-x-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(doctor.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {doctor.rating} ({doctor.reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">{doctor.experience} experience</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 mr-2" />
              {doctor.location}
            </div>
            {showNextAppointment && doctor.nextAppointment && (
              <div className="flex items-center text-sm text-blue-600">
                <FiCalendar className="w-4 h-4 mr-2" />
                Next: {new Date(doctor.nextAppointment).toLocaleDateString()} at{' '}
                {new Date(doctor.nextAppointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <a
              href={`tel:${doctor.phone}`}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FiPhone className="w-4 h-4 mr-1" />
              Call
            </a>
            <a
              href={`mailto:${doctor.email}`}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FiMail className="w-4 h-4 mr-1" />
              Email
            </a>
            <button className="flex items-center text-sm text-green-600 hover:text-green-800">
              <FiCalendar className="w-4 h-4 mr-1" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Doctor Information</h2>
            <p className="text-sm text-gray-500">Manage your doctors and find new ones</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-doctors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-doctors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Doctors ({myDoctors.length})
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Find Doctors
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'my-doctors' && (
            <div className="space-y-4">
              {myDoctors.length > 0 ? (
                myDoctors.map(doctor => renderDoctorCard(doctor, true))
              ) : (
                <div className="text-center py-8">
                  <FiUser className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No doctors yet</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium">
                    Find your first doctor
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search doctors by name or specialty..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doctor => renderDoctorCard(doctor))
                ) : (
                  <div className="text-center py-8">
                    <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No doctors found</p>
                    <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorInformation; 