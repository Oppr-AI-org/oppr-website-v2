/*
 * Film 4c — connect-timeline-v3-bb  (blackbox re-cut of connect-timeline-v2)
 *
 * "bb" = blackboxifying: human context and machine data still assemble onto one
 * timeline (the positioning idea, kept), but the analysis beat is cut — NO
 * selection box, NO breathing correlation rings, NO "CORRELATION DETECTED /
 * GENERATING INSIGHT" narration. Only the OUTCOME is shown: the film ends on the
 * assembled timeline + a ✓ VERIFIED RESULT. Two worlds, one picture, not "watch
 * our engine find it" (IMPLEMENTATION.md §5). The v2 composition is untouched.
 */
import React from "react";
import { interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, typed } from "../lib/anim";

const mono = { fontFamily: MONO } as const;

// operator input chips (48×48) with glyph + connector to the line
const InputChip: React.FC<{ x: number; start: number; glyph: "check" | "photo" | "voice"; frame: number; fps: number }> = ({
  x,
  start,
  glyph,
  frame,
  fps,
}) => {
  const conn = ease(frame, start, 12);
  const s = pop(frame, fps, start + 6);
  return (
    <g>
      <line x1={x} y1={118} x2={x} y2={118 + 85 * conn} stroke={HUMAN} strokeWidth={1.2} />
      <circle cx={x} cy={210} r={5} fill={HUMAN} opacity={easeOut(frame, start + 8, 8)} />
      <g opacity={s} transform={`scale(${0.85 + 0.15 * s})`} style={{ transformOrigin: `${x}px 94px` }}>
        <rect x={x - 24} y={70} width={48} height={48} rx={10} fill="none" stroke={HUMAN} strokeWidth={1.5} />
        {glyph === "check" && (
          <path d={`M${x - 11} 95 l8 8 l14 -15`} fill="none" stroke={HUMAN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        )}
        {glyph === "photo" && (
          <>
            <rect x={x - 14} y={87} width={28} height={20} rx={3} fill="none" stroke={HUMAN} strokeWidth={1.5} />
            <path d={`M${x - 6} 87 l3 -5 h6 l3 5`} fill="none" stroke={HUMAN} strokeWidth={1.5} strokeLinejoin="round" />
            <circle cx={x} cy={97} r={5.5} fill="none" stroke={HUMAN} strokeWidth={1.5} />
          </>
        )}
        {glyph === "voice" &&
          ([[-14, 8], [-8, 16], [-2, 26], [4, 14], [10, 20], [16, 9]] as Array<[number, number]>).map(([dx, h]) => (
            <line key={dx} x1={x + dx} y1={94 - h / 2} x2={x + dx} y2={94 + h / 2} stroke={HUMAN} strokeWidth={3} strokeLinecap="round" />
          ))}
      </g>
    </g>
  );
};

// machine value tag below the line
const MachineTag: React.FC<{ x: number; w: number; label: string; start: number; frame: number; fps: number }> = ({
  x,
  w,
  label,
  start,
  frame,
  fps,
}) => {
  const sq = pop(frame, fps, start);
  const conn = ease(frame, start + 4, 12);
  const box = easeOut(frame, start + 12, 14);
  return (
    <g>
      <rect x={x - 4} y={206} width={8} height={8} fill={MACHINE} opacity={sq} />
      <line x1={x} y1={218} x2={x} y2={218 + 64 * conn} stroke={MACHINE} strokeWidth={1.2} />
      <rect x={x - w / 2} y={282} width={w} height={30} rx={6} fill="none" stroke={MACHINE} strokeWidth={1.5} {...draw(box)} />
      <text x={x} y={302} textAnchor="middle" fill={MACHINE} fontSize={13} style={mono} opacity={box}>
        {label}
      </text>
    </g>
  );
};

// filled hard-hat operator silhouette (no detail) — fronts the operator label
const OperatorGlyph: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={HUMAN}>
    <path d="M-5 -5 A5 5.5 0 0 1 5 -5 Z" /> {/* hard-hat dome */}
    <rect x={-7.5} y={-5.4} width={15} height={2.4} rx={1.2} /> {/* brim */}
    <circle cx={0} cy={-0.8} r={3.4} /> {/* head */}
    <path d="M-7.5 9 Q-7.5 2.4 0 2.4 Q7.5 2.4 7.5 9 Z" /> {/* shoulders */}
  </g>
);

// small filled machine — fronts the machine label
const MachineGlyph: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={MACHINE}>
    <rect x={-2.6} y={-9} width={5.2} height={6} rx={0.8} /> {/* spindle head */}
    <rect x={-6.5} y={-3.5} width={13} height={8.5} rx={1} /> {/* body */}
    <rect x={-8} y={5} width={16} height={3} rx={0.6} /> {/* base plinth */}
  </g>
);

// time indicator drawn at the left origin of the axis
const TimeIndicator: React.FC<{ p: number }> = ({ p }) => {
  const cx = 48;
  const cy = 168;
  return (
    <g opacity={p}>
      <circle cx={cx} cy={cy} r={13} fill={GROUND} stroke={INK} strokeWidth={1.6} {...draw(p)} />
      {/* hands */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 8} stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={p} />
      <line x1={cx} y1={cy} x2={cx + 6} y2={cy + 2} stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={p} />
      {/* start time below the clock, above the axis origin */}
      <text x={cx} y={cy + 32} textAnchor="middle" fill={INK} opacity={0.6 * p} fontSize={13} letterSpacing="0.06em" style={mono}>
        14:00
      </text>
    </g>
  );
};

