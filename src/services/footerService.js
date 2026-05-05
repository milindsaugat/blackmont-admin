const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const getToken = () => {
  return localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
};

const getAdminFooter = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/footer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin footer:", error);
    throw error;
  }
};

const updateFooterSocialLinks = async (payload) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error("Session expired. Please log out and log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/footer/social-links`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw new Error("Session expired. Please log out and log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating footer social links:", error);
    throw error;
  }
};

export { getAdminFooter, updateFooterSocialLinks };
