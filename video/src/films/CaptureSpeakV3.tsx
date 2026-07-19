/*
 * Film 1c — capture-speak-v3-bb  (blackbox re-cut of capture-speak-v2)
 *
 * "bb" = blackboxifying: same opening as v2 (phone capturing, speech box wipes
 * on, message types, key phrases cascade) but the extraction pipeline is cut —
 * NO timestamped FIELD | VALUE | LOGGED spreadsheet, NO "EXTRACTED AS DATA
 * POINTS" label. The lit sentence holds and the note resolves to a ✓ CAPTURED
 * stamp. We show the note landing, not how it is structured (IMPLEMENTATION.md
 * §5). The v2 composition is left untouched so we can always revert.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MONO, VERIFIED } from "../brand";
import { Film, ease, easeOut, pop, typed, win } from "../lib/anim";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

const TS = "14:23:07";
const DATE = "2026-07-18";

// message + highlighted phrases (spaced so no two boxes touch)
const X0 = 32;
const CW = 7.2;
const FSIZE = 12;
const LINES = [
  { text: "Pump P6 ran rough on Line 3", y: 64 },
  { text: "yesterday. The bearing may need changing.", y: 90 },
];
const LINE_STARTS = [44, 72];
const HL = [
  { id: "hlPump3", line: 0, s: 0, len: 7 }, // Pump P6
  { id: "hlLine3", line: 0, s: 21, len: 6 }, // Line 3
  { id: "hlYest3", line: 1, s: 0, len: 9 }, // yesterday
  { id: "hlBear3", line: 1, s: 15, len: 7 }, // bearing
];
const HL_START = 112;
const HL_STAGGER = 12;

// a real speech box: rounded rect whose bottom edge BREAKS OPEN into the tail
// (tail mouth between x=100 and x=74, tip at 58,150 — pointing at the phone)
const BUBBLE_D =
  "M32 12 H328 a14 14 0 0 1 14 14 V102 a14 14 0 0 1 -14 14 H100 L58 150 L74 116 H32 a14 14 0 0 1 -14 -14 V26 a14 14 0 0 1 14 -14 Z";

// animated orange waveform bars (the act of capturing / speaking)
const WaveBars: React.FC<{
  frame: number;
  energy: number;
  cx: number;
  cy: number;
  n: number;
  gap: number;
  maxH: number;
  sw: number;
}> = ({ frame, energy, cx, cy, n, gap, maxH, sw }) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const seed = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.9 + 0.6));
      const pulse = 0.5 + 0.5 * Math.sin(frame / 3.4 + i * 0.85);
      const h = Math.max(1.1, maxH * seed * (0.3 + 0.7 * pulse) * (0.25 + 0.75 * energy));
      const x = cx + (i - (n - 1) / 2) * gap;
      return <line key={i} x1={x} y1={cy - h} x2={x} y2={cy + h} stroke={HUMAN} strokeWidth={sw} strokeLinecap="round" {...nss} />;
    })}
  </>
);

// standalone capture phone (no operator) — the tail points here
const CapturePhone: React.FC<{ frame: number; energy: number; opacity: number }> = ({ frame, energy, opacity }) => {
  if (opacity <= 0) return null;
  const rec = 0.4 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 4));
  return (
    <g opacity={opacity} transform="translate(58 170)">
      <rect x={-16} y={-30} width={32} height={60} rx={6} fill={GROUND} stroke={INK} strokeWidth={1.6} {...nss} />
      <rect x={-12} y={-22} width={24} height={40} rx={3} fill="none" stroke={INK} strokeWidth={1} opacity={0.3} {...nss} />
      <circle cx={0} cy={-26} r={1} fill={INK} opacity={0.5} />
      <WaveBars frame={frame} energy={energy} cx={0} cy={-2} n={5} gap={4} maxH={9} sw={1.8} />
      <circle cx={0} cy={22} r={2} fill={HUMAN} opacity={opacity * rec} />
    </g>
  );
};

export const CaptureSpeakV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const energy = 1 - ease(frame, 96, 30); // capture envelope
  const bubbleReveal = ease(frame, 12, 30); // outline clip-wipe
  const phoneOpacity = 1 - easeOut(frame, 144, 20); // phone + tail fade

  // typing caret
  const caret = (() => {
    if (frame < LINE_STARTS[0] || frame > 112) return null;
    for (let i = 0; i < LINES.length; i++) {
      if (frame < LINE_STARTS[i]) return null;
      const len = Math.floor((frame - LINE_STARTS[i]) * 1.2);
      if (len < LINES[i].text.length) return { x: X0 + len * CW, y: LINES[i].y };
    }
    return { x: X0 + LINES[1].text.length * CW, y: LINES[1].y };
  })();

  // The note is CAPTURED — the structuring into a timestamped data table is
  // removed so the film shows the note landing and being captured, not the
  // extraction pipeline. The lit sentence holds as the payoff.
  const valid = pop(frame, fps, 210);
  const validPulseP = easeOut(frame, 220, 30);
  const validPulseO = frame >= 220 ? 0.5 * (1 - win(frame, 220, 30)) : 0;

  return (
    <Film viewW={360} viewH={320}>
      {/* speech box outline (integrated tail) — left→right clip-wipe */}
      {bubbleReveal > 0 && (
        <>
          <clipPath id="bwipe3">
            <rect x={14} y={8} width={334 * bubbleReveal} height={148} />
          </clipPath>
          <g clipPath="url(#bwipe3)">
            <path d={BUBBLE_D} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" {...nss} />
          </g>
        </>
      )}

      {/* bubble header waveform — animates while capturing */}
      {bubbleReveal > 0.2 && (
        <g opacity={Math.min(1, bubbleReveal * 1.6)}>
          <WaveBars frame={frame} energy={energy} cx={52} cy={38} n={7} gap={7} maxH={11} sw={2.6} />
        </g>
      )}

      {/* the message types on */}
      {LINES.map(({ text, y }, i) => (
        <text key={y} x={X0} y={y} fill={INK} fontSize={FSIZE} style={mono}>
          {typed(text, frame, LINE_STARTS[i])}
        </text>
      ))}
      {caret && frame % 10 < 6 && <rect x={caret.x + 1} y={caret.y - 9} width={6} height={12} fill={INK} opacity={0.55} />}

      {/* key phrases cascade — orange marker sweep, white text */}
      {HL.map((h, i) => {
        const p = easeOut(frame, HL_START + i * HL_STAGGER, 14);
        if (p <= 0) return null;
        const line = LINES[h.line];
        const bx = X0 + h.s * CW - 2.5;
        const bw = h.len * CW + 5;
        const by = line.y - 11;
        const bh = 15.5;
        return (
          <g key={h.id} transform={`translate(0 ${-2 * (1 - p)})`}>
            <clipPath id={h.id}>
              <rect x={bx} y={by} width={bw * p} height={bh} rx={4} />
            </clipPath>
            <rect x={bx} y={by} width={bw * p} height={bh} rx={4} fill={HUMAN} />
            <g clipPath={`url(#${h.id})`}>
              <text x={X0} y={line.y} fill={GROUND} fontSize={FSIZE} style={mono}>
                {line.text}
              </text>
            </g>
          </g>
        );
      })}

      {/* ✓ CAPTURED — the note is in; the structuring stays out of frame */}
      {valid > 0 && (
        <g opacity={Math.min(1, valid)} transform={`translate(0 ${8 * (1 - valid)})`}>
          <circle cx={96} cy={200} r={10} fill={GROUND} stroke={VERIFIED} strokeWidth={1.8} />
          <path d="M91 200 l3.5 3.5 l7 -8" fill="none" stroke={VERIFIED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <text x={114} y={204} fill={VERIFIED} fontSize={12} letterSpacing="0.14em" fontWeight={700} style={mono}>
            CAPTURED
          </text>
          <text x={214} y={204} fill={INK} opacity={0.45} fontSize={9} style={mono}>
            {DATE} {TS}
          </text>
          {validPulseO > 0 && <circle cx={96} cy={200} r={10 + 12 * validPulseP} fill="none" stroke={VERIFIED} strokeWidth={1.2} opacity={validPulseO} />}
        </g>
      )}

      {/* the capture phone — the tail points here; fades before the stamp */}
      <CapturePhone frame={frame} energy={energy} opacity={phoneOpacity} />
    </Film>
  );
};
