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
  CheckCircle,
  MessageSquare,
  PhoneMissed,
  ChevronDown,
} from "lucide-react";

const STATUS_OPTIONS: LeadStatus[] = ["new", "active", "qualified"];

const sourceLabel: Record<string, { label: string; icon: React.ElementType }> =
  {
    "inbound-sms": { label: "Inbound SMS", icon: MessageSquare },
    "missed-call": { label: "Missed Call", icon: PhoneMissed },
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
      <div
        className="flex items-center justify-center"
        style={{ padding: 24, height: "100%" }}
      >
        <div className="flex flex-col items-center" style={{ gap: 12 }}>
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
          <p style={{ fontSize: 12, color: "#9B9589" }}>Loading lead…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !lead) {
    return (
      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ color: "#DC2626", fontWeight: 500, fontSize: 13 }}>
            {error || "Lead not found"}
          </p>
          <button
            onClick={() => router.back()}
            style={{
              marginTop: 12,
              fontSize: 13,
              color: "#4F46E5",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const sourceConfig =
    sourceLabel[lead.source] ?? {
      label: lead.source.replace("-", " "),
      icon: MessageSquare,
    };
  const SourceIcon = sourceConfig.icon;

  return (
    <div
      className="page-enter"
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
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
            border: `1px solid ${toast.type === "success" ? "#BBF7D0" : "#FECACA"}`,
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
          <span style={{ fontSize: 13, color: "#1A1A1A" }}>{toast.msg}</span>
        </div>
      )}

      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center"
        style={{
          gap: 6,
          fontSize: 13,
          color: "#4F46E5",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          alignSelf: "flex-start",
        }}
      >
        <ArrowLeft style={{ width: 14, height: 14 }} />
        Back to leads
      </button>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* LEFT: Conversation thread */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EEEBE6",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* Conversation header */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: "14px 24px",
              borderBottom: "1px solid #EEEBE6",
            }}
          >
            <div className="flex items-center" style={{ gap: 8 }}>
              <MessageSquare
                style={{ width: 15, height: 15, color: "#6B6560" }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
                Conversation
              </span>
            </div>
            <span
              style={{
                backgroundColor: "#F0EDE8",
                color: "#6B6560",
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              {lead.messages.length} msg{lead.messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            style={{
              padding: "0 16px 16px",
              maxHeight: "65vh",
              overflowY: "auto",
            }}
          >
            <ConversationThread messages={lead.messages} />
          </div>
        </div>

        {/* RIGHT: Lead info card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #EEEBE6",
            borderRadius: 10,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Status badge */}
          <StatusBadge status={lead.status} />

          {/* Phone */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <Phone style={{ width: 14, height: 14, color: "#9B9589", flexShrink: 0 }} />
            <span
              className="font-mono"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#4F46E5",
              }}
            >
              {lead.phone_number}
            </span>
          </div>

          {/* Name */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <User style={{ width: 14, height: 14, color: "#9B9589", flexShrink: 0 }} />
            {lead.name ? (
              <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
                {lead.name}
              </span>
            ) : (
              <span
                style={{
                  fontSize: 13,
                  color: "#9B9589",
                  fontStyle: "italic",
                }}
              >
                Name unknown
              </span>
            )}
          </div>

          {/* Source */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <SourceIcon
              style={{ width: 13, height: 13, color: "#9B9589", flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: "#6B6560" }}>
              {sourceConfig.label}
            </span>
          </div>

          {/* Timestamps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <Calendar
                style={{ width: 13, height: 13, color: "#9B9589", flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "#6B6560" }}>
                Created {formatDateTime(lead.created_at)}
              </span>
            </div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <Tag
                style={{ width: 13, height: 13, color: "#9B9589", flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: "#6B6560" }}>
                Updated {formatDateTime(lead.updated_at)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #EEEBE6" }} />

          {/* Status dropdown */}
          <div>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 6,
              }}
            >
              Update Status
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={lead.status}
                onChange={(e) =>
                  handleStatusChange(e.target.value as LeadStatus)
                }
                disabled={saving}
                style={{
                  width: "100%",
                  appearance: "none",
                  WebkitAppearance: "none",
                  fontSize: 13,
                  padding: "10px 32px 10px 12px",
                  borderRadius: 8,
                  border: "1px solid #EEEBE6",
                  backgroundColor: "#FFFFFF",
                  color: "#1A1A1A",
                  cursor: "pointer",
                  outline: "none",
                  opacity: saving ? 0.5 : 1,
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 14,
                  height: 14,
                  color: "#9B9589",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Send Review Request button (qualified only) */}
          {lead.status === "qualified" && (
            <button
              onClick={handleReviewRequest}
              disabled={reviewLoading || reviewSent}
              className="flex items-center justify-center"
              style={{
                width: "100%",
                gap: 8,
                fontSize: 12,
                fontWeight: 500,
                padding: "10px",
                borderRadius: 8,
                border: "none",
                cursor: reviewLoading || reviewSent ? "not-allowed" : "pointer",
                backgroundColor: reviewSent ? "#DCFCE7" : "#4F46E5",
                color: reviewSent ? "#166534" : "#FFFFFF",
                opacity: reviewLoading ? 0.7 : 1,
                transition: "background-color 0.2s ease",
              }}
            >
              <Star style={{ width: 14, height: 14 }} />
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
  );
}
