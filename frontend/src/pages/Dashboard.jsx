import { useAuth } from '../context/AuthContext';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Citizens', value: '2,847', change: '+12.5%', up: true },
    { label: 'Pending Requests', value: '23', change: '-5.2%', up: false },
    { label: 'Active Permits', value: '156', change: '+8.1%', up: true },
    { label: 'Revenue', value: '$45.2k', change: '+18.2%', up: true },
  ];

  const requests = [
    { id: '#REQ-2847', type: 'Birth Certificate', from: 'Ahmad Hassan', time: '2m ago', status: 'new' },
    { id: '#REQ-2846', type: 'Street Repair', from: 'Fatima Ali', time: '1h ago', status: 'in_progress' },
    { id: '#REQ-2845', type: 'Business Permit', from: 'Omar Khalil', time: '3h ago', status: 'done' },
  ];

  const quickActions = [
    { label: 'New Request', href: '/requests', color: 'bg-slate-900 text-white' },
    { label: 'Issue Permit', href: '/permits', color: 'bg-white text-slate-900 border border-slate-200' },
    { label: 'Add Payment', href: '/payments', color: 'bg-white text-slate-900 border border-slate-200' },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">Good morning</p>
          <h1 className="text-xl font-semibold text-slate-900 mt-0.5">{user?.name}</h1>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${action.color} hover:opacity-90`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
              <div className={`flex items-center text-sm ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.up ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Requests - Takes 2 columns */}
        <div className="col-span-2 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-medium text-slate-900">Recent Requests</h2>
            <Link to="/requests" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">ID</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">From</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req, i) => (
                <tr key={i} className="text-sm">
                  <td className="px-5 py-3 font-mono text-slate-600">{req.id}</td>
                  <td className="px-5 py-3 text-slate-900">{req.type}</td>
                  <td className="px-5 py-3 text-slate-500">{req.from}</td>
                  <td className="px-5 py-3 text-slate-400">{req.time}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      req.status === 'new' ? 'bg-blue-50 text-blue-700' :
                      req.status === 'in_progress' ? 'bg-amber-50 text-amber-700' :
                      'bg-emerald-50 text-emerald-700'
                    }`}>
                      {req.status === 'new' ? 'New' : req.status === 'in_progress' ? 'In Progress' : 'Done'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity - Takes 1 column */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-medium text-slate-900">Activity</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { text: 'New citizen registered', time: '2m ago' },
              { text: 'Permit #234 approved', time: '15m ago' },
              { text: 'Payment received $1,200', time: '1h ago' },
              { text: 'Project milestone completed', time: '2h ago' },
              { text: 'New complaint submitted', time: '3h ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5"></div>
                <div>
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}