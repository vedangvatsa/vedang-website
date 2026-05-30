/**
 * Type definitions for the AI News Reel compositor.
 *
 * These types define the JSON props schema that drives the entire video render.
 * The pipeline upstream (script generation, TTS, avatar rendering) produces a
 * props.json file matching these types, which Remotion reads at render time.
 */

import { z } from "zod";

// ─── Caption word ───────────────────────────────────────────────────────────
export const CaptionWordSchema = z.object({
  /** The word text */
  word: z.string(),
  /** Start time in seconds */
  start: z.number(),
  /** End time in seconds */
  end: z.number(),
});
export type CaptionWord = z.infer<typeof CaptionWordSchema>;

// ─── Emphasis phrase overlay ────────────────────────────────────────────────
export const EmphasisPhraseSchema = z.object({
  /** Text to display (supports \n for multi-line) */
  text: z.string(),
  /** Frame at which the text appears */
  startFrame: z.number(),
  /** Frame at which the text disappears */
  endFrame: z.number(),
});
export type EmphasisPhrase = z.infer<typeof EmphasisPhraseSchema>;

// ─── Highlight region (for screen recording scanner) ────────────────────────
export const HighlightRegionSchema = z.object({
  /** Y-offset in pixels from top of the screen recording */
  y: z.number(),
  /** Height of the highlight capsule in pixels */
  height: z.number(),
  /** Frame when this highlight activates */
  startFrame: z.number(),
  /** Frame when this highlight deactivates */
  endFrame: z.number(),
});
export type HighlightRegion = z.infer<typeof HighlightRegionSchema>;

// ─── Segment types ──────────────────────────────────────────────────────────

export const SplitScreenSegmentSchema = z.object({
  type: z.literal("split_screen"),
  startFrame: z.number(),
  endFrame: z.number(),
  topVideo: z.string().optional(),
  bottomVideo: z.string().optional(),
  splitRatio: z.number().min(0).max(1).default(0.55),
});
export type SplitScreenSegment = z.infer<typeof SplitScreenSegmentSchema>;

export const ScreenshotSegmentSchema = z.object({
  type: z.literal("screenshot"),
  startFrame: z.number(),
  endFrame: z.number(),
  image: z.string().optional(),
  zoomStart: z.number().default(1.0),
  zoomEnd: z.number().default(1.15),
});
export type ScreenshotSegment = z.infer<typeof ScreenshotSegmentSchema>;

export const ScreenRecordingSegmentSchema = z.object({
  type: z.literal("screen_recording"),
  startFrame: z.number(),
  endFrame: z.number(),
  video: z.string().optional(),
  highlights: z.array(HighlightRegionSchema).optional(),
});
export type ScreenRecordingSegment = z.infer<typeof ScreenRecordingSegmentSchema>;

export const FullScreenAvatarSegmentSchema = z.object({
  type: z.literal("full_screen_avatar"),
  startFrame: z.number(),
  endFrame: z.number(),
  video: z.string().optional(),
});
export type FullScreenAvatarSegment = z.infer<typeof FullScreenAvatarSegmentSchema>;

export const BRollSegmentSchema = z.object({
  type: z.literal("broll"),
  startFrame: z.number(),
  endFrame: z.number(),
  media: z.string().optional(),
});
export type BRollSegment = z.infer<typeof BRollSegmentSchema>;

export const SegmentSchema = z.discriminatedUnion("type", [
  SplitScreenSegmentSchema,
  ScreenshotSegmentSchema,
  ScreenRecordingSegmentSchema,
  FullScreenAvatarSegmentSchema,
  BRollSegmentSchema,
]);
export type Segment = z.infer<typeof SegmentSchema>;

// ─── Root props ─────────────────────────────────────────────────────────────

export const NewsReelPropsSchema = z.object({
  /** Frames per second (default 25) */
  fps: z.number().default(25),
  /** Total duration of the video in frames */
  durationInFrames: z.number(),
  /** Path to the narration audio file */
  audioFile: z.string(),
  /** Word-by-word caption data */
  captions: z.array(CaptionWordSchema),
  /** Large emphasis text overlays */
  emphasisPhrases: z.array(EmphasisPhraseSchema).default([]),
  /** Ordered list of video segments */
  segments: z.array(SegmentSchema),
});
export type NewsReelProps = z.infer<typeof NewsReelPropsSchema>;

// ─── Constants ──────────────────────────────────────────────────────────────

export const VIDEO_WIDTH = 720;
export const VIDEO_HEIGHT = 1280;
export const VIDEO_FPS = 25;
