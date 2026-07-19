/*
 * Photoreal hero — a muted photograph plate (operator + phone + pump/vessel/HMI)
 * with the unified timeline, connector lines and the Oppr phone UI drawn as a
 * coded overlay on top. Photo and overlay live in ONE svg (shared 1584×672
 * coordinate space) so the graphics stay pixel-aligned to the image at any size.
 *
 * A deliberate exception to the line-art house style (see hero-brief.md):
 * the plate is muted/warm so the brand-colour overlay is the only saturated
 * thing on screen. Two-voice colour holds — terracotta = the human (phone),
 * teal = the machine (sensor taps + HMI), green = verified/live.
 *
 * Timeline anatomy per source: a value pill sits ABOVE the spine, a short solid
 * vertical line drops from the pill to its bullet on the spine, and a dashed
 * line continues from the bullet down to the real fitting in the photo.
 *
 * Animation (gated behind prefers-reduced-motion: no-preference — the base state
 * is the fully-lit end state): the sources fire left → right. For each machine
 * feed the origin square flashes, a pulse runs UP the dashed line to the bullet
 * and on up to the pill, and the pill flashes once. The human feed (phone) fires
 * last: an orange pulse runs up, the pill flashes, and a glowing audio waveform
 * appears at the operator's face to show a note being spoken.
 *
 * The "UNIFIED TIMELINE · LIVE" badge is a DOM element (see Hero in sections.tsx)
 * so it hugs the top-right corner regardless of how the photo is cropped.
 */

const HUMAN = "#e0703f"; // terracotta, brightened — the line we're working towards
const MACHINE = "#5aa0b4"; // teal, brightened to read as a lit line on the photo
const PAGE = "#f2f2ed";

const mono = { fontFamily: "var(--mono), monospace" } as const;

const SPINE_Y = 96; // horizontal timeline, in the dark top band
const PILL_TOP = 44; // pills sit above the spine
const PILL_H = 26;
const PILL_BOTTOM = PILL_TOP + PILL_H; // 70 — solid line runs from here to the bullet

type Feed = {
  id: string;
  voice: "human" | "machine";
  ox: number; // origin x — a real fitting in the photo (valve / flange / phone)
  oy: number; // origin y
  lx: number; // landing x on the spine — evenly spaced
  label: string;
  node: "square" | "round";
  mic?: boolean;
  /* the human feed carries a real spoken note; two short lines set smaller so
     it reads as a captured observation, not a machine value. */
  lines?: [string, string];
};

/* ┌── ORANGE DOT (phone origin) — HAND-TUNE ────────────────────────────────┐
 * │  The orange dot marks the TOP OF THE PHONE. The spoken-note line ENDS at │
 * │  this dot and the pulse STARTS from it, so moving the dot moves both.    │
 * │    DOT_X  left (smaller) / right (larger)                                │
 * │    DOT_Y  up (smaller)   / down (larger)      (viewBox units)            │
 * └─────────────────────────────────────────────────────────────────────────┘ */
const DOT_X = 1037;
const DOT_Y = 263;

/* landings are evenly spaced across the band; origins are pinned to fittings.
   Feed order is left → right; the human (phone) feed fires last. */
const feeds: Feed[] = [
  { id: "pump", voice: "machine", ox: 486, oy: 500, lx: 300, label: "1450 RPM", node: "square" },
  { id: "flow", voice: "machine", ox: 640, oy: 402, lx: 510, label: "62 °C", node: "square" },
  { id: "vessel", voice: "machine", ox: 812, oy: 236, lx: 720, label: "2.4 bar", node: "square" },
  { id: "rate", voice: "machine", ox: 852, oy: 548, lx: 872, label: "22.6 m³/h", node: "square" },
  {
    id: "phone",
    voice: "human",
    ox: DOT_X,
    oy: DOT_Y,
    lx: 1064,
    label: "SPOKEN NOTE",
    node: "round",
    mic: true,
    lines: ["High-pitched sound from the pump", "weeks now — likely the bearing"],
  },
];

const color = (v: Feed["voice"]) => (v === "human" ? HUMAN : MACHINE);

/* the spine runs nearly edge-to-edge so it reads as one continuous timeline
   filling the full width; under `slice` the viewBox width tracks the container,
   so this stretches dynamically with the screen. */
const SPINE_X1 = 40;
const SPINE_X2 = 1544;

