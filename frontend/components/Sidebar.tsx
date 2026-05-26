"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Star,
  Settings,
  Anchor,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: 220,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #EEEBE6",
        height: "100vh",
      }}
    >
      {/* Logo / Brand */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid #EEEBE6",
        }}
      >
        <div className="flex items-center" style={{ gap: 8 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 28,
              height: 28,
              backgroundColor: "#4F46E5",
              borderRadius: 6,
            }}
          >
            <Anchor style={{ width: 14, height: 14, color: "#FFFFFF" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, color: "#1A1A1A" }}>
            Dockline
          </span>
        </div>
        <p style={{ fontSize: 11, color: "#9B9589", marginTop: 8 }}>
          San Pedro Sport Fishing
        </p>
      </div>

      {/* Nav */}
      <nav
        className="flex flex-col"
        style={{ padding: "16px 12px 8px", flex: 1 }}
      >
        <p
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9B9589",
            fontWeight: 500,
            padding: "0 6px",
            marginBottom: 6,
          }}
        >
          Platform
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className="flex items-center"
              style={{
                gap: 8,
                padding: "9px 12px",
                borderRadius: 8,
                textDecoration: "none",
                marginBottom: 2,
                backgroundColor: active ? "#4F46E5" : "transparent",
                color: active ? "#FFFFFF" : "#6B6560",
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                transition: "background-color 0.15s ease",
              }}
            >
              <Icon
                style={{
                  width: 15,
                  height: 15,
                  flexShrink: 0,
                  color: active ? "#FFFFFF" : "#6B6560",
                }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        className="flex items-center"
        style={{
          padding: 16,
          borderTop: "1px solid #EEEBE6",
          gap: 10,
        }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#EEF2FF",
            color: "#4F46E5",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          RN
        </div>
        <div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#1A1A1A",
              lineHeight: 1.3,
            }}
          >
            Ryan Norried
          </p>
          <p style={{ fontSize: 10, color: "#9B9589" }}>Owner</p>
        </div>
      </div>
    </aside>
  );
}
