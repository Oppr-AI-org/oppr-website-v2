/*
 * The ten logo iterations from LOGO.md, each as inline SVG.
 *
 * Every iteration exposes three render functions drawn in shared coordinate
 * frames so the comparison rows line up:
 *   lockup(dark)      → children of a 200×52 viewBox (baseline y=40)
 *   mark()            → children of a 32×32 viewBox (centre 16,16)
 *   favicon(dark, px) → children of a 32×32 viewBox; `px` is the rendered
 *                       size so sub-16px variants can redraw (thicker strokes,
 *                       fewer details) rather than shrink.
 *
 * Colour follows the two-voice rule: INK + at most one accent per mark.
 */
import React from "react";

export const GROUND = "#f2f2ed";
export const INK = "#15201e";
export const HUMAN = "#a65032";
export const MACHINE = "#3e6874";
export const VERIFIED = "#55745e";

const ARCHIVO = "var(--archivo), Arial, sans-serif";
const MONO = "var(--mono), monospace";

// x where "oppr" ends at fontSize 40 / Archivo 700 (tuned against a render)
const WEX = 92;
const WEX_MONO = 104; // same word set in JetBrains Mono
const PY = 35.5; // period centre, just above the baseline (y=40)

export type Iteration = {
  n: string;
  name: string;
  concept: string;
  delta: string;
  lockup: (dark: boolean) => React.ReactNode;
  mark: () => React.ReactNode;
  favicon: (dark: boolean, px: number) => React.ReactNode;
};

/* the wordmark itself, in the real font, so accents in the same viewBox align to it */
function Word({ dark, font = ARCHIVO }: { dark: boolean; font?: string }) {
  return (
    <text
      x={6}
      y={40}
      fontSize={40}
      fontWeight={700}
      letterSpacing={-1.5}
      style={{ fontFamily: font }}
      fill={dark ? GROUND : INK}
    >
      oppr
    </text>
  );
}

