import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Edit3, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  Check, 
  X, 
  Award, 
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  StarIcon
} from 'lucide-react';
import Modal from './Modal';
import { 
  getFeedback, 
  updateFeedback, 
  deleteFeedback, 
  toggleFeedbackFeatured,
  type Feedback, 
  type FeedbackUpdateData 
} from '../services/apiService';

interface FeedbackListTableProps {
  className?: string;
}

interface ViewFeedbackModalProps {
  feedback: Feedback | null;
  onClose: () => void;
}

interface EditFeedbackModalProps {
  feedback: Feedback | null;
  onClose: () => void;
  onUpdate: () => void;
}

// View Feedback Modal Component
function ViewFeedbackModal({ feedback, onClose }: ViewFeedbackModalProps) {
  if (!feedback) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="View Feedback">
      <div className="space-y-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start space-x-4">
          <img
            src={feedback.image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={feedback.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{feedback.name}</h3>
            <p className="text-gray-600">{feedback.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              {renderStars(feedback.rating)}
              <span className="text-sm text-gray-500">({feedback.rating}/5)</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
              feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
            </span>
            {feedback.featured && (
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex items-center">
                <Award className="w-3 h-3 mr-1" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Treatment Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Treatment Information</h4>
          <p className="text-gray-700">{feedback.treatment}</p>
        </div>

        {/* Feedback Content */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Feedback</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{feedback.review}</p>
          </div>
        </div>

        {/* Tags */}
        {feedback.tags && feedback.tags.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {feedback.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        {feedback.adminNotes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Admin Notes</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">{feedback.adminNotes}</p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="text-sm text-gray-500 space-y-1">
          <p><strong>Submitted:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
          {feedback.approvedAt && (
            <p><strong>Approved:</strong> {new Date(feedback.approvedAt).toLocaleString()}</p>
          )}
          {feedback.updatedAt && feedback.updatedAt !== feedback.createdAt && (
            <p><strong>Last Updated:</strong> {new Date(feedback.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

// Edit Feedback Modal Component
function EditFeedbackModal({ feedback, onClose, onUpdate }: EditFeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackUpdateData>({
    status: 'pending',
    isApproved: false,
    featured: false,
    tags: [],
    adminNotes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (feedback) {
      setFormData({
        status: feedback.status,
        isApproved: feedback.isApproved,
        featured: feedback.featured,
        tags: feedback.tags || [],
        adminNotes: feedback.adminNotes || ''
      });
    }
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) return;

    setLoading(true);
    setError(null);

    try {
      await updateFeedback(feedback._id, formData);
      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  if (!feedback) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Feedback">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as 'pending' | 'approved' | 'rejected'
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured Testimonial
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags?.join(', ') || ''}
            onChange={handleTagsChange}
            placeholder="e.g. excellent, recommended, satisfied"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
          <textarea
            value={formData.adminNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
            rows={3}
            placeholder="Internal notes about this feedback..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Feedback'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function FeedbackListTable({ className = '' }: FeedbackListTableProps) {
  // State management
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal states
  const [viewFeedback, setViewFeedback] = useState<Feedback | null>(null);
  const [editFeedback, setEditFeedback] = useState<Feedback | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Feedback | null>(null);

  // Fetch feedback data
  const fetchPage = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { 
        page: p, 
        limit: pageSize,
        admin: true // Get all feedback including non-approved
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (ratingFilter) params.rating = parseInt(ratingFilter);
      if (featuredFilter) params.featured = featuredFilter === 'true';
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const resp = await getFeedback(params);
      
      if (resp.success && resp.data) {
        const apiData = resp.data;
        setFeedbacks(apiData.feedback ?? []);
        setPage(apiData.pagination?.currentPage ?? p);
        setTotalPages(apiData.pagination?.totalPages ?? 1);
      } else {
        setError('Failed to load feedback');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading feedback');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refresh on filter changes
  useEffect(() => {
    fetchPage(1);
  }, [searchTerm, statusFilter, ratingFilter, featuredFilter, dateFrom, dateTo]);

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await deleteFeedback(deleteConfirm._id);
      setDeleteConfirm(null);
      fetchPage(page);
    } catch (err: any) {
      setError(err.message || 'Failed to delete feedback');
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (feedback: Feedback) => {
    try {
      await toggleFeedbackFeatured(feedback._id);
      fetchPage(page);
    } catch (err: any) {
      setError(err.message || 'Failed to update featured status');
    }
  };

  // Render stars helper
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Feedback Management</h2>
          <div className="text-sm text-gray-600">
            Total: {feedbacks.length} feedback(s)
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Feedback</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Date To */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Rating & Treatment
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Feedback
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Date
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading feedback...</span>
                  </div>
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No feedback found
                </td>
              </tr>
            ) : (
              feedbacks.map((feedback) => (
                <motion.tr
                  key={feedback._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  {/* Customer Info */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={feedback.image || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={feedback.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{feedback.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{feedback.email}</div>
                        <div className="flex items-center sm:hidden mt-1">
                          {renderStars(feedback.rating)}
                          <span className="ml-1 text-xs text-gray-600">({feedback.rating})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Rating & Treatment */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                        <span className="ml-2 text-xs sm:text-sm text-gray-600">({feedback.rating})</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{feedback.treatment}</div>
                    </div>
                  </td>

                  {/* Feedback Preview */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 hidden md:table-cell">
                    <div className="text-xs sm:text-sm text-gray-900 max-w-xs">
                      {feedback.review.length > 100
                        ? `${feedback.review.substring(0, 100)}...`
                        : feedback.review
                      }
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${
                        feedback.status === 'approved' ? 'bg-green-100 text-green-800' :
                        feedback.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                      </span>
                      {feedback.featured && (
                        <div>
                          <span className="inline-flex px-1 sm:px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
                            <Award className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setViewFeedback(feedback)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => setEditFeedback(feedback)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit Feedback"
                      >
                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(feedback)}
                        className={`${feedback.featured ? 'text-purple-600 hover:text-purple-800' : 'text-gray-400 hover:text-purple-600'} p-1`}
                        title={feedback.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(feedback)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-700">
            Page {page} of {totalPages}
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => fetchPage(page - 1)}
              disabled={page === 1}
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => fetchPage(page + 1)}
              disabled={page === totalPages}
              className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {viewFeedback && (
        <ViewFeedbackModal
          feedback={viewFeedback}
          onClose={() => setViewFeedback(null)}
        />
      )}

      {editFeedback && (
        <EditFeedbackModal
          feedback={editFeedback}
          onClose={() => setEditFeedback(null)}
          onUpdate={() => fetchPage(page)}
        />
      )}

      {deleteConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          title="Confirm Delete"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the feedback from <strong>{deleteConfirm.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}