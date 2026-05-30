/**
 * BRollDisplay — B-roll media display with fade + placeholder.
 */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BRollDisplayProps {
  media?: string;
}

export const BRollDisplay: React.FC<BRollDisplayProps> = ({ media }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const pulse = interpolate(frame % 120, [0, 60, 120], [0.95, 1.05, 0.95]);

  const isVideo = media && (media.endsWith(".mp4") || media.endsWith(".webm") || media.endsWith(".mov"));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <div style={{ position: "absolute", inset: 0, opacity }}>
        {media && isVideo ? (
          <OffthreadVideo src={media} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : media ? (
          <Img src={media} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 40%, #2d1b69 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${pulse})`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 100, marginBottom: 20 }}>💡</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, fontFamily: "Inter, system-ui", fontWeight: 600, letterSpacing: 1 }}>
                B-ROLL
              </div>
            </div>
          </div>
        )}

        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
