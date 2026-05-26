"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Play } from "lucide-react";

const pageConfig: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  "/": { label: "Dashboard", icon: LayoutDashboard },
  "/leads": { label: "Leads", icon: Users },
  "/settings": { label: "Settings", icon: Settings },
};

export default function TopBar() {
  const pathname = usePathname();

  let config = pageConfig[pathname];
  if (!config) {
    if (pathname.startsWith("/leads")) config = pageConfig["/leads"];
    else config = pageConfig["/"];
  }

  const Icon = config.icon;
  const now = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="flex items-center justify-between shrink-0"
      style={{
        height: 52,
        backgroundColor: "#F0EDE8",
        borderBottom: "1px solid #DDD9D3",
        padding: "0 24px",
      }}
    >
      {/* Left */}
      <div className="flex items-center" style={{ gap: 8 }}>
        <Icon style={{ width: 16, height: 16, color: "#6B6560" }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A" }}>
          {config.label}
        </span>
        <span style={{ fontSize: 11, color: "#9B9589", marginLeft: 4 }}>
          Last update: {now}
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center" style={{ gap: 12 }}>
        {/* System live pill */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: "#DCFCE7",
            color: "#166534",
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 20,
            padding: "3px 10px",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "#16A34A",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          System live
        </div>

        {/* Test conversation button */}
        <button
          className="flex items-center"
          style={{
            backgroundColor: "#4F46E5",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 500,
            borderRadius: 6,
            padding: "6px 14px",
            border: "none",
            cursor: "pointer",
            gap: 6,
          }}
        >
          <Play style={{ width: 12, height: 12 }} />
          Test conversation
        </button>
      </div>
    </div>
  );
}
