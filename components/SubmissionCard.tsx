"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Submission } from "@/app/admin/AdminView";

const THEME_NAMES: Record<Submission["theme"], string> = {
  modern: "Modern",
  minimal: "Minimal",
  luxury: "Luxury",
  tech: "Tech",
  editorial: "Editorial",
  playful: "Playful",
};

const STATUS_META: Record<
  Submission["status"],
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  "in-progress": {
    label: "In progress",
    dot: "bg-sky-400",
    chip: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  },
  review: {
    label: "Review",
    dot: "bg-fuchsia-400",
    chip: "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-300",
  },
  deployed: {
    label: "Deployed",
    dot: "bg-emerald-400",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${Math.max(sec, 1)}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function SubmissionCard({
  submission,
  index,
}: {
  submission: Submission;
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const [timeLabel, setTimeLabel] = useState<string>("");
  const status = STATUS_META[submission.status];

  useEffect(() => {
    setTimeLabel(timeAgo(submission.timestamp));
    const interval = setInterval(() => {
      setTimeLabel(timeAgo(submission.timestamp));
    }, 30000);
    return () => clearInterval(interval);
  }, [submission.timestamp]);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(submission.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.04, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-5 backdrop-blur-xl transition-colors hover:border-textMuted md:p-6"
    >
      <div className="absolute right-0 top-0 h-24 w-24 opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
           style={{ backgroundColor: submission.color }} />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-widest ${status.chip}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
        <span
          title={new Date(submission.timestamp).toLocaleString()}
          className="font-mono text-xs text-textMuted"
          suppressHydrationWarning
        >
          {timeLabel || " "}
        </span>
      </div>

      <div className="relative mt-4">
        {submission.businessName && (
          <div className="text-xl font-semibold tracking-tight md:text-2xl">
            {submission.businessName}
          </div>
        )}
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-sm font-medium text-textSecondary">
            {submission.clientName}
          </span>
          {submission.contactNumber ? (
            <a
              href={`tel:${submission.contactNumber.replace(/\s/g, "")}`}
              className="text-sm text-textSecondary underline-offset-4 hover:text-textPrimary hover:underline"
            >
              {submission.contactNumber}
            </a>
          ) : submission.clientEmail ? (
            <a
              href={`mailto:${submission.clientEmail}`}
              className="text-sm text-textSecondary underline-offset-4 hover:text-textPrimary hover:underline"
            >
              {submission.clientEmail}
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-textMuted">
            Existing site
          </div>
          <a
            href={submission.existingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-textPrimary underline-offset-4 hover:text-accent hover:underline"
          >
            {hostname(submission.existingUrl)}
            <ArrowOut />
          </a>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-widest text-textMuted">
            Reference
          </div>
          {submission.referenceUrl ? (
            <a
              href={submission.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-textPrimary underline-offset-4 hover:text-accent hover:underline"
            >
              {hostname(submission.referenceUrl)}
              <ArrowOut />
            </a>
          ) : (
            <div className="mt-1 text-textMuted">—</div>
          )}
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-3">
        {submission.category && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-textMuted">
              {submission.category}
            </span>
            <span className="text-sm font-medium text-textPrimary">
              {THEME_NAMES[submission.theme]}
            </span>
          </div>
        )}
        {!submission.category && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-textMuted">
              Style
            </span>
            <span className="text-sm font-medium text-textPrimary">
              {THEME_NAMES[submission.theme]}
            </span>
          </div>
        )}
        {submission.industry && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-textMuted">
              Industry
            </span>
            <span className="text-sm font-medium text-textPrimary">
              {submission.industry.replace(/-/g, " ")}
            </span>
          </div>
        )}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/60 px-3 py-1.5">
          <span
            className="h-4 w-4 rounded-full ring-2 ring-bg"
            style={{
              backgroundColor: submission.color,
              boxShadow: `0 0 14px ${submission.color}55`,
            }}
          />
          <span className="font-mono text-xs uppercase text-textSecondary">
            {submission.color}
          </span>
        </div>
      </div>

      {submission.deployedUrl && (
        <div className="relative mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href={submission.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 transition-colors hover:bg-emerald-400/15"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              View live redesign
            </span>
            <ArrowOut />
          </a>
          {submission.repoUrl && (
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface/60 px-4 py-3 font-mono text-xs uppercase tracking-widest text-textSecondary transition-colors hover:border-textMuted hover:text-textPrimary sm:flex-initial"
              title={submission.repoUrl}
            >
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.37-5.27 5.66.42.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.68.8.56C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
                </svg>
                Repo
              </span>
              <ArrowOut />
            </a>
          )}
        </div>
      )}

      <div className="relative mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={copyId}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-textMuted transition-colors hover:text-textPrimary"
        >
          <span>id: {submission.id}</span>
          <span className={`transition-opacity ${copied ? "text-emerald-400 opacity-100" : "opacity-60"}`}>
            {copied ? "copied ✓" : "copy"}
          </span>
        </button>
      </div>
    </motion.li>
  );
}

function ArrowOut() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
}
