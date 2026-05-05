const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getHeaders = () => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (res) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

export const siteVisibilityService = {
  getVisibilitySettings: async () => {
    const res = await fetch(`${API_BASE}/api/admin/site-visibility`, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  updateVisibilitySettings: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/site-visibility`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },
};

export const publicSiteVisibilityService = {
  getVisibilitySettings: async () => {
    const res = await fetch(`${API_BASE}/api/site-visibility`, {
      method: "GET",
    });

    return handleResponse(res);
  },
};
