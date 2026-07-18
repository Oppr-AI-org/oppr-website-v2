/*
 * Static preview harness for the reusable Operator figure.
 * Not part of the five films — used to design/QA the three poses.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { GROUND, INK, MONO } from "../brand";
import { Ground } from "../lib/anim";
import { Operator } from "../lib/Operator";

const POSES = ["speak", "photo", "list"] as const;

export const OperatorPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: GROUND }}>
    <svg viewBox="0 0 560 340" width="100%" height="100%" style={{ display: "block" }}>
      <Ground w={560} h={340} />
      {POSES.map((pose, i) => (
        <g key={pose}>
          <g transform={`translate(${20 + i * 180} 20) scale(0.95)`}>
            <Operator pose={pose} id={`op-${pose}`} />
          </g>
          <text
            x={100 + i * 180}
            y={330}
            textAnchor="middle"
            fill={INK}
            opacity={0.55}
            fontSize={11}
            letterSpacing="0.12em"
            fontWeight={700}
            style={{ fontFamily: MONO }}
          >
            {pose.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
