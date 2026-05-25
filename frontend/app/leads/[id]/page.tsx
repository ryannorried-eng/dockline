"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getLead,
  updateLead,
  sendReviewRequest,
  type LeadDetail,
  type LeadStatus,
} from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import ConversationThread from "@/components/ConversationThread";
import { formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  User,
  Calendar,
  Tag,
  Star,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

const STATUS_OPTIONS: LeadStatus[] = ["new", "active", "qualified"];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = Number(params.id);

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchLead = useCallback(async () => {
    try {
      const data = await getLead(leadId);
      setLead(data);
    } catch (e) {
      setError("Failed to load lead.");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (status: LeadStatus) => {
    if (!lead) return;
    setSaving(true);
    try {
      const updated = await updateLead(leadId, { status });
      setLead(updated);
      showToast("Status updated");
    } catch {
      showToast("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleReviewRequest = async () => {
    if (!lead) return;
    setReviewLoading(true);
    try {
      await sendReviewRequest(
        lead.phone_number,
        lead.name || "there"
      );
      setReviewSent(true);
      showToast("Review request sent! 🎣");
    } catch {
      showToast("Failed to send review request");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin w-6 h-6 border-2 border-[#0E7490] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error || "Lead not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-3 text-sm text-slate-500 hover:underline"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to leads
      </button>

      {/* Lead info card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left: Lead details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={lead.status} />
              <span className="text-xs text-slate-400 capitalize">
                via {lead.source.replace("-", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">{lead.phone_number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{lead.name || <span className="text-slate-400 italic">Name unknown</span>}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Created {formatDateTime(lead.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Updated {formatDateTime(lead.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col gap-2 sm:items-end">
            {/* Status dropdown */}
            <div className="relative">
              <label className="text-xs text-slate-500 block mb-1">Update Status</label>
              <div className="relative">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                  disabled={saving}
                  className="appearance-none bg-white border border-slate-200 rounded-lg text-sm text-slate-700 pl-3 pr-8 py-2 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0E7490] disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Review request button */}
            {lead.status === "qualified" && (
              <button
                onClick={handleReviewRequest}
                disabled={reviewLoading || reviewSent}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Star className="w-4 h-4" />
                {reviewSent
                  ? "Review Sent ✓"
                  : reviewLoading
                  ? "Sending..."
                  : "Send Review Request"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700 text-sm">
            Conversation
          </h2>
          <span className="text-xs text-slate-400">
            {lead.messages.length} message{lead.messages.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
          <ConversationThread messages={lead.messages} />
        </div>
      </div>
    </div>
  );
}
