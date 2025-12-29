import { useState, useEffect } from 'react';
import { Plus, Eye, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function MyPermits() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPermit, setViewingPermit] = useState(null);
  const [formData, setFormData] = useState({
    type: 'business',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      const response = await api.get('/my/permits');
      const data = response.data || [];
      setPermits(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permits:', error);
      setPermits([]);
      setLoading(false);
    }
  };

  const filteredPermits = permits.filter(permit => {
    if (filter === 'all') return true;
    if (filter === 'active') return permit.status === 'approved';
    if (filter === 'pending') return permit.status === 'pending' || permit.status === 'under_review';
    if (filter === 'expired') return permit.status === 'expired' || permit.status === 'rejected';
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/my/permits', formData);
      toast.success('Permit application submitted successfully');
      fetchPermits();
      setIsModalOpen(false);
      setFormData({ type: 'business', title: '', description: '' });
    } catch (error) {
      console.error('Error applying for permit:', error);
      toast.error(error.response?.data?.message || 'Error submitting application. Please try again.');
    }
  };

  const openViewModal = (permit) => {
    setViewingPermit(permit);
    setIsViewModalOpen(true);
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      under_review: 'bg-blue-50 text-blue-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
      expired: 'bg-slate-100 text-slate-600',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const getTypeIcon = (type) => {
    return type === 'business' ? '🏢' : type === 'construction' ? '🏗️' : type === 'event' ? '🎉' : '🚗';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading permits...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Permits</h1>
          <p className="text-slate-500 mt-1">View and apply for permits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Apply for Permit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'active', 'pending', 'expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Permits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPermits.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No permits found. Apply for your first permit!
          </div>
        ) : (
          filteredPermits.map((permit) => (
            <div
              key={permit.id}
              className="bg-white rounded-lg border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(permit.type)}</span>
                  <div>
                    <h3 className="font-medium text-slate-800">{permit.title}</h3>
                    <p className="text-sm text-slate-500 capitalize">{permit.type} Permit</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(permit.status)}`}>
                  {(permit.status || '').replace('_', ' ')}
                </span>
              </div>
              
              <div className="text-sm text-slate-500 space-y-1 mb-4">
                <p>Applied: {permit.application_date || new Date(permit.created_at).toLocaleDateString()}</p>
                {permit.expiry_date && <p>Expires: {permit.expiry_date}</p>}
                {permit.fee && <p>Fee: ${permit.fee}</p>}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openViewModal(permit)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {permit.status === 'approved' && (
                  <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Apply for Permit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Permit Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            >
              <option value="business">Business License</option>
              <option value="construction">Construction Permit</option>
              <option value="event">Event Permit</option>
              <option value="vehicle">Vehicle Permit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              placeholder="e.g., Restaurant Business License"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              rows={4}
              placeholder="Provide details about your permit application..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Permit Details">
        {viewingPermit && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getTypeIcon(viewingPermit.type)}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingPermit.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPermit.status)}`}>
                  {(viewingPermit.status || '').replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-800">{viewingPermit.description || 'No description provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingPermit.type} Permit</p>
              </div>
              <div>
                <p className="text-slate-500">Fee</p>
                <p className="text-slate-900">{viewingPermit.fee ? `$${viewingPermit.fee}` : 'TBD'}</p>
              </div>
              <div>
                <p className="text-slate-500">Applied</p>
                <p className="text-slate-900">{viewingPermit.application_date || new Date(viewingPermit.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Expires</p>
                <p className="text-slate-900">{viewingPermit.expiry_date || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}