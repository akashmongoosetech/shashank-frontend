import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle, CalendarDays, Clock3, Star } from 'lucide-react';
import { createAppointment, getTreatments } from '../services/apiService';
import PageBanner from '../components/PageBanner';

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

  const stats = [
    { value: '24/7', label: 'Booking Available', icon: CalendarDays },
    { value: '< 1hr', label: 'Confirmation Time', icon: Clock3 },
    { value: '4.9/5', label: 'Patient Rating', icon: Star },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Requested!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for booking an appointment with Bhargava Clinic. We have received your request and
            will contact you shortly to confirm your appointment.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
          >
            Book Another Appointment
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Book Your Appointment"
        subtitle="Take the first step towards healthier skin. Schedule your consultation today!"
        icon={Calendar}
        gradient="from-emerald-600 via-teal-600 to-cyan-600"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Book Appointment' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="section-padding bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              Schedule Your <span className="text-gradient">Consultation</span>
            </h2>
            <p className="section-subtitle">
              Fill out the form below and we'll get back to you within 24 hours to confirm your appointment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="card-modern p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="flex items-center text-gray-700 font-semibold mb-3">
                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center text-gray-700 font-semibold mb-3">
                    <Mail className="w-5 h-5 mr-2 text-emerald-600" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>
              </div>

              {/* Contact & Treatment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="flex items-center text-gray-700 font-semibold mb-3">
                    <Phone className="w-5 h-5 mr-2 text-emerald-600" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                    placeholder="+919329198211"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="treatmentType" className="flex items-center text-gray-700 font-semibold mb-3">
                    <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                    Treatment Type *
                  </label>
                  <select
                    id="treatmentType"
                    name="treatmentType"
                    value={formData.treatmentType}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border ${
                      errors.treatmentType ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                  >
                    <option value="">Select a treatment</option>
                    {treatmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.treatmentType && <p className="text-red-500 text-sm mt-2">{errors.treatmentType}</p>}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredDate" className="flex items-center text-gray-700 font-semibold mb-3">
                    <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-4 border ${
                      errors.preferredDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                  />
                  {errors.preferredDate && <p className="text-red-500 text-sm mt-2">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label htmlFor="preferredTime" className="flex items-center text-gray-700 font-semibold mb-3">
                    <Clock className="w-5 h-5 mr-2 text-emerald-600" />
                    Preferred Time *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border ${
                      errors.preferredTime ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-lg`}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && <p className="text-red-500 text-sm mt-2">{errors.preferredTime}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="flex items-center text-gray-700 font-semibold mb-3">
                  <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none text-lg"
                  placeholder="Tell us more about your concerns or questions..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-xl transform hover:-translate-y-1 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-6 h-6 mr-3" />
                      Book Appointment
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  * Required fields. We will contact you within 24 hours to confirm your appointment.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-modern p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">How long does the consultation take?</h3>
              <p className="text-gray-600">Initial consultations typically last 30-45 minutes, allowing us to understand your concerns and create a personalized treatment plan.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-modern p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Do I need to prepare anything before my appointment?</h3>
              <p className="text-gray-600">Please arrive 15 minutes early and bring any relevant medical records, current medications, and a list of questions you may have.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="card-modern p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">What should I expect during my first visit?</h3>
              <p className="text-gray-600">We'll discuss your skin concerns, medical history, perform a skin analysis, and recommend the most suitable treatment options for your needs.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
