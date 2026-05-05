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
        : body.message || "Investor Reports API request failed"
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
    ...(options.headers || {}),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  return parseResponse(response);
};

export const investorReportsService = {
  getAdminInvestorReports: () =>
    adminRequest("/api/admin/investor-relations/reports"),

  addReport: (formData) =>
    adminRequest("/api/admin/investor-relations/reports", {
      method: "POST",
      body: formData,
    }),

  updateReport: (id, formData) =>
    adminRequest(`/api/admin/investor-relations/reports/${id}`, {
      method: "PATCH",
      body: formData,
    }),

  deleteReport: (id) =>
    adminRequest(`/api/admin/investor-relations/reports/${id}`, {
      method: "DELETE",
    }),

  updatePublishStatus: (id, isPublished) =>
    adminRequest(`/api/admin/investor-relations/reports/${id}/published`, {
      method: "PATCH",
      body: JSON.stringify({ isPublished }),
    }),
};
