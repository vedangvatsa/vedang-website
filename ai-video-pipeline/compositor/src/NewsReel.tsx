/**
 * NewsReel — main composition that sequences all segments.
 * 4-layer pipeline: Audio → Segments → Emphasis Text → Captions
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import {
  TikTokCaptions,
  SplitScreen,
  ScreenshotDisplay,
  ScreenRecording,
  FullScreenAvatar,
  BRollDisplay,
  EmphasisText,
} from "./components";
import type { NewsReelProps, Segment } from "./types/schema";

const SegmentRenderer: React.FC<{ segment: Segment }> = ({ segment }) => {
  switch (segment.type) {
    case "split_screen":
      return (
        <SplitScreen
          topVideo={segment.topVideo}
          bottomVideo={segment.bottomVideo}
          splitRatio={segment.splitRatio}
        />
      );
    case "screenshot":
      return (
        <ScreenshotDisplay
          image={segment.image}
          zoomStart={segment.zoomStart}
          zoomEnd={segment.zoomEnd}
        />
      );
    case "screen_recording":
      return (
        <ScreenRecording
          video={segment.video}
          highlights={segment.highlights}
          segmentStartFrame={segment.startFrame}
        />
      );
    case "full_screen_avatar":
      return <FullScreenAvatar video={segment.video} />;
    case "broll":
      return <BRollDisplay media={segment.media} />;
    default:
      return null;
  }
};

export const NewsReel: React.FC<NewsReelProps> = ({
  audioFile,
  captions,
  emphasisPhrases = [],
  segments,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* Layer 1: Audio */}
      {audioFile && (
        <Audio
          src={
            audioFile.startsWith("http") || audioFile.startsWith("/")
              ? audioFile
              : staticFile(audioFile)
          }
        />
      )}

      {/* Layer 2: Segments */}
      {segments.map((segment, i) => {
        const duration = segment.endFrame - segment.startFrame;
        return (
          <Sequence key={`seg-${i}`} from={segment.startFrame} durationInFrames={duration} layout="none">
            <SegmentRenderer segment={segment} />
          </Sequence>
        );
      })}

      {/* Layer 3: Emphasis Text */}
      {emphasisPhrases.map((phrase, i) => {
        const duration = phrase.endFrame - phrase.startFrame;
        return (
          <Sequence key={`emph-${i}`} from={phrase.startFrame} durationInFrames={duration} layout="none">
            <EmphasisText text={phrase.text} />
          </Sequence>
        );
      })}

      {/* Layer 4: Captions */}
      <TikTokCaptions words={captions} />
    </AbsoluteFill>
  );
};
