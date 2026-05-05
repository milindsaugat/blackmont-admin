const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body?.message || "Careers API request failed");
    error.status = response.status;
    error.data = body?.data || null;
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

export const getAdminCareers = () =>
  adminRequest("/api/admin/careers");

export const updateCareerHeader = (payload) =>
  adminRequest("/api/admin/careers/header", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const createCareerJob = (payload) =>
  adminRequest("/api/admin/careers/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCareerJob = (jobId, payload) =>
  adminRequest(`/api/admin/careers/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteCareerJob = (jobId) =>
  adminRequest(`/api/admin/careers/jobs/${jobId}`, {
    method: "DELETE",
  });

export const toggleCareerJobStatus = (jobId, isActive) =>
  adminRequest(`/api/admin/careers/jobs/${jobId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });

export const updateApplicationProcess = (payload) =>
  adminRequest("/api/admin/careers/application-process", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const createApplicationStep = (payload) =>
  adminRequest("/api/admin/careers/application-process/steps", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateApplicationStep = (stepId, payload) =>
  adminRequest(`/api/admin/careers/application-process/steps/${stepId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteApplicationStep = (stepId) =>
  adminRequest(`/api/admin/careers/application-process/steps/${stepId}`, {
    method: "DELETE",
  });