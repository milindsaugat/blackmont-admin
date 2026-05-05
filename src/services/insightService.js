const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "Insight API request failed");
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

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export const getAdminInsights = () => adminRequest("/api/admin/insights");

export const createInsight = (formData) =>
  adminRequest("/api/admin/insights", {
    method: "POST",
    body: formData,
  });

export const updateInsight = (id, formData) =>
  adminRequest(`/api/admin/insights/${id}`, {
    method: "PATCH",
    body: formData,
  });

export const deleteInsight = (id) =>
  adminRequest(`/api/admin/insights/${id}`, {
    method: "DELETE",
  });

export const toggleInsightFeatured = (id, isFeatured) =>
  adminRequest(`/api/admin/insights/${id}/featured`, {
    method: "PATCH",
    body: JSON.stringify({ isFeatured }),
  });

export const toggleInsightPublished = (id, isPublished) =>
  adminRequest(`/api/admin/insights/${id}/published`, {
    method: "PATCH",
    body: JSON.stringify({ isPublished }),
  });

export const getAdminInsightHeader = () =>
  adminRequest("/api/admin/insights/header");

export const updateInsightHeader = (payload) =>
  adminRequest("/api/admin/insights/header", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
