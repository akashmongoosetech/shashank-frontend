import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Stethoscope } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/treatments', label: 'Treatments' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Doctor Derma</h1>
              <p className="text-xs text-gray-600">Skin & Hair Clinic</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book-appointment"
              className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Book Now
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/book-appointment"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
