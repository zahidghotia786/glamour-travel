// components/ComplaintDetailsModal.jsx
import React, { useState } from 'react';
import { 
  X, Send, Clock, User, Star, 
  AlertTriangle, CheckCircle, FileText,
  Download, Calendar, Phone, Mail
} from 'lucide-react';

const ComplaintDetailsModal = ({ 
  complaint, 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onRateComplaint, 
  onClose 
}) => {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'RESOLVED': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CLOSED': return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitRating = () => {
    if (rating > 0) {
      onRateComplaint(complaint.id, rating, ratingComment);
      setShowRating(false);
    }
  };

  const canRate = complaint.status === 'RESOLVED' && !complaint.rating;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(complaint.status)}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{complaint.subject}</h2>
                <p className="text-gray-600 text-sm capitalize">
                  {complaint.category.toLowerCase().replace(/_/g, ' ')} • Created {formatDate(complaint.createdAt)}
                </p>
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

        <div className="flex h-[calc(90vh-200px)]">
          {/* Messages Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {complaint.messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.senderType === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium capitalize">
                        {message.senderType === 'user' ? 'You' : 'Support Team'}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 text-sm bg-white/20 p-2 rounded-lg"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="flex-1 truncate">{attachment.name}</span>
                            <button className="hover:bg-white/20 p-1 rounded">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            {complaint.status !== 'CLOSED' && (
              <div className="border-t border-gray-100 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        onSendMessage(complaint.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => onSendMessage(complaint.id)}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Complaint Details */}
          <div className="w-80 border-l border-gray-100 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Complaint Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(complaint.status)}
                      <span className="font-medium capitalize">
                        {complaint.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Priority</label>
                    <p className="font-medium capitalize">{complaint.priority.toLowerCase()}</p>
                  </div>

                  {complaint.booking && (
                    <div>
                      <label className="text-sm text-gray-500">Booking Reference</label>
                      <p className="font-medium">{complaint.booking.reference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{complaint.contactEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{complaint.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Expected Outcome */}
              {complaint.expectedOutcome && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Expected Outcome</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {complaint.expectedOutcome.toLowerCase().replace(/_/g, ' ')}
                  </p>
                  {complaint.refundAmount && (
                    <p className="text-sm font-medium mt-1">
                      Refund Amount: {complaint.refundAmount} {complaint.booking?.currency || 'AED'}
                    </p>
                  )}
                </div>
              )}

              {/* Rating Section */}
              {canRate && !showRating && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Rate Resolution</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    How would you rate the resolution of your complaint?
                  </p>
                  <button
                    onClick={() => setShowRating(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                  >
                    Rate Now
                  </button>
                </div>
              )}

              {showRating && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 className="font-semibold text-yellow-800 mb-3">Rate Your Experience</h3>
                  <div className="flex justify-center space-x-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="text-2xl focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    placeholder="Additional comments (optional)"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm mb-3 resize-none"
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowRating(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitRating}
                      disabled={rating === 0}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition-colors"
                    >
                      Submit Rating
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Rating */}
              {complaint.rating && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Your Rating</h3>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < complaint.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {complaint.ratingComment && (
                    <p className="text-green-700 text-sm">{complaint.ratingComment}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;