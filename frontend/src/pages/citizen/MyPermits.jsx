import { useState } from 'react';
import { Plus, Eye, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

const permitsData = [
  { id: '#PRM-0045', type: 'Business License', business: 'Coffee Shop', issueDate: 'Jan 15, 2024', expiryDate: 'Jan 15, 2025', status: 'active' },
  { id: '#PRM-0032', type: 'Construction Permit', business: 'Home Renovation', issueDate: '-', expiryDate: '-', status: 'pending' },
  { id: '#PRM-0028', type: 'Event Permit', business: 'Birthday Party', issueDate: 'Mar 1, 2024', expiryDate: 'Mar 5, 2024', status: 'expired' },
];

export default function MyPermits() {
  const [filter, setFilter] = useState('all');

  const filteredPermits = filter === 'all'
    ? permitsData
    : permitsData.filter(p => p.status === filter);

  const getStatusStyle = (status) => {
    if (status === 'active') return 'bg-emerald-50 text-emerald-700';
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    if (status === 'expired') return 'bg-slate-100 text-slate-600';
    return 'bg-red-50 text-red-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'active') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Permits</h1>
          <p className="text-slate-500 mt-1">View and apply for permits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition">
          <Plus className="w-4 h-4" />
          Apply for Permit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'pending', 'expired'].map((status) => (
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

      {/* Permits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPermits.map((permit) => (
          <div key={permit.id} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(permit.status)}
                <div>
                  <p className="text-sm font-medium text-slate-900">{permit.type}</p>
                  <p className="text-xs text-slate-400">{permit.id}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusStyle(permit.status)}`}>
                {permit.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">For</span>
                <span className="text-slate-900">{permit.business}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Issue Date</span>
                <span className="text-slate-900">{permit.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiry Date</span>
                <span className="text-slate-900">{permit.expiryDate}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
                <Eye className="w-4 h-4" />
                View
              </button>
              {permit.status === 'active' && (
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}