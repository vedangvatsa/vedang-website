/**
 * FullScreenAvatar — renders the AI avatar video full-screen.
 * Falls back to a gradient placeholder when no video is provided.
 */

import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  interpolate,
} from "remotion";

interface FullScreenAvatarProps {
  video?: string;
  startFrom?: number;
}

export const FullScreenAvatar: React.FC<FullScreenAvatarProps> = ({
  video,
  startFrom = 0,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Subtle breathing animation for placeholder
  const breathe = interpolate(frame, [0, 60, 120], [1, 1.02, 1], {
    extrapolateRight: "extend",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <div style={{ position: "absolute", inset: 0, opacity }}>
        {video ? (
          <OffthreadVideo
            src={video}
            startFrom={startFrom}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1a0533 0%, #0d1b2a 40%, #1b2838 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${breathe})`,
            }}
          >
            {/* Avatar silhouette */}
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                marginBottom: 30,
                boxShadow: "0 0 60px rgba(124,58,237,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
              }}
            >
              🎙️
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 28,
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              AI Avatar
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
