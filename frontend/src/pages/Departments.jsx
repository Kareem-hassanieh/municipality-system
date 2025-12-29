import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';

const initialDepartments = [
  { id: 1, name: 'Public Works', code: 'PW', email: 'publicworks@municipality.com', phone: '01-234567', manager: 'Ahmad Khalil', employees: 24, status: 'active' },
  { id: 2, name: 'Finance', code: 'FIN', email: 'finance@municipality.com', phone: '01-234568', manager: 'Sara Mansour', employees: 12, status: 'active' },
  { id: 3, name: 'Urban Planning', code: 'UP', email: 'planning@municipality.com', phone: '01-234569', manager: 'Mohammad Ali', employees: 8, status: 'active' },
  { id: 4, name: 'Human Resources', code: 'HR', email: 'hr@municipality.com', phone: '01-234570', manager: 'Fatima Hassan', employees: 6, status: 'active' },
  { id: 5, name: 'Citizen Services', code: 'CS', email: 'services@municipality.com', phone: '01-234571', manager: 'Omar Saad', employees: 15, status: 'active' },
];

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    manager: '',
  });

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingDepartment(null);
    setFormData({ name: '', code: '', email: '', phone: '', manager: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      email: dept.email,
      phone: dept.phone,
      manager: dept.manager,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingDepartment) {
      // Update existing
      setDepartments(departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, ...formData }
          : dept
      ));
    } else {
      // Add new
      const newDept = {
        id: Date.now(),
        ...formData,
        employees: 0,
        status: 'active',
      };
      setDepartments([...departments, newDept]);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Departments</h1>
          <p className="text-slate-500 mt-1">Manage municipality departments</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Manager</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employees</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{dept.name}</p>
                    <p className="text-xs text-slate-500">{dept.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{dept.code}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{dept.manager}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{dept.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{dept.employees}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-700">
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                      >
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Manager
            </label>
            <input
              type="text"
              value={formData.manager}
              onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              {editingDepartment ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}