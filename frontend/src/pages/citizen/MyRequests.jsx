import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Eye, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import api from '../../services/api';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [formData, setFormData] = useState({
    type: 'certificate',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate timeline based on current status
  const getTimeline = (request) => {
    const statusOrder = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(request.status);
    
    // Handle rejected/cancelled separately
    if (request.status === 'rejected' || request.status === 'cancelled') {
      return [
        { 
          status: 'Submitted', 
          completed: true, 
          date: request.submission_date || request.created_at,
          icon: CheckCircle,
          color: 'text-emerald-500'
        },
        { 
          status: request.status === 'rejected' ? 'Rejected' : 'Cancelled', 
          completed: true, 
          date: request.updated_at,
          icon: XCircle,
          color: 'text-red-500'
        },
      ];
    }

    return [
      { 
        status: 'Submitted', 
        completed: currentIndex >= 0, 
        date: request.submission_date || request.created_at,
        icon: currentIndex >= 0 ? CheckCircle : Clock,
        color: currentIndex >= 0 ? 'text-emerald-500' : 'text-slate-300'
      },
      { 
        status: 'In Progress', 
        completed: currentIndex >= 1, 
        date: currentIndex >= 1 ? request.updated_at : null,
        icon: currentIndex >= 1 ? CheckCircle : Clock,
        color: currentIndex >= 1 ? 'text-emerald-500' : 'text-slate-300'
      },
      { 
        status: 'Completed', 
        completed: currentIndex >= 2, 
        date: request.completion_date,
        icon: currentIndex >= 2 ? CheckCircle : Clock,
        color: currentIndex >= 2 ? 'text-emerald-500' : 'text-slate-300'
      },
    ];
  };

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
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await api.post('/my/requests', {
        type: formData.type,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
      });
      toast.success('Request submitted successfully');
      fetchRequests();
      setIsModalOpen(false);
      setFormData({ type: 'certificate', subject: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Error submitting request. Please try again.');
    }
  };

  const openViewModal = (request) => {
    setViewingRequest(request);
    setIsViewModalOpen(true);
  };

  const handleCancelClick = (id) => {
    setCancellingId(id);
    setIsConfirmOpen(true);
  };

  const handleCancelRequest = async () => {
    try {
      await api.put(`/my/requests/${cancellingId}/cancel`);
      toast.success('Request cancelled successfully');
      setIsConfirmOpen(false);
      setCancellingId(null);
      fetchRequests();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error(error.response?.data?.message || 'Error cancelling request. Please try again.');
      setIsConfirmOpen(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      in_progress: 'bg-blue-50 text-blue-700',
      completed: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
      cancelled: 'bg-slate-100 text-slate-600',
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
                    {request.type} • {formatDate(request.submission_date || request.created_at)}
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
                {request.status === 'pending' && (
                  <button
                    onClick={() => handleCancelClick(request.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"
                    title="Cancel Request"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setErrors({}); }} title="Submit New Request">
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
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value });
                if (errors.subject) setErrors({ ...errors, subject: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.subject ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="Brief description of your request"
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
              rows={4}
              placeholder="Provide details about your request..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setErrors({}); }}
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

      {/* View Request Modal with Timeline */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Request Details">
        {viewingRequest && (
          <div className="space-y-5">
            {/* Request Info */}
            <div className="flex items-center gap-3">
              {getStatusIcon(viewingRequest.status)}
              <div>
                <h3 className="font-semibold text-slate-900">{viewingRequest.subject}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingRequest.status)}`}>
                  {(viewingRequest.status || '').replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-4">Status Timeline</p>
              <div className="relative">
                {getTimeline(viewingRequest).map((step, index, arr) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    {/* Line and Icon */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                      {index < arr.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 ${step.completed ? 'bg-emerald-200' : 'bg-slate-200'}`}></div>
                      )}
                    </div>
                    {/* Content */}
                    <div className="pt-1">
                      <p className={`font-medium ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.status}
                      </p>
                      <p className="text-sm text-slate-500">
                        {step.date ? formatDateTime(step.date) : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-800">{viewingRequest.description || 'No description provided'}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingRequest.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority</p>
                <p className="text-slate-900 capitalize">{viewingRequest.priority || 'Medium'}</p>
              </div>
            </div>

            {/* Admin Notes */}
            {viewingRequest.admin_notes && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Admin Notes</p>
                <p className="text-slate-800 text-sm mt-1 bg-slate-50 p-3 rounded-lg">{viewingRequest.admin_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCancelRequest}
        title="Cancel Request"
        message="Are you sure you want to cancel this request? This action cannot be undone."
      />
    </div>
  );
}