import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Heart, Users, Award, Plus } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FeedbackForm from '../components/FeedbackForm';
import { getFeedback, getFeedbackStats, type Feedback, type FeedbackStats } from '../services/apiService';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Feedback[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [error, setError] = useState('');

  // Load dynamic testimonials and stats
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const [feedbackResponse, statsResponse] = await Promise.all([
          getFeedback({ admin: false, limit: 20, page: 1 }),
          getFeedbackStats()
        ]);

        if (feedbackResponse.success && feedbackResponse.data) {
          setDynamicTestimonials(feedbackResponse.data.feedback || []);
        }

        if (statsResponse.success && statsResponse.data) {
          setFeedbackStats(statsResponse.data);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleFeedbackSubmitSuccess = async () => {
    setShowFeedbackForm(false);
    // Reload testimonials after successful submission
    try {
      const feedbackResponse = await getFeedback({ admin: false, limit: 20, page: 1 });
      if (feedbackResponse.success && feedbackResponse.data) {
        setDynamicTestimonials(feedbackResponse.data.feedback || []);
      }
    } catch (err) {
      console.error('Failed to reload testimonials:', err);
    }
  };

  const testimonials = [
    {
      name: 'Sarah Johnson',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'Acne Treatment',
      review: 'Dr. Derma transformed my skin! The acne treatment was incredibly effective, and the results exceeded my expectations. The staff is professional and caring. I finally have the confidence to go makeup-free!',
    },
    {
      name: 'Michael Chen',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'Laser Hair Removal',
      review: 'The laser hair removal treatment was painless and professional. I am amazed by the results after just a few sessions. The clinic is clean and modern, and the doctor explained everything thoroughly. Highly recommend!',
    },
    {
      name: 'Emily Rodriguez',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'Skin Rejuvenation',
      review: 'Best dermatologist I have ever visited! The staff is friendly, the clinic is spotless, and the treatment results are outstanding. My skin has never looked better. Dr. Sarah is incredibly knowledgeable and patient.',
    },
    {
      name: 'David Williams',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'Hair Transplant',
      review: 'The hair transplant procedure was life-changing. Professional service from start to finish, and the results look completely natural. I could not be happier with my decision to choose Bhargava Clinic!',
    },
    {
      name: 'Jessica Martinez',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'Chemical Peel',
      review: 'The chemical peel treatment gave me glowing, radiant skin. The process was explained clearly, and the aftercare instructions were comprehensive. I can see a significant improvement in my skin texture and tone!',
    },
    {
      name: 'Robert Anderson',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      treatment: 'PRP Hair Therapy',
      review: 'PRP therapy helped reduce my hair fall significantly. The treatment was comfortable, and I started seeing results within a few months. The doctor monitored my progress closely and adjusted the treatment as needed.',
    },
  ];

  // Combine static testimonials with dynamic ones for carousel
  const allTestimonials = [...testimonials, ...dynamicTestimonials.slice(0, 6)];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allTestimonials.length - 1 ? 0 : prev + 1));
  };

  const displayStats = [
    { 
      value: feedbackStats ? `${feedbackStats.approved + 500}+` : '500+', 
      label: 'Happy Patients', 
      icon: Users 
    },
    { 
      value: feedbackStats ? `${feedbackStats.averageRating}/5` : '4.9/5', 
      label: 'Average Rating', 
      icon: Star 
    },
    { 
      value: '98%', 
      label: 'Satisfaction Rate', 
      icon: Heart 
    },
  ];

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Patient Testimonials"
        subtitle="Hear from our satisfied patients about their transformative experiences"
        // icon={Heart}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Testimonials' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              What Our <span className="text-gradient">Patients Say</span>
            </h2>
            <p className="section-subtitle">
              Real stories from real people who transformed their lives with us
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="card-modern p-8 md:p-12"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-800 rounded-2xl">
                  <Quote className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                {[...Array(allTestimonials[currentIndex]?.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current mx-0.5" />
                ))}
              </div>

              <p className="text-2xl text-gray-700 mb-8 leading-relaxed italic text-center">
                "{allTestimonials[currentIndex]?.review}"
              </p>

              <div className="flex items-center justify-center space-x-4">
                <img
                  src={allTestimonials[currentIndex]?.image}
                  alt={allTestimonials[currentIndex]?.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">{allTestimonials[currentIndex]?.name}</h3>
                  <p className="text-blue-600 font-medium">{allTestimonials[currentIndex]?.treatment}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={handlePrevious}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>

              <div className="flex space-x-2">
                {allTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              All Patient <span className="text-gradient">Reviews</span>
            </h2>
            <p className="section-subtitle">
              Real stories from real people who trust us with their skin and hair care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...testimonials, ...dynamicTestimonials].map((testimonial, index) => (
              <motion.div
                key={`testimonial-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-modern p-6 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <div className="flex justify-center mb-4">
                    <Quote className="w-8 h-8 text-blue-200" />
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed italic text-center">
                    "{testimonial.review}"
                  </p>

                  <div className="flex items-center space-x-3 pt-4 border-t border-blue-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-blue-600">{testimonial.treatment}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              Share Your <span className="text-gradient">Experience</span>
            </h2>
            <p className="section-subtitle">
              Had a great experience with us? We'd love to hear about it!
            </p>
            
            {!showFeedbackForm && (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="btn-primary inline-flex items-center space-x-2 mt-6"
              >
                <Plus className="w-5 h-5" />
                <span>Write a Review</span>
              </button>
            )}
          </motion.div>

          {showFeedbackForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeedbackForm 
                onSubmitSuccess={handleFeedbackSubmitSuccess}
                className="max-w-2xl mx-auto"
              />
              
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Transformation?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of satisfied patients who have achieved their skin and hair goals with us
            </p>
            <a
              href="/book-appointment"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
