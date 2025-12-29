import { useState } from 'react';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const paymentsData = [
  { id: '#PAY-0892', type: 'Property Tax', amount: '$1,200', dueDate: 'Apr 30, 2024', status: 'pending' },
  { id: '#PAY-0845', type: 'Water Bill', amount: '$85', dueDate: 'Apr 15, 2024', status: 'pending' },
  { id: '#PAY-0801', type: 'Waste Fee', amount: '$50', dueDate: 'Mar 30, 2024', status: 'paid', paidDate: 'Mar 28, 2024' },
  { id: '#PAY-0756', type: 'Permit Fee', amount: '$300', dueDate: 'Mar 15, 2024', status: 'paid', paidDate: 'Mar 10, 2024' },
];

export default function MyPayments() {
  const [filter, setFilter] = useState('all');

  const filteredPayments = filter === 'all'
    ? paymentsData
    : paymentsData.filter(p => p.status === filter);

  const pendingTotal = paymentsData
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0);

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
        <button className="mt-4 px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition">
          Pay All Bills
        </button>
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
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {payment.status === 'paid' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">{payment.type}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {payment.id} • {payment.status === 'paid' ? `Paid ${payment.paidDate}` : `Due ${payment.dueDate}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-slate-900">{payment.amount}</p>
              {payment.status === 'pending' ? (
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition">
                  Pay Now
                </button>
              ) : (
                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}