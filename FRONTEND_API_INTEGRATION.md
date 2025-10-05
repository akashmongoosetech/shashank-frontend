# Doctor Derma Frontend - API Integration

Note: Supabase has been removed from this frontend. The project now uses the backend API (`VITE_API_URL`). If you previously installed Supabase packages, run the cleanup steps below.

Cleanup steps (optional):

1. From the `project/` folder run:

```bash
npm uninstall @supabase/supabase-js @supabase/auth-js @supabase/storage-js
rm -f package-lock.json
npm install
```

This removes Supabase packages and regenerates the lockfile. If you prefer not to delete `package-lock.json`, just run `npm uninstall @supabase/supabase-js`.


## Overview

The frontend now includes full API integration with environment configuration for the Doctor Derma Clinic backend. All forms and data operations are connected to the backend API with proper error handling and loading states.

## Features

### 🔌 **API Service Integration**
- **Centralized API Service**: All API calls managed through `apiService.ts`
- **TypeScript Types**: Full type safety for all API requests and responses
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Visual feedback during API operations
- **Timeout Configuration**: Configurable request timeouts

### 🌍 **Environment Configuration**
- **Environment Variables**: All configuration through `.env` files
- **Development/Production**: Different settings for different environments
- **Validation**: Environment variable validation on startup
- **Fallback Values**: Default values when environment variables are missing

### 📱 **Form Integration**
- **Contact Form**: Integrated with backend contact API
- **Appointment Booking**: Integrated with backend appointment API
- **Dynamic Data**: Treatment types and time slots loaded from API
- **Real-time Validation**: Client-side validation with server-side backup

## Environment Variables

### Frontend Environment (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Doctor Derma Clinic
VITE_APP_VERSION=1.0.0

# Contact Information
VITE_CLINIC_NAME=Doctor Derma Clinic
VITE_CLINIC_EMAIL=info@doctorderma.com
VITE_CLINIC_PHONE=+1 (555) 123-4567
VITE_CLINIC_ADDRESS=123 Medical Plaza, Health District, City 12345

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=1234567890
VITE_WHATSAPP_MESSAGE=Hello, I would like to book an appointment

# Google Maps (if needed)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Development
VITE_NODE_ENV=development
```

## API Service Usage

### Contact API

```typescript
import { createContact, getContacts, updateContact } from '../services/apiService';

// Create contact
const response = await createContact({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'I have a question...'
});

// Get contacts with pagination
const contacts = await getContacts({
  page: 1,
  limit: 10,
  status: 'new',
  search: 'john'
});

// Update contact
const updated = await updateContact(contactId, {
  status: 'read',
  priority: 'high'
});
```

### Appointment API

```typescript
import { createAppointment, getAppointments, confirmAppointment } from '../services/apiService';

// Create appointment
const response = await createAppointment({
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1 (555) 123-4567',
  treatmentType: 'Acne Treatment',
  preferredDate: '2024-01-20',
  preferredTime: '10:00 AM',
  message: 'I have sensitive skin...'
});

// Get appointments with filtering
const appointments = await getAppointments({
  page: 1,
  limit: 10,
  status: 'pending',
  treatmentType: 'Acne Treatment',
  dateFrom: '2024-01-01',
  dateTo: '2024-01-31'
});

// Confirm appointment
const confirmed = await confirmAppointment(appointmentId, {
  confirmedDate: '2024-01-20',
  confirmedTime: '10:00 AM',
  notes: 'Confirmed appointment'
});
```

## Form Components

### Contact Form
- **API Integration**: Uses `createContact` API
- **Loading State**: Shows "Sending..." during submission
- **Error Handling**: Displays user-friendly error messages
- **Success Feedback**: Shows success message after submission
- **Form Reset**: Clears form after successful submission

### Appointment Form
- **Dynamic Data**: Loads treatment types and time slots from API
- **API Integration**: Uses `createAppointment` API
- **Loading State**: Shows "Submitting..." during submission
- **Error Handling**: Comprehensive error handling
- **Fallback Data**: Uses default values if API fails

### WhatsApp Button
- **Environment Config**: Uses environment variables for phone and message
- **Customizable**: Easy to change WhatsApp number and message

## Configuration Management

### Environment Configuration

```typescript
import config from '../config/environment';

// Access configuration
console.log(config.apiUrl); // http://localhost:5000
console.log(config.clinicName); // Doctor Derma Clinic
console.log(config.whatsappNumber); // 1234567890

// Validation
import { validateConfig } from '../config/environment';
const isValid = validateConfig();
```

### API Service Configuration

```typescript
// API service automatically uses environment variables
const apiService = new ApiService();

// Custom configuration
apiService.baseURL = 'https://api.example.com';
apiService.timeout = 15000;
```

## Error Handling

### API Error Handling

```typescript
try {
  const response = await createContact(formData);
  
  if (response.success) {
    // Handle success
    console.log('Contact created:', response.data);
  } else {
    // Handle API error
    console.error('API Error:', response.message);
    alert('Failed to send message. Please try again later.');
  }
} catch (error) {
  // Handle network/connection error
  console.error('Network Error:', error);
  alert('Connection failed. Please check your internet connection.');
}
```

### Form Error Handling

```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return; // Client-side validation failed
  }
  
  setIsSubmitting(true);
  
  try {
    const response = await createContact(formData);
    
    if (response.success) {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      alert('Failed to send message. Please try again later.');
    }
  } catch (error) {
    alert('Connection failed. Please check your internet connection.');
  } finally {
    setIsSubmitting(false);
  }
};
```

## Setup Instructions

### 1. Environment Setup

```bash
# Copy environment template
cp project/env.example project/.env

# Edit configuration
nano project/.env
```

### 2. Install Dependencies

```bash
cd project
npm install
```

### 3. Start Development

```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
cd ../backend
npm run dev
```

### 4. Configuration

Update `project/.env` with your settings:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=your-whatsapp-number
VITE_WHATSAPP_MESSAGE=Hello, I would like to book an appointment

# Clinic Information
VITE_CLINIC_NAME=Your Clinic Name
VITE_CLINIC_EMAIL=your-email@clinic.com
VITE_CLINIC_PHONE=+1 (555) 123-4567
VITE_CLINIC_ADDRESS=Your Clinic Address
```

## Production Deployment

### Environment Variables

For production, set these environment variables:

```bash
# Production API URL
VITE_API_URL=https://api.yourclinic.com

# Production settings
VITE_NODE_ENV=production

# Real clinic information
VITE_CLINIC_NAME=Your Real Clinic Name
VITE_CLINIC_EMAIL=info@yourclinic.com
VITE_CLINIC_PHONE=+1 (555) 123-4567
VITE_CLINIC_ADDRESS=123 Medical Plaza, Your City, State 12345
```

### Build Process

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### ✅ **Completed Integration**
- Contact form API integration
- Appointment booking API integration
- Environment variable configuration
- Error handling and loading states
- WhatsApp button configuration
- Dynamic treatment data loading
- TypeScript type safety
- Form validation and feedback

### 🔄 **API Features**
- Automatic retry on network errors
- Request timeout handling
- Loading state management
- Error message display
- Success feedback
- Form reset after submission

### 🛡️ **Security Features**
- Environment variable validation
- Input sanitization
- Error message sanitization
- CORS configuration
- Rate limiting (backend)

The frontend is now fully integrated with the backend API and ready for production use with proper environment configuration and error handling.
