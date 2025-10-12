import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import {
  getAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
  AppointmentUpdateData
} from '../services/apiService';
import DeleteModal from './DeleteModal';

interface AppointmentListTableProps {
  className?: string;
}

type BackendStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
type BackendPriority = 'low' | 'medium' | 'high';

const STATUS_OPTIONS: { value: BackendStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  { value: 'no-show', label: 'No Show', color: 'bg-gray-100 text-gray-800' },
];

const PRIORITY_OPTIONS: { value: BackendPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

const TREATMENT_TYPES = [
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
];

export default function AppointmentListTable({ className = '' }: AppointmentListTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BackendStatus | ''>('');
  const [treatmentFilter, setTreatmentFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<AppointmentUpdateData>({});
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const limit = 10;

  // Load appointments on component mount and when filters change
  useEffect(() => {
    console.log('AppointmentListTable mounted, fetching page 1...');
    fetchPage(1);
  }, []);

  // Listen for appointment updates
  useEffect(() => {
    const handleAppointmentUpdate = () => {
      console.log('Appointment updated, refreshing list...');
      fetchPage(1);
    };
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
    };
  }, []);

  const fetchPage = async (p: number) => {
    setLoading(true);
    try {
      const params: any = {
        page: p,
        limit,
        sortBy,
        sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (treatmentFilter) params.treatmentType = treatmentFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      console.log('Fetching appointments with params:', params);
      const resp = await getAppointments(params);
      console.log('API Response:', resp);

      if (resp.success && resp.data) {
        const apiData = resp.data as unknown as { appointments: Appointment[]; pagination: any };
        setAppointments(apiData.appointments ?? []);
        setPage(apiData.pagination?.currentPage ?? p);
        setTotalPages(apiData.pagination?.totalPages ?? 1);
        console.log('Appointments loaded:', apiData.appointments?.length || 0);
      } else {
        console.error('Failed to fetch appointments:', resp.message);
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPage(1);
  };

  const handleStatusChange = async (id: string, newStatus: BackendStatus) => {
    try {
      const response = await updateAppointment(id, { status: newStatus });
      if (response.success) {
        setAppointments(prev => 
          prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt)
        );
        console.log(`Appointment ${id} status updated to ${newStatus}`);
      } else {
        console.error('Failed to update appointment status:', response.message);
        alert('Failed to update appointment status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status. Please try again.');
    }
  };

  const handlePriorityChange = async (id: string, newPriority: BackendPriority) => {
    try {
      const response = await updateAppointment(id, { priority: newPriority });
      if (response.success) {
        setAppointments(prev => 
          prev.map(apt => apt._id === id ? { ...apt, priority: newPriority } : apt)
        );
        console.log(`Appointment ${id} priority updated to ${newPriority}`);
      } else {
        console.error('Failed to update appointment priority:', response.message);
        alert('Failed to update appointment priority. Please try again.');
      }
    } catch (error) {
      console.error('Error updating appointment priority:', error);
      alert('Failed to update appointment priority. Please try again.');
    }
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteAppointment(appointmentToDelete._id);
      if (response.success) {
        setAppointments(prev => prev.filter(apt => apt._id !== appointmentToDelete._id));
        console.log(`Appointment ${appointmentToDelete._id} deleted successfully`);
        setDeleteModalOpen(false);
        setAppointmentToDelete(null);
      } else {
        console.error('Failed to delete appointment:', response.message);
        alert('Failed to delete appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getStatusIcon = (status: BackendStatus) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'no-show': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTreatmentFilter('');
    setDateFrom('');
    setDateTo('');
    fetchPage(1);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
            <p className="text-gray-600 mt-1">Manage and track all appointment bookings</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchPage(page)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BackendStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Treatment Filter */}
          <div>
            <select
              value={treatmentFilter}
              onChange={(e) => setTreatmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Treatments</option>
              {TREATMENT_TYPES.map(treatment => (
                <option key={treatment} value={treatment}>
                  {treatment}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From Date"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To Date"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'status')}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {import.meta.env.DEV && (
        <div className="px-6 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="text-xs text-yellow-800">
            <strong>Debug:</strong> Loading: {loading.toString()}, Appointments: {appointments.length}, Page: {page}/{totalPages}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <motion.tr
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.referenceId || `APT-${appointment._id.slice(-8).toUpperCase()}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(appointment.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {appointment.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.treatmentType}</div>
                    {appointment.message && (
                      <div className="text-sm text-gray-500 truncate max-w-xs" title={appointment.message}>
                        {appointment.message}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(appointment.preferredDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {formatTime(appointment.preferredTime)}
                    </div>
                    {appointment.confirmedDate && (
                      <div className="text-xs text-green-600 mt-1">
                        Confirmed: {formatDate(appointment.confirmedDate)} {appointment.confirmedTime}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value as BackendStatus)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
                        STATUS_OPTIONS.find(s => s.value === appointment.status)?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.priority}
                      onChange={(e) => handlePriorityChange(appointment._id, e.target.value as BackendPriority)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
                        PRIORITY_OPTIONS.find(p => p.value === appointment.priority)?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {PRIORITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewingAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(appointment)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {page} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchPage(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        pageNum === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Appointment Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Reference & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Reference ID</h4>
                  <p className="text-lg font-semibold text-gray-900">
                    {viewingAppointment.referenceId || `APT-${viewingAppointment._id.slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    STATUS_OPTIONS.find(s => s.value === viewingAppointment.status)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {STATUS_OPTIONS.find(s => s.value === viewingAppointment.status)?.label || viewingAppointment.status}
                  </span>
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Patient Information</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{viewingAppointment.name}</p>
                      <p className="text-sm text-gray-500">Patient Name</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{viewingAppointment.email}</p>
                      <p className="text-sm text-gray-500">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{viewingAppointment.phone}</p>
                      <p className="text-sm text-gray-500">Phone Number</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Appointment Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{viewingAppointment.treatmentType}</p>
                      <p className="text-sm text-gray-500">Treatment Type</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(viewingAppointment.preferredDate)}</p>
                      <p className="text-sm text-gray-500">Preferred Date</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatTime(viewingAppointment.preferredTime)}</p>
                      <p className="text-sm text-gray-500">Preferred Time</p>
                    </div>
                  </div>
                  {viewingAppointment.confirmedDate && (
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {formatDate(viewingAppointment.confirmedDate)} {viewingAppointment.confirmedTime}
                        </p>
                        <p className="text-sm text-green-600">Confirmed Date & Time</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              {viewingAppointment.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Notes</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewingAppointment.message}</p>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(viewingAppointment.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Priority</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      PRIORITY_OPTIONS.find(p => p.value === viewingAppointment.priority)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {PRIORITY_OPTIONS.find(p => p.value === viewingAppointment.priority)?.label || viewingAppointment.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setViewingAppointment(null)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Could add edit functionality here
                    setViewingAppointment(null);
                    setEditingId(viewingAppointment._id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        message={`Are you sure you want to delete the appointment for "${appointmentToDelete?.name}"?`}
        itemName="appointment"
        isDeleting={isDeleting}
        successMessage={`Appointment for "${appointmentToDelete?.name}" has been deleted successfully.`}
      />
    </div>
  );
}
