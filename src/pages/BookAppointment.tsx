import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import { createAppointment, getTreatments } from '../services/apiService';

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    treatmentType: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [treatmentTypes, setTreatmentTypes] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Load treatments and time slots on component mount
  useEffect(() => {
    const loadTreatments = async () => {
      try {
        const response = await getTreatments();
        if (response.success && response.data) {
          setTreatmentTypes(response.data.treatments);
          setTimeSlots(response.data.timeSlots);
        }
      } catch (error) {
        console.error('Failed to load treatments:', error);
        // Fallback to default values
        setTreatmentTypes([
          'Acne Treatment',
          'Anti-Aging Treatment',
          'Chemical Peels',
          'Pigmentation Treatment',
          'Hair Transplant',
          'PRP Hair Therapy',
          'Hair Loss Treatment',
          'Scalp Treatment',
          'Laser Hair Removal',
          'Laser Skin Resurfacing',
          'Laser Tattoo Removal',
          'Laser Pigmentation Removal',
          'General Consultation',
        ]);
        setTimeSlots([
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '12:00 PM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM',
          '5:00 PM',
          '6:00 PM',
        ]);
      }
    };
    loadTreatments();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.treatmentType) {
      newErrors.treatmentType = 'Please select a treatment type';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Please select a date';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'Date cannot be in the past';
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createAppointment(formData);

      if (response.success) {
        setIsSubmitted(true);
        setIsSubmitting(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          treatmentType: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
        });
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('appointmentUpdated'));
      } else {
        console.error('Appointment booking failed:', response.message);
        alert('Failed to book appointment. Please try again later.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Handle validation errors specifically
      const err = error as Error & { status?: number; payload?: unknown };
      if (err.status === 400 && err.payload) {
        const payload = err.payload as { success: boolean; message: string; errors: Array<{ msg: string; param: string; value: any }> };
        if (payload.errors && payload.errors.length > 0) {
          // Show specific validation errors
          const errorMessages = payload.errors.map(error => `${error.param}: ${error.msg}`).join('\n');
          alert(`Please fix the following errors:\n\n${errorMessages}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Show user-friendly error message for other errors
      const errorMessage = err.status === 400 
        ? 'Please check your form data and try again.'
        : err.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : err.status === 500
        ? 'Server error. Please try again later.'
        : 'Failed to book appointment. Please try again later.';
        
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Requested!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for booking an appointment with Doctor Derma. We have received your request and
            will contact you shortly to confirm your appointment.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Book Another Appointment
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Book Your Appointment</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Take the first step towards healthier skin. Schedule your consultation today!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="flex items-center text-gray-700 font-semibold mb-2">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center text-gray-700 font-semibold mb-2">
                    <Mail className="w-5 h-5 mr-2 text-blue-600" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="flex items-center text-gray-700 font-semibold mb-2">
                    <Phone className="w-5 h-5 mr-2 text-blue-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="treatmentType" className="flex items-center text-gray-700 font-semibold mb-2">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Treatment Type *
                  </label>
                  <select
                    id="treatmentType"
                    name="treatmentType"
                    value={formData.treatmentType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.treatmentType ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  >
                    <option value="">Select a treatment</option>
                    {treatmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.treatmentType && <p className="text-red-500 text-sm mt-1">{errors.treatmentType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="flex items-center text-gray-700 font-semibold mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border ${
                      errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-sm mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label htmlFor="preferredTime" className="flex items-center text-gray-700 font-semibold mb-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Preferred Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.preferredTime ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && <p className="text-red-500 text-sm mt-1">{errors.preferredTime}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="flex items-center text-gray-700 font-semibold mb-2">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us more about your concerns or questions..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Book Appointment'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                * Required fields. We will contact you within 24 hours to confirm your appointment.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
