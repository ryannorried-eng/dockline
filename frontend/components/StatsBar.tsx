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
    iconBg: "bg-[#EFF6FF]",
    iconColor: "text-[#2563EB]",
  },
  {
    key: "qualified_leads" as const,
    label: "Qualified",
    icon: CheckCircle,
    iconBg: "bg-[#F0FDF4]",
    iconColor: "text-[#16A34A]",
  },
  {
    key: "new_today" as const,
    label: "New Today",
    icon: Clock,
    iconBg: "bg-[#FFFBEB]",
    iconColor: "text-[#D97706]",
  },
  {
    key: "messages_sent" as const,
    label: "Messages Sent",
    icon: MessageSquare,
    iconBg: "bg-[#F5F3FF]",
    iconColor: "text-[#7C3AED]",
  },
];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
        <div
          key={key}
          className="bg-white rounded-xl p-6"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${iconBg}`}
          >
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <p className="text-[32px] font-bold text-[#0F172A] leading-none tabular-nums">
            {stats[key]}
          </p>
          <p className="text-sm text-[#64748B] mt-2">{label}</p>
        </div>
      ))}
    </div>
  );
}
