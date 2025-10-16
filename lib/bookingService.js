// lib/bookingService.js - Frontend service with token authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Get authentication token from localStorage or sessionStorage
 * @returns {string|null} Auth token or null if not found
 */
export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  // Check localStorage first, then sessionStorage
  const token = localStorage.getItem('authToken') || 
                sessionStorage.getItem('authToken') ||
                localStorage.getItem('token') ||
                sessionStorage.getItem('token');

  return token;
}

/**
 * Remove authentication token
 */
export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Get headers with authentication token
 * @returns {Object} Headers object
 */
function getHeaders() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Create a new booking
 * @param {Object} bookingData - The booking data from prepareBookingData()
 * @returns {Promise} API response
 */
export async function createBooking(bookingData) {
  try {
    console.log('=== FRONTEND: SENDING BOOKING REQUEST ===');
    console.log('User authenticated:', isAuthenticated());
    console.log('Booking data:', JSON.stringify(bookingData, null, 2));

    // 🛠️ FIXED: Correct endpoint path
    const response = await fetch(`${API_BASE_URL}/api/booking/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    console.log('=== FRONTEND: API RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Frontend booking service error:', error);
    
    // Enhanced error handling
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    
    throw error;
  }
}

/**
 * 🆕 Create booking with payment integration
 */
export async function createBookingWithPayment(bookingData) {
  try {
    console.log('=== FRONTEND: SENDING BOOKING WITH PAYMENT REQUEST ===');
    console.log(bookingData)
    
    // 🛠️ FIXED: Use the correct endpoint
    const response = await fetch(`${API_BASE_URL}/api/booking/create-with-payment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    console.log('=== FRONTEND: BOOKING WITH PAYMENT RESPONSE ===');
    console.log('Response status:', response.status);
    console.log('Response data:', result);

    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    return result;
  } catch (error) {
    console.error('Booking with payment error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
    }
    
    throw error;
  }
}

/**
 * Create payment session
 */
export async function createPaymentSession(paymentData) {
  try {
    console.log('Creating payment session:', paymentData);

    // 🛠️ FIXED: Correct endpoint path
    const response = await fetch(`${API_BASE_URL}/api/payments/create-session`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create payment session');
    }

    return result;
  } catch (error) {
    console.error('Payment session creation error:', error);
    throw error;
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(paymentIntentId) {
  try {
    // 🛠️ FIXED: Correct endpoint path
    const response = await fetch(`${API_BASE_URL}/api/payments/status/${paymentIntentId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment status check error:', error);
    throw error;
  }
}

/**
 * Get user's bookings
 * @returns {Promise<Array>} User bookings
 */
export async function getUserBookings() {
  try {
    // 🛠️ FIXED: Correct endpoint path
    const url = `${API_BASE_URL}/api/booking/my-bookings`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user bookings: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
}

/**
 * Cancel a booking
 * @param {Object} cancellationData - Cancellation data
 * @returns {Promise} Cancellation result
 */
export async function cancelBooking(cancellationData) {
  try {
    // 🛠️ FIXED: Correct endpoint path
    const response = await fetch(`${API_BASE_URL}/api/booking/cancel`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cancellationData),
    });

    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Cancellation failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

/**
 * Get booked tickets
 * @param {Object} ticketData - Ticket data
 * @returns {Promise} Ticket information
 */
export async function getBookedTickets(ticketData) {
  try {
    // 🛠️ FIXED: Correct endpoint path
    const response = await fetch(`${API_BASE_URL}/api/tour/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(ticketData),
    });

    if (response.status === 401) {
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

export default {
  getAuthToken,
  removeAuthToken, // 🛠️ ADDED: Export removeAuthToken
  isAuthenticated,
  createBooking,
  createBookingWithPayment, // 🛠️ ADDED: New function
  getUserBookings,
  cancelBooking,
  getBookedTickets,
  createPaymentSession,
  checkPaymentStatus,
};