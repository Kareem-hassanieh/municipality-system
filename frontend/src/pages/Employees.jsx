import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const initialEmployees = [
  { id: 1, employeeId: 'EMP-001', name: 'Ahmad Khalil', email: 'ahmad.k@municipality.com', department: 'Public Works', position: 'Department Manager', type: 'full_time', salary: 4500, status: 'active', hireDate: '2020-03-15' },
  { id: 2, employeeId: 'EMP-002', name: 'Sara Mansour', email: 'sara.m@municipality.com', department: 'Finance', position: 'Finance Officer', type: 'full_time', salary: 3800, status: 'active', hireDate: '2019-06-01' },
  { id: 3, employeeId: 'EMP-003', name: 'Omar Khalil', email: 'omar.k@municipality.com', department: 'Urban Planning', position: 'Urban Planner', type: 'full_time', salary: 3500, status: 'active', hireDate: '2021-01-10' },
  { id: 4, employeeId: 'EMP-004', name: 'Fatima Hassan', email: 'fatima.h@municipality.com', department: 'Human Resources', position: 'HR Manager', type: 'full_time', salary: 4000, status: 'active', hireDate: '2018-09-20' },
  { id: 5, employeeId: 'EMP-005', name: 'Mohammad Ali', email: 'mohammad.a@municipality.com', department: 'Citizen Services', position: 'Clerk', type: 'part_time', salary: 1800, status: 'active', hireDate: '2022-04-05' },
];

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    type: 'full_time',
    salary: '',
    status: 'active',
    hireDate: '',
  });

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || emp.department === departmentFilter;
    const matchesType = !typeFilter || emp.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesType;
  });

  const departments = [...new Set(employees.map(e => e.department))];

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', department: '', position: '', type: 'full_time', salary: '', status: 'active', hireDate: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      type: employee.type,
      salary: employee.salary,
      status: employee.status,
      hireDate: employee.hireDate,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeData = {
      ...formData,
      salary: Number(formData.salary),
    };

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp));
    } else {
      const newEmployee = {
        id: Date.now(),
        employeeId: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        ...employeeData,
      };
      setEmployees([...employees, newEmployee]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

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
          <p className="text-sm text-slate-500">Full Time</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{employees.filter(e => e.type === 'full_time').length}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Part Time</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">{employees.filter(e => e.type === 'part_time').length}</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Monthly Payroll</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">${employees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Position</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{employee.name}</p>
                    <p className="text-xs text-slate-500">{employee.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 font-mono">{employee.employeeId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{employee.department}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{employee.position}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 capitalize">{employee.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-700 capitalize">
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(employee)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEditModal(employee)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(employee.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEmployee ? 'Edit Employee' : 'Add Employee'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary ($)</label>
              <input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hire Date</label>
            <input type="date" value={formData.hireDate} onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">{editingEmployee ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Employee Details">
        {viewingEmployee && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-slate-600">{viewingEmployee.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingEmployee.name}</h3>
                <p className="text-sm text-slate-500">{viewingEmployee.employeeId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Email</p>
                <p className="text-slate-900">{viewingEmployee.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Department</p>
                <p className="text-slate-900">{viewingEmployee.department}</p>
              </div>
              <div>
                <p className="text-slate-500">Position</p>
                <p className="text-slate-900">{viewingEmployee.position}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingEmployee.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-slate-500">Salary</p>
                <p className="text-slate-900">${viewingEmployee.salary.toLocaleString()}/month</p>
              </div>
              <div>
                <p className="text-slate-500">Hire Date</p>
                <p className="text-slate-900">{viewingEmployee.hireDate}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}