# AI News Reel Compositor

A Remotion-based video compositor for rendering AI avatar news reel videos in 720×1280 (9:16 vertical) format.

## Quick Start

```bash
# Install dependencies
npm install

# Launch Remotion Studio (visual preview)
npm start

# Render with default props
npm run build

# Render with custom props file
npx remotion render NewsReel --props=./path/to/props.json out/video.mp4
```

## Architecture

```
compositor/
├── remotion.config.ts          # Remotion CLI configuration
├── src/
│   ├── index.ts                # Entry point (registerRoot)
│   ├── Root.tsx                # Composition registration
│   ├── NewsReel.tsx            # Main composition — sequences all segments
│   ├── props.json              # Sample props for testing
│   ├── types/
│   │   └── schema.ts           # Zod schemas + TypeScript types
│   └── components/
│       ├── TikTokCaptions.tsx  # Word-by-word animated captions
│       ├── SplitScreen.tsx     # Dual-panel video layout
│       ├── ScreenshotDisplay.tsx # Screenshot with Ken Burns zoom
│       ├── ScreenRecording.tsx # Screen recording + highlight scanner
│       ├── HighlightScanner.tsx # Animated highlight capsule overlay
│       ├── EmphasisText.tsx    # Large bold text overlay
│       ├── BRollDisplay.tsx    # B-roll image/video display
│       ├── FullScreenAvatar.tsx # Full-screen avatar video
│       └── index.ts            # Barrel exports
```

## Video Structure

The compositor renders 7 segment types in sequence:

| # | Segment Type | Description | Duration |
|---|---|---|---|
| 1 | `split_screen` | Dual-panel: source clip + avatar | ~3s |
| 2 | `screenshot` | Tweet/post with Ken Burns zoom | ~2s |
| 3 | `screen_recording` | Product walkthrough with highlight scanner | ~9s |
| 4 | `full_screen_avatar` | Host commentary with emphasis text | ~2s |
| 5 | `split_screen` | Screen + avatar split | ~2s |
| 6 | `broll` | Animated B-roll footage | ~2s |
| 7 | `full_screen_avatar` | Closing CTA with emphasis text | ~3.5s |

## Props Schema

The compositor is driven entirely by a JSON props file. See `src/props.json` for a complete example.

### Top-level Props

| Field | Type | Description |
|---|---|---|
| `fps` | `number` | Frames per second (default: 25) |
| `durationInFrames` | `number` | Total video duration in frames |
| `audioFile` | `string` | Path to narration audio (.wav/.mp3) |
| `captions` | `CaptionWord[]` | Word-by-word caption timing data |
| `emphasisPhrases` | `EmphasisPhrase[]` | Large text overlay timings |
| `segments` | `Segment[]` | Ordered list of video segments |

### Segment Types

**`split_screen`** — Two videos in a vertical split
- `topVideo`, `bottomVideo`: video file paths
- `splitRatio`: top panel height ratio (0-1, default 0.55)

**`screenshot`** — Full-screen image with Ken Burns effect
- `image`: screenshot file path
- `zoomStart`, `zoomEnd`: zoom range (default 1.0 → 1.15)

**`screen_recording`** — Screen recording with optional highlight scanner
- `video`: recording file path
- `highlights`: array of `{ y, height, startFrame, endFrame }`

**`full_screen_avatar`** — Full-screen avatar video
- `video`: avatar video file path

**`broll`** — Full-screen B-roll media
- `media`: image or video file path

## Design System

- **Background**: `#000000` (pure black)
- **Caption pills**: White bold text, black pill background, gold highlight on active word
- **Emphasis text**: White, 900 weight, 2.5px black text-stroke, gold glow
- **Panel corners**: 20px border-radius
- **Animations**: Remotion `spring()` physics
- **Font**: Inter / SF Pro Display

## Rendering

```bash
# Preview in Studio
npm start

# Render to MP4
npx remotion render NewsReel --props=./src/props.json output.mp4

# Render specific frame range (for testing)
npx remotion render NewsReel --props=./src/props.json --frames=0-75 test.mp4

# Render a still frame
npx remotion still NewsReel --props=./src/props.json --frame=50 still.png
```
