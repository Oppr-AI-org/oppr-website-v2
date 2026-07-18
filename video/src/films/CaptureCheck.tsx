/*
 * Film 3 — capture-check (SCRIPTS.md §4)
 * An operator runs a pre-start check on his phone. We open on him holding the
 * phone (list pose), dive into the screen, then step through the checklist:
 * each gate is confirmed by pressing the green (forward) button on a simple
 * bottom navbar — red cross on the left steps back, green check on the right
 * steps forward. When every gate passes, the check is APPROVED.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MONO, VERIFIED } from "../brand";
import { Film, ease, easeOut, pop, win } from "../lib/anim";
import { Operator } from "../lib/Operator";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

const CHECK_AT = 66; // dive completes; Phase B time is fb = frame - CHECK_AT

const GATES = [
  { y: 98, label: "GUARD IN PLACE" },
  { y: 150, label: "TEMP LOGGED" },
  { y: 202, label: "AREA CLEAR" },
];
const PRESS = [24, 60, 96]; // fb frames when the green button is pressed

const CX = 136; // checklist rail x

export const CaptureCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fb = frame - CHECK_AT;

  // dive-in transition: Phase A (operator) scales up + fades; Phase B settles
  const zA = 1 + 1.5 * ease(frame, 0, CHECK_AT);
  const phaseA = 1 - easeOut(frame, 50, 12);
  const phaseB = easeOut(frame, 54, 12);
  const zB = 0.86 + 0.14 * easeOut(frame, 54, 22);

  // how many gates have finished passing → which gate is current
  let current = 0;
  for (let i = 0; i < 3; i++) if (fb >= PRESS[i] + 14) current = i + 1;

  // the pending green-button press
  const pf = current < 3 ? PRESS[current] : 1e9;
  const depress = interp(fb, pf, pf + 4, pf + 11); // 0→1→0 press flash
  const btnScale = 1 - 0.1 * depress;
  const waiting = current < 3 && fb > 8 && fb < pf - 1;
  const breathe = waiting ? 0.04 * Math.sin(fb / 5) : 0;

  const approved = pop(fb, fps, PRESS[2] + 18);
  const pulseP = easeOut(fb, PRESS[2] + 28, 30);
  const pulseO = fb >= PRESS[2] + 28 ? 0.5 * (1 - win(fb, PRESS[2] + 28, 30)) : 0;

  return (
    <Film viewW={360} viewH={320}>
      {/* ── Phase A: operator holding the phone, camera dives in ─────── */}
      {phaseA > 0 && (
        <g opacity={phaseA} transform={`translate(180 150) scale(${zA}) translate(-180 -150)`}>
          <g transform="translate(130 72) scale(0.62)">
            <Operator pose="list" id="check-op" />
          </g>
        </g>
      )}

      {/* ── Phase B: the phone UI + checklist + navbar ────────────────── */}
      {phaseB > 0 && (
        <g opacity={phaseB} transform={`translate(180 160) scale(${zB}) translate(-180 -160)`}>
          {/* phone body */}
          <rect x={100} y={8} width={160} height={304} rx={22} fill={GROUND} stroke={INK} strokeWidth={2} {...nss} />
          <line x1={166} y1={24} x2={194} y2={24} stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.3} />
          <text
            x={180}
            y={58}
            textAnchor="middle"
            fill={INK}
            opacity={0.6}
            fontSize={9}
            letterSpacing="0.12em"
            fontWeight={700}
            style={mono}
          >
            PRE-START CHECK
          </text>

          {/* faint rail + empty gates */}
          <line x1={CX} y1={GATES[0].y} x2={CX} y2={GATES[2].y} stroke={INK} strokeWidth={1.2} opacity={0.18} />
          {GATES.map(({ y }) => (
            <circle key={y} cx={CX} cy={y} r={12} fill="none" stroke={INK} strokeWidth={1.5} opacity={0.28} />
          ))}

          {/* gates passing, one press at a time */}
          {GATES.map(({ y, label }, i) => {
            const p = PRESS[i];
            const ring = easeOut(fb, p + 3, 14);
            const check = easeOut(fb, p + 9, 14);
            const railP = i < 2 ? easeOut(fb, p + 8, 22) : 0;
            const isCurrent = current === i;
            return (
              <g key={y}>
                {/* label brightens as its gate clears */}
                <text
                  x={158}
                  y={y + 4}
                  fill={INK}
                  fontSize={11}
                  style={mono}
                  opacity={0.4 + 0.6 * Math.max(check, isCurrent ? 0.5 : 0)}
                >
                  {label}
                </text>
                {/* current-gate highlight invites the press */}
                {isCurrent && (
                  <circle
                    cx={CX}
                    cy={y}
                    r={16 + 1.5 * Math.sin(fb / 5)}
                    fill="none"
                    stroke={HUMAN}
                    strokeWidth={1.2}
                    opacity={0.4}
                  />
                )}
                {ring > 0 && (
                  <circle cx={CX} cy={y} r={12} fill={GROUND} stroke={VERIFIED} strokeWidth={1.8} {...draw(ring)} />
                )}
                {check > 0 && (
                  <path
                    d={`M${CX - 6} ${y} l4.5 4.5 l8.5 -9.5`}
                    fill="none"
                    stroke={VERIFIED}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    {...draw(check)}
                  />
                )}
                {i < 2 && railP > 0 && (
                  <line x1={CX} y1={y + 12} x2={CX} y2={y + 12 + 28 * railP} stroke={VERIFIED} strokeWidth={1.8} />
                )}
              </g>
            );
          })}

          {/* approval */}
          {approved > 0 && (
            <g opacity={approved} transform={`scale(${0.9 + 0.1 * approved})`} style={{ transformOrigin: "180px 235px" }}>
              <rect x={130} y={220} width={100} height={30} rx={15} fill="none" stroke={VERIFIED} strokeWidth={2} />
              <text
                x={180}
                y={240}
                textAnchor="middle"
                fill={VERIFIED}
                fontSize={11}
                letterSpacing="0.1em"
                fontWeight={700}
                style={mono}
              >
                APPROVED
              </text>
            </g>
          )}
          {pulseO > 0 && (
            <rect
              x={130 - 14 * pulseP}
              y={220 - 14 * pulseP}
              width={100 + 28 * pulseP}
              height={30 + 28 * pulseP}
              rx={15 + 14 * pulseP}
              fill="none"
              stroke={VERIFIED}
              strokeWidth={1.2}
              opacity={pulseO}
            />
          )}

          {/* ── bottom navbar: red back (left) · green forward (right) ── */}
          <line x1={116} y1={262} x2={244} y2={262} stroke={INK} strokeWidth={1} opacity={0.18} />

          {/* left — step back (red cross) */}
          <g transform="translate(143 285)">
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill="none" stroke={HUMAN} strokeWidth={1.6} />
            <path d="M-7 -7 L7 7 M7 -7 L-7 7" fill="none" stroke={HUMAN} strokeWidth={2} strokeLinecap="round" />
          </g>

          {/* right — confirm & step forward (green check); presses each gate */}
          <g transform={`translate(217 285) scale(${btnScale + breathe})`}>
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill={VERIFIED} opacity={depress} />
            <rect x={-27} y={-17} width={54} height={34} rx={9} fill="none" stroke={VERIFIED} strokeWidth={1.6} />
            <path
              d="M-8 0 l5 5 l10 -11"
              fill="none"
              stroke={depress > 0.5 ? GROUND : VERIFIED}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          {/* tap ripple on press */}
          {depress > 0.05 && (
            <circle cx={217} cy={285} r={20 + 14 * depress} fill="none" stroke={VERIFIED} strokeWidth={1.2} opacity={0.5 * (1 - depress)} />
          )}
        </g>
      )}
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
