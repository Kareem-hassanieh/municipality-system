import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const initialPermits = [
  { id: 1, title: 'Restaurant Business License', applicant: 'Ahmad Hassan', type: 'business', status: 'approved', fee: 500, issueDate: '2024-03-01', expiryDate: '2025-03-01' },
  { id: 2, title: 'Building Construction Permit', applicant: 'Fatima Ali', type: 'construction', status: 'under_review', fee: 1200, issueDate: '-', expiryDate: '-' },
  { id: 3, title: 'Food Truck License', applicant: 'Omar Khalil', type: 'business', status: 'pending', fee: 300, issueDate: '-', expiryDate: '-' },
  { id: 4, title: 'Public Event Permit', applicant: 'Sara Mansour', type: 'event', status: 'approved', fee: 150, issueDate: '2024-03-15', expiryDate: '2024-04-15' },
  { id: 5, title: 'Vehicle Registration', applicant: 'Mohammad Saad', type: 'vehicle', status: 'rejected', fee: 100, issueDate: '-', expiryDate: '-' },
];

export default function Permits() {
  const [permits, setPermits] = useState(initialPermits);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState(null);
  const [viewingPermit, setViewingPermit] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    applicant: '',
    type: 'business',
    status: 'pending',
    fee: '',
    issueDate: '',
    expiryDate: '',
  });

  const filteredPermits = permits.filter(permit => {
    const matchesSearch = permit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.applicant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || permit.type === typeFilter;
    const matchesStatus = !statusFilter || permit.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddModal = () => {
    setEditingPermit(null);
    setFormData({ title: '', applicant: '', type: 'business', status: 'pending', fee: '', issueDate: '', expiryDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (permit) => {
    setEditingPermit(permit);
    setFormData({
      title: permit.title,
      applicant: permit.applicant,
      type: permit.type,
      status: permit.status,
      fee: permit.fee,
      issueDate: permit.issueDate === '-' ? '' : permit.issueDate,
      expiryDate: permit.expiryDate === '-' ? '' : permit.expiryDate,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (permit) => {
    setViewingPermit(permit);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const permitData = {
      ...formData,
      fee: Number(formData.fee),
      issueDate: formData.issueDate || '-',
      expiryDate: formData.expiryDate || '-',
    };

    if (editingPermit) {
      setPermits(permits.map(p => p.id === editingPermit.id ? { ...p, ...permitData } : p));
    } else {
      setPermits([...permits, { id: Date.now(), ...permitData }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this permit?')) {
      setPermits(permits.filter(p => p.id !== id));
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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Permits</h1>
          <p className="text-slate-500 mt-1">Manage permits and licenses</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Permit
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search permits..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="business">Business</option>
            <option value="construction">Construction</option>
            <option value="vehicle">Vehicle</option>
            <option value="event">Event</option>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Fee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Expiry</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPermits.map((permit) => (
                <tr key={permit.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{permit.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{permit.applicant}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 capitalize">{permit.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">${permit.fee}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(permit.status)}`}>
                      {permit.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{permit.expiryDate}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(permit)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(permit)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(permit.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPermit ? 'Edit Permit' : 'New Permit'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Permit Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Applicant</label>
            <input type="text" value={formData.applicant} onChange={(e) => setFormData({ ...formData, applicant: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="business">Business</option>
                <option value="construction">Construction</option>
                <option value="vehicle">Vehicle</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fee ($)</label>
              <input type="number" value={formData.fee} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
              <input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
              <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">{editingPermit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Permit Details">
        {viewingPermit && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900">{viewingPermit.title}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Applicant</p>
                <p className="text-slate-900">{viewingPermit.applicant}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingPermit.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Fee</p>
                <p className="text-slate-900">${viewingPermit.fee}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPermit.status)}`}>{viewingPermit.status.replace('_', ' ')}</span>
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