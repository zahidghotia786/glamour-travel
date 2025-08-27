export async function fetchFromAPI(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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

    if (!res.ok) {
      // Backend 'error' property use karein, 'message' nahi
      const errorMessage = data.error || data.message || "API error";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    
    // Network errors ya other exceptions handle karein
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    
    // Re-throw the error
    throw error;
  }
}




const BASE = process.env.NEXT_PUBLIC_API_URL 

// Add your auth token attach logic here (cookie/header)
function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --------- PRODUCTS ----------
export async function adminListProducts() {
  const res = await fetch(`${BASE}/api/admin/products`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function adminCreateProduct(payload) {
  const res = await fetch(`${BASE}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adminUpdateProduct(id, payload) {
  const res = await fetch(`${BASE}/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function adminDeleteProduct(id) {
  const res = await fetch(`${BASE}/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --------- MARKUP ----------
export async function adminListMarkups() {
  const res = await fetch(`${BASE}/api/admin/b2b/markup`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch markups");
  return res.json();
}
export async function adminUpsertMarkup(payload) {
  const res = await fetch(`${BASE}/api/admin/b2b/markup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function adminDeleteMarkup(id) {
  const res = await fetch(`${BASE}/api/admin/b2b/markup/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// --------- BOOKINGS ----------
export async function adminListBookings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/admin/bookings?${qs}`, { headers: { ...authHeaders() } });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}
export async function adminCancelBooking(id) {
  const res = await fetch(`${BASE}/api/admin/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
