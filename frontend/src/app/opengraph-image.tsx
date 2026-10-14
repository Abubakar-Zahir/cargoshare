import { ImageResponse } from "next/og";

export const alt = "CargoShare: send it with someone already going";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "#f9f5ed",
        color: "#131922",
      }}
    >
      <div style={{ fontSize: 36 }}>CargoShare</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>
          Send it with someone already going.
        </div>
        <div
          style={{ display: "flex", gap: 24, fontSize: 40, color: "#115b3e" }}
        >
          <span>LHE → KHI</span>
          <span>ISB → PEW</span>
          <span>MUX → LHE</span>
        </div>
      </div>
    </div>,
    size,
  );
}
