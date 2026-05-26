import type { LeadStatus } from "@/lib/api";

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<
  LeadStatus,
  { label: string; bg: string; color: string }
> = {
  new: { label: "New", bg: "#F0EDE8", color: "#9B9589" },
  active: { label: "Active", bg: "#FEF9C3", color: "#854D0E" },
  qualified: { label: "Qualified", bg: "#DCFCE7", color: "#166534" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.new;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: config.bg,
        color: config.color,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 20,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
}
