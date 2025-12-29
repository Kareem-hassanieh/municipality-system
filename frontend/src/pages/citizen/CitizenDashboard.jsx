import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, ClipboardList, CreditCard, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'My Requests', value: '3', icon: FileText, href: '/citizen/requests' },
    { label: 'My Permits', value: '1', icon: ClipboardList, href: '/citizen/permits' },
    { label: 'Due Payments', value: '$150', icon: CreditCard, href: '/citizen/payments' },
  ];

  const recentRequests = [
    { id: '#REQ-1234', type: 'Birth Certificate', date: 'Apr 1, 2024', status: 'pending' },
    { id: '#REQ-1230', type: 'Residency Certificate', date: 'Mar 25, 2024', status: 'completed' },
  ];

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">
          Manage your requests, permits, and payments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={i}
            to={stat.href}
            className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="w-5 h-5 text-slate-400" />
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-2xl font-semibold text-slate-900 mt-4">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="font-medium text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/citizen/requests/new"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Submit New Request
          </Link>
          <Link
            to="/citizen/permits/new"
            className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Apply for Permit
          </Link>
          <Link
            to="/citizen/payments"
            className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition"
          >
            Pay Bills
          </Link>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-medium text-slate-900">Recent Requests</h2>
          <Link to="/citizen/requests" className="text-sm text-slate-500 hover:text-slate-900">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentRequests.map((req, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(req.status)}
                <div>
                  <p className="text-sm font-medium text-slate-900">{req.type}</p>
                  <p className="text-xs text-slate-400">{req.id} • {req.date}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                req.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                req.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                'bg-red-50 text-red-700'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}