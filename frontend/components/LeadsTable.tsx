"use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { LeadSummary } from "@/lib/api";
import { MessageSquare, Phone } from "lucide-react";

interface LeadsTableProps {
  leads: LeadSummary[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter();

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Phone className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-700 mb-1">No leads yet</h3>
        <p className="text-sm text-slate-400">
          Leads will appear here when missed calls come in or customers text the business line.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
              Source
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
              Last Message
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Time
            </th>
            <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
              Msgs
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={lead.id}
              onClick={() => router.push(`/leads/${lead.id}`)}
              className={`cursor-pointer transition-colors hover:bg-slate-50 ${
                i !== leads.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              {/* Contact */}
              <td className="px-5 py-4">
                <div className="font-medium text-slate-800">
                  {lead.name || <span className="text-slate-400 italic">Unknown</span>}
                </div>
                <div className="text-slate-500 text-xs mt-0.5">{lead.phone_number}</div>
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <StatusBadge status={lead.status} />
              </td>

              {/* Source */}
              <td className="px-5 py-4 hidden md:table-cell">
                <span className="inline-flex items-center gap-1.5 text-slate-500 capitalize text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {lead.source.replace("-", " ")}
                </span>
              </td>

              {/* Last message */}
              <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
                {lead.last_message ? (
                  <p className="text-slate-500 truncate text-xs">{lead.last_message}</p>
                ) : (
                  <span className="text-slate-300 text-xs">—</span>
                )}
              </td>

              {/* Time */}
              <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                {formatDistanceToNow(lead.created_at)}
              </td>

              {/* Message count */}
              <td className="px-5 py-4 hidden sm:table-cell">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {lead.message_count}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
