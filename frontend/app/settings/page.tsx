"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, type Settings } from "@/lib/api";
import {
  Settings as SettingsIcon,
  CheckCircle,
  Save,
  Link as LinkIcon,
  Building2,
  MessageSquare,
} from "lucide-react";

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
      showToast("Settings saved successfully! ✓");
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
    background: "rgba(10, 22, 40, 0.7)",
    border: "1px solid rgba(14, 116, 144, 0.25)",
    color: "#F8FAFC",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    width: "100%",
    padding: "0.625rem 0.875rem",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const focusStyle = {
    borderColor: "rgba(6, 182, 212, 0.6)",
    boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.08)",
  };

  return (
    <div className="p-6 lg:p-8 max-w-[640px] mx-auto space-y-6 page-enter">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2.5"
          style={
            toast.type === "success"
              ? {
                  background: "rgba(15, 32, 64, 0.95)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  backdropFilter: "blur(12px)",
                  color: "#F8FAFC",
                }
              : {
                  background: "rgba(15, 32, 64, 0.95)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  backdropFilter: "blur(12px)",
                  color: "#F8FAFC",
                }
          }
        >
          <CheckCircle
            className="w-4 h-4 shrink-0"
            style={{
              color: toast.type === "success" ? "#10B981" : "#EF4444",
            }}
          />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              background: "rgba(14, 116, 144, 0.15)",
              border: "1px solid rgba(14, 116, 144, 0.25)",
            }}
          >
            <SettingsIcon className="w-4 h-4 text-[#0E7490]" />
          </div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-sm text-[#94A3B8] ml-0.5 mt-1">
          Configure your Dockline instance
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#0E7490", borderTopColor: "transparent" }}
          />
        </div>
      ) : (
        <div
          className="rounded-xl p-6 space-y-6"
          style={{
            background: "rgba(15, 32, 64, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(14, 116, 144, 0.2)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Business Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 text-[#0E7490]" />
              Business Name
            </label>
            <input
              type="text"
              value={form.business_name}
              onChange={handleChange("business_name")}
              style={inputStyle}
              placeholder="e.g. San Pedro Sport Fishing"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(14, 116, 144, 0.25)";
                e.target.style.boxShadow = "none";
              }}
            />
            <p className="text-xs text-[#94A3B8]/60 mt-1.5 ml-0.5">
              Appears in review request messages and throughout the dashboard.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(14, 116, 144, 0.1)" }} />

          {/* Google Review Link */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              <LinkIcon className="w-3.5 h-3.5 text-[#0E7490]" />
              Google Review Link
            </label>
            <input
              type="url"
              value={form.google_review_link}
              onChange={handleChange("google_review_link")}
              style={inputStyle}
              placeholder="https://g.page/r/your-business/review"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(14, 116, 144, 0.25)";
                e.target.style.boxShadow = "none";
              }}
            />
            <p className="text-xs text-[#94A3B8]/60 mt-1.5 ml-0.5">
              Included in the review request SMS sent to satisfied customers.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(14, 116, 144, 0.1)" }} />

          {/* Text-back Message */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#0E7490]" />
              Missed Call Text-Back Message
            </label>
            <textarea
              value={form.textback_message}
              onChange={handleChange("textback_message")}
              rows={4}
              style={{
                ...inputStyle,
                resize: "none",
                fontFamily: "inherit",
                lineHeight: "1.6",
              }}
              placeholder="Hey, this is [Business]! Sorry we missed you…"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(14, 116, 144, 0.25)";
                e.target.style.boxShadow = "none";
              }}
            />
            <div className="flex items-center justify-between mt-1.5 px-0.5">
              <p className="text-xs text-[#94A3B8]/60">
                Sent automatically when a call goes unanswered.
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-mono tabular-nums"
                  style={{
                    color:
                      form.textback_message.length > 160
                        ? "#F59E0B"
                        : "#94A3B8",
                  }}
                >
                  {form.textback_message.length}
                </span>
                <span className="text-xs text-[#94A3B8]/40">chars</span>
                {form.textback_message.length > 160 && (
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#F59E0B",
                    }}
                  >
                    {Math.ceil(form.textback_message.length / 160)} segments
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(14, 116, 144, 0.1)" }} />

          {/* Save area */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {isDirty ? (
                <span
                  className="text-xs font-semibold flex items-center gap-1.5"
                  style={{ color: "#F59E0B" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#F59E0B" }}
                  />
                  Unsaved changes
                </span>
              ) : (
                <span className="text-xs text-[#94A3B8]/50">
                  All changes saved
                </span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving || (!isDirty && !saveSuccess)}
              className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-40"
              style={
                saveSuccess
                  ? {
                      background: "rgba(16, 185, 129, 0.2)",
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      color: "#10B981",
                    }
                  : {
                      background: "linear-gradient(135deg, #0E7490, #0891B2)",
                      border: "none",
                      color: "#F8FAFC",
                      boxShadow: "0 2px 10px rgba(6, 182, 212, 0.2)",
                    }
              }
              onMouseEnter={(e) => {
                if (!saveSuccess && !saving && isDirty) {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(6, 182, 212, 0.3)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 10px rgba(6, 182, 212, 0.2)";
                (e.currentTarget as HTMLElement).style.transform = "";
              }}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : saving ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "#F8FAFC",
                      borderTopColor: "transparent",
                    }}
                  />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Instance info */}
      {settings && (
        <div
          className="rounded-xl p-4 space-y-1.5"
          style={{
            background: "rgba(10, 22, 40, 0.5)",
            border: "1px solid rgba(14, 116, 144, 0.12)",
          }}
        >
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
            Instance Info
          </p>
          <div className="space-y-1">
            <p className="text-xs text-[#94A3B8]/70">
              <span className="text-[#94A3B8]/40">Settings ID</span>{" "}
              <span className="font-mono text-[#94A3B8]">#{settings.id}</span>
            </p>
            <p className="text-xs text-[#94A3B8]/70">
              <span className="text-[#94A3B8]/40">Created</span>{" "}
              {new Date(settings.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-[#94A3B8]/70">
              <span className="text-[#94A3B8]/40">Last updated</span>{" "}
              {new Date(settings.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
