
'use client';
import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Search,
  Filter,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Upload,
  X,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  ChevronDown,
  Paperclip
} from 'lucide-react';

const ComplaintsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    category: 'tour_quality',
    priority: 'medium',
    tourId: '',
    description: '',
    attachments: []
  });

  const complaintCategories = [
    { value: 'tour_quality', label: 'Tour Quality Issues', icon: '🎯' },
    { value: 'tour_guide', label: 'Tour Guide Problems', icon: '👨‍🏫' },
    { value: 'booking_issues', label: 'Booking Problems', icon: '📅' },
    { value: 'payment_issues', label: 'Payment Issues', icon: '💳' },
    { value: 'cancellation', label: 'Cancellation Request', icon: '❌' },
    { value: 'refund', label: 'Refund Request', icon: '💰' },
    { value: 'transportation', label: 'Transportation Issues', icon: '🚌' },
    { value: 'facility', label: 'Facility Problems', icon: '🏢' },
    { value: 'safety', label: 'Safety Concerns', icon: '⚠️' },
    { value: 'other', label: 'Other Issues', icon: '📝' }
  ];

  const userTours = [
    { id: 'TKT001', name: 'Burj Khalifa & Dubai Mall', date: '2024-10-15' },
    { id: 'TKT002', name: 'Desert Safari Adventure', date: '2024-10-20' },
    { id: 'TKT003', name: 'Dubai Marina Cruise', date: '2024-10-25' },
    { id: 'TKT004', name: 'Old Dubai Heritage Tour', date: '2024-09-10' }
  ];

  const complaints = [
    {
      id: 'CMP001',
      subject: 'Tour Guide was unprofessional',
      category: 'tour_guide',
      priority: 'high',
      status: 'open',
      tourId: 'TKT001',
      tourName: 'Burj Khalifa & Dubai Mall',
      description: 'The tour guide was constantly on phone calls and did not provide proper information about the attractions.',
      createdAt: '2024-10-16',
      updatedAt: '2024-10-17',
      adminResponse: null,
      messages: [
        {
          id: 1,
          sender: 'user',
          message: 'The tour guide was constantly on phone calls and did not provide proper information about the attractions.',
          timestamp: '2024-10-16 14:30',
          attachments: []
        }
      ]
    },
    {
      id: 'CMP002',
      subject: 'Request for cancellation - Desert Safari',
      category: 'cancellation',
      priority: 'medium',
      status: 'in_progress',
      tourId: 'TKT002',
      tourName: 'Desert Safari Adventure',
      description: 'Due to weather conditions, I would like to cancel my desert safari booking scheduled for Oct 20.',
      createdAt: '2024-10-14',
      updatedAt: '2024-10-15',
      adminResponse: 'We understand your concern about weather. Our team is reviewing your cancellation request.',
      messages: [
        {
          id: 1,
          sender: 'user',
          message: 'Due to weather conditions, I would like to cancel my desert safari booking scheduled for Oct 20.',
          timestamp: '2024-10-14 09:15',
          attachments: []
        },
        {
          id: 2,
          sender: 'admin',
          message: 'We understand your concern about weather. Our team is reviewing your cancellation request.',
          timestamp: '2024-10-15 11:20',
          attachments: []
        }
      ]
    },
    {
      id: 'CMP003',
      subject: 'Refund request for cancelled tour',
      category: 'refund',
      priority: 'high',
      status: 'resolved',
      tourId: 'TKT005',
      tourName: 'Atlantis Aquaventure',
      description: 'Tour was cancelled by operator but refund has not been processed yet.',
      createdAt: '2024-08-12',
      updatedAt: '2024-08-14',
      adminResponse: 'Your refund of $95 has been processed and will reflect in your account within 3-5 business days.',
      rating: 5,
      messages: [
        {
          id: 1,
          sender: 'user',
          message: 'Tour was cancelled by operator but refund has not been processed yet.',
          timestamp: '2024-08-12 16:45',
          attachments: []
        },
        {
          id: 2,
          sender: 'admin',
          message: 'We apologize for the delay. Processing your refund now.',
          timestamp: '2024-08-13 10:30',
          attachments: []
        },
        {
          id: 3,
          sender: 'admin',
          message: 'Your refund of $95 has been processed and will reflect in your account within 3-5 business days.',
          timestamp: '2024-08-14 14:20',
          attachments: []
        }
      ]
    },
    {
      id: 'CMP004',
      subject: 'Transportation delay caused issues',
      category: 'transportation',
      priority: 'low',
      status: 'closed',
      tourId: 'TKT004',
      tourName: 'Old Dubai Heritage Tour',
      description: 'The pickup was 45 minutes late which affected the entire tour schedule.',
      createdAt: '2024-09-11',
      updatedAt: '2024-09-13',
      adminResponse: 'We sincerely apologize for the delay. We have provided feedback to our transportation partner.',
      rating: 3,
      messages: [
        {
          id: 1,
          sender: 'user',
          message: 'The pickup was 45 minutes late which affected the entire tour schedule.',
          timestamp: '2024-09-11 08:30',
          attachments: []
        },
        {
          id: 2,
          sender: 'admin',
          message: 'We sincerely apologize for the delay. We have provided feedback to our transportation partner.',
          timestamp: '2024-09-13 09:15',
          attachments: []
        }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'in_progress': return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed': return <XCircle className="h-5 w-5 text-gray-500" />;
      default: return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      open: 'bg-orange-100 text-orange-700',
      in_progress: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-700'}`;
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${classes[priority] || 'bg-gray-100 text-gray-700'}`;
  };

  const getCategoryIcon = (category) => {
    const cat = complaintCategories.find(c => c.value === category);
    return cat ? cat.icon : '📝';
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return complaint.status === 'open';
    if (activeTab === 'in_progress') return complaint.status === 'in_progress';
    if (activeTab === 'resolved') return complaint.status === 'resolved';
    if (activeTab === 'closed') return complaint.status === 'closed';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Complaints', count: complaints.length },
    { id: 'open', label: 'Open', count: complaints.filter(c => c.status === 'open').length },
    { id: 'in_progress', label: 'In Progress', count: complaints.filter(c => c.status === 'in_progress').length },
    { id: 'resolved', label: 'Resolved', count: complaints.filter(c => c.status === 'resolved').length },
    { id: 'closed', label: 'Closed', count: complaints.filter(c => c.status === 'closed').length }
  ];

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    console.log('New complaint:', newComplaint);
    // Here you would typically send the complaint to your API
    setShowNewComplaint(false);
    setNewComplaint({
      subject: '',
      category: 'tour_quality',
      priority: 'medium',
      tourId: '',
      description: '',
      attachments: []
    });
  };

  const handleSendMessage = (complaintId, message) => {
    console.log('Send message to complaint:', complaintId, message);
    // API call to send message
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Support & Complaints</h1>
              <p className="text-gray-600 mt-1">Submit complaints, cancellation requests, and get support from our team</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
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
                <p className="text-2xl font-bold text-orange-600">{complaints.filter(c => c.status === 'open').length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wide">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">2.4h</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="p-6 space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-3xl">{getCategoryIcon(complaint.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">{complaint.subject}</h3>
                          <p className="text-sm text-gray-500">
                            Complaint ID: {complaint.id} • Tour: {complaint.tourName}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(complaint.status)}
                          <span className={getStatusBadge(complaint.status)}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
                          </span>
                          <span className={getPriorityBadge(complaint.priority)}>
                            {complaint.priority} priority
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {complaint.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Updated: {complaint.updatedAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{complaint.messages.length} messages</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-gray-700 text-sm">{complaint.description}</p>
                      </div>

                      {complaint.adminResponse && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-blue-500 p-1 rounded-full">
                              <User className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-blue-800">Admin Response</span>
                          </div>
                          <p className="text-blue-700 text-sm">{complaint.adminResponse}</p>
                        </div>
                      )}

                      {complaint.rating && (
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-sm text-gray-600">Your rating:</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < complaint.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({complaint.rating}/5)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setSelectedComplaint(complaint)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  {complaint.status === 'open' || complaint.status === 'in_progress' ? (
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Add Message</span>
                    </button>
                  ) : null}

                  {complaint.status === 'resolved' && !complaint.rating && (
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Rate Response</span>
                    </button>
                  )}

                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call Support</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Complaint Modal */}
        {showNewComplaint && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Submit New Complaint</h2>
                  <button 
                    onClick={() => setShowNewComplaint(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitComplaint} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your complaint"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {complaintCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newComplaint.priority}
                      onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related Tour</label>
                  <select
                    value={newComplaint.tourId}
                    onChange={(e) => setNewComplaint({...newComplaint, tourId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a tour (optional)</option>
                    {userTours.map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.name} - {tour.date}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide detailed information about your complaint"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewComplaint(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Complaint</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Complaint Details Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{selectedComplaint.subject}</h2>
                    <p className="text-sm text-gray-500">Complaint ID: {selectedComplaint.id}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedComplaint(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Complaint Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Status</p>
                      <span className={getStatusBadge(selectedComplaint.status)}>
                        {selectedComplaint.status.charAt(0).toUpperCase() + selectedComplaint.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority</p>
                      <span className={getPriorityBadge(selectedComplaint.priority)}>
                        {selectedComplaint.priority} priority
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium text-gray-800">{selectedComplaint.createdAt}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Thread */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Conversation</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedComplaint.messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              message.sender === 'user' 
                                ? 'bg-white/20 text-white' 
                                : 'bg-blue-500 text-white'
                            }`}>
                              {message.sender === 'user' ? 'AH' : 'AD'}
                            </div>
                            <span className={`text-xs ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.sender === 'user' ? 'You' : 'Support Admin'}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Send New Message */}
                {(selectedComplaint.status === 'open' || selectedComplaint.status === 'in_progress') && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Send Message</h4>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Rate Response (for resolved complaints) */}
                {selectedComplaint.status === 'resolved' && !selectedComplaint.rating && (
                  <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
                    <h4 className="text-sm font-medium text-green-800 mb-3">Rate Our Response</h4>
                    <p className="text-sm text-green-700 mb-3">How satisfied are you with our support?</p>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className="text-yellow-400 hover:text-yellow-500 transition-colors"
                          >
                            <Star className="h-6 w-6" />
                          </button>
                        ))}
                      </div>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Submit Rating
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call Support</span>
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Support</span>
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Download Transcript</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Immediate Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 mb-3">24/7 Support Hotline</p>
              <p className="font-bold text-blue-600">+971-4-123-4567</p>
              <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Call Now
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="bg-green-500 p-3 rounded-full w-fit mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
              <p className="font-bold text-green-600">Available Now</p>
              <button className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get detailed assistance</p>
              <p className="font-bold text-purple-600">support@dubaitours.com</p>
              <button className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Send Email
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <button className="w-full text-left flex items-center justify-between">
                <h3 className="font-medium text-gray-800">How long does it take to get a response?</h3>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <button className="w-full text-left flex items-center justify-between">
                <h3 className="font-medium text-gray-800">Can I cancel my tour booking?</h3>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <button className="w-full text-left flex items-center justify-between">
                <h3 className="font-medium text-gray-800">How do I request a refund?</h3>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <button className="w-full text-left flex items-center justify-between">
                <h3 className="font-medium text-gray-800">What if my tour guide doesn't show up?</h3>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;