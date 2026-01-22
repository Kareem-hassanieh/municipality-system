import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    position: '',
    employment_type: 'full_time',
    hire_date: '',
    salary: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      const data = response.data || [];
      setEmployees(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.position || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || emp.employment_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPayroll = employees.filter(e => e.is_active).reduce((sum, e) => sum + Number(e.salary || 0), 0);

  // Generate next employee ID
  const generateEmployeeId = () => {
    const existingIds = employees.map(e => {
      const match = (e.employee_id || '').match(/EMP-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `EMP-${String(maxId + 1).padStart(3, '0')}`;
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      employee_id: generateEmployeeId(),
      position: '',
      employment_type: 'full_time',
      hire_date: new Date().toISOString().split('T')[0], // Default to today
      salary: '',
      is_active: true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employee_id: employee.employee_id || '',
      position: employee.position || '',
      employment_type: employee.employment_type || 'full_time',
      hire_date: employee.hire_date || '',
      salary: employee.salary || '',
      is_active: employee.is_active ?? true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openViewModal = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Employee ID validation
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }

    // Position validation
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Hire date validation
    if (!formData.hire_date) {
      newErrors.hire_date = 'Hire date is required';
    } else {
      const hireDate = new Date(formData.hire_date);
      const today = new Date();
      if (hireDate > today) {
        newErrors.hire_date = 'Hire date cannot be in the future';
      }
    }

    // Salary validation
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    } else if (Number(formData.salary) < 0) {
      newErrors.salary = 'Salary cannot be negative';
    } else if (Number(formData.salary) > 1000000) {
      newErrors.salary = 'Please enter a valid salary';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : 0,
        hire_date: formData.hire_date,
      };

      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, dataToSend);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', dataToSend);
        toast.success('Employee added successfully');
      }
      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error(error.response?.data?.message || 'Error saving employee. Please try again.');
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
      await api.delete(`/employees/${deletingId}`);
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error(error.response?.data?.message || 'Error deleting employee. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
          <p className="text-slate-500 mt-1">Manage staff and personnel</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Employees</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{employees.length}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Active</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">{employees.filter(e => e.is_active).length}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Full Time</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{employees.filter(e => e.employment_type === 'full_time').length}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Monthly Payroll</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">${totalPayroll.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-500">No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-800 font-mono">{employee.employee_id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{employee.position || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 capitalize">{(employee.employment_type || '').replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">${Number(employee.salary || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${employee.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openViewModal(employee)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(employee)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteClick(employee.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.employee_id}
              onChange={(e) => handleInputChange('employee_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.employee_id ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g., EMP-001"
            />
            {errors.employee_id && <p className="text-red-500 text-xs mt-1">{errors.employee_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Position <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.position ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g., Department Manager"
            />
            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select
                value={formData.employment_type}
                onChange={(e) => handleInputChange('employment_type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary ($) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.salary ? 'border-red-500' : 'border-slate-300'}`}
                placeholder="e.g., 5000"
                min="0"
              />
              {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hire Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={formData.hire_date}
              onChange={(e) => handleInputChange('hire_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.hire_date ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.hire_date && <p className="text-red-500 text-xs mt-1">{errors.hire_date}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">Active Employee</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (editingEmployee ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Employee Details">
        {viewingEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-slate-600">{(viewingEmployee.employee_id || 'E')[0]}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingEmployee.employee_id}</h3>
                <p className="text-sm text-slate-500">{viewingEmployee.position || 'No position'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Employment Type</p>
                <p className="text-slate-900 capitalize">{(viewingEmployee.employment_type || '').replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-slate-500">Salary</p>
                <p className="text-slate-900">${Number(viewingEmployee.salary || 0).toLocaleString()}/month</p>
              </div>
              <div>
                <p className="text-slate-500">Hire Date</p>
                <p className="text-slate-900">{formatDate(viewingEmployee.hire_date)}</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${viewingEmployee.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {viewingEmployee.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
    </div>
  );
}