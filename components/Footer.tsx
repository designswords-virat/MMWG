"use client";

const DARK = "#0F0F11";
const MUTED = "#6B6B72";
const FAINT = "#A8A8B0";
const HAIRLINE = "rgba(15,15,17,0.10)";
const BLUE = "#007AFF";

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{ background: "#EDEEF1", color: DARK, borderTop: `1px solid ${HAIRLINE}` }}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Top: structure label */}
        <div className="flex items-center gap-3 pt-6" style={{ color: FAINT }}>
          <span
            className="h-px w-12"
            style={{ background: HAIRLINE, backgroundColor: FAINT }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
            footer / 04
          </span>
        </div>

        {/* Massive wordmark */}
        <div className="mt-10 overflow-hidden">
          <div
            className="whitespace-nowrap font-semibold leading-[0.92] tracking-[-0.035em]"
            style={{ color: DARK, fontSize: "clamp(48px, 9vw, 120px)" }}
          >
            @MMWG
            <span
              className="font-light italic tracking-[-0.03em]"
              style={{ fontSize: "0.55em", color: MUTED }}
            >
              .
            </span>
          </div>
          <p
            className="mt-6 max-w-md text-[15px] leading-relaxed"
            style={{ color: MUTED }}
          >
            Make My Website Great. A redesign service for the modern web — real
            content, premium assets, modern motion, delivered in 48 hours.
          </p>
        </div>

        {/* Four-column block with hairline grid */}
        <div
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ borderTop: `1px solid ${HAIRLINE}`, borderLeft: `1px solid ${HAIRLINE}` }}
        >
          <Col label="01 / product">
            <Link href="#submit">submit</Link>
            <Link href="#styles">styles</Link>
            <Link href="#process">process</Link>
          </Col>
          <Col label="02 / studio">
            <Link href="#process">workflow</Link>
          </Col>
          <Col label="03 / reach">
            <Link href="mailto:designs.words@gmail.com">designs.words@gmail.com</Link>
            <Link disabled>jaipur, india</Link>
          </Col>
          <Col label="04 / status">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: BLUE }}
                />
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: BLUE }}
                />
              </span>
              <span>all systems normal</span>
            </div>
            <span style={{ color: MUTED }}>v.2026.05.11</span>
          </Col>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-baseline justify-between gap-4 py-6 font-mono text-[11px] uppercase tracking-widest"
          style={{ borderTop: `1px solid ${HAIRLINE}`, color: MUTED }}
        >
          <span>
            © <span id="footer-year">2026</span> @mmwg · made greatly
          </span>
          <span>~/mmwg/v.2026.05</span>
          <span
            className="font-bold underline decoration-2 underline-offset-4"
            style={{ color: DARK }}
          >
            instagram · pinterest --
          </span>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.getElementById('footer-year').textContent=new Date().getFullYear();",
        }}
      />
    </footer>
  );
}

function Col({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-[180px] flex-col gap-2 p-6 md:p-8"
      style={{
        background: "#FFFFFF",
        borderRight: `1px solid ${HAIRLINE}`,
        borderBottom: `1px solid ${HAIRLINE}`,
        color: DARK,
      }}
    >
      <span
        className="font-mono text-[11px] uppercase tracking-widest"
        style={{ color: MUTED }}
      >
        {label}
      </span>
      <div className="mt-auto flex flex-col gap-1 text-[15px]">{children}</div>
    </div>
  );
}

function Link({
  href,
  children,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled || !href) {
    return <span style={{ color: MUTED }}>{children}</span>;
  }
  return (
    <a
      href={href}
      className="hover:underline underline-offset-4 transition-colors"
      style={{ color: DARK }}
    >
      {children}
    </a>
  );
}
