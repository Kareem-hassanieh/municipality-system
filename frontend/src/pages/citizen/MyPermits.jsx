import { useState } from 'react';
import { Plus, Eye, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const initialPermits = [
  { id: 1, type: 'business', title: 'Coffee Shop License', description: 'Business license for coffee shop on Main Street', issueDate: '2024-01-15', expiryDate: '2025-01-15', status: 'active' },
  { id: 2, type: 'construction', title: 'Home Renovation', description: 'Permit for kitchen and bathroom renovation', issueDate: '-', expiryDate: '-', status: 'pending' },
  { id: 3, type: 'event', title: 'Birthday Party', description: 'Public event permit for outdoor birthday party', issueDate: '2024-03-01', expiryDate: '2024-03-05', status: 'expired' },
];

export default function MyPermits() {
  const [permits, setPermits] = useState(initialPermits);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPermit, setViewingPermit] = useState(null);
  const [formData, setFormData] = useState({
    type: 'business',
    title: '',
    description: '',
  });

  const filteredPermits = filter === 'all'
    ? permits
    : permits.filter(p => p.status === filter);

  const openViewModal = (permit) => {
    setViewingPermit(permit);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPermit = {
      id: Date.now(),
      ...formData,
      issueDate: '-',
      expiryDate: '-',
      status: 'pending',
    };
    setPermits([newPermit, ...permits]);
    setIsModalOpen(false);
    setFormData({ type: 'business', title: '', description: '' });
  };

  const getStatusStyle = (status) => {
    if (status === 'active') return 'bg-emerald-50 text-emerald-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    if (status === 'expired') return 'bg-slate-100 text-slate-600';
    return 'bg-red-50 text-red-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'active') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Permits</h1>
          <p className="text-slate-500 mt-1">View and apply for permits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          Apply for Permit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'pending', 'expired'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition capitalize ${
              filter === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Permits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPermits.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No permits found
          </div>
        ) : (
          filteredPermits.map((permit) => (
            <div key={permit.id} className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(permit.status)}
                  <div>
                    <p className="text-sm font-medium text-slate-900">{permit.title}</p>
                    <p className="text-xs text-slate-400">#{permit.id}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusStyle(permit.status)}`}>
                  {permit.status}
                </span>
              </div>

              <p className="text-sm text-slate-500 mb-4">{permit.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-900 capitalize">{permit.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issue Date</span>
                  <span className="text-slate-900">{permit.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expiry Date</span>
                  <span className="text-slate-900">{permit.expiryDate}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openViewModal(permit)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {permit.status === 'active' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
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
              placeholder="e.g., Restaurant Business License"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe what the permit is for..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              rows={4}
              required
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
              className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
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
            <div>
              <h3 className="font-semibold text-slate-900">{viewingPermit.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{viewingPermit.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingPermit.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPermit.status)}`}>
                  {viewingPermit.status}
                </span>
              </div>
              <div>
                <p className="text-slate-500">Issue Date</p>
                <p className="text-slate-900">{viewingPermit.issueDate}</p>
              </div>
              <div>
                <p className="text-slate-500">Expiry Date</p>
                <p className="text-slate-900">{viewingPermit.expiryDate}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}