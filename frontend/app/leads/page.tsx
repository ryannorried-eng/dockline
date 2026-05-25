import { getLeads } from "@/lib/api";
import LeadsTable from "@/components/LeadsTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  let leads;

  try {
    leads = await getLeads();
  } catch {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">Unable to load leads</p>
          <p className="text-red-400 text-sm mt-1">Check that the backend API is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Leads</h1>
          <p className="text-sm text-slate-500">
            {leads.length} total lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
