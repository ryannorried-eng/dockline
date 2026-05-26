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
    <aside className="flex flex-col w-60 min-h-screen shrink-0 bg-white border-r border-[#E2E8F0]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <Anchor className="w-5 h-5 text-[#2563EB] shrink-0" />
          <span className="text-[18px] font-bold text-[#0F172A] tracking-tight">
            Dockline
          </span>
        </div>
        <p className="text-[12px] text-[#94A3B8] mt-2 font-medium">
          San Pedro Sport Fishing
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.08em] px-3 mb-2 mt-1">
          Navigation
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
              className={clsx(
                "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#2563EB] rounded-r-full" />
              )}
              <Icon
                className={clsx(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#2563EB]" : "text-[#64748B]"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-1.5">
          <Anchor className="w-3 h-3 text-[#94A3B8]" />
          <p className="text-[11px] text-[#94A3B8]">
            Powered by Dockline
          </p>
        </div>
      </div>
    </aside>
  );
}
