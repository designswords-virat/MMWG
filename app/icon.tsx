import { ImageResponse } from "next/og";

/**
 * Favicon for the MMWG landing + admin pages.
 *
 * Renders to a 32×32 PNG at build time. Dark surface, white "M",
 * purple period dot — matches the brand's @MMWG. wordmark.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#0F0F11",
          borderRadius: 6,
          color: "#FFFFFF",
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <span style={{ position: "relative", top: -1 }}>M</span>
        <span
          style={{
            position: "absolute",
            right: 5,
            bottom: 5,
            width: 4,
            height: 4,
            borderRadius: 999,
            background: "#7C3AED",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
