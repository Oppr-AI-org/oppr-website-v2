/*
 * Film 1 — capture-speak (SCRIPTS.md §2)
 * Open zoomed on an operator speaking into his phone; pull back until he is
 * small and the speech bubble fills the frame; Oppr hears four facts.
 *
 * Uses the shared <Operator pose="speak"> figure. The bubble outline is
 * revealed with a left→right clip-wipe (a dashed-stroke draw leaves a
 * permanent gap on this closed tail-path, so it is never fully closed).
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MONO } from "../brand";
import { Film, ease, easeOut, pop, typed } from "../lib/anim";
import { Operator } from "../lib/Operator";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

// message reflowed to two lines; highlighted phrases never share a line-edge
const X0 = 30;
const CW = 7.2; // JetBrains Mono advance at 12px
const FSIZE = 12;
const LINES = [
  { text: "Pump P6 ran rough on Line 3", y: 74 },
  { text: "yesterday. The bearing may need changing.", y: 104 },
];
const LINE_STARTS = [112, 138];

// highlighted words: {line index, start char, length}
const HL = [
  { id: "hlPump", line: 0, s: 0, len: 7 }, // Pump P6
  { id: "hlLine", line: 0, s: 21, len: 6 }, // Line 3
  { id: "hlYest", line: 1, s: 0, len: 9 }, // yesterday
  { id: "hlBear", line: 1, s: 15, len: 7 }, // bearing
];

const CHIPS = [
  { x: 14, y: 208, label: "EQUIPMENT", value: "PUMP P6" },
  { x: 186, y: 208, label: "LOCATION", value: "LINE 3" },
  { x: 14, y: 270, label: "COMPONENT", value: "BEARING" },
  { x: 186, y: 270, label: "TIME", value: "YESTERDAY" },
];

// operator placement (his phone lands near the bubble tail)
const OP = { x: 34, y: 158, s: 0.52 };
const FX = 60; // camera focus — operator's phone
const FY = 196;

const BUBBLE_D =
  "M36 16 H324 a16 16 0 0 1 16 16 V124 a16 16 0 0 1 -16 16 H92 L56 190 L60 140 H36 a16 16 0 0 1 -16 -16 V32 a16 16 0 0 1 16 -16 Z";

// live waveform drawn inside the operator's phone screen while he speaks
const PhoneWave: React.FC<{ frame: number; talk: number }> = ({ frame, talk }) => (
  <>
    {[-4.5, 0, 4.5].map((x, i) => {
      const base = [4, 7.5, 5][i];
      const pulse = 1 + 0.5 * Math.sin(frame / 3 + i * 1.2) * talk;
      const h = base * pulse;
      return (
        <line
          key={x}
          x1={x}
          y1={-h}
          x2={x}
          y2={h}
          stroke={HUMAN}
          strokeWidth={1.8}
          strokeLinecap="round"
          {...nss}
        />
      );
    })}
  </>
);

export const CaptureSpeak: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: hold zoomed on the operator's phone, then pull back to the scene
  const S = interpolate(frame, [0, 50, 112], [3.2, 3.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cx = interpolate(frame, [50, 112], [180, FX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = interpolate(frame, [50, 112], [160, FY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cam = `translate(${cx} ${cy}) scale(${S}) translate(${-FX} ${-FY})`;

  // waveform envelope: full while speaking, settles as the message completes
  const talk = 1 - ease(frame, 150, 30);

  // bubble outline wipes on left→right (always closes fully)
  const bubbleReveal = ease(frame, 88, 34);

  // operator fades out once the data is extracting, clearing room for chips
  const opOpacity = 1 - easeOut(frame, 204, 20);

  // typing caret follows the character being written
  const caret = (() => {
    if (frame < LINE_STARTS[0] || frame > 176) return null;
    for (let i = 0; i < LINES.length; i++) {
      if (frame < LINE_STARTS[i]) return null;
      const len = Math.floor((frame - LINE_STARTS[i]) * 1.2);
      if (len < LINES[i].text.length) return { x: X0 + len * CW, y: LINES[i].y };
    }
    return { x: X0 + LINES[1].text.length * CW, y: LINES[1].y };
  })();

  return (
    <Film viewW={360} viewH={320}>
      <g transform={cam}>
        {/* speech bubble outline — revealed by a left→right clip-wipe */}
        {bubbleReveal > 0 && (
          <>
            <clipPath id="bubbleWipe">
              <rect x={14} y={6} width={336 * bubbleReveal} height={194} />
            </clipPath>
            <g clipPath="url(#bubbleWipe)">
              <path d={BUBBLE_D} fill="none" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" {...nss} />
            </g>
          </>
        )}

        {/* the message types on (two lines) */}
        {LINES.map(({ text, y }, i) => (
          <text key={y} x={X0} y={y} fill={INK} fontSize={FSIZE} style={mono}>
            {typed(text, frame, LINE_STARTS[i])}
          </text>
        ))}
        {caret && frame % 10 < 6 && (
          <rect x={caret.x + 1} y={caret.y - 9} width={6} height={12} fill={INK} opacity={0.55} />
        )}

        {/* highlight the key phrases: an orange marker sweeps each word,
            revealing white text — boxes are spaced so none overlap */}
        {HL.map((h, i) => {
          const p = easeOut(frame, 176 + i * 10, 12);
          if (p <= 0) return null;
          const line = LINES[h.line];
          const bx = X0 + h.s * CW - 2.5;
          const bw = h.len * CW + 5;
          const by = line.y - 11;
          const bh = 15.5;
          return (
            <g key={h.id}>
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

        {(() => {
          const p = easeOut(frame, 216, 12);
          return (
            <text
              x={180}
              y={188}
              textAnchor="middle"
              fill={INK}
              opacity={0.55 * p}
              transform={`translate(0 ${4 * (1 - p)})`}
              fontSize={9}
              letterSpacing="0.12em"
              fontWeight={700}
              style={mono}
            >
              EXTRACTED AS DATA POINTS
            </text>
          );
        })()}

        {/* the four points spring up */}
        {CHIPS.map(({ x, y, label, value }, i) => {
          const s = pop(frame, fps, 226 + i * 14);
          if (s <= 0) return null;
          return (
            <g key={label} opacity={s} transform={`translate(0 ${10 * (1 - s)})`}>
              <text x={x + 2} y={y - 6} fill={INK} opacity={0.5} fontSize={9} letterSpacing="0.1em" style={mono}>
                {label}
              </text>
              <rect x={x} y={y} width={160} height={32} rx={8} fill="none" stroke={HUMAN} strokeWidth={1.5} />
              <text x={x + 80} y={y + 21} textAnchor="middle" fill={HUMAN} fontSize={12} style={mono}>
                {value}
              </text>
            </g>
          );
        })}

        {/* the operator — large under the zoom, small once pulled back */}
        {opOpacity > 0 && (
          <g transform={`translate(${OP.x} ${OP.y}) scale(${OP.s})`}>
            <Operator
              pose="speak"
              id="speak-op"
              opacity={opOpacity}
              screen={<PhoneWave frame={frame} talk={talk} />}
            />
          </g>
        )}
      </g>
    </Film>
  );
};
