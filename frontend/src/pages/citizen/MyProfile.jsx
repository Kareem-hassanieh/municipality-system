import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';

export default function MyProfile() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Ahmad Hassan',
    email: user?.email || 'ahmad@email.com',
    phone: '03-123456',
    nationalId: 'LB123456789',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'Beirut',
  });

  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    // Would save to API here
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
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-slate-200">
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

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
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
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
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
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
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
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
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
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
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
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 text-slate-900">
                <MapPin className="w-4 h-4 text-slate-400" />
                {profile.city}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}