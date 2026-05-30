/**
 * Root — Remotion entry point.
 * Registers the NewsReel composition with dynamic metadata from props.
 */
import React from "react";
import { Composition, staticFile } from "remotion";
import { NewsReel } from "./NewsReel";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "./types/schema";
import type { NewsReelProps } from "./types/schema";

const defaultProps: NewsReelProps = {
  fps: VIDEO_FPS,
  durationInFrames: 300,
  audioFile: staticFile("narration.wav"),
  captions: [
    { word: "Something", start: 0.0, end: 0.35 },
    { word: "unexpected", start: 0.38, end: 0.82 },
    { word: "just", start: 0.85, end: 1.0 },
    { word: "happened", start: 1.02, end: 1.35 },
  ],
  emphasisPhrases: [],
  segments: [
    { type: "full_screen_avatar", startFrame: 0, endFrame: 300 },
  ],
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NewsReel"
        component={NewsReel}
        durationInFrames={defaultProps.durationInFrames}
        fps={defaultProps.fps}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultProps}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames: props.durationInFrames,
            fps: props.fps,
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
          };
        }}
      />
    </>
  );
};
