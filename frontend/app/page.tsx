import { getLeads, getStats } from "@/lib/api";
import StatsBar from "@/components/StatsBar";
import LeadsTable from "@/components/LeadsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  let stats;
  let leads;

  try {
    [stats, leads] = await Promise.all([getStats(), getLeads()]);
  } catch {
    return (
      <div className="p-8">
        <div className="rounded-xl p-6 text-center bg-red-50 border border-red-200">
          <p className="text-red-600 font-semibold">Unable to connect to the API</p>
          <p className="text-red-500 text-sm mt-1">
            Make sure the backend is running at{" "}
            <code className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-600">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-[#64748B]">
              San Pedro Sport Fishing — Lead Overview
            </p>
            <div className="flex items-center gap-1.5">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-[#16A34A] animate-ping opacity-60" />
                <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A] uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#94A3B8] mt-1 hidden sm:block">
          Last updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Recent Leads section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-[#0F172A]">Recent Leads</h2>
          <a
            href="/leads"
            className="text-xs text-[#2563EB] hover:text-blue-700 font-medium transition-colors"
          >
            View all →
          </a>
        </div>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
