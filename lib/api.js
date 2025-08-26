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