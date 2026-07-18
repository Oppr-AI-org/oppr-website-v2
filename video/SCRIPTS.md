# Oppr — Landing-page films (Remotion production scripts)

Five short, silent, looping films that recreate the hand-built SVG/CSS
animations on the home page as rendered video. They must read as *drawn
instruments*, not motion-graphics: the same draftsman line-art the whole site
uses, now with real cinematography (draw-on strokes, typed text, springs, a
camera that zooms).

This document is the single source of truth. An agent (or human) should be
able to build every film from this file alone, without seeing the site.

---

## 1 · Brand rules (non-negotiable)

Derived from IMAGERY.md + the site's "Engineered Calm" system.

### Palette (exact hex, flat — never gradients)

| Token      | Hex       | Meaning                                    |
| ---------- | --------- | ------------------------------------------ |
| `GROUND`   | `#f2f2ed` | warm-white page ground                     |
| `INK`      | `#15201e` | line-work, neutral text                    |
| `HUMAN`    | `#a65032` | terracotta — the operator and their action |
| `MACHINE`  | `#3e6874` | teal — equipment, sensors, readings        |
| `VERIFIED` | `#55745e` | green — a confirmed, positive result       |
| `MUTED`    | rgba(21,32,30,0.55) | secondary labels               |

Two-voice rule holds everywhere: terracotta never touches a machine element,
teal never touches a human action. Green appears only at moments of
verification.

### Line & surface

- Uniform thin strokes. In viewBox units (same coordinate system as the site
  SVGs): 1.2–2 for structure, 3 for waveform bars. Round caps and joins.
- No shadows, no gradients, no glow, no blur, no 3D. Flat fills only, and
  only where colour carries meaning.
- Background: flat `GROUND` **plus the site's ruled baseline** — horizontal
  1px lines every 32 viewBox units at `rgba(21,32,30,0.025)`. This makes the
  rendered rectangle sit near-seamlessly on the ruled page.

### Type

