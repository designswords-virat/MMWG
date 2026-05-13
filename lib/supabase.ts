import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Single Supabase client for the MMWG landing app.
 *
 * Used server-side by /api/submit (writes) and /admin (reads). The anon
 * key is fine to ship — RLS on the `submissions` table allows insert /
 * select / update for the anon role, which is what we want for a public
 * form + unauthenticated admin view in v1.
 *
 * If both env vars are missing, getSupabase() returns null so callers
 * can fall back to the file-based submissions.json store (preserves the
 * local dev experience).
 */

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

// ===== DB row <-> camelCase Submission mapping =====

export type SubmissionRow = {
  id: string;
  ts: string;
  existing_url: string;
  reference_url: string | null;
  business_name: string | null;
  industry: string | null;
  category: string | null;
  theme: "modern" | "minimal" | "luxury" | "tech" | "editorial" | "playful";
  color: string;
  client_name: string;
  contact_number: string | null;
  client_email: string | null;
  status: "pending" | "in-progress" | "review" | "deployed";
  deployed_url: string | null;
  repo_url: string | null;
  inserted_at?: string;
};

export type SubmissionCamel = {
  id: string;
  timestamp: string;
  existingUrl: string;
  referenceUrl: string | null;
  businessName?: string;
  industry?: string;
  category?: string;
  theme: SubmissionRow["theme"];
  color: string;
  clientName: string;
  contactNumber?: string;
  clientEmail?: string;
  status: SubmissionRow["status"];
  deployedUrl: string | null;
  repoUrl?: string | null;
};

export function rowToCamel(row: SubmissionRow): SubmissionCamel {
  return {
    id: row.id,
    timestamp: row.ts,
    existingUrl: row.existing_url,
    referenceUrl: row.reference_url,
    businessName: row.business_name ?? undefined,
    industry: row.industry ?? undefined,
    category: row.category ?? undefined,
    theme: row.theme,
    color: row.color,
    clientName: row.client_name,
    contactNumber: row.contact_number ?? undefined,
    clientEmail: row.client_email ?? undefined,
    status: row.status,
    deployedUrl: row.deployed_url,
    repoUrl: row.repo_url ?? undefined,
  };
}

export function camelToRow(s: SubmissionCamel): SubmissionRow {
  return {
    id: s.id,
    ts: s.timestamp,
    existing_url: s.existingUrl,
    reference_url: s.referenceUrl,
    business_name: s.businessName ?? null,
    industry: s.industry ?? null,
    category: s.category ?? null,
    theme: s.theme,
    color: s.color,
    client_name: s.clientName,
    contact_number: s.contactNumber ?? null,
    client_email: s.clientEmail ?? null,
    status: s.status,
    deployed_url: s.deployedUrl,
    repo_url: s.repoUrl ?? null,
  };
}
