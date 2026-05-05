const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");
const API_ROOT = API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const isAuthError = response.status === 401 || response.status === 403;
    const error = new Error(
      isAuthError
        ? "Admin session expired or invalid. Please sign in again."
        : body.message || "Service card API request failed"
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

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return parseResponse(response);
};

export const createServiceCard = (data) =>
  adminRequest("/admin/service-cards", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAdminServiceCards = () =>
  adminRequest("/admin/service-cards");

export const updateServiceCard = (id, data) =>
  adminRequest(`/admin/service-cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteServiceCard = (id) =>
  adminRequest(`/admin/service-cards/${id}`, {
    method: "DELETE",
  });
