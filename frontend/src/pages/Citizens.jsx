import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Citizens() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCitizen, setEditingCitizen] = useState(null);
  const [viewingCitizen, setViewingCitizen] = useState(null);
  const [formData, setFormData] = useState({
    national_id: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    date_of_birth: '',
    gender: 'male',
    is_verified: false,
  });

  useEffect(() => {
    fetchCitizens();
  }, []);

  const fetchCitizens = async () => {
    try {
      const response = await api.get('/citizens');
      const data = response.data || [];
      setCitizens(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching citizens:', error);
      setCitizens([]);
      setLoading(false);
    }
  };

  const filteredCitizens = citizens.filter(citizen => {
    const fullName = `${citizen.first_name || ''} ${citizen.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (citizen.national_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || 
      (statusFilter === 'verified' && citizen.is_verified) ||
      (statusFilter === 'pending' && !citizen.is_verified);
    return matchesSearch && matchesStatus;
  });

  const openAddModal = () => {
    setEditingCitizen(null);
    setFormData({ national_id: '', first_name: '', last_name: '', phone: '', address: '', city: '', date_of_birth: '', gender: 'male', is_verified: false });
    setIsModalOpen(true);
  };

  const openEditModal = (citizen) => {
    setEditingCitizen(citizen);
    setFormData({
      national_id: citizen.national_id || '',
      first_name: citizen.first_name || '',
      last_name: citizen.last_name || '',
      phone: citizen.phone || '',
      address: citizen.address || '',
      city: citizen.city || '',
      date_of_birth: citizen.date_of_birth || '',
      gender: citizen.gender || 'male',
      is_verified: citizen.is_verified || false,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (citizen) => {
    setViewingCitizen(citizen);
    setIsViewModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCitizen) {
        await api.put(`/citizens/${editingCitizen.id}`, formData);
        toast.success('Citizen updated successfully');
      } else {
        await api.post('/citizens', formData);
        toast.success('Citizen added successfully');
      }
      fetchCitizens();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving citizen:', error);
      toast.error(error.response?.data?.message || 'Error saving citizen. Please try again.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/citizens/${deletingId}`);
      toast.success('Citizen deleted successfully');
      fetchCitizens();
    } catch (error) {
      console.error('Error deleting citizen:', error);
      toast.error(error.response?.data?.message || 'Error deleting citizen. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading citizens...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Citizens</h1>
          <p className="text-slate-500 mt-1">Manage registered citizens</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Citizen
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-slate-500">No citizens found. Add your first citizen!</td>
                </tr>
              ) : (
                filteredCitizens.map((citizen) => (
                  <tr key={citizen.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-800">{citizen.first_name} {citizen.last_name}</p>
                      <p className="text-xs text-slate-500 capitalize">{citizen.gender}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600 font-mono">{citizen.national_id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{citizen.phone || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{citizen.city || '-'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${citizen.is_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {citizen.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openViewModal(citizen)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(citizen)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteClick(citizen.id)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCitizen ? 'Edit Citizen' : 'Add Citizen'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">National ID</label>
            <input type="text" value={formData.national_id} onChange={(e) => setFormData({ ...formData, national_id: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
              <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_verified" checked={formData.is_verified} onChange={(e) => setFormData({ ...formData, is_verified: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
            <label htmlFor="is_verified" className="text-sm font-medium text-slate-700">Verified</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">{editingCitizen ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Citizen Details">
        {viewingCitizen && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-slate-600">{viewingCitizen.first_name?.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingCitizen.first_name} {viewingCitizen.last_name}</h3>
                <p className="text-sm text-slate-500">{viewingCitizen.national_id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Phone</p><p className="text-slate-900">{viewingCitizen.phone || '-'}</p></div>
              <div><p className="text-slate-500">Gender</p><p className="text-slate-900 capitalize">{viewingCitizen.gender || '-'}</p></div>
              <div><p className="text-slate-500">City</p><p className="text-slate-900">{viewingCitizen.city || '-'}</p></div>
              <div><p className="text-slate-500">Status</p><span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${viewingCitizen.is_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{viewingCitizen.is_verified ? 'Verified' : 'Pending'}</span></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Citizen"
        message="Are you sure you want to delete this citizen? This action cannot be undone."
      />
    </div>
  );
}