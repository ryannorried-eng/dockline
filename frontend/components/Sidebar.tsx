"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, Anchor } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex flex-col w-60 min-h-screen shrink-0 relative"
      style={{
        background: "linear-gradient(180deg, #0A1628 0%, #060e1c 100%)",
        borderRight: "1px solid rgba(14, 116, 144, 0.25)",
      }}
    >
      {/* Logo */}
      <div
        className="px-5 pt-7 pb-5"
        style={{ borderBottom: "1px solid rgba(14, 116, 144, 0.15)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: "rgba(6, 182, 212, 0.12)",
              border: "1px solid rgba(6, 182, 212, 0.25)",
            }}
          >
            <Anchor className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#06B6D4]">
            Dockline
          </span>
        </div>
        <p className="text-xs text-[#94A3B8] mt-2.5 ml-0.5 font-medium">
          San Pedro Sport Fishing
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                active
                  ? "text-[#06B6D4]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              )}
              style={
                active
                  ? {
                      background: "rgba(14, 116, 144, 0.2)",
                      border: "1px solid rgba(14, 116, 144, 0.35)",
                      boxShadow: "0 0 12px rgba(6, 182, 212, 0.05)",
                    }
                  : {}
              }
            >
              <Icon
                className={clsx(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#06B6D4]" : "text-[#94A3B8]"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(14, 116, 144, 0.15)" }}
      >
        <div className="flex items-center gap-2">
          <Anchor className="w-3 h-3 text-[#94A3B8]/60" />
          <p className="text-xs text-[#94A3B8]/60 font-medium">
            Powered by Dockline
          </p>
        </div>
      </div>
    </aside>
  );
}
