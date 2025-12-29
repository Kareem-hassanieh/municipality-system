import { useState } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const requestsData = [
  { id: '#REQ-1234', type: 'Birth Certificate', description: 'Request for birth certificate copy', date: 'Apr 1, 2024', status: 'pending' },
  { id: '#REQ-1230', type: 'Residency Certificate', description: 'Proof of residence for bank', date: 'Mar 25, 2024', status: 'completed' },
  { id: '#REQ-1225', type: 'Street Repair', description: 'Pothole on main street near house', date: 'Mar 20, 2024', status: 'in_progress' },
  { id: '#REQ-1220', type: 'Garbage Collection', description: 'Missed pickup on Tuesday', date: 'Mar 15, 2024', status: 'completed' },
];

export default function MyRequests() {
  const [filter, setFilter] = useState('all');

  const filteredRequests = filter === 'all' 
    ? requestsData 
    : requestsData.filter(r => r.status === filter);

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 'in_progress') return <AlertCircle className="w-4 h-4 text-blue-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusStyle = (status) => {
    if (status === 'pending') return 'bg-amber-50 text-amber-700';
    if (status === 'completed') return 'bg-emerald-50 text-emerald-700';
    if (status === 'in_progress') return 'bg-blue-50 text-blue-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1">Track and manage your requests</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition">
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition capitalize ${
              filter === status
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
        {filteredRequests.map((request) => (
          <div key={request.id} className="p-5 flex items-center justify-between">
            <div className="flex items-start gap-4">
              {getStatusIcon(request.status)}
              <div>
                <p className="text-sm font-medium text-slate-900">{request.type}</p>
                <p className="text-sm text-slate-500 mt-0.5">{request.description}</p>
                <p className="text-xs text-slate-400 mt-1">{request.id} • {request.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusStyle(request.status)}`}>
                {request.status.replace('_', ' ')}
              </span>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}