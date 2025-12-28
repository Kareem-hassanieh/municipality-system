import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';

const eventsData = [
  { id: 1, title: 'Community Clean-up Day', type: 'community', location: 'Central Park', date: '2024-04-15', time: '09:00 AM', audience: 'public', status: 'upcoming' },
  { id: 2, title: 'Staff Training Workshop', type: 'training', location: 'Municipal Hall', date: '2024-04-10', time: '10:00 AM', audience: 'staff', status: 'upcoming' },
  { id: 3, title: 'Town Hall Meeting', type: 'meeting', location: 'City Council Chamber', date: '2024-04-20', time: '06:00 PM', audience: 'public', status: 'upcoming' },
  { id: 4, title: 'Road Closure Notice', type: 'announcement', location: 'Main Street', date: '2024-04-05', time: '-', audience: 'public', status: 'active' },
  { id: 5, title: 'Annual Budget Review', type: 'meeting', location: 'Finance Department', date: '2024-03-28', time: '02:00 PM', audience: 'department', status: 'completed' },
];

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <button className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
            <option value="">All Types</option>
            <option value="community">Community</option>
            <option value="meeting">Meeting</option>
            <option value="training">Training</option>
            <option value="announcement">Announcement</option>
          </select>
          <select className="px-3 py-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none">
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