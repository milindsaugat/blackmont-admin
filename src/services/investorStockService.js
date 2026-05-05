const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const isAuthError = response.status === 401 || response.status === 403;
    const error = new Error(
      isAuthError
        ? "Admin session expired or invalid. Please sign in again."
        : body.message || "Investor Stock Info API request failed"
    );
    error.status = response.status;
    error.data = body.data || null;
    throw error;
  }
  return body.data;
};

const adminRequest = async (path, options = {}) => {
  const token = getStoredToken();
  if (!token) {
    const error = new Error("Admin session token missing. Please sign in again.");
    error.status = 401;
    throw error;
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  return parseResponse(response);
};

export const investorStockService = {
  getAdminStockInfo: () =>
    adminRequest("/api/admin/investor-relations/stock-information"),

  addLeftCard: (data) =>
    adminRequest("/api/admin/investor-relations/stock-information/left-cards", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLeftCard: (id, data) =>
    adminRequest(`/api/admin/investor-relations/stock-information/left-cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteLeftCard: (id) =>
    adminRequest(`/api/admin/investor-relations/stock-information/left-cards/${id}`, {
      method: "DELETE",
    }),

  addInfoItem: (data) =>
    adminRequest("/api/admin/investor-relations/stock-information/info-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateInfoItem: (id, data) =>
    adminRequest(`/api/admin/investor-relations/stock-information/info-items/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteInfoItem: (id) =>
    adminRequest(`/api/admin/investor-relations/stock-information/info-items/${id}`, {
      method: "DELETE",
    }),
};
