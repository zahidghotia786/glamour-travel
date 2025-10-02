// components/ComplaintCard.jsx
import React from 'react';
import { 
  MessageSquare, Clock, AlertTriangle, 
  CheckCircle, FileText, ChevronRight 
} from 'lucide-react';

const ComplaintCard = ({ complaint, onViewDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'RESOLVED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'CLOSED': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={onViewDetails}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getStatusIcon(complaint.status)}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{complaint.subject}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {complaint.category.toLowerCase().replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {complaint.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>
              {complaint.messages?.length || 0} {complaint.messages?.length === 1 ? 'message' : 'messages'}
            </span>
          </div>
          {complaint.booking && (
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>Booking: {complaint.booking.reference}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div>Created: {formatDate(complaint.createdAt)}</div>
          {complaint.rating && (
            <div className="flex items-center space-x-1 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < complaint.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;