"use client";

/*
 * Logo Lab: the comparison page from LOGO.md. Ten iterations, one row each,
 * seven cells per row so they compare fairly, three global toggles, and the
 * judging checklist at the bottom. Static; no persistence.
 */
import React, { useState } from "react";
import { GROUND, INK, HUMAN, MACHINE, VERIFIED, ITERATIONS, SELECTED, monogramTile, monogramBare, type Iteration } from "./marks";

const MUTED = "rgba(21,32,30,0.55)";
const BORDER = "rgba(21,32,30,0.12)";
const mono = { fontFamily: "var(--mono), monospace" } as const;

// ── SVG frames ──────────────────────────────────────────────────────────────
function LockupFrame({ children, width = 210 }: { children: React.ReactNode; width?: number }) {
  return (
    <svg viewBox="0 0 200 52" width={width} height={(52 * width) / 200} role="img" aria-label="oppr logo">
      {children}
    </svg>
  );
}
function Box32({ children, size }: { children: React.ReactNode; size: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: "block" }}>
      {children}
    </svg>
  );
}

// ── cells ───────────────────────────────────────────────────────────────────
function CellLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...mono, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: MUTED }}>
      {children}
    </div>
  );
}

function SwatchLockup({ it, dark }: { it: Iteration; dark: boolean }) {
  return (
    <div
      style={{
        background: dark ? INK : GROUND,
        border: `1px solid ${dark ? "transparent" : BORDER}`,
        borderRadius: 10,
        padding: "22px 20px",
        display: "flex",
        alignItems: "center",
        minHeight: 74,
      }}
    >
      <LockupFrame>{it.lockup(dark)}</LockupFrame>
    </div>
  );
}

function MarkCell({ it }: { it: Iteration }) {
  return (
    <div
      style={{
        background: GROUND,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 100,
        minHeight: 74,
      }}
    >
      <Box32 size={64}>{it.mark()}</Box32>
    </div>
  );
}

