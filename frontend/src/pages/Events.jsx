import { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import api from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'community',
    location: '',
    start_datetime: '',
    end_datetime: '',
    target_audience: 'public',
    is_published: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      const data = response.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      type: 'community',
      location: '',
      start_datetime: '',
      end_datetime: '',
      target_audience: 'public',
      is_published: true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      type: event.type || 'community',
      location: event.location || '',
      start_datetime: event.start_datetime ? event.start_datetime.slice(0, 16) : '',
      end_datetime: event.end_datetime ? event.end_datetime.slice(0, 16) : '',
      target_audience: event.target_audience || 'public',
      is_published: event.is_published ?? true,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const openViewModal = (event) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.title.trim()) {
      errs.title = 'Event title is required';
    }

    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }

    if (!formData.start_datetime) {
      errs.start_datetime = 'Start date & time is required';
    }

    if (!formData.end_datetime) {
      errs.end_datetime = 'End date & time is required';
    }

    if (formData.start_datetime && formData.end_datetime) {
      if (new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
        errs.end_datetime = 'End time must be after start time';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        ...formData,
        start_datetime: formData.start_datetime,
        end_datetime: formData.end_datetime,
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, dataToSend);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', dataToSend);
        toast.success('Event created successfully');
      }
      fetchEvents();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error(error.response?.data?.message || 'Error saving event. Please try again.');
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
      await api.delete(`/events/${deletingId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Error deleting event. Please try again.');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      meeting: '📋',
      community: '🎉',
      training: '📚',
      announcement: '📢',
    };
    return icons[type] || '📢';
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return '-';
    return new Date(datetime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading events...</div>
      </div>
    );
  }

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
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-3 bg-white rounded border border-slate-200 p-8 text-center text-slate-500">
            No events found. Create your first event!
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{getTypeIcon(event.type)}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${event.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {event.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <h3 className="text-sm font-semibold text-slate-800 mb-3">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(event.start_datetime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location || 'No location'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="capitalize">{event.target_audience}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => openViewModal(event)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => openEditModal(event)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteClick(event.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEvent ? 'Edit Event' : 'Create Event'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Event Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter event title"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              >
                <option value="community">Community</option>
                <option value="meeting">Meeting</option>
                <option value="training">Training</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
              <select
                value={formData.target_audience}
                onChange={(e) => handleChange('target_audience', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
              >
                <option value="public">Public</option>
                <option value="staff">Staff</option>
                <option value="department">Department</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${errors.location ? 'border-red-500' : 'border-slate-300'}`}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={formData.start_datetime}
                onChange={(e) => handleChange('start_datetime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${errors.start_datetime ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.start_datetime && <p className="text-red-500 text-xs mt-1">{errors.start_datetime}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End <span className="text-red-500">*</span></label>
              <input
                type="datetime-local"
                value={formData.end_datetime}
                onChange={(e) => handleChange('end_datetime', e.target.value)}
                min={formData.start_datetime}
                className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${errors.end_datetime ? 'border-red-500' : 'border-slate-300'}`}
              />
              {errors.end_datetime && <p className="text-red-500 text-xs mt-1">{errors.end_datetime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Event description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => handleChange('is_published', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-slate-700">Publish Event</label>
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
              {isSubmitting ? 'Saving...' : (editingEvent ? 'Update' : 'Create')}
            </button>
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
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${viewingEvent.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {viewingEvent.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600">{viewingEvent.description || 'No description'}</p>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Start</p>
                <p className="text-slate-900">{formatDateTime(viewingEvent.start_datetime)}</p>
              </div>
              <div>
                <p className="text-slate-500">End</p>
                <p className="text-slate-900">{formatDateTime(viewingEvent.end_datetime)}</p>
              </div>
              <div>
                <p className="text-slate-500">Location</p>
                <p className="text-slate-900">{viewingEvent.location || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500">Audience</p>
                <p className="text-slate-900 capitalize">{viewingEvent.target_audience}</p>
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
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
}