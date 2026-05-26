"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { LeadSummary } from "@/lib/api";
import { PhoneMissed, MessageSquare, Phone, Anchor } from "lucide-react";

interface LeadsTableProps {
  leads: LeadSummary[];
  showFilters?: boolean;
}

const statusBorderColor: Record<string, string> = {
  new: "#DDD9D3",
  active: "#D97706",
  qualified: "#16A34A",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SourceCell({ source }: { source: string }) {
  if (source === "missed-call") {
    return (
      <div className="flex items-center" style={{ gap: 6 }}>
        <PhoneMissed style={{ width: 13, height: 13, color: "#9B9589" }} />
        <span style={{ fontSize: 12, color: "#6B6560" }}>Missed call</span>
      </div>
    );
  }
  return (
    <div className="flex items-center" style={{ gap: 6 }}>
      <MessageSquare style={{ width: 13, height: 13, color: "#9B9589" }} />
      <span style={{ fontSize: 12, color: "#6B6560" }}>Inbound SMS</span>
    </div>
  );
}

function ContactCell({ lead }: { lead: LeadSummary }) {
  const hasName = Boolean(lead.name);

  return (
    <div className="flex items-center" style={{ gap: 10 }}>
      {/* Avatar */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: hasName ? "#DCFCE7" : "#F0EDE8",
          color: hasName ? "#166534" : "#9B9589",
          fontSize: 11,
          fontWeight: 500,
        }}
      >
        {hasName ? (
          getInitials(lead.name!)
        ) : (
          <Phone style={{ width: 13, height: 13 }} />
        )}
      </div>

      {/* Name + phone */}
      <div>
        {hasName ? (
          <>
            <p
              style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A", lineHeight: 1.3 }}
            >
              {lead.name}
            </p>
            <p
              className="font-mono"
              style={{ fontSize: 11, color: "#9B9589" }}
            >
              {lead.phone_number}
            </p>
          </>
        ) : (
          <>
            <p
              className="font-mono"
              style={{ fontSize: 13, color: "#4F46E5", fontWeight: 500, lineHeight: 1.3 }}
            >
              {lead.phone_number}
            </p>
            <p style={{ fontSize: 11, color: "#9B9589", fontStyle: "italic" }}>
              Name unknown
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const GRID_COLUMNS = "2fr 1.2fr 1.5fr 2fr 120px";

export default function LeadsTable({ leads, showFilters }: LeadsTableProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredLeads =
    showFilters && activeFilter !== "all"
      ? leads.filter((l) => l.status === activeFilter)
      : leads;

  const totalCount = leads.length;
  const activeCount = leads.filter((l) => l.status === "active").length;
  const qualifiedCount = leads.filter((l) => l.status === "qualified").length;

  const filterPills = [
    { label: `All ${totalCount}`, value: "all", bg: "#F0EDE8", color: "#6B6560" },
    { label: `Active ${activeCount}`, value: "active", bg: "#FEF9C3", color: "#854D0E" },
    { label: `Qualified ${qualifiedCount}`, value: "qualified", bg: "#DCFCE7", color: "#166534" },
  ];

  const emptyState = (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        className="flex items-center justify-center mx-auto"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "#F0EDE8",
          marginBottom: 12,
        }}
      >
        <Anchor style={{ width: 20, height: 20, color: "#9B9589" }} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
        No leads yet
      </p>
      <p style={{ fontSize: 12, color: "#6B6560", marginTop: 4 }}>
        Leads will appear here when missed calls come in or customers text the
        business line.
      </p>
    </div>
  );

  if (leads.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #EEEBE6",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {emptyState}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #EEEBE6",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid #EEEBE6",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "#1A1A1A" }}>
          Lead pipeline
        </span>

        {/* Filter pills */}
        <div className="flex items-center" style={{ gap: 6 }}>
          {filterPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => showFilters && setActiveFilter(pill.value)}
              style={{
                backgroundColor:
                  showFilters && activeFilter === pill.value
                    ? pill.bg
                    : activeFilter === pill.value
                    ? pill.bg
                    : pill.bg,
                color: pill.color,
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 20,
                padding: "3px 12px",
                border: "none",
                cursor: showFilters ? "pointer" : "default",
                opacity:
                  showFilters && activeFilter !== "all" && activeFilter !== pill.value
                    ? 0.6
                    : 1,
              }}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: GRID_COLUMNS,
          padding: "10px 24px",
          borderBottom: "1px solid #F5F2EE",
        }}
      >
        {["CONTACT", "STATUS", "SOURCE", "DETAILS", "TIME"].map((col) => (
          <span
            key={col}
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9B9589",
              fontWeight: 500,
            }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      {filteredLeads.length === 0 ? (
        emptyState
      ) : (
        filteredLeads.map((lead, i) => (
          <LeadRow
            key={lead.id}
            lead={lead}
            isLast={i === filteredLeads.length - 1}
            onClick={() => router.push(`/leads/${lead.id}`)}
          />
        ))
      )}
    </div>
  );
}

function LeadRow({
  lead,
  isLast,
  onClick,
}: {
  lead: LeadSummary;
  isLast: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: GRID_COLUMNS,
        padding: "14px 0 14px 24px",
        borderBottom: isLast ? "none" : "1px solid #F5F2EE",
        borderLeft: `3px solid ${statusBorderColor[lead.status] ?? "#DDD9D3"}`,
        backgroundColor: hovered ? "#FAFAF9" : "transparent",
        cursor: "pointer",
        alignItems: "center",
        transition: "background-color 0.1s ease",
      }}
    >
      {/* CONTACT */}
      <div style={{ paddingRight: 16 }}>
        <ContactCell lead={lead} />
      </div>

      {/* STATUS */}
      <div>
        <StatusBadge status={lead.status} />
      </div>

      {/* SOURCE */}
      <div>
        <SourceCell source={lead.source} />
      </div>

      {/* DETAILS */}
      <div style={{ paddingRight: 16, overflow: "hidden" }}>
        {lead.last_message ? (
          <p
            style={{
              fontSize: 12,
              color: "#6B6560",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {lead.last_message}
          </p>
        ) : (
          <span style={{ fontSize: 12, color: "#C5C0BA" }}>—</span>
        )}
      </div>

      {/* TIME */}
      <div>
        <span style={{ fontSize: 12, color: "#9B9589" }}>
          {formatDistanceToNow(lead.updated_at)}
        </span>
      </div>
    </div>
  );
}
