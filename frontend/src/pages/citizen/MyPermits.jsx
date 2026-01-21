import { useState, useEffect } from 'react';
import { Plus, Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function MyPermits() {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPermit, setViewingPermit] = useState(null);
  const [formData, setFormData] = useState({
    type: 'business',
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const downloadCertificate = (permit) => {
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Permit Certificate - ${permit.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; background: #f1f5f9; padding: 40px; }
          .certificate { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; border: 3px solid #1e293b; }
          .border-design { height: 8px; background: linear-gradient(90deg, #1e293b 0%, #475569 50%, #1e293b 100%); }
          .header { padding: 40px 40px 20px; text-align: center; border-bottom: 2px solid #e2e8f0; }
          .logo { font-size: 14px; color: #64748b; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 10px; }
          .header h1 { font-size: 28px; color: #1e293b; font-weight: normal; margin-bottom: 5px; }
          .permit-type { display: inline-block; background: #1e293b; color: white; padding: 6px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-top: 15px; font-family: 'Segoe UI', Arial, sans-serif; }
          .body { padding: 30px 40px; text-align: center; }
          .certify-text { color: #64748b; font-size: 14px; margin-bottom: 15px; }
          .permit-title { font-size: 24px; color: #1e293b; margin-bottom: 25px; font-style: italic; }
          .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #64748b; font-size: 13px; }
          .detail-value { color: #1e293b; font-size: 13px; font-weight: 600; }
          .valid-badge { display: inline-block; background: #10b981; color: white; padding: 8px 25px; border-radius: 25px; font-size: 14px; font-weight: 600; margin: 20px 0; font-family: 'Segoe UI', Arial, sans-serif; }
          .footer { padding: 20px 40px 30px; text-align: center; border-top: 2px solid #e2e8f0; }
          .signature-area { margin: 20px 0; }
          .signature-line { width: 200px; border-bottom: 1px solid #1e293b; margin: 0 auto 5px; }
          .signature-text { color: #64748b; font-size: 12px; font-family: 'Segoe UI', Arial, sans-serif; }
          .generated { color: #94a3b8; font-size: 11px; margin-top: 20px; font-family: 'Segoe UI', Arial, sans-serif; }
          .print-btn { display: block; width: 100%; max-width: 600px; margin: 20px auto; padding: 12px; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Segoe UI', Arial, sans-serif; }
          .print-btn:hover { background: #334155; }
          @media print { 
            body { background: white; padding: 20px; } 
            .print-btn { display: none; } 
            .certificate { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="border-design"></div>
          
          <div class="header">
            <p class="logo">★ Municipality Portal ★</p>
            <h1>Permit Certificate</h1>
            <span class="permit-type">${permit.type} Permit</span>
          </div>
          
          <div class="body">
            <p class="certify-text">This is to certify that the following permit has been officially granted:</p>
            <p class="permit-title">"${permit.title}"</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">Permit ID</span>
                <span class="detail-value">#${permit.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Issue Date</span>
                <span class="detail-value">${formatDate(permit.application_date || permit.created_at)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Expiry Date</span>
                <span class="detail-value">${formatDate(permit.expiry_date)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fee Paid</span>
                <span class="detail-value">$${Number(permit.fee || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <span class="valid-badge">✓ APPROVED & VALID</span>
          </div>
          
          <div class="footer">
            <div class="signature-area">
              <div class="signature-line"></div>
              <p class="signature-text">Authorized Signature</p>
            </div>
            <p class="generated">Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
          
          <div class="border-design"></div>
        </div>
        
        <button class="print-btn" onclick="window.print()">🖨️ Print Certificate</button>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(certificateHTML);
    newWindow.document.close();
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my/permits');
      const data = response.data || [];
      setPermits(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching permits:', error);
      toast.error('Failed to load permits. Please refresh the page.');
      setLoading(false);
    }
  };

  const filteredPermits = permits.filter(permit => {
    if (filter === 'all') return true;
    if (filter === 'active') return permit.status === 'approved';
    if (filter === 'pending') return permit.status === 'pending' || permit.status === 'under_review';
    if (filter === 'expired') return permit.status === 'expired' || permit.status === 'rejected';
    return true;
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await api.post('/my/permits', {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      toast.success('Permit application submitted successfully');
      fetchPermits();
      setIsModalOpen(false);
      setFormData({ type: 'business', title: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error applying for permit:', error);
      toast.error(error.response?.data?.message || 'Error submitting application. Please try again.');
    }
  };

  const openViewModal = (permit) => {
    setViewingPermit(permit);
    setIsViewModalOpen(true);
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      under_review: 'bg-blue-50 text-blue-700',
      approved: 'bg-emerald-50 text-emerald-700',
      rejected: 'bg-red-50 text-red-700',
      expired: 'bg-slate-100 text-slate-600',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const getTypeIcon = (type) => {
    return type === 'business' ? '🏢' : type === 'construction' ? '🏗️' : type === 'event' ? '🎉' : '🚗';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading permits...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Permits</h1>
          <p className="text-slate-500 mt-1">View and apply for permits</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Apply for Permit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'active', 'pending', 'expired'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Permits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPermits.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No permits found. Apply for your first permit!
          </div>
        ) : (
          filteredPermits.map((permit) => (
            <div
              key={permit.id}
              className="bg-white rounded-lg border border-slate-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(permit.type)}</span>
                  <div>
                    <h3 className="font-medium text-slate-800">{permit.title}</h3>
                    <p className="text-sm text-slate-500 capitalize">{permit.type} Permit</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(permit.status)}`}>
                  {(permit.status || '').replace('_', ' ')}
                </span>
              </div>
              
              <div className="text-sm text-slate-500 space-y-1 mb-4">
                <p>Applied: {formatDate(permit.application_date || permit.created_at)}</p>
                {permit.expiry_date && <p>Expires: {formatDate(permit.expiry_date)}</p>}
                {permit.fee && <p>Fee: ${permit.fee}</p>}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => openViewModal(permit)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                {permit.status === 'approved' && (
                  <button 
                    onClick={() => downloadCertificate(permit)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Apply Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setErrors({}); }} title="Apply for Permit">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Permit Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none"
            >
              <option value="business">Business License</option>
              <option value="construction">Construction Permit</option>
              <option value="event">Event Permit</option>
              <option value="vehicle">Vehicle Permit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.title ? 'border-red-500' : 'border-slate-300'}`}
              placeholder="e.g., Restaurant Business License"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
              rows={4}
              placeholder="Provide details about your permit application..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setErrors({}); }}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Permit Details">
        {viewingPermit && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getTypeIcon(viewingPermit.type)}</span>
              <div>
                <h3 className="font-semibold text-slate-900">{viewingPermit.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(viewingPermit.status)}`}>
                  {(viewingPermit.status || '').replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-800">{viewingPermit.description || 'No description provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-slate-200">
              <div>
                <p className="text-slate-500">Type</p>
                <p className="text-slate-900 capitalize">{viewingPermit.type} Permit</p>
              </div>
              <div>
                <p className="text-slate-500">Fee</p>
                <p className="text-slate-900">{viewingPermit.fee ? `$${viewingPermit.fee}` : 'TBD'}</p>
              </div>
              <div>
                <p className="text-slate-500">Applied</p>
                <p className="text-slate-900">{formatDate(viewingPermit.application_date || viewingPermit.created_at)}</p>
              </div>
              <div>
                <p className="text-slate-500">Expires</p>
                <p className="text-slate-900">{formatDate(viewingPermit.expiry_date)}</p>
              </div>
            </div>
            {viewingPermit.rejection_reason && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-slate-500 text-sm">Rejection Reason</p>
                <p className="text-red-600 text-sm mt-1">{viewingPermit.rejection_reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}