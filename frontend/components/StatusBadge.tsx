import clsx from "clsx";
import type { LeadStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<
  LeadStatus,
  { label: string; bg: string; text: string; dot: string; pulse: boolean }
> = {
  new: {
    label: "New",
    bg: "bg-[#F1F5F9]",
    text: "text-[#475569]",
    dot: "bg-[#94A3B8]",
    pulse: false,
  },
  active: {
    label: "Active",
    bg: "bg-[#FFFBEB]",
    text: "text-[#92400E]",
    dot: "bg-[#D97706]",
    pulse: true,
  },
  qualified: {
    label: "Qualified",
    bg: "bg-[#F0FDF4]",
    text: "text-[#166534]",
    dot: "bg-[#16A34A]",
    pulse: false,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium",
        config.bg,
        config.text
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full mr-1.5 shrink-0",
          config.dot,
          config.pulse && "dot-pulse"
        )}
      />
      {config.label}
    </span>
  );
}
