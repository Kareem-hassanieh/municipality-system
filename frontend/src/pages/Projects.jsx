import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    type: 'infrastructure',
    status: 'planned',
    budget: '',
    location: '',
    start_date: '',
    progress_percentage: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      type: 'infrastructure',
      status: 'planned',
      budget: '',
      location: '',
      start_date: new Date().toISOString().split('T')[0],
      progress_percentage: 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || '',
      type: project.type || 'infrastructure',
      status: project.status || 'planned',
      budget: project.budget || '',
      location: project.location || '',
      start_date: project.start_date || '',
      progress_percentage: Number(project.progress_percentage) || 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openViewModal = (project) => {
    setViewingProject(project);
    setIsViewModalOpen(true);
  };

  const handleChange = (field, value) => {
    let updates = { [field]: value };

    // Auto-sync status and progress
    if (field === 'status') {
      if (value === 'completed') updates.progress_percentage = 100;
      else if (value === 'planned') updates.progress_percentage = 0;
    }
    if (field === 'progress_percentage') {
      const num = Number(value);
      updates.progress_percentage = num;
      if (num === 100) updates.status = 'completed';
      else if (num > 0 && formData.status === 'planned') updates.status = 'in_progress';
    }

    setFormData(prev => ({ ...prev, ...updates }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Required';
    if (!formData.budget || Number(formData.budget) <= 0) errs.budget = 'Required';
    if (!formData.start_date) errs.start_date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error('Please fill required fields');

    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name,
        type: formData.type,
        status: formData.status,
        budget: Number(formData.budget),
        spent: 0,
        location: formData.location,
        start_date: formData.start_date,
        progress_percentage: Number(formData.progress_percentage),
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, data);
        toast.success('Project updated');
      } else {
        await api.post('/projects', data);
        toast.success('Project created');
      }
      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error.response?.data);
      toast.error('Error saving project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deletingId}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Error deleting project');
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      planned: 'bg-purple-50 text-purple-700',
      in_progress: 'bg-blue-50 text-blue-700',
      on_hold: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      cancelled: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const getProgressColor = (pct) => {
    if (pct >= 75) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-500">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Projects</h1>
          <p className="text-slate-500 mt-1">Manage municipal projects</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm outline-none focus:border-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded text-sm outline-none"
        >
          <option value="">All Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="on_hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 bg-white rounded border p-8 text-center text-slate-500">
            No projects found.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const progress = Number(project.progress_percentage) || 0;
            return (
              <div key={project.id} className="bg-white rounded border border-slate-200 p-5">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{project.name}</h3>
                    <p className="text-xs text-slate-500 capitalize">{project.type} • {project.location || 'No location'}</p>
                  </div>
                  <span className={`h-fit px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(project.status)}`}>
                    {(project.status || '').replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold text-slate-700">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="font-medium">${Number(project.budget || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Spent</p>
                    <p className="font-medium">${Number(project.spent || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-1 mt-4 pt-3 border-t">
                  <button onClick={() => openViewModal(project)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => openEditModal(project)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteClick(project.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Project name"
              className={`w-full px-3 py-2 border rounded text-sm outline-none ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none"
              >
                <option value="infrastructure">Infrastructure</option>
                <option value="road">Road</option>
                <option value="building">Building</option>
                <option value="park">Park</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Location"
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget ($) *</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                placeholder="50000"
                className={`w-full px-3 py-2 border rounded text-sm outline-none ${errors.budget ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded text-sm outline-none ${errors.start_date ? 'border-red-500' : 'border-slate-300'}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none"
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Progress Slider */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-slate-700">Progress</label>
              <span className="text-lg font-bold text-slate-800">{formData.progress_percentage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress_percentage}
              onChange={(e) => handleChange('progress_percentage', e.target.value)}
              className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-900 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Project Details">
        {viewingProject && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <h3 className="font-semibold text-slate-900">{viewingProject.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingProject.status)}`}>
                {(viewingProject.status || '').replace('_', ' ')}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Progress</span>
                <span className="font-bold text-slate-800">{viewingProject.progress_percentage || 0}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getProgressColor(viewingProject.progress_percentage || 0)}`}
                  style={{ width: `${viewingProject.progress_percentage || 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t">
              <div><p className="text-slate-500">Type</p><p className="capitalize">{viewingProject.type}</p></div>
              <div><p className="text-slate-500">Location</p><p>{viewingProject.location || '-'}</p></div>
              <div><p className="text-slate-500">Budget</p><p className="font-medium">${Number(viewingProject.budget || 0).toLocaleString()}</p></div>
              <div><p className="text-slate-500">Start Date</p><p>{viewingProject.start_date || '-'}</p></div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure? This cannot be undone."
      />
    </div>
  );
}