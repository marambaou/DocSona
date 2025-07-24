const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', errorData);
      if (errorData.details) {
        throw new Error(`Validation failed: ${errorData.details.map(d => d.msg).join(', ')}`);
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Appointment APIs
export const appointmentAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/appointments?${queryString}`);
  },
  
  getUpcoming: () => apiCall('/appointments/upcoming'),
  
  getPast: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/appointments/past?${queryString}`);
  },
  
  getById: (id) => apiCall(`/appointments/${id}`),
  
  create: (appointmentData) => apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  }),
  
  reschedule: (id, rescheduleData) => apiCall(`/appointments/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(rescheduleData),
  }),
  
  cancel: (id, cancelData) => apiCall(`/appointments/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify(cancelData),
  }),
  
  getAvailableSlots: (date) => apiCall(`/appointments/available-slots?date=${date}`),
};

// // Doctor APIs (using mock data for now)
// export const doctorAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return apiCall(`/mock/doctors?${queryString}`);
//   },
  
//   getSpecialties: () => apiCall('/mock/doctors/specialties'),
  
//   getById: (id) => apiCall(`/mock/doctors/${id}`),
  
//   getMyDoctors: () => apiCall('/mock/doctors/my-doctors'),
// };

// // Notification APIs
// export const notificationAPI = {
//   getAll: (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return apiCall(`/notifications?${queryString}`);
//   },
  
//   getUnreadCount: () => apiCall('/notifications/unread-count'),
  
//   markAsRead: (id) => apiCall(`/notifications/${id}/read`, {
//     method: 'PUT',
//   }),
  
//   markAllAsRead: () => apiCall('/notifications/read-all', {
//     method: 'PUT',
//   }),
  
//   delete: (id) => apiCall(`/notifications/${id}`, {
//     method: 'DELETE',
//   }),
  
//   clearRead: () => apiCall('/notifications/clear-read', {
//     method: 'DELETE',
//   }),

//   // Mock data for testing
//   createSample: () => apiCall('/mock/notifications/sample', {
//     method: 'POST',
//   }),
// };

// // Message APIs
// export const messageAPI = {
//   getConversations: () => apiCall('/messages/conversations'),
  
//   getConversation: (doctorId, params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     return apiCall(`/messages/conversations/${doctorId}?${queryString}`);
//   },
  
//   sendMessage: (doctorId, messageData) => apiCall(`/messages/conversations/${doctorId}`, {
//     method: 'POST',
//     body: JSON.stringify(messageData),
//   }),
  
//   markAsRead: (id) => apiCall(`/messages/${id}/read`, {
//     method: 'PUT',
//   }),
  
//   markConversationAsRead: (doctorId) => apiCall(`/messages/conversations/${doctorId}/read-all`, {
//     method: 'PUT',
//   }),
  
//   getUnreadCount: () => apiCall('/messages/unread-count'),
  
//   delete: (id) => apiCall(`/messages/${id}`, {
//     method: 'DELETE',
//   }),

//   // Mock data for testing
//   createSample: () => apiCall('/mock/messages/sample', {
//     method: 'POST',
//   }),
// };

// export default {
//   auth: authAPI,
//   appointments: appointmentAPI,
//   doctors: doctorAPI,
//   notifications: notificationAPI,
//   messages: messageAPI,
// }; 