import { getLeads, getStats, getLead, type LeadDetail } from "@/lib/api";
import StatsBar from "@/components/StatsBar";
import LeadsTable from "@/components/LeadsTable";
import { Anchor, User, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Static example conversation shown when no active lead is available
const STATIC_MESSAGES = [
  {
    direction: "inbound" as const,
    body: "Hey I'm interested in a fishing trip",
    label: "Customer",
  },
  {
    direction: "outbound" as const,
    body: "Hi there! That's awesome — we'd love to have you out on the water! We offer full day trips ($225/person, 5:30am) and half day trips ($125/person, 6am), plus private charters. What type sounds good and how many people are in your group?",
    label: "Dockline AI",
  },
];

const CHECKLIST_ITEMS = ["Full name", "Trip type", "Preferred date", "Group size"];

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

  // Try to find an active lead and fetch its detail for the conversation card
  const activeLead = leads.find((l) => l.status === "active") ?? null;
  let activeLeadDetail: LeadDetail | null = null;
  if (activeLead) {
    try {
      activeLeadDetail = await getLead(activeLead.id);
    } catch {
      // ignore — fall back to static example
    }
  }

  const capturedCount =
    activeLeadDetail?.name ? 1 : 0;
  const capturedPercent = Math.max(10, (capturedCount / 4) * 100);

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
            <span
              style={{
                backgroundColor: "#FEF9C3",
                color: "#854D0E",
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 20,
                padding: "3px 10px",
              }}
            >
              In progress
            </span>
            {(activeLeadDetail || activeLead) && (
              <span
                className="font-mono"
                style={{ fontSize: 13, color: "#4F46E5" }}
              >
                {activeLeadDetail?.phone_number ?? activeLead?.phone_number}
              </span>
            )}
          </div>

          {/* Right: qualification progress */}
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
        </div>

        {/* Body */}
        <div
          className="flex"
          style={{ padding: "16px 24px", gap: 24 }}
        >
          {/* Left: conversation thread */}
          <div className="flex flex-col" style={{ flex: 1, gap: 12 }}>
            {activeLeadDetail && activeLeadDetail.messages.length > 0 ? (
              // Show last 2 messages from real lead
              activeLeadDetail.messages.slice(-2).map((msg) => {
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
                        {isOutbound ? "Dockline AI" : "Customer"} · just now
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              // Static example
              STATIC_MESSAGES.map((msg, idx) => {
                const isOutbound = msg.direction === "outbound";
                return (
                  <div
                    key={idx}
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
                        {msg.label} · just now
                      </p>
                    </div>
                  </div>
                );
              })
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
              const captured =
                i === 0 && activeLeadDetail?.name ? true : false;
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
      </div>
    </div>
  );
}