// operator chips + machine tags, strictly one-at-a-time along the axis
const POINTS: Array<
  | { kind: "op"; x: number; glyph: "check" | "photo" | "voice"; start: number }
  | { kind: "mc"; x: number; w: number; label: string; start: number }
> = [
  { kind: "op", x: 170, glyph: "check", start: 34 },
  { kind: "mc", x: 250, w: 64, label: "62 °C", start: 60 },
  { kind: "op", x: 400, glyph: "photo", start: 86 },
  { kind: "mc", x: 480, w: 74, label: "2.4 bar", start: 112 },
  { kind: "op", x: 630, glyph: "voice", start: 138 },
  { kind: "mc", x: 710, w: 94, label: "1450 RPM", start: 164 },
];

// Only the OUTCOME is shown — the analysis that produces it stays black-boxed.
// The old "CORRELATION DETECTED / GENERATING INSIGHT" beat, the selection box
// and the breathing correlation rings (the engine at work) are gone; the film
// ends on the assembled timeline + a verified result.
const STATUS: Array<{ label: string; color: string; start: number; dim?: boolean }> = [
  { label: "VERIFIED RESULT", color: VERIFIED, start: 262 },
];
const STATUS_CHECK_X = 460;
const STATUS_TEXT_X = 482;
const STATUS_Y0 = 340;
const STATUS_DY = 29;

export const ConnectTimelineV3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: hold close (1.12), pull back to 0.90 after the points have landed
  const scale = interpolate(frame, [0, 190, 250], [1.12, 1.12, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const clock = ease(frame, 8, 18);

  return (
    <Film viewW={960} viewH={420}>
      <g transform={`scale(${scale})`} style={{ transformOrigin: "480px 210px" }}>
        {/* one continuous time axis — draws L→R, arrowhead present from frame 0 */}
        <line x1={30} y1={210} x2={900} y2={210} stroke={INK} strokeWidth={1.5} {...draw(ease(frame, 0, 22))} />
        <path
          d="M894 203 L908 210 L894 217"
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={easeOut(frame, 0, 8)}
        />
        {/* time-axis graduations (not data dots) */}
        {[78, 126, 222, 318, 366, 462, 558, 606, 702, 750, 798].map((x, i) => (
          <line key={x} x1={x} y1={206} x2={x} y2={214} stroke={INK} strokeWidth={1} opacity={0.22 * easeOut(frame, 6 + i * 2, 10)} />
        ))}

        {/* contexts arriving — strictly sequential, each wired to a callout */}
        {POINTS.map((p) =>
          p.kind === "op" ? (
            <InputChip key={`op-${p.x}`} x={p.x} start={p.start} glyph={p.glyph} frame={frame} fps={fps} />
          ) : (
            <MachineTag key={`mc-${p.x}`} x={p.x} w={p.w} label={p.label} start={p.start} frame={frame} fps={fps} />
          )
        )}

      </g>

      {/* ── fixed overlay: never cropped by the camera zoom ─────────────── */}

      {/* time indicator at the left origin */}
      <TimeIndicator p={clock} />

      {/* row headers with filled glyphs */}
      <g opacity={easeOut(frame, 18, 12)}>
        <OperatorGlyph x={28} y={42} s={1.2} />
        <text x={48} y={47} fill={HUMAN} fontSize={14} letterSpacing="0.1em" fontWeight={700} style={mono}>
          OPERATOR CONTEXT
        </text>
        <MachineGlyph x={28} y={386} s={1.2} />
        <text x={48} y={391} fill={MACHINE} fontSize={14} letterSpacing="0.1em" fontWeight={700} style={mono}>
          MACHINE DATA
        </text>
      </g>

      {/* status — only the verified outcome, centred where the box used to sit */}
      {STATUS.map((r, i) => {
        const reveal = easeOut(frame, r.start, 10);
        if (reveal <= 0) return null;
        const ry = STATUS_Y0 + i * STATUS_DY;
        const chk = pop(frame, fps, r.start + 15);
        return (
          <g key={r.label}>
            <text
              x={STATUS_TEXT_X}
              y={ry + 5}
              fill={r.color}
              fontSize={15}
              letterSpacing="0.12em"
              fontWeight={700}
              style={mono}
              opacity={r.dim ? 0.75 : 1}
            >
              {typed(r.label, frame, r.start)}
            </text>
            <g opacity={chk} transform={`scale(${0.8 + 0.2 * chk})`} style={{ transformOrigin: `${STATUS_CHECK_X}px ${ry}px` }}>
              <circle cx={STATUS_CHECK_X} cy={ry} r={7.5} fill={GROUND} stroke={r.color} strokeWidth={1.7} />
              <path
                d={`M${STATUS_CHECK_X - 3.6} ${ry} l2.8 2.8 l5.4 -6.4`}
                fill="none"
                stroke={r.color}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        );
      })}
    </Film>
  );
};
