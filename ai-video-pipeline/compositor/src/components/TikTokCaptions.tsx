/**
 * TikTokCaptions — word-by-word animated captions overlay.
 *
 * Uses @remotion/captions createTikTokStyleCaptions() to segment words into
 * pages, then renders each page as a centered pill with the current word
 * highlighted.
 *
 * Design: white bold text on a semi-transparent black pill, centered
 * horizontally near the bottom third of the screen.
 */

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { CaptionWord } from "../types/schema";

interface TikTokCaptionsProps {
  /** Array of word-level caption data */
  words: CaptionWord[];
  /** Combine tokens within this many milliseconds (lower = more word-by-word) */
  combineMs?: number;
}

export const TikTokCaptions: React.FC<TikTokCaptionsProps> = ({
  words,
  combineMs = 400,
}) => {
  const { fps } = useVideoConfig();

  // Convert our word format to @remotion/captions Caption format
  const captions = words.map((w) => ({
    text: ` ${w.word}`,
    startMs: w.start * 1000,
    endMs: w.end * 1000,
    timestampMs: w.start * 1000,
    confidence: 1,
  }));

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: combineMs,
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 160,
        zIndex: 100,
      }}
    >
      {pages.map((page, i) => {
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const durationFrames = Math.max(
          1,
          Math.round(((page.startMs + page.durationMs) / 1000) * fps) - startFrame
        );

        return (
          <Sequence
            key={i}
            from={startFrame}
            durationInFrames={durationFrames}
            layout="none"
          >
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Renders a single caption page — shows all words, highlights the current one.
 */
interface CaptionPageProps {
  page: {
    text: string;
    startMs: number;
    durationMs: number;
    tokens: Array<{
      text: string;
      fromMs: number;
      toMs: number;
    }>;
  };
}

const CaptionPage: React.FC<CaptionPageProps> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate the absolute time for the current frame within this page
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  // Pop-in animation
  const scale = interpolate(frame, [0, 4], [0.85, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        maxWidth: 640,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {page.tokens.map((token, j) => {
        const isActive =
          currentTimeMs >= token.fromMs && currentTimeMs < token.toMs;

        return (
          <span
            key={j}
            style={{
              fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
              fontSize: 36,
              fontWeight: 800,
              lineHeight: 1.3,
              color: isActive ? "#FFD700" : "#FFFFFF",
              backgroundColor: isActive
                ? "rgba(0, 0, 0, 0.95)"
                : "rgba(0, 0, 0, 0.75)",
              padding: "6px 14px",
              borderRadius: 10,
              textShadow: isActive
                ? "0 0 20px rgba(255, 215, 0, 0.4)"
                : "0 2px 4px rgba(0, 0, 0, 0.8)",
              transition: "all 0.1s ease",
              whiteSpace: "pre",
              transform: isActive ? "scale(1.08)" : "scale(1)",
            }}
          >
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
