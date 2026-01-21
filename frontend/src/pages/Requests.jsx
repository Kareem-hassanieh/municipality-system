import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [formData, setFormData] = useState({
    type: 'certificate',
    subject: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    admin_notes: '',
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests');
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
    const matchesSearch = (req.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.citizen?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.citizen?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || req.type === typeFilter;
    const matchesStatus = !statusFilter || req.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openEditModal = (request) => {
    setEditingRequest(request);
    setFormData({
      type: request.type || 'certificate',
      subject: request.subject || '',
      description: request.description || '',
      status: request.status || 'pending',
      priority: request.priority || 'medium',
      admin_notes: request.admin_notes || '',
    });
    setIsModalOpen(true);
  };

  const openViewModal = (request) => {
    setViewingRequest(request);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/requests/${editingRequest.id}`, {
        status: formData.status,
        priority: formData.priority,
        admin_notes: formData.admin_notes,
      });
      toast.success('Request updated successfully');
      fetchRequests();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error(error.response?.data?.message || 'Error updating request. Please try again.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/requests/${deletingId}`);
      toast.success('Request deleted successfully');
      setIsConfirmOpen(false);
      setDeletingId(null);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error(error.response?.data?.message || 'Error deleting request. Please try again.');
      setIsConfirmOpen(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      in_progress: 'bg-blue-50 text-blue-700',
      completed: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700',
      urgent: 'bg-red-200 text-red-800',
    };
    return styles[priority] || 'bg-slate-100 text-slate-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Citizen Requests</h1>
          <p className="text-slate-500 mt-1">Review and manage citizen requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by subject or citizen name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="certificate">Certificate</option>
            <option value="complaint">Complaint</option>
            <option value="service">Service</option>
            <option value="inquiry">Inquiry</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Citizen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500">No requests found.</td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">{request.subject}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{request.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      {request.citizen ? (
                        <div>
                          <p className="text-sm font-medium text-slate-800">{request.citizen.first_name} {request.citizen.last_name}</p>
                          <p className="text-xs text-slate-500">{request.citizen.national_id}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 capitalize">{request.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getPriorityStyle(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(request.status)}`}>
                        {(request.status || '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{formatDate(request.submission_date)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openViewModal(request)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(request)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteClick(request.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Request">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <input 
              type="text" 
              value={formData.type} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600 capitalize" 
              disabled 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input 
              type="text" 
              value={formData.subject} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600" 
              disabled 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={formData.description} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600" 
              rows={3} 
              disabled 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes</label>
            <textarea 
              value={formData.admin_notes} 
              onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })} 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" 
              rows={2} 
              placeholder="Add notes about this request..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">Update</button>
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
                <p className="text-slate-500">Citizen</p>
                <p className="text-slate-900">
                  {viewingRequest.citizen 
                    ? `${viewingRequest.citizen.first_name} ${viewingRequest.citizen.last_name}` 
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">National ID</p>
                <p className="text-slate-900">{viewingRequest.citizen?.national_id || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingRequest.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Priority</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getPriorityStyle(viewingRequest.priority)}`}>{viewingRequest.priority}</span>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingRequest.status)}`}>{(viewingRequest.status || '').replace('_', ' ')}</span>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="text-slate-900">{formatDate(viewingRequest.submission_date)}</p>
              </div>
            </div>
            {viewingRequest.admin_notes && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Admin Notes</p>
                <p className="text-slate-900 text-sm mt-1">{viewingRequest.admin_notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
      />
    </div>
  );
}