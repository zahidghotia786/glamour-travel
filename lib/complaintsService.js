// lib/complaintsService.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getHeaders() {
  // For Next.js, we need to handle token retrieval safely
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
  }
  
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Helper function to handle API responses
async function handleResponse(response) {
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || result.message || `HTTP error! status: ${response.status}`);
  }
  
  return result;
}

// Get user complaints
export async function getUserComplaints(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/api/complaints${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get complaints error:', error);
    throw new Error(error.message || 'Failed to fetch complaints');
  }
}

// Create new complaint
export async function createComplaint(complaintData) {
  try {
    // Clean up the data - remove empty strings for optional fields
    const cleanedData = {
      ...complaintData,
      bookingId: complaintData.bookingId || undefined,
      tourId: complaintData.tourId || undefined,
      tourName: complaintData.tourName || undefined,
      expectedOutcome: complaintData.expectedOutcome || undefined,
      refundAmount: complaintData.refundAmount ? parseFloat(complaintData.refundAmount) : undefined,
      preferredContactMethod: complaintData.preferredContactMethod || undefined,
      attachments: complaintData.attachments || undefined
    };

    const response = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cleanedData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Create complaint error:', error);
    throw new Error(error.message || 'Failed to create complaint');
  }
}

// Get complaint details
export async function getComplaintDetails(complaintId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get complaint details error:', error);
    throw new Error(error.message || 'Failed to fetch complaint details');
  }
}

// Add message to complaint
export async function addComplaintMessage(complaintId, messageData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/messages`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Add complaint message error:', error);
    throw new Error(error.message || 'Failed to send message');
  }
}

// Rate complaint resolution
export async function rateComplaint(complaintId, ratingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/rate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        rating: parseInt(ratingData.rating),
        comment: ratingData.comment || ''
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Rate complaint error:', error);
    throw new Error(error.message || 'Failed to submit rating');
  }
}

// Get user bookings for complaints
export async function getUserBookingsForComplaints() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/complaints/bookings`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Get user bookings error:', error);
    throw new Error(error.message || 'Failed to fetch bookings');
  }
}

// Upload attachments for complaint
export async function uploadComplaintAttachments(files) {
  try {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('attachments', file);
    });

    // For file uploads, we need different headers
    const token = typeof window !== 'undefined' ? 
      (localStorage.getItem('token') || sessionStorage.getItem('token') || '') : '';
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetch(`${API_BASE_URL}/api/complaints/upload`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Upload attachments error:', error);
    throw new Error(error.message || 'Failed to upload attachments');
  }
}

export default {
  getUserComplaints,
  createComplaint,
  getComplaintDetails,
  addComplaintMessage,
  rateComplaint,
  getUserBookingsForComplaints,
  uploadComplaintAttachments
};