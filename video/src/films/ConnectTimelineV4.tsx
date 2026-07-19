/*
 * connect-timeline-v4 — the widescreen trilogy's middle film (SCRIPTS-V4.md §4).
 *
 * A full rethink, not a trim of v2. Story:
 *   1 · The three terracotta context chips from capture-v4 fly in from the
 *       left and settle above the timeline — the film opens where Capture
 *       ended.
 *   2 · Teal machine data rises from below and interleaves with them.
 *   3 · Faint history marks fill in along the line, and the camera pulls back:
 *       this is weeks of context, not one afternoon.
 *   4 · A window of interest settles over the cluster, rings breathe on the
 *       nodes inside, and it resolves to VERIFIED RESULT ✓ · READY TO EXECUTE.
 *
 * Black-box: the picture assembles and the outcome lands. How the nodes get
 * chosen is never narrated — no correlation/insight mechanism copy.
 */
import React from "react";
import { interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, typed, win } from "../lib/anim";

const mono = { fontFamily: MONO } as const;

type Kind = "voice" | "photo" | "check";

// the terracotta context chip — identical vocabulary to CaptureV4's chips
const ContextChip: React.FC<{ cx: number; cy: number; kind: Kind; s: number; opacity: number }> = ({ cx, cy, kind, s, opacity }) => {
  if (opacity <= 0) return null;
  return (
    <g opacity={Math.min(1, opacity)} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-20} y={-20} width={40} height={40} rx={9} fill={GROUND} stroke={HUMAN} strokeWidth={1.6} />
      {kind === "check" && (
        <path d="M-9 0 l6 6 l12 -13" fill="none" stroke={HUMAN} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {kind === "photo" && (
        <>
          <rect x={-12} y={-6} width={24} height={17} rx={3} fill="none" stroke={HUMAN} strokeWidth={1.6} />
          <path d="M-5 -6 l2.5 -4 h5 l2.5 4" fill="none" stroke={HUMAN} strokeWidth={1.6} strokeLinejoin="round" />
          <circle cx={0} cy={3} r={4.5} fill="none" stroke={HUMAN} strokeWidth={1.6} />
        </>
      )}
      {kind === "voice" &&
        ([[-10, 8], [-5, 15], [0, 22], [5, 12], [10, 16]] as Array<[number, number]>).map(([dx, h]) => (
          <line key={dx} x1={dx} y1={-h / 2} x2={dx} y2={h / 2} stroke={HUMAN} strokeWidth={2.6} strokeLinecap="round" />
        ))}
    </g>
  );
};

// machine value tag below the line (kept from v2 — it worked)
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

// filled hard-hat operator silhouette — fronts the operator label
const OperatorGlyph: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={HUMAN}>
    <path d="M-5 -5 A5 5.5 0 0 1 5 -5 Z" />
    <rect x={-7.5} y={-5.4} width={15} height={2.4} rx={1.2} />
    <circle cx={0} cy={-0.8} r={3.4} />
    <path d="M-7.5 9 Q-7.5 2.4 0 2.4 Q7.5 2.4 7.5 9 Z" />
  </g>
);

// small filled machine — fronts the machine label
const MachineGlyph: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={MACHINE}>
    <rect x={-2.6} y={-9} width={5.2} height={6} rx={0.8} />
    <rect x={-6.5} y={-3.5} width={13} height={8.5} rx={1} />
    <rect x={-8} y={5} width={16} height={3} rx={0.6} />
  </g>
);

// time indicator at the left origin of the axis
const TimeIndicator: React.FC<{ p: number }> = ({ p }) => {
  const cx = 48;
  const cy = 168;
  return (
    <g opacity={p}>
      <circle cx={cx} cy={cy} r={13} fill={GROUND} stroke={INK} strokeWidth={1.6} {...draw(p)} />
      <line x1={cx} y1={cy} x2={cx} y2={cy - 8} stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={p} />
      <line x1={cx} y1={cy} x2={cx + 6} y2={cy + 2} stroke={INK} strokeWidth={1.6} strokeLinecap="round" opacity={p} />
      <text x={cx} y={cy + 32} textAnchor="middle" fill={INK} opacity={0.6 * p} fontSize={13} letterSpacing="0.06em" style={mono}>
        14:00
      </text>
    </g>
  );
};

