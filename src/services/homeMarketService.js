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
        : body.message || "HomeMarket API request failed"
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

export const getAdminHomeMarket = () =>
  adminRequest("/api/admin/home-market");

export const updateHomeMarket = (payload) =>
  adminRequest("/api/admin/home-market", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const addHomeMarketTag = (tag) =>
  adminRequest("/api/admin/home-market/tags", {
    method: "POST",
    body: JSON.stringify({ tag }),
  });

export const deleteHomeMarketTag = (tag) =>
  adminRequest(`/api/admin/home-market/tags/${encodeURIComponent(tag)}`, {
    method: "DELETE",
  });

export const addChartDataPoint = (year, value, label = "Year High USD") =>
  adminRequest("/api/admin/home-market/chart-data", {
    method: "POST",
    body: JSON.stringify({ year, value, label }),
  });

export const deleteChartDataPoint = (dataId) =>
  adminRequest(`/api/admin/home-market/chart-data/${dataId}`, {
    method: "DELETE",
  });
