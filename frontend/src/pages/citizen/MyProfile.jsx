import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Save, CheckCircle } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Ahmad Hassan',
    email: user?.email || 'ahmad@email.com',
    phone: '03-123456',
    nationalId: 'LB123456789',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'Beirut',
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...profile });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...formData });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1">Manage your personal information</p>
        </div>
        {!editing ? (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {saved && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-slate-200">
        {/* Profile Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-slate-600">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-500">Citizen ID: {profile.nationalId}</p>
            </div>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <User className="w-4 h-4 text-slate-400" />
                {profile.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            {editing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <Mail className="w-4 h-4 text-slate-400" />
                {profile.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <Phone className="w-4 h-4 text-slate-400" />
                {profile.phone}
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date of Birth
            </label>
            {editing ? (
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {profile.dateOfBirth}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {profile.address}
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900 py-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {profile.city}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* National ID Card (Read Only) */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-medium text-slate-700 mb-4">National ID Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-500">National ID Number</p>
            <p className="text-sm font-mono text-slate-900 mt-1">{profile.nationalId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Verification Status</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}