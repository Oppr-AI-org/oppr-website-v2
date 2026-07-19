/*
 * OperatorV2 — refined line-art operator figure for the films.
 *
 * Second pass on lib/Operator.tsx after review: less blocky, more drawn.
 * What changed against V1:
 *   - ONE phone unit everywhere. The speak, photo and list phones are the same
 *     22×44 device (PhoneUnit); photo simply turns it landscape. V1 had three
 *     different sizes, which read as a mistake.
 *   - Tapered limbs with visible wrists, cuffs and gloved hands (thumb +
 *     finger lines) instead of tube arms ending in blobs.
 *   - Legs taper toward the hem, with crease, knee-panel stitching and a
 *     hi-vis band at the shin; boots get a separate sole, toe cap and laces.
 *   - Overalls get real straps with buckles, a stitched bib with pen pocket,
 *     slanted hip pockets, waist seams and a hammer loop.
 *   - Fuller face (ears, brows, cheeks) and a ridged hard hat with side ribs.
 *
 * Same API and coordinate box as V1 (0..160 × 0..300, centred on x=80, boots
 * on y≈268) so it is a drop-in: swap the import, keep the props.
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
export const PHOTO_PHONE = { x: 58, y: 58, w: 44, h: 22 } as const;

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

/*
 * The one phone. Portrait 22×44, camera dot top-centre, 18×35 screen.
 * Mount with a translate (and rotate(90) for landscape); children render
 * clipped to the screen.
 */
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

