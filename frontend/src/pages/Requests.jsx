import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const initialRequests = [
  { id: 1, citizen: 'Ahmad Hassan', type: 'certificate', subject: 'Birth Certificate Request', description: 'Need birth certificate for passport application', status: 'pending', priority: 'medium', date: '2024-04-01' },
  { id: 2, citizen: 'Fatima Ali', type: 'complaint', subject: 'Street Light Not Working', description: 'Street light on main road has been off for a week', status: 'in_progress', priority: 'high', date: '2024-04-02' },
  { id: 3, citizen: 'Omar Khalil', type: 'service', subject: 'Garbage Collection Issue', description: 'Garbage not collected for 3 days', status: 'completed', priority: 'medium', date: '2024-03-28' },
  { id: 4, citizen: 'Sara Mansour', type: 'certificate', subject: 'Marriage Certificate', description: 'Request for marriage certificate copy', status: 'approved', priority: 'low', date: '2024-03-25' },
  { id: 5, citizen: 'Mohammad Saad', type: 'inquiry', subject: 'Property Tax Information', description: 'Need information about property tax rates', status: 'pending', priority: 'low', date: '2024-04-03' },
];

export default function Requests() {
  const [requests, setRequests] = useState(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewingRequest, setViewingRequest] = useState(null);
  const [formData, setFormData] = useState({
    citizen: '',
    type: 'certificate',
    subject: '',
    description: '',
    status: 'pending',
    priority: 'medium',
  });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.citizen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || req.type === typeFilter;
    const matchesStatus = !statusFilter || req.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({ citizen: '', type: 'certificate', subject: '', description: '', status: 'pending', priority: 'medium' });
    setIsModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditingRequest(request);
    setFormData({
      citizen: request.citizen,
      type: request.type,
      subject: request.subject,
      description: request.description,
      status: request.status,
      priority: request.priority,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (request) => {
    setViewingRequest(request);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRequest) {
      setRequests(requests.map(r => r.id === editingRequest.id ? { ...r, ...formData } : r));
    } else {
      const newRequest = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      setRequests([...requests, newRequest]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(requests.filter(r => r.id !== id));
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

  const getPriorityStyle = (priority) => {
    const styles = {
      low: 'bg-slate-100 text-slate-600',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700',
      urgent: 'bg-red-200 text-red-800',
    };
    return styles[priority] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Requests</h1>
          <p className="text-slate-500 mt-1">Manage citizen requests and complaints</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
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
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Request</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Citizen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{request.subject}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{request.citizen}</span>
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
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{request.date}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(request)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(request)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(request.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRequest ? 'Edit Request' : 'New Request'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen Name</label>
            <input type="text" value={formData.citizen} onChange={(e) => setFormData({ ...formData, citizen: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
              <option value="certificate">Certificate</option>
              <option value="complaint">Complaint</option>
              <option value="service">Service</option>
              <option value="inquiry">Inquiry</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" rows={3} />
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
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">{editingRequest ? 'Update' : 'Create'}</button>
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
                <p className="text-slate-900">{viewingRequest.citizen}</p>
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
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingRequest.status)}`}>{viewingRequest.status.replace('_', ' ')}</span>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="text-slate-900">{viewingRequest.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}