// the three chips from Capture, arriving in the order they were made there
const CHIPS: Array<{ x: number; kind: Kind; start: number }> = [
  { x: 170, kind: "voice", start: 24 },
  { x: 400, kind: "photo", start: 48 },
  { x: 630, kind: "check", start: 72 },
];

// machine data interleaving between them
const TAGS: Array<{ x: number; w: number; label: string; start: number }> = [
  { x: 250, w: 64, label: "62 °C", start: 100 },
  { x: 480, w: 74, label: "2.4 bar", start: 126 },
  { x: 710, w: 94, label: "1450 RPM", start: 152 },
];

// faint history marks — the line holds far more than today's three moments.
// kind: d = operator dot, s = machine square. Late marks appear as the camera
// pulls back and the edges of the timeline come into view.
const HIST: Array<{ x: number; k: "d" | "s"; start: number }> = [
  { x: 110, k: "d", start: 162 },
  { x: 215, k: "s", start: 168 },
  { x: 330, k: "d", start: 174 },
  { x: 545, k: "d", start: 180 },
  { x: 760, k: "s", start: 186 },
  { x: 820, k: "d", start: 192 },
  { x: 62, k: "s", start: 204 },
  { x: 92, k: "d", start: 210 },
  { x: 855, k: "s", start: 214 },
  { x: 884, k: "d", start: 218 },
];

// correlation rings — only on the nodes inside the window of interest
const RINGS: Array<[number, number]> = [
  [400, 210],
  [480, 210],
  [630, 210],
  [710, 210],
];

// window of interest — contains photo chip, 2.4 bar, voice chip, 1450 RPM
const BOX = { x: 360, y: 58, w: 422, h: 260 };

