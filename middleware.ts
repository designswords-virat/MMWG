import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic Auth gate for /admin. The password lives in the ADMIN_PASSWORD
 * env var on Vercel (and in landing/.env.local for local dev).
 *
 * Username is always "admin"; only the password is checked. If
 * ADMIN_PASSWORD isn't set, /admin is treated as not configured and returns
 * a clean 404 — preserves the previous behavior of "deployed site has no
 * admin" while we set the password up.
 */
export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;

  // No password configured → admin doesn't exist.
  if (!expected) {
    return new NextResponse(null, { status: 404 });
  }

  const header = req.headers.get("authorization");
  if (header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        // atob is available in the Edge runtime.
        const decoded = atob(encoded);
        const idx = decoded.indexOf(":");
        const password = idx >= 0 ? decoded.slice(idx + 1) : "";
        if (password === expected) {
          return NextResponse.next();
        }
      } catch {
        // fall through to the 401
      }
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MMWG Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
