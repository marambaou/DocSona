# DocSona Patient Dashboard Backend

This is the backend API for the patient dashboard functionality of the DocSona healthcare platform.

## Features

### Patient Management
- Patient registration and authentication
- Profile management and updates
- Password change functionality

### Appointment Management
- Book new appointments
- View upcoming and past appointments
- Reschedule appointments
- Cancel appointments
- Get available time slots

### Notifications
- View all notifications
- Mark notifications as read
- Get unread notification count
- Delete notifications

### Messaging
- Send messages to doctors
- View conversation history
- Mark messages as read
- Get unread message count

### Mock Data
- Mock doctors data for frontend development
- Available specialties
- Doctor details and reviews

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new patient
- `POST /api/auth/login` - Patient login
- `GET /api/auth/me` - Get current patient profile
- `PUT /api/auth/profile` - Update patient profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/upcoming` - Get upcoming appointments
- `GET /api/appointments/past` - Get past appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/:id` - Get specific appointment
- `PUT /api/appointments/:id/reschedule` - Reschedule appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/clear-read` - Clear read notifications

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/:doctorId` - Get conversation with doctor
- `POST /api/messages/conversations/:doctorId` - Send message
- `PUT /api/messages/:id/read` - Mark message as read
- `PUT /api/messages/conversations/:doctorId/read-all` - Mark all messages as read
- `GET /api/messages/unread-count` - Get unread count
- `DELETE /api/messages/:id` - Delete message

### Mock Data (for frontend development)
- `GET /api/mock/doctors` - Get mock doctors
- `GET /api/mock/doctors/specialties` - Get available specialties
- `GET /api/mock/doctors/:id` - Get specific doctor details

## Database Models

### Patient
- Personal information (name, email, phone, etc.)
- Address and emergency contact
- Medical history
- Insurance information
- Notification preferences

### Appointment
- Patient and doctor information
- Date, time, and duration
- Status and type
- Medical information (reason, symptoms, notes)
- Payment and insurance details

### Notification
- Patient recipient
- Type and priority
- Message content
- Related data (appointment, doctor, message)
- Delivery status

### Message
- Patient-doctor conversation
- Message content and type
- Read/delivered status
- Related appointment
- Reply functionality

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env` file with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/docsona
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   ```

3. Start the server:
   ```bash
   pnpm start
   ```

## Development

- The server runs on port 5000 by default
- MongoDB connection is required
- JWT authentication is used for protected routes
- All responses are in JSON format
- Error handling includes validation and proper HTTP status codes

## Notes

- This backend focuses only on patient functionality
- Doctor management is handled by other team members
- Mock data is provided for frontend development
- The system is designed to be easily integrated with other team members' work 