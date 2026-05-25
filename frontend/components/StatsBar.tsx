"use client";

import { Users, CheckCircle, Clock, MessageSquare } from "lucide-react";
import type { Stats } from "@/lib/api";

interface StatsBarProps {
  stats: Stats;
}

const statCards = [
  {
    key: "total_leads" as const,
    label: "Total Leads",
    icon: Users,
    color: "text-[#0E7490]",
    bg: "bg-teal-50",
  },
  {
    key: "qualified_leads" as const,
    label: "Qualified",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "new_today" as const,
    label: "New Today",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "messages_sent" as const,
    label: "Messages Sent",
    icon: MessageSquare,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map(({ key, label, icon: Icon, color, bg }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm"
        >
          <div className={`p-2.5 rounded-lg ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{stats[key]}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
