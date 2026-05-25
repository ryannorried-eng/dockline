import { getLeads, getStats } from "@/lib/api";
import StatsBar from "@/components/StatsBar";
import LeadsTable from "@/components/LeadsTable";
import { Anchor } from "lucide-react";

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
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Unable to connect to the API</p>
          <p className="text-red-400 text-sm mt-1">
            Make sure the backend is running at{" "}
            <code className="bg-red-100 px-1 rounded">
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0A1628]">
          <Anchor className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500">San Pedro Sport Fishing — Lead Overview</p>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Leads section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-700">Recent Leads</h2>
          <a
            href="/leads"
            className="text-xs text-[#0E7490] hover:underline font-medium"
          >
            View all →
          </a>
        </div>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
