/**
 * SplitScreen — dual-panel layout with placeholders when videos are missing.
 */
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { VIDEO_WIDTH, VIDEO_HEIGHT } from "../types/schema";

interface SplitScreenProps {
  topVideo?: string;
  bottomVideo?: string;
  splitRatio?: number;
  gap?: number;
  borderRadius?: number;
  startFrom?: number;
}

const Placeholder: React.FC<{ label: string; gradient: string }> = ({
  label,
  gradient,
}) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: 24,
        fontFamily: "Inter, system-ui, sans-serif",
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  </div>
);

export const SplitScreen: React.FC<SplitScreenProps> = ({
  topVideo,
  bottomVideo,
  splitRatio = 0.55,
  gap = 16,
  borderRadius = 20,
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const padding = 16;
  const innerWidth = VIDEO_WIDTH - padding * 2;
  const usableHeight = VIDEO_HEIGHT - padding * 2 - gap;
  const topHeight = usableHeight * splitRatio;
  const bottomHeight = usableHeight * (1 - splitRatio);

  const slideIn = spring({ frame, fps, config: { damping: 18, stiffness: 120, mass: 0.8 } });
  const topTranslate = interpolate(slideIn, [0, 1], [-40, 0]);
  const bottomTranslate = interpolate(slideIn, [0, 1], [40, 0]);
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div
        style={{
          position: "absolute",
          top: padding, left: padding,
          width: innerWidth, height: topHeight,
          borderRadius, overflow: "hidden",
          transform: `translateY(${topTranslate}px)`,
          opacity,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {topVideo ? (
          <OffthreadVideo src={topVideo} startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Placeholder label="📹 Source Clip" gradient="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" />
        )}
      </div>

      <div
        style={{
          position: "absolute",
          top: padding + topHeight + gap, left: padding,
          width: innerWidth, height: bottomHeight,
          borderRadius, overflow: "hidden",
          transform: `translateY(${bottomTranslate}px)`,
          opacity,
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {bottomVideo ? (
          <OffthreadVideo src={bottomVideo} startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Placeholder label="🎙️ AI Avatar" gradient="linear-gradient(135deg, #1a0533 0%, #2d1b69 100%)" />
        )}
      </div>
    </AbsoluteFill>
  );
};
