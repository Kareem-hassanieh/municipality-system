import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import Modal from '../components/Modal';

const initialEvents = [
  { id: 1, title: 'Community Clean-up Day', type: 'community', location: 'Central Park', date: '2024-04-15', time: '09:00', audience: 'public', status: 'upcoming', description: 'Join us for a community clean-up event at Central Park.' },
  { id: 2, title: 'Staff Training Workshop', type: 'training', location: 'Municipal Hall', date: '2024-04-10', time: '10:00', audience: 'staff', status: 'upcoming', description: 'Mandatory training for all staff members.' },
  { id: 3, title: 'Town Hall Meeting', type: 'meeting', location: 'City Council Chamber', date: '2024-04-20', time: '18:00', audience: 'public', status: 'upcoming', description: 'Monthly town hall meeting to discuss community issues.' },
  { id: 4, title: 'Road Closure Notice', type: 'announcement', location: 'Main Street', date: '2024-04-05', time: '-', audience: 'public', status: 'active', description: 'Main Street will be closed for repairs.' },
  { id: 5, title: 'Annual Budget Review', type: 'meeting', location: 'Finance Department', date: '2024-03-28', time: '14:00', audience: 'department', status: 'completed', description: 'Annual budget review meeting.' },
];

export default function Events() {
  const [events, setEvents] = useState(initialEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'community',
    location: '',
    date: '',
    time: '',
    audience: 'public',
    status: 'upcoming',
    description: '',
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    const matchesStatus = !statusFilter || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({ title: '', type: 'community', location: '', date: '', time: '', audience: 'public', status: 'upcoming', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      type: event.type,
      location: event.location,
      date: event.date,
      time: event.time === '-' ? '' : event.time,
      audience: event.audience,
      status: event.status,
      description: event.description,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (event) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      time: formData.time || '-',
    };

    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, ...eventData } : ev));
    } else {
      setEvents([...events, { id: Date.now(), ...eventData }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(ev => ev.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      upcoming: 'bg-blue-50 text-blue-700',
      active: 'bg-emerald-50 text-emerald-700',
      completed: 'bg-slate-100 text-slate-600',
      cancelled: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const getTypeIcon = (type) => {
    return type === 'meeting' ? '📋' : type === 'community' ? '🎉' : type === 'training' ? '📚' : '📢';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Events</h1>
          <p className="text-slate-500 mt-1">Manage events and announcements</p>
        </div>
        <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="community">Community</option>
            <option value="meeting">Meeting</option>
            <option value="training">Training</option>
            <option value="announcement">Announcement</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{getTypeIcon(event.type)}</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(event.status)}`}>
                {event.status}
              </span>
            </div>
            
            <h3 className="text-sm font-semibold text-slate-800 mb-3">{event.title}</h3>
            
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{event.date} {event.time !== '-' && `at ${event.time}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="capitalize">{event.audience}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => openViewModal(event)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => openEditModal(event)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(event.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? 'Edit Event' : 'Create Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="community">Community</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
              <select value={formData.audience} onChange={(e) => setFormData({ ...formData, audience: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
                <option value="public">Public</option>
                <option value="staff">Staff</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none" rows={3} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition">{editingEvent ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Event Details">
        {viewingEvent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getTypeIcon(viewingEvent.type)}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingEvent.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingEvent.status)}`}>{viewingEvent.status}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600">{viewingEvent.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Date & Time</p>
                <p className="text-slate-900">{viewingEvent.date} {viewingEvent.time !== '-' && `at ${viewingEvent.time}`}</p>
              </div>
              <div>
                <p className="text-slate-500">Location</p>
                <p className="text-slate-900">{viewingEvent.location}</p>
              </div>
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingEvent.type}</p>
              </div>
              <div>
                <p className="text-slate-500">Audience</p>
                <p className="text-slate-900 capitalize">{viewingEvent.audience}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}