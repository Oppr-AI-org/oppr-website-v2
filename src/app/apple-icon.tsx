import { ImageResponse } from "next/og";

// Apple touch icon: the o-monogram tile, generated to PNG at build time
// (Apple icons must be raster; Next's ImageResponse rasterises with no extra deps).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#15201e"/><circle cx="76" cy="86" r="34" fill="none" stroke="#f2f2ed" stroke-width="20"/><circle cx="133" cy="120" r="17" fill="#a65032"/></svg>`;

export default function AppleIcon() {
  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUri} width={180} height={180} alt="" />
      </div>
    ),
    { ...size }
  );
}
