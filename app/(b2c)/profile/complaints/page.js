// components/ComplaintsPage.jsx - UPDATED FOR BACKEND RESPONSE
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, Plus, Send, 
  AlertTriangle, CheckCircle, RefreshCw,
  FileText, X, Calendar, Tag,
  Mail, Phone, Clock, Globe,
  Eye, User, CreditCard
} from 'lucide-react';
import { 
  getUserComplaints, 
  createComplaint, 
  getComplaintDetails,
  addComplaintMessage,
  rateComplaint,
  getUserBookingsForComplaints 
} from '@/lib/complaintsService.js';
import toast from 'react-hot-toast';

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    OPEN: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Open' },
    IN_PROGRESS: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' },
    RESOLVED: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' },
    CLOSED: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Closed' }
  };

  const config = statusConfig[status] || statusConfig.OPEN;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    LOW: { color: 'bg-gray-100 text-gray-800', label: 'Low' },
    MEDIUM: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
    HIGH: { color: 'bg-orange-100 text-orange-800', label: 'High' },
    URGENT: { color: 'bg-red-100 text-red-800', label: 'Urgent' }
  };

  const config = priorityConfig[priority] || priorityConfig.MEDIUM;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Category badge component
const CategoryBadge = ({ category }) => {
  const categoryIcons = {
    TOUR_QUALITY: '🎯',
    TOUR_GUIDE: '👨‍🏫',
    BOOKING_ISSUES: '📅',
    PAYMENT_ISSUES: '💳',
    CANCELLATION: '❌',
    REFUND_REQUEST: '💰',
    TRANSPORTATION: '🚌',
    FACILITY: '🏢',
    SAFETY: '⚠️',
    TICKET_REJECTION: '🎫',
    OTHER: '📝'
  };

  const categoryLabels = {
    TOUR_QUALITY: 'Tour Quality',
    TOUR_GUIDE: 'Tour Guide',
    BOOKING_ISSUES: 'Booking Issues',
    PAYMENT_ISSUES: 'Payment Issues',
    CANCELLATION: 'Cancellation',
    REFUND_REQUEST: 'Refund Request',
    TRANSPORTATION: 'Transportation',
    FACILITY: 'Facility',
    SAFETY: 'Safety',
    TICKET_REJECTION: 'Ticket Rejection',
    OTHER: 'Other'
  };

  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
      <span>{categoryIcons[category]}</span>
      <span>{categoryLabels[category]}</span>
    </span>
  );
};

