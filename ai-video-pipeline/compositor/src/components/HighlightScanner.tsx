/**
 * HighlightScanner — animated highlight capsule that scans through a list.
 *
 * Renders a yellow/cream translucent capsule that smoothly moves between
 * specified Y-positions to highlight different items in a screen recording.
 * Uses spring() for buttery smooth transitions.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { HighlightRegion } from "../types/schema";

interface HighlightScannerProps {
  highlights: HighlightRegion[];
  segmentStartFrame: number;
}

export const HighlightScanner: React.FC<HighlightScannerProps> = ({
  highlights,
  segmentStartFrame,
}) => {
  const absoluteFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!highlights || highlights.length === 0) return null;

  // Find the currently active highlight
  const currentFrame = absoluteFrame + segmentStartFrame;
  const activeIndex = highlights.findIndex(
    (h) => currentFrame >= h.startFrame && currentFrame < h.endFrame
  );

  if (activeIndex === -1) return null;

  const active = highlights[activeIndex];
  const localFrame = currentFrame - active.startFrame;

  // Spring animation for position
  const springVal = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.6 },
  });

  // Pulse glow effect
  const pulsePhase = Math.sin((localFrame / fps) * Math.PI * 2) * 0.5 + 0.5;
  const glowIntensity = interpolate(pulsePhase, [0, 1], [0.15, 0.35]);

  // Fade in
  const opacity = interpolate(localFrame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Scale pop
  const scaleX = interpolate(springVal, [0, 1], [0.8, 1]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: active.y,
          left: "5%",
          width: "90%",
          height: active.height,
          borderRadius: active.height / 2,
          backgroundColor: `rgba(255, 215, 0, ${glowIntensity})`,
          border: "2px solid rgba(255, 215, 0, 0.5)",
          boxShadow: `0 0 24px rgba(255, 215, 0, ${glowIntensity * 0.8}), inset 0 0 12px rgba(255, 215, 0, ${glowIntensity * 0.3})`,
          opacity,
          transform: `scaleX(${scaleX})`,
          transition: "top 0.3s ease",
        }}
      />
    </AbsoluteFill>
  );
};
