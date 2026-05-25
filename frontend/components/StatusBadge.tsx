import clsx from "clsx";
import type { LeadStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: {
    label: "New",
    className: "bg-slate-100 text-slate-600 border border-slate-200",
  },
  active: {
    label: "Active",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  qualified: {
    label: "Qualified",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full mr-1.5",
          status === "new" && "bg-slate-400",
          status === "active" && "bg-blue-500",
          status === "qualified" && "bg-emerald-500"
        )}
      />
      {config.label}
    </span>
  );
}
