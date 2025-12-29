import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, Shield } from 'lucide-react';
import api from '../../services/api';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    date_of_birth: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/my/profile');
      setProfile(response.data);
      setFormData({
        first_name: response.data.citizen?.first_name || '',
        last_name: response.data.citizen?.last_name || '',
        phone: response.data.citizen?.phone || '',
        address: response.data.citizen?.address || '',
        city: response.data.citizen?.city || '',
        date_of_birth: response.data.citizen?.date_of_birth || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/my/profile', formData);
      setProfile(response.data);
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Profile not found</div>
      </div>
    );
  }

  const citizen = profile.citizen;
  const user = profile.user;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800">Profile updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-slate-600">
                {citizen?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                {citizen?.first_name} {citizen?.last_name}
              </h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* National ID */}
        <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-sm text-slate-500">National ID</p>
              <p className="font-mono font-medium text-slate-800">{citizen?.national_id}</p>
            </div>
          </div>
          {citizen?.is_verified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
        <h2 className="font-semibold text-slate-800">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <User className="w-4 h-4" />
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <p className="text-slate-800">{citizen?.first_name || '-'}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <User className="w-4 h-4" />
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <p className="text-slate-800">{citizen?.last_name || '-'}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <p className="text-slate-800">{user?.email || '-'}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Phone className="w-4 h-4" />
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <p className="text-slate-800">{citizen?.phone || '-'}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <p className="text-slate-800">{citizen?.date_of_birth || '-'}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <MapPin className="w-4 h-4" />
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <p className="text-slate-800">{citizen?.city || '-'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            />
          ) : (
            <p className="text-slate-800">{citizen?.address || '-'}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}