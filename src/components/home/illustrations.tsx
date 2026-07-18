/*
 * Hand-drafted SVG illustrations for the home page — the house line-art style
 * (see IMAGERY.md): uniform thin ink strokes, flat restrained fills, two-voice
 * colour (terracotta = human, teal = machine, green = verified), transparent
 * ground. The animated sequences live in animations.tsx.
 */
import type { CSSProperties } from "react";

const INK = "#15201e";
const HUMAN = "#a65032";
const MACHINE = "#3e6874";
const VERIFIED = "#55745e";
const PAGE = "#f2f2ed";

const mono = { fontFamily: "var(--mono), monospace" } as const;

/* --- Hero: the thing the gauge can't see ----------------------------------- */
/* One operator at the extrusion die, sensing that the material "feels different"
   — while the machine's own panel reports everything nominal. The tension is
   the thesis: the readings say fine; the person on the floor knows otherwise.
   Full-bleed behind the hero copy; the left side is faded out by the CSS mask
   on .hero-art so the headline stays readable. One calm focal subject, the
   operator, deliberately the largest thing in the frame. */

export function HeroIllustration() {
  return (
    <svg viewBox="0 0 1600 640" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
      {/* floor — a faint hint of isometric tiling under the scene */}
      <line x1="620" y1="560" x2="1560" y2="560" stroke={INK} strokeWidth="1" opacity="0.32" />
      <line x1="720" y1="612" x2="1560" y2="612" stroke={INK} strokeWidth="1" opacity="0.1" />
      {[820, 1040, 1260, 1480].map((x) => (
        <line key={x} x1={x} y1="560" x2={x + 96} y2="612" stroke={INK} strokeWidth="1" opacity="0.1" />
      ))}

      {/* the machine: an extruder — barrel, drive, die head, emerging strand.
          Present, but quiet: teal line-art, everything reading nominal. */}
      <g stroke={MACHINE} strokeWidth="1.8" fill="none" strokeLinejoin="round">
        {/* barrel */}
        <rect x="1298" y="346" width="206" height="54" rx="6" />
        {/* heater bands */}
        {[1340, 1380, 1420, 1460].map((x) => (
          <line key={x} x1={x} y1="346" x2={x} y2="400" strokeWidth="1.1" opacity="0.5" />
        ))}
        {/* drive / motor at the far end */}
        <rect x="1504" y="338" width="42" height="70" rx="4" />
        <line x1="1514" y1="352" x2="1514" y2="394" strokeWidth="1.1" opacity="0.5" />
        <line x1="1524" y1="352" x2="1524" y2="394" strokeWidth="1.1" opacity="0.5" />
        {/* die head at the output end */}
        <rect x="1268" y="332" width="30" height="82" rx="4" />
        {/* legs to the floor */}
        <line x1="1330" y1="400" x2="1330" y2="558" />
        <line x1="1474" y1="400" x2="1474" y2="558" />
        <line x1="1316" y1="558" x2="1344" y2="558" strokeWidth="1.4" />
        <line x1="1460" y1="558" x2="1488" y2="558" strokeWidth="1.4" />
        {/* the strand of material emerging from the die toward the operator */}
        <line x1="1268" y1="368" x2="1092" y2="372" strokeWidth="2.4" />
        <line x1="1268" y1="378" x2="1096" y2="382" strokeWidth="1.1" opacity="0.4" />
      </g>

      {/* machine panel — floating, all readings nominal (teal = the machine).
          Nothing is green here: nothing has been verified yet. */}
      <g style={mono}>
        <rect x="1300" y="92" width="214" height="150" rx="10" fill={PAGE} stroke={MACHINE} strokeWidth="1.5" />
        <text x="1322" y="122" fill={MACHINE} fontSize="12" letterSpacing="0.14em" fontWeight="700">
          LINE 04
        </text>
        <line x1="1322" y1="134" x2="1492" y2="134" stroke={MACHINE} strokeWidth="1" opacity="0.35" />
        {[
          { label: "TEMP", value: "62 °C", y: 162 },
          { label: "PRESS", value: "2.4 bar", y: 190 },
          { label: "OUTPUT", value: "nominal", y: 218 },
        ].map(({ label, value, y }) => (
          <g key={label}>
            <text x="1322" y={y} fill={MACHINE} fontSize="13" opacity="0.75">
              {label}
            </text>
            <text x="1454" y={y} fill={MACHINE} fontSize="13" textAnchor="end">
              {value}
            </text>
            <circle cx="1478" cy={y - 4.5} r="7" fill="none" stroke={MACHINE} strokeWidth="1.4" />
            <path d={`M1474.5 ${y - 5} l2.5 2.5 l4.5 -5`} fill="none" stroke={MACHINE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
        {/* the panel taps the machine below it */}
        <line x1="1407" y1="242" x2="1407" y2="346" stroke={MACHINE} strokeWidth="1" strokeDasharray="3 5" />
        <rect x="1403" y="342" width="8" height="8" fill={MACHINE} />
      </g>

      {/* the operator — the largest thing in the frame, reaching to feel the
          material. Terracotta = the human and their judgement. */}
      <g stroke={HUMAN} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* hard hat + head */}
        <path d="M955 300 a 24 15 0 0 1 48 0" />
        <line x1="947" y1="300" x2="1011" y2="300" />
        <circle cx="979" cy="315" r="12" />
        {/* torso: overalls */}
        <path d="M960 338 h38 l6 84 h-50 Z" />
        <rect x="969" y="356" width="20" height="18" rx="2" strokeWidth="1.5" />
        <line x1="969" y1="356" x2="964" y2="340" strokeWidth="1.5" />
        <line x1="989" y1="356" x2="994" y2="340" strokeWidth="1.5" />
        {/* legs */}
        <path d="M968 422 L960 556" />
        <path d="M990 422 L1000 556" />
        <line x1="952" y1="557" x2="968" y2="557" strokeWidth="1.6" />
        <line x1="994" y1="557" x2="1010" y2="557" strokeWidth="1.6" />
        {/* left arm relaxed */}
        <path d="M962 346 L946 402" />
        {/* right arm reaching to the strand */}
        <path d="M998 346 L1044 360 L1086 372" />
        {/* open hand at the material — a few short strokes */}
        <path d="M1086 372 l14 -3 M1086 372 l14 1 M1086 372 l12 5" strokeWidth="1.6" />
      </g>

      {/* the human note the panel does not show — terracotta, low, by the hand */}
      <g>
        <path
          d="M1112 286 h180 a10 10 0 0 1 10 10 v30 a10 10 0 0 1 -10 10 h-150 l-18 22 l4 -22 a10 10 0 0 1 -6 -10 v-30 a10 10 0 0 1 6 -10 Z"
          fill={PAGE}
          stroke={HUMAN}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <text x="1126" y="311" fill={HUMAN} fontSize="14" style={mono}>
          &ldquo;feels different
        </text>
        <text x="1126" y="329" fill={HUMAN} fontSize="14" style={mono}>
          today&rdquo;
        </text>
      </g>
    </svg>
  );
}

/* --- Platform: animated app-screen demos ----------------------------------- */
/* Faux-UI drawn as thin strokes; each screen loops a short CSS animation (see
   globals.css). Base markup is a sensible still, so with prefers-reduced-motion
   (animations disabled) each screen simply shows a readable static state. */

// Capture — press the record button, then the voice signal modulates, repeat.
function CaptureScreen() {
  const bars = [
    [46, 12], [56, 22], [66, 33], [76, 18], [86, 40],
    [96, 27], [106, 34], [116, 15], [126, 25], [136, 20],
  ];
  return (
    <svg viewBox="0 0 180 320" className="pc-screen pc-cap" aria-hidden="true">
      <line x1="70" y1="16" x2="110" y2="16" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      <rect x="20" y="40" width="88" height="8" rx="4" fill={INK} opacity="0.13" />
      <rect x="20" y="56" width="56" height="6" rx="3" fill={INK} opacity="0.09" />
      {bars.map(([x, h], i) => (
        <line key={x} className={`cap-bar cap-bar-${i % 4}`} x1={x} y1={150 - h} x2={x} y2={150 + h} stroke={HUMAN} strokeWidth="4" strokeLinecap="round" />
      ))}
      <rect x="20" y="214" width="140" height="9" rx="4.5" fill={INK} opacity="0.07" />
      <rect x="20" y="232" width="104" height="9" rx="4.5" fill={INK} opacity="0.07" />
      <circle className="cap-ring" cx="90" cy="280" r="20" fill="none" stroke={HUMAN} strokeWidth="1.6" opacity="0" />
      <g className="cap-rec">
        <circle cx="90" cy="280" r="20" fill="none" stroke={HUMAN} strokeWidth="2" />
        <circle cx="90" cy="280" r="9" fill={HUMAN} />
      </g>
    </svg>
  );
}

// Connect — a highlight walks the timeline, blue → red → blue → red, on a loop.
function ConnectScreen() {
  const nodes: Array<{ x: number; kind: "m" | "h" }> = [
    { x: 70, kind: "m" }, { x: 140, kind: "h" }, { x: 220, kind: "m" },
    { x: 290, kind: "h" }, { x: 370, kind: "m" }, { x: 430, kind: "h" },
  ];
  return (
    <svg viewBox="0 0 480 300" className="pc-screen pc-conn" aria-hidden="true">
      {[16, 28, 40].map((cx) => (
        <circle key={cx} cx={cx} cy="20" r="3" fill={INK} opacity="0.2" />
      ))}
      <rect x="16" y="48" width="90" height="8" rx="4" fill={INK} opacity="0.13" />
      <line x1="24" y1="150" x2="456" y2="150" stroke={INK} strokeWidth="1.5" opacity="0.5" />
      {nodes.map(({ x, kind }, i) => {
        const c = kind === "m" ? MACHINE : HUMAN;
        return (
          <g key={x}>
            {kind === "h" ? (
              <>
                <rect x={x - 17} y="88" width="34" height="18" rx="4" fill="none" stroke={c} strokeWidth="1.5" />
                <line x1={x} y1="106" x2={x} y2="145" stroke={c} strokeWidth="1.2" />
                <circle cx={x} cy="150" r="4.5" fill={c} />
              </>
            ) : (
              <>
                <rect x={x - 4} y="146" width="8" height="8" fill={c} />
                <line x1={x} y1="155" x2={x} y2="195" stroke={c} strokeWidth="1.2" />
                <rect x={x - 18} y="195" width="36" height="16" rx="4" fill="none" stroke={c} strokeWidth="1.5" />
              </>
            )}
            <circle
              className="conn-hl"
              style={{ "--rank": i } as CSSProperties}
              cx={x}
              cy="150"
              r="11"
              fill="none"
              stroke={c}
              strokeWidth="2"
              opacity="0"
            />
          </g>
        );
      })}
      <rect x="16" y="256" width="190" height="8" rx="4" fill={INK} opacity="0.07" />
      <rect x="16" y="272" width="140" height="8" rx="4" fill={INK} opacity="0.07" />
    </svg>
  );
}

// Execute — run the checklist top→bottom (each turns green), then reset, loop.
function ExecuteScreen() {
  const rows = [64, 106, 148, 190];
  return (
    <svg viewBox="0 0 180 320" className="pc-screen pc-exec" aria-hidden="true">
      <line x1="70" y1="16" x2="110" y2="16" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.2" />
      <rect x="20" y="38" width="110" height="8" rx="4" fill={INK} opacity="0.13" />
      {rows.map((y, i) => (
        <g key={y}>
          {/* empty/grey base */}
          <rect x="20" y={y} width="14" height="14" rx="3" fill="none" stroke={INK} strokeWidth="1.7" opacity="0.3" />
          <rect x="44" y={y + 2.5} width="116" height="9" rx="4.5" fill={INK} opacity="0.1" />
          {/* green overlay, faded in per row */}
          <g className={`exec-row exec-row-${i}`} opacity={i < 2 ? 1 : 0}>
            <rect x="20" y={y} width="14" height="14" rx="3" fill={PAGE} stroke={VERIFIED} strokeWidth="1.8" />
            <path d={`M22.5 ${y + 7} l3.5 3.5 l6.5 -7.5`} fill="none" stroke={VERIFIED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="44" y={y + 2.5} width="116" height="9" rx="4.5" fill={VERIFIED} opacity="0.55" />
          </g>
        </g>
      ))}
      <rect x="44" y="256" width="92" height="30" rx="15" fill="none" stroke={INK} strokeWidth="1.5" opacity="0.22" />
      <g className="exec-done" opacity="0">
        <rect x="44" y="256" width="92" height="30" rx="15" fill={VERIFIED} />
        <path d="M74 271 l5 5 l10 -11" fill="none" stroke={PAGE} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

type Stage = { no: string; name: string; text: string };

const stageScreens = {
  Capture: CaptureScreen,
  Connect: ConnectScreen,
  Execute: ExecuteScreen,
} as const;

// an arrow orbits the dashed ring; a short bold arc trails behind it and fades,
// so the ring lights up as the arrow passes (the whole group just rotates).
const RING_R = 232;
const RING_C = 250;
const ringPt = (phi: number) => {
  const a = ((phi - 90) * Math.PI) / 180;
  return `${(RING_C + RING_R * Math.cos(a)).toFixed(1)} ${(RING_C + RING_R * Math.sin(a)).toFixed(1)}`;
};
const ringArc = (from: number, to: number) => `M${ringPt(from)} A${RING_R} ${RING_R} 0 0 1 ${ringPt(to)}`;
// trail segments sit just behind the head (φ=0), fading toward the tail
const ORBIT_TRAIL = [
  { from: -6, to: -2, w: 2.8, o: 0.9 },
  { from: -10, to: -6, w: 2.6, o: 0.72 },
  { from: -14, to: -10, w: 2.4, o: 0.56 },
  { from: -18, to: -14, w: 2.2, o: 0.42 },
  { from: -23, to: -18, w: 2.0, o: 0.3 },
  { from: -28, to: -23, w: 1.8, o: 0.18 },
];

export function PlatformCircle({ stages }: { stages: Stage[] }) {
  return (
    <div className="platform-circle">
      <svg className="pc-ring" viewBox="0 0 500 500" aria-hidden="true">
        <circle cx="250" cy="250" r="232" fill="none" stroke={INK} strokeWidth="1.2" strokeDasharray="5 8" opacity="0.3" />
        <g className="pc-orbit">
          {ORBIT_TRAIL.map((t, i) => (
            <path key={i} d={ringArc(t.from, t.to)} fill="none" stroke={HUMAN} strokeWidth={t.w} strokeLinecap="round" opacity={t.o} />
          ))}
          {/* the arrow head, riding the top of the ring, pointing clockwise */}
          <path d="M245 12.5 L255 18 L245 23.5" fill="none" stroke={HUMAN} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      {stages.map((stage) => {
        const Screen = stageScreens[stage.name as keyof typeof stageScreens];
        return (
          <div key={stage.no} className={`pc-item pc-${stage.name.toLowerCase()}`}>
            <div className="screen-body">{Screen ? <Screen /> : null}</div>
            <h3>{stage.name}</h3>
            <p>{stage.text}</p>
          </div>
        );
      })}
    </div>
  );
}

/* --- Outcome icons (floor-proof stat strip) -------------------------------- */

export function IconLessScrap() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="9" x2="22" y2="9" />
        <path d="M12.5 9 v-3 h5 v3" />
        <path d="M10 9 l1.6 17 h6.8 L20 9" />
      </g>
      <g fill="none" stroke={HUMAN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="27" y1="12" x2="27" y2="22" />
        <path d="M23.8 18.6 L27 22.8 L30.2 18.6" />
      </g>
    </svg>
  );
}

export function IconFewerStoppages() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="14" cy="16" r="10" />
        <line x1="10.5" y1="12" x2="10.5" y2="20" />
        <line x1="17.5" y1="12" x2="17.5" y2="20" />
      </g>
      <line x1="4" y1="27" x2="24" y2="5" stroke={HUMAN} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconLessReporting() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="4" width="15" height="24" rx="2" />
        <line x1="11" y1="11" x2="18" y2="11" opacity="0.6" />
        <line x1="11" y1="16" x2="18" y2="16" opacity="0.6" />
        <line x1="11" y1="21" x2="15" y2="21" opacity="0.6" />
      </g>
      <g fill="none" stroke={HUMAN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="27" y1="13" x2="27" y2="23" />
        <path d="M23.8 19.6 L27 23.8 L30.2 19.6" />
      </g>
    </svg>
  );
}

export function IconDaysToLive() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <g fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="7" width="24" height="21" rx="3" />
        <line x1="10" y1="3.5" x2="10" y2="9.5" />
        <line x1="22" y1="3.5" x2="22" y2="9.5" />
        <line x1="4" y1="13" x2="28" y2="13" />
      </g>
      <path d="M11 20 l3.5 3.5 L21 16.5" fill="none" stroke={VERIFIED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