function FaviconStrip({ it, pixelGrid }: { it: Iteration; pixelGrid: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {[false, true].map((dark) => (
        <div
          key={String(dark)}
          style={{
            background: dark ? INK : GROUND,
            border: `1px solid ${dark ? "transparent" : BORDER}`,
            borderRadius: 10,
            padding: 12,
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          {[48, 32, 16].map((px) => (
            <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ position: "relative", width: px, height: px }}>
                <Box32 size={px}>{it.favicon(dark, px)}</Box32>
                {pixelGrid && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(to right, rgba(128,128,128,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.35) 1px, transparent 1px)",
                      backgroundSize: `${px / 8}px ${px / 8}px`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <span style={{ ...mono, fontSize: 8, color: dark ? "rgba(242,242,237,0.5)" : MUTED }}>{px}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TabMock({ it }: { it: Iteration }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#dfdeD7",
        borderRadius: "9px 9px 0 0",
        padding: "9px 14px 11px",
        maxWidth: 240,
        boxShadow: `inset 0 -1px 0 ${BORDER}`,
      }}
    >
      <Box32 size={16}>{it.favicon(false, 16)}</Box32>
      <span style={{ ...mono, fontSize: 11, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        Oppr · Operator intelligence
      </span>
    </div>
  );
}

// site header strip with this iteration's lockup dropped in
function HeaderRow({ it }: { it: Iteration }) {
  return (
    <div
      style={{
        background: GROUND,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}
    >
      <LockupFrame width={116}>{it.lockup(false)}</LockupFrame>
      <nav style={{ display: "flex", gap: 22, alignItems: "center", ...mono, fontSize: 12, color: INK }}>
        <span>Platform</span>
        <span style={{ opacity: 0.9 }}>How it works</span>
        <span style={{ opacity: 0.9 }}>About</span>
        <span
          style={{
            background: HUMAN,
            color: GROUND,
            borderRadius: 7,
            padding: "8px 14px",
            fontFamily: "var(--archivo), sans-serif",
            fontWeight: 600,
          }}
        >
          Book a call ↗
        </span>
      </nav>
    </div>
  );
}

function Notes({ it }: { it: Iteration }) {
  return (
    <div style={{ maxWidth: 240 }}>
      <div style={{ fontFamily: "var(--archivo), sans-serif", fontWeight: 700, fontSize: 16, color: INK, marginBottom: 6 }}>
        <span style={{ color: HUMAN }}>{it.n}</span> · {it.name}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(21,32,30,0.8)", marginBottom: 8 }}>{it.concept}</div>
      <div style={{ ...mono, fontSize: 10.5, lineHeight: 1.5, color: MUTED }}>{it.delta}</div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <CellLabel>{label}</CellLabel>
      {children}
    </div>
  );
}

// mini favicon strip for the selected block, drawing arbitrary content
function MiniStrip({
  render,
  pixelGrid,
}: {
  render: (dark: boolean, px: number) => React.ReactNode;
  pixelGrid: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {[false, true].map((dark) => (
        <div
          key={String(dark)}
          style={{
            background: dark ? INK : GROUND,
            border: `1px solid ${dark ? "transparent" : BORDER}`,
            borderRadius: 10,
            padding: 12,
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
          }}
        >
          {[48, 32, 16].map((px) => (
            <div key={px} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ position: "relative", width: px, height: px }}>
                <Box32 size={px}>{render(dark, px)}</Box32>
                {pixelGrid && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage:
                        "linear-gradient(to right, rgba(128,128,128,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.35) 1px, transparent 1px)",
                      backgroundSize: `${px / 8}px ${px / 8}px`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>
              <span style={{ ...mono, fontSize: 8, color: dark ? "rgba(242,242,237,0.5)" : MUTED }}>{px}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SelectedDirection({ pixelGrid }: { pixelGrid: boolean }) {
  return (
    <section
      style={{
        border: `2px solid ${INK}`,
        borderRadius: 16,
        padding: "30px 32px 34px",
        marginBottom: 46,
        background: "rgba(166,80,50,0.035)",
      }}
    >
      <div style={{ ...mono, fontSize: 11, letterSpacing: "0.16em", color: HUMAN, textTransform: "uppercase", marginBottom: 8 }}>
        ★ Selected direction
      </div>
      <h2 style={{ fontFamily: "var(--archivo), sans-serif", fontWeight: 700, fontSize: 24, color: INK, margin: "0 0 8px" }}>
        Baseline wordmark, o-monogram icon
      </h2>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(21,32,30,0.75)", maxWidth: 620, margin: "0 0 26px" }}>
        The logo stays the baseline <strong style={{ color: INK }}>oppr.</strong> with its orange period. The icon is the first
        letter <strong style={{ color: INK }}>o</strong> carrying that same orange dot, as a filled app-icon tile. A bare{" "}
        <strong style={{ color: INK }}>o.</strong> is included for transparent or in-line use.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        <Cell label="Lockup · light">
          <SwatchLockup it={SELECTED} dark={false} />
        </Cell>
        <Cell label="Lockup · dark">
          <SwatchLockup it={SELECTED} dark={true} />
        </Cell>
        <Cell label="App icon">
          <div
            style={{
              background: GROUND,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 74,
            }}
          >
            <Box32 size={88}>{monogramTile(88)}</Box32>
          </div>
        </Cell>
        <Cell label="Favicon · tile">
          <MiniStrip render={(_d, px) => monogramTile(px)} pixelGrid={pixelGrid} />
        </Cell>
        <Cell label="Favicon · bare o.">
          <MiniStrip render={(d, px) => monogramBare(d, px)} pixelGrid={pixelGrid} />
        </Cell>
        <Cell label="Browser tab">
          <div style={{ paddingTop: 6 }}>
            <TabMock it={SELECTED} />
          </div>
        </Cell>
      </div>

      <div style={{ marginTop: 22 }}>
        <CellLabel>Header in situ</CellLabel>
        <div style={{ marginTop: 8 }}>
          <HeaderRow it={SELECTED} />
        </div>
      </div>
    </section>
  );
}

function Row({ it, pixelGrid }: { it: Iteration; pixelGrid: boolean }) {
  return (
    <section style={{ borderTop: `1px solid ${BORDER}`, padding: "34px 0" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start" }}>
        <Cell label="Lockup · light">
          <SwatchLockup it={it} dark={false} />
        </Cell>
        <Cell label="Lockup · dark">
          <SwatchLockup it={it} dark={true} />
        </Cell>
        <Cell label="Mark">
          <MarkCell it={it} />
        </Cell>
        <Cell label="Favicon · 48 / 32 / 16">
          <FaviconStrip it={it} pixelGrid={pixelGrid} />
        </Cell>
        <Cell label="Browser tab">
          <div style={{ paddingTop: 6 }}>
            <TabMock it={it} />
          </div>
        </Cell>
        <Cell label="Notes">
          <Notes it={it} />
        </Cell>
      </div>
      <div style={{ marginTop: 20 }}>
        <CellLabel>Header in situ</CellLabel>
        <div style={{ marginTop: 8 }}>
          <HeaderRow it={it} />
        </div>
      </div>
    </section>
  );
}

// ── judging checklist ─────────────────────────────────────────────────────────
const CRITERIA = [
  ["16 px survival", "Is the favicon unmistakable in the tab mockup?"],
  ["Distinctiveness", "Would you recognise it without the word next to it?"],
  ["Brand fit", "Does it feel like the films and the site, not a new brand?"],
  ["Black-box fit", "Outcome and vocabulary, not mechanism?"],
  ["Wearability", "Still like it after scrolling past it ten times?"],
];

function Checklist() {
  return (
    <section style={{ borderTop: `2px solid ${INK}`, marginTop: 20, paddingTop: 34 }}>
      <h2 style={{ fontFamily: "var(--archivo), sans-serif", fontWeight: 700, fontSize: 24, color: INK, margin: "0 0 6px" }}>
        Judging checklist
      </h2>
      <p style={{ fontSize: 14, color: MUTED, margin: "0 0 22px" }}>Score each iteration 1 to 5 on:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        {CRITERIA.map(([name, q], i) => (
          <div key={name} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ ...mono, fontSize: 10, color: HUMAN, letterSpacing: "0.1em", marginBottom: 6 }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: "var(--archivo), sans-serif", fontWeight: 700, fontSize: 15, color: INK, marginBottom: 5 }}>
              {name}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(21,32,30,0.75)" }}>{q}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <CellLabel>Quick reference · all ten</CellLabel>
        <div style={{ overflowX: "auto", marginTop: 10 }}>
          <table style={{ borderCollapse: "collapse", ...mono, fontSize: 12, minWidth: 640 }}>
            <thead>
              <tr>
                {["#", "Name", "Concept", ...CRITERIA.map(([n]) => n)].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ITERATIONS.map((it) => (
                <tr key={it.n}>
                  <td style={{ padding: "8px 12px", color: HUMAN, borderBottom: `1px solid ${BORDER}` }}>{it.n}</td>
                  <td style={{ padding: "8px 12px", color: INK, borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>{it.name}</td>
                  <td style={{ padding: "8px 12px", color: "rgba(21,32,30,0.7)", borderBottom: `1px solid ${BORDER}`, maxWidth: 320 }}>
                    {it.concept}
                  </td>
                  {CRITERIA.map(([n]) => (
                    <td key={n} style={{ padding: "8px 12px", color: "rgba(21,32,30,0.3)", borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
                      &ndash;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export function LogoLab() {
  const [darkPage, setDarkPage] = useState(false);
  const [pixelGrid, setPixelGrid] = useState(false);
  const [grayscale, setGrayscale] = useState(false);

  const pageBg = darkPage ? "#0f1513" : "#faf9f5";
  const pageInk = darkPage ? GROUND : INK;

  return (
    <main style={{ background: pageBg, minHeight: "100vh", color: pageInk, transition: "background 0.2s" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "52px 40px 100px" }}>
        {/* header */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div style={{ ...mono, fontSize: 11, letterSpacing: "0.16em", color: HUMAN, textTransform: "uppercase", marginBottom: 10 }}>
              Logo Lab · internal
            </div>
            <h1 style={{ fontFamily: "var(--archivo), sans-serif", fontWeight: 700, fontSize: 34, margin: 0, color: pageInk }}>
              Ten marks, side by side
            </h1>
          </div>
          {/* toggles */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["Dark page", darkPage, () => setDarkPage((v) => !v)],
              ["Pixel grid", pixelGrid, () => setPixelGrid((v) => !v)],
              ["Grayscale", grayscale, () => setGrayscale((v) => !v)],
            ].map(([label, on, toggle]) => (
              <button
                key={label as string}
                onClick={toggle as () => void}
                style={{
                  ...mono,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "9px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  border: `1px solid ${on ? HUMAN : BORDER}`,
                  background: on ? HUMAN : "transparent",
                  color: on ? GROUND : pageInk,
                  transition: "all 0.15s",
                }}
              >
                {label as string}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 14, color: darkPage ? "rgba(242,242,237,0.6)" : MUTED, maxWidth: 640, marginTop: 18, lineHeight: 1.6 }}>
          Every row is one iteration of <strong style={{ color: pageInk }}>oppr.</strong> drawn as inline SVG, shown as a lockup on
          light and dark, a standalone mark, favicons at 48 / 32 / 16 px on both grounds, a browser-tab mockup, and dropped into the
          real header. Nothing here is exported or wired to the live site.
        </p>

        {/* selected direction, then the full field of iterations */}
        <div style={{ marginTop: 34, filter: grayscale ? "grayscale(1)" : "none" }}>
          <SelectedDirection pixelGrid={pixelGrid} />
          <div style={{ ...mono, fontSize: 10, letterSpacing: "0.16em", color: MUTED, textTransform: "uppercase", marginBottom: 4 }}>
            All ten explorations
          </div>
          {ITERATIONS.map((it) => (
            <Row key={it.n} it={it} pixelGrid={pixelGrid} />
          ))}
        </div>

        <Checklist />

        {/* colour reference footer */}
        <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 16 }}>
          {[
            ["GROUND", GROUND],
            ["INK", INK],
            ["HUMAN", HUMAN],
            ["MACHINE", MACHINE],
            ["VERIFIED", VERIFIED],
          ].map(([name, hex]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: 5, background: hex, border: `1px solid ${BORDER}` }} />
              <span style={{ ...mono, fontSize: 11, color: darkPage ? "rgba(242,242,237,0.7)" : MUTED }}>
                {name} {hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