export const ConnectTimelineV4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: hold close while the day assembles, pull back to see the weeks
  const scale = interpolate(frame, [0, 196, 256], [1.12, 1.12, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const clock = ease(frame, 8, 18);
  const cluster = easeOut(frame, 258, 26);
  const verdict = easeOut(frame, 308, 14);
  const readyNext = easeOut(frame, 336, 14);
  const onward = easeOut(frame, 356, 16);

  return (
    <Film viewW={960} viewH={420}>
      <g transform={`scale(${scale})`} style={{ transformOrigin: "480px 210px" }}>
        {/* one continuous time axis — draws L→R */}
        <line x1={30} y1={210} x2={900} y2={210} stroke={INK} strokeWidth={1.5} {...draw(ease(frame, 0, 22))} />
        <path
          d="M894 203 L908 210 L894 217"
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={easeOut(frame, 0, 8) * (1 - onward)}
        />
        {[78, 126, 222, 318, 366, 462, 558, 606, 702, 750, 798].map((x, i) => (
          <line key={x} x1={x} y1={206} x2={x} y2={214} stroke={INK} strokeWidth={1} opacity={0.22 * easeOut(frame, 6 + i * 2, 10)} />
        ))}

        {/* window of interest (behind the nodes) */}
        <g
          opacity={cluster}
          transform={`scale(${1.04 - 0.04 * cluster})`}
          style={{ transformOrigin: `${BOX.x + BOX.w / 2}px ${BOX.y + BOX.h / 2}px` }}
        >
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={10} fill={INK} fillOpacity={0.05} />
          <rect x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} rx={10} fill="none" stroke={INK} strokeWidth={1.3} strokeDasharray="6 6" opacity={0.6} />
        </g>

        {/* ── the chips from Capture arrive and take their places ─────────── */}
        {CHIPS.map((c) => {
          const t = ease(frame, c.start, 28);
          if (t <= 0) return null;
          const cx = -50 + (c.x + 50) * t;
          const cy = 94 + 14 * Math.sin(Math.PI * t);
          const conn = ease(frame, c.start + 30, 12);
          const dot = easeOut(frame, c.start + 36, 8);
          const ripple = win(frame, c.start + 38, 14);
          return (
            <g key={c.kind}>
              <ContextChip cx={cx} cy={cy} kind={c.kind} s={0.78 + 0.12 * t} opacity={ease(frame, c.start, 8)} />
              <line x1={c.x} y1={113} x2={c.x} y2={113 + 97 * conn} stroke={HUMAN} strokeWidth={1.2} />
              <circle cx={c.x} cy={210} r={5} fill={HUMAN} opacity={dot} />
              {ripple > 0 && ripple < 1 && (
                <circle cx={c.x} cy={210} r={5 + 9 * ripple} fill="none" stroke={HUMAN} strokeWidth={1.2} opacity={0.6 * (1 - ripple)} />
              )}
            </g>
          );
        })}

        {/* ── machine data rises to meet them ─────────────────────────────── */}
        {TAGS.map((t) => (
          <MachineTag key={t.x} x={t.x} w={t.w} label={t.label} start={t.start} frame={frame} fps={fps} />
        ))}

        {/* ── history fills in: weeks of context, not one afternoon ───────── */}
        {HIST.map((h) => {
          const p = easeOut(frame, h.start, 12);
          if (p <= 0) return null;
          return h.k === "d" ? (
            <circle key={`${h.x}`} cx={h.x} cy={210} r={2.6} fill={HUMAN} opacity={0.32 * p} />
          ) : (
            <rect key={`${h.x}`} x={h.x - 2.6} y={207.4} width={5.2} height={5.2} fill={MACHINE} opacity={0.32 * p} />
          );
        })}

        {/* rings breathe on the nodes inside the window, then hold */}
        {RINGS.map(([cx, cy], i) => {
          const start = 270 + i * 4;
          const t = frame - start;
          if (t < 0) return null;
          const on = easeOut(frame, start, 8);
          const settle = ease(frame, start + 36, 12);
          const breathe = 0.62 + 0.38 * Math.sin((t / 9) * Math.PI - Math.PI / 2);
          const o = on * (settle + (1 - settle) * breathe);
          return <circle key={i} cx={cx} cy={cy} r={10} fill="none" stroke={HUMAN} strokeWidth={1.8} opacity={o} />;
        })}

        {/* forward extension — the axis reaches onward (into Execute) */}
        {onward > 0 && (
          <g opacity={onward}>
            <line x1={896} y1={210} x2={896 + 46 * onward} y2={210} stroke={INK} strokeWidth={1.5} />
            <path
              d={`M${930 + 12 * onward - 12} 203 L${930 + 12 * onward} 210 L${930 + 12 * onward - 12} 217`}
              fill="none"
              stroke={INK}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </g>

      {/* ── fixed overlay: never cropped by the camera ───────────────────── */}
      <TimeIndicator p={clock} />

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

      {/* the outcome — and the handoff to Execute */}
      {verdict > 0 && (
        <g opacity={verdict}>
          <g transform={`scale(${0.8 + 0.2 * pop(frame, fps, 312)})`} style={{ transformOrigin: "466px 344px" }}>
            <circle cx={466} cy={344} r={8} fill={GROUND} stroke={VERIFIED} strokeWidth={1.7} />
            <path d="M462.2 344 l2.9 2.9 l5.6 -6.6" fill="none" stroke={VERIFIED} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <text x={484} y={349} fill={VERIFIED} fontSize={15} letterSpacing="0.12em" fontWeight={700} style={mono}>
            {typed("VERIFIED RESULT", frame, 308)}
          </text>
        </g>
      )}
      {readyNext > 0 && (
        <g opacity={readyNext} transform={`translate(0 ${4 * (1 - readyNext)})`}>
          <text x={484} y={372} fill={INK} opacity={0.55} fontSize={10} letterSpacing="0.14em" fontWeight={700} style={mono}>
            READY TO EXECUTE
          </text>
        </g>
      )}

    </Film>
  );
};
