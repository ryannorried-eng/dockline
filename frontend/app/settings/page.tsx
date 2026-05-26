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

  return (
    <div className="p-8 max-w-[640px] mx-auto space-y-6 page-enter">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2.5 border bg-white ${
            toast.type === "success" ? "border-[#16A34A]/30" : "border-red-200"
          }`}
        >
          <CheckCircle
            className="w-4 h-4 shrink-0"
            style={{
              color: toast.type === "success" ? "#16A34A" : "#DC2626",
            }}
          />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#EFF6FF]">
            <SettingsIcon className="w-4 h-4 text-[#2563EB]" />
          </div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-sm text-[#64748B] mt-1">
          Configure your Dockline instance
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div
          className="bg-white rounded-xl p-6 space-y-6"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Business Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#0F172A] mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
              Business Name
            </label>
            <input
              type="text"
              value={form.business_name}
              onChange={handleChange("business_name")}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
              placeholder="e.g. San Pedro Sport Fishing"
            />
            <p className="text-xs text-[#94A3B8] mt-1.5">
              Appears in review request messages and throughout the dashboard.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E2E8F0]" />

          {/* Google Review Link */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#0F172A] mb-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#64748B]" />
              Google Review Link
            </label>
            <input
              type="url"
              value={form.google_review_link}
              onChange={handleChange("google_review_link")}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
              placeholder="https://g.page/r/your-business/review"
            />
            <p className="text-xs text-[#94A3B8] mt-1.5">
              Included in the review request SMS sent to satisfied customers.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E2E8F0]" />

          {/* Text-back Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#0F172A] mb-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#64748B]" />
              Missed Call Text-Back Message
            </label>
            <textarea
              value={form.textback_message}
              onChange={handleChange("textback_message")}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all resize-none leading-relaxed"
              placeholder="Hey, this is [Business]! Sorry we missed you…"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-[#94A3B8]">
                Sent automatically when a call goes unanswered.
              </p>
              <div className="flex items-center gap-1.5">
                <span
                  className="text-xs font-mono tabular-nums"
                  style={{
                    color:
                      form.textback_message.length > 120
                        ? "#D97706"
                        : "#94A3B8",
                  }}
                >
                  {form.textback_message.length}
                </span>
                <span className="text-xs text-[#CBD5E1]">chars</span>
                {form.textback_message.length > 120 && (
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-[#FFFBEB] text-[#92400E]">
                    {Math.ceil(form.textback_message.length / 160)} segments
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E2E8F0]" />

          {/* Save area */}
          <div className="space-y-3">
            {isDirty && (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                <span className="text-xs font-semibold text-[#92400E]">
                  Unsaved changes
                </span>
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving || (!isDirty && !saveSuccess)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-40"
              style={
                saveSuccess
                  ? {
                      background: "#F0FDF4",
                      border: "1px solid rgba(22,163,74,0.25)",
                      color: "#166534",
                    }
                  : {
                      background: "#2563EB",
                      border: "none",
                      color: "#FFFFFF",
                      boxShadow: "0 1px 2px rgba(37,99,235,0.2)",
                    }
              }
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
        <div className="rounded-xl p-4 space-y-1.5 bg-[#F8F9FA] border border-[#E2E8F0]">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] mb-2">
            Instance Info
          </p>
          <div className="space-y-1">
            <p className="text-xs text-[#64748B]">
              <span className="text-[#94A3B8]">Settings ID </span>
              <span className="font-mono text-[#0F172A]">#{settings.id}</span>
            </p>
            <p className="text-xs text-[#64748B]">
              <span className="text-[#94A3B8]">Created </span>
              {new Date(settings.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-[#64748B]">
              <span className="text-[#94A3B8]">Last updated </span>
              {new Date(settings.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
