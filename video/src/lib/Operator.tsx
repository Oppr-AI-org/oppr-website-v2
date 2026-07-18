/*
 * Reusable operator figure for the films (line-art, Oppr brand).
 *
 * One figure, three poses (shared body, hat and overalls everywhere):
 *   "speak" — phone at the face, bent elbow, screen toward camera
 *   "photo" — landscape phone raised in both hands (taking a picture)
 *   "list"  — portrait phone held low in both hands (working a checklist)
 *
 * Local coordinate box: 0..160 wide, 0..300 tall, feet on y≈296,
 * body centered on x=80. Place with:
 *   <g transform={`translate(${x} ${y}) scale(${s})`}><Operator .../></g>
 *
 * The speak phone's screen rect is exported (PHONE_SCREEN, in the phone
 * group's local coordinates) so films can animate content on the screen —
 * pass `screen` to replace the default waveform. Give each mounted figure a
 * distinct `id` (clipPath uniqueness). Set `detail={false}` when drawn small.
 */
import React from "react";
import { GROUND, HUMAN, INK, MACHINE } from "../brand";

export type OperatorPose = "speak" | "photo" | "list";

export const OPERATOR_BOX = { w: 160, h: 300 } as const;

/** Screen rect inside the speak phone's local coordinate system. */
export const PHONE_SCREEN = { x: -7.5, y: -14.5, w: 15, h: 26 } as const;

/** Screen rect inside the list phone's local coordinate system. */
export const LIST_PHONE_SCREEN = { x: -10, y: -18, w: 20, h: 34 } as const;

/** Body-space bounds of the landscape photo phone. */
export const PHOTO_PHONE = { x: 53, y: 55, w: 54, h: 28 } as const;

const nss = { vectorEffect: "non-scaling-stroke" } as const;
const line = {
  fill: "none",
  stroke: HUMAN,
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  ...nss,
} as const;
const shape = { ...line, fill: GROUND } as const;

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

