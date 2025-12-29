import { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import Modal from '../../components/Modal';

const initialRequests = [
  { id: 1, type: 'certificate', subject: 'Birth Certificate Request', description: 'Need birth certificate for passport application', date: '2024-04-01', status: 'pending' },
  { id: 2, type: 'certificate', subject: 'Residency Certificate', description: 'Proof of residence for bank', date: '2024-03-25', status: 'completed' },
  { id: 3, type: 'complaint', subject: 'Street Light Not Working', description: 'Street light on main road has been off for a week', date: '2024-03-20', status: 'in_progress' },
  { id: 4, type: 'service', subject: 'Garbage Collection', description: 'Missed pickup on Tuesday', date: '2024-03-15', status: 'completed' },
];

export default function MyRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [formData, setFormData] = useState({
    type: 'certificate',
    subject: '',
    description: '',
  });

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const openViewModal = (request) => {
    setViewingRequest(request);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    setFormData({ type: 'certificate', subject: '', description: '' });
  };

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'in_progress') return <AlertCircle className="w-4 h-4 text-blue-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusStyle = (status) => {
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    if (status === 'completed') return 'bg-emerald-50 text-emerald-700';
    if (status === 'in_progress') return 'bg-blue-50 text-blue-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1">Track and manage your requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition capitalize ${
              filter === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No requests found</div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="p-5 flex items-center justify-between">
              <div className="flex items-start gap-4">
                {getStatusIcon(request.status)}
                <div>
                  <p className="text-sm font-medium text-slate-900">{request.subject}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{request.description}</p>
                  <p className="text-xs text-slate-400 mt-1">#{request.id} • {request.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusStyle(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
                <button
                  onClick={() => openViewModal(request)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit New Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Request Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            >
              <option value="certificate">Certificate (Birth, Marriage, Residency)</option>
              <option value="complaint">Complaint</option>
              <option value="service">Service Request</option>
              <option value="inquiry">Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief title for your request"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please provide details about your request..."
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
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Request Details">
        {viewingRequest && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">{viewingRequest.subject}</h3>
              <p className="text-sm text-slate-500 mt-1">{viewingRequest.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingRequest.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingRequest.status)}`}>
                  {viewingRequest.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-slate-500">Request ID</p>
                <p className="text-slate-900">#{viewingRequest.id}</p>
              </div>
              <div>
                <p className="text-slate-500">Date Submitted</p>
                <p className="text-slate-900">{viewingRequest.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}