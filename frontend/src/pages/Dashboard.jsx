import { useAuth } from '../context/AuthContext';
import {
  Users,
  FileText,
  ClipboardList,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Citizens', value: '2,847', icon: Users, trend: 'up', change: '12%' },
    { name: 'Pending Requests', value: '23', icon: FileText, trend: 'down', change: '5%' },
    { name: 'Active Permits', value: '156', icon: ClipboardList, trend: 'up', change: '8%' },
    { name: 'Monthly Revenue', value: '$45,200', icon: CreditCard, trend: 'up', change: '18%' },
  ];

  const recentActivity = [
    { id: 1, action: 'New citizen registered', name: 'Ahmad Hassan', time: '2 min ago' },
    { id: 2, action: 'Permit approved', name: 'Business License #234', time: '15 min ago' },
    { id: 3, action: 'Payment received', name: '$1,200 - Property Tax', time: '1 hour ago' },
    { id: 4, action: 'Request submitted', name: 'Birth Certificate', time: '2 hours ago' },
    { id: 5, action: 'Project updated', name: 'Road Renovation - 75%', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Good morning, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">Here's your municipality overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-slate-600" />
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-800">{item.action}</p>
                  <p className="text-sm text-slate-500">{item.name}</p>
                </div>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">This Month</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Requests Completed</span>
              <span className="text-sm font-medium text-slate-800">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Permits Issued</span>
              <span className="text-sm font-medium text-slate-800">38</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">New Citizens</span>
              <span className="text-sm font-medium text-slate-800">67</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Total Collections</span>
              <span className="text-sm font-medium text-slate-800">$128,400</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Active Projects</span>
              <span className="text-sm font-medium text-slate-800">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Employees Present</span>
              <span className="text-sm font-medium text-slate-800">45/52</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}