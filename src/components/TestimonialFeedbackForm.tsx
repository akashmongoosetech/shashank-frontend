import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, User, Mail, Phone, MessageSquare, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { createFeedback } from '../services/apiService';

interface TestimonialFeedbackFormProps {
  onSubmitSuccess: () => void;
}

interface FeedbackFormData {
  name: string;
  email: string;
  mobile: string;
  feedback: string;
  profile: string;
  rating: number;
  treatment: string;
}

export default function TestimonialFeedbackForm({ onSubmitSuccess }: TestimonialFeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    mobile: '',
    feedback: '',
    profile: '',
    rating: 5,
    treatment: 'General Consultation'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const treatmentOptions = [
    'General Consultation',
    'Acne Treatment',
    'Laser Hair Removal',
    'Skin Rejuvenation',
    'Hair Transplant',
    'Chemical Peel',
    'PRP Hair Therapy',
    'Anti-Aging Treatment',
    'Mole Removal',
    'Skin Whitening',
    'Botox Treatment',
    'Dermal Fillers',
    'Microneedling',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters long');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.mobile && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.mobile.trim())) {
      setError('Please enter a valid mobile number');
      return false;
    }
    if (!formData.feedback.trim()) {
      setError('Please write your feedback');
      return false;
    }
    if (formData.feedback.trim().length < 10) {
      setError('Feedback must be at least 10 characters long');
      return false;
    }
    if (formData.feedback.trim().length > 1000) {
      setError('Feedback cannot exceed 1000 characters');
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a rating');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use default profile image if none provided
      const defaultProfile = 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400';
      
      const response = await createFeedback({
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        treatment: formData.treatment,
        review: formData.feedback.trim(),
        image: formData.profile?.trim() || defaultProfile
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
      
      // Call success callback after a short delay to show success message
      setTimeout(() => {
        onSubmitSuccess();
      }, 2000);
    } catch (err) {
      const error = err as Error & { status?: number; payload?: unknown };
      
      // Handle validation errors specifically
      if (error.status === 400 && error.payload) {
        const payload = error.payload as { success: boolean; message: string; errors: Array<{ msg: string; param: string; value: any }> };
        if (payload.errors && payload.errors.length > 0) {
          const errorMessages = payload.errors.map(error => error.msg).join(', ');
          setError(errorMessages);
          setIsSubmitting(false);
          return;
        }
      }

      setError(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-8"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h3>
          <p className="text-lg text-gray-600 mb-4">
            Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with us.
          </p>
          <p className="text-sm text-gray-500">
            Your review has been published and is now visible on our testimonials page!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Share Your <span className="text-gradient">Experience</span>
        </h3>
        <p className="text-gray-600">
          Help others learn about your experience with our treatments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Mobile (Optional)
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label htmlFor="treatment" className="block text-sm font-semibold text-gray-700 mb-2">
            Treatment Received
          </label>
          <select
            id="treatment"
            name="treatment"
            value={formData.treatment}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          >
            {treatmentOptions.map((treatment) => (
              <option key={treatment} value={treatment}>
                {treatment}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  } hover:scale-110`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating}/5 Stars
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="feedback" className="block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Feedback *
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Share your experience with us... (minimum 10 characters)"
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.feedback.length}/1000 characters
          </div>
        </div>

        <div>
          <label htmlFor="profile" className="block text-sm font-semibold text-gray-700 mb-2">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Profile Image URL (Optional)
          </label>
          <input
            type="url"
            id="profile"
            name="profile"
            value={formData.profile}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="https://example.com/your-photo.jpg"
          />
          <div className="text-sm text-gray-500 mt-1">
            Leave empty to use a default profile image
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Feedback</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Your review will be published immediately and appear on our testimonials page. 
          We value authentic feedback from our patients.
        </p>
      </div>
    </motion.div>
  );
}