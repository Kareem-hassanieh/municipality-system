import { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import api from '../../services/api';

export default function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payingItem, setPayingItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payment form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: ''
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

  const downloadReceipt = (payment) => {
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${payment.reference_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 40px; }
          .receipt { max-width: 500px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: #1e293b; color: white; padding: 30px; text-align: center; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { opacity: 0.8; font-size: 14px; }
          .status { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 15px; }
          .section { padding: 20px 30px; border-bottom: 1px solid #e2e8f0; }
          .section:last-child { border-bottom: none; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .row:last-child { margin-bottom: 0; }
          .label { color: #64748b; font-size: 14px; }
          .value { color: #1e293b; font-size: 14px; font-weight: 500; }
          .amount-section { background: #f8fafc; padding: 25px 30px; text-align: center; }
          .amount-label { color: #64748b; font-size: 14px; margin-bottom: 5px; }
          .amount { font-size: 36px; font-weight: 700; color: #1e293b; }
          .footer { padding: 20px 30px; text-align: center; color: #64748b; font-size: 12px; }
          .footer p { margin-bottom: 5px; }
          .print-btn { display: block; width: 100%; max-width: 500px; margin: 20px auto; padding: 12px; background: #1e293b; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; }
          .print-btn:hover { background: #334155; }
          @media print { 
            body { background: white; padding: 0; } 
            .print-btn { display: none; } 
            .receipt { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>Payment Receipt</h1>
            <p>Municipality Portal</p>
            <span class="status">✓ PAID</span>
          </div>
          
          <div class="section">
            <div class="row">
              <span class="label">Reference Number</span>
              <span class="value" style="font-family: monospace;">${payment.reference_number}</span>
            </div>
            <div class="row">
              <span class="label">Payment Date</span>
              <span class="value">${formatDate(payment.payment_date || payment.updated_at)}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method</span>
              <span class="value" style="text-transform: capitalize;">${payment.payment_method || 'Card'}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="row">
              <span class="label">Type</span>
              <span class="value">${(payment.type || '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
            </div>
            <div class="row">
              <span class="label">Description</span>
              <span class="value">${payment.description || '-'}</span>
            </div>
          </div>
          
          <div class="amount-section">
            <p class="amount-label">Amount Paid</p>
            <p class="amount">$${Number(payment.amount || 0).toLocaleString()}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for your payment!</p>
            <p>This is an official receipt from Municipality Portal.</p>
            <p>Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
        </div>
        
        <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(receiptHTML);
    newWindow.document.close();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/my/payments');
      const data = response.data || [];
      setPayments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'paid') return payment.status === 'completed';
    return true;
  });

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const openPayModal = (payment) => {
    setPayingItem(payment);
    setCardForm({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
    setErrors({});
    setIsPayModalOpen(true);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value.replace('/', ''));
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setCardForm(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Card number validation (16 digits)
    const cardDigits = cardForm.cardNumber.replace(/\s/g, '');
    if (!cardDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Expiry validation
    if (!cardForm.expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const [month, year] = cardForm.expiry.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (!month || !year || month > 12 || month < 1) {
        newErrors.expiry = 'Invalid expiry date';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }
    
    // CVV validation (3-4 digits)
    if (!cardForm.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    // Cardholder name validation
    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    } else if (cardForm.cardholderName.trim().length < 3) {
      newErrors.cardholderName = 'Please enter a valid name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!payingItem) return;
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsProcessing(true);
    
    try {
      await api.post(`/my/payments/${payingItem.id}/pay`, {
        payment_method: 'card'
      });
      toast.success('Payment completed successfully!');
      setIsPayModalOpen(false);
      setCardForm({ cardNumber: '', expiry: '', cvv: '', cardholderName: '' });
      fetchPayments();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700',
      completed: 'bg-emerald-50 text-emerald-700',
      failed: 'bg-red-50 text-red-700',
    };
    return styles[status] || 'bg-slate-50 text-slate-700';
  };

  const formatType = (type) => {
    return (type || '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Payments</h1>
          <p className="text-slate-500 mt-1">View and pay your bills</p>
        </div>
      </div>

      {/* Summary Card */}
      {totalPending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="text-amber-800 font-medium">Total Amount Due</p>
            <p className="text-2xl font-bold text-amber-900">${totalPending.toLocaleString()}</p>
          </div>
          <button
            onClick={() => {
              const pendingPayment = payments.find(p => p.status === 'pending');
              if (pendingPayment) openPayModal(pendingPayment);
            }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['all', 'pending', 'paid'].map((tab) => (
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

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            No payments found.
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{formatType(payment.type)}</h3>
                  <p className="text-sm text-slate-500">
                    {payment.reference_number} • {formatDate(payment.due_date || payment.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-slate-800">${Number(payment.amount || 0).toLocaleString()}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded capitalize ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
                {payment.status === 'pending' ? (
                  <button
                    onClick={() => openPayModal(payment)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition"
                  >
                    Pay
                  </button>
                ) : (
                  <button 
                    onClick={() => downloadReceipt(payment)}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
                    title="Download Receipt"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pay Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Complete Payment">
        {payingItem && (
          <div className="space-y-5">
            <div className="text-center pb-5 border-b border-slate-200">
              <p className="text-sm text-slate-500">Amount to Pay</p>
              <p className="text-3xl font-bold text-slate-800">${Number(payingItem.amount || 0).toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">{formatType(payingItem.type)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={cardForm.cardNumber}
                  onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${
                    errors.cardNumber ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={cardForm.expiry}
                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${
                      errors.expiry ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={cardForm.cvv}
                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${
                      errors.cvv ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={cardForm.cardholderName}
                  onChange={(e) => handleCardChange('cardholderName', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-slate-500 focus:border-slate-500 outline-none ${
                    errors.cardholderName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsPayModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : `Pay $${Number(payingItem.amount || 0).toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}