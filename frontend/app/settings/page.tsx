"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, type Settings } from "@/lib/api";
import { Settings as SettingsIcon, CheckCircle, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    business_name: "",
    google_review_link: "",
    textback_message: "",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
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
      showToast("Settings saved successfully! ✓");
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const isDirty = settings
    ? form.business_name !== settings.business_name ||
      form.google_review_link !== settings.google_review_link ||
      form.textback_message !== settings.textback_message
    : false;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all ${
            toast.type === "success"
              ? "bg-slate-800 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500">Configure your Dockline instance</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-6 h-6 border-2 border-[#0E7490] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              value={form.business_name}
              onChange={handleChange("business_name")}
              className="w-full border border-slate-200 rounded-lg text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent placeholder-slate-400"
              placeholder="e.g. San Pedro Sport Fishing"
            />
            <p className="text-xs text-slate-400 mt-1">
              Appears in review request messages and throughout the dashboard.
            </p>
          </div>

          {/* Google Review Link */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Google Review Link
            </label>
            <input
              type="url"
              value={form.google_review_link}
              onChange={handleChange("google_review_link")}
              className="w-full border border-slate-200 rounded-lg text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent placeholder-slate-400"
              placeholder="https://g.page/r/your-business/review"
            />
            <p className="text-xs text-slate-400 mt-1">
              Included in the review request SMS sent to satisfied customers.
            </p>
          </div>

          {/* Text-back Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Missed Call Text-Back Message
            </label>
            <textarea
              value={form.textback_message}
              onChange={handleChange("textback_message")}
              rows={4}
              className="w-full border border-slate-200 rounded-lg text-sm text-slate-800 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:border-transparent placeholder-slate-400 resize-none"
              placeholder="Hey, this is [Business]! Sorry we missed you…"
            />
            <p className="text-xs text-slate-400 mt-1">
              This message is automatically sent when a call comes in and isn&apos;t answered.
            </p>
          </div>

          {/* Character count */}
          <p className="text-xs text-slate-400 -mt-4">
            {form.textback_message.length} characters
            {form.textback_message.length > 160 && (
              <span className="text-amber-500 ml-1">
                · Will send as {Math.ceil(form.textback_message.length / 160)} SMS segments
              </span>
            )}
          </p>

          {/* Save button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isDirty ? (
              <p className="text-xs text-amber-600 font-medium">Unsaved changes</p>
            ) : (
              <p className="text-xs text-slate-400">All changes saved</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="flex items-center gap-2 bg-[#0A1628] hover:bg-[#0E1e38] disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Info box */}
      {settings && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600 mb-2">Instance Info</p>
          <p>Settings ID: #{settings.id}</p>
          <p>Created: {new Date(settings.created_at).toLocaleString()}</p>
          <p>Last updated: {new Date(settings.updated_at).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
