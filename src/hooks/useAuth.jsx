import { useState, useCallback, createContext, useContext } from "react";
import { storage } from "../utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(storage.getAuth());

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json();

      if (response.ok && body.token) {
        localStorage.setItem("adminToken", body.token);

        if (body.admin?.email) {
          localStorage.setItem("adminEmail", body.admin.email);
        }

        if (body.admin?.name) {
          localStorage.setItem("adminName", body.admin.name);
        }

        storage.setAuth(true);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.warn("Admin API login unavailable:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");

    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminEmail");
    sessionStorage.removeItem("adminName");

    storage.setAuth(false);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}