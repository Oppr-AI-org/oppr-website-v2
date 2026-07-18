/*
 * Film 2 — capture-photo (SCRIPTS.md §3)
 * An operator photographs a machine's HMI screen; the captured photo becomes
 * a clean list of readings.
 *
 * Phase A (wide): operator (photo pose) aims his phone at a machine whose
 *   screen shows live readings; viewfinder brackets frame the screen; shutter.
 * Phase B (photo): the captured HMI panel develops, values are boxed, and the
 *   readings extract into a list.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO } from "../brand";
import { Film, easeOut, pop } from "../lib/anim";
import { Operator } from "../lib/Operator";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

const PHOTO_AT = 66; // shutter fires here; Phase B time is fb = frame - PHOTO_AT

const ROWS = [
  { label: "TEMP", value: "62 °C", y: 64, box: { x: 252, w: 50 } },
  { label: "PRESS", value: "2.4 bar", y: 90, box: { x: 238, w: 64 } },
  { label: "SPEED", value: "1450 RPM", y: 116, box: { x: 230, w: 72 } },
  { label: "STATUS", value: "RUN", y: 142, box: { x: 266, w: 36 } },
];

const LIST = ["TEMP · 62 °C", "PRESS · 2.4 bar", "SPEED · 1450 RPM", "STATUS · RUN"];

const CORNERS = [
  { d: "M34 20 V4 H52", dx: -12, dy: -12 },
  { d: "M308 4 H326 V20", dx: 12, dy: -12 },
  { d: "M326 160 V178 H308", dx: 12, dy: 12 },
  { d: "M52 178 H34 V162", dx: -12, dy: 12 },
];

// the machine's own small screen (Phase A), shown on the cabinet
const MROWS = [
  { label: "TEMP", value: "62°C" },
  { label: "PRESS", value: "2.4bar" },
  { label: "SPEED", value: "1450" },
  { label: "STATUS", value: "RUN" },
];

// ── Phase A ─────────────────────────────────────────────────────────────
const Machine: React.FC<{ frame: number }> = ({ frame }) => {
  const on = easeOut(frame, 6, 16);
  return (
    <g opacity={on} transform={`translate(0 ${8 * (1 - on)})`}>
      {/* cabinet */}
      <rect x={206} y={138} width={128} height={118} rx={6} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
      {/* mounted HMI screen */}
      <rect x={218} y={150} width={104} height={80} rx={4} fill={GROUND} stroke={INK} strokeWidth={1.3} {...nss} />
      <line x1={218} y1={164} x2={322} y2={164} stroke={INK} strokeWidth={1} opacity={0.35} />
      <circle cx={226} cy={157} r={1.6} fill={INK} opacity={0.35} />
      <circle cx={232} cy={157} r={1.6} fill={INK} opacity={0.35} />
      {MROWS.map(({ label, value }, i) => (
        <g key={label} style={mono} fontSize={7}>
          <text x={225} y={180 + i * 12} fill={INK} opacity={0.55}>
            {label}
          </text>
          <text x={315} y={180 + i * 12} textAnchor="end" fill={MACHINE}>
            {value}
          </text>
        </g>
      ))}
      {/* motor / pump capsule under the cabinet */}
      <rect x={214} y={262} width={112} height={30} rx={15} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
      <line x1={244} y1={262} x2={244} y2={292} stroke={INK} strokeWidth={1} opacity={0.4} />
      <line x1={296} y1={262} x2={296} y2={292} stroke={INK} strokeWidth={1} opacity={0.4} />
      <circle cx={270} cy={277} r={6} fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5} />
      {/* flange / conduit to the cabinet */}
      <line x1={200} y1={168} x2={206} y2={168} stroke={INK} strokeWidth={1.5} {...nss} />
      <line x1={200} y1={200} x2={206} y2={200} stroke={INK} strokeWidth={1.5} {...nss} />
    </g>
  );
};

