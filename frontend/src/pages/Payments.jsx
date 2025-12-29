import { useState } from 'react';
import { Plus, Search, Eye, Download } from 'lucide-react';
import Modal from '../components/Modal';

const initialPayments = [
  { id: 1, reference: 'PAY-2024-001', citizen: 'Ahmad Hassan', type: 'property_tax', amount: 1200, status: 'completed', method: 'card', date: '2024-04-01' },
  { id: 2, reference: 'PAY-2024-002', citizen: 'Fatima Ali', type: 'water_bill', amount: 85, status: 'completed', method: 'cash', date: '2024-04-02' },
  { id: 3, reference: 'PAY-2024-003', citizen: 'Omar Khalil', type: 'permit_fee', amount: 300, status: 'pending', method: '-', date: '2024-04-03' },
  { id: 4, reference: 'PAY-2024-004', citizen: 'Sara Mansour', type: 'waste_fee', amount: 50, status: 'completed', method: 'online', date: '2024-03-28' },
  { id: 5, reference: 'PAY-2024-005', citizen: 'Mohammad Saad', type: 'property_tax', amount: 2400, status: 'failed', method: 'card', date: '2024-03-25' },
];

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);
  const [formData, setFormData] = useState({
    citizen: '',
    type: 'property_tax',
    amount: '',
    status: 'pending',
    method: 'cash',
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.citizen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || payment.type === typeFilter;
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  const openAddModal = () => {
    setFormData({ citizen: '', type: 'property_tax', amount: '', status: 'pending', method: 'cash' });
    setIsModalOpen(true);
  };

  const openViewModal = (payment) => {
    setViewingPayment(payment);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: Date.now(),
      reference: `PAY-2024-${String(payments.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: Number(formData.amount),
      date: new Date().toISOString().split('T')[0],
    };
    setPayments([...payments, newPayment]);
    setIsModalOpen(false);
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
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Payments</h1>
          <p className="text-slate-500 mt-1">Track and manage payments</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">${totalCollected.toLocaleString()}</p>
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
            <input type="text" placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Method</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-800 font-mono">{payment.reference}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{payment.citizen}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{formatType(payment.type)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-800">${payment.amount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 capitalize">{payment.method}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{payment.date}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Payment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Citizen Name</label>
            <input type="text" value={formData.citizen} onChange={(e) => setFormData({ ...formData, citizen: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">Record</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Payment Details">
        {viewingPayment && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-slate-200">
              <p className="text-sm text-slate-500">Amount</p>
              <p className="text-3xl font-semibold text-slate-900">${viewingPayment.amount}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Reference</p>
                <p className="text-slate-900 font-mono">{viewingPayment.reference}</p>
              </div>
              <div>
                <p className="text-slate-500">Citizen</p>
                <p className="text-slate-900">{viewingPayment.citizen}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900">{formatType(viewingPayment.type)}</p>
              </div>
              <div>
                <p className="text-slate-500">Method</p>
                <p className="text-slate-900 capitalize">{viewingPayment.method}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPayment.status)}`}>{viewingPayment.status}</span>
              </div>
              <div>
                <p className="text-slate-500">Date</p>
                <p className="text-slate-900">{viewingPayment.date}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}