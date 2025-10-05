import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Award, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';

export default function Home() {
  const treatments = [
    {
      title: 'Skin Treatments',
      description: 'Acne treatment, chemical peels, anti-aging, and skin rejuvenation',
      image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Hair Treatments',
      description: 'Hair transplant, PRP therapy, hair loss solutions',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      title: 'Laser Treatments',
      description: 'Laser hair removal, skin resurfacing, pigmentation removal',
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Patients' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Sparkles, value: '50+', label: 'Treatments Offered' },
    { icon: Shield, value: '100%', label: 'Safe & Certified' },
  ];

  const benefits = [
    'Board-certified dermatologists',
    'State-of-the-art equipment',
    'Personalized treatment plans',
    'Comfortable clinic environment',
    'Affordable pricing',
    'Follow-up care included',
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Journey to
                <span className="text-blue-600"> Beautiful Skin</span> Starts Here
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Expert dermatological care for all your skin and hair needs.
                Experience transformation with our advanced treatments and personalized care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/book-appointment"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg group"
                >
                  Book Appointment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/treatments"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
                >
                  View Treatments
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Doctor Derma"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                <p className="text-4xl font-bold text-blue-600">15+</p>
                <p className="text-gray-600 font-medium">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Specialized Treatments</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive skin and hair care solutions tailored to your unique needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {treatments.map((treatment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={treatment.image}
                    alt={treatment.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {treatment.title}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{treatment.description}</p>
                  <Link
                    to="/treatments"
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose Doctor Derma?</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                We combine medical expertise with cutting-edge technology to deliver
                exceptional results in a caring, professional environment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-50">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Clinic Interior"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your consultation today and take the first step towards healthier, more beautiful skin.
          </p>
          <Link
            to="/book-appointment"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg group"
          >
            Schedule Your Appointment
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
