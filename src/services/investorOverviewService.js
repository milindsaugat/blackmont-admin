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
        : body.message || "Investor Overview API request failed"
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

const buildCorporateGovernancePayload = (payload = {}) => {
  const editableFields = { ...payload };
  delete editableFields._id;
  delete editableFields.__v;
  delete editableFields.createdAt;
  delete editableFields.updatedAt;
  delete editableFields.pillars;
  return editableFields;
};

export const investorOverviewService = {
  // GET admin investor overview
  getAdminInvestorOverview: () =>
    adminRequest("/api/admin/investor-relations/overview"),

  // POST new framework card
  addFrameworkCard: (formData) =>
    adminRequest("/api/admin/investor-relations/overview/cards", {
      method: "POST",
      body: formData,
    }),

  // PATCH update framework card
  updateFrameworkCard: (cardId, formData) =>
    adminRequest(`/api/admin/investor-relations/overview/cards/${cardId}`, {
      method: "PATCH",
      body: formData,
    }),

  // DELETE framework card
  deleteFrameworkCard: (cardId) =>
    adminRequest(`/api/admin/investor-relations/overview/cards/${cardId}`, {
      method: "DELETE",
    }),

  // GET admin corporate governance
  getAdminCorporateGovernance: () =>
    adminRequest("/api/admin/investor-relations/corporate-governance"),

  // PATCH corporate governance main
  updateCorporateGovernance: (payload) =>
    adminRequest("/api/admin/investor-relations/corporate-governance", {
      method: "PATCH",
      body: JSON.stringify(buildCorporateGovernancePayload(payload)),
    }),

  // POST add pillar
  addGovernancePillar: (payload) =>
    adminRequest("/api/admin/investor-relations/corporate-governance/pillars", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // PATCH update pillar
  updateGovernancePillar: (pillarId, payload) =>
    adminRequest(`/api/admin/investor-relations/corporate-governance/pillars/${pillarId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  // DELETE pillar
  deleteGovernancePillar: (pillarId) =>
    adminRequest(`/api/admin/investor-relations/corporate-governance/pillars/${pillarId}`, {
      method: "DELETE",
    }),
};