const FaceAndHat: React.FC<{ detail: boolean }> = ({ detail }) => (
  <>
    {/* Shortened neck and collar. */}
    <path d="M75 77 L75 88 L85 88 L85 77 Z" {...shape} />
    <path d="M74 88 L80 93 L86 88" {...line} />

    <path d="M64 48 C64 66 70 77 80 77 C90 77 96 66 96 48 Z" {...shape} />
    <path d="M64 54 q-4 3 -1 8" {...line} />
    <path d="M96 54 q4 3 1 8" {...line} />

    {/* Minimal face: eyes, nose, and an open talking mouth. */}
    <circle cx={74} cy={59.5} r={1.35} fill={HUMAN} stroke="none" />
    <circle cx={86} cy={59.5} r={1.35} fill={HUMAN} stroke="none" />
    <path d="M80 61.5 L78.8 65.5 L81.2 65.5" {...line} />
    <ellipse cx={80} cy={70.5} rx={2.7} ry={2.2} fill={HUMAN} stroke="none" />

    <path d="M61 50 C61 30 69 22 80 22 C91 22 99 30 99 50 Z" {...shape} />
    <path d="M58 51 Q80 45 102 51 Q80 57 58 51 Z" {...shape} />
    <path d="M73 25 Q80 21 87 25" {...line} />
    {detail && (
      <>
        <line x1={72} y1={29} x2={71} y2={42} {...line} opacity={0.4} />
        <line x1={88} y1={29} x2={89} y2={42} {...line} opacity={0.4} />
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
    {/* Relaxed viewer-left arm. */}
    <path
      d="M57 97 C47 104 43 124 46 146 C47 156 50 162 54 162 C58 162 60 157 59 149 C56 132 55 114 60 100 Q59 95 57 97 Z"
      {...shape}
    />
    {detail && <line x1={46.5} y1={147} x2={58.8} y2={146} {...line} opacity={0.45} />}

    {/* Upper arm and forearm are separate so the elbow reads clearly. */}
    <path
      d="M97 97 C103 98 106 107 106 119 C106 126 106 132 104 138 Q101 144 96 140 L91 133 C95 122 94 109 95 101 Q95 98 97 97 Z"
      {...shape}
    />
    <path
      d="M96 130 C86 119 70 103 58 90 Q53 86 49.5 91 Q47 96 53 100 C66 110 82 127 96 140 Q101 144 104 139 Q107 135 101 130 Z"
      {...shape}
    />
    {detail && <path d="M93.5 132 Q99 131 103 136" {...line} opacity={0.55} />}

    <g transform="translate(49 74) rotate(-15)">
      <rect x={-10} y={-18} width={20} height={36} rx={4.5} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
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
      <circle cx={0} cy={-16.2} r={0.8} fill={INK} opacity={0.5} stroke="none" />
      <clipPath id={`${id}-phone-screen`}>
        <rect x={PHONE_SCREEN.x} y={PHONE_SCREEN.y} width={PHONE_SCREEN.w} height={PHONE_SCREEN.h} rx={2} />
      </clipPath>
      <g clipPath={`url(#${id}-phone-screen)`}>
        {screen ?? (
          <>
            <line x1={-4} y1={-3.5} x2={-4} y2={3.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
            <line x1={0} y1={-6.5} x2={0} y2={6.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
            <line x1={4} y1={-4.5} x2={4} y2={4.5} stroke={MACHINE} strokeWidth={1.8} strokeLinecap="round" {...nss} />
          </>
        )}
      </g>
    </g>

    <path
      d="M46 88 Q42.5 92 45 97 Q48 102 54.5 100.5 Q60.5 99 59.5 93 Q58.5 87.5 53 87 Q48.5 86.5 46 88 Z"
      {...shape}
    />
    {detail && <path d="M46 93 Q50.5 96 55.5 94" {...line} opacity={0.5} />}
  </>
);

const PhotoPose: React.FC<{ detail: boolean }> = ({ detail }) => (
  <>
    {/* Viewer-left upper arm and forearm. */}
    <path d="M58 97 Q51 99 45 108 Q41 114 46 118 Q51 121 55 115 L64 103 Q66 98 58 97 Z" {...shape} />
    <path d="M46 108 Q43 112 47 117 Q51 120 55 115 L62 82 Q63 77 58 75 Q53 74 51 80 Z" {...shape} />
    {detail && <path d="M45 111 Q49 108 54 113" {...line} opacity={0.55} />}

    {/* Viewer-right upper arm and forearm. */}
    <path d="M102 97 Q109 99 115 108 Q119 114 114 118 Q109 121 105 115 L96 103 Q94 98 102 97 Z" {...shape} />
    <path d="M114 108 Q117 112 113 117 Q109 120 105 115 L98 82 Q97 77 102 75 Q107 74 109 80 Z" {...shape} />
    {detail && <path d="M115 111 Q111 108 106 113" {...line} opacity={0.55} />}

    {/* Landscape phone. */}
    <g transform="translate(80 69)">
      <rect x={-27} y={-14} width={54} height={28} rx={5} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
      <rect x={-23} y={-10} width={46} height={20} rx={2.5} fill="none" stroke={INK} strokeWidth={1} opacity={0.28} {...nss} />
      <circle cx={19} cy={-6} r={2.2} fill={MACHINE} stroke="none" />
      <path d="M-8 -5 H-13 V0 M8 -5 H13 V0 M-8 5 H-13 V0 M8 5 H13 V0" fill="none" stroke={MACHINE} strokeWidth={1.5} {...nss} />
    </g>
    <path d="M54 73 Q58 69 63 72 L64 79 Q59 83 54 79 Z" {...shape} />
    <path d="M106 73 Q102 69 97 72 L96 79 Q101 83 106 79 Z" {...shape} />
  </>
);

const ListPose: React.FC<{ detail: boolean }> = ({ detail }) => (
  <>
    {/* Viewer-left arm, bent inward. */}
    <path d="M58 98 Q50 104 48 121 Q47 131 52 135 Q57 138 60 131 L66 106 Q66 99 58 98 Z" {...shape} />
    <path d="M52 128 Q49 133 54 137 Q58 140 63 136 L73 128 Q76 124 72 120 Q68 117 64 121 Z" {...shape} />
    {detail && <path d="M50 130 Q55 128 59 134" {...line} opacity={0.55} />}

    {/* Viewer-right arm, bent inward. */}
    <path d="M102 98 Q110 104 112 121 Q113 131 108 135 Q103 138 100 131 L94 106 Q94 99 102 98 Z" {...shape} />
    <path d="M108 128 Q111 133 106 137 Q102 140 97 136 L87 128 Q84 124 88 120 Q92 117 96 121 Z" {...shape} />
    {detail && <path d="M110 130 Q105 128 101 134" {...line} opacity={0.55} />}

    {/* Lower portrait phone and list UI. */}
    <g transform="translate(80 126)">
      <rect x={-13} y={-22} width={26} height={44} rx={5} fill={GROUND} stroke={INK} strokeWidth={1.5} {...nss} />
      <rect
        x={LIST_PHONE_SCREEN.x}
        y={LIST_PHONE_SCREEN.y}
        width={LIST_PHONE_SCREEN.w}
        height={LIST_PHONE_SCREEN.h}
        rx={2}
        fill="none"
        stroke={INK}
        strokeWidth={1}
        opacity={0.28}
        {...nss}
      />
      <g fill="none" stroke={MACHINE} strokeWidth={1.5} {...nss}>
        <path d="M-6 -10 L-4 -8 L-1 -12" />
        <line x1={2} y1={-10} x2={7} y2={-10} />
        <path d="M-6 -2 L-4 0 L-1 -4" />
        <line x1={2} y1={-2} x2={7} y2={-2} />
        <rect x={-6} y={6} width={4} height={4} rx={0.5} />
        <line x1={2} y1={8} x2={7} y2={8} />
      </g>
    </g>
    <path d="M65 126 Q69 122 73 125 L74 135 Q69 138 65 134 Z" {...shape} />
    <path d="M95 126 Q91 122 87 125 L86 135 Q91 138 95 134 Z" {...shape} />
    {detail && <path d="M71 127 L76 131 M89 127 L84 131" {...line} opacity={0.65} />}
  </>
);

export const Operator: React.FC<OperatorProps> = ({
  pose = "speak",
  opacity = 1,
  screen,
  id = "op",
  detail = true,
}) => {
  if (opacity <= 0) return null;

  return (
    <g opacity={opacity}>
      {/* Legs and trousers. */}
      <path d="M56 170 C55 200 54 230 54 252 L73 252 C74 230 77 204 80 182" {...shape} />
      <path d="M104 170 C105 200 106 230 106 252 L87 252 C86 230 83 204 80 182" {...shape} />
      {detail && (
        <>
          <line x1={55} y1={244} x2={72} y2={244} {...line} opacity={0.45} />
          <line x1={88} y1={244} x2={105} y2={244} {...line} opacity={0.45} />
        </>
      )}

      {/* Boots. */}
      <path d="M53 252 L52 262 Q52 267 58 267 L70 267 Q74 267 73.5 262 L73 252 Z" {...shape} />
      <path d="M107 252 L108 262 Q108 267 102 267 L90 267 Q86 267 86.5 262 L87 252 Z" {...shape} />
      {detail && (
        <>
          <line x1={52.5} y1={262} x2={73.5} y2={262} {...line} opacity={0.45} />
          <line x1={86.5} y1={262} x2={107.5} y2={262} {...line} opacity={0.45} />
        </>
      )}

      {/* Torso and overalls. */}
      <path d="M54 178 C53 162 53 142 54 128 C54 102 60 90 80 90 C100 90 106 102 106 128 C107 142 107 162 106 178 Z" {...shape} />
      <line x1={68} y1={91} x2={68} y2={114} {...line} />
      <line x1={92} y1={91} x2={92} y2={114} {...line} />
      <path d="M68 114 H92 V136 H68 Z" {...line} />
      <circle cx={68} cy={117} r={1.4} fill={HUMAN} stroke="none" />
      <circle cx={92} cy={117} r={1.4} fill={HUMAN} stroke="none" />
      {detail && (
        <>
          <rect x={72} y={121} width={12} height={11} rx={2} {...line} opacity={0.7} />
          <line x1={81} y1={117.5} x2={81} y2={121} {...line} opacity={0.7} />
        </>
      )}
      <line x1={54} y1={150} x2={106} y2={150} {...line} opacity={0.55} />
      <line x1={54} y1={155} x2={106} y2={155} {...line} opacity={0.55} />
      {detail && (
        <>
          <path d="M56 162 L63 171" {...line} opacity={0.45} />
          <path d="M104 162 L97 171" {...line} opacity={0.45} />
        </>
      )}

      <FaceAndHat detail={detail} />

      {pose === "speak" && <SpeakPose detail={detail} id={id} screen={screen} />}
      {pose === "photo" && <PhotoPose detail={detail} />}
      {pose === "list" && <ListPose detail={detail} />}
    </g>
  );
};

export default Operator;
