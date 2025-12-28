import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

const projectsData = [
  { id: 1, name: 'Main Road Renovation', department: 'Public Works', manager: 'Ahmad Khalil', type: 'road', status: 'in_progress', budget: '$120,000', spent: '$90,000', progress: 75 },
  { id: 2, name: 'Central Park Development', department: 'Urban Planning', manager: 'Sara Mansour', type: 'park', status: 'in_progress', budget: '$85,000', spent: '$38,000', progress: 45 },
  { id: 3, name: 'Water Pipeline Extension', department: 'Public Works', manager: 'Omar Khalil', type: 'infrastructure', status: 'planned', budget: '$200,000', spent: '$0', progress: 0 },
  { id: 4, name: 'Municipal Building Renovation', department: 'Public Works', manager: 'Mohammad Ali', type: 'building', status: 'completed', budget: '$50,000', spent: '$48,500', progress: 100 },
  { id: 5, name: 'Street Lighting Upgrade', department: 'Public Works', manager: 'Fatima Hassan', type: 'maintenance', status: 'on_hold', budget: '$30,000', spent: '$12,000', progress: 40 },
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projectsData.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    const styles = {
      planned: 'bg-slate-100 text-slate-600',
      in_progress: 'bg-blue-50 text-blue-700',
      on_hold: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">Manage municipal projects</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="road">Road</option>
            <option value="park">Park</option>
            <option value="building">Building</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{project.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{project.department} • {project.manager}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-slate-700 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Budget</p>
                  <p className="font-medium text-slate-800">{project.budget}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Spent</p>
                  <p className="font-medium text-slate-800">{project.spent}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}