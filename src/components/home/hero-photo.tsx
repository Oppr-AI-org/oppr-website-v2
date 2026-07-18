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
  { id: "rate", voice: "machine", ox: 852, oy: 548, lx: 930, label: "1.2 m³/h", node: "square" },
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

/* ┌─────────────────────────────────────────────────────────────────────────┐
 * │  PHONE UI PLACEMENT — HAND-TUNE THESE THREE NUMBERS                        │
 * │  The VOICE + PHOTO buttons are one group drawn centred on (0,0), so:       │
 * │    PHONE_UI_X       move the buttons LEFT (smaller) / RIGHT (larger)       │
 * │    PHONE_UI_Y       move the buttons UP (smaller)  / DOWN (larger)         │
 * │    PHONE_UI_ROTATE  tilt in degrees, clockwise positive — match the phone  │
 * │  Rotation pivots about the CENTRE of the stack, so changing the angle does │
 * │  NOT move the buttons: tune position and angle independently.             │
 * │  Units are viewBox units (the whole scene is 1584 × 672). Edit, save, look.│
 * └─────────────────────────────────────────────────────────────────────────┘ */
const PHONE_UI_X = 1044; // ← left / right
const PHONE_UI_Y = 315; // ← up / down
const PHONE_UI_ROTATE = -9; // ← angle (deg, clockwise +)

/* ┌── SPEECH BUBBLE (spoken note) — HAND-TUNE ──────────────────────────────┐
 * │  The audio wave lives in a speech bubble whose tail points at the mouth. │
 * │    SPEECH_X / SPEECH_Y   bubble centre (move LEFT = smaller X)           │
 * │    SPEECH_W / SPEECH_H   bubble size                                     │
 * │    MOUTH_X / MOUTH_Y     tail tip — put it on the operator's mouth       │
 * └─────────────────────────────────────────────────────────────────────────┘ */
const SPEECH_X = 1150;
const SPEECH_Y = 248;
const SPEECH_W = 100;
const SPEECH_H = 78;
const MOUTH_X = 1220;
const MOUTH_Y = 286;

const waveBars = [-24, -16, -8, 0, 8, 16, 24];
const waveHeights = [14, 26, 38, 48, 38, 26, 15];

/* rounded-rect speech bubble with a tail on the right edge pointing at the mouth */
const _sbx = SPEECH_X - SPEECH_W / 2;
const _sby = SPEECH_Y - SPEECH_H / 2;
const _sbr = 13;
const _sbRight = SPEECH_X + SPEECH_W / 2;
const SPEECH_PATH =
  `M ${_sbx + _sbr} ${_sby}` +
  ` H ${_sbRight - _sbr} A ${_sbr} ${_sbr} 0 0 1 ${_sbRight} ${_sby + _sbr}` +
  ` V ${SPEECH_Y - 11} L ${MOUTH_X} ${MOUTH_Y} L ${_sbRight} ${SPEECH_Y + 11}` +
  ` V ${_sby + SPEECH_H - _sbr} A ${_sbr} ${_sbr} 0 0 1 ${_sbRight - _sbr} ${_sby + SPEECH_H}` +
  ` H ${_sbx + _sbr} A ${_sbr} ${_sbr} 0 0 1 ${_sbx} ${_sby + SPEECH_H - _sbr}` +
  ` V ${_sby + _sbr} A ${_sbr} ${_sbr} 0 0 1 ${_sbx + _sbr} ${_sby} Z`;

/* the human (phone) feed speaks FIRST (audio wave), THEN sends the pulse up */
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
.hero-wavebar { transform-box: fill-box; transform-origin: center; }
@media (prefers-reduced-motion: no-preference) {
  @keyframes hero-bar { 0%,100% { transform: scaleY(0.35); } 50% { transform: scaleY(1); } }
  @keyframes hero-wave {
    0%, ${pct(4 * SLOT + 60)} { opacity: 0; }
    ${pct(4 * SLOT + 240)} { opacity: 1; }
    ${pct(4 * SLOT + WAVE_LEAD - 100)} { opacity: 1; }
    ${pct(4 * SLOT + WAVE_LEAD + 250)} { opacity: 0; }
    100% { opacity: 0; }
  }
  .hero-wave { animation: hero-wave ${T}ms linear infinite; }
  .hero-wavebar { animation: hero-bar 640ms ease-in-out infinite; }
  .hero-wavebar.b0 { animation-delay: 0ms; }
  .hero-wavebar.b1 { animation-delay: 90ms; }
  .hero-wavebar.b2 { animation-delay: 180ms; }
  .hero-wavebar.b3 { animation-delay: 40ms; }
  .hero-wavebar.b4 { animation-delay: 150ms; }
  .hero-wavebar.b5 { animation-delay: 70ms; }
  .hero-wavebar.b6 { animation-delay: 200ms; }
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

      {/* spoken-note speech bubble — audio wave inside, tail from the mouth */}
      <g className="hero-anim hero-wave" filter="url(#heroGlowWarm)">
        <path d={SPEECH_PATH} fill="#140f0b" fillOpacity="0.82" stroke={HUMAN} strokeWidth="1.6" strokeLinejoin="round" />
        <g transform={`translate(${SPEECH_X} ${SPEECH_Y})`}>
          {waveBars.map((bx, i) => {
            const h = waveHeights[i];
            return (
              <rect
                key={bx}
                className={`hero-wavebar b${i}`}
                x={bx - 2}
                y={-h / 2}
                width="4"
                height={h}
                rx="2"
                fill={HUMAN}
              />
            );
          })}
        </g>
      </g>

      {/* Oppr phone UI — two stacked capture buttons (icon over text), drawn
          centred on (0,0) so PHONE_UI_ROTATE pivots about the stack centre.
          Tune PHONE_UI_X / _Y / _ROTATE above. */}
      <g transform={`translate(${PHONE_UI_X} ${PHONE_UI_Y}) rotate(${PHONE_UI_ROTATE})`} filter="url(#heroGlow)">
        {/* VOICE (human / terracotta) — top button, spans y −38…−4 */}
        <rect x="-16" y="-38" width="32" height="34" rx="7" fill="#100f0b" fillOpacity="0.52" stroke={HUMAN} strokeWidth="1.4" />
        <g stroke={HUMAN} fill="none" strokeLinecap="round">
          <rect x="-2.6" y="-32.5" width="5.2" height="9.5" rx="2.6" fill={HUMAN} stroke="none" />
          <path d="M-5 -27 a 5 5.2 0 0 0 10 0" strokeWidth="1.6" />
          <line x1="0" y1="-21.6" x2="0" y2="-19.4" strokeWidth="1.7" />
        </g>
        <text x="0" y="-8.5" textAnchor="middle" fill={HUMAN} fontSize="7" fontWeight="700" style={mono}>
          VOICE
        </text>
        {/* PHOTO — bottom button, spans y 4…38 */}
        <rect x="-16" y="4" width="32" height="34" rx="7" fill="#100f0b" fillOpacity="0.52" stroke={PAGE} strokeWidth="1.2" opacity="0.92" />
        <g stroke={PAGE} fill="none" opacity="0.92">
          <rect x="-9" y="12" width="18" height="12.5" rx="2" strokeWidth="1.4" />
          <path d="M-4.5 12 l2 -2.8 h4.8 l2 2.8" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="0" cy="18.4" r="3.6" strokeWidth="1.4" />
        </g>
        <text x="0" y="34" textAnchor="middle" fill={PAGE} fontSize="7" fontWeight="700" opacity="0.92" style={mono}>
          PHOTO
        </text>
      </g>
    </svg>
  );
}