// Complaint Detail Modal
const ComplaintDetailModal = React.memo(({ 
  complaint, 
  onClose, 
  onSendMessage,
  onRateComplaint 
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    try {
      // Use complaint._id instead of complaint.id for MongoDB
      await onSendMessage(complaint._id, message);
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{complaint.subject}</h2>
              <div className="flex items-center space-x-2 mt-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
                <CategoryBadge category={complaint.category} />
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Complaint Details */}
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-800">{complaint.description}</p>
              </div>
              
              {complaint.expectedOutcome && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Expected Outcome</h3>
                  <p className="text-gray-800 capitalize">
                    {complaint.expectedOutcome.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              )}

              {complaint.refundAmount && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Refund Amount</h3>
                  <p className="text-gray-800 font-semibold">
                    {complaint.refundAmount} {complaint.booking?.currency || 'AED'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 flex flex-wrap gap-10">
              {/* Booking Information */}
              {complaint.bookingId && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Related Booking</span>
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Reference:</span> {complaint.bookingId.reference}</p>
                    <p><span className="font-medium">Amount:</span> {complaint.bookingId.totalGross} {complaint.bookingId.currency}</p>
                    <p><span className="font-medium">Status:</span> {complaint.bookingId.status}</p>
                    {complaint.tourName && (
                      <p><span className="font-medium">Tour:</span> {complaint.tourName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Contact Information</span>
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Email:</span> {complaint.contactEmail}</p>
                  <p><span className="font-medium">Phone:</span> {complaint.contactPhone}</p>
                  <p><span className="font-medium">Preferred Contact:</span> {complaint.preferredContactMethod}</p>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Created:</span> {new Date(complaint.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(complaint.updatedAt).toLocaleDateString()}</p>
                  {complaint.resolvedAt && (
                    <p><span className="font-medium">Resolved:</span> {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation</h3>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {complaint.messages?.map((message, index) => (
                <div key={message._id || index} className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderType === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Send Message */}
            {complaint.status !== 'CLOSED' && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Response */}
          {complaint.adminResponse && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Admin Response</h3>
              <p className="text-yellow-700">{complaint.adminResponse}</p>
            </div>
          )}

          {/* Rating Section for Resolved Complaints */}
          {complaint.status === 'RESOLVED' && !complaint.rating && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">Rate Your Experience</h3>
              <p className="text-green-700 mb-3">How would you rate the resolution of your complaint?</p>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    // Use complaint._id instead of complaint.id
                    onClick={() => onRateComplaint(complaint._id, star)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Separate NewComplaintModal component
const NewComplaintModal = React.memo(({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading,
  userBookings 
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'TOUR_QUALITY',
    priority: 'MEDIUM',
    bookingId: '',
    description: '',
    expectedOutcome: '',
    refundAmount: '',
    contactEmail: '',
    contactPhone: '',
    preferredContactMethod: 'email',
    attachments: []
  });

  const complaintCategories = [
    { value: 'TOUR_QUALITY', label: 'Tour Quality Issues', icon: '🎯' },
    { value: 'TOUR_GUIDE', label: 'Tour Guide Problems', icon: '👨‍🏫' },
    { value: 'BOOKING_ISSUES', label: 'Booking Problems', icon: '📅' },
    { value: 'PAYMENT_ISSUES', label: 'Payment Issues', icon: '💳' },
    { value: 'CANCELLATION', label: 'Cancellation Request', icon: '❌' },
    { value: 'REFUND_REQUEST', label: 'Refund Request', icon: '💰' },
    { value: 'TRANSPORTATION', label: 'Transportation Issues', icon: '🚌' },
    { value: 'FACILITY', label: 'Facility Problems', icon: '🏢' },
    { value: 'SAFETY', label: 'Safety Concerns', icon: '⚠️' },
    { value: 'TICKET_REJECTION', label: 'Ticket Rejection & Refund', icon: '🎫' },
    { value: 'OTHER', label: 'Other Issues', icon: '📝' }
  ];

  const complaintPriorities = [
    { value: 'LOW', label: 'Low', color: 'bg-blue-100 text-blue-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        subject: '',
        category: 'TOUR_QUALITY',
        priority: 'MEDIUM',
        bookingId: '',
        description: '',
        expectedOutcome: '',
        refundAmount: '',
        contactEmail: '',
        contactPhone: '',
        preferredContactMethod: 'email',
        attachments: []
      });
    }
  }, [isOpen]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      const complaintData = {
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        preferredContactMethod: formData.preferredContactMethod,
        ...(formData.bookingId && { bookingId: formData.bookingId }),
        ...(formData.expectedOutcome && { expectedOutcome: formData.expectedOutcome }),
        ...(formData.refundAmount && { refundAmount: parseFloat(formData.refundAmount) }),
        ...(formData.attachments.length > 0 && { attachments: formData.attachments })
      };

      await onSubmit(complaintData);
    } catch (error) {
      console.error('Failed to submit complaint:', error);
    }
  }, [formData, onSubmit]);

  const getBookingCurrency = useCallback((bookingId) => {
    const booking = userBookings.find(b => b.id === bookingId);
    return booking?.currency || 'AED';
  }, [userBookings]);

  const renderRefundFields = useCallback(() => {
    if (formData.category !== 'REFUND_REQUEST' && formData.category !== 'TICKET_REJECTION') {
      return null;
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Outcome
          </label>
          <select
            value={formData.expectedOutcome}
            onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select expected outcome</option>
            <option value="FULL_REFUND">Full Refund</option>
            <option value="PARTIAL_REFUND">Partial Refund</option>
            <option value="RESCHEDULE">Reschedule Tour</option>
            <option value="CREDIT">Tour Credit</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Refund Amount Requested ({formData.bookingId ? getBookingCurrency(formData.bookingId) : 'AED'})
          </label>
          <input
            type="number"
            value={formData.refundAmount}
            onChange={(e) => handleInputChange('refundAmount', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter refund amount"
            min="0"
            step="0.01"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> For ticket rejection refunds, please provide your booking reference and 
            reason for rejection. Refunds are processed within 5-7 business days.
          </p>
        </div>
      </div>
    );
  }, [formData.category, formData.expectedOutcome, formData.refundAmount, formData.bookingId, handleInputChange, getBookingCurrency]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Submit New Complaint</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complaint Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of your issue"
              required
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {complaintCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {complaintPriorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Related Booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Related Booking (Optional)
            </label>
            <select
              value={formData.bookingId}
              onChange={(e) => handleInputChange('bookingId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a booking (optional)</option>
              {userBookings.map((booking) => (
                <option key={booking.id} value={booking.id}>
                  {booking.reference} - {booking.tourName} - {booking.totalGross} {booking.currency}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide detailed information about your issue..."
              required
            />
          </div>

          {/* Refund-specific fields */}
          {renderRefundFields()}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span>{loading ? 'Submitting...' : 'Submit Complaint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Contact Support Section Component
const ContactSupportSection = React.memo(() => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is available to help you with urgent issues and emergencies.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <div>
                <p className="font-semibold">Emergency Hotline</p>
                <p className="text-blue-100">+971 4 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5" />
              <div>
                <p className="font-semibold">WhatsApp Support</p>
                <p className="text-blue-100">+971 50 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-blue-100">support@tourism.ae</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">Support Hours</h3>
          </div>
          
          <div className="space-y-2 text-blue-100">
            <div className="flex justify-between">
              <span>Sunday - Thursday</span>
              <span>8:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday - Saturday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Emergency Support</span>
              <span>24/7 Available</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-500">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm text-blue-100">GST UAE Support Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main ComplaintsPage Component
const ComplaintsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load complaints and bookings
  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const filters = activeTab !== 'all' ? { status: activeTab } : {};
      const result = await getUserComplaints(filters);
      
      if (result.success) {
        setComplaints(result.complaints || []);
      }
    } catch (error) {
      console.error('Failed to load complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadUserBookings = useCallback(async () => {
    try {
      const result = await getUserBookingsForComplaints();
      if (result.success) {
        setUserBookings(result.bookings || []);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast.error('Failed to load bookings');
    }
  }, []);

  useEffect(() => {
    loadComplaints();
    loadUserBookings();
  }, [loadComplaints, loadUserBookings]);

  const handleSubmitComplaint = useCallback(async (complaintData) => {
    try {
      setLoading(true);
      const result = await createComplaint(complaintData);
      
      if (result.success) {
        toast.success('Complaint submitted successfully!');
        setShowNewComplaint(false);
        loadComplaints();
        return true;
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error);
      toast.error(error.message || 'Failed to submit complaint');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadComplaints]);

  const handleViewComplaint = useCallback(async (complaintId) => {
    try {
      setDetailLoading(true);
      const result = await getComplaintDetails(complaintId);
      if (result.success) {
        setSelectedComplaint(result.complaint);
      }
    } catch (error) {
      console.error('Failed to load complaint details:', error);
      toast.error('Failed to load complaint details');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (complaintId, message) => {
    try {
      const result = await addComplaintMessage(complaintId, {
        message,
        attachments: []
      });

      if (result.success) {
        toast.success('Message sent successfully');
        // Refresh complaint details
        const complaintResult = await getComplaintDetails(complaintId);
        if (complaintResult.success) {
          setSelectedComplaint(complaintResult.complaint);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  }, []);

  const handleRateComplaint = useCallback(async (complaintId, rating, comment = '') => {
    try {
      const result = await rateComplaint(complaintId, {
        rating,
        comment
      });

      if (result.success) {
        toast.success('Thank you for your feedback!');
        setSelectedComplaint(null);
        loadComplaints();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit rating');
    }
  }, [loadComplaints]);

  // Complaint Card Component
  const ComplaintCard = ({ complaint }) => (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => handleViewComplaint(complaint._id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg mb-2">{complaint.subject}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{complaint.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <StatusBadge status={complaint.status} />
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Eye className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <CategoryBadge category={complaint.category} />
        <PriorityBadge priority={complaint.priority} />
        
        {complaint.booking && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Booking: {complaint.booking.reference}
          </span>
        )}
        
        {complaint.refundAmount && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Refund: {complaint.refundAmount} {complaint.booking?.currency || 'AED'}
          </span>
        )}
        
        <span className="text-xs text-gray-500 ml-auto">
          {new Date(complaint.createdAt).toLocaleDateString()}
        </span>
      </div>

      {complaint.messages && complaint.messages.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{complaint.messages.length} message{complaint.messages.length > 1 ? 's' : ''}</span>
            <span className="mx-2">•</span>
            <span>Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Support & Complaints</h1>
              <p className="text-gray-600 mt-1">
                Submit complaints, refund requests, and get support from our team
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowNewComplaint(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Complaint</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Total Complaints</p>
                <p className="text-2xl font-bold text-gray-800">{complaints.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Open Issues</p>
                <p className="text-2xl font-bold text-orange-600">
                  {complaints.filter(c => c.status === 'OPEN').length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Refund Requests</p>
                <p className="text-2xl font-bold text-purple-600">
                  {complaints.filter(c => c.category === 'REFUND_REQUEST' || c.category === 'TICKET_REJECTION').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {complaints.filter(c => c.status === 'RESOLVED').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex flex-wrap">
              {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'all' ? 'All Complaints' : tab.replace('_', ' ')}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab === 'all' ? complaints.length : complaints.filter(c => c.status === tab).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading complaints...</p>
              </div>
            ) : complaints.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No complaints found</h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all' 
                    ? "You haven't submitted any complaints yet."
                    : `No ${activeTab.toLowerCase().replace('_', ' ')} complaints found.`
                  }
                </p>
                <button 
                  onClick={() => setShowNewComplaint(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Submit Your First Complaint
                </button>
              </div>
            ) : (
              complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))
            )}
          </div>
        </div>

        {/* New Complaint Modal */}
        <NewComplaintModal
          isOpen={showNewComplaint}
          onClose={() => setShowNewComplaint(false)}
          onSubmit={handleSubmitComplaint}
          loading={loading}
          userBookings={userBookings}
        />

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <ComplaintDetailModal
            complaint={selectedComplaint}
            onClose={() => setSelectedComplaint(null)}
            onSendMessage={handleSendMessage}
            onRateComplaint={handleRateComplaint}
          />
        )}

        {/* Contact Support Section */}
        <ContactSupportSection />
      </div>
    </div>
  );
};

export default ComplaintsPage;