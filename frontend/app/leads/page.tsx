import { getLeads } from "@/lib/api";
import LeadsTable from "@/components/LeadsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  let leads;

  try {
    leads = await getLeads();
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
          <p className="text-red-400 font-semibold">Unable to load leads</p>
          <p className="text-red-400/70 text-sm mt-1">
            Check that the backend API is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] tracking-tight">
            Leads
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1.5">
            All inbound leads and conversations
          </p>
        </div>
        {/* Lead count badge */}
        <div
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
          style={{
            background: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.2)",
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
          <span className="text-xs font-bold text-[#06B6D4] tabular-nums">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <LeadsTable leads={leads} showFilters />
    </div>
  );
}