export const CapturePhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fb = frame - PHOTO_AT;

  // shutter: white flash peaks as the photo is taken
  const flash = interpolate(frame, [56, 60, 70], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phaseA = 1 - easeOut(frame, 62, 8); // wide scene fades under the flash
  const phaseB = easeOut(frame, PHOTO_AT, 10); // captured photo fades in

  // Phase A viewfinder settles onto the machine screen, then snaps
  const vf = pop(frame, fps, 26);
  const kick = 1 - 0.02 * interpolate(frame, [56, 60, 66], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Film viewW={360} viewH={320}>
      {/* ── Phase A: operator aims at the machine ─────────────────────── */}
      {phaseA > 0 && (
        <g opacity={phaseA} transform={`scale(${kick})`} style={{ transformOrigin: "270px 190px" }}>
          <Machine frame={frame} />

          {/* operator, photo pose, aiming from the left */}
          <g transform="translate(4 96) scale(0.58)">
            <Operator pose="photo" id="photo-op" />
          </g>

          {/* viewfinder brackets frame the machine screen */}
          {[
            { d: "M212 158 V148 H222", dx: -10, dy: -10 },
            { d: "M318 148 H328 V158", dx: 10, dy: -10 },
            { d: "M328 224 V234 H318", dx: 10, dy: 10 },
            { d: "M222 234 H212 V224", dx: -10, dy: 10 },
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
            />
          ))}

          <text
            x={270}
            y={306}
            textAnchor="middle"
            fill={HUMAN}
            opacity={0.6 * easeOut(frame, 34, 12)}
            fontSize={8}
            letterSpacing="0.12em"
            fontWeight={700}
            style={mono}
          >
            CAPTURING
          </text>
        </g>
      )}

      {/* ── Phase B: the captured photo develops ──────────────────────── */}
      {phaseB > 0 && (
        <g opacity={phaseB}>
          {/* HMI panel (the photo) */}
          <rect x={48} y={14} width={264} height={152} rx={8} fill="none" stroke={INK} strokeWidth={1.5} />
          <line x1={48} y1={40} x2={312} y2={40} stroke={INK} strokeWidth={1} opacity={0.4} />
          <circle cx={62} cy={27} r={2.5} fill={INK} opacity={0.35} />
          <circle cx={72} cy={27} r={2.5} fill={INK} opacity={0.35} />
          {ROWS.map(({ label, value, y }, i) => (
            <g key={label} style={mono} fontSize={12} opacity={easeOut(fb, 4 + i * 3, 10)}>
              <text x={68} y={y} fill={INK} opacity={0.6}>
                {label}
              </text>
              <text x={296} y={y} textAnchor="end" fill={MACHINE}>
                {value}
              </text>
            </g>
          ))}

          {/* corner marks — the captured frame */}
          {CORNERS.map(({ d }, i) => (
            <path key={i} d={d} fill="none" stroke={HUMAN} strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
          ))}

          {/* bounding boxes draw on around the values */}
          {ROWS.map(({ box, y }, i) => {
            const p = easeOut(fb, 22 + i * 8, 16);
            if (p <= 0) return null;
            return (
              <rect
                key={i}
                x={box.x}
                y={y - 12}
                width={box.w * p}
                height={17}
                rx={3}
                fill="none"
                stroke={HUMAN}
                strokeWidth={1.3}
              />
            );
          })}

          {(() => {
            const p = easeOut(fb, 60, 12);
            if (p <= 0) return null;
            return (
              <text
                x={180}
                y={200}
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

          {/* extracted list glides in */}
          {LIST.map((item, i) => {
            const p = easeOut(fb, 72 + i * 14, 16);
            if (p <= 0) return null;
            return (
              <g key={item} opacity={p} transform={`translate(${-14 * (1 - p)} 0)`}>
                <rect x={70} y={214 + i * 25} width={7} height={7} fill={MACHINE} />
                <text x={88} y={222 + i * 25} fill={INK} fontSize={11} style={mono}>
                  {item}
                </text>
              </g>
            );
          })}
        </g>
      )}

      {/* shutter flash sits above both phases */}
      <rect x={0} y={0} width={360} height={320} fill={GROUND} opacity={flash} />
    </Film>
  );
};
