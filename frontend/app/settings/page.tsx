"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, type Settings } from "@/lib/api";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [form, setForm] = useState({
    business_name: "",
    google_review_link: "",
    textback_message: "",
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
        setForm({
          business_name: data.business_name,
          google_review_link: data.google_review_link,
          textback_message: data.textback_message,
        });
      } catch {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateSettings(form);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      showToast("Settings saved successfully!");
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const isDirty = settings
    ? form.business_name !== settings.business_name ||
      form.google_review_link !== settings.google_review_link ||
      form.textback_message !== settings.textback_message
    : false;

  const inputStyle = {
    width: "100%",
    backgroundColor: "#FFFFFF",
    border: "1px solid #EEEBE6",
    borderRadius: 8,
    fontSize: 13,
    padding: "10px 12px",
    color: "#1A1A1A",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: "#1A1A1A",
    display: "block",
    marginBottom: 6,
  };

  const helperStyle = {
    fontSize: 11,
    color: "#9B9589",
    marginTop: 4,
  };

  return (
    <div
      className="page-enter"
      style={{
        padding: 24,
        maxWidth: 600,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="flex items-center"
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 50,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${
              toast.type === "success" ? "#BBF7D0" : "#FECACA"
            }`,
            borderRadius: 10,
            padding: "10px 16px",
            gap: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <CheckCircle
            style={{
              width: 16,
              height: 16,
              color: toast.type === "success" ? "#16A34A" : "#DC2626",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: "#1A1A1A" }}>
            {toast.message}
          </span>
        </div>
      )}

      {loading ? (
        <div
          className="flex items-center justify-center"
          style={{ padding: "80px 0" }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "2px solid #4F46E5",
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      ) : (
        /* Main settings card */
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EEEBE6",
            borderRadius: 10,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Business Name */}
          <div>
            <label style={labelStyle}>Business Name</label>
            <input
              type="text"
              value={form.business_name}
              onChange={handleChange("business_name")}
              placeholder="e.g. San Pedro Sport Fishing"
              style={inputStyle}
            />
            <p style={helperStyle}>
              Appears in review request messages and throughout the dashboard.
            </p>
          </div>

          <div style={{ borderTop: "1px solid #EEEBE6" }} />

          {/* Google Review Link */}
          <div>
            <label style={labelStyle}>Google Review Link</label>
            <input
              type="url"
              value={form.google_review_link}
              onChange={handleChange("google_review_link")}
              placeholder="https://g.page/r/your-business/review"
              style={inputStyle}
            />
            <p style={helperStyle}>
              Included in the review request SMS sent to satisfied customers.
            </p>
          </div>

          <div style={{ borderTop: "1px solid #EEEBE6" }} />

          {/* Text-back Message */}
          <div>
            <label style={labelStyle}>Missed Call Text-Back Message</label>
            <textarea
              value={form.textback_message}
              onChange={handleChange("textback_message")}
              rows={4}
              placeholder="Hey, this is [Business]! Sorry we missed you…"
              style={{
                ...inputStyle,
                resize: "none",
                lineHeight: 1.6,
              }}
            />
            <div
              className="flex items-center justify-between"
              style={{ marginTop: 4 }}
            >
              <p style={helperStyle}>
                Sent automatically when a call goes unanswered.
              </p>
              <div className="flex items-center" style={{ gap: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "monospace",
                    color:
                      form.textback_message.length > 120
                        ? "#D97706"
                        : "#9B9589",
                  }}
                >
                  {form.textback_message.length}
                </span>
                <span style={{ fontSize: 11, color: "#C5C0BA" }}>chars</span>
                {form.textback_message.length > 120 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      backgroundColor: "#FEF9C3",
                      color: "#854D0E",
                      borderRadius: 4,
                      padding: "2px 6px",
                    }}
                  >
                    {Math.ceil(form.textback_message.length / 160)} segments
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #EEEBE6" }} />

          {/* Save area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {isDirty && (
              <div className="flex items-center" style={{ gap: 6 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#D97706",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#854D0E",
                  }}
                >
                  Unsaved changes
                </span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving || (!isDirty && !saveSuccess)}
              className="flex items-center justify-center"
              style={{
                width: "100%",
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                padding: "10px",
                borderRadius: 8,
                border: "none",
                cursor:
                  saving || (!isDirty && !saveSuccess)
                    ? "not-allowed"
                    : "pointer",
                backgroundColor: saveSuccess ? "#DCFCE7" : "#4F46E5",
                color: saveSuccess ? "#166534" : "#FFFFFF",
                opacity: saving || (!isDirty && !saveSuccess) ? 0.5 : 1,
                transition: "background-color 0.2s ease",
              }}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle style={{ width: 16, height: 16 }} />
                  Saved!
                </>
              ) : saving ? (
                <>
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#FFFFFF",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Saving…
                </>
              ) : (
                "Save Settings"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Instance info */}
      {settings && (
        <div
          style={{
            backgroundColor: "#F5F2EE",
            border: "1px solid #EEEBE6",
            borderRadius: 10,
            padding: 16,
          }}
        >
          <p
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9B9589",
              fontWeight: 500,
              marginBottom: 10,
            }}
          >
            Instance Info
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ fontSize: 11, color: "#9B9589", margin: 0 }}>
              <span>Settings ID </span>
              <span
                className="font-mono"
                style={{ color: "#1A1A1A", fontWeight: 500 }}
              >
                #{settings.id}
              </span>
            </p>
            <p style={{ fontSize: 11, color: "#9B9589", margin: 0 }}>
              <span>Created </span>
              {new Date(settings.created_at).toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: "#9B9589", margin: 0 }}>
              <span>Last updated </span>
              {new Date(settings.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
