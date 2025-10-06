import { Link } from 'react-router-dom';
import { Stethoscope, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Twitter, Clock, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { createSubscription } from '../services/apiService';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

  const handleSubscribe = async () => {
    setSubscribeMessage(null);
    setSubscribeError(null);

    if (!isValidEmail(subscribeEmail)) {
      setSubscribeError('Please enter a valid email');
      return;
    }

    setSubscribeLoading(true);
    try {
      const res = await createSubscription({ email: subscribeEmail, source: 'footer' });
      if (res.success) {
        setSubscribeMessage(res.message || 'Subscribed successfully');
        setSubscribeEmail('');
        setTimeout(() => {
          setSubscribeMessage(null);
        }, 2000);
      } else {
        setSubscribeError(res.message || 'Subscription failed');
        setTimeout(() => {
          setSubscribeError(null);
        }, 2000);
      }
    } catch (error) {
      const err = error as Error & { status?: number };
      setSubscribeError(err.message || 'Subscription failed');
      setTimeout(() => {
        setSubscribeError(null);
      }, 2000);
    } finally {
      setSubscribeLoading(false);
    }
  };

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/treatments', label: 'Our Treatments' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/blog', label: 'Blog & Articles' },
    { path: '/contact', label: 'Contact Us' },
  ];

  const treatments = [
    { path: '/treatments', label: 'Skin Treatments' },
    { path: '/treatments', label: 'Hair Restoration' },
    { path: '/treatments', label: 'Laser Therapy' },
    { path: '/treatments', label: 'Anti-Aging' },
    { path: '/treatments', label: 'Acne Treatment' },
    { path: '/treatments', label: 'Chemical Peels' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bhargava Clinic
                </h3>
                <p className="text-xs text-blue-300 font-medium">Skin & Hair Specialists</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your trusted partner for comprehensive skin and hair care treatments. 
              Excellence in dermatology with cutting-edge technology and personalized care.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl ${social.color} transition-all duration-300 group`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Treatments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              Our Treatments
            </h4>
            <ul className="space-y-3">
              {treatments.map((treatment, index) => (
                <li key={index}>
                  <Link
                    to={treatment.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group text-sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform" />
                    {treatment.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300 text-sm leading-relaxed">
                  MPEB office, opposite gate no 4, Madhav Nagar, Ujjain, Madhya Pradesh 456010
                </span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
                <a href="tel:+919329198211" className="text-gray-300 hover:text-white text-sm transition-colors">
                  +919329198211
                </a>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                  <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                </div>
                <a href="mailto:info@bhargavaclinic.com" className="text-gray-300 hover:text-white text-sm transition-colors">
                  info@bhargavaclinic.com
                </a>
              </li>
            </ul>

            {/* Clinic Hours */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <h5 className="font-semibold text-sm">Clinic Hours</h5>
              </div>
              <div className="text-gray-300 text-sm space-y-1">
                <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                <p>Saturday: 10:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold mb-2">Stay Updated</h4>
              <p className="text-gray-300 text-sm">Subscribe to our newsletter for health tips and special offers</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex w-full md:w-auto gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="flex-1 md:w-64 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subscribeLoading}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap ${subscribeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {subscribeError && (
                <p className="text-red-300 text-sm mt-2">{subscribeError}</p>
              )}
              {subscribeMessage && !subscribeError && (
                <p className="text-green-300 text-sm mt-2">{subscribeMessage}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
            <p className="flex items-center">
              &copy; {currentYear} Bhargava Clinic. All rights reserved. Made with 
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> 
              for your health
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
