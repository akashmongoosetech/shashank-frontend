import { Link } from 'react-router-dom';
import { Stethoscope, MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Doctor Derma</h3>
                <p className="text-xs text-blue-200">Skin & Hair Clinic</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Your trusted partner for comprehensive skin and hair care treatments.
              Excellence in dermatology since 2010.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-blue-100 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/treatments" className="text-blue-100 hover:text-white transition-colors">Treatments</Link></li>
              <li><Link to="/gallery" className="text-blue-100 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/blog" className="text-blue-100 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/book-appointment" className="text-blue-100 hover:text-white transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100 text-sm">123 Medical Plaza, Health District, City 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm">info@doctorderma.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Clinic Hours</h4>
            <div className="text-blue-100 text-sm space-y-2">
              <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
              <p>Saturday: 10:00 AM - 5:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-blue-700 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-blue-700 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="bg-blue-700 p-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-100 text-sm">
          <p>&copy; {new Date().getFullYear()} Doctor Derma Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
