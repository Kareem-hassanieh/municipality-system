import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import api from '../../services/api';

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/my/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeStyle = (type) => {
    const styles = {
      meeting: 'bg-blue-50 text-blue-700',
      workshop: 'bg-purple-50 text-purple-700',
      festival: 'bg-pink-50 text-pink-700',
      public_hearing: 'bg-amber-50 text-amber-700',
      community: 'bg-emerald-50 text-emerald-700',
    };
    return styles[type] || 'bg-slate-50 text-slate-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Upcoming Events</h1>
        <p className="text-slate-500 mt-1">Stay informed about community events and activities</p>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No upcoming events at the moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-slate-300 transition">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getTypeStyle(event.type)}`}>
                      {(event.type || '').replace('_', ' ')}
                    </span>
                    {event.department && (
                      <span className="text-xs text-slate-500">
                        {event.department.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-slate-600 text-sm mb-3">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.start_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.target_audience && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="capitalize">{event.target_audience.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}