import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

const employeesData = [
  { id: 1, employeeId: 'EMP-001', name: 'Ahmad Khalil', email: 'ahmad.k@municipality.com', department: 'Public Works', position: 'Department Manager', type: 'full_time', status: 'active', hireDate: '2020-03-15' },
  { id: 2, employeeId: 'EMP-002', name: 'Sara Mansour', email: 'sara.m@municipality.com', department: 'Finance', position: 'Finance Officer', type: 'full_time', status: 'active', hireDate: '2019-06-01' },
  { id: 3, employeeId: 'EMP-003', name: 'Omar Khalil', email: 'omar.k@municipality.com', department: 'Urban Planning', position: 'Urban Planner', type: 'full_time', status: 'active', hireDate: '2021-01-10' },
  { id: 4, employeeId: 'EMP-004', name: 'Fatima Hassan', email: 'fatima.h@municipality.com', department: 'Human Resources', position: 'HR Manager', type: 'full_time', status: 'active', hireDate: '2018-09-20' },
  { id: 5, employeeId: 'EMP-005', name: 'Mohammad Ali', email: 'mohammad.a@municipality.com', department: 'Citizen Services', position: 'Clerk', type: 'part_time', status: 'active', hireDate: '2022-04-05' },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employeesData.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Employees</h1>
          <p className="text-slate-500 mt-1">Manage staff and personnel</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Total Employees</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">52</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Full Time</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">45</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Part Time</p>
          <p className="text-2xl font-semibold text-slate-800 mt-1">7</p>
        </div>
        <div className="bg-white rounded border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Present Today</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">48</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Departments</option>
            <option value="public_works">Public Works</option>
            <option value="finance">Finance</option>
            <option value="urban_planning">Urban Planning</option>
            <option value="hr">Human Resources</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
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
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
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
    </div>
  );
}