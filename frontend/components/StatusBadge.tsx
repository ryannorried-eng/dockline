import clsx from "clsx";
import type { LeadStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<
  LeadStatus,
  { label: string; className: string; dotClass: string; pulse: boolean }
> = {
  new: {
    label: "New",
    className: "bg-[#94A3B8]/10 text-[#94A3B8] border border-[#94A3B8]/20",
    dotClass: "bg-[#94A3B8]",
    pulse: false,
  },
  active: {
    label: "Active",
    className: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20",
    dotClass: "bg-[#F59E0B]",
    pulse: true,
  },
  qualified: {
    label: "Qualified",
    className: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20",
    dotClass: "bg-[#10B981]",
    pulse: false,
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide",
        config.className
      )}
    >
      <span
        className={clsx(
          "w-1.5 h-1.5 rounded-full mr-1.5 shrink-0",
          config.dotClass,
          config.pulse && "dot-pulse"
        )}
      />
      {config.label}
    </span>
  );
}
