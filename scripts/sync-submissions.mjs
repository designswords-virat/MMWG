// scripts/sync-submissions.mjs
//
// Pulls the public.submissions table from Supabase and merges into the local
// d:\DEMO MMWG\submissions.json. Used by Claude to keep the local cache fresh
// after the form has been moved to the cloud.
//
// Run from the landing/ directory:
//   node scripts/sync-submissions.mjs
//
// Reads env from .env.local automatically (Next.js convention compatible).

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const landingDir = resolve(__dirname, "..");
const repoRoot = resolve(landingDir, "..");
const submissionsFile = resolve(repoRoot, "submissions.json");
const envFile = resolve(landingDir, ".env.local");

async function loadDotEnv() {
  try {
    const raw = await readFile(envFile, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local missing — that's fine, env may come from the shell.
  }
}

function rowToCamel(r) {
  return {
    id: r.id,
    timestamp: r.ts,
    existingUrl: r.existing_url,
    referenceUrl: r.reference_url,
    ...(r.business_name ? { businessName: r.business_name } : {}),
    ...(r.industry ? { industry: r.industry } : {}),
    ...(r.category ? { category: r.category } : {}),
    theme: r.theme,
    color: r.color,
    clientName: r.client_name,
    ...(r.contact_number ? { contactNumber: r.contact_number } : {}),
    ...(r.client_email ? { clientEmail: r.client_email } : {}),
    status: r.status,
    deployedUrl: r.deployed_url,
    ...(r.repo_url ? { repoUrl: r.repo_url } : {}),
  };
}

async function main() {
  await loadDotEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    process.exit(1);
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("→ Fetching submissions from Supabase…");
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("ts", { ascending: true });
  if (error) {
    console.error("Supabase fetch failed:", error.message);
    process.exit(1);
  }
  const remote = (data ?? []).map(rowToCamel);
  console.log(`  ${remote.length} rows in Supabase`);

  let local = { submissions: [] };
  try {
    const raw = await readFile(submissionsFile, "utf8");
    local = JSON.parse(raw);
    if (!Array.isArray(local.submissions)) local.submissions = [];
  } catch {
    console.log("  (local submissions.json missing — creating)");
  }

  const localById = new Map(local.submissions.map((s) => [s.id, s]));
  let added = 0;
  let updated = 0;
  for (const r of remote) {
    const existing = localById.get(r.id);
    if (!existing) {
      localById.set(r.id, r);
      added++;
      continue;
    }
    // Update only fields that changed remotely. Status, deployedUrl, repoUrl
    // are the ones most likely to drift.
    if (
      existing.status !== r.status ||
      existing.deployedUrl !== r.deployedUrl ||
      (existing.repoUrl ?? null) !== (r.repoUrl ?? null)
    ) {
      localById.set(r.id, { ...existing, ...r });
      updated++;
    }
  }

  const merged = {
    submissions: [...localById.values()].sort((a, b) =>
      a.timestamp.localeCompare(b.timestamp),
    ),
  };
  await writeFile(submissionsFile, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(`✓ Synced — ${added} added, ${updated} updated, ${merged.submissions.length} total in submissions.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
