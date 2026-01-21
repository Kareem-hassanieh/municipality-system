import { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Permits() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingPermit, setEditingPermit] = useState(null);
  const [viewingPermit, setViewingPermit] = useState(null);
  const [formData, setFormData] = useState({
    type: 'business',
    title: '',
    description: '',
    status: 'pending',
    fee: '',
    expiry_date: '',
    rejection_reason: '',
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
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/permits');
      const data = response.data || [];
      setPermits(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permits:', error);
      toast.error('Failed to load permits. Please refresh the page.');
      setLoading(false);
    }
  };

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = (permit.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permit.citizen?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (permit.citizen?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || permit.type === typeFilter;
    const matchesStatus = !statusFilter || permit.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openEditModal = (permit) => {
    setEditingPermit(permit);
    setFormData({
      type: permit.type || 'business',
      title: permit.title || '',
      description: permit.description || '',
      status: permit.status || 'pending',
      fee: permit.fee || '',
      expiry_date: permit.expiry_date || '',
      rejection_reason: permit.rejection_reason || '',
    });
    setIsModalOpen(true);
  };

  const openViewModal = (permit) => {
    setViewingPermit(permit);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: if rejecting, require reason
    if (formData.status === 'rejected' && !formData.rejection_reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    // Validation: if approving, require fee and expiry date
    if (formData.status === 'approved') {
      if (!formData.fee || Number(formData.fee) <= 0) {
        toast.error('Please set a fee for this permit');
        return;
      }
      if (!formData.expiry_date) {
        toast.error('Please set an expiry date for this permit');
        return;
      }
    }

    try {
      await api.put(`/permits/${editingPermit.id}`, {
        status: formData.status,
        fee: formData.fee ? Number(formData.fee) : null,
        expiry_date: formData.expiry_date || null,
        rejection_reason: formData.status === 'rejected' ? formData.rejection_reason : null,
      });
      toast.success('Permit updated successfully');
      fetchPermits();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating permit:', error);
      toast.error(error.response?.data?.message || 'Error updating permit. Please try again.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/permits/${deletingId}`);
      toast.success('Permit deleted successfully');
      setIsConfirmOpen(false);
      setDeletingId(null);
      fetchPermits();
    } catch (error) {
      console.error('Error deleting permit:', error);
      toast.error(error.response?.data?.message || 'Error deleting permit. Please try again.');
      setIsConfirmOpen(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading permits...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Permit Applications</h1>
          <p className="text-slate-500 mt-1">Review and approve permit applications</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by title or citizen name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="business">Business</option>
            <option value="construction">Construction</option>
            <option value="event">Event</option>
            <option value="vehicle">Vehicle</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Permit</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Citizen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Fee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPermits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500">No permit applications found.</td>
                </tr>
              ) : (
                filteredPermits.map((permit) => (
                  <tr key={permit.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">{permit.title}</p>
                      <p className="text-xs text-slate-500 truncate max-w-xs">{permit.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      {permit.citizen ? (
                        <div>
                          <p className="text-sm font-medium text-slate-800">{permit.citizen.first_name} {permit.citizen.last_name}</p>
                          <p className="text-xs text-slate-500">{permit.citizen.national_id}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 capitalize">{permit.type}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{permit.fee ? `$${permit.fee}` : '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(permit.status)}`}>
                        {(permit.status || '').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{formatDate(permit.expiry_date)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openViewModal(permit)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(permit)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteClick(permit.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Review Permit Application">
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              value={formData.title} 
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          {/* Show fee and expiry date fields when approving */}
          {(formData.status === 'approved' || formData.status === 'under_review') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fee ($) {formData.status === 'approved' && <span className="text-red-500">*</span>}</label>
                <input 
                  type="number" 
                  min="0"
                  value={formData.fee} 
                  onChange={(e) => setFormData({ ...formData, fee: e.target.value })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" 
                  placeholder="Enter fee amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date {formData.status === 'approved' && <span className="text-red-500">*</span>}</label>
                <input 
                  type="date" 
                  value={formData.expiry_date} 
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" 
                />
              </div>
            </div>
          )}

          {/* Show rejection reason when rejecting */}
          {formData.status === 'rejected' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rejection Reason <span className="text-red-500">*</span></label>
              <textarea 
                value={formData.rejection_reason} 
                onChange={(e) => setFormData({ ...formData, rejection_reason: e.target.value })} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" 
                rows={2} 
                placeholder="Explain why this permit is being rejected..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">Update</button>
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
                <p className="text-slate-500">Citizen</p>
                <p className="text-slate-900">
                  {viewingPermit.citizen 
                    ? `${viewingPermit.citizen.first_name} ${viewingPermit.citizen.last_name}` 
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">National ID</p>
                <p className="text-slate-900">{viewingPermit.citizen?.national_id || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingPermit.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Fee</p>
                <p className="text-slate-900">{viewingPermit.fee ? `$${viewingPermit.fee}` : '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPermit.status)}`}>{(viewingPermit.status || '').replace('_', ' ')}</span>
              </div>
              <div>
                <p className="text-slate-500">Expiry Date</p>
                <p className="text-slate-900">{formatDate(viewingPermit.expiry_date)}</p>
              </div>
              <div>
                <p className="text-slate-500">Applied</p>
                <p className="text-slate-900">{formatDate(viewingPermit.application_date || viewingPermit.created_at)}</p>
              </div>
            </div>
            {viewingPermit.rejection_reason && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Rejection Reason</p>
                <p className="text-red-600 text-sm mt-1">{viewingPermit.rejection_reason}</p>
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
        title="Delete Permit"
        message="Are you sure you want to delete this permit application? This action cannot be undone."
      />
    </div>
  );
}