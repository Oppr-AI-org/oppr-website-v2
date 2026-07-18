/*
 * Film 5 — execute-loop (SCRIPTS.md §6)
 * Captured in the field → the platform turns it into an instruction →
 * back to the operator's phone → the loop continues.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { GROUND, HUMAN, INK, MACHINE, MONO, VERIFIED } from "../brand";
import { Film, draw, ease, easeOut, pop, travelFade } from "../lib/anim";

const mono = { fontFamily: MONO } as const;

export const ExecuteLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flash = interpolate(frame, [34, 36, 40], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // dashed arrows grow along their length
  const a1 = ease(frame, 48, 22);
  const a2 = ease(frame, 162, 22);

  // packets ride the arrows, fading in and out at the ends
  const pkt1 = ease(frame, 70, 30);
  const pkt2 = ease(frame, 184, 30);

  // hub settles in; the three pieces converge toward the card (f125–153)
  const hub = easeOut(frame, 90, 22);
  const conv = ease(frame, 125, 28);
  const pieceFade = interpolate(conv, [0.25, 0.85], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ping rings: soft birth, steady rhythm, calming as the loop closes
  const calm = 1 - ease(frame, 316, 24);
  const pingR = (offset: number) => {
    const t = frame - (228 + offset);
    if (t < 0) return { r: 0, o: 0 };
    const p = (t % 26) / 26;
    return {
      r: 13 * (1 + 0.7 * p),
      o: 0.7 * (1 - p) * Math.min(1, p * 5) * calm,
    };
  };
  const p1 = pingR(0);
  const p2 = pingR(13);

  // loop-back path revealed by a right→left wipe (no dash crawl)
  const loopP = ease(frame, 305, 36);

  return (
    <Film viewW={960} viewH={340}>
      <defs>
        <clipPath id="loopwipe">
          <rect x={805 - 672 * loopP} y={252} width={672 * loopP + 12} height={68} />
        </clipPath>
      </defs>

      {/* 1 · captured in the field */}
      <g>
        <rect x={115} y={70} width={80} height={150} rx={12} fill="none" stroke={INK} strokeWidth={2} {...draw(ease(frame, 0, 24))} />
        <g opacity={pop(frame, fps, 10)}>
          <line x1={145} y1={82} x2={165} y2={82} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
          <rect x={133} y={118} width={44} height={32} rx={4} fill="none" stroke={HUMAN} strokeWidth={1.8} />
          <path d="M147 118 l4 -7 h8 l4 7" fill="none" stroke={HUMAN} strokeWidth={1.8} strokeLinejoin="round" />
          <circle cx={155} cy={134} r={8} fill="none" stroke={HUMAN} strokeWidth={1.8} />
        </g>
        {(() => {
          const p = easeOut(frame, 16, 12);
          return (
            <text
              x={155}
              y={260}
              textAnchor="middle"
              fill={HUMAN}
              fontSize={10}
              letterSpacing="0.09em"
              fontWeight={700}
              style={mono}
              opacity={p}
              transform={`translate(0 ${4 * (1 - p)})`}
            >
              CAPTURED IN THE FIELD
            </text>
          );
        })()}
      </g>
      <rect x={117} y={72} width={76} height={146} rx={10} fill={GROUND} opacity={flash} />

      {/* arrow 1 grows toward the hub */}
      {a1 > 0 && (
        <line x1={215} y1={145} x2={215 + 126 * a1} y2={145} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a1 * 5)} />
      )}
      <path d="M338 140 L347 145 L338 150" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 66, 8)} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={222 + 123 * pkt1} cy={145} r={4.5} fill={HUMAN} opacity={travelFade(pkt1)} />

      {/* 2 · the platform hub settles in */}
      <g opacity={0.55 * hub} transform={`scale(${0.94 + 0.06 * hub})`} style={{ transformOrigin: "480px 145px" }}>
        <circle cx={480} cy={145} r={72} fill="none" stroke={INK} strokeWidth={1.3} strokeDasharray="6 6" />
      </g>
      {/* three pieces pop in, then converge toward the card */}
      <g opacity={pop(frame, fps, 100) * pieceFade} transform={`translate(${20 * conv} ${44 * conv})`}>
        <rect x={428} y={96} width={26} height={26} rx={6} fill="none" stroke={HUMAN} strokeWidth={1.5} />
        <path d="M434 110 l4 4 l8 -9" fill="none" stroke={HUMAN} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g opacity={pop(frame, fps, 106) * pieceFade} transform={`translate(${-20 * conv} ${44 * conv})`}>
        <rect x={506} y={96} width={26} height={26} rx={6} fill="none" stroke={HUMAN} strokeWidth={1.5} />
        {([[512, 6], [517, 12], [522, 8], [527, 5]] as Array<[number, number]>).map(([x, h]) => (
          <line key={x} x1={x} y1={109 - h / 2} x2={x} y2={109 + h / 2} stroke={HUMAN} strokeWidth={2.5} strokeLinecap="round" />
        ))}
      </g>
      <g opacity={pop(frame, fps, 112) * pieceFade} transform={`translate(${28 * conv} ${-6 * conv})`}>
        <rect x={434} y={170} width={40} height={18} rx={5} fill="none" stroke={MACHINE} strokeWidth={1.5} />
        <line x1={442} y1={179} x2={466} y2={179} stroke={MACHINE} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
      </g>
      {/* instruction card springs in */}
      <g opacity={pop(frame, fps, 132)} transform={`scale(${0.85 + 0.15 * pop(frame, fps, 132)})`} style={{ transformOrigin: "528px 171px" }}>
        <rect x={498} y={150} width={60} height={42} rx={7} fill={GROUND} stroke={INK} strokeWidth={1.5} />
        <line x1={506} y1={161} x2={540} y2={161} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
        <rect x={506} y={169} width={8} height={8} rx={2} fill="none" stroke={HUMAN} strokeWidth={1.3} />
        <line x1={519} y1={173} x2={548} y2={173} stroke={INK} strokeWidth={1.2} opacity={0.35} />
        <rect x={506} y={180} width={8} height={8} rx={2} fill="none" stroke={HUMAN} strokeWidth={1.3} opacity={0.5} />
        <line x1={519} y1={184} x2={542} y2={184} stroke={INK} strokeWidth={1.2} opacity={0.35} />
      </g>
      {(() => {
        const p = easeOut(frame, 140, 12);
        return (
          <text
            x={480}
            y={260}
            textAnchor="middle"
            fill={INK}
            opacity={0.7 * p}
            transform={`translate(0 ${4 * (1 - p)})`}
            fontSize={10}
            letterSpacing="0.09em"
            fontWeight={700}
            style={mono}
          >
            TURNED INTO AN INSTRUCTION
          </text>
        );
      })()}

      {/* arrow 2 grows toward the operator */}
      {a2 > 0 && (
        <line x1={585} y1={145} x2={585 + 126 * a2} y2={145} stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.5 * Math.min(1, a2 * 5)} />
      )}
      <path d="M708 140 L717 145 L708 150" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.5 * easeOut(frame, 180, 8)} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={592 + 123 * pkt2} cy={145} r={4.5} fill={VERIFIED} opacity={travelFade(pkt2)} />

      {/* 3 · back to the operator */}
      <g>
        <rect x={765} y={70} width={80} height={150} rx={12} fill="none" stroke={INK} strokeWidth={2} {...draw(ease(frame, 205, 22))} />
        <line x1={795} y1={82} x2={815} y2={82} stroke={INK} strokeWidth={2.5} strokeLinecap="round" opacity={0.3 * easeOut(frame, 216, 8)} />
        {(() => {
          const p = easeOut(frame, 218, 12);
          return (
            <text
              x={805}
              y={260}
              textAnchor="middle"
              fill={INK}
              opacity={0.7 * p}
              transform={`translate(0 ${4 * (1 - p)})`}
              fontSize={10}
              letterSpacing="0.09em"
              fontWeight={700}
              style={mono}
            >
              BACK TO THE OPERATOR
            </text>
          );
        })()}
      </g>
      {/* notification card slides down as it lands */}
      {(() => {
        const s = pop(frame, fps, 240);
        return (
          <g opacity={s} transform={`translate(0 ${-6 * (1 - s)})`}>
            <rect x={737} y={100} width={146} height={44} rx={8} fill={GROUND} stroke={INK} strokeWidth={1.5} />
            <circle cx={752} cy={122} r={4} fill={HUMAN} />
            <text x={764} y={119} fill={INK} fontSize={10} style={mono}>
              ADJUST TEMP
            </text>
            <text x={764} y={133} fill={INK} fontSize={10} style={mono}>
              Δ −2 °C
            </text>
          </g>
        );
      })()}
      {/* ping rings */}
      {p1.o > 0 && <circle cx={805} cy={88} r={p1.r} fill="none" stroke={HUMAN} strokeWidth={1.8} opacity={p1.o} />}
      {p2.o > 0 && <circle cx={805} cy={88} r={p2.r} fill="none" stroke={HUMAN} strokeWidth={1.4} opacity={p2.o} />}
      {/* green check node */}
      <g opacity={pop(frame, fps, 278)}>
        <circle cx={869} cy={108} r={10} fill={GROUND} stroke={VERIFIED} strokeWidth={1.5} />
        <path d="M864 108 l3.5 3.5 l7 -8" fill="none" stroke={VERIFIED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* loop-back path wiped on R→L */}
      <g clipPath="url(#loopwipe)">
        <path d="M805 296 H162 Q150 296 150 284 V276" fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="4 5" opacity={0.45} />
      </g>
      <path d="M145 282 L150 274 L155 282" fill="none" stroke={INK} strokeWidth={1.2} opacity={0.45 * easeOut(frame, 338, 8)} strokeLinecap="round" strokeLinejoin="round" />
      {(() => {
        const p = easeOut(frame, 322, 14);
        return (
          <text
            x={480}
            y={322}
            textAnchor="middle"
            fill={INK}
            opacity={0.55 * p}
            transform={`translate(0 ${4 * (1 - p)})`}
            fontSize={10}
            letterSpacing="0.1em"
            fontWeight={700}
            style={mono}
          >
            EVERY EXECUTED ACTION CREATES NEW EVIDENCE
          </text>
        );
      })()}
    </Film>
  );
};
