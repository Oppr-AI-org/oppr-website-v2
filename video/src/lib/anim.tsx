/*
 * Shared motion grammar for the Oppr films (see SCRIPTS.md §1).
 * - Structure DRAWS on (stroke dash over pathLength=1), eased — never linear
 * - Data POPS (tight springs) or TYPES (mono substring reveal)
 * - Transients FADE in/out — nothing appears or vanishes in a single frame
 * - Every film ends with an eased global fade for a clean <video loop>
 */
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GROUND, INK } from "../brand";

/** Clamped linear 0→1 window — reserve for typing and fade ramps. */
export const win = (frame: number, start: number, dur = 12): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Eased 0→1 window (cubic in-out) — draws, wipes, camera, travel. */
export const ease = (frame: number, start: number, dur = 12): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

/** Eased 0→1 window (cubic out) — arrivals that decelerate to rest. */
export const easeOut = (frame: number, start: number, dur = 12): number =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

/** Tight spring (no decorative bounce) for chip/node entrances. */
export const pop = (frame: number, fps: number, start: number): number =>
  frame < start
    ? 0
    : spring({
        frame: frame - start,
        fps,
        config: { damping: 14, stiffness: 120, mass: 0.8 },
      });

/** Stroke draw-on props: element must accept pathLength (path/line/rect/circle).
 *  Hidden entirely at p=0 — the dash trick otherwise leaves a seed dot. */
export const draw = (p: number) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - p,
  ...(p <= 0 ? { visibility: "hidden" as const } : {}),
});

/** Fade a traveller in and out over its journey (0→1 progress in, opacity out). */
export const travelFade = (p: number): number =>
  interpolate(p, [0, 0.12, 0.86, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/** Mono typing reveal, ~charsPerFrame chars each frame. */
export const typed = (
  text: string,
  frame: number,
  start: number,
  charsPerFrame = 1.2
): string =>
  frame < start
    ? ""
    : text.slice(0, Math.min(text.length, Math.floor((frame - start) * charsPerFrame)));

/** Ruled warm-white ground — matches the site's 32px baseline grid. */
export const Ground: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <g>
    <rect x={0} y={0} width={w} height={h} fill={GROUND} />
    {Array.from({ length: Math.floor(h / 32) }, (_, i) => (
      <line
        key={i}
        x1={0}
        y1={(i + 1) * 32}
        x2={w}
        y2={(i + 1) * 32}
        stroke={INK}
        strokeOpacity={0.025}
        strokeWidth={1}
      />
    ))}
  </g>
);

/**
 * Film shell: ground + a global-fade group. Children render in viewBox
 * coordinates; the last `fadeFrames` of the film ease everything out so the
 * loop restarts on the empty ruled page.
 */
export const Film: React.FC<{
  viewW: number;
  viewH: number;
  children: React.ReactNode;
  fadeFrames?: number;
}> = ({ viewW, viewH, children, fadeFrames = 34 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const out = interpolate(
    frame,
    [durationInFrames - fadeFrames, durationInFrames - 2],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.quad),
    }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: GROUND }}>
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <Ground w={viewW} h={viewH} />
        <g opacity={out}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};
