import React from "react";
import { Composition } from "remotion";
import { FPS } from "./brand";
import { CaptureSpeak } from "./films/CaptureSpeak";
import { CaptureSpeakV2 } from "./films/CaptureSpeakV2";
import { CapturePhoto } from "./films/CapturePhoto";
import { CapturePhotoV2 } from "./films/CapturePhotoV2";
import { CaptureCheck } from "./films/CaptureCheck";
import { CaptureCheckV2 } from "./films/CaptureCheckV2";
import { ConnectTimeline } from "./films/ConnectTimeline";
import { ConnectTimelineV2 } from "./films/ConnectTimelineV2";
import { ExecuteLoop } from "./films/ExecuteLoop";
import { ExecuteLoopV2 } from "./films/ExecuteLoopV2";
import { OperatorPreview } from "./films/OperatorPreview";

/*
 * Five landing-page films. Capture trio: 1080×960 / 300f (10s).
 * Connect: 1920×840 / 420f (14s). Execute: 1920×680 / 420f (14s).
 * See SCRIPTS.md for the full shot list per composition.
 */
export const Root: React.FC = () => (
  <>
    <Composition id="capture-speak" component={CaptureSpeak} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-speak-v2" component={CaptureSpeakV2} durationInFrames={330} fps={FPS} width={1080} height={960} />
    <Composition id="capture-photo" component={CapturePhoto} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-photo-v2" component={CapturePhotoV2} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-check" component={CaptureCheck} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-check-v2" component={CaptureCheckV2} durationInFrames={300} fps={FPS} width={1080} height={960} />
    <Composition id="connect-timeline" component={ConnectTimeline} durationInFrames={420} fps={FPS} width={1920} height={840} />
    <Composition id="connect-timeline-v2" component={ConnectTimelineV2} durationInFrames={420} fps={FPS} width={1920} height={840} />
    <Composition id="execute-loop" component={ExecuteLoop} durationInFrames={420} fps={FPS} width={1920} height={680} />
    <Composition id="execute-loop-v2" component={ExecuteLoopV2} durationInFrames={420} fps={FPS} width={1920} height={680} />
    {/* design harness — not a shipped film */}
    <Composition id="operator" component={OperatorPreview} durationInFrames={30} fps={FPS} width={1120} height={680} />
  </>
);
