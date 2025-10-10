import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, User, Mail, MessageSquare, Award, CheckCircle } from 'lucide-react';
import { createFeedback } from '../services/apiService';

interface FeedbackFormProps {
  onSubmitSuccess?: () => void;
  className?: string;
}

interface FeedbackFormData {
  name: string;
  email: string;
  rating: number;
  treatment: string;
  review: string;
  image?: string;
}

export default function FeedbackForm({ onSubmitSuccess, className = '' }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    rating: 5,
    treatment: '',
    review: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const treatmentOptions = [
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
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.treatment) {
      setError('Please select a treatment');
      return false;
    }
    if (!formData.review.trim()) {
      setError('Please write your review');
      return false;
    }
    if (formData.review.trim().length < 10) {
      setError('Review must be at least 10 characters long');
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
      const response = await createFeedback({
        name: formData.name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        treatment: formData.treatment,
        review: formData.review.trim(),
        image: formData.image?.trim() || undefined
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to submit feedback');
      }

      setIsSubmitted(true);
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      rating: 5,
      treatment: '',
      review: '',
      image: ''
    });
    setIsSubmitted(false);
    setError('');
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`card-modern p-8 text-center ${className}`}
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with us.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your review will be reviewed by our team and published once approved.
          </p>
          <button
            onClick={resetForm}
            className="btn-primary"
          >
            Submit Another Review
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`card-modern p-8 ${className}`}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Share Your <span className="text-gradient">Experience</span>
        </h2>
        <p className="text-gray-600">
          Help others learn about your experience with our treatments
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your email address"
            required
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
            className="form-input"
            required
          >
            <option value="">Select the treatment you received</option>
            {treatmentOptions.map((treatment) => (
              <option key={treatment} value={treatment}>
                {treatment}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Rating
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
          <label htmlFor="review" className="block text-sm font-semibold text-gray-700 mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Your Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleInputChange}
            rows={5}
            className="form-input resize-none"
            placeholder="Share your experience with us... (minimum 10 characters)"
            required
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.review.length}/1000 characters
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Image URL (Optional)
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="form-input"
            placeholder="https://example.com/your-photo.jpg"
          />
          <div className="text-sm text-gray-500 mt-1">
            Leave empty to use a default image
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Your review will be reviewed by our team before being published. 
          We only display genuine reviews from verified patients.
        </p>
      </div>
    </motion.div>
  );
}