/* filler tick positions along the spine (between/around the chips), spread the
   full span so the extended line doesn't read as empty */
const ticks = [
  90, 160, 232, 380, 420, 600, 640, 810, 850, 1020, 1060, 1200,
  1268, 1336, 1404, 1472,
];

/* the spoken-note pill sets its two lines smaller than a machine value */
const NOTE_FONT = 6.5;
const pillWidth = (f: Feed) => {
  if (f.lines) {
    const maxChars = Math.max(...f.lines.map((l) => l.length));
    return maxChars * (NOTE_FONT * 0.6) + 40; // mic zone + right padding
  }
  return f.label.length * 7.4 + (f.mic ? 40 : 26);
};

/* ┌── SOUND EMANATION (from the phone) — HAND-TUNE ─────────────────────────┐
 * │  Concentric dashed arcs ripple UP off the phone: the note is being       │
 * │  captured in the moment. Centred on the phone's orange dot (DOT_X/Y).    │
 * │    SOUND_ARCS   [halfWidth, height, lift] per arc, nearest phone first   │
 * └─────────────────────────────────────────────────────────────────────────┘ */
const SOUND_ARCS: Array<[number, number, number]> = [
  [15, 10, 9],
  [24, 20, 13],
  [33, 30, 17],
];
/* one upward-bulging arc, centred over the phone dot, `up` units above it */
const soundArcPath = (hw: number, up: number, lift: number) =>
  `M ${DOT_X - hw} ${DOT_Y - up} Q ${DOT_X} ${DOT_Y - up - lift} ${DOT_X + hw} ${DOT_Y - up}`;

/* the human (phone) feed emanates sound FIRST, THEN sends the pulse up */
const WAVE_LEAD = 1250;

/* ------------------------------------------------------------------ *
 * Animation CSS — generated per feed so the sequence timing is exact. *
 * ------------------------------------------------------------------ */
const T = 9000; // full cycle (ms)
const SLOT = 1250; // gap between each source firing
const pct = (ms: number) => `${((ms / T) * 100).toFixed(2)}%`;

function buildCss(): string {
  let css = `
.hero-anim { opacity: 0; }
.hero-sound-arc { transform-box: view-box; transform-origin: ${DOT_X}px ${DOT_Y}px; }
@media (prefers-reduced-motion: no-preference) {
  @keyframes hero-wave {
    0%, ${pct(4 * SLOT + 60)} { opacity: 0; }
    ${pct(4 * SLOT + 240)} { opacity: 1; }
    ${pct(4 * SLOT + WAVE_LEAD - 100)} { opacity: 1; }
    ${pct(4 * SLOT + WAVE_LEAD + 250)} { opacity: 0; }
    100% { opacity: 0; }
  }
  @keyframes hero-emanate {
    0% { transform: scale(0.5); opacity: 0; }
    35% { opacity: 0.95; }
    100% { transform: scale(1.7); opacity: 0; }
  }
  .hero-wave { animation: hero-wave ${T}ms linear infinite; }
  .hero-sound-arc { animation: hero-emanate 1400ms ease-out infinite; }
  .hero-sound-arc.a1 { animation-delay: 300ms; }
  .hero-sound-arc.a2 { animation-delay: 600ms; }
`;

  feeds.forEach((f, i) => {
    // machine feeds fire at their slot; the human feed waits for the wave first
    const ps = i * SLOT + (f.voice === "human" ? WAVE_LEAD : 0);
    const bx = f.lx - f.ox;
    const by = SPINE_Y - f.oy; // to the bullet
    const py = PILL_BOTTOM - f.oy; // on up to the pill

    // pulse: origin -> bullet -> pill, then fade
    css += `
  @keyframes hero-pulse-${f.id} {
    0%, ${pct(ps)} { transform: translate(0px, 0px); opacity: 0; }
    ${pct(ps + 90)} { transform: translate(0px, 0px); opacity: 1; }
    ${pct(ps + 560)} { transform: translate(${bx}px, ${by}px); opacity: 1; }
    ${pct(ps + 810)} { transform: translate(${bx}px, ${py}px); opacity: 1; }
    ${pct(ps + 890)} { transform: translate(${bx}px, ${py}px); opacity: 0; }
    100% { transform: translate(0px, 0px); opacity: 0; }
  }
  .hp-${f.id} { animation: hero-pulse-${f.id} ${T}ms linear infinite; }

  @keyframes hero-orig-${f.id} {
    0%, ${pct(ps)} { opacity: 0; }
    ${pct(ps + 70)} { opacity: 1; }
    ${pct(ps + 300)} { opacity: 0; }
    100% { opacity: 0; }
  }
  .of-${f.id} { animation: hero-orig-${f.id} ${T}ms linear infinite; }

  @keyframes hero-pill-${f.id} {
    0%, ${pct(ps + 770)} { opacity: 0; }
    ${pct(ps + 840)} { opacity: 0.9; }
    ${pct(ps + 1040)} { opacity: 0; }
    100% { opacity: 0; }
  }
  .pf-${f.id} { animation: hero-pill-${f.id} ${T}ms linear infinite; }
`;
  });

  css += `
}
`;
  return css;
}

