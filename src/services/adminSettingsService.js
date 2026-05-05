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

export const adminSettingsService = {
  getDashboardSettings: async () => {
    const res = await fetch(`${API_BASE}/api/admin/dashboard-settings`, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  updateDashboardSettings: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/dashboard-settings`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  sendEmailOtp: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/settings/send-email-otp`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  verifyEmailOtp: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/settings/verify-email-otp`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  updatePassword: async (data) => {
    const res = await fetch(`${API_BASE}/api/admin/settings/update-password`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },
};
