"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Field from "./Field";
import CategorySelect from "./CategorySelect";
import ColorPicker from "./ColorPicker";
import { INDUSTRIES, type IndustrySlug } from "@/lib/industries";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const HAIRLINE = "rgba(15,15,17,0.10)";

type Errors = Partial<
  Record<
    | "existingUrl"
    | "referenceUrl"
    | "businessName"
    | "industry"
    | "category"
    | "clientName"
    | "contactNumber",
    string
  >
>;

function isValidUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(value: string) {
  // Permissive: at least 8 digits, allows +, spaces, parens, hyphens
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 8 && /^[+\d][\d\s()-]{6,}$/.test(value.trim());
}

export default function Form() {
  const [existingUrl, setExistingUrl] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState<IndustrySlug | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [color, setColor] = useState("#7C3AED");
  const [clientName, setClientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  function validate(): boolean {
    const next: Errors = {};
    if (!existingUrl.trim()) next.existingUrl = "Your current website is required.";
    else if (!isValidUrl(existingUrl))
      next.existingUrl = "Must be a full URL starting with http:// or https://";
    if (referenceUrl.trim() && !isValidUrl(referenceUrl))
      next.referenceUrl = "Must be a full URL starting with http:// or https://";
    if (!businessName.trim()) next.businessName = "Please enter your business name.";
    if (!industry) next.industry = "Pick an industry.";
    if (!category) next.category = "Pick a style.";
    if (!clientName.trim()) next.clientName = "Please enter your name.";
    if (!contactNumber.trim()) next.contactNumber = "Please enter your contact number.";
    else if (!isValidPhone(contactNumber))
      next.contactNumber = "Use a valid phone number (digits, +, spaces).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setServerMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingUrl,
          referenceUrl: referenceUrl.trim() || null,
          businessName,
          industry,
          category,
          color,
          clientName,
          contactNumber,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }

      setStatus("success");
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 50);
    } catch (err) {
      setStatus("error");
      setServerMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function reset() {
    setExistingUrl("");
    setReferenceUrl("");
    setBusinessName("");
    setIndustry(null);
    setCategory(null);
    setColor("#7C3AED");
    setClientName("");
    setContactNumber("");
    setErrors({});
    setStatus("idle");
    setServerMessage("");
  }

  return (
    <section
      id="submit"
      className="relative bg-white"
      style={{ borderTop: `1px solid ${HAIRLINE}`, color: DARK }}
    >
      {/* Top metadata strip */}
      <div className="flex items-baseline justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-widest md:px-10">
        <span>—section · 03</span>
        <span>7 fields · single submission</span>
      </div>

      <div className="px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold leading-[0.95] tracking-[-0.035em]"
          style={{ color: DARK, fontSize: "clamp(36px, 6vw, 88px)" }}
        >
          submit
          <span className="font-light italic tracking-[-0.03em]" style={{ fontSize: "0.55em" }}>
            .
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-lg text-[15px] leading-snug"
        >
          Tell us about your project. We&apos;ll get your home page redesigned and deployed within 48 hours.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-16 w-full max-w-3xl px-6 md:px-10"
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden"
        >
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[480px] flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7C3AED]/15 ring-2 ring-[#7C3AED]/40"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#7C3AED]"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h3 className="mt-5 text-2xl font-semibold">Request received</h3>
              <p className="mt-2 max-w-sm text-[#6B6B72]">
                We&apos;ll get to work on your redesign. Expect the home page
                preview within 48 hours.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-8 font-mono text-xs uppercase tracking-widest text-[#6B6B72] underline-offset-4 hover:text-[#6B6B72] hover:underline"
              >
                Submit another →
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              noValidate
            >
              <Field
                type="url"
                label="Current URL"
                placeholder="https://yourbusiness.com"
                value={existingUrl}
                onChange={(e) => setExistingUrl(e.target.value)}
                error={errors.existingUrl}
                autoComplete="url"
              />

              <Field
                type="url"
                label="Reference URL"
                hint="optional"
                placeholder="https://stripe.com"
                value={referenceUrl}
                onChange={(e) => setReferenceUrl(e.target.value)}
                error={errors.referenceUrl}
              />

              <Field
                label="Business name"
                placeholder="Acme Co."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                error={errors.businessName}
                autoComplete="organization"
              />

              <div>
                <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-widest" style={{ color: DARK }}>
                  <span>Industry Category</span>
                  <span style={{ color: MUTED }}>— 12 sectors</span>
                </div>
                <select
                  value={industry ?? ""}
                  onChange={(e) => {
                    const next = e.target.value as IndustrySlug | "";
                    setIndustry(next === "" ? null : next);
                    setCategory(null);
                  }}
                  className="w-full appearance-none bg-transparent py-3 pr-8 text-[16px] outline-none transition-all duration-200"
                  style={{
                    borderBottom: `1px solid ${HAIRLINE}`,
                    color: DARK,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230F0F11' stroke-width='1.5' stroke-linecap='square'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.25rem center",
                  }}
                >
                  <option value="" disabled>
                    Select industry…
                  </option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.slug} value={ind.slug}>
                      {ind.code} · {ind.label}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-red-600">
                    — {errors.industry}
                  </p>
                )}
              </div>

              <CategorySelect
                industry={industry}
                value={category}
                onChange={setCategory}
              />
              {errors.category && (
                <p className="-mt-3 text-xs text-red-400">{errors.category}</p>
              )}

              <ColorPicker value={color} onChange={setColor} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Name"
                  placeholder="Jane Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  error={errors.clientName}
                  autoComplete="name"
                />
                <Field
                  type="tel"
                  label="Contact number"
                  placeholder="+91 98765 43210"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  error={errors.contactNumber}
                  autoComplete="tel"
                />
              </div>

              {status === "error" && (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {serverMessage}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#0F0F11] px-6 py-4 text-base font-medium text-white transition-all hover:bg-[#0F0F11]/90 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                      />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Submit redesign request
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </motion.button>

              <p className="text-center font-mono text-[11px] uppercase tracking-widest text-[#6B6B72]">
                Your data stays local · no spam
              </p>
            </motion.form>
          )}
        </AnimatePresence>
        </div>
      </motion.div>

      <div className="mt-16 flex items-baseline justify-between px-6 py-4 font-mono text-[11px] uppercase tracking-widest md:px-10">
        <span>~/mmwg/submit</span>
        <span>end ·</span>
      </div>
    </section>
  );
}
