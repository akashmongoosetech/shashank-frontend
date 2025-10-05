import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, BarChart3, Settings, ArrowLeft } from 'lucide-react';
import ContactListTable from './ContactListTable';
import AppointmentListTable from './AppointmentListTable';

type AdminTab = 'overview' | 'contacts' | 'appointments' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contacts':
        return <ContactListTable className="mt-6" />;
      case 'appointments':
        return <AppointmentListTable className="mt-6" />;
      case 'overview':
        return (
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    <p className="text-2xl font-bold text-gray-900">-</p>
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
                    <p className="text-2xl font-bold text-gray-900">-</p>
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
                    <p className="text-2xl font-bold text-gray-900">-</p>
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
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">-</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Users className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Contacts</h4>
                  <p className="text-sm text-gray-600">View and manage contact submissions</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Manage Appointments</h4>
                  <p className="text-sm text-gray-600">View and manage appointment bookings</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Settings className="w-8 h-8 text-purple-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Settings</h4>
                  <p className="text-sm text-gray-600">Configure system settings</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Email Configuration</h4>
                  <p className="text-sm text-gray-600">Configure email settings for notifications</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Configure
                  </button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Appointment Settings</h4>
                  <p className="text-sm text-gray-600">Manage appointment time slots and treatments</p>
                  <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Manage
                  </button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
                  <p className="text-sm text-gray-600">View system status and version information</p>
                  <button className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
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
              <div className="text-sm text-gray-600">
                Welcome, Shashank
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
