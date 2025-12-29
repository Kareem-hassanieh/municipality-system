import { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingItem, setPayingItem] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/my/payments');
      const data = response.data || [];
      setPayments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'paid') return payment.status === 'completed';
    return true;
  });

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const openPayModal = (payment) => {
    setPayingItem(payment);
    setIsPayModalOpen(true);
  };

  const handlePay = async () => {
    if (!payingItem) return;

    try {
      await api.post(`/my/payments/${payingItem.id}/pay`, {
        payment_method: 'card'
      });
      toast.success('Payment completed successfully');
      setIsPayModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Error processing payment. Please try again.');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      failed: 'bg-red-50 text-red-700',
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Payments</h1>
          <p className="text-slate-500 mt-1">View and pay your bills</p>
        </div>
      </div>

      {/* Summary Card */}
      {totalPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-medium">Total Amount Due</p>
            <p className="text-2xl font-bold text-amber-900">${totalPending.toLocaleString()}</p>
          </div>
          <button
            onClick={() => {
              const pendingPayment = payments.find(p => p.status === 'pending');
              if (pendingPayment) openPayModal(pendingPayment);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'pending', 'paid'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No payments found.
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{formatType(payment.type)}</h3>
                  <p className="text-sm text-slate-500">
                    {payment.reference_number} • {payment.due_date || new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-slate-800">${Number(payment.amount || 0).toLocaleString()}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                {payment.status === 'pending' ? (
                  <button
                    onClick={() => openPayModal(payment)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition"
                  >
                    Pay
                  </button>
                ) : (
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pay Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Complete Payment">
        {payingItem && (
          <div className="space-y-5">
            <div className="text-center pb-5 border-b border-slate-200">
              <p className="text-sm text-slate-500">Amount to Pay</p>
              <p className="text-3xl font-bold text-slate-800">${Number(payingItem.amount || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">{formatType(payingItem.type)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
              >
                Pay ${Number(payingItem.amount || 0).toLocaleString()}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}