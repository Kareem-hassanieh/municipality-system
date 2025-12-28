import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';

const citizensData = [
  { id: 1, nationalId: 'LB123456', name: 'Ahmad Hassan', email: 'ahmad@email.com', phone: '03-123456', city: 'Beirut', status: 'verified', registeredAt: '2024-01-15' },
  { id: 2, nationalId: 'LB234567', name: 'Fatima Ali', email: 'fatima@email.com', phone: '03-234567', city: 'Tripoli', status: 'verified', registeredAt: '2024-02-20' },
  { id: 3, nationalId: 'LB345678', name: 'Omar Khalil', email: 'omar@email.com', phone: '03-345678', city: 'Sidon', status: 'pending', registeredAt: '2024-03-10' },
  { id: 4, nationalId: 'LB456789', name: 'Sara Mansour', email: 'sara@email.com', phone: '03-456789', city: 'Beirut', status: 'verified', registeredAt: '2024-03-15' },
  { id: 5, nationalId: 'LB567890', name: 'Mohammad Saad', email: 'mohammad@email.com', phone: '03-567890', city: 'Zahle', status: 'pending', registeredAt: '2024-04-01' },
];

export default function Citizens() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCitizens = citizensData.filter(citizen =>
    citizen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    citizen.nationalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Citizens</h1>
          <p className="text-slate-500 mt-1">Manage registered citizens</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Citizen
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Citizen</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">National ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Registered</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCitizens.map((citizen) => (
                <tr key={citizen.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">{citizen.name}</p>
                    <p className="text-xs text-slate-500">{citizen.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600 font-mono">{citizen.nationalId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{citizen.phone}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{citizen.city}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                      citizen.status === 'verified' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {citizen.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{citizen.registeredAt}</span>
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