"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import SubmissionCard from "@/components/SubmissionCard";

export type Submission = {
  id: string;
  timestamp: string;
  existingUrl: string;
  referenceUrl: string | null;
  businessName?: string;
  // New: industry + category (replaces direct theme pick in the form)
  industry?: string;
  category?: string;
  theme:
    | "modern"
    | "minimal"
    | "luxury"
    | "tech"
    | "editorial"
    | "playful";
  color: string;
  clientName: string;
  contactNumber?: string;
  // Legacy field — old submissions had email instead of phone
  clientEmail?: string;
  status: "pending" | "in-progress" | "review" | "deployed";
  deployedUrl: string | null;
  repoUrl?: string | null;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in-progress", label: "In progress" },
  { key: "review", label: "Review" },
  { key: "deployed", label: "Deployed" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function AdminView({ submissions }: { submissions: Submission[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: submissions.length };
    for (const s of submissions) c[s.status] = (c[s.status] ?? 0) + 1;
    return c;
  }, [submissions]);

  const filtered = useMemo(() => {
    if (filter === "all") return submissions;
    return submissions.filter((s) => s.status === filter);
  }, [submissions, filter]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-border/40 bg-bg/40 px-6 py-4 backdrop-blur-md md:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent to-fuchsia-500 text-sm font-bold text-white">
            M
          </span>
          <span>MMWG</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-textMuted md:inline">
            / admin
          </span>
        </Link>

        <Link
          href="/"
          className="rounded-full border border-border bg-surface/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-textSecondary backdrop-blur transition-colors hover:border-textMuted hover:text-textPrimary"
        >
          ← Back to form
        </Link>
      </motion.nav>

      <div className="mx-auto max-w-5xl px-6 pb-32 pt-28 md:pt-32">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs font-mono text-textSecondary backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live data
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Submissions
            </h1>
            <p className="mt-2 text-textSecondary">
              {submissions.length === 0
                ? "No submissions yet — the form is ready and waiting."
                : `${submissions.length} total · sorted newest first`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-textSecondary transition-colors hover:border-textMuted hover:text-textPrimary md:inline-flex"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            Refresh
          </button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count = counts[f.key] ?? 0;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`relative rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-textPrimary"
                    : "border-border bg-surface/40 text-textSecondary hover:border-textMuted hover:text-textPrimary"
                }`}
              >
                {f.label}
                <span
                  className={`ml-2 font-mono text-xs ${
                    active ? "text-accent" : "text-textMuted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <EmptyState filter={filter} hasAny={submissions.length > 0} />
          ) : (
            <motion.ul layout className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((s, i) => (
                  <SubmissionCard key={s.id} submission={s} index={i} />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>
    </>
  );
}

function EmptyState({ filter, hasAny }: { filter: FilterKey; hasAny: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/30 p-16 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-textMuted"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium">
        {hasAny ? `No "${filter}" submissions` : "No submissions yet"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-textSecondary">
        {hasAny
          ? "Try another filter, or wait for new entries."
          : "Once a client submits the form, their request will appear here."}
      </p>
      {!hasAny && (
        <Link
          href="/"
          className="mt-6 font-mono text-xs uppercase tracking-widest text-accent underline-offset-4 hover:underline"
        >
          Open the form →
        </Link>
      )}
    </motion.div>
  );
}
