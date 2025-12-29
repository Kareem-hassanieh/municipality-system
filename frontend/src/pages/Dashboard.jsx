import { useState, useEffect } from 'react';
import { Users, FileText, CreditCard, FolderOpen, TrendingUp, Clock } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    citizens: 0,
    requests: 0,
    permits: 0,
    payments: 0,
    projects: 0,
    employees: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [citizens, requests, permits, payments, projects, employees] = await Promise.all([
        api.get('/citizens'),
        api.get('/requests'),
        api.get('/permits'),
        api.get('/payments'),
        api.get('/projects'),
        api.get('/employees'),
      ]);

      const citizensData = citizens.data || [];
      const requestsData = requests.data || [];
      const permitsData = permits.data || [];
      const paymentsData = payments.data || [];
      const projectsData = projects.data || [];
      const employeesData = employees.data || [];

      setStats({
        citizens: Array.isArray(citizensData) ? citizensData.length : 0,
        requests: Array.isArray(requestsData) ? requestsData.length : 0,
        permits: Array.isArray(permitsData) ? permitsData.length : 0,
        payments: Array.isArray(paymentsData) ? paymentsData.filter(p => p.status === 'completed').reduce((sum, p) => sum + Number(p.amount || 0), 0) : 0,
        projects: Array.isArray(projectsData) ? projectsData.filter(p => p.status === 'in_progress').length : 0,
        employees: Array.isArray(employeesData) ? employeesData.filter(e => e.is_active).length : 0,
      });

      // Get recent requests
      if (Array.isArray(requestsData)) {
        setRecentRequests(requestsData.slice(0, 5));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      in_progress: 'bg-blue-50 text-blue-700',
      completed: 'bg-emerald-50 text-emerald-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of municipality operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Citizens</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.citizens}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Requests</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.requests}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Permits</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.permits}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Revenue Collected</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">${stats.payments.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Projects</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.projects}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Employees</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">{stats.employees}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">Recent Requests</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {recentRequests.length === 0 ? (
            <div className="p-5 text-center text-slate-500">No requests yet</div>
          ) : (
            recentRequests.map((request) => (
              <div key={request.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{request.subject}</p>
                    <p className="text-xs text-slate-500 capitalize">{request.type}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(request.status)}`}>
                  {(request.status || '').replace('_', ' ')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}