/* a vertically-split dot: left terracotta (human), right teal (machine) */
function SplitDot({ cx, cy, r, seam, gap = true }: { cx: number; cy: number; r: number; seam: string; gap?: boolean }) {
  return (
    <>
      <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`} fill={HUMAN} />
      <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} fill={MACHINE} />
      {gap && <rect x={cx - 0.5} y={cy - r} width={1} height={2 * r} fill={seam} />}
    </>
  );
}

/* three waveform bars centred on (cx,cy) */
function WaveBars({ cx, cy, unit, sw }: { cx: number; cy: number; unit: number; sw: number }) {
  const hs = [0.5, 0.95, 0.65];
  return (
    <>
      {hs.map((h, i) => {
        const x = cx + (i - 1) * unit;
        const half = (h * unit * 2.4) / 2;
        return <line key={i} x1={x} y1={cy - half} x2={x} y2={cy + half} stroke={HUMAN} strokeWidth={sw} strokeLinecap="round" />;
      })}
    </>
  );
}

const checkPath = (cx: number, cy: number, s: number) =>
  `M ${cx - 2.6 * s} ${cy} l ${1.9 * s} ${1.9 * s} l ${3.6 * s} ${-4.4 * s}`;

export const ITERATIONS: Iteration[] = [
  // 01 · Baseline ───────────────────────────────────────────────────────────
  {
    n: "01",
    name: "Baseline",
    concept: "Today's wordmark, formalised. The control.",
    delta: "Reference. Every other row is judged against this.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <circle cx={WEX + 6} cy={PY} r={4} fill={HUMAN} />
      </>
    ),
    mark: () => <circle cx={16} cy={16} r={5} fill={HUMAN} />,
    favicon: (dark, px) => <circle cx={16} cy={16} r={px <= 16 ? 6.5 : 5.5} fill={dark ? GROUND : HUMAN} />,
  },

  // 02 · Chip period ──────────────────────────────────────────────────────────
  {
    n: "02",
    name: "Chip period",
    concept: "The period becomes the films' terracotta context chip.",
    delta: "Square replaces circle; ties the logo to the film language.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <rect x={WEX + 1.5} y={PY - 5} width={10} height={10} rx={2.6} fill="none" stroke={HUMAN} strokeWidth={1.5} />
        <circle cx={WEX + 6.5} cy={PY} r={1.3} fill={HUMAN} />
      </>
    ),
    mark: () => (
      <>
        <rect x={7} y={7} width={18} height={18} rx={4.5} fill="none" stroke={HUMAN} strokeWidth={1.7} />
        <circle cx={16} cy={16} r={2.4} fill={HUMAN} />
      </>
    ),
    favicon: (dark, px) => {
      const sw = px <= 16 ? 2.8 : 2;
      return (
        <>
          <rect x={5} y={5} width={22} height={22} rx={5.5} fill="none" stroke={HUMAN} strokeWidth={sw} />
          <circle cx={16} cy={16} r={px <= 16 ? 3.4 : 2.9} fill={HUMAN} />
        </>
      );
    },
  },

  // 03 · Timeline node ────────────────────────────────────────────────────────
  {
    n: "03",
    name: "Timeline node",
    concept: "The period is a node ON the one timeline running through the mark.",
    delta: "The period gains context: it sits on the timeline.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <line x1={WEX - 2} y1={PY} x2={196} y2={PY} stroke={dark ? GROUND : INK} strokeWidth={1.5} />
        <circle cx={WEX + 34} cy={PY} r={4} fill={HUMAN} />
      </>
    ),
    mark: () => (
      <>
        <line x1={4} y1={16} x2={28} y2={16} stroke={INK} strokeWidth={1.6} />
        <line x1={9} y1={13} x2={9} y2={19} stroke={INK} strokeWidth={1} opacity={0.35} />
        <line x1={23} y1={13} x2={23} y2={19} stroke={INK} strokeWidth={1} opacity={0.35} />
        <circle cx={16} cy={16} r={3.6} fill={HUMAN} />
      </>
    ),
    favicon: (dark, px) => (
      <>
        <line x1={5} y1={16} x2={27} y2={16} stroke={dark ? GROUND : INK} strokeWidth={px <= 16 ? 2.4 : 1.8} />
        <circle cx={16} cy={16} r={px <= 16 ? 4.4 : 3.8} fill={HUMAN} />
      </>
    ),
  },

  // 04 · Two-voice dot ────────────────────────────────────────────────────────
  {
    n: "04",
    name: "Two-voice dot",
    concept: "The period splits: human context and machine data meeting in one point.",
    delta: "The only two-coloured accent. Knowingly bends the one-accent rule.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <SplitDot cx={WEX + 6} cy={PY} r={4.4} seam={dark ? INK : GROUND} />
      </>
    ),
    mark: () => <SplitDot cx={16} cy={16} r={7} seam={GROUND} />,
    favicon: (dark, px) => <SplitDot cx={16} cy={16} r={px <= 16 ? 8 : 7} seam={dark ? INK : GROUND} gap={px > 16} />,
  },

  // 05 · Waveform chip ────────────────────────────────────────────────────────
  {
    n: "05",
    name: "Waveform chip",
    concept: "A chip holding the spoken-on-the-floor waveform.",
    delta: "Same chip container as 02, voice glyph instead of a dot.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <rect x={WEX + 1} y={PY - 6} width={12} height={12} rx={2.8} fill="none" stroke={HUMAN} strokeWidth={1.4} />
        <WaveBars cx={WEX + 7} cy={PY} unit={2.1} sw={1.3} />
      </>
    ),
    mark: () => (
      <>
        <rect x={7} y={7} width={18} height={18} rx={4.5} fill="none" stroke={HUMAN} strokeWidth={1.6} />
        <WaveBars cx={16} cy={16} unit={3.2} sw={1.9} />
      </>
    ),
    favicon: (dark, px) =>
      px <= 16 ? (
        <WaveBars cx={16} cy={16} unit={5} sw={3} />
      ) : (
        <>
          <rect x={5} y={5} width={22} height={22} rx={5.5} fill="none" stroke={HUMAN} strokeWidth={1.9} />
          <WaveBars cx={16} cy={16} unit={4} sw={2.3} />
        </>
      ),
  },

  // 06 · App-icon monogram ────────────────────────────────────────────────────
  {
    n: "06",
    name: "App-icon monogram",
    concept: "A compact o. tile, the way it sits on a phone home screen.",
    delta: "The only filled-tile iteration; strongest tiny, heaviest on the page.",
    lockup: (dark) => {
      const tileFill = dark ? GROUND : INK;
      const letter = dark ? INK : GROUND;
      return (
        <>
          <rect x={4} y={9} width={34} height={34} rx={8} fill={tileFill} />
          <text x={20} y={35} textAnchor="middle" fontSize={23} fontWeight={700} style={{ fontFamily: ARCHIVO }} fill={letter}>
            o
          </text>
          <circle cx={31.5} cy={35} r={2.4} fill={HUMAN} />
          <text x={50} y={40} fontSize={40} fontWeight={700} letterSpacing={-1.5} style={{ fontFamily: ARCHIVO }} fill={dark ? GROUND : INK}>
            oppr
          </text>
        </>
      );
    },
    mark: () => (
      <>
        <rect x={1.5} y={1.5} width={29} height={29} rx={7} fill={INK} />
        <text x={15} y={22.5} textAnchor="middle" fontSize={19} fontWeight={700} style={{ fontFamily: ARCHIVO }} fill={GROUND}>
          o
        </text>
        <circle cx={24} cy={22} r={2.2} fill={HUMAN} />
      </>
    ),
    favicon: (_dark, px) => (
      <>
        <rect x={1} y={1} width={30} height={30} rx={px <= 16 ? 6 : 7} fill={INK} />
        <text x={15} y={23} textAnchor="middle" fontSize={20} fontWeight={700} style={{ fontFamily: ARCHIVO }} fill={GROUND}>
          o
        </text>
        <circle cx={24.5} cy={22} r={px <= 16 ? 2.8 : 2.3} fill={HUMAN} />
      </>
    ),
  },

  // 07 · Loop o ────────────────────────────────────────────────────────────────
  {
    n: "07",
    name: "Loop o",
    concept: "The o as an open loop with an arrowhead: capture, connect, execute, back again.",
    delta: "Motion/loop story; the most diagrammy of the ten, so watch black-box fit.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <circle cx={WEX + 6} cy={PY} r={4} fill={HUMAN} />
        <g transform="translate(150 26) scale(0.62)">{loopGlyph(dark)}</g>
      </>
    ),
    mark: () => <g transform="translate(16 16)">{loopGlyph(false)}</g>,
    favicon: (dark, px) => <g transform="translate(16 16)">{loopGlyph(dark, px <= 16)}</g>,
  },

  // 08 · Terminal wordmark ─────────────────────────────────────────────────────
  {
    n: "08",
    name: "Terminal wordmark",
    concept: "The operational, mono voice of the UI: oppr_ with a block cursor.",
    delta: "Typeface swap (Archivo → Mono) plus period → cursor.",
    lockup: (dark) => (
      <>
        <Word dark={dark} font={MONO} />
        <rect x={WEX_MONO + 3} y={18} width={7} height={22} fill={HUMAN} />
      </>
    ),
    mark: () => <rect x={10.5} y={6} width={11} height={20} rx={1} fill={HUMAN} />,
    favicon: (_dark, px) => <rect x={px <= 16 ? 8 : 9} y={5} width={px <= 16 ? 16 : 14} height={22} rx={2} fill={HUMAN} />,
  },

  // 09 · Verified period ───────────────────────────────────────────────────────
  {
    n: "09",
    name: "Verified period",
    concept: "The period is the verified-green check-circle the films end on.",
    delta: "Accent moves HUMAN → VERIFIED. The only green iteration.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        <circle cx={WEX + 7} cy={PY} r={5} fill="none" stroke={VERIFIED} strokeWidth={1.5} />
        <path d={checkPath(WEX + 7, PY, 1)} fill="none" stroke={VERIFIED} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    mark: () => (
      <>
        <circle cx={16} cy={16} r={9} fill="none" stroke={VERIFIED} strokeWidth={1.6} />
        <path d={checkPath(16, 16.5, 1.9)} fill="none" stroke={VERIFIED} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    favicon: (_dark, px) => (
      <>
        <circle cx={16} cy={16} r={px <= 16 ? 11 : 10} fill="none" stroke={VERIFIED} strokeWidth={px <= 16 ? 2.6 : 2} />
        <path d={checkPath(16, 16.6, px <= 16 ? 2.4 : 2.1)} fill="none" stroke={VERIFIED} strokeWidth={px <= 16 ? 2.8 : 2.3} strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },

  // 10 · Bridged pp ─────────────────────────────────────────────────────────────
  {
    n: "10",
    name: "Bridged pp",
    concept: "Office and floor connected: the two p stems joined by one crossbar.",
    delta: "The only iteration that touches the letterforms; most ownable if it works.",
    lockup: (dark) => (
      <>
        <Word dark={dark} />
        {/* crossbar linking the two p stems, just below the x-height */}
        <line x1={33} y1={30} x2={54} y2={30} stroke={HUMAN} strokeWidth={2.2} strokeLinecap="round" />
        <circle cx={WEX + 6} cy={PY} r={4} fill={HUMAN} />
      </>
    ),
    mark: () => (
      <>
        <rect x={9.5} y={7} width={2.6} height={19} rx={1.3} fill={INK} />
        <rect x={19.9} y={7} width={2.6} height={19} rx={1.3} fill={INK} />
        <circle cx={13.5} cy={14.5} r={3.4} fill="none" stroke={INK} strokeWidth={1.5} />
        <circle cx={23.9} cy={14.5} r={3.4} fill="none" stroke={INK} strokeWidth={1.5} />
        <line x1={10.8} y1={12} x2={21.2} y2={12} stroke={HUMAN} strokeWidth={2} strokeLinecap="round" />
      </>
    ),
    favicon: (dark, px) => {
      const stem = dark ? GROUND : INK;
      const w = px <= 16 ? 3.4 : 2.8;
      return (
        <>
          <rect x={7} y={5} width={w} height={22} rx={1.4} fill={stem} />
          <rect x={22 - w} y={5} width={w} height={22} rx={1.4} fill={stem} />
          <rect x={8} y={11.5} width={16 - 2} height={px <= 16 ? 3.4 : 2.8} rx={1.4} fill={HUMAN} />
        </>
      );
    },
  },
];

/* ── Selected direction ──────────────────────────────────────────────────────
 * Baseline wordmark (oppr. with the orange period) as the logo, paired with an
 * o-monogram icon: the first letter of "oppr" carrying the same orange dot.
 * The icon comes in two forms — a filled app-icon tile (primary) and a bare
 * o. for transparent / in-line use. */

export const selectedLockup = (dark: boolean): React.ReactNode => (
  <>
    <Word dark={dark} />
    <circle cx={WEX + 6} cy={PY} r={4} fill={HUMAN} />
  </>
);

/* filled app-icon tile: INK ground, Archivo o, orange dot at its foot */
export const monogramTile = (px: number): React.ReactNode => {
  const big = px > 16;
  return (
    <>
      <rect x={1} y={1} width={30} height={30} rx={big ? 7 : 6} fill={INK} />
      <text x={13} y={23} textAnchor="middle" fontSize={22} fontWeight={700} style={{ fontFamily: ARCHIVO }} fill={GROUND}>
        o
      </text>
      <circle cx={23.5} cy={21.5} r={px <= 16 ? 3.6 : 3.1} fill={HUMAN} />
    </>
  );
};

/* bare o. — no tile; the o takes the fore/background colour */
export const monogramBare = (dark: boolean, px: number): React.ReactNode => (
  <>
    <text x={13} y={25.5} textAnchor="middle" fontSize={28} fontWeight={700} style={{ fontFamily: ARCHIVO }} fill={dark ? GROUND : INK}>
      o
    </text>
    <circle cx={25} cy={23.5} r={px <= 16 ? 4 : 3.4} fill={HUMAN} />
  </>
);

/* an iteration wrapper so the Selected block can reuse the comparison cells */
export const SELECTED: Iteration = {
  n: "★",
  name: "Selected",
  concept: "Baseline wordmark, o-monogram icon.",
  delta: "Lockup 01 + icon from 06's monogram, carrying the orange dot.",
  lockup: selectedLockup,
  mark: () => monogramTile(64),
  favicon: (_dark, px) => monogramTile(px),
};

/* an open loop with an arrowhead + a human start-dot, centred on (0,0) */
function loopGlyph(dark: boolean, tiny = false) {
  const r = 9;
  const stroke = dark ? GROUND : INK;
  // arc from ~35° sweeping clockwise, leaving a gap at the top-right
  const a0 = (35 * Math.PI) / 180;
  const a1 = (330 * Math.PI) / 180;
  const p0 = [r * Math.cos(a0), r * Math.sin(a0)];
  const p1 = [r * Math.cos(a1), r * Math.sin(a1)];
  return (
    <>
      <path
        d={`M ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A ${r} ${r} 0 1 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`}
        fill="none"
        stroke={stroke}
        strokeWidth={tiny ? 2.4 : 1.7}
        strokeLinecap="round"
      />
      {/* arrowhead near the loop's end (top), or a squared end when tiny */}
      {tiny ? (
        <rect x={p1[0] - 1.6} y={p1[1] - 1.6} width={3.2} height={3.2} fill={stroke} />
      ) : (
        <path
          d={`M ${(p1[0] - 3.4).toFixed(2)} ${(p1[1] - 1.6).toFixed(2)} L ${p1[0].toFixed(2)} ${p1[1].toFixed(2)} L ${(p1[0] - 0.6).toFixed(2)} ${(p1[1] - 4).toFixed(2)}`}
          fill="none"
          stroke={stroke}
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle cx={p0[0]} cy={p0[1]} r={tiny ? 3 : 2.4} fill={HUMAN} />
    </>
  );
}
