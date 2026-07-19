/*
 * Film 1 (v4) — capture-v4  (the combined widescreen capture film)
 *
 * Replaces the three square capture films (speak / photo / check) with ONE
 * landscape film, same format as connect-v4 / execute-v4. See SCRIPTS-V4.md.
 *
 * Story: one operator, on the floor, captures what the sensors miss in three
 * ways — SPEAK, PHOTO, CHECK. Each capture drops a terracotta context chip onto
 * a rail along the bottom, and that rail is the seed of the Connect timeline.
 * The chip (check / photo / voice glyph) is the shared currency of the trilogy.
 *
 * Black-box (IMPLEMENTATION.md §5): we show the three acts and the three chips,
 * never speech-to-table or photo-to-rows extraction.
 *
 * Reuses the brand vocabulary of the earlier films: the Operator figure (three
 * poses, cross-faded), a waveform, a compact HMI + shutter, checklist gates, and
 * the Connect input-chip glyphs.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, typed } from "../lib/anim";
import { OperatorV3 as Operator } from "../lib/OperatorV3";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

// ── layout (viewBox 960 × 420) ──────────────────────────────────────────────
const RAIL_Y = 392;
const RAIL_X0 = 60;
const RAIL_X1 = 868;
const CHIP_Y = 344; // resting centre of a chip above the rail
const OP = { tx: 96, ty: 110, s: 0.92 }; // operator placement (feet ≈ y382)
// operator phone anchor points in view coords (for terracotta source links)
const OP_SPEAK_PHONE: [number, number] = [186, 197];
const OP_PHOTO_PHONE: [number, number] = [170, 180];
const OP_LIST_PHONE: [number, number] = [170, 224];

// three capture acts → three evenly-spaced rail slots (left = earlier)
type Kind = "voice" | "photo" | "check";
const ACTS: Array<{ kind: Kind; slotX: number; focus: [number, number]; drop: number; label: string }> = [
  { kind: "voice", slotX: 430, focus: [430, 150], drop: 150, label: "SPOKEN" },
  { kind: "photo", slotX: 600, focus: [760, 236], drop: 268, label: "PHOTOGRAPHED" },
  { kind: "check", slotX: 770, focus: [620, 292], drop: 412, label: "CHECKED" },
];

// crossfade band: fade in over [a,ad], hold, fade out over [b,bd]
const band = (f: number, a: number, ad: number, b: number, bd: number): number =>
  Math.max(0, Math.min(easeOut(f, a, ad), 1 - ease(f, b, bd)));

// animated waveform bars (the act of speaking)
const WaveBars: React.FC<{ frame: number; energy: number; cx: number; cy: number; n: number; gap: number; maxH: number; sw: number }> = ({
  frame,
  energy,
  cx,
  cy,
  n,
  gap,
  maxH,
  sw,
}) => (
  <>
    {Array.from({ length: n }).map((_, i) => {
      const seed = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.9 + 0.6));
      const pulse = 0.5 + 0.5 * Math.sin(frame / 3.4 + i * 0.85);
      const h = Math.max(1.2, maxH * seed * (0.3 + 0.7 * pulse) * (0.25 + 0.75 * energy));
      const x = cx + (i - (n - 1) / 2) * gap;
      return <line key={i} x1={x} y1={cy - h} x2={x} y2={cy + h} stroke={HUMAN} strokeWidth={sw} strokeLinecap="round" {...nss} />;
    })}
  </>
);

// the terracotta context chip — the shared currency of the trilogy
const ContextChip: React.FC<{ cx: number; cy: number; kind: Kind; s: number; opacity: number }> = ({ cx, cy, kind, s, opacity }) => {
  if (opacity <= 0) return null;
  return (
    <g opacity={Math.min(1, opacity)} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <rect x={-20} y={-20} width={40} height={40} rx={9} fill={GROUND} stroke={HUMAN} strokeWidth={1.6} {...nss} />
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

export const CaptureV4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // operator pose crossfades (same transform, opacity swaps read as arms moving)
  const opSpeak = band(frame, 20, 20, 172, 16);
  const opPhoto = band(frame, 172, 16, 300, 16);
  const opList = easeOut(frame, 300, 16);

  // per-act focus-UI visibility
  const uiSpeak = band(frame, 44, 20, 150, 16);
  const uiPhoto = band(frame, 176, 18, 300, 16);
  const uiCheck = band(frame, 306, 18, 430, 16);

  // speak: bubble wipe + typed note + waveform energy
  const bubble = ease(frame, 48, 26);
  const speakEnergy = 1 - ease(frame, 128, 24);
  const NOTE = ["Pump P6 sounds rough,", "getting worse since nights."];
  const NOTE_START = [78, 100];

  // photo: viewfinder snap, camera rise, shutter flash
  const vf = pop(frame, fps, 206);
  const shutter = ease(frame, 246, 6) * (1 - ease(frame, 256, 10)); // 0→1→0 flash

  // check: three gates tick
  const GATES = ["GUARD IN PLACE", "SAMPLE TAKEN", "AREA CLEAR"];
  const GATE_AT = [332, 362, 392];

  // payoff
  const payoff = easeOut(frame, 442, 16);
  const onward = easeOut(frame, 462, 16);

  return (
    <Film viewW={960} viewH={420}>
      {/* ── the capture rail (seed of the Connect timeline) ─────────────── */}
      <line x1={RAIL_X0} y1={RAIL_Y} x2={RAIL_X1} y2={RAIL_Y} stroke={INK} strokeWidth={1.5} {...draw(ease(frame, 0, 24))} />
      {[132, 220, 308, 396, 484, 572, 660, 748, 836].map((x, i) => (
        <line key={x} x1={x} y1={RAIL_Y - 4} x2={x} y2={RAIL_Y + 4} stroke={INK} strokeWidth={1} opacity={0.2 * easeOut(frame, 8 + i * 2, 10)} />
      ))}

      {/* small clock at the rail origin */}
      {(() => {
        const p = ease(frame, 6, 16);
        if (p <= 0) return null;
        const cx = 52;
        const cy = 356;
        return (
          <g opacity={p}>
            <circle cx={cx} cy={cy} r={12} fill={GROUND} stroke={INK} strokeWidth={1.5} {...draw(p)} />
            <line x1={cx} y1={cy} x2={cx} y2={cy - 7} stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
            <line x1={cx} y1={cy} x2={cx + 5} y2={cy + 2} stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
            <text x={cx} y={cy + 26} textAnchor="middle" fill={INK} opacity={0.55} fontSize={11} letterSpacing="0.06em" style={mono}>
              14:00
            </text>
          </g>
        );
      })()}

      {/* constant eyebrow, top-left */}
      <text x={RAIL_X0} y={40} fill={HUMAN} fontSize={13} letterSpacing="0.14em" fontWeight={700} style={mono} opacity={0.9 * easeOut(frame, 14, 14)}>
        CAPTURE
      </text>
      <text x={RAIL_X0 + 92} y={40} fill={INK} opacity={0.4 * easeOut(frame, 18, 14)} fontSize={13} letterSpacing="0.1em" fontWeight={700} style={mono}>
        · ON THE FLOOR
      </text>

      {/* ── the operator (three poses, cross-faded in place) ─────────────── */}
      <g transform={`translate(${OP.tx} ${OP.ty}) scale(${OP.s})`}>
        {opSpeak > 0 && (
          <Operator
            pose="speak"
            id="v4-speak"
            opacity={opSpeak}
            screen={
              <g>
                {[-4, 0, 4].map((x, i) => {
                  const h = 2.5 + 2.5 * Math.abs(Math.sin(frame / 3 + i)) * speakEnergy;
                  return <line key={x} x1={x} y1={-h} x2={x} y2={h} stroke={HUMAN} strokeWidth={1.8} strokeLinecap="round" {...nss} />;
                })}
              </g>
            }
          />
        )}
        {opPhoto > 0 && <Operator pose="photo" id="v4-photo" opacity={opPhoto} />}
        {opList > 0 && <Operator pose="list" id="v4-list" opacity={opList} />}
      </g>

      {/* ══ ACT 1 · SPEAK ════════════════════════════════════════════════ */}
      {uiSpeak > 0 && (
        <g opacity={uiSpeak}>
          {/* terracotta link: the note comes from the operator's phone */}
          <line
            x1={OP_SPEAK_PHONE[0]}
            y1={OP_SPEAK_PHONE[1]}
            x2={292}
            y2={140}
            stroke={HUMAN}
            strokeWidth={1.3}
            strokeDasharray="4 5"
            opacity={0.55 * bubble}
          />
          {/* speech bubble */}
          <rect x={286} y={58} width={300} height={86} rx={14} fill={GROUND} stroke={INK} strokeWidth={1.5} {...draw(bubble)} />
          <g opacity={Math.min(1, bubble * 1.4)}>
            <WaveBars frame={frame} energy={speakEnergy} cx={312} cy={80} n={6} gap={6} maxH={9} sw={2.4} />
          </g>
          {NOTE.map((t, i) => (
            <text key={t} x={352} y={82 + i * 24} fill={INK} fontSize={13} style={mono}>
              {typed(t, frame, NOTE_START[i])}
            </text>
          ))}
          <text x={430} y={44} textAnchor="middle" fill={HUMAN} opacity={0.75} fontSize={9} letterSpacing="0.14em" fontWeight={700} style={mono}>
            SPEAK
          </text>
        </g>
      )}

      {/* ══ ACT 2 · PHOTO ════════════════════════════════════════════════ */}
      {uiPhoto > 0 && (
        <g opacity={uiPhoto}>
          {/* aim link from the operator to the machine */}
          <line x1={OP_PHOTO_PHONE[0]} y1={OP_PHOTO_PHONE[1]} x2={664} y2={170} stroke={HUMAN} strokeWidth={1.3} strokeDasharray="4 5" opacity={0.5 * vf} />
          {/* compact HMI screen on a shallow box */}
          <path d="M660 108 L672 98 L864 98 L852 108 Z" fill={INK} fillOpacity={0.05} stroke={INK} strokeOpacity={0.3} strokeWidth={1} {...nss} />
          <path d="M852 108 L864 98 L864 238 L852 248 Z" fill={INK} fillOpacity={0.08} stroke={INK} strokeOpacity={0.3} strokeWidth={1} {...nss} />
          <rect x={660} y={108} width={192} height={140} rx={5} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
          <line x1={660} y1={130} x2={852} y2={130} stroke={INK} strokeWidth={1} opacity={0.35} />
          <circle cx={674} cy={119} r={2} fill={INK} opacity={0.35} />
          <circle cx={684} cy={119} r={2} fill={INK} opacity={0.35} />
          {[
            ["TEMP", "62 °C"],
            ["PRESS", "2.4 bar"],
            ["SPEED", "1450 RPM"],
            ["STATUS", "RUN"],
          ].map(([l, v], i) => (
            <g key={l} style={mono} fontSize={11}>
              <text x={674} y={152 + i * 22} fill={INK} opacity={0.6}>
                {l}
              </text>
              <text x={840} y={152 + i * 22} textAnchor="end" fill={MACHINE}>
                {v}
              </text>
            </g>
          ))}
          {/* terracotta viewfinder brackets snap onto the screen */}
          {[
            { d: "M666 128 V112 H682", dx: -10, dy: -10 },
            { d: "M830 112 H846 V128", dx: 10, dy: -10 },
            { d: "M846 228 V244 H830", dx: 10, dy: 10 },
            { d: "M682 244 H666 V228", dx: -10, dy: 10 },
          ].map(({ d, dx, dy }, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={HUMAN}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={Math.min(1, vf * 1.6)}
              transform={`translate(${dx * (1 - vf)} ${dy * (1 - vf)})`}
              {...nss}
            />
          ))}
          <text x={756} y={90} textAnchor="middle" fill={HUMAN} opacity={0.75} fontSize={9} letterSpacing="0.14em" fontWeight={700} style={mono}>
            PHOTO
          </text>
        </g>
      )}

      {/* ══ ACT 3 · CHECK ════════════════════════════════════════════════ */}
      {uiCheck > 0 && (
        <g opacity={uiCheck}>
          {/* link from the operator's phone to the enlarged checklist */}
          <line x1={OP_LIST_PHONE[0]} y1={OP_LIST_PHONE[1]} x2={560} y2={200} stroke={HUMAN} strokeWidth={1.3} strokeDasharray="4 5" opacity={0.5 * easeOut(frame, 306, 16)} />
          {/* enlarged phone panel */}
          <rect x={558} y={70} width={120} height={222} rx={16} fill={GROUND} stroke={INK} strokeWidth={1.8} {...draw(easeOut(frame, 306, 18))} />
          <line x1={600} y1={86} x2={636} y2={86} stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.3} />
          <text x={578} y={116} fill={INK} opacity={0.55} fontSize={9} letterSpacing="0.1em" fontWeight={700} style={mono}>
            PRE-START
          </text>
          {GATES.map((g, i) => {
            const gy = 142 + i * 34;
            const on = pop(frame, fps, GATE_AT[i]);
            return (
              <g key={g}>
                <circle cx={582} cy={gy} r={9} fill={GROUND} stroke={HUMAN} strokeWidth={1.5} opacity={0.5 + 0.5 * on} />
                {on > 0.02 && (
                  <path d={`M577 ${gy} l3.2 3.2 l6 -7`} fill="none" stroke={HUMAN} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" opacity={on} />
                )}
                <text x={598} y={gy + 4} fill={INK} opacity={0.5 + 0.4 * on} fontSize={8.5} letterSpacing="0.04em" style={mono}>
                  {g}
                </text>
              </g>
            );
          })}
          <text x={618} y={62} textAnchor="middle" fill={HUMAN} opacity={0.75} fontSize={9} letterSpacing="0.14em" fontWeight={700} style={mono}>
            CHECK
          </text>
        </g>
      )}

      {/* ── chips fly onto the rail, one per act, and stay ───────────────── */}
      {ACTS.map((a) => {
        if (frame < a.drop) return null;
        const dt = ease(frame, a.drop, 22);
        const cx = a.focus[0] + (a.slotX - a.focus[0]) * dt;
        const cy = a.focus[1] + (CHIP_Y - a.focus[1]) * dt;
        const appear = ease(frame, a.drop, 8);
        const landed = easeOut(frame, a.drop + 18, 12);
        return (
          <g key={a.kind}>
            {/* rail dot + connector once landed */}
            <circle cx={a.slotX} cy={RAIL_Y} r={5} fill={HUMAN} opacity={landed} />
            <line x1={a.slotX} y1={CHIP_Y + 20} x2={a.slotX} y2={RAIL_Y} stroke={HUMAN} strokeWidth={1.3} opacity={0.55} {...draw(landed)} />
            {/* slot label under the rail */}
            <text x={a.slotX} y={RAIL_Y + 20} textAnchor="middle" fill={HUMAN} opacity={0.7 * landed} fontSize={8.5} letterSpacing="0.1em" fontWeight={700} style={mono}>
              {a.label}
            </text>
            {/* the chip itself, flying in then resting */}
            <ContextChip cx={cx} cy={cy} kind={a.kind} s={0.62 + 0.38 * dt} opacity={appear} />
          </g>
        );
      })}

      {/* ── payoff: context captured, ready to connect ───────────────────── */}
      {payoff > 0 && (
        <g opacity={payoff} transform={`translate(0 ${5 * (1 - payoff)})`}>
          <text x={600} y={296} textAnchor="middle" fill={INK} fontSize={14} letterSpacing="0.06em" fontWeight={700} style={mono}>
            CONTEXT, CAPTURED
          </text>
          <text x={600} y={316} textAnchor="middle" fill={VERIFIED} opacity={0.85} fontSize={10} letterSpacing="0.14em" fontWeight={700} style={mono}>
            READY TO CONNECT
          </text>
        </g>
      )}
      {/* forward arrow — the chips feed onward (into Connect) */}
      {onward > 0 && (
        <g opacity={onward}>
          <line x1={RAIL_X1} y1={RAIL_Y} x2={RAIL_X1 + 30} y2={RAIL_Y} stroke={INK} strokeWidth={1.5} />
          <path d={`M${RAIL_X1 + 24} ${RAIL_Y - 6} L${RAIL_X1 + 34} ${RAIL_Y} L${RAIL_X1 + 24} ${RAIL_Y + 6}`} fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* shutter flash (photo act) — above everything */}
      {shutter > 0.01 && <rect x={0} y={0} width={960} height={420} fill={GROUND} opacity={0.9 * shutter} />}
    </Film>
  );
};
