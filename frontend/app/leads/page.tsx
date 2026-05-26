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
        <div className="rounded-xl p-6 text-center bg-red-50 border border-red-200">
          <p className="text-red-600 font-semibold">Unable to load leads</p>
          <p className="text-red-500 text-sm mt-1">
            Check that the backend API is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-bold text-[#0F172A] tracking-tight">
            Leads
          </h1>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
            {leads.length}
          </span>
        </div>
        <p className="text-sm text-[#64748B]">All inbound leads and conversations</p>
      </div>

      <LeadsTable leads={leads} showFilters />
    </div>
  );
}
