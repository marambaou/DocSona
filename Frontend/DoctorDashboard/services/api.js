// Base URL for API requests
const API_URL = 'http://localhost:5000/api';

// Helper function for handling fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to get error message from the response
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || `HTTP error ${response.status}`;
    } catch (e) {
      errorMessage = `HTTP error ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
};

// Common request headers
const headers = {
  'Content-Type': 'application/json',
};

// API for Patient operations
export const patientApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/patients`, { headers });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/patients/${id}`, { headers });
    return handleResponse(response);
  },
  
  create: async (patientData) => {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers,
      body: JSON.stringify(patientData),
    });
    return handleResponse(response);
  },
  
  update: async (id, patientData) => {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(patientData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(response);
  },
};

// API for Appointment operations
export const appointmentApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/appointments`, { headers });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, { headers });
    return handleResponse(response);
  },
  
  create: async (appointmentData) => {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },
  
  update: async (id, appointmentData) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(response);
  },

  // Get appointments for a specific patient
  getByPatientId: async (patientId) => {
    const response = await fetch(`${API_URL}/appointments/patient/${patientId}`, { headers });
    return handleResponse(response);
  },

  // Get upcoming appointments (today and future)
  getUpcoming: async () => {
    const response = await fetch(`${API_URL}/appointments/upcoming`, { headers });
    return handleResponse(response);
  },
};

// API for Prescription operations
export const prescriptionApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/prescriptions`, { headers });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/prescriptions/${id}`, { headers });
    return handleResponse(response);
  },
  
  create: async (prescriptionData) => {
    const response = await fetch(`${API_URL}/prescriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify(prescriptionData),
    });
    return handleResponse(response);
  },
  
  update: async (id, prescriptionData) => {
    const response = await fetch(`${API_URL}/prescriptions/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(prescriptionData),
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/prescriptions/${id}`, {
      method: 'DELETE',
      headers,
    });
    return handleResponse(response);
  },

  // Get prescriptions for a specific patient
  getByPatientId: async (patientId) => {
    const response = await fetch(`${API_URL}/prescriptions/patient/${patientId}`, { headers });
    return handleResponse(response);
  },
};

// API for Dashboard statistics
export const dashboardApi = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, { headers });
    return handleResponse(response);
  },
  
  getAppointmentsByDate: async (start, end) => {
    const response = await fetch(`${API_URL}/dashboard/appointments-by-date?start=${start}&end=${end}`, { headers });
    return handleResponse(response);
  },
  
  getPatientGrowth: async (months) => {
    const response = await fetch(`${API_URL}/dashboard/patient-growth?months=${months}`, { headers });
    return handleResponse(response);
  },

  getPrescriptionStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/prescription-stats`, { headers });
    return handleResponse(response);
  },
};

// Export a default object with all APIs
export default {
  patient: patientApi,
  appointment: appointmentApi,
  prescription: prescriptionApi,
  dashboard: dashboardApi
};