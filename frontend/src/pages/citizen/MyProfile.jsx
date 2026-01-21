import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    date_of_birth: '',
    gender: 'male',
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my/profile');
      setProfile(response.data);
      setFormData({
        first_name: response.data.citizen?.first_name || '',
        last_name: response.data.citizen?.last_name || '',
        phone: response.data.citizen?.phone || '',
        address: response.data.citizen?.address || '',
        city: response.data.citizen?.city || '',
        date_of_birth: response.data.citizen?.date_of_birth || '',
        gender: response.data.citizen?.gender || 'male',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile. Please refresh the page.');
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^[\d\s\-+()]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation (can't be in the future, must be at least 16 years old)
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const minAge = new Date();
      minAge.setFullYear(minAge.getFullYear() - 16);
      
      if (dob > today) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future';
      } else if (dob > minAge) {
        newErrors.date_of_birth = 'You must be at least 16 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      const response = await api.put('/my/profile', {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
      });
      setProfile(response.data);
      setIsEditing(false);
      setErrors({});
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Error saving profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form to original values
    setFormData({
      first_name: profile.citizen?.first_name || '',
      last_name: profile.citizen?.last_name || '',
      phone: profile.citizen?.phone || '',
      address: profile.citizen?.address || '',
      city: profile.citizen?.city || '',
      date_of_birth: profile.citizen?.date_of_birth || '',
      gender: profile.citizen?.gender || 'male',
    });
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
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              Edit Profile
            </button>
          )}
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
              First Name {isEditing && <span className="text-red-500">*</span>}
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => {
                    setFormData({ ...formData, first_name: e.target.value });
                    if (errors.first_name) setErrors({ ...errors, first_name: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.first_name ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </>
            ) : (
              <p className="text-slate-800">{citizen?.first_name || '-'}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <User className="w-4 h-4" />
              Last Name {isEditing && <span className="text-red-500">*</span>}
            </label>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                    if (errors.last_name) setErrors({ ...errors, last_name: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.last_name ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </>
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
              <>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder="+961 XX XXX XXX"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </>
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
              <>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => {
                    setFormData({ ...formData, date_of_birth: e.target.value });
                    if (errors.date_of_birth) setErrors({ ...errors, date_of_birth: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.date_of_birth ? 'border-red-500' : 'border-slate-300'}`}
                />
                {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
              </>
            ) : (
              <p className="text-slate-800">{formatDate(citizen?.date_of_birth)}</p>
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

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <User className="w-4 h-4" />
              Gender
            </label>
            {isEditing ? (
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="text-slate-800 capitalize">{citizen?.gender || '-'}</p>
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
              placeholder="Street address"
            />
          ) : (
            <p className="text-slate-800">{citizen?.address || '-'}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
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