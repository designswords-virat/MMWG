import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  CATEGORIES,
  INDUSTRIES,
  type IndustrySlug,
  themeFromCategory,
} from "@/lib/industries";
import { getSupabase, camelToRow, type SubmissionCamel } from "@/lib/supabase";

const VALID_THEMES = [
  "modern",
  "minimal",
  "luxury",
  "tech",
  "editorial",
  "playful",
] as const;

const VALID_INDUSTRIES: ReadonlySet<string> = new Set(
  INDUSTRIES.map((i) => i.slug),
);

const VALID_CATEGORIES: ReadonlySet<string> = new Set(
  Object.values(CATEGORIES).flatMap((arr) => arr.map((c) => c.code)),
);

type Submission = {
  id: string;
  timestamp: string;
  existingUrl: string;
  referenceUrl: string | null;
  businessName: string;
  industry: IndustrySlug;
  category: string;
  theme: (typeof VALID_THEMES)[number];
  color: string;
  clientName: string;
  contactNumber: string;
  status: "pending" | "in-progress" | "review" | "deployed";
  deployedUrl: string | null;
  // Legacy field — older entries used email instead of contact number
  clientEmail?: string;
};

type Store = { submissions: Submission[] };

function submissionsPath() {
  return path.resolve(process.cwd(), "..", "submissions.json");
}

async function readStore(): Promise<Store> {
  const file = submissionsPath();
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as Store;
    if (!Array.isArray(parsed.submissions)) return { submissions: [] };
    return parsed;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      return { submissions: [] };
    }
    throw err;
  }
}

async function writeStore(store: Store) {
  await fs.writeFile(
    submissionsPath(),
    JSON.stringify(store, null, 2) + "\n",
    "utf8",
  );
}

function slugifyDomain(url: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  } catch {
    return "client";
  }
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && /^[+\d][\d\s()-]{6,}$/.test(value.trim());
}

// WhatsApp notification via CallMeBot. Fire-and-forget; failures are logged
// but never block the submission response. Disabled unless both env vars set.
async function notifyWhatsApp(entry: Submission) {
  const number = process.env.MMWG_WHATSAPP_NUMBER;
  const apiKey = process.env.MMWG_CALLMEBOT_API_KEY;
  if (!number || !apiKey) return;

  const adminUrl = process.env.MMWG_ADMIN_URL ?? "http://localhost:3000/admin";
  const lines = [
    `*New MMWG submission*`,
    `${entry.businessName} — ${entry.clientName}`,
    `📞 ${entry.contactNumber}`,
    `🏢 ${entry.industry} · ${entry.category} (${entry.theme})`,
    `🎨 ${entry.color}`,
    `🔗 ${entry.existingUrl}`,
    `→ ${adminUrl}`,
  ];
  const text = lines.join("\n");

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(number)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      console.warn(`[whatsapp] CallMeBot responded ${res.status}`);
    }
  } catch (err) {
    console.warn("[whatsapp] CallMeBot fetch failed:", err);
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    existingUrl,
    referenceUrl,
    businessName,
    industry,
    category,
    color,
    clientName,
    contactNumber,
  } = body as Record<string, unknown>;

  if (!isHttpUrl(existingUrl)) {
    return NextResponse.json(
      { error: "existingUrl must be a valid http(s) URL" },
      { status: 400 },
    );
  }
  if (referenceUrl !== null && referenceUrl !== undefined && !isHttpUrl(referenceUrl)) {
    return NextResponse.json(
      { error: "referenceUrl must be a valid http(s) URL or null" },
      { status: 400 },
    );
  }
  if (typeof businessName !== "string" || businessName.trim().length === 0) {
    return NextResponse.json({ error: "businessName is required" }, { status: 400 });
  }
  if (typeof industry !== "string" || !VALID_INDUSTRIES.has(industry)) {
    return NextResponse.json(
      { error: "industry must be a valid industry slug" },
      { status: 400 },
    );
  }
  if (typeof category !== "string" || !VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      { error: "category must be a valid category code (e.g. RE-01)" },
      { status: 400 },
    );
  }
  // Ensure the category actually belongs to the chosen industry
  const industryCats = CATEGORIES[industry as IndustrySlug];
  if (!industryCats || !industryCats.some((c) => c.code === category)) {
    return NextResponse.json(
      { error: "category does not belong to the chosen industry" },
      { status: 400 },
    );
  }
  if (!isHexColor(color)) {
    return NextResponse.json(
      { error: "color must be a hex string like #RRGGBB" },
      { status: 400 },
    );
  }
  if (typeof clientName !== "string" || clientName.trim().length === 0) {
    return NextResponse.json({ error: "clientName is required" }, { status: 400 });
  }
  if (!isValidPhone(contactNumber)) {
    return NextResponse.json({ error: "valid contactNumber is required" }, { status: 400 });
  }

  const derivedTheme = themeFromCategory(category as string);
  if (!derivedTheme) {
    return NextResponse.json(
      { error: "internal: could not derive theme for category" },
      { status: 500 },
    );
  }

  const now = new Date();
  const ts = now.toISOString();
  const idPrefix = ts.slice(0, 10).replace(/-/g, "");
  const idTime = ts.slice(11, 19).replace(/:/g, "");
  const id = `${idPrefix}-${idTime}-${slugifyDomain(existingUrl as string)}`;

  const entry: Submission = {
    id,
    timestamp: ts,
    existingUrl: existingUrl as string,
    referenceUrl: (referenceUrl as string | null | undefined) ?? null,
    businessName: (businessName as string).trim(),
    industry: industry as IndustrySlug,
    category: category as string,
    theme: derivedTheme,
    color: (color as string).toUpperCase(),
    clientName: (clientName as string).trim(),
    contactNumber: (contactNumber as string).trim(),
    status: "pending",
    deployedUrl: null,
  };

  // Persistence: Supabase if configured (production / deployed), else local JSON
  // file (local dev when SUPABASE env vars aren't set). Both branches always
  // attempt the file write too — so when running locally with Supabase
  // configured, the local JSON stays in sync for Claude's auto-start workflow.
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("submissions")
      .insert(camelToRow(entry as SubmissionCamel));
    if (error) {
      console.error("[supabase] insert failed:", error.message);
      return NextResponse.json(
        { error: "Failed to persist submission", detail: error.message },
        { status: 500 },
      );
    }
  }

  // Always also append to local JSON when the filesystem is writable.
  // Best-effort: silently ignore EROFS / ENOENT on serverless filesystems.
  try {
    const store = await readStore();
    if (!store.submissions.some((s) => s.id === entry.id)) {
      store.submissions.push(entry);
      await writeStore(store);
    }
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code !== "EROFS" && code !== "EACCES" && code !== "ENOENT") {
      // If we don't have Supabase to fall back on, this is fatal.
      if (!supabase) {
        console.error("[file] write failed without Supabase fallback:", err);
        return NextResponse.json(
          { error: "Failed to persist submission" },
          { status: 500 },
        );
      }
      console.warn("[file] write failed (Supabase write succeeded):", err);
    }
  }

  // Fire-and-forget WhatsApp notification (no await — don't slow the response).
  // Safe no-op if env vars aren't configured.
  void notifyWhatsApp(entry);

  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("ts", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { rowToCamel } = await import("@/lib/supabase");
    return NextResponse.json({
      submissions: (data ?? []).map(rowToCamel),
    });
  }
  const store = await readStore();
  return NextResponse.json(store);
}
