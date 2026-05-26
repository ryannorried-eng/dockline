"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { LeadSummary } from "@/lib/api";
import { MessageSquare, Anchor, ChevronRight } from "lucide-react";

interface LeadsTableProps {
  leads: LeadSummary[];
  showFilters?: boolean;
}

const statusBorderColor: Record<string, string> = {
  new: "#94A3B8",
  active: "#D97706",
  qualified: "#16A34A",
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
      className="bg-white rounded-xl p-12 text-center"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center">
          <Anchor className="w-6 h-6 text-[#94A3B8]" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-[#0F172A] mb-2">No leads yet</h3>
      <p className="text-sm text-[#64748B] max-w-xs mx-auto leading-relaxed">
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-[#2563EB] text-white border border-[#2563EB]"
                    : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"
                }`}
              >
                {opt.label}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
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
          className="bg-white rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden md:table-cell">
                  Source
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden lg:table-cell">
                  Last Message
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
                  Time
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest hidden sm:table-cell">
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
      className="cursor-pointer transition-colors duration-150 group"
      style={{
        borderBottom: isLast ? "none" : "1px solid #F1F5F9",
        background: hovered ? "#F8F9FA" : "transparent",
      }}
    >
      {/* Contact — with left status accent bar */}
      <td className="px-5 py-4 relative" style={{ minHeight: "52px" }}>
        <div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
          style={{
            background: statusBorderColor[lead.status] || "transparent",
          }}
        />
        <div className="font-mono text-sm font-medium text-[#2563EB]">
          {lead.phone_number}
        </div>
        <div className="text-xs text-[#64748B] mt-0.5">
          {lead.name || (
            <span className="italic text-[#94A3B8]">Unknown</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <StatusBadge status={lead.status} />
      </td>

      {/* Source */}
      <td className="px-5 py-4 hidden md:table-cell">
        <span className="text-[#64748B] capitalize text-xs">
          {lead.source.replace("-", " ")}
        </span>
      </td>

      {/* Last message */}
      <td className="px-5 py-4 hidden lg:table-cell max-w-[220px]">
        {lead.last_message ? (
          <p className="text-[#94A3B8] truncate text-xs italic max-w-xs">
            {lead.last_message}
          </p>
        ) : (
          <span className="text-[#CBD5E1] text-xs">—</span>
        )}
      </td>

      {/* Time */}
      <td className="px-5 py-4 text-[#94A3B8] text-xs whitespace-nowrap">
        {formatDistanceToNow(lead.created_at)}
      </td>

      {/* Message count */}
      <td className="px-5 py-4 hidden sm:table-cell">
        <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{lead.message_count}</span>
        </div>
      </td>

      {/* Arrow */}
      <td className="pr-4 hidden sm:table-cell">
        <ChevronRight
          className="w-4 h-4 transition-colors duration-150"
          style={{ color: hovered ? "#94A3B8" : "#CBD5E1" }}
        />
      </td>
    </tr>
  );
}
