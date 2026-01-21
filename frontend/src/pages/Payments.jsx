import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import api from '../services/api';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [formData, setFormData] = useState({
    citizen_id: '',
    type: 'property_tax',
    description: '',
    amount: '',
    due_date: '',
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
    fetchPayments();
    fetchCitizens();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      const data = response.data || [];
      setPayments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setLoading(false);
    }
  };

  const fetchCitizens = async () => {
    try {
      const response = await api.get('/citizens');
      const data = response.data || [];
      setCitizens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching citizens:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.reference_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.citizen?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.citizen?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || payment.type === typeFilter;
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const openAddModal = () => {
    setFormData({ citizen_id: '', type: 'property_tax', description: '', amount: '', due_date: '' });
    setIsModalOpen(true);
  };

  const openViewModal = (payment) => {
    setViewingPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        citizen_id: formData.citizen_id ? Number(formData.citizen_id) : null,
        type: formData.type,
        description: formData.description,
        amount: Number(formData.amount),
        due_date: formData.due_date || null,
        status: 'pending',
      };
      await api.post('/payments', dataToSend);
      toast.success('Bill created successfully');
      fetchPayments();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.message || 'Error creating bill. Please try again.');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      failed: 'bg-red-50 text-red-700',
      refunded: 'bg-slate-100 text-slate-600',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const formatType = (type) => {
    return (type || '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Payments & Bills</h1>
          <p className="text-slate-500 mt-1">Create bills and track payments</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Bill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">${totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Transactions</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{payments.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by reference or citizen name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="property_tax">Property Tax</option>
            <option value="water_bill">Water Bill</option>
            <option value="permit_fee">Permit Fee</option>
            <option value="waste_fee">Waste Fee</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Reference</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Citizen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-800 font-mono">{payment.reference_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      {payment.citizen ? (
                        <div>
                          <p className="text-sm font-medium text-slate-800">{payment.citizen.first_name} {payment.citizen.last_name}</p>
                          <p className="text-xs text-slate-500">{payment.citizen.national_id}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{formatType(payment.type)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-800">${Number(payment.amount || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{formatDate(payment.due_date)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openViewModal(payment)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Bill">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen <span className="text-red-500">*</span></label>
            <select
              value={formData.citizen_id}
              onChange={(e) => setFormData({ ...formData, citizen_id: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            >
              <option value="">Select Citizen</option>
              {citizens.map((citizen) => (
                <option key={citizen.id} value={citizen.id}>
                  {citizen.first_name} {citizen.last_name} ({citizen.national_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
              <option value="property_tax">Property Tax</option>
              <option value="water_bill">Water Bill</option>
              <option value="permit_fee">Permit Fee</option>
              <option value="waste_fee">Waste Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" placeholder="e.g., Water bill for January 2025" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) <span className="text-red-500">*</span></label>
              <input type="number" min="1" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date <span className="text-red-500">*</span></label>
              <input type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded">💡 Status will be set to "Pending". Citizen will pay through their portal.</p>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">Create Bill</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
        {viewingPayment && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-200">
              <p className="text-sm text-slate-500">Amount</p>
              <p className="text-3xl font-semibold text-slate-900">${Number(viewingPayment.amount || 0).toLocaleString()}</p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize mt-2 ${getStatusStyle(viewingPayment.status)}`}>{viewingPayment.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Reference</p>
                <p className="text-slate-900 font-mono">{viewingPayment.reference_number}</p>
              </div>
              <div>
                <p className="text-slate-500">Citizen</p>
                <p className="text-slate-900">
                  {viewingPayment.citizen
                    ? `${viewingPayment.citizen.first_name} ${viewingPayment.citizen.last_name}`
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900">{formatType(viewingPayment.type)}</p>
              </div>
              <div>
                <p className="text-slate-500">Payment Method</p>
                <p className="text-slate-900 capitalize">{viewingPayment.payment_method || 'Not paid yet'}</p>
              </div>
              <div>
                <p className="text-slate-500">Due Date</p>
                <p className="text-slate-900">{formatDate(viewingPayment.due_date)}</p>
              </div>
              <div>
                <p className="text-slate-500">Payment Date</p>
                <p className="text-slate-900">{formatDate(viewingPayment.payment_date)}</p>
              </div>
            </div>
            {viewingPayment.description && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Description</p>
                <p className="text-slate-900 text-sm mt-1">{viewingPayment.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}