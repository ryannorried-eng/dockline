// API utility — all calls go through Next.js rewrites to the FastAPI backend

const API_BASE =
  typeof window !== "undefined"
    ? "" // use relative URLs in browser (rewrites handle it)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LeadStatus = "new" | "active" | "qualified";

export interface LeadSummary {
  id: number;
  phone_number: string;
  name: string | null;
  status: LeadStatus;
  source: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message: string | null;
}

export interface Message {
  id: number;
  lead_id: number;
  direction: "inbound" | "outbound";
  body: string;
  timestamp: string;
}

export interface LeadDetail extends LeadSummary {
  messages: Message[];
}

export interface Stats {
  total_leads: number;
  qualified_leads: number;
  new_today: number;
  messages_sent: number;
}

export interface Settings {
  id: number;
  business_name: string;
  google_review_link: string;
  textback_message: string;
  created_at: string;
  updated_at: string;
}

// ─── API calls ─────────────────────────────────────────────────────────────────

export const getLeads = () => apiFetch<LeadSummary[]>("/api/leads");

export const getLead = (id: number) => apiFetch<LeadDetail>(`/api/leads/${id}`);

export const updateLead = (
  id: number,
  updates: { name?: string; status?: LeadStatus }
) =>
  apiFetch<LeadDetail>(`/api/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const getStats = () => apiFetch<Stats>("/api/stats");

export const getSettings = () => apiFetch<Settings>("/api/settings");

export const updateSettings = (updates: Partial<Omit<Settings, "id" | "created_at" | "updated_at">>) =>
  apiFetch<Settings>("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const sendReviewRequest = (phone_number: string, customer_name: string) =>
  apiFetch("/api/send-review-request", {
    method: "POST",
    body: JSON.stringify({ phone_number, customer_name }),
  });
