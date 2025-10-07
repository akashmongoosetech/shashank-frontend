import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Facebook, Instagram, Twitter, MessageSquare, Clock as ClockIcon, MapPin as LocationIcon } from 'lucide-react';
import { createContact } from '../services/apiService';
import PageBanner from '../components/PageBanner';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Name validation (2-100 characters)
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Subject validation (5-200 characters)
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Subject cannot exceed 200 characters';
    }

    // Message validation (10-2000 characters)
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message cannot exceed 2000 characters';
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
      const response = await createContact(formData);

      if (response.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('contactUpdated'));

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        console.error('Form submission failed:', response.message, response);
        alert(response.message || 'Failed to send message. Please try again later.');
      }
    } catch (error) {
      // If the API client throws a structured error, surface its message
      const err = error as Error & { status?: number; payload?: unknown };
      console.error('Error submitting form:', err.status, err.payload, err.message);

      // Handle validation errors specifically
      if (err.status === 400 && err.payload) {
        const payload = err.payload as { success: boolean; message: string; errors: Array<{ msg: string; param: string; value: any }> };
        if (payload.errors && payload.errors.length > 0) {
          // Show specific validation errors
          const errorMessages = payload.errors.map(error => `${error.param}: ${error.msg}`).join('\n');
          alert(`Please fix the following errors:\n\n${errorMessages}`);
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
        : 'Failed to send message. Please try again later.';

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    {
      icon: LocationIcon,
      title: 'Visit Us',
      details: ['MPEB office, opposite gate no 4', 'Madhav Nagar, Ujjain, Madhya Pradesh 456010'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+919329198211'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@bhargavaclinic.com', 'support@bhargavaclinic.com'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ClockIcon,
      title: 'Working Hours',
      details: ['Mon-Fri: 9:00 AM - 7:00 PM', 'Sat: 10:00 AM - 5:00 PM', 'Sun: Closed'],
      color: 'from-orange-500 to-red-500',
    },
  ];

  const stats = [
    { value: '24/7', label: 'Support Available', icon: MessageSquare },
    { value: '< 1hr', label: 'Response Time', icon: ClockIcon },
    { value: '100%', label: 'Secure & Private', icon: Mail },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/shashank.bhargava.90',
      icon: Facebook,
      gradient: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/the_dermat_bhargava/',
      icon: Instagram,
      gradient: 'from-pink-600 to-pink-700',
    },
    // {
    //   name: 'Twitter',
    //   href: 'https://youtube.com/@bhargavaclinic',
    //   icon: Twitter,
    //   gradient: 'from-black to-black',
    // },
  ];

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Have questions? We would love to hear from you. Get in touch with our team!"
        // icon={MessageSquare}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Contact' },
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Get in <span className="text-gradient">Touch</span>
            </h2>
            <p className="section-subtitle">
              Multiple ways to reach us - we're here to help you achieve your skin health goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-modern p-6 text-center h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <info.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 mb-2 leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Send Us a <span className="text-gradient">Message</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and we will get back to you as soon as possible.
              </p>

              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="font-medium">Thank you for your message! We will get back to you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                      placeholder="Akash Raikwar"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
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
                      } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                      placeholder="akash@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                    Subject * <span className="text-sm text-gray-500">(5-200 characters)</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                    Message * <span className="text-sm text-gray-500">(10-2000 characters)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 border ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none`}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-0.5 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2860.6050696233838!2d75.78800267400636!3d23.18161021037709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396375db2b1bfc07%3A0x3f82285ec472d095!2sDr%20Shashank%20Bhargava%3A%20Fellow%20at%20University%20of%20Miami(USA)%2C%20Parma%20(Italy)!5e1!3m2!1sen!2sin!4v1759854425338!5m2!1sen!2sin"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                  className="h-full min-h-[500px]"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Follow Us on Social Media</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Stay connected and get the latest updates on skin care tips, treatment specials, and clinic news
            </p>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${social.gradient} text-white rounded-2xl hover:shadow-lg transition-all duration-300`}
                  aria-label={social.name}
                >
                  <social.icon className="w-7 h-7" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
