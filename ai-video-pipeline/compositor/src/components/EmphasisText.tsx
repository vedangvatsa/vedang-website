/**
 * EmphasisText — large bold text overlay with pop-in animation.
 *
 * Renders prominent text like "Promo Window" or "Check the captions for
 * full details" with white fill, black text-stroke outline, and a cinematic
 * pop-in/scale animation using spring physics.
 *
 * Supports multi-line text via \n in the text string.
 */

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

interface EmphasisTextProps {
  /** Text to display (use \n for line breaks) */
  text: string;
  /** Font size in pixels (default 64) */
  fontSize?: number;
}

export const EmphasisText: React.FC<EmphasisTextProps> = ({
  text,
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lines = text.split("\n");

  // Pop-in spring
  const popIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });

  // Pop-out near end
  const fadeOutStart = durationInFrames - 8;
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Scale animation
  const scale = interpolate(popIn, [0, 1], [0.3, 1]);
  const opacity = popIn * fadeOut;

  // Subtle rotation for dynamism
  const rotate = interpolate(popIn, [0, 1], [-3, 0]);

  // Background blur overlay
  const bgOpacity = interpolate(popIn, [0, 1], [0, 0.4]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 90,
      }}
    >
      {/* Dark scrim behind text for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Text container */}
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "24px 40px",
          position: "relative",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              fontSize,
              fontWeight: 900,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              WebkitTextStroke: "2.5px rgba(0, 0, 0, 0.9)",
              paintOrder: "stroke fill",
              textShadow:
                "0 4px 12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.15)",
              // Stagger each line
              transform: `translateY(${interpolate(
                spring({
                  frame: Math.max(0, frame - i * 3),
                  fps,
                  config: { damping: 14, stiffness: 160, mass: 0.5 },
                }),
                [0, 1],
                [20, 0]
              )}px)`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
