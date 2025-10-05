import { useEffect, useState } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { getContacts, deleteContact, updateContact } from '../services/apiService';
import type { Contact, ContactUpdateData } from '../services/apiService';

type Props = { pageSize?: number; className?: string };

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

type BackendStatus = 'new' | 'read' | 'replied' | 'archived';

const backendToUI = (s?: BackendStatus): BackendStatus => {
  return s || 'new';
};

export default function ContactListTable({ pageSize = 10, className = '' }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [editing, setEditing] = useState<Contact | null>(null);

  // Listen for contact updates via custom events
  useEffect(() => {
    const handleContactUpdate = () => {
      console.log('Contact updated, refreshing list...');
      fetchPage(1);
    };

    window.addEventListener('contactUpdated', handleContactUpdate);
    
    return () => {
      window.removeEventListener('contactUpdated', handleContactUpdate);
    };
  }, []);

  // Debug: Log component state changes
  useEffect(() => {
    console.log('ContactListTable state changed:', { 
      contactsCount: contacts.length, 
      loading, 
      page, 
      totalPages 
    });
  }, [contacts, loading, page, totalPages]);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const resp = await getContacts({ page: p, limit: pageSize });
      console.log('API Response:', resp); // Debug log
      
      if (resp.success && resp.data) {
        // The API returns { contacts: [...], pagination: {...} }
        const apiData = resp.data;
        setContacts(apiData.contacts ?? []);
        setPage(apiData.pagination?.currentPage ?? p);
        setTotalPages(apiData.pagination?.totalPages ?? 1);
        console.log('Contacts loaded:', apiData.contacts?.length || 0); // Debug log
      } else {
        console.error('Failed to load contacts', resp.message);
      }
    } catch (err) {
      console.error('Error loading contacts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ContactListTable mounted, fetching page 1...');
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      const resp = await deleteContact(id);
      if (resp.success) fetchPage(page);
      else alert(resp.message || 'Delete failed');
    } catch (err) {
      console.error('Delete error', err);
      alert('Delete failed');
    }
  };

  const handleStatusChange = async (id: string, status: BackendStatus) => {
    try {
      const resp = await updateContact(id, { status });
      if (resp.success) fetchPage(page);
      else alert(resp.message || 'Update failed');
    } catch (err) {
      console.error('Status update error', err);
      alert('Update failed');
    }
  };

  const startEdit = (c: Contact) => setEditing(c);
  const startView = (c: Contact) => setSelected(c);
  const closeModal = () => {
    setSelected(null);
    setEditing(null);
  };

  const handleEditSave = async () => {
    if (!editing) return;
    try {
      const payload: ContactUpdateData = {
        status: editing.status as BackendStatus,
      };

      const resp = await updateContact(editing._id, payload);
      if (resp.success) {
        closeModal();
        fetchPage(page);
      } else {
        alert(resp.message || 'Save failed');
      }
    } catch (err) {
      console.error('Save error', err);
      alert('Save failed');
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <div className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${contacts.length} items`}
        </div>
      </div>
      
      {/* Debug info */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> Loading: {loading.toString()}, Contacts: {contacts.length}, Page: {page}/{totalPages}
        </div>
      )}

      <div className="overflow-x-auto">
  <table className="w-full table-auto border border-gray-200">
    <thead className="bg-gray-50">
      <tr className="text-left text-sm text-gray-700 border-b">
        <th className="px-3 py-2">#</th>
        <th className="px-3 py-2">Name</th>
        <th className="px-3 py-2">Email</th>
        <th className="px-3 py-2">Subject</th>
        <th className="px-3 py-2">Message</th>
        <th className="px-3 py-2">Status</th>
        <th className="px-3 py-2">Created</th>
        <th className="px-3 py-2">Updated</th>
        <th className="px-3 py-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      {contacts.length === 0 && !loading ? (
        <tr>
          <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <div className="text-lg mb-2">📭</div>
              <div>No contacts found</div>
              <div className="text-sm mt-1">Try submitting a contact form to see contacts here</div>
            </div>
          </td>
        </tr>
      ) : (
        contacts.map((c, index) => (
          <tr key={c._id} className="border-t hover:bg-gray-50">
            <td className="px-3 py-2">{index + 1}</td>
            <td className="px-3 py-2">{c.name}</td>
            <td className="px-3 py-2">{c.email}</td>
            <td className="px-3 py-2 max-w-xs truncate">{c.subject}</td>
            <td className="px-3 py-2 max-w-sm truncate">{c.message}</td>
            <td className="px-3 py-2">
              <select
                value={backendToUI(c.status)}
                onChange={(e) => handleStatusChange(c._id, e.target.value as BackendStatus)}
                className="border rounded px-2 py-1 text-sm"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </td>
            <td className="px-3 py-2 text-sm text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </td>
            <td className="px-3 py-2 text-sm text-gray-500">
              {c.updatedAt ? new Date(c.updatedAt).toLocaleString() : '--'}
            </td>
            <td className="px-3 py-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => startView(c)}
                  title="View"
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => startEdit(c)}
                  title="Edit"
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  title="Delete"
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      <div className="flex items-center justify-between mt-4">
        <div>
          <button onClick={() => fetchPage(Math.max(1, page - 1))} className="px-3 py-2 bg-gray-100 rounded mr-2" disabled={page <= 1}>
            Prev
          </button>
          <button onClick={() => fetchPage(Math.min(totalPages, page + 1))} className="px-3 py-2 bg-gray-100 rounded" disabled={page >= totalPages}>
            Next
          </button>
        </div>
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Contact details</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Subject:</strong> {selected.subject}</div>
              <div><strong>Message:</strong> <div className="whitespace-pre-wrap">{selected.message}</div></div>
              <div><strong>Status:</strong> {selected.status}</div>
            </div>
            <div className="mt-6 text-right">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Edit contact</h3>
            <div className="grid grid-cols-1 gap-3">
              <label className="text-sm">Name
                <input value={editing.name ?? ''} onChange={(e) => setEditing(prev => prev ? ({ ...prev, name: e.target.value } as Contact) : prev)} className="w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="text-sm">Email
                <input value={editing.email ?? ''} onChange={(e) => setEditing(prev => prev ? ({ ...prev, email: e.target.value } as Contact) : prev)} className="w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="text-sm">Subject
                <input value={editing.subject ?? ''} onChange={(e) => setEditing(prev => prev ? ({ ...prev, subject: e.target.value } as Contact) : prev)} className="w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="text-sm">Message
                <textarea value={editing.message ?? ''} onChange={(e) => setEditing(prev => prev ? ({ ...prev, message: e.target.value } as Contact) : prev)} className="w-full border rounded px-2 py-1 mt-1" />
              </label>
              <label className="text-sm">Status
                <select value={backendToUI(editing.status)} onChange={(e) => {
                  const status = e.target.value as BackendStatus;
                  setEditing(prev => prev ? ({ ...prev, status } as Contact) : prev);
                }} className="w-full border rounded px-2 py-1 mt-1">
                  {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>

            <div className="mt-6 text-right space-x-2">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
