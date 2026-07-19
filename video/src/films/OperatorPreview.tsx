/*
 * Static preview harness for the reusable Operator figure.
 * Not part of the shipped films — used to design/QA the poses.
 * Shows V1 (left) against V2 (right) for a direct comparison.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { GROUND, INK, MONO } from "../brand";
import { Ground } from "../lib/anim";
import { OperatorV2 } from "../lib/OperatorV2";
import { OperatorV3 } from "../lib/OperatorV3";

const POSES = ["speak", "photo", "list"] as const;

const label = {
  fontFamily: MONO,
} as const;

export const OperatorPreview: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: GROUND }}>
    <svg viewBox="0 0 1140 340" width="100%" height="100%" style={{ display: "block" }}>
      <Ground w={1140} h={340} />
      {POSES.map((pose, i) => (
        <g key={`v2-${pose}`}>
          <g transform={`translate(${15 + i * 180} 20) scale(0.92)`}>
            <OperatorV2 pose={pose} id={`op2-${pose}`} />
          </g>
          <text x={89 + i * 180} y={330} textAnchor="middle" fill={INK} opacity={0.4} fontSize={11} letterSpacing="0.12em" fontWeight={700} style={label}>
            V2 · {pose.toUpperCase()}
          </text>
        </g>
      ))}
      <line x1={570} y1={16} x2={570} y2={324} stroke={INK} strokeWidth={1} opacity={0.15} strokeDasharray="3 6" />
      {POSES.map((pose, i) => (
        <g key={`v3-${pose}`}>
          <g transform={`translate(${595 + i * 180} 20) scale(0.92)`}>
            <OperatorV3 pose={pose} id={`op3-${pose}`} />
          </g>
          <text x={669 + i * 180} y={330} textAnchor="middle" fill={INK} opacity={0.7} fontSize={11} letterSpacing="0.12em" fontWeight={700} style={label}>
            V3 · {pose.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
