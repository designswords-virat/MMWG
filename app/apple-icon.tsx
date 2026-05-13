import { ImageResponse } from "next/og";

/**
 * 180×180 PNG used by iOS when a visitor adds MMWG to their home screen.
 * Same design as the favicon — scaled up with proportional padding.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 38,
          color: "#FFFFFF",
          fontSize: 132,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <span style={{ position: "relative", top: -4 }}>M</span>
        <span
          style={{
            position: "absolute",
            right: 28,
            bottom: 30,
            width: 22,
            height: 22,
            borderRadius: 999,
            background: "#7C3AED",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
