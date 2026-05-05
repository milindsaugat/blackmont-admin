const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

const getErrorMessage = (body) => {
  if (body?.error?.message) return body.error.message;
  if (typeof body?.error === "string") return body.error;
  if (body?.message) return body.message;
  return "Home editor API request failed";
};

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const isAuthError = response.status === 401 || response.status === 403;

    const error = new Error(
      isAuthError
        ? "Admin session expired or invalid. Please sign in again."
        : getErrorMessage(body)
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

/* HomeAboutPreview */
export const getAdminHomeAbout = () =>
  adminRequest("/api/admin/home-about");

export const updateHomeAbout = (payload) =>
  adminRequest("/api/admin/home-about", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

/* Why Blackmont */
export const getAdminWhyBlackmont = () =>
  adminRequest("/api/admin/home/why-blackmont");

export const updateWhyBlackmont = (payload) =>
  adminRequest("/api/admin/home/why-blackmont", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

/* Contact CTA */
export const getAdminContactCta = () =>
  adminRequest("/api/admin/home/contact-cta");

export const updateContactCta = (payload) =>
  adminRequest("/api/admin/home/contact-cta", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });