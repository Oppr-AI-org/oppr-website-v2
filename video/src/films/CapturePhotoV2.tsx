/*
 * Film 2b — capture-photo-v2  (a kept-separate upgrade of capture-photo)
 *
 * Beat: an HMI screen mounted on a machine (a box with a little depth, a green
 * power light, a key switch and a big red E-stop) → the camera pushes in and a
 * camera icon frames it → the shutter fires → the four readings are boxed and
 * extracted into a timestamped spreadsheet → a green ✓ VALID confirms the
 * captured components match the source.
 *
 * The original `capture-photo` composition is left untouched so we can always
 * go back to it.
 */
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, easeOut, pop, win } from "../lib/anim";

const mono = { fontFamily: MONO } as const;
const nss = { vectorEffect: "non-scaling-stroke" } as const;

const PHOTO_AT = 70; // shutter fires; Phase B time is fb = frame - PHOTO_AT
const TS = "14:23:07";
const DATE = "2026-07-18";

const ROWS = [
  { label: "TEMP", value: "62 °C", y: 52, box: { x: 250, w: 52 } },
  { label: "PRESS", value: "2.4 bar", y: 78, box: { x: 236, w: 66 } },
  { label: "SPEED", value: "1450 RPM", y: 104, box: { x: 228, w: 74 } },
  { label: "STATUS", value: "RUN", y: 130, box: { x: 264, w: 38 } },
];

// Phase-A HMI rows (small, on the machine's screen)
const AROWS = [
  { label: "TEMP", value: "62 °C" },
  { label: "PRESS", value: "2.4 bar" },
  { label: "SPEED", value: "1450 RPM" },
  { label: "STATUS", value: "RUN" },
];

// spreadsheet rows for Phase B
const SHEET = [
  { metric: "TEMP", value: "62 °C" },
  { metric: "PRESS", value: "2.4 bar" },
  { metric: "SPEED", value: "1450 RPM" },
  { metric: "STATUS", value: "RUN" },
];

// line-art camera — signals the act of taking the picture
const CameraIcon: React.FC<{ rise: number; click: number }> = ({ rise, click }) => (
  <g
    transform={`translate(180 ${268 - 8 * rise}) scale(${0.94 + 0.06 * rise - 0.06 * click})`}
    opacity={rise}
  >
    <rect x={-26} y={-15} width={52} height={30} rx={6} fill={GROUND} stroke={HUMAN} strokeWidth={1.8} {...nss} />
    <path d="M-10 -15 l3.5 -7 h13 l3.5 7 Z" fill={GROUND} stroke={HUMAN} strokeWidth={1.8} strokeLinejoin="round" {...nss} />
    <circle cx={17} cy={-8} r={1.8} fill={HUMAN} />
    <circle cx={0} cy={0} r={9.5} fill="none" stroke={HUMAN} strokeWidth={1.8} {...nss} />
    <circle cx={0} cy={0} r={4.5} fill={click > 0.5 ? HUMAN : "none"} stroke={HUMAN} strokeWidth={1.5} {...nss} />
    {click > 0.05 && (
      <circle cx={0} cy={0} r={9.5 + 16 * click} fill="none" stroke={HUMAN} strokeWidth={1.4} opacity={0.6 * (1 - click)} />
    )}
  </g>
);

// the machine: HMI screen + control faceplate on a shallow extruded box
const MachineUnit: React.FC<{ blink: number; vf: number }> = ({ blink, vf }) => (
  <>
    {/* --- box depth (top + right faces, drawn behind the front) --- */}
    <path d="M46 62 L62 50 L302 50 L286 62 Z" fill={INK} fillOpacity={0.04} stroke={INK} strokeOpacity={0.35} strokeWidth={1.1} {...nss} />
    <path d="M286 62 L302 50 L302 192 L286 204 Z" fill={INK} fillOpacity={0.07} stroke={INK} strokeOpacity={0.35} strokeWidth={1.1} {...nss} />
    {/* --- front face of the machine --- */}
    <rect x={46} y={62} width={240} height={142} rx={4} fill={GROUND} stroke={INK} strokeWidth={1.6} {...nss} />

    {/* --- HMI screen inset --- */}
    <rect x={58} y={76} width={140} height={116} rx={5} fill={GROUND} stroke={INK} strokeWidth={1.3} {...nss} />
    <line x1={58} y1={96} x2={198} y2={96} stroke={INK} strokeWidth={1} opacity={0.4} />
    <circle cx={70} cy={87} r={2} fill={INK} opacity={0.35} />
    <circle cx={79} cy={87} r={2} fill={INK} opacity={0.35} />
    {AROWS.map(({ label, value }, i) => (
      <g key={label} style={mono} fontSize={9}>
        <text x={68} y={116 + i * 18} fill={INK} opacity={0.6}>
          {label}
        </text>
        <text x={188} y={116 + i * 18} textAnchor="end" fill={MACHINE}>
          {value}
        </text>
      </g>
    ))}

    {/* --- control faceplate on the right --- */}
    <line x1={208} y1={72} x2={208} y2={194} stroke={INK} strokeWidth={1} opacity={0.15} />
    {/* green power indicator */}
    <circle cx={247} cy={84} r={7} fill={VERIFIED} opacity={0.35 + 0.55 * blink} />
    <circle cx={247} cy={84} r={7} fill="none" stroke={INK} strokeWidth={1.2} {...nss} />
    <text x={247} y={102} textAnchor="middle" fill={INK} opacity={0.45} fontSize={6} letterSpacing="0.1em" style={mono}>
      PWR
    </text>
    {/* key switch, turned to ON */}
    <circle cx={247} cy={126} r={12} fill={GROUND} stroke={INK} strokeWidth={1.4} {...nss} />
    <circle cx={247} cy={126} r={2.4} fill="none" stroke={INK} strokeWidth={1.2} {...nss} />
    <line x1={247} y1={126} x2={255} y2={118} stroke={HUMAN} strokeWidth={2} strokeLinecap="round" {...nss} />
    <text x={247} y={148} textAnchor="middle" fill={INK} opacity={0.45} fontSize={6} letterSpacing="0.08em" style={mono}>
      KEY
    </text>
    {/* big red E-stop */}
    <circle cx={247} cy={172} r={18} fill="none" stroke={INK} strokeWidth={1.3} {...nss} />
    <circle cx={247} cy={172} r={14} fill={HUMAN} stroke={INK} strokeWidth={1} {...nss} />
    <path d="M241 168 a7 6 0 0 1 12 0" fill="none" stroke={GROUND} strokeWidth={1.2} opacity={0.5} {...nss} />

    {/* viewfinder brackets frame the screen */}
    {[
      { d: "M50 88 V68 H68", dx: -10, dy: -10 },
      { d: "M188 68 H206 V88", dx: 10, dy: -10 },
      { d: "M206 182 V202 H188", dx: 10, dy: 10 },
      { d: "M68 202 H50 V182", dx: -10, dy: 10 },
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
  </>
);

export const CapturePhotoV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fb = frame - PHOTO_AT;

  // Phase A camera push-in on the screen (gentle — the machine stays readable)
  const zA = interpolate(frame, [0, PHOTO_AT], [0.85, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const phaseA = 1 - easeOut(frame, 64, 8);
  const phaseB = easeOut(frame, PHOTO_AT, 10);

  const vf = pop(frame, fps, 22);
  const camRise = easeOut(frame, 30, 14);
  const click = interpolate(frame, [52, 58, 68], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [58, 66, 78], [0, 0.92, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blink = frame % 44 < 26 ? 1 : 0.25;

  // Phase B spreadsheet + validation
  const sheet = easeOut(fb, 60, 14);
  const valid = pop(fb, fps, 152);
  const validPulseP = easeOut(fb, 162, 30);
  const validPulseO = fb >= 162 ? 0.5 * (1 - win(fb, 162, 30)) : 0;

  // table geometry
  const TX = 36;
  const TW = 288;
  const TY = 174;
  const HH = 16; // header height
  const RH = 18; // row height
  const COL1 = 150; // metric | value divider
  const COL2 = 246; // value | time divider

  return (
    <Film viewW={360} viewH={320}>
      {/* ── Phase A: photographing the machine ────────────────────────── */}
      {phaseA > 0 && (
        <g opacity={phaseA}>
          <g transform={`translate(129 134) scale(${zA}) translate(-129 -134)`}>
            <MachineUnit blink={blink} vf={vf} />
          </g>
          <CameraIcon rise={camRise} click={click} />
          <text
            x={180}
            y={300}
            textAnchor="middle"
            fill={HUMAN}
            opacity={0.6 * camRise}
            fontSize={8}
            letterSpacing="0.14em"
            fontWeight={700}
            style={mono}
          >
            TAKING PHOTO
          </text>
        </g>
      )}

      {/* ── Phase B: captured photo → spreadsheet → VALID ─────────────── */}
      {phaseB > 0 && (
        <g opacity={phaseB}>
          {/* the captured photo */}
          <rect x={44} y={12} width={272} height={126} rx={8} fill="none" stroke={INK} strokeWidth={1.5} />
          <line x1={44} y1={34} x2={316} y2={34} stroke={INK} strokeWidth={1} opacity={0.4} />
          <circle cx={58} cy={23} r={2.5} fill={INK} opacity={0.35} />
          <circle cx={68} cy={23} r={2.5} fill={INK} opacity={0.35} />
          {ROWS.map(({ label, value, y }, i) => (
            <g key={label} style={mono} fontSize={12} opacity={easeOut(fb, 4 + i * 3, 10)}>
              <text x={64} y={y} fill={INK} opacity={0.6}>
                {label}
              </text>
              <text x={300} y={y} textAnchor="end" fill={MACHINE}>
                {value}
              </text>
            </g>
          ))}
          {["M30 18 V4 H46", "M314 4 H330 V18", "M330 132 V146 H314", "M46 146 H30 V132"].map((d, i) => (
            <path key={i} d={d} fill="none" stroke={HUMAN} strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
          ))}
          {ROWS.map(({ box, y }, i) => {
            const p = easeOut(fb, 20 + i * 8, 16);
            if (p <= 0) return null;
            return <rect key={i} x={box.x} y={y - 12} width={box.w * p} height={17} rx={3} fill="none" stroke={HUMAN} strokeWidth={1.3} />;
          })}

          {(() => {
            const p = easeOut(fb, 54, 12);
            if (p <= 0) return null;
            return (
              <text
                x={180}
                y={160}
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

          {/* ── spreadsheet: METRIC | VALUE | TIME, timestamped ── */}
          {sheet > 0 && (
            <g opacity={sheet}>
              {/* zebra striping on alternate data rows */}
              {[0, 2].map((r) => (
                <rect key={r} x={TX} y={TY + HH + r * RH} width={TW} height={RH} fill={INK} opacity={0.035} />
              ))}
              {/* header fill + outer + grid */}
              <rect x={TX} y={TY} width={TW} height={HH} fill={INK} opacity={0.05} />
              <rect x={TX} y={TY} width={TW} height={HH + 4 * RH} fill="none" stroke={INK} strokeWidth={1} opacity={0.22} />
              <line x1={TX} y1={TY + HH} x2={TX + TW} y2={TY + HH} stroke={INK} strokeWidth={1} opacity={0.22} />
              {[1, 2, 3].map((r) => (
                <line key={r} x1={TX} y1={TY + HH + r * RH} x2={TX + TW} y2={TY + HH + r * RH} stroke={INK} strokeWidth={1} opacity={0.12} />
              ))}
              <line x1={COL1} y1={TY} x2={COL1} y2={TY + HH + 4 * RH} stroke={INK} strokeWidth={1} opacity={0.18} />
              <line x1={COL2} y1={TY} x2={COL2} y2={TY + HH + 4 * RH} stroke={INK} strokeWidth={1} opacity={0.18} />

              {/* header labels */}
              <g style={mono} fontSize={8} letterSpacing="0.08em" fill={INK} opacity={0.5} fontWeight={700}>
                <text x={TX + 12} y={TY + 11}>METRIC</text>
                <text x={COL2 - 8} y={TY + 11} textAnchor="end">VALUE</text>
                <text x={COL2 + 10} y={TY + 11}>TIME</text>
              </g>

              {/* data rows */}
              {SHEET.map(({ metric, value }, i) => {
                const ry = TY + HH + i * RH;
                const rp = easeOut(fb, 72 + i * 11, 14);
                if (rp <= 0) return null;
                const by = ry + 13;
                return (
                  <g key={metric} opacity={rp} transform={`translate(${-10 * (1 - rp)} 0)`} style={mono} fontSize={10.5}>
                    <text x={TX + 12} y={by} fill={INK} opacity={0.8}>
                      {metric}
                    </text>
                    <text x={COL2 - 8} y={by} textAnchor="end" fill={MACHINE}>
                      {value}
                    </text>
                    <text x={COL2 + 10} y={by} fill={INK} opacity={0.55}>
                      {TS}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* ✓ VALID — captured components match the source */}
          {valid > 0 && (
            <g opacity={Math.min(1, valid)} transform={`translate(0 ${8 * (1 - valid)})`}>
              <circle cx={104} cy={296} r={10} fill={GROUND} stroke={VERIFIED} strokeWidth={1.8} />
              <path d="M99 296 l3.5 3.5 l7 -8" fill="none" stroke={VERIFIED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <text x={122} y={300} fill={VERIFIED} fontSize={12} letterSpacing="0.14em" fontWeight={700} style={mono}>
                VALID
              </text>
              <text x={200} y={300} fill={INK} opacity={0.45} fontSize={9} style={mono}>
                {DATE} {TS}
              </text>
              {validPulseO > 0 && (
                <circle cx={104} cy={296} r={10 + 12 * validPulseP} fill="none" stroke={VERIFIED} strokeWidth={1.2} opacity={validPulseO} />
              )}
            </g>
          )}
        </g>
      )}

      {/* shutter flash above both phases */}
      <rect x={0} y={0} width={360} height={320} fill={GROUND} opacity={flash} />
    </Film>
  );
};
