import { useState } from 'react';
import { Download, CheckCircle, Clock, CreditCard } from 'lucide-react';
import Modal from '../../components/Modal';

const initialPayments = [
  { id: 1, type: 'property_tax', description: 'Annual Property Tax 2024', amount: 1200, dueDate: '2024-04-30', status: 'pending' },
  { id: 2, type: 'water_bill', description: 'Water Bill - March 2024', amount: 85, dueDate: '2024-04-15', status: 'pending' },
  { id: 3, type: 'waste_fee', description: 'Waste Collection Fee - Q1', amount: 50, dueDate: '2024-03-30', status: 'paid', paidDate: '2024-03-28' },
  { id: 4, type: 'permit_fee', description: 'Business License Fee', amount: 300, dueDate: '2024-03-15', status: 'paid', paidDate: '2024-03-10' },
];

export default function MyPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState('all');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter);

  const pendingTotal = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const openPayModal = (payment) => {
    setSelectedPayment(payment);
    setIsPayModalOpen(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulate payment processing
    setPayments(payments.map(p =>
      p.id === selectedPayment.id
        ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    setIsPayModalOpen(false);
    setCardDetails({ cardNumber: '', expiry: '', cvv: '', name: '' });
    alert('Payment successful! Thank you.');
  };

  const handlePayAll = () => {
    if (window.confirm(`Pay all pending bills ($${pendingTotal})?`)) {
      setPayments(payments.map(p =>
        p.status === 'pending'
          ? { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
          : p
      ));
      alert('All payments successful! Thank you.');
    }
  };

  const formatType = (type) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Payments</h1>
        <p className="text-slate-500 mt-1">View and pay your bills</p>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-900 rounded-lg p-6 text-white">
        <p className="text-slate-400 text-sm">Total Amount Due</p>
        <p className="text-3xl font-semibold mt-1">${pendingTotal.toLocaleString()}</p>
        {pendingTotal > 0 && (
          <button
            onClick={handlePayAll}
            className="mt-4 px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition"
          >
            Pay All Bills
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'paid'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition capitalize ${
              filter === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No payments found</div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {payment.status === 'paid' ? (
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">{payment.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatType(payment.type)} • {payment.status === 'paid' ? `Paid ${payment.paidDate}` : `Due ${payment.dueDate}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm font-semibold text-slate-900">${payment.amount}</p>
                {payment.status === 'pending' ? (
                  <button
                    onClick={() => openPayModal(payment)}
                    className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
                  >
                    Pay Now
                  </button>
                ) : (
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Make Payment">
        {selectedPayment && (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-500">Amount to Pay</p>
              <p className="text-2xl font-semibold text-slate-900">${selectedPayment.amount}</p>
              <p className="text-xs text-slate-400 mt-1">{selectedPayment.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  required
                />
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsPayModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
              >
                Pay ${selectedPayment.amount}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}