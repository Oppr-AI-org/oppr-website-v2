/*
 * Film 1b — capture-speak-v2  (a kept-separate upgrade of capture-speak)
 *
 * No operator: it opens on a small phone that is CAPTURING (an animated orange
 * waveform), a real speech box (integrated tail — the bottom edge breaks open
 * into the tail, no line running through it) points straight at the phone, the
 * message types on, the key phrases cascade, and the four data points land in a
 * timestamped SPREADSHEET + a ✓ VALID stamp (mirroring capture-photo-v2).
 *
 * The original `capture-speak` composition is left untouched.
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
  { id: "hlPump", line: 0, s: 0, len: 7 }, // Pump P6
  { id: "hlLine", line: 0, s: 21, len: 6 }, // Line 3
  { id: "hlYest", line: 1, s: 0, len: 9 }, // yesterday
  { id: "hlBear", line: 1, s: 15, len: 7 }, // bearing
];
const HL_START = 112;
const HL_STAGGER = 12;

// a real speech box: rounded rect whose bottom edge BREAKS OPEN into the tail
// (tail mouth between x=100 and x=74, tip at 58,150 — pointing at the phone)
const BUBBLE_D =
  "M32 12 H328 a14 14 0 0 1 14 14 V102 a14 14 0 0 1 -14 14 H100 L58 150 L74 116 H32 a14 14 0 0 1 -14 -14 V26 a14 14 0 0 1 14 -14 Z";

const SHEET = [
  { field: "EQUIPMENT", value: "PUMP P6" },
  { field: "LOCATION", value: "LINE 3" },
  { field: "COMPONENT", value: "BEARING" },
  { field: "TIME", value: "YESTERDAY" },
];

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

export const CaptureSpeakV2: React.FC = () => {
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

  // spreadsheet geometry
  const TX = 28;
  const TW = 304;
  const TY = 150;
  const HH = 16;
  const RH = 18;
  const COL1 = 148;
  const COL2 = 250;
  const sheet = easeOut(frame, 166, 14);
  const valid = pop(frame, fps, 236);
  const validPulseP = easeOut(frame, 246, 30);
  const validPulseO = frame >= 246 ? 0.5 * (1 - win(frame, 246, 30)) : 0;

  return (
    <Film viewW={360} viewH={320}>
      {/* speech box outline (integrated tail) — left→right clip-wipe */}
      {bubbleReveal > 0 && (
        <>
          <clipPath id="bwipe">
            <rect x={14} y={8} width={334 * bubbleReveal} height={148} />
          </clipPath>
          <g clipPath="url(#bwipe)">
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

      {/* label */}
      {(() => {
        const p = easeOut(frame, 154, 12);
        if (p <= 0) return null;
        return (
          <text x={180} y={138} textAnchor="middle" fill={INK} opacity={0.55 * p} transform={`translate(0 ${4 * (1 - p)})`} fontSize={9} letterSpacing="0.12em" fontWeight={700} style={mono}>
            EXTRACTED AS DATA POINTS
          </text>
        );
      })()}

      {/* ── database spreadsheet: FIELD | VALUE | LOGGED ── */}
      {sheet > 0 && (
        <g opacity={sheet}>
          {[0, 2].map((r) => (
            <rect key={r} x={TX} y={TY + HH + r * RH} width={TW} height={RH} fill={INK} opacity={0.035} />
          ))}
          <rect x={TX} y={TY} width={TW} height={HH} fill={INK} opacity={0.05} />
          <rect x={TX} y={TY} width={TW} height={HH + 4 * RH} fill="none" stroke={INK} strokeWidth={1} opacity={0.22} />
          <line x1={TX} y1={TY + HH} x2={TX + TW} y2={TY + HH} stroke={INK} strokeWidth={1} opacity={0.22} />
          {[1, 2, 3].map((r) => (
            <line key={r} x1={TX} y1={TY + HH + r * RH} x2={TX + TW} y2={TY + HH + r * RH} stroke={INK} strokeWidth={1} opacity={0.12} />
          ))}
          <line x1={COL1} y1={TY} x2={COL1} y2={TY + HH + 4 * RH} stroke={INK} strokeWidth={1} opacity={0.18} />
          <line x1={COL2} y1={TY} x2={COL2} y2={TY + HH + 4 * RH} stroke={INK} strokeWidth={1} opacity={0.18} />

          <g style={mono} fontSize={8} letterSpacing="0.08em" fill={INK} opacity={0.5} fontWeight={700}>
            <text x={TX + 10} y={TY + 11}>FIELD</text>
            <text x={COL2 - 8} y={TY + 11} textAnchor="end">VALUE</text>
            <text x={COL2 + 8} y={TY + 11}>LOGGED</text>
          </g>

          {SHEET.map(({ field, value }, i) => {
            const ry = TY + HH + i * RH;
            const rp = easeOut(frame, 178 + i * 12, 14);
            if (rp <= 0) return null;
            const by = ry + 13;
            return (
              <g key={field} opacity={rp} transform={`translate(${-10 * (1 - rp)} 0)`} style={mono} fontSize={10.5}>
                <text x={TX + 10} y={by} fill={INK} opacity={0.8}>
                  {field}
                </text>
                <text x={COL2 - 8} y={by} textAnchor="end" fill={HUMAN}>
                  {value}
                </text>
                <text x={COL2 + 8} y={by} fill={INK} opacity={0.55}>
                  {TS}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* ✓ VALID */}
      {valid > 0 && (
        <g opacity={Math.min(1, valid)} transform={`translate(0 ${8 * (1 - valid)})`}>
          <circle cx={96} cy={286} r={10} fill={GROUND} stroke={VERIFIED} strokeWidth={1.8} />
          <path d="M91 286 l3.5 3.5 l7 -8" fill="none" stroke={VERIFIED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <text x={114} y={290} fill={VERIFIED} fontSize={12} letterSpacing="0.14em" fontWeight={700} style={mono}>
            VALID
          </text>
          <text x={192} y={290} fill={INK} opacity={0.45} fontSize={9} style={mono}>
            {DATE} {TS}
          </text>
          {validPulseO > 0 && <circle cx={96} cy={286} r={10 + 12 * validPulseP} fill="none" stroke={VERIFIED} strokeWidth={1.2} opacity={validPulseO} />}
        </g>
      )}

      {/* the capture phone — the tail points here; fades before the sheet */}
      <CapturePhone frame={frame} energy={energy} opacity={phoneOpacity} />
    </Film>
  );
};
