// Environment Configuration
export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Bhargava Clinic Clinic',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Clinic Information
  clinicName: import.meta.env.VITE_CLINIC_NAME || 'Bhargava Clinic Clinic',
  clinicEmail: import.meta.env.VITE_CLINIC_EMAIL || 'info@doctorderma.com',
  clinicPhone: import.meta.env.VITE_CLINIC_PHONE || '+1 (555) 123-4567',
  clinicAddress: import.meta.env.VITE_CLINIC_ADDRESS || '123 Medical Plaza, Health District, City 12345',

  // WhatsApp Configuration
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890',
  whatsappMessage: import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello, I would like to book an appointment',

  // Google Maps
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredVars = [
    'VITE_API_URL',
    'VITE_CLINIC_NAME',
    'VITE_CLINIC_EMAIL',
    'VITE_CLINIC_PHONE',
  ];

  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Using default values. Please check your .env file.');
    console.warn('For production deployment, ensure all required variables are set.');
  }

  return missingVars.length === 0;
};

// Initialize validation on import
if (typeof window !== 'undefined') {
  validateConfig();
}

// Export default config
export default config;
