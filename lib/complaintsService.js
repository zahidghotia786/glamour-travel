const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Get user complaints
export const getUserComplaints = async (filters = {}) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);

    const response = await fetch(`${API_BASE_URL}/api/complaints?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch complaints: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get complaints error:', error);
    throw error;
  }
};

// Create new complaint
export const createComplaint = async (complaintData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(complaintData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create complaint');
    }

    return result;
  } catch (error) {
    console.error('Create complaint error:', error);
    throw error;
  }
};

// Get complaint details
export const getComplaintDetails = async (complaintId) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch complaint details');
    }

    return result;
  } catch (error) {
    console.error('Get complaint details error:', error);
    throw error;
  }
};

// Add message to complaint
export const addComplaintMessage = async (complaintId, messageData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(messageData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message');
    }

    return result;
  } catch (error) {
    console.error('Add complaint message error:', error);
    throw error;
  }
};

// Rate complaint resolution
export const rateComplaint = async (complaintId, ratingData) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ratingData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit rating');
    }

    return result;
  } catch (error) {
    console.error('Rate complaint error:', error);
    throw error;
  }
};

// Get user bookings for complaints
export const getUserBookingsForComplaints = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/api/complaints/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch bookings');
    }

    return result;
  } catch (error) {
    console.error('Get user bookings error:', error);
    throw error;
  }
};