import { useState, useEffect } from 'react';
import { FileText, FolderOpen, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    requests: 0,
    pendingRequests: 0,
    permits: 0,
    activePermits: 0,
    pendingPayments: 0,
    pendingAmount: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [requests, permits, payments] = await Promise.all([
        api.get('/my/requests'),
        api.get('/my/permits'),
        api.get('/my/payments'),
      ]);

      const requestsData = requests.data || [];
      const permitsData = permits.data || [];
      const paymentsData = payments.data || [];

      setStats({
        requests: requestsData.length,
        pendingRequests: requestsData.filter(r => r.status === 'pending').length,
        permits: permitsData.length,
        activePermits: permitsData.filter(p => p.status === 'approved').length,
        pendingPayments: paymentsData.filter(p => p.status === 'pending').length,
        pendingAmount: paymentsData.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount || 0), 0),
      });

      // Combine recent activity
      const activity = [
        ...requestsData.slice(0, 3).map(r => ({ ...r, activityType: 'request' })),
        ...permitsData.slice(0, 2).map(p => ({ ...p, activityType: 'permit' })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

      setRecentActivity(activity);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'approved') {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    } else if (status === 'in_progress' || status === 'under_review') {
      return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
    return <Clock className="w-5 h-5 text-amber-500" />;
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      in_progress: 'bg-blue-50 text-blue-700',
      under_review: 'bg-blue-50 text-blue-700',
      completed: 'bg-emerald-50 text-emerald-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Welcome Back!</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link to="/citizen/requests" className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">My Requests</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.requests}</p>
              <p className="text-xs text-amber-600 mt-1">{stats.pendingRequests} pending</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </Link>

        <Link to="/citizen/permits" className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">My Permits</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.permits}</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.activePermits} active</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Link>

        <Link to="/citizen/payments" className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Payments</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">${stats.pendingAmount.toLocaleString()}</p>
              <p className="text-xs text-red-600 mt-1">{stats.pendingPayments} bills due</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/citizen/requests" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">
            Submit New Request
          </Link>
          <Link to="/citizen/permits" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            Apply for Permit
          </Link>
          <Link to="/citizen/payments" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
            Pay Bills
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentActivity.length === 0 ? (
            <div className="p-5 text-center text-slate-500">No recent activity</div>
          ) : (
            recentActivity.map((item, index) => (
              <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {item.subject || item.title}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {item.activityType} • {item.type}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(item.status)}`}>
                  {(item.status || '').replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}