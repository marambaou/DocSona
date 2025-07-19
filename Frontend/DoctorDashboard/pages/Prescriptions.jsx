import React, { useState } from 'react';
import useSWR from 'swr';
import { 
  FileText, 
  User, 
  Calendar,
  Plus,
  Search,
  Pill
} from 'lucide-react';
import { prescriptionService } from '../services/api';

const Prescriptions = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data: prescriptions } = useSWR(
    `/prescriptions?page=${page}&search=${search}`,
    () => prescriptionService.getAll({ page, search })
  );

  if (!prescriptions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const prescriptionsData = prescriptions.data.prescriptions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptionsData.map((prescription) => (
          <div key={prescription._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{prescription.patient?.name}</h3>
                    <p className="text-sm text-gray-500">{prescription.patient?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Diagnosis</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{prescription.diagnosis}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Medications</h4>
                    <div className="space-y-2">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="flex items-start space-x-2 bg-gray-50 p-3 rounded-lg">
                          <Pill className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-800">{medication.name}</div>
                            <div className="text-xs text-gray-500">
                              {medication.dosage} - {medication.frequency} for {medication.duration}
                            </div>
                            {medication.instructions && (
                              <div className="text-xs text-gray-500 mt-1">{medication.instructions}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{prescription.instructions}</p>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                </div>
                {prescription.followUpDate && (
                  <div className="text-xs text-blue-600 mt-1">
                    Follow-up: {new Date(prescription.followUpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {prescriptions.data.prescriptions.length} of {prescriptions.data.total} prescriptions
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {prescriptions.data.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === prescriptions.data.totalPages}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;