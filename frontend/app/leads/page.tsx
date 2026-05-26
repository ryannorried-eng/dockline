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
      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 10,
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ color: "#DC2626", fontWeight: 500, fontSize: 13 }}>
            Unable to load leads
          </p>
          <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
            Check that the backend API is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="page-enter"
      style={{
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Page title row */}
      <div className="flex items-center" style={{ gap: 10 }}>
        <h1
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#1A1A1A",
            margin: 0,
          }}
        >
          Leads
        </h1>
        <span
          style={{
            backgroundColor: "#F0EDE8",
            color: "#6B6560",
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 20,
            padding: "3px 10px",
          }}
        >
          {leads.length}
        </span>
      </div>

      {/* Leads table with filters */}
      <LeadsTable leads={leads} showFilters />
    </div>
  );
}
