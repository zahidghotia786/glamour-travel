export async function fetchFromAPI(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      }
    );

    const data = await res.json();
    console.log("API response:", data);

    if (!res.ok) {
      const errorMessage = data.error || data.message || "API error";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    
    throw error;
  }
}

// --------- PRODUCTS ----------
export async function adminListProducts() {
  return fetchFromAPI('admin/products');
}

export async function adminCreateProduct(payload) {
  return fetchFromAPI('admin/products', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateProduct(id, payload) {
  return fetchFromAPI(`admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteProduct(id) {
  return fetchFromAPI(`admin/products/${id}`, {
    method: "DELETE",
  });
}

// --------- MARKUP ----------
export async function adminListMarkups() {
  return fetchFromAPI('admin/b2b/markup');
}

export const adminGetB2BUsers = async () => {
  return fetchFromAPI('admin/b2b/users');
};

export async function adminUpsertMarkup(payload) {
  return fetchFromAPI('admin/b2b/markup', {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteMarkup(id) {
  return fetchFromAPI(`admin/b2b/markup/${id}`, {
    method: "DELETE",
  });
}

// --------- BOOKINGS ----------
export async function adminListBookings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return fetchFromAPI(`admin/bookings?${qs}`);
}

export async function adminCancelBooking(id) {
  return fetchFromAPI(`admin/bookings/${id}/cancel`, {
    method: "PATCH",
  });
}

// Admin API functions
export const adminApi = {
  // Get dashboard summary
  getSummary: () => fetchFromAPI('admin/summary'), // REMOVED leading slash
  
  // User management
  getUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return fetchFromAPI(`admin/users${queryString ? `?${queryString}` : ''}`); // REMOVED leading slash
  },
  
  getUserDetails: (userId) => fetchFromAPI(`admin/users/${userId}`), 
  
  updateUserStatus: (userId, isActive) => 
    fetchFromAPI(`admin/users/${userId}/status`, { // REMOVED leading slash
      method: 'PATCH',
      body: JSON.stringify({ isActive }) // ADDED JSON.stringify
    }),
  
  updateUserRole: (userId, role) =>
    fetchFromAPI(`admin/users/${userId}/role`, { // REMOVED leading slash
      method: 'PATCH',
      body: JSON.stringify({ role }) // ADDED JSON.stringify
    }),
  
  deleteUser: (userId) =>
    fetchFromAPI(`admin/users/${userId}`, { // REMOVED leading slash
      method: 'DELETE'
    }),
  

    //create b2b user

createB2BUser: (userData) =>
  fetchFromAPI('admin/b2b/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

    // account manager assignment

    assignAccountManager: (userId, managerId) =>
  fetchFromAPI(`admin/users/${userId}/assign-manager`, {
    method: 'PATCH',
    body: JSON.stringify({ accountManagerId: managerId })
  }),


  // Booking management
  getBookings: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return fetchFromAPI(`admin/bookings${queryString ? `?${queryString}` : ''}`); // REMOVED leading slash
  },
  
  updateBookingStatus: (bookingId, status) =>
    fetchFromAPI(`admin/bookings/${bookingId}/status`, { // REMOVED leading slash
      method: 'PATCH',
      body: JSON.stringify({ status }) // ADDED JSON.stringify
    })
};

// B2B API functions
export const b2bApi = {
  // Get B2B dashboard data
  getDashboard: (timeFrame = '30') => 
    fetchFromAPI(`b2b/dashboard?timeFrame=${timeFrame}`), // REMOVED leading slash
  
  // Get B2B bookings
  getBookings: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return fetchFromAPI(`b2b/bookings${queryString ? `?${queryString}` : ''}`); // REMOVED leading slash
  },
  
  // Get booking details
  getBookingDetails: (bookingId) => fetchFromAPI(`b2b/bookings/${bookingId}`), // REMOVED leading slash
  
  // Download voucher
  downloadVoucher: (bookingId) =>
    fetchFromAPI(`b2b/bookings/${bookingId}/voucher`, { // REMOVED leading slash
      headers: { 'Accept': 'application/pdf' }
    }),
  
  // Get commission details
  getCommissions: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return fetchFromAPI(`b2b/commissions${queryString ? `?${queryString}` : ''}`); // REMOVED leading slash
  }
};

// Auth API functions
export const authApi = {
  login: (email, password) =>
    fetchFromAPI('auth/login', { // REMOVED leading slash
      method: 'POST',
      body: JSON.stringify({ email, password }) // ADDED JSON.stringify
    }),
  
  register: (userData) =>
    fetchFromAPI('auth/register', { // REMOVED leading slash
      method: 'POST',
      body: JSON.stringify(userData) // ADDED JSON.stringify
    }),
  
  logout: () =>
    fetchFromAPI('auth/logout', { // REMOVED leading slash
      method: 'POST'
    }),
  
  verifyToken: () => fetchFromAPI('auth/verify'), // REMOVED leading slash
  
  refreshToken: () => fetchFromAPI('auth/refresh', { // REMOVED leading slash
    method: 'POST' 
  })
};

// User API functions (for regular users)
// Update your userApi object
export const userApi = {
  // User profile
  getProfile: () => fetchFromAPI('users/profile'),
  
  updateProfile: (userData) =>
    fetchFromAPI('users/profile', {
      method: 'PATCH',
      body: JSON.stringify(userData)
    }),

  // User bookings
  getBookings: (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return fetchFromAPI(`users/bookings${queryString ? `?${queryString}` : ''}`);
  },

  // Admin profile
  getAdminProfile: () => fetchFromAPI('users/admin/profile'),
  
  updateAdminProfile: (adminData) =>
    fetchFromAPI('users/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(adminData)
    }),

  // Admin settings
  getAdminSettings: () => fetchFromAPI('users/admin/settings'),
  
  updateAdminSettings: (settingsData) =>
    fetchFromAPI('users/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settingsData)
    })
};

// Error handling utility
export const handleApiError = (error, toast) => {
  console.error('API Error:', error);
  
  if (error.message.includes('401')) {
    toast.error('Authentication failed. Please login again.');
    // Redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return;
  }
  
  if (error.message.includes('403')) {
    toast.error('You do not have permission to perform this action.');
    return;
  }
  
  if (error.message.includes('404')) {
    toast.error('Resource not found.');
    return;
  }
  
  if (error.message.includes('500')) {
    toast.error('Server error. Please try again later.');
    return;
  }
  
  // Generic error message
  toast.error(error.message || 'Something went wrong. Please try again.');
};

// Toast configuration
export const toastConfig = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#1f2937',
  }
};