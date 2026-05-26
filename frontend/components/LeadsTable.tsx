"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { LeadSummary, LeadStatus } from "@/lib/api";
import { MessageSquare, Anchor, ChevronRight } from "lucide-react";

interface LeadsTableProps {
  leads: LeadSummary[];
  showFilters?: boolean;
}

const statusBorderColor: Record<string, string> = {
  new: "rgba(148, 163, 184, 0.5)",
  active: "rgba(245, 158, 11, 0.8)",
  qualified: "rgba(16, 185, 129, 0.8)",
};

const filterOptions: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Active", value: "active" },
  { label: "Qualified", value: "qualified" },
];

export default function LeadsTable({ leads, showFilters }: LeadsTableProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredLeads =
    showFilters && activeFilter !== "all"
      ? leads.filter((l) => l.status === activeFilter)
      : leads;

  const emptyState = (
    <div
      className="rounded-xl p-12 text-center"
      style={{
        background: "rgba(15, 32, 64, 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(14, 116, 144, 0.2)",
      }}
    >
      <div className="flex justify-center mb-5">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(14, 116, 144, 0.1)",
            border: "1px solid rgba(14, 116, 144, 0.2)",
          }}
        >
          <Anchor className="w-6 h-6 text-[#0E7490]" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-2">No leads yet</h3>
      <p className="text-sm text-[#94A3B8] max-w-xs mx-auto leading-relaxed">
        Leads will appear here when missed calls come in or customers text the
        business line.
      </p>
    </div>
  );

  if (leads.length === 0) return emptyState;

  return (
    <div className="space-y-3">
      {/* Filter bar */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {filterOptions.map((opt) => {
            const isActive = activeFilter === opt.value;
            const count =
              opt.value === "all"
                ? leads.length
                : leads.filter((l) => l.status === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: "rgba(14, 116, 144, 0.25)",
                        border: "1px solid rgba(6, 182, 212, 0.5)",
                        color: "#06B6D4",
                        boxShadow: "0 0 10px rgba(6, 182, 212, 0.1)",
                      }
                    : {
                        background: "rgba(15, 32, 64, 0.6)",
                        border: "1px solid rgba(14, 116, 144, 0.15)",
                        color: "#94A3B8",
                      }
                }
              >
                {opt.label}
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={
                    isActive
                      ? { background: "rgba(6, 182, 212, 0.2)", color: "#06B6D4" }
                      : { background: "rgba(148, 163, 184, 0.1)", color: "#94A3B8" }
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Table */}
      {filteredLeads.length === 0 ? (
        emptyState
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(15, 32, 64, 0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(14, 116, 144, 0.2)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(10, 22, 40, 0.6)",
                  borderBottom: "1px solid rgba(14, 116, 144, 0.15)",
                }}
              >
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Contact
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden md:table-cell">
                  Source
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden lg:table-cell">
                  Last Message
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Time
                </th>
                <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden sm:table-cell">
                  Msgs
                </th>
                <th className="w-8 hidden sm:table-cell" />
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, i) => (
                <LeadRow
                  key={lead.id}
                  lead={lead}
                  isLast={i === filteredLeads.length - 1}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                />
              ))}
            </tbody>
          </table>
        </div>
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
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer transition-all duration-150"
      style={{
        borderBottom: isLast ? "none" : "1px solid rgba(14, 116, 144, 0.1)",
        background: hovered ? "rgba(14, 116, 144, 0.07)" : "transparent",
      }}
    >
      {/* Contact — with left status accent bar */}
      <td className="px-5 py-4 relative">
        <div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-opacity duration-150"
          style={{
            background: statusBorderColor[lead.status] || "transparent",
            opacity: hovered ? 1 : 0.6,
          }}
        />
        <div className="font-semibold text-[#F8FAFC] text-sm">
          {lead.name || (
            <span className="text-[#94A3B8] italic font-normal">Unknown</span>
          )}
        </div>
        <div className="font-mono text-xs mt-0.5 text-[#06B6D4]">
          {lead.phone_number}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="px-5 py-4 hidden md:table-cell">
        <span className="inline-flex items-center gap-1.5 text-[#94A3B8] capitalize text-xs">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(14, 116, 144, 0.5)" }}
          />
          {lead.source.replace("-", " ")}
        </span>
      </td>

      {/* Last message */}
      <td className="px-5 py-4 hidden lg:table-cell max-w-[220px]">
        {lead.last_message ? (
          <p className="text-[#94A3B8] truncate text-xs italic">
            {lead.last_message}
          </p>
        ) : (
          <span className="text-[#94A3B8]/30 text-xs">—</span>
        )}
      </td>

      {/* Time */}
      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
        {formatDistanceToNow(lead.created_at)}
      </td>

      {/* Message count */}
      <td className="px-5 py-4 hidden sm:table-cell">
        <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
          <MessageSquare className="w-3.5 h-3.5 text-[#0E7490]" />
          <span>{lead.message_count}</span>
        </div>
      </td>

      {/* Arrow */}
      <td className="pr-4 hidden sm:table-cell">
        <ChevronRight
          className="w-4 h-4 transition-colors duration-150"
          style={{ color: hovered ? "#06B6D4" : "rgba(148, 163, 184, 0.3)" }}
        />
      </td>
    </tr>
  );
}
