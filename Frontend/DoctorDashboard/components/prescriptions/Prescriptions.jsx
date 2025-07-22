import React, { useState, useEffect } from 'react';
import { prescriptionApi, patientApi } from  '/DoctorDashboard/services/api.js';
import PrescriptionForm from './PrescriptionForm';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all prescriptions
  const fetchPrescriptions = async () => {
    try {
      setIsLoading(true);
      const data = await prescriptionApi.getAll();
      setPrescriptions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all patients for prescription form
  const fetchPatients = async () => {
    try {
      const data = await patientApi.getAll();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients for prescription form.');
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  // Handle prescription creation
  const handleCreatePrescription = async (prescriptionData) => {
    try {
      setIsLoading(true);
      await prescriptionApi.create(prescriptionData);
      fetchPrescriptions();
      setShowForm(false);
      setCurrentPrescription(null);
    } catch (err) {
      console.error('Error creating prescription:', err);
      setError('Failed to create prescription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prescription update
  const handleUpdatePrescription = async (id, prescriptionData) => {
    try {
      setIsLoading(true);
      await prescriptionApi.update(id, prescriptionData);
      fetchPrescriptions();
      setShowForm(false);
      setCurrentPrescription(null);
    } catch (err) {
      console.error('Error updating prescription:', err);
      setError('Failed to update prescription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prescription deletion
  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await prescriptionApi.delete(id);
      fetchPrescriptions();
    } catch (err) {
      console.error('Error deleting prescription:', err);
      setError('Failed to delete prescription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit form for a prescription
  const handleEditPrescription = (prescription) => {
    setCurrentPrescription(prescription);
    setShowForm(true);
  };

  // Filter prescriptions based on search term
  const filteredPrescriptions = prescriptions.filter(prescription => 
    prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.medication?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
        <button 
          onClick={() => { setShowForm(true); setCurrentPrescription(null); }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Prescription
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}

      {/* Prescription Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentPrescription ? 'Edit Prescription' : 'Add New Prescription'}
              </h3>
              <button 
                onClick={() => { setShowForm(false); setCurrentPrescription(null); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PrescriptionForm 
              prescription={currentPrescription}
              patients={patients}
              onSubmit={currentPrescription ? 
                (data) => handleUpdatePrescription(currentPrescription._id, data) : 
                handleCreatePrescription
              }
              onCancel={() => { setShowForm(false); setCurrentPrescription(null); }}
            />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search by patient or medication..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading prescriptions...</p>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No prescriptions match your search.' : 'No prescriptions found. Add a prescription to get started.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medication
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dosage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Prescribed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prescription.medication}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {prescription.dosage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(prescription.datePrescribed)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(prescription.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPrescription(prescription)}
                        className="text-blue-600 hover:text-blue-800 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePrescription(prescription._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;