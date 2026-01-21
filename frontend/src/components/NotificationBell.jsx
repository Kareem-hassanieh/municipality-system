import { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data.data || []);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications();
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      request_status: '📋',
      permit_status: '📄',
      payment_status: '💳',
      payment_reminder: '⏰',
      payment_receipt: '🧾',
    };
    return icons[type] || '🔔';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-72">
              {loading ? (
                <div className="p-4 text-center text-slate-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-slate-100 hover:bg-slate-50 ${!notification.read_at ? 'bg-blue-50' : ''
                      }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {getNotificationIcon(notification.data?.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 line-clamp-2">
                          {notification.data?.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatTime(notification.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read_at && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-slate-400 hover:text-green-600"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}