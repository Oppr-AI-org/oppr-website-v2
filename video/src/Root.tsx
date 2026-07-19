import React from "react";
import { Composition } from "remotion";
import { FPS } from "./brand";
import { CaptureSpeak } from "./films/CaptureSpeak";
import { CaptureSpeakV2 } from "./films/CaptureSpeakV2";
import { CaptureSpeakV3 } from "./films/CaptureSpeakV3";
import { CapturePhoto } from "./films/CapturePhoto";
import { CapturePhotoV2 } from "./films/CapturePhotoV2";
import { CapturePhotoV3 } from "./films/CapturePhotoV3";
import { CaptureCheck } from "./films/CaptureCheck";
import { CaptureCheckV2 } from "./films/CaptureCheckV2";
import { CaptureV4 } from "./films/CaptureV4";
import { ConnectTimeline } from "./films/ConnectTimeline";
import { ConnectTimelineV2 } from "./films/ConnectTimelineV2";
import { ConnectTimelineV3 } from "./films/ConnectTimelineV3";
import { ConnectTimelineV4 } from "./films/ConnectTimelineV4";
import { ExecuteLoop } from "./films/ExecuteLoop";
import { ExecuteLoopV2 } from "./films/ExecuteLoopV2";
import { ExecuteLoopV4 } from "./films/ExecuteLoopV4";
import { OperatorPreview } from "./films/OperatorPreview";

/*
 * Landing-page films. Capture trio: 1080×960 / 300f (10s).
 * Connect: 1920×840 / 420f (14s). Execute: 1920×680 / 420f (14s).
 * See SCRIPTS.md for the full shot list per composition.
 *
 * The *-v3-bb compositions are "blackbox" re-cuts (IMPLEMENTATION.md §5): same
 * openings as v2 but the extraction/correlation beats are removed so the films
 * end on the payoff (CAPTURED / VERIFIED RESULT), not the mechanism. The v2
 * compositions are kept intact for reverting. scripts/publish-films.mjs renders
 * the v3-bb ids to the site's un-suffixed public/films names.
 */
export const Root: React.FC = () => (
  <>
    <Composition id="capture-speak" component={CaptureSpeak} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-speak-v2" component={CaptureSpeakV2} durationInFrames={330} fps={FPS} width={1080} height={960} />
    <Composition id="capture-speak-v3-bb" component={CaptureSpeakV3} durationInFrames={330} fps={FPS} width={1080} height={960} />
    <Composition id="capture-photo" component={CapturePhoto} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-photo-v2" component={CapturePhotoV2} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-photo-v3-bb" component={CapturePhotoV3} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-check" component={CaptureCheck} durationInFrames={360} fps={FPS} width={1080} height={960} />
    <Composition id="capture-check-v2" component={CaptureCheckV2} durationInFrames={300} fps={FPS} width={1080} height={960} />
    {/* v4: the three square capture films combined into one widescreen film */}
    <Composition id="capture-v4" component={CaptureV4} durationInFrames={540} fps={FPS} width={1920} height={840} />
    <Composition id="connect-timeline" component={ConnectTimeline} durationInFrames={420} fps={FPS} width={1920} height={840} />
    <Composition id="connect-timeline-v2" component={ConnectTimelineV2} durationInFrames={420} fps={FPS} width={1920} height={840} />
    <Composition id="connect-timeline-v3-bb" component={ConnectTimelineV3} durationInFrames={420} fps={FPS} width={1920} height={840} />
    {/* v4: chips-arrive opening, history pull-back, verified-result payoff */}
    <Composition id="connect-timeline-v4" component={ConnectTimelineV4} durationInFrames={420} fps={FPS} width={1920} height={840} />
    <Composition id="execute-loop" component={ExecuteLoop} durationInFrames={420} fps={FPS} width={1920} height={680} />
    <Composition id="execute-loop-v2" component={ExecuteLoopV2} durationInFrames={420} fps={FPS} width={1920} height={680} />
    {/* v4: unified 840-tall frame, verified-token opening, literal loop-back;
        held ~1.4s longer at the end to showcase the closing checks */}
    <Composition id="execute-loop-v4" component={ExecuteLoopV4} durationInFrames={462} fps={FPS} width={1920} height={840} />
    {/* design harness — not a shipped film. V1 (left) vs V2 (right). */}
    <Composition id="operator" component={OperatorPreview} durationInFrames={30} fps={FPS} width={2280} height={680} />
  </>
);
