import React, { useState, useEffect } from "react";
import {
  Save,
  Link as LinkIcon,
  ToggleRight,
  ToggleLeft,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiSettingsService } from "../services/apiSettingsService";

const Section = ({ icon: Icon, title, desc, children }) => (
  <div
    style={{
      background: "#0a0a0a",
      border: "1px solid #161616",
      borderRadius: "22px",
      overflow: "hidden",
      boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    }}
  >
    <div
      style={{
        padding: "22px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #161616",
        background: "#080808",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(212,175,55,0.04)",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <Icon size={18} color="#D4AF37" />
        </div>
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em",
            }}
          >
            {title}
          </h2>
          <p style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>
            {desc}
          </p>
        </div>
      </div>
    </div>
    <div style={{ padding: "36px 32px" }}>{children}</div>
  </div>
);

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const result = await apiSettingsService.getSettings();

      if (result.success && result.data) {
        setApiKey(result.data.apiKey || "");
        setIsActive(result.data.isActive ?? true);
      }
    } catch (error) {
      console.error("Failed to fetch API settings:", error);
      setMessage({ type: "error", text: error.message || "Failed to load API settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const result = await apiSettingsService.updateSettings({
        apiKey,
        isActive,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "API settings saved successfully.",
        });

        if (result.data) {
          setApiKey(result.data.apiKey || "");
          setIsActive(result.data.isActive ?? true);
        }

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Failed to save settings.",
        });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setMessage({
        type: "error",
        text: error.message || "An error occurred while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#666", textAlign: "center" }}>
        <Loader2 className="animate-spin" size={24} style={{ margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: "32px", maxWidth: "960px", margin: "0 auto", paddingBottom: "80px" }}
      className="animate-fade-in"
    >
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "28px",
            color: "#fff",
            fontWeight: 300,
            fontFamily: "var(--font-display)",
            marginBottom: "8px",
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          API <span style={{ color: "#D4AF37", fontWeight: 500 }}>Integrations</span>
        </h1>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Manage the third-party live metal rates API key for the official website.
        </p>
      </div>

      {message.text && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "6px",
            fontSize: "14px",
            background:
              message.type === "error"
                ? "rgba(153, 27, 27, 0.1)"
                : "rgba(6, 95, 70, 0.1)",
            color: message.type === "error" ? "#F87171" : "#34D399",
            border: `1px solid ${
              message.type === "error"
                ? "rgba(248, 113, 113, 0.2)"
                : "rgba(52, 211, 153, 0.2)"
            }`,
          }}
        >
          {message.text}
        </div>
      )}

      <Section
        icon={LinkIcon}
        title="Metal Prices API"
        desc="Store only the API key. The backend builds the provider URL privately."
      >
        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#555",
                  letterSpacing: "0.25em",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  marginLeft: "4px",
                }}
              >
                API Status
              </label>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: isActive ? "#D4AF37" : "#555",
                  fontWeight: 500,
                  fontSize: "14px",
                  fontFamily: "var(--font-display)",
                }}
              >
                {isActive ? (
                  <ToggleRight size={36} color="#D4AF37" />
                ) : (
                  <ToggleLeft size={36} color="#555" />
                )}
                {isActive ? "Active (Fetching Live Rates)" : "Paused"}
              </button>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#555",
                  letterSpacing: "0.25em",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  marginLeft: "4px",
                }}
              >
                Third Party API Key
              </label>

              <div style={{ position: "relative" }}>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter Metalprice API key"
                  style={{
                    width: "100%",
                    height: "52px",
                    padding: "0 48px 0 20px",
                    background: "#070707",
                    border: "1px solid #1a1a1a",
                    borderRadius: "14px",
                    color: "#eee",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "monospace",
                    transition: "border-color 0.3s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "#1a1a1a")}
                />

                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#444",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="gold-btn"
              style={{
                marginTop: "10px",
                padding: "14px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                borderRadius: "12px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                opacity: saving ? 0.6 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "SAVING..." : "SAVE SETTINGS"}
            </button>
          </div>
        </form>
      </Section>
    </motion.div>
  );
};

export default ApiSettings;
