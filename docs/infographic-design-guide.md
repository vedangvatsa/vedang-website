# Vedang Vatsa — Infographic & Design Guide

## Brand Visual Identity

### Color Palette
- **Primary Background**: Clean white (#ffffff) or light warm gray (#f7f6f3)
- **Text**: Near-black (#37352f) for headings, muted foreground for body text
- **Accent Colors**: Primary brand color, plus curated hues per essay (e.g., hsl(210 90% 40%) for blue, hsl(160 80% 35%) for green)
- **Borders**: Light gray (#e3e3e0) for cards, charts, and separators
- **Highlights**: Red hsl(0 70% 50%) for negative/decline, green hsl(160 80% 35%) for positive/growth, amber hsl(45 80% 50%) for neutral/transition
- **Avoid**: Pure neon colors, garish primary colors, dark/black backgrounds

### Typography
- **Headings**: Bold, clean sans-serif (Inter, SF Pro, or similar)
- **Body**: Regular weight, high contrast against light backgrounds
- **Numbers/Stats**: Extra bold, oversized — numbers are visual anchors
- **Chart labels**: text-xs (12px) for axis labels, text-[10px] for source attribution, text-[11px] for data labels
- **Minimum text size**: Always readable at mobile resolution

### Layout Principles
- **Light mode always** — every infographic and chart uses a light/white background
- **Generous whitespace** — never cramped, let elements breathe
- **Visual hierarchy**: One clear focal point per image
- **Aspect ratio**: 800×400 for essay hero SVGs, 1:1 (1080×1080) for social posts
- **No stock photos** — always custom-generated or data-driven visuals
- **Colored left borders** (3px) to categorize layers in market maps and multi-section charts

## Chart Component Standards

### React Chart Components (MDX inline)
All chart components rendered inside essays follow these rules:
- **File location**: `src/components/mdx/{essay-slug}-charts.tsx`
- **Directive**: Must include `'use client'` at top
- **Container**: `<figure className="not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] dark:border-zinc-800 bg-white dark:bg-zinc-900/20 overflow-hidden">`
- **Title**: `text-lg md:text-xl font-bold tracking-tight` in `#37352f`
- **Subtitle**: `text-xs text-muted-foreground uppercase tracking-widest font-semibold`
- **Source line**: `text-[10px] text-muted-foreground/60` at bottom of chart
- **Bar fills**: Use `opacity: 0.6` or `0.65` for bar chart fills
- **Background tints**: Use color + `'08'` or `'10'` suffix for light tinted backgrounds
- **Registration**: Import in `src/app/[slug]/page.tsx` and add to MDXRemote `components` map

### Chart Types
| Type | Use For | Example |
|------|---------|---------|
| Horizontal bar chart | Growth over time, rankings | AINewsSiteGrowth, ApiTrafficChart |
| Split comparison card | Binary contrasts (true vs false) | MisinfoSpreadChart |
| Timeline with dots | Historical arcs, evolution | GUITimeline |
| Market map with layers | Competitive landscape, stack layers | ZeroUIMarketMap |
| Stat grid (3-4 cols) | Partisan breakdown, category comparison | MediaTrustChart |
| Data table in Callout | Multi-dimension comparison | Simulation cost table |

## Infographic Types (Social Media)

### 1. Data Stat Cards
**Use for**: Single striking statistic with context
**Structure**:
- Large number (60-80pt equivalent) as focal point
- One-line context below
- Source attribution in bottom corner
- Brand watermark (veda.ng) discretely placed
- **Light background** with subtle accent color

### 2. Comparison/Contrast Cards
**Use for**: Before/after, old vs new, expectation vs reality
**Structure**:
- Split layout (left vs right or top vs bottom)
- Contrasting accent colors for each side
- Clear labels
- Optional connecting element (arrow, vs symbol)
- **Light background** with colored borders

### 3. List/Framework Cards
**Use for**: Top 5 reasons, 3-step frameworks, key findings
**Structure**:
- Numbered or bulleted list
- Each item has a short title + one-line explanation
- Consistent formatting across items
- Header establishing the topic

### 4. Quote/Insight Cards
**Use for**: Key observations, essay highlights, provocative claims
**Structure**:
- Large quotation or insight text
- Attribution or source
- Optional subtle background graphic
- Brand watermark

### 5. Process/Flow Diagrams
**Use for**: How something works, timeline of events, causal chains
**Structure**:
- Linear flow (left-to-right or top-to-bottom)
- Connected nodes with labels
- Arrows or lines showing progression
- Clear start and end points

## Content + Image Pairing Rules

### For Social Posts (LinkedIn, X, Bluesky, Facebook, Tumblr)

1. **Every post should have a unique image** — never reuse the same image across topics
2. **Image must reinforce the post's core message** — not just be decorative
3. **Text on image should NOT duplicate the post caption** — it should complement it
4. **Image should be self-contained** — understandable without reading the post
5. **Include veda.ng watermark** when promoting a specific tool

### For Essay Promotions

When promoting an essay via short-form post:
- **Hook**: One provocative line from the essay (not the title)
- **Image**: A data visualization or key framework from the essay
- **CTA**: "Full essay: veda.ng/essays/{slug}"
- **Never quote more than 2 sentences** from the essay

### For Tool Promotions (LIT, Swarm Prediction, etc.)

- **Show the tool in action** — screenshot or generated preview of the output
- **Include the URL prominently** in the image itself
- **Focus on the outcome**, not the feature list

## Image Asset Locations

### Generated Assets
- `scripts/thread-assets/` — Social post images (PNG)
- `public/images/swarm/` — Swarm prediction tool assets
- `public/images/press/` — Press and media assets
- `public/images/icon.png` — Vedang's profile photo

### Naming Convention
```
{topic}_{variant}_{timestamp}.png
```
Examples:
- `agentic_1_hook_1774395147440.png`
- `psych_dunning_kruger_1774433342426.png`
- `smart_employees_1774435123593.png`

## Post Content Templates

### Hook + Insight + CTA (Primary Format)
```
[Provocative opening statement or counter-intuitive fact]

[2-3 sentences expanding with specific data or examples]

[Link to tool/essay]
```

### Question + Answer + Link
```
[Rhetorical question most people get wrong]

[The actual answer with evidence]

[Link]
```

### Observation + Implication
```
[Something everyone sees but nobody talks about]

[What this actually means for the future]
```

## Platform-Specific Image Requirements

| Platform | Aspect Ratio | Max File Size | Format | Notes |
|----------|-------------|---------------|--------|-------|
| LinkedIn | 1.91:1 or 1:1 | 5MB | PNG/JPG | 1:1 performs best in feed |
| X | 16:9 or 1:1 | 5MB | PNG/JPG | Multiple images possible |
| Bluesky | Any | 1MB | PNG/JPG | Compress before upload |
| Facebook | 1.91:1 or 1:1 | 4MB | PNG/JPG | Square works best |
| Dev.to | 1000px wide | N/A | N/A | Header image via URL |
| Hashnode | 1600×840 | N/A | N/A | Cover image |
| Tumblr | Any | 20MB | PNG/JPG/GIF | Photo posts perform best |

## Quality Checklist

Before publishing any visual content:
- [ ] Light background (white or light gray, NOT dark)
- [ ] Text is readable at mobile resolution
- [ ] No spelling errors in image text
- [ ] No AI slop phrases in image text
- [ ] No em-dashes anywhere in text
- [ ] Numbers/stats are accurate and verified against primary sources
- [ ] All sources are hyperlinked where possible
- [ ] veda.ng watermark present (if promoting tools)
- [ ] Image complements post text, doesn't duplicate it
- [ ] File size appropriate for target platform
- [ ] Unique image (not reused from another post)
- [ ] Chart components registered in page.tsx