export function HeroPhotoScene() {
  return (
    <svg
      className="hero-photo-svg"
      viewBox="0 0 1584 672"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroScrim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0b09" stopOpacity="0.96" />
          <stop offset="28%" stopColor="#0c0b09" stopOpacity="0.82" />
          <stop offset="52%" stopColor="#0c0b09" stopOpacity="0.42" />
          <stop offset="76%" stopColor="#0c0b09" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0c0b09" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="heroTopFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0907" stopOpacity="0.82" />
          <stop offset="62%" stopColor="#0a0907" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0a0907" stopOpacity="0" />
        </linearGradient>
        <filter id="heroGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* stronger glow for the human/orange elements — what we're working towards */}
        <filter id="heroGlowWarm" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b1" />
          <feGaussianBlur stdDeviation="6.5" result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style dangerouslySetInnerHTML={{ __html: buildCss() }} />

      {/* photo plate */}
      <image href="/img/hero-plate.jpg" x="0" y="0" width="1584" height="672" preserveAspectRatio="xMidYMin slice" />

      {/* legibility scrims: left (for copy) + a defined band along the top (the timeline strip) */}
      <rect x="0" y="0" width="1584" height="672" fill="url(#heroScrim)" />
      <rect x="0" y="0" width="1584" height="150" fill="url(#heroTopFade)" />

      {/* dashed feeds: from each bullet DOWN to its real fitting */}
      {feeds.map((f) => (
        <g key={`feed-${f.id}`} filter={f.voice === "human" ? "url(#heroGlowWarm)" : "url(#heroGlow)"}>
          <line
            x1={f.lx}
            y1={SPINE_Y}
            x2={f.ox}
            y2={f.oy}
            stroke={color(f.voice)}
            strokeWidth={f.voice === "human" ? 2 : 1.5}
            strokeDasharray={f.voice === "machine" ? "2 6" : undefined}
            opacity={f.voice === "human" ? 1 : 0.72}
          />
          {f.node === "square" ? (
            <rect x={f.ox - 4} y={f.oy - 4} width="8" height="8" fill={color(f.voice)} />
          ) : (
            <circle cx={f.ox} cy={f.oy} r="4.5" fill={color(f.voice)} />
          )}
        </g>
      ))}

      {/* unified timeline spine + ticks (a real timeline in the top band) */}
      <g filter="url(#heroGlow)">
        <line x1={SPINE_X1} y1={SPINE_Y} x2={SPINE_X2} y2={SPINE_Y} stroke={PAGE} strokeWidth="1.5" opacity="0.85" />
        <path d={`M${SPINE_X2 - 4} ${SPINE_Y - 5} L${SPINE_X2 + 8} ${SPINE_Y} L${SPINE_X2 - 4} ${SPINE_Y + 5}`} fill="none" stroke={PAGE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        {ticks.map((x) => (
          <line key={x} x1={x} y1={SPINE_Y - 4} x2={x} y2={SPINE_Y + 4} stroke={PAGE} strokeWidth="1" opacity="0.3" />
        ))}
      </g>

      {/* per source: pill ABOVE, solid vertical line to the bullet on the spine */}
      {feeds.map((f) => {
        const w = pillWidth(f);
        const warm = f.voice === "human";
        return (
          <g key={`chip-${f.id}`} filter={warm ? "url(#heroGlowWarm)" : "url(#heroGlow)"}>
            <line x1={f.lx} y1={PILL_BOTTOM} x2={f.lx} y2={SPINE_Y} stroke={color(f.voice)} strokeWidth={warm ? 2 : 1.6} />
            <circle cx={f.lx} cy={SPINE_Y} r="4.2" fill={color(f.voice)} />
            <rect
              x={f.lx - w / 2}
              y={PILL_TOP}
              width={w}
              height={PILL_H}
              rx="5"
              fill="#100f0b"
              fillOpacity="0.74"
              stroke={color(f.voice)}
              strokeWidth={warm ? 1.5 : 1.2}
            />
            {f.lines ? (
              <>
                {/* mic sits vertically centred; the two note lines read to its right */}
                <g stroke={color(f.voice)} strokeWidth="1.2" fill="none" strokeLinecap="round" transform={`translate(${f.lx - w / 2 + 13}, ${PILL_TOP + PILL_H / 2})`}>
                  <rect x="-2.2" y="-5.5" width="4.4" height="7.5" rx="2.2" fill={color(f.voice)} stroke="none" />
                  <path d="M-4.2 -1 a 4.2 4.2 0 0 0 8.4 0" />
                  <line x1="0" y1="3.2" x2="0" y2="5.4" />
                </g>
                <text x={f.lx - w / 2 + 24} y={PILL_TOP + 11} fill={color(f.voice)} fontSize={NOTE_FONT} style={mono}>
                  {f.lines[0]}
                </text>
                <text x={f.lx - w / 2 + 24} y={PILL_TOP + 20} fill={color(f.voice)} fontSize={NOTE_FONT} style={mono}>
                  {f.lines[1]}
                </text>
              </>
            ) : (
              <>
                {f.mic && (
                  <g stroke={color(f.voice)} strokeWidth="1.3" fill="none" strokeLinecap="round" transform={`translate(${f.lx - w / 2 + 13}, ${PILL_TOP + 13})`}>
                    <rect x="-2.4" y="-6" width="4.8" height="8" rx="2.4" fill={color(f.voice)} stroke="none" />
                    <path d="M-4.6 -1 a 4.6 4.6 0 0 0 9.2 0" />
                    <line x1="0" y1="3.6" x2="0" y2="6" />
                  </g>
                )}
                <text x={f.lx + (f.mic ? 8 : 0)} y={PILL_TOP + 17} textAnchor="middle" fill={color(f.voice)} fontSize="12.5" style={mono}>
                  {f.label}
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* ---- animated layer (hidden unless prefers-reduced-motion: no-preference) ---- */}

      {/* origin-node flash + travelling pulse, per feed */}
      {feeds.map((f) => (
        <g key={`anim-${f.id}`} filter={f.voice === "human" ? "url(#heroGlowWarm)" : "url(#heroGlow)"}>
          {f.node === "square" ? (
            <rect className={`hero-anim of-${f.id}`} x={f.ox - 7} y={f.oy - 7} width="14" height="14" rx="2" fill="none" stroke={color(f.voice)} strokeWidth="2" />
          ) : (
            <circle className={`hero-anim of-${f.id}`} cx={f.ox} cy={f.oy} r="9" fill="none" stroke={color(f.voice)} strokeWidth="2" />
          )}
          <circle className={`hero-anim hp-${f.id}`} cx={f.ox} cy={f.oy} r="4.6" fill={color(f.voice)} />
        </g>
      ))}

      {/* pill flash, per feed (a bright fill that pulses once when the value lands) */}
      {feeds.map((f) => {
        const w = pillWidth(f);
        return (
          <rect
            key={`pf-${f.id}`}
            className={`hero-anim pf-${f.id}`}
            x={f.lx - w / 2}
            y={PILL_TOP}
            width={w}
            height={PILL_H}
            rx="5"
            fill={color(f.voice)}
            fillOpacity="0.28"
            stroke={color(f.voice)}
            strokeWidth="1.8"
            filter={f.voice === "human" ? "url(#heroGlowWarm)" : "url(#heroGlow)"}
          />
        );
      })}

      {/* spoken note captured: dashed sound arcs ripple up off the phone */}
      <g className="hero-anim hero-wave" filter="url(#heroGlowWarm)">
        {SOUND_ARCS.map(([hw, up, lift], i) => (
          <path
            key={i}
            className={`hero-sound-arc a${i}`}
            d={soundArcPath(hw, up, lift)}
            fill="none"
            stroke={HUMAN}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        ))}
      </g>

      {/* The VOICE + PHOTO capture buttons now live in the photo plate itself
          (baked in via the Gemini edit), so the phone screen reads as a real
          app in correct perspective — no coded button overlay here. */}
    </svg>
  );
}
