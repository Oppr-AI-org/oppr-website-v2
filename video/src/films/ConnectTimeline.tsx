/*
 * Film 4 — connect-timeline (SCRIPTS.md §5)
 * Human context + machine data land on one timeline; the camera pulls back;
 * a pattern is found, an insight generated, the result verified.
 *
 * This is the one film with camera movement (a wrapper-group zoom).
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

const HISTORY_H = [90, 315, 545, 762, 838];
const HISTORY_M = [130, 352, 598, 815];
const RINGS: Array<[number, number, number]> = [
  [400, 210, 10],
  [545, 210, 10],
  [630, 210, 10],
  [480, 210, 10],
  [598, 210, 10],
];

export const ConnectTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: start close (1.12), pull back to 0.90 over f130–190
  const scale = interpolate(frame, [0, 130, 190], [1.12, 1.12, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const cluster = easeOut(frame, 195, 26);
  const insightLine = ease(frame, 268, 30);

  return (
    <Film viewW={960} viewH={420}>
      <g transform={`scale(${scale})`} style={{ transformOrigin: "480px 210px" }}>
        {/* timeline draws L→R */}
        <line x1={30} y1={210} x2={854} y2={210} stroke={INK} strokeWidth={1.5} {...draw(ease(frame, 0, 28))} />
        <line x1={886} y1={210} x2={916} y2={210} stroke={INK} strokeWidth={1.5} opacity={easeOut(frame, 24, 8)} />
        <path
          d="M908 204 L920 210 L908 216"
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={pop(frame, fps, 28)}
        />
        {[78, 126, 222, 318, 366, 462, 558, 606, 702, 750, 798].map((x, i) => (
          <line key={x} x1={x} y1={206} x2={x} y2={214} stroke={INK} strokeWidth={1} opacity={0.25 * easeOut(frame, 6 + i * 2, 10)} />
        ))}
        <text x={30} y={44} fill={HUMAN} fontSize={11} letterSpacing="0.11em" fontWeight={700} style={mono} opacity={easeOut(frame, 18, 12)}>
          OPERATOR CONTEXT
        </text>
        <text x={30} y={396} fill={MACHINE} fontSize={11} letterSpacing="0.11em" fontWeight={700} style={mono} opacity={easeOut(frame, 18, 12)}>
          MACHINE DATA
        </text>

        {/* contexts arriving */}
        <InputChip x={170} start={28} glyph="check" frame={frame} fps={fps} />
        <MachineTag x={250} w={64} label="62 °C" start={55} frame={frame} fps={fps} />
        <InputChip x={400} start={55} glyph="photo" frame={frame} fps={fps} />
        <MachineTag x={480} w={74} label="2.4 bar" start={85} frame={frame} fps={fps} />
        <InputChip x={630} start={85} glyph="voice" frame={frame} fps={fps} />
        <MachineTag x={710} w={94} label="1450 RPM" start={100} frame={frame} fps={fps} />

        {/* extra history pops in while the camera pulls back */}
        {HISTORY_H.map((x, i) => (
          <circle key={x} cx={x} cy={210} r={3.5} fill={HUMAN} opacity={pop(frame, fps, 130 + i * 5)} />
        ))}
        {HISTORY_M.map((x, i) => (
          <rect key={x} x={x - 3} y={207} width={6} height={6} fill={MACHINE} opacity={pop(frame, fps, 135 + i * 5)} />
        ))}

        {/* cluster box closes in on the pattern */}
        <g
          opacity={0.55 * cluster}
          transform={`scale(${1.05 - 0.05 * cluster})`}
          style={{ transformOrigin: "556px 224px" }}
        >
          <rect x={378} y={128} width={356} height={192} rx={8} fill="none" stroke={INK} strokeWidth={1.3} strokeDasharray="6 6" />
        </g>

        {/* correlation rings breathe, then hold steady */}
        {RINGS.map(([cx, cy, r], i) => {
          const start = 222 + i * 4;
          const t = frame - start;
          if (t < 0) return null;
          const on = easeOut(frame, start, 8);
          const settle = ease(frame, start + 34, 12);
          const breathe = 0.62 + 0.38 * Math.sin((t / 9) * Math.PI - Math.PI / 2);
          const o = on * (settle + (1 - settle) * breathe);
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={HUMAN} strokeWidth={1.8} opacity={o} />;
        })}
        {/* the 2.4 bar tag joins the correlation: a rounded highlight hugs it */}
        {(() => {
          const start = 242;
          const t = frame - start;
          if (t < 0) return null;
          const on = easeOut(frame, start, 8);
          const settle = ease(frame, start + 34, 12);
          const breathe = 0.62 + 0.38 * Math.sin((t / 9) * Math.PI - Math.PI / 2);
          const o = on * (settle + (1 - settle) * breathe);
          return (
            <rect x={436} y={275} width={88} height={44} rx={22} fill="none" stroke={HUMAN} strokeWidth={1.8} opacity={o} />
          );
        })()}

        {/* insight travels forward along the line from the cluster edge */}
        <line
          x1={734}
          y1={210}
          x2={734 + 122 * insightLine}
          y2={210}
          stroke={INK}
          strokeWidth={1.2}
          opacity={0.7 * Math.min(1, insightLine * 5)}
        />

        {/* verified node */}
        <g opacity={pop(frame, fps, 298)} transform={`scale(${0.85 + 0.15 * pop(frame, fps, 298)})`} style={{ transformOrigin: "870px 210px" }}>
          <circle cx={870} cy={210} r={14} fill={GROUND} stroke={VERIFIED} strokeWidth={1.5} />
          <path d="M863 210 l5 5 l10 -11" fill="none" stroke={VERIFIED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <text x={870} y={248} textAnchor="middle" fill={VERIFIED} fontSize={10} letterSpacing="0.1em" fontWeight={700} style={mono}>
            VERIFIED RESULT
          </text>
        </g>
      </g>

      {/* status line (outside the camera group, fixed) */}
      <text x={300} y={414} textAnchor="middle" fill={HUMAN} fontSize={11} letterSpacing="0.1em" fontWeight={700} style={mono}>
        {typed("CORRELATION DETECTED", frame, 222)}
      </text>
      <text x={640} y={414} textAnchor="middle" fill={INK} opacity={0.7} fontSize={11} letterSpacing="0.1em" fontWeight={700} style={mono}>
        {typed("GENERATING INSIGHT", frame, 268)}
      </text>
    </Film>
  );
};