const FaceAndHat: React.FC<{ detail: boolean }> = ({ detail }) => (
  <>
    {/* Neck, then t-shirt collar over the torso. */}
    <path d="M73 75 L73.5 85 L86.5 85 L87 75 Z" {...shape} />
    <path d="M76.5 79 Q80 80.4 83.5 79" {...fine} opacity={0.35} />
    <path d="M70 83.5 Q80 89 90 83.5 L90 87 Q80 93 70 87 Z" {...shape} />

    {/* Ears first so the face overlaps their inner edge. */}
    <path d="M64.5 57.4 Q59.4 56.8 59.6 61.8 Q59.8 66.6 64.8 66 Z" {...shape} />
    <path d="M95.5 57.4 Q100.6 56.8 100.4 61.8 Q100.2 66.6 95.2 66 Z" {...shape} />

    {/* Face. */}
    <path d="M63.5 49 C62.6 60.5 65 70.5 70.8 74.8 C74.6 77.6 85.4 77.6 89.2 74.8 C95 70.5 97.4 60.5 96.5 49 Z" {...shape} />
    {detail && (
      <>
        <path d="M62.1 60.2 Q61.2 61.9 62.4 63.5" {...fine} opacity={0.4} />
        <path d="M97.9 60.2 Q98.8 61.9 97.6 63.5" {...fine} opacity={0.4} />
        <line x1={64.9} y1={50.5} x2={64.9} y2={55} {...fine} opacity={0.45} />
        <line x1={95.1} y1={50.5} x2={95.1} y2={55} {...fine} opacity={0.45} />
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

    {/* Hard hat: crown, front-to-back ridge, side ribs, brim. */}
    <path d="M60.5 46.5 C60.5 28.5 68.5 20 80 20 C91.5 20 99.5 28.5 99.5 46.5 Z" {...shape} />
    <path d="M72.5 23.6 Q80 19.2 87.5 23.6" {...line} />
    <path d="M74 26.4 Q80 22.8 86 26.4" {...fine} opacity={0.5} />
    {detail && (
      <>
        <path d="M68.6 25.6 C66.6 31 65.8 38.6 65.8 46.5" {...fine} opacity={0.4} />
        <path d="M91.4 25.6 C93.4 31 94.2 38.6 94.2 46.5" {...fine} opacity={0.4} />
      </>
    )}
    <path d="M56.5 46.2 Q56 51.4 80 51.8 Q104 51.4 103.5 46.2 Q94 43.6 80 43.6 Q66 43.6 56.5 46.2 Z" {...shape} />
    {detail && <path d="M58.5 48.6 Q80 50.4 101.5 48.6" {...fine} opacity={0.35} />}
  </>
);

const SpeakPose: React.FC<{
  detail: boolean;
  id: string;
  screen?: React.ReactNode;
}> = ({ detail, id, screen }) => (
  <>
    {/* Viewer-left arm relaxed at the side: tapered, cuff at the wrist. */}
    <path
      d="M60 94 C50 98 45.5 112 45.8 130 C46 143 47.5 154 50 160 L58.5 158.5 C56.5 146 55.6 132 56.4 120 C57 110 59 101 62.5 96.5 Q62 93.5 60 94 Z"
      {...shape}
    />
    {detail && <path d="M48.8 153.5 L57.8 152.3" {...fine} opacity={0.5} />}
    <path
      d="M49.5 159 Q46.8 160 46.6 164 Q46.6 169.5 51 170.5 Q56 171.3 57.8 167 Q59 163.5 57.5 160.5 Q54 158 49.5 159 Z"
      {...shape}
    />
    {detail && (
      <>
        <path d="M50.5 170 L50.7 165.8 M53.5 170.8 L53.6 166" {...fine} opacity={0.45} />
        <path d="M57.3 161.5 Q59.3 163 58.3 166" {...fine} opacity={0.6} />
      </>
    )}

    {/* Viewer-right arm bent: upper arm down, forearm up to the phone. */}
    <path
      d="M99 95 C106 97 109.5 106 109.5 118 C109.5 126 108.6 133 106.5 138 Q103 143.5 98.5 139.5 L95 134 C98.3 123 98 108 97.5 100 Q97.7 95.5 99 95 Z"
      {...shape}
    />
    <path
      d="M96.5 131.5 C86 119.5 71 103.5 60.5 92.5 Q56.8 88.6 53.4 92.6 Q50.6 96.8 55.4 101 C66.5 111.5 82 128 94 141 Q99.5 146 103.4 141.2 Q106.6 136.8 101.4 131.8 Z"
      {...shape}
    />
    {detail && (
      <>
        <path d="M94.5 133 Q100 132 103.5 137" {...fine} opacity={0.5} />
        <path d="M60 96 Q63.5 98.5 62 103" {...fine} opacity={0.5} />
      </>
    )}

    {/* The phone at the face; screen toward camera. */}
    <g transform="translate(50 72) rotate(-14)">
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

    {/* Gloved hand gripping the phone's lower edge, thumb to the inside. */}
    <path
      d="M52.6 89.8 Q49.2 91.6 50.4 96 Q51.8 100.4 56.8 99.8 Q61.6 99 61.6 94.6 Q61.6 90.6 57.8 89.4 Q54.8 88.6 52.6 89.8 Z"
      {...shape}
    />
    {detail && (
      <>
        <path d="M52.6 92 Q56 91.2 59.4 92.2 M52.6 94.8 Q56.2 94 59.8 95" {...fine} opacity={0.5} />
        <path d="M60.2 91.6 Q62.6 93.4 61.4 96.4" {...fine} opacity={0.6} />
      </>
    )}
  </>
);

const PhotoPose: React.FC<{ detail: boolean; id: string }> = ({ detail, id }) => (
  <>
    {/* Both arms raised; upper arm out to the elbow, forearm up to the grip. */}
    <path d="M61 95.5 Q52.5 97.5 46.5 106.5 Q42.5 112.5 47.3 116.6 Q52 120 55.8 114.4 L64.5 102.4 Q66.5 97.5 61 95.5 Z" {...shape} />
    <path d="M46.8 107.5 Q43.8 111.8 47.6 116.4 Q51.6 120.2 55.6 115 L62.8 83.5 Q64 78.2 59.2 76.4 Q54.4 75 52.4 80.8 Z" {...shape} />
    <path d="M99 95.5 Q107.5 97.5 113.5 106.5 Q117.5 112.5 112.7 116.6 Q108 120 104.2 114.4 L95.5 102.4 Q93.5 97.5 99 95.5 Z" {...shape} />
    <path d="M113.2 107.5 Q116.2 111.8 112.4 116.4 Q108.4 120.2 104.4 115 L97.2 83.5 Q96 78.2 100.8 76.4 Q105.6 75 107.6 80.8 Z" {...shape} />
    {detail && (
      <>
        <path d="M46 111 Q50 108.4 54.6 113" {...fine} opacity={0.5} />
        <path d="M114 111 Q110 108.4 105.4 113" {...fine} opacity={0.5} />
        <path d="M53.4 82 L61.6 80.4" {...fine} opacity={0.5} />
        <path d="M106.6 82 L98.4 80.4" {...fine} opacity={0.5} />
      </>
    )}

    {/* The same phone unit, turned landscape at eye level. */}
    <g transform="translate(80 69) rotate(90)">
      <PhoneUnit clipId={`${id}-photo-screen`} />
    </g>
    {/* Viewfinder brackets and shutter, drawn unrotated over the screen. */}
    <g fill="none" stroke={MACHINE} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...nss}>
      <path d="M71.5 66 L71.5 63.5 L74 63.5 M89.5 63.5 L92 63.5 L92 66 M71.5 72 L71.5 74.5 L74 74.5 M89.5 74.5 L92 74.5 L92 72" />
    </g>
    <circle cx={97} cy={63.5} r={1.7} fill={MACHINE} stroke="none" />

    {/* Gloved hands wrapping the phone's short edges. */}
    <path d="M56 62.8 Q52 63.6 51.8 68.4 Q51.8 74 56.8 74.9 L60.6 75.2 Q63 71.8 62.4 67 L61.8 63 Q58.8 62.2 56 62.8 Z" {...shape} />
    <path d="M104 62.8 Q108 63.6 108.2 68.4 Q108.2 74 103.2 74.9 L99.4 75.2 Q97 71.8 97.6 67 L98.2 63 Q101.2 62.2 104 62.8 Z" {...shape} />
    {detail && (
      <>
        <path d="M56.2 64.8 L61.4 64.8 M55.9 67.8 L61.8 67.8 M55.9 70.8 L61.6 70.8" {...fine} opacity={0.45} />
        <path d="M103.8 64.8 L98.6 64.8 M104.1 67.8 L98.2 67.8 M104.1 70.8 L98.4 70.8" {...fine} opacity={0.45} />
      </>
    )}
  </>
);

const ListPose: React.FC<{ detail: boolean; id: string }> = ({ detail, id }) => (
  <>
    {/* Both arms bent inward to a low grip. */}
    <path d="M61.5 96 Q53 101 50.5 116.5 Q49.4 126 54 130.4 Q59 134 61.8 127 L67.4 106 Q67.8 98.6 61.5 96 Z" {...shape} />
    <path d="M53 123.5 Q49.6 128.6 54.4 133 Q58.6 136.6 63.4 132.8 L72.8 126.4 Q76.4 123 72.6 119.2 Q68.8 116 65 119.6 Z" {...shape} />
    <path d="M98.5 96 Q107 101 109.5 116.5 Q110.6 126 106 130.4 Q101 134 98.2 127 L92.6 106 Q92.2 98.6 98.5 96 Z" {...shape} />
    <path d="M107 123.5 Q110.4 128.6 105.6 133 Q101.4 136.6 96.6 132.8 L87.2 126.4 Q83.6 123 87.4 119.2 Q91.2 116 95 119.6 Z" {...shape} />
    {detail && (
      <>
        <path d="M51.6 126 Q56.4 124.4 60 130" {...fine} opacity={0.5} />
        <path d="M108.4 126 Q103.6 124.4 100 130" {...fine} opacity={0.5} />
        <path d="M64 122 Q67 120.4 69.6 122.8" {...fine} opacity={0.5} />
        <path d="M96 122 Q93 120.4 90.4 122.8" {...fine} opacity={0.5} />
      </>
    )}

    {/* The same phone unit, portrait, held low: a short checklist. */}
    <g transform="translate(80 128)">
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

    {/* Gloved hands wrapping the phone's sides. */}
    <path d="M66.5 122.5 Q62.8 123.5 62.6 127.8 Q62.6 133 67.4 133.8 L70.8 134 Q72.8 130.8 72.2 126.6 L71.6 122.8 Q69 121.8 66.5 122.5 Z" {...shape} />
    <path d="M93.5 122.5 Q97.2 123.5 97.4 127.8 Q97.4 133 92.6 133.8 L89.2 134 Q87.2 130.8 87.8 126.6 L88.4 122.8 Q91 121.8 93.5 122.5 Z" {...shape} />
    {detail && (
      <>
        <path d="M66.6 124.6 L71.4 124.6 M66.4 127.6 L71.6 127.6" {...fine} opacity={0.45} />
        <path d="M93.4 124.6 L88.6 124.6 M93.6 127.6 L88.4 127.6" {...fine} opacity={0.45} />
      </>
    )}
  </>
);

export const OperatorV2: React.FC<OperatorProps> = ({
  pose = "speak",
  opacity = 1,
  screen,
  id = "op2",
  detail = true,
}) => {
  if (opacity <= 0) return null;

  return (
    <g opacity={opacity}>
      {/* Legs: tapered trouser legs meeting at the crotch. */}
      <path d="M54 174 C52.8 194 52.2 222 53.2 249.5 L71.5 249.5 C72.8 226 75 202 79 185 L80 174 Z" {...shape} />
      <path d="M106 174 C107.2 194 107.8 222 106.8 249.5 L88.5 249.5 C87.2 226 85 202 81 185 L80 174 Z" {...shape} />
      <path d="M80 177 C79.4 180.6 79 183.4 78.8 185.8" {...fine} opacity={0.4} />
      {detail && (
        <>
          {/* Creases, knee-panel stitching, hem stitch. */}
          <path d="M63 190 C62 208 61.6 230 61.8 248" {...fine} opacity={0.28} />
          <path d="M97 190 C98 208 98.4 230 98.2 248" {...fine} opacity={0.28} />
          <path d="M55.2 208 q8 2.6 15 0.6" {...stitch} opacity={0.4} />
          <path d="M55.8 223 q7.4 2.4 13.8 0.6" {...stitch} opacity={0.4} />
          <path d="M104.8 208 q-8 2.6 -15 0.6" {...stitch} opacity={0.4} />
          <path d="M104.2 223 q-7.4 2.4 -13.8 0.6" {...stitch} opacity={0.4} />
          <line x1={53.4} y1={244.5} x2={71.6} y2={244.5} {...fine} opacity={0.4} />
          <line x1={106.6} y1={244.5} x2={88.4} y2={244.5} {...fine} opacity={0.4} />
        </>
      )}
      {/* Hi-vis band across each shin. */}
      <path d="M54.6 233 L72.4 232.4 M54.9 239 L72.2 238.4" {...fine} opacity={0.55} />
      <path d="M105.4 233 L87.6 232.4 M105.1 239 L87.8 238.4" {...fine} opacity={0.55} />
      {detail && (
        <>
          <path d="M59 238.7 L61.4 232.8 M64 238.5 L66.4 232.6 M69 238.4 L71 232.5" {...fine} opacity={0.4} />
          <path d="M101 238.7 L98.6 232.8 M96 238.5 L93.6 232.6 M91 238.4 L89 232.5" {...fine} opacity={0.4} />
        </>
      )}

      {/* Boots: upper, toe cap, laces, separate sole with heel. */}
      <path d="M52.9 249.5 L52 259 Q51.7 263 55.4 263 L69.4 263 Q72.6 263 72.4 259.6 L71.8 249.5 Z" {...shape} />
      <path d="M107.1 249.5 L108 259 Q108.3 263 104.6 263 L90.6 263 Q87.4 263 87.6 259.6 L88.2 249.5 Z" {...shape} />
      <path d="M50.8 263 L74 263 Q75.6 263 75.6 265.4 Q75.6 267.6 73.4 267.6 L53 267.6 Q50.8 267.6 50.8 265.4 Z" {...shape} />
      <path d="M109.2 263 L86 263 Q84.4 263 84.4 265.4 Q84.4 267.6 86.6 267.6 L107 267.6 Q109.2 267.6 109.2 265.4 Z" {...shape} />
      {detail && (
        <>
          <path d="M64 250.5 Q69.6 253.4 71.6 258.6" {...fine} opacity={0.5} />
          <path d="M96 250.5 Q90.4 253.4 88.4 258.6" {...fine} opacity={0.5} />
          <path d="M57.5 253 L63.5 252.6 M57.8 256 L63.8 255.6" {...fine} opacity={0.45} />
          <path d="M102.5 253 L96.5 252.6 M102.2 256 L96.2 255.6" {...fine} opacity={0.45} />
          <line x1={67.5} y1={263.6} x2={67.5} y2={267} {...fine} opacity={0.35} />
          <line x1={92.5} y1={263.6} x2={92.5} y2={267} {...fine} opacity={0.35} />
        </>
      )}

      {/* Torso: overalls over a shirt. */}
      <path d="M53.4 174 C52 158 52 140 53.2 126 C53.6 104 58.5 88 80 88 C101.5 88 106.4 104 106.8 126 C108 140 108 158 106.6 174 Z" {...shape} />
      {detail && (
        <>
          <path d="M58.6 103 q2.6 8 1.8 15" {...fine} opacity={0.3} />
          <path d="M101.4 103 q-2.6 8 -1.8 15" {...fine} opacity={0.3} />
        </>
      )}
      {/* Straps with buckles onto the bib. */}
      <path d="M66.4 89.4 C65.7 97 65.4 105 65.7 111.5 L69.6 111.5 C69.3 105 69.5 97 70.2 90.2 Z" {...shape} />
      <path d="M93.6 89.4 C94.3 97 94.6 105 94.3 111.5 L90.4 111.5 C90.7 105 90.5 97 89.8 90.2 Z" {...shape} />
      <rect x={64.6} y={109.4} width={6.2} height={4.6} rx={0.8} {...line} />
      <rect x={89.2} y={109.4} width={6.2} height={4.6} rx={0.8} {...line} />
      {/* Bib with stitching, pocket, pen. */}
      <path d="M65.7 112 L94.3 112 L94.3 140 Q94.3 142.4 91.9 142.4 L68.1 142.4 Q65.7 142.4 65.7 140 Z" {...shape} />
      {detail && <path d="M68 114.6 L92 114.6" {...stitch} opacity={0.4} />}
      <circle cx={68.5} cy={117.6} r={1.3} fill={HUMAN} stroke="none" />
      <circle cx={91.5} cy={117.6} r={1.3} fill={HUMAN} stroke="none" />
      <path d="M71.5 120 H88.5 V131.6 Q88.5 133.4 86.7 133.4 H73.3 Q71.5 133.4 71.5 131.6 Z" {...line} />
      <path d="M76.4 116.4 L76.4 123.4" {...line} strokeWidth={2} />
      {detail && <path d="M77.9 117.2 L77.9 121" {...fine} opacity={0.6} />}
      {/* Waist seams, hip pockets, hammer loop. */}
      <path d="M53 156.5 Q80 160.5 107 156.5" {...line} opacity={0.5} />
      {detail && <path d="M53.2 160.5 Q80 164.2 106.8 160.5" {...stitch} opacity={0.35} />}
      <path d="M53.6 146 Q60 144.4 63.4 150.6" {...line} opacity={0.6} />
      <path d="M106.4 146 Q100 144.4 96.6 150.6" {...line} opacity={0.6} />
      {detail && <path d="M98.8 162 q5 2.6 0.6 7" {...fine} opacity={0.6} />}

      <FaceAndHat detail={detail} />

      {pose === "speak" && <SpeakPose detail={detail} id={id} screen={screen} />}
      {pose === "photo" && <PhotoPose detail={detail} id={id} />}
      {pose === "list" && <ListPose detail={detail} id={id} />}
    </g>
  );
};

export default OperatorV2;
