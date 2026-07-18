/*
 * Film 3b — capture-check-v2  (a kept-separate upgrade of capture-check)
 *
 * No operator: it opens on a small phone and the camera zooms into the deck
 * (the pre-start checklist). Each gate is confirmed step-by-step by pressing the
 * green (forward) button — deliberately slower so each pass is clear. The rail
 * runs only between circles (never inside them). When all three pass, the checks
 * fade out and a large, centred, green-filled APPROVED (white letters) lands.
 *
 * The original `capture-check` composition is left untouched.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MONO, VERIFIED } from "../brand";
import { Film, easeOut, pop, win } from "../lib/anim";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

const CX = 136; // checklist rail x
const R = 12; // gate circle radius
const GATES = [
  { y: 98, label: "GUARD IN PLACE" },
  { y: 150, label: "SAMPLE TAKEN" },
  { y: 202, label: "AREA CLEAR" },
];
const PRESS = [54, 108, 162]; // frames when the green button is pressed (slow, stepwise)

// rail segments run circle-edge → circle-edge, never inside a circle
const RAIL = [
  { y1: GATES[0].y + R, y2: GATES[1].y - R },
  { y1: GATES[1].y + R, y2: GATES[2].y - R },
];

export const CaptureCheckV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera zooms from a small phone into the deck
  const S = interpolate(frame, [0, 46], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const cam = `translate(180 160) scale(${S}) translate(-180 -160)`;

  const intro = easeOut(frame, 6, 16); // title + empty deck fade in

  // which gate is current (previous ones finished passing)
  let current = 0;
  for (let i = 0; i < 3; i++) if (frame >= PRESS[i] + 20) current = i + 1;

  const pf = current < 3 ? PRESS[current] : 1e9;
  const depress = interp(frame, pf, pf + 4, pf + 11);
  const btnScale = 1 - 0.1 * depress;
  const waiting = current < 3 && frame > 48 && frame < pf - 1;
  const breathe = waiting ? 0.04 * Math.sin(frame / 5) : 0;

  // finale: checklist fades, a big centred APPROVED lands (short outro)
  const checkFade = easeOut(frame, 190, 16);
  const checklist = intro * (1 - checkFade);
  const bigApproved = pop(frame, fps, 202);
  const pulseP = easeOut(frame, 212, 30);
  const pulseO = frame >= 212 ? 0.5 * (1 - win(frame, 212, 30)) : 0;

  return (
    <Film viewW={360} viewH={320}>
      <g transform={cam}>
        {/* phone body (stays through the finale) */}
        <rect x={100} y={8} width={160} height={304} rx={22} fill={GROUND} stroke={INK} strokeWidth={2} {...nss} />
        <line x1={166} y1={24} x2={194} y2={24} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.3} />

        {/* ── checklist (fades out at the finale) ── */}
        <g opacity={checklist}>
          <text x={180} y={58} textAnchor="middle" fill={INK} opacity={0.6} fontSize={9} letterSpacing="0.12em" fontWeight={700} style={mono}>
            PRE-START CHECK
          </text>

          {/* faint rail — segments between circles only */}
          {RAIL.map(({ y1, y2 }, i) => (
            <line key={i} x1={CX} y1={y1} x2={CX} y2={y2} stroke={INK} strokeWidth={1.2} opacity={0.18} />
          ))}
          {/* empty gate rings */}
          {GATES.map(({ y }) => (
            <circle key={y} cx={CX} cy={y} r={R} fill="none" stroke={INK} strokeWidth={1.5} opacity={0.28} />
          ))}

          {/* gates passing, one press at a time */}
          {GATES.map(({ y, label }, i) => {
            const p = PRESS[i];
            const ring = easeOut(frame, p + 3, 16);
            const check = easeOut(frame, p + 9, 16);
            const railP = i < 2 ? easeOut(frame, p + 10, 24) : 0;
            const isCurrent = current === i;
            return (
              <g key={y}>
                <text x={158} y={y + 4} fill={INK} fontSize={11} style={mono} opacity={0.4 + 0.6 * Math.max(check, isCurrent ? 0.5 : 0)}>
                  {label}
                </text>
                {isCurrent && (
                  <circle cx={CX} cy={y} r={16 + 1.5 * Math.sin(frame / 5)} fill="none" stroke={HUMAN} strokeWidth={1.2} opacity={0.4} />
                )}
                {/* green fill rail below this gate (circle-edge → next circle-edge) */}
                {i < 2 && railP > 0 && (
                  <line x1={CX} y1={RAIL[i].y1} x2={CX} y2={RAIL[i].y1 + (RAIL[i].y2 - RAIL[i].y1) * railP} stroke={VERIFIED} strokeWidth={1.8} />
                )}
                {ring > 0 && <circle cx={CX} cy={y} r={R} fill={GROUND} stroke={VERIFIED} strokeWidth={1.8} {...draw(ring)} />}
                {check > 0 && (
                  <path d={`M${CX - 6} ${y} l4.5 4.5 l8.5 -9.5`} fill="none" stroke={VERIFIED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...draw(check)} />
                )}
              </g>
            );
          })}

          {/* ── bottom navbar: red back · green forward ── */}
          <line x1={116} y1={262} x2={244} y2={262} stroke={INK} strokeWidth={1} opacity={0.18} />
          <g transform="translate(143 285)">
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill="none" stroke={HUMAN} strokeWidth={1.6} />
            <path d="M-7 -7 L7 7 M7 -7 L-7 7" fill="none" stroke={HUMAN} strokeWidth={2} strokeLinecap="round" />
          </g>
          <g transform={`translate(217 285) scale(${btnScale + breathe})`}>
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill={VERIFIED} opacity={depress} />
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill="none" stroke={VERIFIED} strokeWidth={1.6} />
            <path d="M-8 0 l5 5 l10 -11" fill="none" stroke={depress > 0.5 ? GROUND : VERIFIED} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {depress > 0.05 && (
            <circle cx={217} cy={285} r={20 + 14 * depress} fill="none" stroke={VERIFIED} strokeWidth={1.2} opacity={0.5 * (1 - depress)} />
          )}
        </g>

        {/* ── finale: large centred, green-filled APPROVED ── */}
        {pulseO > 0 && (
          <rect x={104 - 12 * pulseP} y={137 - 12 * pulseP} width={152 + 24 * pulseP} height={46 + 24 * pulseP} rx={23 + 12 * pulseP} fill="none" stroke={VERIFIED} strokeWidth={1.4} opacity={pulseO} />
        )}
        {bigApproved > 0 && (
          <g opacity={Math.min(1, bigApproved)} transform={`scale(${0.85 + 0.15 * Math.min(1, bigApproved)})`} style={{ transformOrigin: "180px 160px" }}>
            <rect x={104} y={137} width={152} height={46} rx={23} fill={VERIFIED} />
            <text x={180} y={166} textAnchor="middle" fill={GROUND} fontSize={15} letterSpacing="0.12em" fontWeight={700} style={mono}>
              APPROVED
            </text>
          </g>
        )}
      </g>
    </Film>
  );
};

// 0→1→0 triangular pulse across [a, mid, b]
function interp(t: number, a: number, mid: number, b: number): number {
  if (t <= a || t >= b) return 0;
  return t < mid ? (t - a) / (mid - a) : 1 - (t - mid) / (b - mid);
}

// stroke draw-on (kept local so this file owns its dashing)
function draw(p: number) {
  return {
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - p,
    ...(p <= 0 ? { visibility: "hidden" as const } : {}),
  };
}
