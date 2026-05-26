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
        <div
          className="rounded-xl p-6 text-center"
          style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <p className="text-red-400 font-semibold">Unable to connect to the API</p>
          <p className="text-red-400/70 text-sm mt-1">
            Make sure the backend is running at{" "}
            <code
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ background: "rgba(239, 68, 68, 0.15)" }}
            >
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-sm text-[#0E7490] font-medium">
              San Pedro Sport Fishing — Lead Overview
            </p>
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-[#10B981] animate-ping opacity-60" />
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wider">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Recent Leads section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-widest">
            Recent Leads
          </h2>
          <a
            href="/leads"
            className="text-xs text-[#06B6D4] hover:text-[#0E7490] font-semibold transition-colors flex items-center gap-1"
          >
            View all
            <span className="text-[#94A3B8]">→</span>
          </a>
        </div>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