- All in-film text is **JetBrains Mono** (the site's data voice), loaded via
  `@remotion/google-fonts/JetBrainsMono`, weight 400/700.
- Labels: 9–11 units, letter-spacing ~0.1em, uppercase, weight 700.
- Data values: 12–13 units, no tracking.
- Never invent UI copy. Only the strings specified per film below. Text is
  *data*, so it may type on character-by-character (mono makes this clean).

### Motion grammar

- **Draw-on** for strokes: `pathLength={1}` + `strokeDasharray: 1`,
  `strokeDashoffset: 1 → 0`. Structure is *drawn*, not faded.
- **Spring pops** for chips/nodes: Remotion `spring()`, damping ~14,
  stiffness ~120, from `scale 0.85 / translateY +10` — settle fast, no
  bounce-overshoot beyond ~4%.
- **Typing** for messages/status lines: reveal substring linearly, ~1.2
  chars/frame.
- **Camera**: only the Connect film zooms (scale on a wrapper group), eased
  with `Easing.inOut(Easing.cubic)`. Nothing else moves the camera.
- **Loop reset**: every film fades all content to 0 over its final 30 frames
  (1s) so `<video loop>` restarts cleanly on the empty ruled page.
- Nothing bounces, nothing rotates decoratively, no motion for motion's sake.
  Every move states a fact: captured → structured → connected → verified.

### Fluidity rules (refinement pass)

The code in `src/` is the source of truth for exact frame numbers; the tables
below may drift by a few frames. These rules are non-negotiable:

- **Nothing moves linearly.** Draws, wipes, travel and camera use cubic
  in-out (`ease`); arrivals that settle use cubic out (`easeOut`). Linear is
  reserved for typing and opacity ramps only.
- **Nothing appears or vanishes in one frame.** Every transient (packets,
  arrowheads, labels) fades in/out over ≥4 frames; travellers use a
  fade-in → hold → fade-out envelope over their journey (`travelFade`).
- **Dashed strokes never dash-crawl.** A dashed line "draws" by growing its
  endpoint; a dashed path is revealed with a clip-rect wipe; a dashed
  circle/box fades in with a ≤6% scale settle. Animating `strokeDashoffset`
  on a dashed stroke (marching ants) is banned.
- **No strobing.** Attention pulses are smooth sines that settle to steady
  (correlation rings breathe ~3× then hold; bracket highlights dip once).
  The only hard blink allowed is the typing caret.
- **Labels drift.** Caption/label fades carry a 4px upward drift so text
  arrives instead of materialising.
- **No dead air.** The last drawn beat lands ≤2s before the global fade
  begins; ambient rhythms (pings) calm to zero before the fade.

### Render targets

| Property | Value |
| -------- | ----- |
| fps | 30 |
| Capture films (3) | 1080 × 960 px, 300 frames (10 s), viewBox 360 × 320 |
| Connect | 1920 × 840 px, 420 frames (14 s), viewBox 960 × 420 |
| Execute | 1920 × 680 px, 420 frames (14 s), viewBox 960 × 340 |
| Codec | H.264 MP4 (`out/<name>.mp4`); WebM optional second pass |
| Audio | none |

The films are the same drawings as the site SVGs — same viewBox coordinates —
so geometry can be copied verbatim from
`src/components/home/animations.tsx` and re-timed.

---

## 2 · Film 1 — `capture-speak` (12 s, 360 frames)

**Story**: we open close on an operator speaking a voice note into his phone;
the camera pulls back until he is small and the speech bubble fills the frame;
Oppr hears four facts.

Geometry: the shared `<Operator pose="speak">` figure (`lib/Operator.tsx`)
placed at `translate(34,158) scale(0.52)` so his phone lands at ≈(60,196),
under the bubble tail; a live terracotta waveform is drawn onto his phone
screen via the `screen` prop. Speech bubble (rounded rect 20,16 → 340,140)
with a long tail pointing down to the phone; 2 message lines (mono 12, x=30,
y=74/104); 4 filled-terracotta highlight boxes with **white** text; 4 labelled
chips in a 2×2 grid (y=208/270).

Camera: a wrapper-group zoom `translate(cx,cy) scale(S) translate(-Fx,-Fy)`
with focus F=(60,196) on his phone. S holds ~3.3 (f0–50, slight push) then
eases to 1 by f112 (cubic in-out); at S=1 the transform is identity so the
rest of the film is authored 1:1. All strokes visible under the zoom carry
`vector-effect: non-scaling-stroke` so line weight stays thin at every scale.

**Bubble reveal**: the outline is a single closed path with a tail; a dashed
stroke-draw on that closed loop leaves a permanent gap (never closes), so the
outline is revealed by a **left→right clip-wipe** (`clipPath` rect grows from
x=14, `ease(f,88,34)`) — always fully closed once complete.

| Frames | Beat |
| ------ | ---- |
| 0–50   | **Zoomed in** on the operator (hard hat, face, phone to mouth). Waveform bars **pulse** while he speaks (sine, phase-offset). Slight push-in keeps it alive. |
| 50–112 | **Camera pulls back**: the operator shrinks to small in the lower-left; the frame opens onto the full scene. |
| 88–122 | Speech bubble outline **wipes on** left→right as the camera settles, tail anchored to the phone. |
| 112–172| The message **types on** (two lines, caret follows): `Pump P6 ran rough on Line 3` / `yesterday. The bearing may need changing.` Waveform pulse decays as the sentence completes. |
| 176–218| Four **orange marker boxes** sweep across the key phrases left→right, each revealing **white** text as it fills: **Pump P6**, **Line 3**, **yesterday**, **bearing**. Spaced so no two boxes touch. Staggered 10f. |
| 202–224| The small operator fades out, clearing the lower band for the chips. |
| 216    | Label drifts in: `EXTRACTED AS DATA POINTS` (9u, ink 55%). |
| 226–282| Chips spring up (+10px → 0) staggered 14f: `EQUIPMENT · PUMP P6`, `LOCATION · LINE 3`, `COMPONENT · BEARING`, `TIME · YESTERDAY`. |
| 282–326| Hold. Sentence with filled highlights + 4 chips. |
| 326–358| Global fade to 0. |

### 2b · `capture-speak-v2` (11 s, 330 frames) — kept-separate upgrade

A parallel composition (`CaptureSpeakV2.tsx`, id `capture-speak-v2`). The
original `capture-speak` is **left untouched** so we can always revert. **No
operator, no zoom intro** — it opens on a small standalone **capture phone**
(`CapturePhone`) showing an animated orange waveform + a pulsing REC dot; the
speech box points straight at it.

- **Real speech box**: the outline is one path (`BUBBLE_D`) whose bottom edge
  **breaks open into the tail** (tail mouth x100→x74, tip at 58,150) — no line
  runs through the connector. Revealed by a left→right clip-wipe. The phone fades
  out before the spreadsheet (`1 − easeOut(f,144,20)`), the tail stays as part of
  the box.
- **Animated capture waveform**: `WaveBars` on the phone screen and in the
  **bubble header**, pulsing per-bar while `energy = 1 − ease(f,96,30)` is high.
- **Cascade extraction**: the four phrases marker-sweep on with a lift, staggered
  12f (`HL_START=112`).
- **Database spreadsheet**: `FIELD | VALUE | LOGGED` (header, zebra, grid), rows
  `EQUIPMENT·PUMP P6 / LOCATION·LINE 3 / COMPONENT·BEARING / TIME·YESTERDAY`,
  each **timestamped** (`14:23:07`), rows glide in staggered.
- **✓ VALID**: green check + `VALID` + full stamp (`2026-07-18 14:23:07`).

Beats: 0–18 phone capturing, 12–42 speech-box wipe, 44–104 message types,
112–162 phrase cascade, 144–164 phone fade, 154 label, 166–228 spreadsheet,
236–266 VALID, hold, 296–328 fade.

---

## 3 · Film 2 — `capture-photo` (12 s, 360 frames)

**Story**: an operator photographs a machine's HMI screen; the captured photo
becomes a list of readings. Two phases, cross-faded under the shutter flash.

Geometry —
- **Phase A (wide)**: the shared `<Operator pose="photo">` at
  `translate(4,96) scale(0.58)` on the left, raising a landscape phone; a
  **machine** on the right (`Machine` component) — a cabinet (206,138, 128×118)
  with a mounted HMI screen (218,150, 104×80) showing the four readings small
  (teal), a motor/pump capsule (214,262, 112×30) with bolt detail, and conduit
  flanges. Terracotta viewfinder brackets frame the machine screen; `CAPTURING`
  label below.
- **Phase B (photo)**: HMI panel (48,14 → 312,166, rx 8) with header + 2 dots;
  four rows `TEMP 62 °C`, `PRESS 2.4 bar`, `SPEED 1450 RPM`, `STATUS RUN`
  (labels ink 60%, values teal, right-aligned x=296, y=64/90/116/142);
  terracotta corner marks + value boxes; extracted list at y=222/246/270/294
  with 7×7 teal squares.

`PHOTO_AT = 66`; Phase B is timed off `fb = frame − 66`.

| Frames | Beat |
| ------ | ---- |
| 0–24   | Machine settles in (−8px). Operator stands at left, raising his phone at the machine screen. |
| 26–50  | Viewfinder brackets **spring onto the machine screen** (aiming); `CAPTURING` fades in. |
| 56–66  | **Shutter**: full-frame white flash (GROUND 90%, 4f attack/decay) + a small scale kick; Phase A fades out under it. |
| 66–80  | The **captured photo** (Phase B) fades in: HMI panel + rows + corner marks. |
| 88–130 | Bounding boxes draw on around the four values, staggered 8f, terracotta. |
| 126    | Label: `EXTRACTED AS DATA POINTS`. |
| 138–200| List rows slide in from −14px, staggered 14f: teal square + `TEMP · 62 °C` … `STATUS · RUN`. |
| 200–326| Hold. |
| 326–358| Global fade. |

### 3b · `capture-photo-v2` (12 s, 360 frames) — kept-separate upgrade

A parallel composition (`CapturePhotoV2.tsx`, id `capture-photo-v2`). The
original `capture-photo` is **left untouched** so we can always revert to it.
This variant upgrades the clean HMI-screen concept (the live-site `image copy`
look) into "photographing a real machine":

- **HMI on a machine (Phase A)**: the screen is mounted on a shallow **extruded
  box** (front face + faintly-shaded top & right faces = a bit of depth), with a
  control faceplate on the right — a **green PWR indicator** (blinks), a **KEY
  switch** turned to ON (terracotta key line), and a **big red E-stop** (filled
  terracotta mushroom). No floating buttons; the old three bottom rectangles are
  removed. `MachineUnit` component.
- **Camera push-in**: a wrapper group scales `0.85→1.18` on the screen centre —
  gentle, so the machine stays readable as the subject.
- **Camera icon** (line-art, terracotta, fixed overlay) rises in and fires a
  **shutter** (lens fills, ring pops, full-frame flash) — `TAKING PHOTO`.
- **Extraction → spreadsheet (Phase B)**: value boxes draw on the captured
  photo; `EXTRACTED AS DATA POINTS`; then a **spreadsheet** table renders —
  columns `METRIC | VALUE | TIME`, header row, zebra striping, grid lines,
  values in teal, and a **per-row timestamp** (`14:23:07`). Rows glide in
  staggered.
- **✓ VALID**: a green check + `VALID` + full capture stamp
  (`2026-07-18 14:23:07`) springs in under the table (one pulse ring) —
  confirming the captured components match the source.

`PHOTO_AT = 70`; Phase B is `fb = frame − 70`. Beats: 0–70 machine + push-in,
viewfinder snaps ~22, camera rises ~30, shutter ~58–66 → 70–84 photo in,
90–130 boxes, 124 label, sheet 130+ (rows staggered), 222–255 VALID, hold, fade.
Timestamp/date consts (`TS`, `DATE`) are at the top of the file.

---

## 4 · Film 3 — `capture-check` (12 s, 360 frames)

**Story**: an operator runs a pre-start check on his phone. Open on him holding
the phone (list pose), dive into the screen, then step through the checklist —
each gate is confirmed by **pressing the green (forward) button** on a simple
bottom navbar (red cross on the left steps back, green check on the right steps
forward). When all gates pass, the check is APPROVED.

Geometry —
- **Phase A**: the shared `<Operator pose="list">` at `translate(130,72)
  scale(0.62)`, holding his phone; the whole group scales up (`zA = 1 + 1.5·…`)
  and fades as the camera "dives in".
- **Phase B**: phone (100,8 → 260,312, rx 22) with speaker line; title
  `PRE-START CHECK`; rail x=136; three gates at y=98/150/202 (circle r=12 +
  labels `GUARD IN PLACE`, `TEMP LOGGED`, `AREA CLEAR`); APPROVED pill
  (130,220, 100×30, rx 15). **Navbar** (divider y=262): left **back** button
  (143,285, 54×34) with a terracotta **✕**; right **forward** button (217,285)
  with a green **✓** that fills + ripples on each press.

`CHECK_AT = 66`; Phase B is timed off `fb = frame − 66`. Presses fire at
`fb = 24 / 60 / 96`. The pending gate carries a soft terracotta highlight ring;
the green button breathes while waiting, then depresses (scale 0.9, green fill,
white check, expanding ripple) on press, and the matching gate checks off.

| Frames | Beat |
| ------ | ---- |
| 0–54   | Operator holds his phone (tiny checklist on screen); camera **dives in** (scale-up + fade). |
| 54–66  | Cross-fade to the full phone UI (settles from 0.86→1); title + empty gates + navbar fade in. |
| 90–110 | **Press 1** (green button): gate 1 ring+check draw on, rail 1→2 fills; label brightens. |
| 120–150| **Press 2**: gate 2 passes; rail 2→3 fills. |
| 156–186| **Press 3**: gate 3 passes. |
| 180–210| `APPROVED` pill springs in + one green ring pulse expands and dissolves; both buttons rest. |
| 210–326| Hold. |
| 326–358| Global fade. |

### 4b · `capture-check-v2` (10 s, 300 frames) — kept-separate upgrade

A parallel composition (`CaptureCheckV2.tsx`, id `capture-check-v2`). The
original `capture-check` is **left untouched**. Changes:

- **No operator**: opens on a small phone and the **camera zooms into the deck**
  (`scale 0.5→1` around the phone centre, f0–46). The whole UI lives in one
  camera group.
- **Rail fixed**: connectors run **circle-edge → circle-edge only** (`RAIL`
  segments from `gate.y+R` to `next.y−R`) — nothing is ever drawn inside a
  circle. The green fill uses the same segments.
- **Slower, stepwise**: presses at frames **54 / 108 / 162** (was 24/60/96) with
  the pending-gate terracotta highlight + button breathe between, so each pass
  reads clearly.
- **Rename**: `TEMP LOGGED` → **`SAMPLE TAKEN`** (gate 2). `AREA CLEAR` unchanged.
- **Finale**: once all three pass, the checklist + navbar **fade out** and a
  **large, centred, green-filled `APPROVED`** (white letters, `152×46` at the
  phone centre) springs in with one pulse ring — a **short** outro (checks fade
  ~190–206, APPROVED ~202, hold, global fade from ~266).

---

## 5 · Film 4 — `connect-timeline` (14 s)

**Story**: human context and machine data land on one timeline; the camera
pulls back; a pattern is found, an insight generated, the result verified.

Geometry (all inside a camera group, origin 480,210): timeline y=210 from
x=30→854 + 886→916 with arrowhead; ticks; corner labels `OPERATOR CONTEXT`
(terracotta, 30,44) / `MACHINE DATA` (teal, 30,396); operator chips (48×48
rx 10: check @170, photo @400, voice @630) with 1.2 connectors down to r=5
dots; machine value tags (`62 °C` @250, `2.4 bar` @480, `1450 RPM` @710 —
8×8 squares on the line, tags below y=282); extra history (terracotta dots
r 3.5 @ 90/315/545/762/838, teal 6×6 squares @ 130/352/598/815); dashed
cluster box (378,128, 356×192, rx 8); 6 highlight rings; verified node
(870,210, r 14) + `VERIFIED RESULT`; status texts at y=414:
`CORRELATION DETECTED` (terracotta, centred x=300), `GENERATING INSIGHT`
(ink 70%, centred x=640).

| Frames | Beat |
| ------ | ---- |
| 0      | Camera at **scale 1.12** (we start close). |
| 0–24   | Timeline draws left → right; ticks fade in behind the draw edge; arrowhead pops at the end. Corner labels fade at f18. |
| 28–60  | Check chip: connector grows downward, dot pops, chip springs in above. |
| 55–90  | Photo chip + `62 °C` tag (square pops on line, connector grows down, tag draws). |
| 85–120 | Voice chip + `2.4 bar` + `1450 RPM`. |
| 130–190| **Camera zooms out** 1.12 → 0.90 (cubic in-out). While zooming, the extra history pops in staggered 5f — the line fills with weeks of context. |
| 195–220| Cluster box **draws on** (dashed stroke draw, one lap). |
| 222–262| The 6 highlight rings blink on (per-ring: on 3f, off 3f, on hold), staggered 4f. Simultaneously `CORRELATION DETECTED` **types on**. |
| 268–295| `GENERATING INSIGHT` types on. A 1.2-stroke ink line draws from the cluster box's right edge along the timeline toward x=856 — the insight travels forward. |
| 298–320| **Verified node**: circle pops (spring), check draws, `VERIFIED RESULT` fades in. |
| 320–390| Hold — the full instrument visible. |
| 390–420| Global fade. |

---

## 6 · Film 5 — `execute-loop` (14 s)

**Story**: captured in the field → the platform turns it into an instruction
→ back to the operator's phone → the loop continues.

Geometry: triptych on one stage. Left phone (115,70, 80×150, rx 12) with
terracotta camera glyph; dashed transfer arrows (215→345 and 585→715,
y=145) with travelling packets (r 4.5; terracotta out, green back); platform
hub (dashed circle 480,145 r=72) containing check chip (428,96), voice chip
(506,96), teal mini-tag (434,170); instruction card (498,150, 60×42, rx 7,
GROUND fill) with title bar + 2 checklist rows; right phone (765,70) with
notification card (737,100, 146×44, rx 8, GROUND fill): terracotta dot +
`ADJUST TEMP` / `Δ −2 °C` (mono 10); green check node (869,108, r 10); ping
rings at (805,88); loop-back dashed path y=296 with caption
`EVERY EXECUTED ACTION CREATES NEW EVIDENCE` (10u, ink 55%). Labels under
each station (10u, 700): `CAPTURED IN THE FIELD` (terracotta),
`TURNED INTO AN INSTRUCTION` (ink 70%), `BACK TO THE OPERATOR` (ink 70%).

| Frames | Beat |
| ------ | ---- |
| 0–22   | Left phone draws on; camera glyph pops; station label fades. |
| 34–40  | Camera **flash** inside the phone (same shutter treatment as film 2). |
| 48–68  | Arrow 1 draws left → right (dashed). |
| 68–96  | Terracotta packet travels the arrow (ease in-out), shrinks into the hub. |
| 90–115 | Hub dashed circle draws on; the three pieces inside pop in staggered 6f. |
| 125–150| The pieces **converge**: each translates ~10px toward the card position while the instruction card springs in on top; label 2 fades. Converged pieces drop to 40% opacity behind the card. |
| 162–182| Arrow 2 draws. |
| 182–210| Green packet travels to the right phone. |
| 205–225| Right phone draws on; label 3 fades. |
| 228–290| **Ping**: two expanding rings from the phone top (r 14 → ×1.6, opacity 0.8 → 0), two pulses each, offset 12f. At f240 the notification card springs in: `ADJUST TEMP / Δ −2 °C`. At f278 the green check node pops. |
| 300–330| Loop-back dashed path draws **right → left** underneath, arrowhead at the left end; caption fades in. |
| 330–390| Hold. |
| 390–420| Global fade. |

---

## 7 · Project architecture

```
video/
├── SCRIPTS.md                  ← this file
├── package.json                ← remotion, @remotion/cli, @remotion/google-fonts
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── index.ts                ← registerRoot
│   ├── Root.tsx                ← 5 <Composition> registrations
│   ├── brand.ts                ← palette, type, shared constants
│   ├── lib/
│   │   ├── anim.tsx            ← Ground, draw-on, window/typing/spring helpers
│   │   └── Operator.tsx       ← reusable operator figure, 3 poses (see below)
│   └── films/
│       ├── CaptureSpeak.tsx
│       ├── CapturePhoto.tsx
│       ├── CaptureCheck.tsx
│       ├── ConnectTimeline.tsx
│       ├── ExecuteLoop.tsx
│       └── OperatorPreview.tsx ← design harness (composition `operator`), not shipped
└── out/                        ← rendered .mp4 files
```

Composition IDs: `capture-speak`, `capture-photo`, `capture-check`,
`connect-timeline`, `execute-loop` (plus `operator`, a static design harness).

Render: `npx remotion render <id> out/<id>.mp4` (H.264, defaults).

### Reusable operator (`lib/Operator.tsx`)

One line-art figure (hard hat, faceless-but-minimal face, overalls, boots),
authored in a 160×300 box (feet ≈y296, centred x=80). Three poses share the
body: `speak` (phone at the face, bent elbow), `photo` (landscape phone raised
in both hands), `list` (portrait phone held low). Props: `pose`, `opacity`,
`id` (unique — clipPath ids), `detail` (drop micro-lines when drawn small),
`screen` (replace the speak phone's screen content, clipped to `PHONE_SCREEN`).
All strokes use `non-scaling-stroke`. Exports geometry constants `OPERATOR_BOX`,
`PHONE_SCREEN`, `LIST_PHONE_SCREEN`, `PHOTO_PHONE` for placement/anchoring.

## 8 · Acceptance checklist (per film)

1. Two-voice mapping never violated; green only at verification moments.
2. Uniform thin strokes; no shadow/gradient/glow anywhere.
3. All text JetBrains Mono; only the strings in this document.
4. Structure draws on; data pops/types; only Connect moves the camera.
5. Ruled `GROUND` background present; film starts and ends on the empty page
   (clean loop).
6. Reads correctly with the site copy next to it — each film demonstrates the
   claim of its section (capture in 20 s / one timeline / the loop closes).

## 9 · Licensing note

Remotion is source-available, **not** MIT: a company license is required for
teams of 4+ people (see remotion.pro). Oppr's team page lists 9 people —
budget a company license before shipping these renders publicly.
