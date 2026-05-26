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
  MessageSquare,
  Radio,
} from "lucide-react";

const STATUS_OPTIONS: LeadStatus[] = ["new", "active", "qualified"];

const sourceLabel: Record<string, string> = {
  "inbound-sms": "Inbound SMS",
  "missed-call": "Missed Call",
};

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
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const fetchLead = useCallback(async () => {
    try {
      const data = await getLead(leadId);
      setLead(data);
    } catch {
      setError("Failed to load lead.");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
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
      showToast("Failed to update status", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReviewRequest = async () => {
    if (!lead) return;
    setReviewLoading(true);
    try {
      await sendReviewRequest(lead.phone_number, lead.name || "there");
      setReviewSent(true);
      showToast("Review request sent!");
    } catch {
      showToast("Failed to send review request", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
          <p className="text-xs text-[#94A3B8]">Loading lead…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !lead) {
    return (
      <div className="p-8">
        <div className="rounded-xl p-6 text-center bg-red-50 border border-red-200">
          <p className="text-red-600 font-semibold">{error || "Lead not found"}</p>
          <button
            onClick={() => router.back()}
            className="mt-3 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 page-enter">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2.5 border ${
            toast.type === "success"
              ? "bg-white border-[#16A34A]/30 text-[#0F172A]"
              : "bg-white border-red-200 text-[#0F172A]"
          }`}
        >
          <CheckCircle
            className="w-4 h-4 shrink-0"
            style={{ color: toast.type === "success" ? "#16A34A" : "#DC2626" }}
          />
          {toast.msg}
        </div>
      )}

      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-[#2563EB] hover:text-blue-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to leads
      </button>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

        {/* LEFT: Conversation thread */}
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Conversation header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#64748B]" />
              <h2 className="font-bold text-[#0F172A] text-sm">Conversation</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B]">
              {lead.messages.length} msg{lead.messages.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="px-4 pb-4 max-h-[65vh] overflow-y-auto">
            <ConversationThread messages={lead.messages} />
          </div>
        </div>

        {/* RIGHT: Lead info + actions */}
        <div
          className="bg-white rounded-xl p-5 space-y-4"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {/* Status badge */}
          <StatusBadge status={lead.status} />

          {/* Phone number */}
          <div className="flex items-center gap-2 pt-1">
            <Phone className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="font-mono text-lg font-bold text-[#2563EB] tracking-wide">
              {lead.phone_number}
            </span>
          </div>

          {/* Name */}
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[#94A3B8] shrink-0" />
            {lead.name ? (
              <span className="text-[#0F172A] font-semibold">{lead.name}</span>
            ) : (
              <span className="text-[#94A3B8] italic">Name unknown</span>
            )}
          </div>

          {/* Source */}
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            {lead.source === "missed-call" ? (
              <Radio className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            )}
            <span>{sourceLabel[lead.source] ?? lead.source.replace("-", " ")}</span>
          </div>

          {/* Timestamps */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Created {formatDateTime(lead.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Tag className="w-3.5 h-3.5 shrink-0" />
              <span>Updated {formatDateTime(lead.updated_at)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E2E8F0]" />

          {/* Actions */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em]">
              Actions
            </p>

            {/* Status dropdown */}
            <div>
              <label className="text-xs font-medium text-[#0F172A] block mb-1.5">
                Update Status
              </label>
              <div className="relative">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as LeadStatus)
                  }
                  disabled={saving}
                  className="w-full appearance-none text-sm font-medium pl-3 pr-8 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] disabled:opacity-50 transition-all"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>

            {/* Mark as Qualified quick action */}
            {lead.status !== "qualified" && (
              <button
                onClick={() => handleStatusChange("qualified")}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all bg-[#F0FDF4] text-[#166534] border border-[#16A34A]/20 hover:bg-[#dcfce7] disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Qualified
              </button>
            )}

            {/* Review request button — only for qualified */}
            {lead.status === "qualified" && (
              <button
                onClick={handleReviewRequest}
                disabled={reviewLoading || reviewSent}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-all disabled:opacity-60"
                style={
                  reviewSent
                    ? {
                        background: "#F0FDF4",
                        border: "1px solid rgba(22,163,74,0.2)",
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
                <Star className="w-4 h-4" />
                {reviewSent
                  ? "Review Sent ✓"
                  : reviewLoading
                  ? "Sending…"
                  : "Send Review Request"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
