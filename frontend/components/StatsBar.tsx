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
    iconColor: "text-[#06B6D4]",
    iconBg: "bg-[#06B6D4]/10",
    glowColor: "rgba(6, 182, 212, 0.06)",
  },
  {
    key: "qualified_leads" as const,
    label: "Qualified",
    icon: CheckCircle,
    iconColor: "text-[#10B981]",
    iconBg: "bg-[#10B981]/10",
    glowColor: "rgba(16, 185, 129, 0.06)",
  },
  {
    key: "new_today" as const,
    label: "New Today",
    icon: Clock,
    iconColor: "text-[#06B6D4]",
    iconBg: "bg-[#06B6D4]/10",
    glowColor: "rgba(6, 182, 212, 0.06)",
  },
  {
    key: "messages_sent" as const,
    label: "Messages Sent",
    icon: MessageSquare,
    iconColor: "text-[#0E7490]",
    iconBg: "bg-[#0E7490]/10",
    glowColor: "rgba(14, 116, 144, 0.06)",
  },
];

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map(({ key, label, icon: Icon, iconColor, iconBg, glowColor }) => (
        <div
          key={key}
          className="relative group rounded-xl p-5 overflow-hidden cursor-default transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: "rgba(15, 32, 64, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(14, 116, 144, 0.2)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 8px 28px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(14, 116, 144, 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 16px rgba(0, 0, 0, 0.2)";
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${glowColor}, transparent 70%)`,
            }}
          />

          <div className="relative flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${iconBg} shrink-0`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#06B6D4] tabular-nums leading-none tracking-tight">
                {stats[key]}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1 font-medium">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
