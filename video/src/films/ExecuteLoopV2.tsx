/*
 * Film 5b — execute-loop-v2  (a kept-separate reframe of execute-loop)
 *
 * Execute is its own act — NOT a replay of capture or connect. It starts where
 * connect ended: with a validated finding, and follows it into the field.
 *
 *   1 · VALIDATED FINDING   human + machine evidence resolve into one finding,
 *                           marked verified (green ✓).
 *   2 · TURNED INTO AN INSTRUCTION   the finding becomes a concrete action
 *                           card — "set die temp +2 °C" with SOP steps.
 *   3 · BACK TO THE OPERATOR   the action pings the operator's phone; the
 *                           camera pushes into the phone; the notification
 *                           reads "DIE TEMP LOW · ADJUST +2 °C"; the operator
 *                           confirms and it is EXECUTED — closing the loop.
 *
 * Flow/sequencing mirrors connect-timeline-v2: strictly sequential reveals,
 * per-station check-marks, a single signature camera move (here a push-IN on
 * the phone, where connect pulled OUT). The original execute-loop is untouched.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, travelFade } from "../lib/anim";

const mono = { fontFamily: MONO } as const;

const PHONE = { x: 754, y: 64, w: 94, h: 172, cx: 801, cy: 150 };

// per-station labels + their completion check-marks
const STATIONS: Array<{ x: number; label: string; color: string; start: number; check: number }> = [
  { x: 150, label: "VALIDATED FINDING", color: VERIFIED, start: 34, check: 40 },
  { x: 480, label: "TURNED INTO AN INSTRUCTION", color: INK, start: 96, check: 104 },
  { x: 801, label: "BACK TO THE OPERATOR", color: INK, start: 158, check: -1 },
];

const StationLabel: React.FC<{ x: number; label: string; color: string; start: number; check: number; frame: number; fps: number }> = ({
  x,
  label,
  color,
  start,
  check,
  frame,
  fps,
}) => {
  const p = easeOut(frame, start, 12);
  if (p <= 0) return null;
  // measure-free centring: text is anchored middle; the check sits to its left
  const half = label.length * 4.55 + 13;
  const chk = check > 0 ? pop(frame, fps, check) : 0;
  return (
    <g opacity={p} transform={`translate(0 ${5 * (1 - p)})`}>
      <text x={x + 8} y={272} textAnchor="middle" fill={color} fontSize={13} letterSpacing="0.1em" fontWeight={700} style={mono}>
        {label}
      </text>
      {check > 0 && (
        <g opacity={chk} transform={`translate(${x - half} 268) scale(${0.8 + 0.2 * chk})`}>
          <circle cx={0} cy={0} r={7} fill={GROUND} stroke={color} strokeWidth={1.6} />
          <path d="M-3.4 0 l2.7 2.7 l5.2 -6.2" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

export const ExecuteLoopV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // signature camera move: push IN on the phone (connect pulled OUT), and
  // recentre so the phone (right third) slides to frame centre as we zoom.
  // scale is capped so the whole phone — rounded top and bottom — stays inside
  // the 340-tall frame when zoomed (172 × 1.82 ≈ 313 < 340).
  const zin = ease(frame, 190, 55); // 0 → 1
  const camScale = 1 + 0.82 * zin; // 1 → 1.82
  const camTx = 801 + (480 - 801) * zin - camScale * PHONE.cx; // phone.cx → 480
  const camTy = 150 + 20 * zin - camScale * PHONE.cy; // phone.cy → frame centre (170)
  const wideFade = 1 - easeOut(frame, 192, 34); // wide stations fall away as we push in

  // 1 · finding assembly
  const findingDraw = ease(frame, 8, 20);
  const rowH = easeOut(frame, 12, 14); // human row
  const rowM = easeOut(frame, 18, 14); // machine row
  const validated = pop(frame, fps, 40);

  // arrows + packets
  const a1 = ease(frame, 46, 20);
  const pkt1 = ease(frame, 60, 30);
  const a2 = ease(frame, 112, 20);
  const pkt2 = ease(frame, 126, 30);

  // 2 · instruction card
  const instr = pop(frame, fps, 78);

  // 3 · phone + notification (wide) → detail (zoom)
  const phoneDraw = ease(frame, 150, 22);
  const detail = easeOut(frame, 210, 22);
  const confirm = interpolate(frame, [252, 260, 272], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const executed = pop(frame, fps, 276);

  // wide phase: the phone rings — a bell vibrates on screen while notification
  // lines emanate from the phone top; both fade out as the camera pushes in
  // (once zoomed there is no bell, just the notification itself).
  const bellIn = pop(frame, fps, 155);
  const bellOut = 1 - easeOut(frame, 196, 14);
  const bellVis = bellIn * bellOut;
  const ringAngle = Math.sin((frame - 155) * 0.8) * 8 * bellOut; // vibrate degrees
  const notif = ((frame - 152 + 200) % 20) / 20; // 0→1 radiating pulse loop

  const caption = easeOut(frame, 302, 16);

  return (
    <Film viewW={960} viewH={340}>
      <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
        {/* ── wide scene (falls away during the push-in) ─────────────────── */}
        <g opacity={wideFade}>
          {/* incoming evidence tokens converge into the finding */}
          <circle cx={60 + 70 * Math.min(1, findingDraw * 1.4)} cy={128 + 14 * Math.min(1, findingDraw * 1.4)} r={4} fill={HUMAN} opacity={0.9 * (1 - findingDraw)} />
          <rect x={56 + 66 * Math.min(1, findingDraw * 1.4)} y={186 - 30 * Math.min(1, findingDraw * 1.4)} width={7} height={7} fill={MACHINE} opacity={0.9 * (1 - findingDraw)} />

          {/* 1 · validated finding card */}
          <rect x={102} y={116} width={96} height={68} rx={8} fill={GROUND} stroke={INK} strokeWidth={1.6} {...draw(findingDraw)} />
          <text x={112} y={132} fill={INK} opacity={0.5} fontSize={8} letterSpacing="0.12em" fontWeight={700} style={mono}>
            FINDING
          </text>
          {/* human evidence row */}
          <g opacity={rowH}>
            <circle cx={116} cy={148} r={3} fill={HUMAN} />
            <line x1={124} y1={148} x2={188} y2={148} stroke={INK} strokeWidth={1.4} opacity={0.3} />
          </g>
          {/* machine evidence row */}
          <g opacity={rowM}>
            <rect x={113} y={160} width={6} height={6} fill={MACHINE} />
            <line x1={124} y1={163} x2={188} y2={163} stroke={INK} strokeWidth={1.4} opacity={0.3} />
          </g>
          {/* validated badge */}
          <g opacity={validated} transform={`scale(${0.8 + 0.2 * validated})`} style={{ transformOrigin: "186px 124px" }}>
            <circle cx={186} cy={124} r={8} fill={GROUND} stroke={VERIFIED} strokeWidth={1.6} />
            <path d="M182 124 l3 3 l6 -7" fill="none" stroke={VERIFIED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* arrow 1 + packet */}
          {a1 > 0 && <line x1={206} y1={150} x2={206 + 210 * a1} y2={150} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a1 * 5)} />}
          <path d="M410 145 L420 150 L410 155" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 62, 8)} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={212 + 202 * pkt1} cy={150} r={4.5} fill={HUMAN} opacity={travelFade(pkt1)} />

          {/* 2 · instruction card */}
          <g opacity={instr} transform={`scale(${0.86 + 0.14 * instr})`} style={{ transformOrigin: "480px 150px" }}>
            <rect x={424} y={110} width={112} height={80} rx={8} fill={GROUND} stroke={INK} strokeWidth={1.6} />
            <text x={434} y={126} fill={INK} opacity={0.5} fontSize={8} letterSpacing="0.12em" fontWeight={700} style={mono}>
              ACTION
            </text>
            <line x1={424} y1={132} x2={536} y2={132} stroke={INK} strokeWidth={1} opacity={0.15} />
            {/* target set-point (human decision → terracotta) */}
            <text x={434} y={150} fill={INK} opacity={0.75} fontSize={9} style={mono}>
              DIE TEMP
            </text>
            <text x={527} y={150} textAnchor="end" fill={HUMAN} fontSize={11} fontWeight={700} style={mono}>
              +2 °C
            </text>
            {/* two SOP check rows */}
            {[164, 178].map((y, i) => (
              <g key={y}>
                <rect x={434} y={y - 7} width={9} height={9} rx={2} fill="none" stroke={HUMAN} strokeWidth={1.4} opacity={i === 0 ? 1 : 0.5} />
                <path d={`M436.5 ${y - 2.5} l1.8 1.8 l3.4 -4`} fill="none" stroke={HUMAN} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={i === 0 ? 1 : 0} />
                <line x1={450} y1={y - 2} x2={i === 0 ? 524 : 508} y2={y - 2} stroke={INK} strokeWidth={1.2} opacity={0.3} />
              </g>
            ))}
          </g>

          {/* arrow 2 + packet */}
          {a2 > 0 && <line x1={544} y1={150} x2={544 + 202 * a2} y2={150} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a2 * 5)} />}
          <path d="M740 145 L750 150 L740 155" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 150, 8)} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={550 + 194 * pkt2} cy={150} r={4.5} fill={HUMAN} opacity={travelFade(pkt2)} />

          {/* station labels */}
          {STATIONS.map((s) => (
            <StationLabel key={s.label} {...s} frame={frame} fps={fps} />
          ))}
        </g>

        {/* ── the phone persists and becomes the focus of the push-in ─────── */}
        <g>
          {/* notification lines emanating from the phone top (wide phase) */}
          {bellVis > 0.02 &&
            [-52, -26, 0, 26, 52].map((deg) => {
              const a = (deg * Math.PI) / 180;
              const rIn = 8 + 12 * notif;
              const rOut = rIn + 9;
              return (
                <line
                  key={deg}
                  x1={PHONE.cx + Math.sin(a) * rIn}
                  y1={PHONE.y - Math.cos(a) * rIn}
                  x2={PHONE.cx + Math.sin(a) * rOut}
                  y2={PHONE.y - Math.cos(a) * rOut}
                  stroke={HUMAN}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  opacity={bellVis * (1 - notif) * 0.8}
                />
              );
            })}

          {/* body */}
          <rect x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={16} fill={GROUND} stroke={INK} strokeWidth={2} {...draw(phoneDraw)} />
          <line x1={788} y1={78} x2={814} y2={78} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.3 * easeOut(frame, 162, 8)} />
          {/* screen */}
          <rect x={764} y={90} width={74} height={126} rx={7} fill="none" stroke={INK} strokeWidth={1} opacity={0.18 * easeOut(frame, 168, 10)} />

          {/* wide phase: a vibrating bell — the notification arriving */}
          {bellVis > 0.02 && (
            <g opacity={bellVis} transform={`rotate(${ringAngle} 801 130)`}>
              <g transform="translate(801 141)">
                <circle cx={0} cy={-11} r={1.8} fill={HUMAN} />
                <path d="M-9 6 C -9 -4 -5 -9 0 -9 C 5 -9 9 -4 9 6 L 11 9 L -11 9 Z" fill="none" stroke={HUMAN} strokeWidth={1.7} strokeLinejoin="round" />
                <path d="M-3.4 9 a3.4 3 0 0 0 6.8 0" fill="none" stroke={HUMAN} strokeWidth={1.7} />
              </g>
            </g>
          )}

          {/* zoom-phase notification detail (readable once pushed in — no bell) */}
          {detail > 0 && (
            <g opacity={detail}>
              <text x={772} y={106} fill={INK} opacity={0.55} fontSize={7.5} letterSpacing="0.12em" fontWeight={700} style={mono}>
                OPPR
              </text>
              <line x1={772} y1={112} x2={830} y2={112} stroke={INK} strokeWidth={1} opacity={0.15} />
              {/* machine condition (teal) */}
              <text x={772} y={132} fill={MACHINE} fontSize={7.5} letterSpacing="0.02em" fontWeight={700} style={mono}>
                DIE TEMP LOW
              </text>
              {/* the action (terracotta) */}
              <text x={772} y={150} fill={INK} opacity={0.55} fontSize={7} letterSpacing="0.08em" style={mono}>
                ADJUST
              </text>
              <text x={772} y={174} fill={HUMAN} fontSize={16} fontWeight={700} style={mono}>
                +2 °C
              </text>

              {/* confirm affordance → executed */}
              {executed <= 0 ? (
                <g>
                  <rect x={772} y={190} width={58} height={20} rx={10} fill={confirm > 0.4 ? HUMAN : "none"} stroke={HUMAN} strokeWidth={1.3} opacity={detail} />
                  <text x={801} y={203} textAnchor="middle" fill={confirm > 0.4 ? GROUND : HUMAN} fontSize={7.5} letterSpacing="0.1em" fontWeight={700} style={mono}>
                    CONFIRM
                  </text>
                  {confirm > 0.05 && <circle cx={801} cy={200} r={12 + 16 * confirm} fill="none" stroke={HUMAN} strokeWidth={1.2} opacity={0.6 * (1 - confirm)} />}
                </g>
              ) : (
                <g opacity={Math.min(1, executed)} transform={`translate(0 ${6 * (1 - executed)})`}>
                  <circle cx={778} cy={200} r={7} fill={GROUND} stroke={VERIFIED} strokeWidth={1.6} />
                  <path d="M774.5 200 l2.6 2.6 l5 -6" fill="none" stroke={VERIFIED} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                  <text x={789} y={203} fill={VERIFIED} fontSize={7.5} letterSpacing="0.04em" fontWeight={700} style={mono}>
                    EXECUTED
                  </text>
                </g>
              )}
            </g>
          )}
        </g>
      </g>

      {/* ── fixed overlay: closing line, set on two lines to the RIGHT of the
             zoomed phone (which fills the centre) so it stays readable ─────── */}
      <g opacity={0.55 * caption} transform={`translate(0 ${5 * (1 - caption)})`}>
        <text x={592} y={162} fill={INK} fontSize={12} letterSpacing="0.1em" fontWeight={700} style={mono}>
          EVERY EXECUTED ACTION
        </text>
        <text x={592} y={182} fill={INK} fontSize={12} letterSpacing="0.1em" fontWeight={700} style={mono}>
          CREATES NEW EVIDENCE
        </text>
      </g>
    </Film>
  );
};
