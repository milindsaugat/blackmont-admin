const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () => {
  return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
};

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const isAuthError = response.status === 401 || response.status === 403;
    const error = new Error(
      isAuthError
        ? "Admin session expired or invalid. Please sign in again."
        : body.message || "Legal API request failed"
    );
    error.status = response.status;
    error.data = body.data || null;
    throw error;
  }

  if (body.success !== true) {
    const error = new Error(body.message || "Legal API request did not confirm success");
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  return parseResponse(response);
};

export const getAdminLegalByType = (type) =>
  adminRequest(`/api/admin/legal/${type}`);

export const createAdminLegal = (type, payload) =>
  adminRequest(`/api/admin/legal/${type}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminLegal = (type, payload) =>
  adminRequest(`/api/admin/legal/${type}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteAdminLegal = (type) =>
  adminRequest(`/api/admin/legal/${type}`, {
    method: "DELETE",
  });
