/*
 * execute-loop-v4 — the widescreen trilogy's closing film (SCRIPTS-V4.md §5).
 *
 * Promotes the execute-loop-v2 staging to the unified 1920×840 frame and
 * closes the trilogy's loop literally. Story:
 *   0 · A green verified token arrives from the left — the result Connect
 *       just produced.
 *   1 · VALIDATED FINDING: human + machine evidence resolve into one card ✓.
 *   2 · TURNED INTO AN INSTRUCTION: a concrete action card (+2 °C, SOP rows).
 *   3 · BACK TO THE OPERATOR: the phone rings; the camera pushes in; the
 *       operator confirms; EXECUTED ✓.
 *   4 · The camera pulls back out and a green arrow sweeps from the executed
 *       phone back to the finding card — the loop is drawn, not implied —
 *       under the closing line EVERY EXECUTED ACTION CREATES NEW EVIDENCE.
 *
 * Black-box: what the system decided is on screen; how it decided never is.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, travelFade } from "../lib/anim";

const mono = { fontFamily: MONO } as const;

const PHONE = { x: 754, y: 104, w: 94, h: 172, cx: 801, cy: 190 };

const STATIONS: Array<{ x: number; label: string; color: string; start: number; check: number }> = [
  { x: 150, label: "VALIDATED FINDING", color: VERIFIED, start: 34, check: 44 },
  { x: 480, label: "TURNED INTO AN INSTRUCTION", color: INK, start: 96, check: 106 },
  // its check lands only once the camera returns and the phone reads EXECUTED
  { x: 801, label: "BACK TO THE OPERATOR", color: VERIFIED, start: 158, check: 316 },
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
  const half = label.length * 4.55 + 13;
  const chk = check > 0 ? pop(frame, fps, check) : 0;
  return (
    <g opacity={p} transform={`translate(0 ${5 * (1 - p)})`}>
      <text x={x + 8} y={316} textAnchor="middle" fill={color} fontSize={13} letterSpacing="0.1em" fontWeight={700} style={mono}>
        {label}
      </text>
      {check > 0 && (
        <g opacity={chk} transform={`translate(${x - half} 312) scale(${0.8 + 0.2 * chk})`}>
          <circle cx={0} cy={0} r={7} fill={GROUND} stroke={color} strokeWidth={1.6} />
          <path d="M-3.4 0 l2.7 2.7 l5.2 -6.2" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
};

export const ExecuteLoopV4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // signature camera: push IN on the phone, hold for the confirm, pull OUT
  // again so the loop-back can be drawn across the whole wide scene.
  const zoom = ease(frame, 190, 55) * (1 - ease(frame, 300, 40));
  const camScale = 1 + 0.95 * zoom;
  const camTx = 801 + (480 - 801) * zoom - camScale * PHONE.cx;
  const camTy = 190 + (210 - 190) * zoom - camScale * PHONE.cy;
  // the wide stations fall away during the push-in and return on the way out
  const wideVis = Math.max(1 - ease(frame, 192, 34), ease(frame, 304, 34));

  // 0 · the verified token from Connect arrives
  const token = ease(frame, 6, 22);

  // 1 · finding assembly
  const findingDraw = ease(frame, 10, 20);
  const rowH = easeOut(frame, 16, 14);
  const rowM = easeOut(frame, 22, 14);
  const validated = pop(frame, fps, 42);

  // arrows + packets
  const a1 = ease(frame, 48, 20);
  const pkt1 = ease(frame, 62, 30);
  const a2 = ease(frame, 112, 20);
  const pkt2 = ease(frame, 126, 30);

  // 2 · instruction card
  const instr = pop(frame, fps, 80);

  // 3 · phone + notification
  const phoneDraw = ease(frame, 150, 22);
  const detail = easeOut(frame, 212, 22);
  const confirm = interpolate(frame, [252, 260, 272], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const executed = pop(frame, fps, 278);

  // wide phase: the phone rings
  const bellIn = pop(frame, fps, 155);
  const bellOut = 1 - easeOut(frame, 196, 14);
  const bellVis = bellIn * bellOut;
  const ringAngle = Math.sin((frame - 155) * 0.8) * 8 * bellOut;
  const notif = ((frame - 152 + 200) % 20) / 20;

  // 4 · the literal loop-back, then the closing line (with its own check)
  const loop = ease(frame, 338, 40);
  const loopHead = easeOut(frame, 376, 8);
  const caption = easeOut(frame, 372, 16);

  return (
    <Film viewW={960} viewH={420}>
      <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
        {/* ── wide scene ──────────────────────────────────────────────────── */}
        <g opacity={wideVis}>
          {/* the verified result arriving from Connect */}
          <circle cx={-30 + 128 * token} cy={190} r={4.5} fill={VERIFIED} opacity={travelFade(token)} />

          {/* 1 · validated finding card */}
          <rect x={102} y={156} width={96} height={68} rx={8} fill={GROUND} stroke={INK} strokeWidth={1.6} {...draw(findingDraw)} />
          <text x={112} y={172} fill={INK} opacity={0.5} fontSize={8} letterSpacing="0.12em" fontWeight={700} style={mono}>
            FINDING
          </text>
          <g opacity={rowH}>
            <circle cx={116} cy={188} r={3} fill={HUMAN} />
            <line x1={124} y1={188} x2={188} y2={188} stroke={INK} strokeWidth={1.4} opacity={0.3} />
          </g>
          <g opacity={rowM}>
            <rect x={113} y={200} width={6} height={6} fill={MACHINE} />
            <line x1={124} y1={203} x2={188} y2={203} stroke={INK} strokeWidth={1.4} opacity={0.3} />
          </g>
          <g opacity={validated} transform={`scale(${0.8 + 0.2 * validated})`} style={{ transformOrigin: "186px 164px" }}>
            <circle cx={186} cy={164} r={8} fill={GROUND} stroke={VERIFIED} strokeWidth={1.6} />
            <path d="M182 164 l3 3 l6 -7" fill="none" stroke={VERIFIED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* arrow 1 + packet (the finding travels on, verified-green) */}
          {a1 > 0 && <line x1={206} y1={190} x2={206 + 210 * a1} y2={190} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a1 * 5)} />}
          <path d="M410 185 L420 190 L410 195" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 64, 8)} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={212 + 202 * pkt1} cy={190} r={4.5} fill={VERIFIED} opacity={travelFade(pkt1)} />

          {/* 2 · instruction card — the concrete action */}
          <g opacity={instr} transform={`scale(${0.86 + 0.14 * instr})`} style={{ transformOrigin: "480px 198px" }}>
            <rect x={424} y={150} width={112} height={96} rx={8} fill={GROUND} stroke={INK} strokeWidth={1.6} />
            <text x={434} y={166} fill={INK} opacity={0.5} fontSize={8} letterSpacing="0.12em" fontWeight={700} style={mono}>
              ACTION
            </text>
            <line x1={424} y1={172} x2={536} y2={172} stroke={INK} strokeWidth={1} opacity={0.15} />
            <text x={434} y={190} fill={INK} opacity={0.75} fontSize={9} style={mono}>
              DIE TEMP
            </text>
            <text x={527} y={190} textAnchor="end" fill={HUMAN} fontSize={11} fontWeight={700} style={mono}>
              +2 °C
            </text>
            {/* three SOP rows — first ticked, the rest waiting for the floor */}
            {[204, 218, 232].map((y, i) => (
              <g key={y}>
                <rect x={434} y={y - 7} width={9} height={9} rx={2} fill="none" stroke={HUMAN} strokeWidth={1.4} opacity={i === 0 ? 1 : 0.5} />
                <path d={`M436.5 ${y - 2.5} l1.8 1.8 l3.4 -4`} fill="none" stroke={HUMAN} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" opacity={i === 0 ? 1 : 0} />
                <line x1={450} y1={y - 2} x2={i === 0 ? 524 : i === 1 ? 508 : 516} y2={y - 2} stroke={INK} strokeWidth={1.2} opacity={0.3} />
              </g>
            ))}
          </g>

          {/* arrow 2 + packet (the action heads for the floor, terracotta) */}
          {a2 > 0 && <line x1={544} y1={190} x2={544 + 202 * a2} y2={190} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a2 * 5)} />}
          <path d="M740 185 L750 190 L740 195" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 150, 8)} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={550 + 194 * pkt2} cy={190} r={4.5} fill={HUMAN} opacity={travelFade(pkt2)} />

          {STATIONS.map((s) => (
            <StationLabel key={s.label} {...s} frame={frame} fps={fps} />
          ))}
        </g>

        {/* ── the phone persists through the push-in ───────────────────────── */}
        <g>
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

          <rect x={PHONE.x} y={PHONE.y} width={PHONE.w} height={PHONE.h} rx={16} fill={GROUND} stroke={INK} strokeWidth={2} {...draw(phoneDraw)} />
          <line x1={788} y1={118} x2={814} y2={118} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.3 * easeOut(frame, 162, 8)} />
          <rect x={764} y={130} width={74} height={126} rx={7} fill="none" stroke={INK} strokeWidth={1} opacity={0.18 * easeOut(frame, 168, 10)} />

          {/* wide phase: a vibrating bell — the notification arriving */}
          {bellVis > 0.02 && (
            <g opacity={bellVis} transform={`rotate(${ringAngle} 801 170)`}>
              <g transform="translate(801 181)">
                <circle cx={0} cy={-11} r={1.8} fill={HUMAN} />
                <path d="M-9 6 C -9 -4 -5 -9 0 -9 C 5 -9 9 -4 9 6 L 11 9 L -11 9 Z" fill="none" stroke={HUMAN} strokeWidth={1.7} strokeLinejoin="round" />
                <path d="M-3.4 9 a3.4 3 0 0 0 6.8 0" fill="none" stroke={HUMAN} strokeWidth={1.7} />
              </g>
            </g>
          )}

          {/* zoom-phase notification detail */}
          {detail > 0 && (
            <g opacity={detail * Math.max(0.25, zoom)}>
              <text x={772} y={146} fill={INK} opacity={0.55} fontSize={7.5} letterSpacing="0.12em" fontWeight={700} style={mono}>
                OPPR
              </text>
              <line x1={772} y1={152} x2={830} y2={152} stroke={INK} strokeWidth={1} opacity={0.15} />
              <text x={772} y={172} fill={MACHINE} fontSize={7.5} letterSpacing="0.02em" fontWeight={700} style={mono}>
                DIE TEMP LOW
              </text>
              <text x={772} y={190} fill={INK} opacity={0.55} fontSize={7} letterSpacing="0.08em" style={mono}>
                ADJUST
              </text>
              <text x={772} y={214} fill={HUMAN} fontSize={16} fontWeight={700} style={mono}>
                +2 °C
              </text>

              {executed <= 0 ? (
                <g>
                  <rect x={772} y={230} width={58} height={20} rx={10} fill={confirm > 0.4 ? HUMAN : "none"} stroke={HUMAN} strokeWidth={1.3} opacity={detail} />
                  <text x={801} y={243} textAnchor="middle" fill={confirm > 0.4 ? GROUND : HUMAN} fontSize={7.5} letterSpacing="0.1em" fontWeight={700} style={mono}>
                    CONFIRM
                  </text>
                  {confirm > 0.05 && <circle cx={801} cy={240} r={12 + 16 * confirm} fill="none" stroke={HUMAN} strokeWidth={1.2} opacity={0.6 * (1 - confirm)} />}
                </g>
              ) : (
                <g opacity={Math.min(1, executed)} transform={`translate(0 ${6 * (1 - executed)})`}>
                  <circle cx={778} cy={240} r={7} fill={GROUND} stroke={VERIFIED} strokeWidth={1.6} />
                  <path d="M774.5 240 l2.6 2.6 l5 -6" fill="none" stroke={VERIFIED} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
                  <text x={789} y={243} fill={VERIFIED} fontSize={7.5} letterSpacing="0.04em" fontWeight={700} style={mono}>
                    EXECUTED
                  </text>
                </g>
              )}
            </g>
          )}
        </g>

        {/* ── the loop, drawn: executed action → new evidence → the finding ── */}
        {loop > 0 && (
          <>
            <path
              d="M801 288 C800 356 640 374 480 374 C300 374 152 352 152 240"
              fill="none"
              stroke={VERIFIED}
              strokeWidth={1.6}
              strokeLinecap="round"
              opacity={0.8}
              {...draw(loop)}
            />
            <path
              d="M145 249 L152 236 L159 249"
              fill="none"
              stroke={VERIFIED}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={loopHead}
            />
          </>
        )}
      </g>

      {/* ── fixed overlay: the closing line, centred over the loop, with a
             check that lands as the loop-back arrow reaches the finding ────── */}
      {caption > 0 && (
        <g transform={`translate(0 ${5 * (1 - caption)})`}>
          <text x={480} y={408} textAnchor="middle" fill={INK} opacity={0.6 * caption} fontSize={12} letterSpacing="0.1em" fontWeight={700} style={mono}>
            EVERY EXECUTED ACTION CREATES NEW EVIDENCE
          </text>
          {/* measure-free: text is middle-anchored, the check sits to its left */}
          {(() => {
            const half = "EVERY EXECUTED ACTION CREATES NEW EVIDENCE".length * 4.2 + 22;
            const chk = pop(frame, fps, 386);
            if (chk <= 0) return null;
            return (
              <g opacity={chk} transform={`translate(${480 - half} 404) scale(${0.8 + 0.2 * chk})`}>
                <circle cx={0} cy={0} r={7.5} fill={GROUND} stroke={VERIFIED} strokeWidth={1.7} />
                <path d="M-3.6 0 l2.8 2.8 l5.4 -6.4" fill="none" stroke={VERIFIED} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })()}
        </g>
      )}
    </Film>
  );
};
