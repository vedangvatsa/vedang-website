/**
 * ScreenshotDisplay — full-screen screenshot with Ken Burns zoom + placeholder.
 */
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface ScreenshotDisplayProps {
  image?: string;
  zoomStart?: number;
  zoomEnd?: number;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({
  image,
  zoomStart = 1.0,
  zoomEnd = 1.15,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const zoom = interpolate(frame, [0, durationInFrames], [zoomStart, zoomEnd], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      <div style={{ position: "absolute", inset: 0, opacity }}>
        {image ? (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${zoom})` }}>
            <Img src={image} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #0c1821 0%, #1b2838 30%, #0f172a 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${zoom})`,
              padding: 40,
            }}
          >
            {/* Fake tweet card */}
            <div
              style={{
                width: "85%",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                padding: 30,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }} />
                <div>
                  <div style={{ color: "white", fontSize: 18, fontWeight: 700, fontFamily: "Inter, system-ui" }}>@TechNews</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Inter, system-ui" }}>Source Post</div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 20, lineHeight: 1.5, fontFamily: "Inter, system-ui" }}>
                Breaking: Major tech announcement just dropped. This changes everything we know about AI and its future direction...
              </div>
              <div style={{ marginTop: 20, padding: "8px 16px", background: "rgba(250,204,21,0.2)", borderRadius: 8, display: "inline-block" }}>
                <span style={{ color: "#facc15", fontSize: 16, fontWeight: 600, fontFamily: "Inter, system-ui" }}>🔥 Trending</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
