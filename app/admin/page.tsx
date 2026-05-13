import { promises as fs } from "node:fs";
import path from "node:path";
import BackgroundFX from "@/components/BackgroundFX";
import AdminView, { type Submission } from "./AdminView";
import { getSupabase, rowToCamel, type SubmissionRow } from "@/lib/supabase";

// Access control for this route is handled by middleware.ts (HTTP Basic Auth
// gated on ADMIN_PASSWORD env var). If the request reaches this component,
// the password check has already passed.

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function loadSubmissions(): Promise<Submission[]> {
  // Supabase first (production), local JSON fallback (local dev w/o env vars).
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("ts", { ascending: false });
    if (error) {
      console.error("[admin] supabase select failed:", error.message);
      return [];
    }
    return ((data ?? []) as SubmissionRow[]).map(rowToCamel) as Submission[];
  }

  const file = path.resolve(process.cwd(), "..", "submissions.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as { submissions: Submission[] };
    return Array.isArray(parsed.submissions) ? parsed.submissions : [];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const submissions = await loadSubmissions();
  const sorted = [...submissions].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );
  return (
    <main className="relative min-h-screen">
      <BackgroundFX />
      <AdminView submissions={sorted} />
    </main>
  );
}
