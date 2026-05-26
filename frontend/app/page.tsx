import { getLeads, getStats, getLead, type LeadDetail, type LeadSummary } from "@/lib/api";
import StatsBar from "@/components/StatsBar";
import LeadsTable from "@/components/LeadsTable";
import { Anchor, User, CheckCircle, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CHECKLIST_ITEMS = ["Full name", "Trip type", "Preferred date", "Group size"];

/** How many checklist items are captured based on lead status */
function capturedFromStatus(status: LeadSummary["status"]): number {
  if (status === "qualified") return 4;
  if (status === "active") return 2;
  return 0;
}

export default async function DashboardPage() {
  let stats;
  let leads;

  try {
    [stats, leads] = await Promise.all([getStats(), getLeads()]);
  } catch {
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
            Unable to connect to the API
          </p>
          <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
            Make sure the backend is running at{" "}
            <code
              style={{
                backgroundColor: "#FEE2E2",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </code>
          </p>
        </div>
      </div>
    );
  }

  // Priority: Active leads first, then Qualified — only if they have at least one message
  const activeLead =
    leads.find((l) => l.status === "active" && l.message_count > 0) ??
    leads.find((l) => l.status === "qualified" && l.message_count > 0) ??
    null;

  let activeLeadDetail: LeadDetail | null = null;
  if (activeLead) {
    try {
      activeLeadDetail = await getLead(activeLead.id);
    } catch {
      // ignore — fall back to empty state
    }
  }

  // Use status-based progress: new=0, active=2, qualified=4
  const currentStatus = activeLead?.status ?? "new";
  const capturedCount = capturedFromStatus(currentStatus);
  const capturedPercent = capturedCount === 0 ? 0 : (capturedCount / 4) * 100;

  // Pick the most recent inbound and most recent outbound message (if available)
  const previewMessages: LeadDetail["messages"] = [];
  if (activeLeadDetail && activeLeadDetail.messages.length > 0) {
    const msgs = activeLeadDetail.messages;
    // Find last inbound and last outbound
    const lastInbound = [...msgs].reverse().find((m) => m.direction === "inbound");
    const lastOutbound = [...msgs].reverse().find((m) => m.direction === "outbound");
    // Add in chronological order (by id / array position)
    const candidates = [lastInbound, lastOutbound].filter(Boolean) as LeadDetail["messages"];
    candidates.sort((a, b) => a.id - b.id);
    previewMessages.push(...candidates);
  }

  const hasConversation = previewMessages.length > 0;

  // Badge appearance based on status
  const isQualified = currentStatus === "qualified";

  return (
    <div
      className="page-enter"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Stat Cards */}
      <StatsBar stats={stats} />

      {/* Lead Pipeline */}
      <LeadsTable leads={leads} showFilters={false} />

      {/* Active Conversation */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EEEBE6",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 24px",
            borderBottom: "1px solid #EEEBE6",
          }}
        >
          {/* Left */}
          <div className="flex items-center" style={{ gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
              Active conversation
            </span>
            {activeLead ? (
              <>
                <span
                  style={{
                    backgroundColor: isQualified ? "#DCFCE7" : "#FEF9C3",
                    color: isQualified ? "#15803D" : "#854D0E",
                    fontSize: 11,
                    fontWeight: 500,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  {isQualified ? "Qualified" : "In progress"}
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 13, color: "#4F46E5" }}
                >
                  {activeLead.phone_number}
                </span>
              </>
            ) : (
              <span
                style={{
                  backgroundColor: "#F5F2EE",
                  color: "#9B9589",
                  fontSize: 11,
                  fontWeight: 500,
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                No active lead
              </span>
            )}
          </div>

          {/* Right: qualification progress — only show when there is a lead */}
          {activeLead && (
            <div className="flex items-center" style={{ gap: 8 }}>
              <span style={{ fontSize: 11, color: "#9B9589" }}>
                Qualification
              </span>
              <div
                style={{
                  width: 100,
                  height: 6,
                  backgroundColor: "#F0EDE8",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${capturedPercent}%`,
                    height: "100%",
                    backgroundColor: "#4F46E5",
                    borderRadius: 20,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: "#9B9589" }}>
                {capturedCount} of 4 captured
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        {!activeLead ? (
          /* ── Empty state ── */
          <div
            className="flex flex-col items-center justify-center"
            style={{ padding: "40px 24px", gap: 8 }}
          >
            <MessageSquare
              style={{ width: 32, height: 32, color: "#DDD9D3", marginBottom: 4 }}
            />
            <p style={{ fontSize: 14, fontWeight: 500, color: "#9B9589", margin: 0 }}>
              No active conversations
            </p>
            <p style={{ fontSize: 12, color: "#B5B0AA", margin: 0, textAlign: "center" }}>
              Conversations will appear here when customers text the business line.
            </p>
          </div>
        ) : (
          <div
            className="flex"
            style={{ padding: "16px 24px", gap: 24 }}
          >
            {/* Left: conversation thread */}
            <div className="flex flex-col" style={{ flex: 1, gap: 12 }}>
              {hasConversation ? (
                previewMessages.map((msg) => {
                  const isOutbound = msg.direction === "outbound";
                  return (
                    <div
                      key={msg.id}
                      className="flex"
                      style={{
                        flexDirection: isOutbound ? "row-reverse" : "row",
                        alignItems: "flex-end",
                        gap: 10,
                      }}
                    >
                      <div
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: isOutbound ? "#4F46E5" : "#F0EDE8",
                        }}
                      >
                        {isOutbound ? (
                          <Anchor
                            style={{ width: 13, height: 13, color: "#FFFFFF" }}
                          />
                        ) : (
                          <User
                            style={{ width: 13, height: 13, color: "#6B6560" }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          backgroundColor: isOutbound ? "#4F46E5" : "#F5F2EE",
                          borderRadius: isOutbound
                            ? "10px 0 10px 10px"
                            : "0 10px 10px 10px",
                          padding: "10px 14px",
                          maxWidth: isOutbound ? "65%" : "60%",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            color: isOutbound ? "#FFFFFF" : "#1A1A1A",
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {msg.body}
                        </p>
                        <p
                          style={{
                            fontSize: 10,
                            color: isOutbound
                              ? "rgba(255,255,255,0.6)"
                              : "#9B9589",
                            marginTop: 4,
                            marginBottom: 0,
                          }}
                        >
                          {isOutbound ? "Dockline AI" : activeLead.name ?? "Customer"} · just now
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Lead exists but has no messages yet */
                <p style={{ fontSize: 13, color: "#9B9589", margin: 0 }}>
                  No messages yet.
                </p>
              )}
            </div>

            {/* Right: Capture checklist */}
            <div
              style={{
                width: 200,
                flexShrink: 0,
                backgroundColor: "#F5F2EE",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#6B6560",
                  fontWeight: 500,
                  marginBottom: 12,
                }}
              >
                Capture Checklist
              </p>

              {CHECKLIST_ITEMS.map((item, i) => {
                const captured = i < capturedCount;
                return (
                  <div
                    key={item}
                    className="flex items-center"
                    style={{ gap: 10, marginBottom: 10 }}
                  >
                    {captured ? (
                      <CheckCircle
                        style={{
                          width: 16,
                          height: 16,
                          color: "#16A34A",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: "1.5px solid #DDD9D3",
                          backgroundColor: "#FFFFFF",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span style={{ fontSize: 12, color: "#9B9589" }}>{item}</span>
                  </div>
                );
              })}

              {/* Progress at bottom */}
              <div style={{ borderTop: "1px solid #EEEBE6", paddingTop: 12 }}>
                <div
                  style={{
                    backgroundColor: "#EEEBE6",
                    height: 5,
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${capturedPercent}%`,
                      height: "100%",
                      backgroundColor: "#4F46E5",
                      borderRadius: 20,
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#9B9589",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {capturedCount} of 4 captured
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
