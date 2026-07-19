/*
 * OperatorV3 — third pass on the line-art operator figure.
 *
 * What changed against V2 (lib/OperatorV2.tsx):
 *   - Arms are continuous limbs with real elbows. Each arm is a single bent
 *     path rendered as a two-layer stroke (terracotta tube edged over a
 *     ground core), so joints are smooth and nothing reads as detached
 *     capsules.
 *   - Natural poses. Speak holds the phone in front of the chin, elbow at
 *     the side (no more arm crossing the chest like a sash). Photo raises
 *     the phone to just below the eyes so the operator peeks over the
 *     camera instead of losing the whole face.
 *   - Tonal depth: hat, bib, straps, hi-vis bands, muffs and boots carry a
 *     faint terracotta tint fill, so the figure is no longer pure outline.
 *   - Character: ear defenders on the helmet, a helmet badge, and a tapered
 *     torso instead of the shapeless bell.
 *
 * Same API and coordinate box as V1/V2 (0..160 × 0..300, centred on x=80,
 * boots on y≈268) so it is a drop-in: swap the import, keep the props.
 * Phone anchors moved — films that draw source-link lines should target:
 *   speak (98, 95) · photo (80, 76) · list (80, 124)  (body space).
 */
import React from "react";
import { GROUND, HUMAN, INK, MACHINE } from "../brand";

export type OperatorPose = "speak" | "photo" | "list";

export const OPERATOR_BOX = { w: 160, h: 300 } as const;

/** Screen rect of the shared phone unit, in the phone's local coordinates. */
export const PHONE_SCREEN = { x: -9, y: -16, w: 18, h: 35 } as const;

/** Same device in every pose, so the list screen is the speak screen. */
export const LIST_PHONE_SCREEN = PHONE_SCREEN;

/** Body-space bounds of the landscape (photo) phone: the same unit, turned. */
export const PHOTO_PHONE = { x: 58, y: 65, w: 44, h: 22 } as const;

const nss = { vectorEffect: "non-scaling-stroke" } as const;
const line = {
  fill: "none",
  stroke: HUMAN,
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...nss,
} as const;
const fine = { ...line, strokeWidth: 1.1 } as const;
const shape = { ...line, fill: GROUND } as const;
const stitch = { ...fine, strokeDasharray: "2.5 3" } as const;
/** Faint terracotta wash layered over an already-stroked shape. */
const tint = { fill: HUMAN, fillOpacity: 0.08, stroke: "none" } as const;

/*
 * A limb as one bent path: a wide terracotta stroke with a slightly narrower
 * ground-coloured core on top. Round joins give real elbows; the core
 * occludes whatever the arm passes in front of. Deliberately NOT
 * non-scaling: the tube must scale with the figure.
 */
