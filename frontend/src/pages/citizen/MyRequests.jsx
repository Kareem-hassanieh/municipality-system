import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [formData, setFormData] = useState({
    type: 'certificate',
    subject: '',
    description: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my/requests');
      const data = response.data || [];
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests. Please refresh the page.');
      // Don't clear existing data on error to prevent appearing like data disappeared
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/my/requests', formData);
      toast.success('Request submitted successfully');
      fetchRequests();
      setIsModalOpen(false);
      setFormData({ type: 'certificate', subject: '', description: '' });
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Error submitting request. Please try again.');
    }
  };

  const openViewModal = (request) => {
    setViewingRequest(request);
    setIsViewModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      in_progress: 'bg-blue-50 text-blue-700',
      completed: 'bg-emerald-50 text-emerald-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Requests</h1>
          <p className="text-slate-500 mt-1">Track your submitted requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'pending', 'in_progress', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'all' ? 'All' : tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No requests found. Submit your first request!
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(request.status)}
                <div>
                  <h3 className="font-medium text-slate-800">{request.subject}</h3>
                  <p className="text-sm text-slate-500">
                    {request.type} • {request.submission_date || new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(request.status)}`}>
                  {(request.status || '').replace('_', ' ')}
                </span>
                <button
                  onClick={() => openViewModal(request)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
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
              <option value="certificate">Certificate</option>
              <option value="complaint">Complaint</option>
              <option value="service">Service Request</option>
              <option value="inquiry">General Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              placeholder="Brief description of your request"
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
              placeholder="Provide details about your request..."
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
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* View Request Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Request Details">
        {viewingRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(viewingRequest.status)}
              <div>
                <h3 className="font-semibold text-slate-900">{viewingRequest.subject}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingRequest.status)}`}>
                  {(viewingRequest.status || '').replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-800">{viewingRequest.description || 'No description provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingRequest.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority</p>
                <p className="text-slate-900 capitalize">{viewingRequest.priority || 'Medium'}</p>
              </div>
              <div>
                <p className="text-slate-500">Submitted</p>
                <p className="text-slate-900">{viewingRequest.submission_date || new Date(viewingRequest.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Completed</p>
                <p className="text-slate-900">{viewingRequest.completion_date || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}