import { ImageResponse } from "next/og";
export const alt = "CargoShare — a little space, a useful journey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const OpenGraphImage = () =>
  new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f9f5ed",
        color: "#172522",
        padding: 72,
      }}
    >
      <div style={{ display: "flex", fontSize: 36 }}>CargoShare</div>
      <div style={{ display: "flex", fontSize: 78, maxWidth: 1000, lineHeight: 1.05 }}>
        A little space. A useful journey.
      </div>
      <div style={{ display: "flex", fontSize: 28 }}>
        Send small items with travelers going your way.
      </div>
    </div>,
    size,
  );
export default OpenGraphImage;
