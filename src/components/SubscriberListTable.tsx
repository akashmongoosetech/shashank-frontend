import { useEffect, useState } from 'react';
import { Eye, Search } from 'lucide-react';
import { getSubscribers } from '../services/apiService';
import type { Subscriber } from '../services/apiService';

type Props = { pageSize?: number; className?: string };

export default function SubscriberListTable({ pageSize = 10, className = '' }: Props) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Subscriber | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Listen for subscriber updates via custom events
  useEffect(() => {
    const handleSubscriberUpdate = () => {
      console.log('Subscriber updated, refreshing list...');
      fetchPage(1);
    };

    window.addEventListener('subscriberUpdated', handleSubscriberUpdate);

    return () => {
      window.removeEventListener('subscriberUpdated', handleSubscriberUpdate);
    };
  }, []);

  // Debug: Log component state changes
  useEffect(() => {
    console.log('SubscriberListTable state changed:', {
      subscribersCount: subscribers.length,
      loading,
      page,
      totalPages
    });
  }, [subscribers, loading, page, totalPages]);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; search?: string } = { page: p, limit: pageSize };
      if (searchTerm) params.search = searchTerm;

      const resp = await getSubscribers(params);
      console.log('API Response:', resp); // Debug log

      if (resp.success && resp.data) {
        // The API returns { subscribers: [...], pagination: {...} }
        const apiData = resp.data;
        setSubscribers(apiData.subscribers ?? []);
        setPage(apiData.pagination?.currentPage ?? p);
        setTotalPages(apiData.pagination?.totalPages ?? 1);
        console.log('Subscribers loaded:', apiData.subscribers?.length || 0); // Debug log
      } else {
        console.error('Failed to load subscribers', resp.message);
      }
    } catch (err) {
      console.error('Error loading subscribers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('SubscriberListTable mounted, fetching page 1...');
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const startView = (s: Subscriber) => setSelected(s);
  const closeModal = () => {
    setSelected(null);
  };

  return (
    <div className={`bg-white rounded-lg shadow p-3 sm:p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Subscribers</h2>
        <div className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${subscribers.length} items`}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchPage(1)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Debug info */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> Loading: {loading.toString()}, Subscribers: {subscribers.length}, Page: {page}/{totalPages}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs sm:text-sm text-gray-700 border-b">
              <th className="px-2 sm:px-3 py-2">#</th>
              <th className="px-2 sm:px-3 py-2">Email</th>
              <th className="px-2 sm:px-3 py-2 hidden sm:table-cell">Source</th>
              <th className="px-2 sm:px-3 py-2 hidden md:table-cell">Subscribed At</th>
              <th className="px-2 sm:px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-lg mb-2">📧</div>
                    <div>No subscribers found</div>
                    <div className="text-sm mt-1">Subscribers will appear here when people sign up for your newsletter</div>
                  </div>
                </td>
              </tr>
            ) : (
              subscribers.map((s, index) => (
                <tr key={s._id} className="border-t hover:bg-gray-50">
                  <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">{index + 1}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm">
                    <div>
                      <div className="font-medium">{s.email}</div>
                      <div className="text-gray-500 sm:hidden">{s.source || 'No source'}</div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm hidden sm:table-cell">{s.source || '--'}</td>
                  <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-2 sm:px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => startView(s)}
                        title="View"
                        className="p-1 sm:p-2 rounded hover:bg-gray-100"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
        <div className="flex items-center space-x-2">
          <button onClick={() => fetchPage(Math.max(1, page - 1))} className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors" disabled={page <= 1}>
            Prev
          </button>
          <button onClick={() => fetchPage(Math.min(totalPages, page + 1))} className="px-3 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors" disabled={page >= totalPages}>
            Next
          </button>
        </div>
        <div className="text-xs sm:text-sm text-gray-600">Page {page} of {totalPages}</div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Subscriber details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Source:</strong> {selected.source || 'Not specified'}</div>
              <div><strong>Subscribed At:</strong> {new Date(selected.createdAt).toLocaleString()}</div>
              <div><strong>Last Updated:</strong> {new Date(selected.updatedAt).toLocaleString()}</div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}