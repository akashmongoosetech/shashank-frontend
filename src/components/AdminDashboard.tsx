import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, BarChart3, Settings, ArrowLeft, RefreshCw, Mail, MessageSquare, Camera } from 'lucide-react';
import ContactListTable from './ContactListTable';
import AppointmentListTable from './AppointmentListTable';
import SubscriberListTable from './SubscriberListTable';
import FeedbackListTable from './FeedbackListTable';
import GalleryListTable from './GalleryListTable';
import { getContactStats, getAppointmentStats, getContacts, getAppointments, getFeedbackStats, Contact, Appointment } from '../services/apiService';

type AdminTab = 'overview' | 'contacts' | 'appointments' | 'subscribers' | 'feedback' | 'gallery' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [contactStats, setContactStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    noShow: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0
  });
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    featured: 0,
    averageRating: 0,
    ratingDistribution: {}
  });
  const [monthlyStats, setMonthlyStats] = useState({
    contactsThisMonth: 0,
    appointmentsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get current month's start and end dates
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return {
      start: startOfMonth.toISOString(),
      end: endOfMonth.toISOString()
    };
  };

  // Function to get last 30 days range (fallback)
  const getLast30DaysRange = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    return {
      start: thirtyDaysAgo.toISOString(),
      end: now.toISOString()
    };
  };

  // Function to fetch monthly statistics
  const fetchMonthlyStats = useCallback(async () => {
    try {
      const { start, end } = getCurrentMonthRange();
      const { start: last30Start, end: last30End } = getLast30DaysRange();

      const [contactsResponse, appointmentsResponse] = await Promise.all([
        getContacts({ page: 1, limit: 100 }), // Get all contacts to filter by date
        getAppointments({ page: 1, limit: 100 }) // Get all appointments to filter by date
      ]);

      let contactsThisMonth = 0;
      let appointmentsThisMonth = 0;

      if (contactsResponse.success && contactsResponse.data?.contacts) {
        const contacts = contactsResponse.data.contacts;
        console.log(`📞 Total contacts found: ${contacts.length}`);

        // Try current month first
        contactsThisMonth = contacts.filter((contact: Contact) => {
          const contactDate = new Date(contact.createdAt);
          const isThisMonth = contactDate >= new Date(start) && contactDate <= new Date(end);
          return isThisMonth;
        }).length;

        // If no contacts this month, try last 30 days
        if (contactsThisMonth === 0) {
          contactsThisMonth = contacts.filter((contact: Contact) => {
            const contactDate = new Date(contact.createdAt);
            const isLast30Days = contactDate >= new Date(last30Start) && contactDate <= new Date(last30End);
            return isLast30Days;
          }).length;
        }
      }

      if (appointmentsResponse.success && appointmentsResponse.data?.appointments) {
        const appointments = appointmentsResponse.data.appointments;
        console.log(`📅 Total appointments found: ${appointments.length}`);

        // Try current month first
        appointmentsThisMonth = appointments.filter((appointment: Appointment) => {
          const appointmentDate = new Date(appointment.createdAt);
          const isThisMonth = appointmentDate >= new Date(start) && appointmentDate <= new Date(end);
          return isThisMonth;
        }).length;

        // If no appointments this month, try last 30 days
        if (appointmentsThisMonth === 0) {
          appointmentsThisMonth = appointments.filter((appointment: Appointment) => {
            const appointmentDate = new Date(appointment.createdAt);
            const isLast30Days = appointmentDate >= new Date(last30Start) && appointmentDate <= new Date(last30End);
            return isLast30Days;
          }).length;
        }
      }

      console.log(`✅ Monthly stats: Contacts: ${contactsThisMonth}, Appointments: ${appointmentsThisMonth}`);

      setMonthlyStats({
        contactsThisMonth,
        appointmentsThisMonth
      });
    } catch (err) {
      console.error('Failed to fetch monthly statistics:', err);
    }
  }, []);

  // Fetch statistics when component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [contactResponse, appointmentResponse, feedbackResponse] = await Promise.all([
          getContactStats(),
          getAppointmentStats(),
          getFeedbackStats()
        ]);

        if (contactResponse.success && contactResponse.data) {
          setContactStats(contactResponse.data);
        }

        if (appointmentResponse.success && appointmentResponse.data) {
          setAppointmentStats(appointmentResponse.data);
        }

        if (feedbackResponse.success && feedbackResponse.data) {
          setFeedbackStats(feedbackResponse.data);
        }

        // Fetch monthly statistics
        await fetchMonthlyStats();
      } catch (err) {
        console.error('Failed to fetch statistics:', err);

        setError('Failed to load statistics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fetchMonthlyStats]);

  // Function to refresh statistics
  const refreshStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [contactResponse, appointmentResponse, feedbackResponse] = await Promise.all([
        getContactStats(),
        getAppointmentStats(),
        getFeedbackStats()
      ]);

      if (contactResponse.success && contactResponse.data) {
        setContactStats(contactResponse.data);
      }

      if (appointmentResponse.success && appointmentResponse.data) {
        setAppointmentStats(appointmentResponse.data);
      }

      if (feedbackResponse.success && feedbackResponse.data) {
        setFeedbackStats(feedbackResponse.data);
      }

      // Fetch monthly statistics
      await fetchMonthlyStats();
    } catch (err) {
      console.error('Failed to refresh statistics:', err);

      setError('Failed to refresh statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchMonthlyStats]);

  // Refresh statistics when switching to overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      const fetchStats = async () => {
        try {
          const [contactResponse, appointmentResponse, feedbackResponse] = await Promise.all([
            getContactStats(),
            getAppointmentStats(),
            getFeedbackStats()
          ]);

          if (contactResponse.success && contactResponse.data) {
            setContactStats(contactResponse.data);
          }

          if (appointmentResponse.success && appointmentResponse.data) {
            setAppointmentStats(appointmentResponse.data);
          }

          if (feedbackResponse.success && feedbackResponse.data) {
            setFeedbackStats(feedbackResponse.data);
          }
        } catch (err) {
          console.error('Failed to refresh statistics:', err);
        }
      };

      fetchStats();
    }
  }, [activeTab]);

  // Listen for updates to refresh statistics
  useEffect(() => {
    const handleAppointmentUpdate = () => {
      if (activeTab === 'overview') {
        refreshStats();
      }
    };

    const handleContactUpdate = () => {
      if (activeTab === 'overview') {
        refreshStats();
      }
    };

    // Listen for custom events when appointments or contacts are updated
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    window.addEventListener('contactUpdated', handleContactUpdate);

    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
      window.removeEventListener('contactUpdated', handleContactUpdate);
    };
  }, [activeTab, refreshStats]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return <ContactListTable className="mt-6" />;
      case 'appointments':
        return <AppointmentListTable className="mt-6" />;
      case 'subscribers':
        return <SubscriberListTable className="mt-6" />;
      case 'feedback':
        return <FeedbackListTable className="mt-6" />;
      case 'gallery':
        return <GalleryListTable className="mt-6" />;
      case 'overview':
        return (
          <div className="mt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={refreshStats}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
  {/* Stats Cards */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Users className="w-6 h-6 text-blue-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Total Contacts</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : contactStats.total}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-green-100 rounded-lg">
        <Calendar className="w-6 h-6 text-green-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Total Appointments</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : appointmentStats.total}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.2 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-yellow-100 rounded-lg">
        <Calendar className="w-6 h-6 text-yellow-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : appointmentStats.pending}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.3 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-purple-100 rounded-lg">
        <BarChart3 className="w-6 h-6 text-purple-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">New Contacts</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : contactStats.new}
        </p>
      </div>
    </div>
  </motion.div>

  {/* Next row */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.4 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-indigo-100 rounded-lg">
        <Users className="w-6 h-6 text-indigo-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Recent Contacts</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : monthlyStats.contactsThisMonth}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.5 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-teal-100 rounded-lg">
        <Calendar className="w-6 h-6 text-teal-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Bookings This Month</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : monthlyStats.appointmentsThisMonth}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.6 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-pink-100 rounded-lg">
        <Users className="w-6 h-6 text-pink-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Total Feedback</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : feedbackStats.total}
        </p>
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.7 }}
    className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
  >
    <div className="flex items-center">
      <div className="p-2 bg-orange-100 rounded-lg">
        <BarChart3 className="w-6 h-6 text-orange-600" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">Avg Rating</p>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? '...' : `${feedbackStats.averageRating}/5`}
        </p>
      </div>
    </div>
  </motion.div>
</div>


            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Manage Contacts</h4>
                  <p className="text-xs sm:text-sm text-gray-600">View and manage contact submissions</p>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Manage Appointments</h4>
                  <p className="text-xs sm:text-sm text-gray-600">View and manage appointment bookings</p>
                </button>

                <button
                  onClick={() => setActiveTab('feedback')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Manage Feedback</h4>
                  <p className="text-xs sm:text-sm text-gray-600">View and moderate testimonials</p>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Manage Gallery</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Manage before & after images</p>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Settings</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Configure system settings</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="mt-4 sm:mt-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Email Configuration</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Configure email settings for notifications</p>
                  <button className="mt-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Configure
                  </button>
                </div>

                <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Appointment Settings</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Manage appointment time slots and treatments</p>
                  <button className="mt-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Manage
                  </button>
                </div>

                <div className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">System Information</h4>
                  <p className="text-xs sm:text-sm text-gray-600">View system status and version information</p>
                  <button className="mt-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                    View Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your clinic operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshStats}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh Statistics"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-sm text-gray-600">
                Welcome, Shashank
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap space-x-2 sm:space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