const Limb: React.FC<{ d: string; w?: number }> = ({ d, w = 10.5 }) => (
  <>
    <path d={d} fill="none" stroke={HUMAN} strokeWidth={w + 3} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={GROUND} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export type OperatorProps = {
  pose?: OperatorPose;
  opacity?: number;
  /** Custom screen content for the speak phone. */
  screen?: React.ReactNode;
  /** Unique prefix for internal clipPath ids. */
  id?: string;
  /** Drop fine detail lines when the figure is drawn small. */
  detail?: boolean;
};

/* The one phone. Portrait 22×44, camera dot top-centre, 18×35 screen. */
const PhoneUnit: React.FC<{ clipId: string; children?: React.ReactNode }> = ({ clipId, children }) => (
  <>
    <rect x={-11} y={-22} width={22} height={44} rx={5} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
    <circle cx={0} cy={-19} r={0.9} fill={INK} opacity={0.5} stroke="none" />
    <rect
      x={PHONE_SCREEN.x}
      y={PHONE_SCREEN.y}
      width={PHONE_SCREEN.w}
      height={PHONE_SCREEN.h}
      rx={2}
      fill="none"
      stroke={INK}
      strokeWidth={1}
      opacity={0.3}
      {...nss}
    />
    <clipPath id={clipId}>
      <rect x={PHONE_SCREEN.x} y={PHONE_SCREEN.y} width={PHONE_SCREEN.w} height={PHONE_SCREEN.h} rx={2} />
    </clipPath>
    <g clipPath={`url(#${clipId})`}>{children}</g>
  </>
);

/** A gloved hand: mitt shape, finger lines, thumb. Centred on (0,0). */
const Hand: React.FC<{ x: number; y: number; flip?: boolean; detail: boolean }> = ({ x, y, flip = false, detail }) => (
  <g transform={`translate(${x} ${y})${flip ? " scale(-1 1)" : ""}`}>
    <path d="M-3.2 -4.6 Q-6.6 -2.8 -5.4 1.6 Q-4 6 1 5.4 Q5.8 4.6 5.8 0.2 Q5.8 -3.8 2 -5 Q-1 -5.8 -3.2 -4.6 Z" {...shape} />
    {detail && (
      <>
        <path d="M-3.2 -2.4 Q0.2 -3.2 3.6 -2.2 M-3.2 0.4 Q0.4 -0.4 4 0.6" {...fine} opacity={0.5} />
        <path d="M4.4 -2.8 Q6.8 -1 5.6 2" {...fine} opacity={0.6} />
      </>
    )}
  </g>
);

const FaceAndHat: React.FC<{ detail: boolean }> = ({ detail }) => (
  <>
    {/* Neck, then t-shirt collar over the torso. */}
    <path d="M73 75 L73.5 85 L86.5 85 L87 75 Z" {...shape} />
    <path d="M76.5 79 Q80 80.4 83.5 79" {...fine} opacity={0.35} />
    <path d="M70 83.5 Q80 89 90 83.5 L90 87 Q80 93 70 87 Z" {...shape} />

    {/* Face. */}
    <path d="M63.5 49 C62.6 60.5 65 70.5 70.8 74.8 C74.6 77.6 85.4 77.6 89.2 74.8 C95 70.5 97.4 60.5 96.5 49 Z" {...shape} />
    {detail && (
      <>
        <line x1={64.9} y1={50.5} x2={64.9} y2={54.5} {...fine} opacity={0.45} />
        <line x1={95.1} y1={50.5} x2={95.1} y2={54.5} {...fine} opacity={0.45} />
      </>
    )}
    <path d="M70.6 56.2 Q73.6 54.7 76.6 56" {...fine} />
    <path d="M89.4 56.2 Q86.4 54.7 83.4 56" {...fine} />
    <circle cx={73.5} cy={60} r={1.35} fill={HUMAN} stroke="none" />
    <circle cx={86.5} cy={60} r={1.35} fill={HUMAN} stroke="none" />
    <path d="M80.4 60 Q78.8 64.4 81 65.4" {...line} />
    <ellipse cx={80} cy={70.8} rx={2.5} ry={2} fill={HUMAN} stroke="none" />
    {detail && (
      <>
        <path d="M68.4 65.4 Q69.8 67 71.6 66.8" {...fine} opacity={0.3} />
        <path d="M91.6 65.4 Q90.2 67 88.4 66.8" {...fine} opacity={0.3} />
      </>
    )}

    {/* Hard hat: crown, ridge, ribs, badge, brim — with a faint wash. */}
    <path d="M60.5 46.5 C60.5 28.5 68.5 20 80 20 C91.5 20 99.5 28.5 99.5 46.5 Z" {...shape} />
    <path d="M60.5 46.5 C60.5 28.5 68.5 20 80 20 C91.5 20 99.5 28.5 99.5 46.5 Z" {...tint} />
    <path d="M72.5 23.6 Q80 19.2 87.5 23.6" {...line} />
    <path d="M74 26.4 Q80 22.8 86 26.4" {...fine} opacity={0.5} />
    {detail && (
      <>
        <path d="M68.6 25.6 C66.6 31 65.8 38.6 65.8 46.5" {...fine} opacity={0.4} />
        <path d="M91.4 25.6 C93.4 31 94.2 38.6 94.2 46.5" {...fine} opacity={0.4} />
        <rect x={76.25} y={31.5} width={7.5} height={5} rx={1} {...fine} opacity={0.5} />
      </>
    )}
    <path d="M56.5 46.2 Q56 51.4 80 51.8 Q104 51.4 103.5 46.2 Q94 43.6 80 43.6 Q66 43.6 56.5 46.2 Z" {...shape} />
    <path d="M56.5 46.2 Q56 51.4 80 51.8 Q104 51.4 103.5 46.2 Q94 43.6 80 43.6 Q66 43.6 56.5 46.2 Z" {...tint} />

    {/* Ear defenders hung from the helmet. */}
    <path d="M58.5 49.5 Q56 53.5 57.6 56.6" {...line} opacity={0.8} />
    <path d="M101.5 49.5 Q104 53.5 102.4 56.6" {...line} opacity={0.8} />
    <ellipse cx={60} cy={60.5} rx={4.3} ry={5.4} {...shape} />
    <ellipse cx={60} cy={60.5} rx={4.3} ry={5.4} {...tint} fillOpacity={0.14} />
    <ellipse cx={100} cy={60.5} rx={4.3} ry={5.4} {...shape} />
    <ellipse cx={100} cy={60.5} rx={4.3} ry={5.4} {...tint} fillOpacity={0.14} />
    {detail && (
      <>
        <ellipse cx={60} cy={60.5} rx={1.9} ry={2.8} {...fine} opacity={0.4} />
        <ellipse cx={100} cy={60.5} rx={1.9} ry={2.8} {...fine} opacity={0.4} />
      </>
    )}
  </>
);

const SpeakPose: React.FC<{
  detail: boolean;
  id: string;
  screen?: React.ReactNode;
}> = ({ detail, id, screen }) => (
  <>
    {/* Viewer-left arm relaxed at the side. */}
    <Limb d="M61 92 C50.5 97.5 46.6 111 46.9 129 C47.1 140 48.5 150.5 50.6 157.5" />
    {detail && <path d="M47.6 151.5 L54.4 150.7" {...fine} opacity={0.5} />}
    <Hand x={51.5} y={163.5} detail={detail} />

    {/* Viewer-right arm: elbow at the side, phone up in front of the chin. */}
    <Limb d="M100 93 C107 99 110.5 111 110.2 125 C107.6 119.6 103.4 114 100.4 111" />
    {detail && <path d="M97.6 114.8 L104.8 110.8" {...fine} opacity={0.5} />}

    {/* The phone in front of the chest, screen toward camera. */}
    <g transform="translate(98 95) rotate(-12)">
      <PhoneUnit clipId={`${id}-phone-screen`}>
        {screen ?? (
          <>
            <line x1={-4} y1={-3.5} x2={-4} y2={3.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
            <line x1={0} y1={-6.5} x2={0} y2={6.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
            <line x1={4} y1={-4.5} x2={4} y2={4.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
          </>
        )}
      </PhoneUnit>
    </g>
    <Hand x={101.5} y={113.5} detail={detail} />
  </>
);

const PhotoPose: React.FC<{ detail: boolean; id: string }> = ({ detail, id }) => (
  <>
    {/* Both arms folded up to the raised phone. */}
    <Limb d="M64 91 C54 96.5 48.8 104.5 47.8 113.8 C51 103.5 53.6 92.5 55.8 81.8" />
    <Limb d="M96 91 C106 96.5 111.2 104.5 112.2 113.8 C109 103.5 106.4 92.5 104.2 81.8" />
    {detail && (
      <>
        <path d="M51.8 87.5 L59.6 86" {...fine} opacity={0.5} />
        <path d="M108.2 87.5 L100.4 86" {...fine} opacity={0.5} />
      </>
    )}

    {/* The same phone unit, landscape, just below the eyes. */}
    <g transform="translate(80 76) rotate(90)">
      <PhoneUnit clipId={`${id}-photo-screen`} />
    </g>
    {/* Viewfinder brackets and shutter, drawn unrotated over the screen. */}
    <g fill="none" stroke={MACHINE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...nss}>
      <path d="M70 73 L70 70.5 L72.5 70.5 M89.5 70.5 L92 70.5 L92 73 M70 79 L70 81.5 L72.5 81.5 M89.5 81.5 L92 81.5 L92 79" />
    </g>
    <circle cx={97} cy={70.5} r={1.7} fill={MACHINE} stroke="none" />

    <Hand x={55.5} y={76} detail={detail} />
    <Hand x={104.5} y={76} flip detail={detail} />
  </>
);

const ListPose: React.FC<{ detail: boolean; id: string }> = ({ detail, id }) => (
  <>
    {/* Both arms bent to a low grip. */}
    <Limb d="M63 91 C55.5 96 52 108 53.6 121.5 C57.6 124.8 62.6 126.4 67 127" />
    <Limb d="M97 91 C104.5 96 108 108 106.4 121.5 C102.4 124.8 97.4 126.4 93 127" />
    {detail && (
      <>
        <path d="M62 119.4 L63.6 127" {...fine} opacity={0.5} />
        <path d="M98 119.4 L96.4 127" {...fine} opacity={0.5} />
      </>
    )}

    {/* The same phone unit, portrait, held low: a short checklist. */}
    <g transform="translate(80 124)">
      <PhoneUnit clipId={`${id}-list-screen`}>
        <line x1={-5.5} y1={-11} x2={5.5} y2={-11} stroke={MACHINE} strokeWidth={1.4} strokeLinecap="round" opacity={0.5} {...nss} />
        <g fill="none" stroke={MACHINE} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" {...nss}>
          <path d="M-6 -4.5 L-4.2 -2.7 L-1.2 -6.1" />
          <line x1={1.5} y1={-4} x2={6.5} y2={-4} />
          <path d="M-6 2.5 L-4.2 4.3 L-1.2 0.9" />
          <line x1={1.5} y1={3} x2={6.5} y2={3} />
          <rect x={-6.2} y={8} width={3.6} height={3.6} rx={0.6} />
          <line x1={1.5} y1={10} x2={6.5} y2={10} />
        </g>
      </PhoneUnit>
    </g>
    <Hand x={67} y={124} detail={detail} />
    <Hand x={93} y={124} flip detail={detail} />
  </>
);

export const OperatorV3: React.FC<OperatorProps> = ({
  pose = "speak",
  opacity = 1,
  screen,
  id = "op3",
  detail = true,
}) => {
  if (opacity <= 0) return null;

  return (
    <g opacity={opacity}>
      {/* Legs: tapered trouser legs meeting at the crotch. */}
      <path d="M54.5 174 C53.3 194 52.7 222 53.7 249.5 L71.7 249.5 C73 226 75.2 202 79 185 L80 174 Z" {...shape} />
      <path d="M105.5 174 C106.7 194 107.3 222 106.3 249.5 L88.3 249.5 C87 226 84.8 202 81 185 L80 174 Z" {...shape} />
      <path d="M80 177 C79.4 180.6 79 183.4 78.8 185.8" {...fine} opacity={0.4} />
      {detail && (
        <>
          <path d="M63 190 C62 208 61.6 230 61.8 248" {...fine} opacity={0.28} />
          <path d="M97 190 C98 208 98.4 230 98.2 248" {...fine} opacity={0.28} />
          <path d="M55.6 210 q8 2.6 15 0.6" {...stitch} opacity={0.4} />
          <path d="M104.4 210 q-8 2.6 -15 0.6" {...stitch} opacity={0.4} />
          <line x1={53.9} y1={244.5} x2={71.7} y2={244.5} {...fine} opacity={0.4} />
          <line x1={106.1} y1={244.5} x2={88.3} y2={244.5} {...fine} opacity={0.4} />
        </>
      )}
      {/* Hi-vis band across each shin, with a wash. */}
      <path d="M55.1 233 L72.5 232.4 L72.3 238.4 L55.4 239 Z" {...tint} fillOpacity={0.15} />
      <path d="M104.9 233 L87.5 232.4 L87.7 238.4 L104.6 239 Z" {...tint} fillOpacity={0.15} />
      <path d="M55.1 233 L72.5 232.4 M55.4 239 L72.3 238.4" {...fine} opacity={0.55} />
      <path d="M104.9 233 L87.5 232.4 M104.6 239 L87.7 238.4" {...fine} opacity={0.55} />

      {/* Boots: upper, toe cap, laces, separate sole with heel, washed. */}
      <path d="M53.4 249.5 L52.5 259 Q52.2 263 55.9 263 L69.6 263 Q72.8 263 72.6 259.6 L72 249.5 Z" {...shape} />
      <path d="M53.4 249.5 L52.5 259 Q52.2 263 55.9 263 L69.6 263 Q72.8 263 72.6 259.6 L72 249.5 Z" {...tint} />
      <path d="M106.6 249.5 L107.5 259 Q107.8 263 104.1 263 L90.4 263 Q87.2 263 87.4 259.6 L88 249.5 Z" {...shape} />
      <path d="M106.6 249.5 L107.5 259 Q107.8 263 104.1 263 L90.4 263 Q87.2 263 87.4 259.6 L88 249.5 Z" {...tint} />
      <path d="M51.3 263 L74.2 263 Q75.8 263 75.8 265.4 Q75.8 267.6 73.6 267.6 L53.5 267.6 Q51.3 267.6 51.3 265.4 Z" {...shape} />
      <path d="M108.7 263 L85.8 263 Q84.2 263 84.2 265.4 Q84.2 267.6 86.4 267.6 L106.5 267.6 Q108.7 267.6 108.7 265.4 Z" {...shape} />
      {detail && (
        <>
          <path d="M64.4 250.5 Q70 253.4 71.8 258.6" {...fine} opacity={0.5} />
          <path d="M95.6 250.5 Q90 253.4 88.2 258.6" {...fine} opacity={0.5} />
          <path d="M58 253 L64 252.6 M58.3 256 L64.3 255.6" {...fine} opacity={0.45} />
          <path d="M102 253 L96 252.6 M101.7 256 L95.7 255.6" {...fine} opacity={0.45} />
          <line x1={67.8} y1={263.6} x2={67.8} y2={267} {...fine} opacity={0.35} />
          <line x1={92.2} y1={263.6} x2={92.2} y2={267} {...fine} opacity={0.35} />
        </>
      )}

      {/* Torso: tapered overalls over a shirt. */}
      <path d="M54.5 174 C54.6 165 55 157 55.9 150 C53.4 135 53 118 53.6 105 C54 93.5 59 87.5 80 87.5 C101 87.5 106 93.5 106.4 105 C107 118 106.6 135 104.1 150 C105 157 105.4 165 105.5 174 Z" {...shape} />
      {detail && (
        <>
          <path d="M59.4 100 q2.4 8 1.6 15" {...fine} opacity={0.3} />
          <path d="M100.6 100 q-2.4 8 -1.6 15" {...fine} opacity={0.3} />
        </>
      )}
      {/* Straps with buckles onto the bib, washed. */}
      <path d="M66.4 89 C65.7 96.5 65.4 104.5 65.7 111.5 L69.6 111.5 C69.3 104.5 69.5 96.5 70.2 89.8 Z" {...shape} />
      <path d="M66.4 89 C65.7 96.5 65.4 104.5 65.7 111.5 L69.6 111.5 C69.3 104.5 69.5 96.5 70.2 89.8 Z" {...tint} />
      <path d="M93.6 89 C94.3 96.5 94.6 104.5 94.3 111.5 L90.4 111.5 C90.7 104.5 90.5 96.5 89.8 89.8 Z" {...shape} />
      <path d="M93.6 89 C94.3 96.5 94.6 104.5 94.3 111.5 L90.4 111.5 C90.7 104.5 90.5 96.5 89.8 89.8 Z" {...tint} />
      <rect x={64.6} y={109.4} width={6.2} height={4.6} rx={0.8} {...line} />
      <rect x={89.2} y={109.4} width={6.2} height={4.6} rx={0.8} {...line} />
      {/* Bib with stitching, pocket, pen, washed. */}
      <path d="M65.7 112 L94.3 112 L94.3 140 Q94.3 142.4 91.9 142.4 L68.1 142.4 Q65.7 142.4 65.7 140 Z" {...shape} />
      <path d="M65.7 112 L94.3 112 L94.3 140 Q94.3 142.4 91.9 142.4 L68.1 142.4 Q65.7 142.4 65.7 140 Z" {...tint} />
      {detail && <path d="M68 114.6 L92 114.6" {...stitch} opacity={0.4} />}
      <circle cx={68.5} cy={117.6} r={1.3} fill={HUMAN} stroke="none" />
      <circle cx={91.5} cy={117.6} r={1.3} fill={HUMAN} stroke="none" />
      <path d="M71.5 120 H88.5 V131.6 Q88.5 133.4 86.7 133.4 H73.3 Q71.5 133.4 71.5 131.6 Z" {...line} />
      <path d="M76.4 116.4 L76.4 123.4" {...line} strokeWidth={2} />
      {detail && <path d="M77.9 117.2 L77.9 121" {...fine} opacity={0.6} />}
      {/* Waist seams, hip pockets, hammer loop. */}
      <path d="M56.5 152 Q80 156 103.5 152" {...line} opacity={0.5} />
      {detail && <path d="M56.7 156 Q80 159.6 103.3 156" {...stitch} opacity={0.35} />}
      <path d="M55 160 Q61 158.4 64.4 164.6" {...line} opacity={0.6} />
      <path d="M105 160 Q99 158.4 95.6 164.6" {...line} opacity={0.6} />
      {detail && <path d="M99.6 166 q5 2.6 0.6 7" {...fine} opacity={0.6} />}

      <FaceAndHat detail={detail} />

      {pose === "speak" && <SpeakPose detail={detail} id={id} screen={screen} />}
      {pose === "photo" && <PhotoPose detail={detail} id={id} />}
      {pose === "list" && <ListPose detail={detail} id={id} />}
    </g>
  );
};

export default OperatorV3;
