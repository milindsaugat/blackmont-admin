const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getHeaders = () => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiSettingsService = {
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/api/admin/api-settings`, {
      headers: getHeaders(),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load API settings");

    return data;
  },

  updateSettings: async ({ apiKey, isActive }) => {
    const res = await fetch(`${API_BASE}/api/admin/api-settings`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ apiKey, isActive }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to save API settings");

    return data;
  },
};
