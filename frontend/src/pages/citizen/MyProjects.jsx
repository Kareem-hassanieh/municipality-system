import { useState, useEffect } from 'react';
import { Building2, MapPin, Calendar, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/my/projects');
      setProjects(response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status) => {
    const styles = {
      planning: 'bg-purple-50 text-purple-700',
      in_progress: 'bg-blue-50 text-blue-700',
      on_hold: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const formatBudget = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Municipal Projects</h1>
        <p className="text-slate-500 mt-1">Track ongoing projects in your community</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No active projects at the moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(project.status)}`}>
                      {(project.status || '').replace('_', ' ')}
                    </span>
                    {project.department && (
                      <span className="text-xs text-slate-500">
                        {project.department.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{project.name}</h3>
                  {project.description && (
                    <p className="text-slate-600 text-sm mb-3">{project.description}</p>
                  )}
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-700">{project.progress_percentage || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                  </div>
                  {project.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Budget: {formatBudget(project.budget)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}