const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || "Newsroom API request failed");
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

export const getAdminNewsroom = () =>
  adminRequest("/api/admin/insights/newsroom");

export const updateNewsroomHeader = (payload) =>
  adminRequest("/api/admin/insights/newsroom", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const createNewsroomArticle = (formData) =>
  adminRequest("/api/admin/insights/newsroom/articles", {
    method: "POST",
    body: formData,
  });

export const updateNewsroomArticle = (articleId, formData) =>
  adminRequest(`/api/admin/insights/newsroom/articles/${articleId}`, {
    method: "PATCH",
    body: formData,
  });

export const toggleNewsroomArticlePublished = (articleId, isPublished) =>
  adminRequest(`/api/admin/insights/newsroom/articles/${articleId}/published`, {
    method: "PATCH",
    body: JSON.stringify({ isPublished }),
  });

export const deleteNewsroomArticle = (articleId) =>
  adminRequest(`/api/admin/insights/newsroom/articles/${articleId}`, {
    method: "DELETE",
  });
