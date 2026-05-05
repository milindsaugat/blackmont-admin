const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api`
).replace(/\/$/, "");

const getStoredToken = () =>
  localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

export const getDashboardOverview = async () => {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}/admin/dashboard/overview`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || "Failed to fetch dashboard overview");
  }

  return body.data || null;
};