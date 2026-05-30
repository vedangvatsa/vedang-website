/**
 * ScreenRecording — screen recording display with highlight scanner + placeholder.
 */
import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame, interpolate } from "remotion";
import { HighlightScanner } from "./HighlightScanner";

interface HighlightRegion {
  y: number;
  height: number;
  startFrame: number;
  endFrame: number;
}

interface ScreenRecordingProps {
  video?: string;
  highlights?: HighlightRegion[];
  segmentStartFrame?: number;
}

export const ScreenRecording: React.FC<ScreenRecordingProps> = ({
  video,
  highlights = [],
  segmentStartFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <div style={{ position: "absolute", inset: 0, opacity }}>
        {video ? (
          <OffthreadVideo src={video} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 12,
            }}
          >
            {/* Fake app UI */}
            <div style={{ color: "white", fontSize: 24, fontWeight: 700, fontFamily: "Inter, system-ui", marginBottom: 20, textAlign: "center" }}>
              📱 Product Features
            </div>
            {["⚡ Unlimited AI conversations", "🎨 Advanced image generation", "📊 Data analysis & charts", "🔒 Enhanced privacy controls", "🌍 Multi-language support"].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "16px 24px",
                  marginLeft: 30,
                  marginRight: 30,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 20,
                  fontFamily: "Inter, system-ui",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Highlight scanner overlay */}
        {highlights.length > 0 && (
          <HighlightScanner highlights={highlights} segmentStartFrame={segmentStartFrame} />
        )}
      </div>
    </AbsoluteFill>
  );
};
