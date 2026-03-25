# Vedang Vatsa — Infographic & Design Guide

## Brand Visual Identity

### Color Palette
- **Primary Background**: Dark navy/charcoal (#0f172a to #1e293b) — used across all infographics
- **Accent Colors**: Electric blue (#3b82f6), cyan (#06b6d4), violet (#8b5cf6)
- **Text**: White (#ffffff) for headings, light gray (#94a3b8) for body
- **Highlights**: Amber (#f59e0b) for emphasis, emerald (#10b981) for positive/success
- **Avoid**: Pure red, neon green, or any garish primary colors

### Typography
- **Headings**: Bold, clean sans-serif (Inter, SF Pro, or similar)
- **Body**: Regular weight, high contrast against dark backgrounds
- **Numbers/Stats**: Extra bold, oversized — numbers are visual anchors
- **Minimum text size**: Always readable at mobile resolution (1080px wide)

### Layout Principles
- **Dark mode always** — every infographic uses a dark background
- **Generous whitespace** — never cramped, let elements breathe
- **Visual hierarchy**: One clear focal point per image
- **Aspect ratio**: 1:1 (1080×1080) for social posts, 16:9 for X/LinkedIn headers
- **No stock photos** — always custom-generated or data-driven visuals

## Infographic Types

### 1. Data Stat Cards
**Use for**: Single striking statistic with context
**Structure**:
- Large number (60-80pt equivalent) as focal point
- One-line context below
- Source attribution in bottom corner
- Brand watermark (veda.ng) discretely placed

**Prompt template**:
```
Professional dark-themed infographic card. Large bold statistic "[NUMBER]" 
prominently displayed in white text. Subtitle: "[CONTEXT]". 
Dark navy background (#0f172a) with subtle gradient. Modern sans-serif 
typography. Clean, minimal design. No icons. Source text small at bottom.
```

### 2. Comparison/Contrast Cards
**Use for**: Before/after, old vs new, expectation vs reality
**Structure**:
- Split layout (left vs right or top vs bottom)
- Contrasting colors for each side
- Clear labels
- Optional connecting element (arrow, vs symbol)

**Prompt template**:
```
Dark-themed split comparison infographic. Left side: "[CONCEPT A]" with 
[COLOR A] accent. Right side: "[CONCEPT B]" with [COLOR B] accent. 
Dark background. Clean separation. Modern typography. Professional layout. 
Minimal design with high contrast text.
```

### 3. List/Framework Cards
**Use for**: Top 5 reasons, 3-step frameworks, psychological concepts
**Structure**:
- Numbered or bulleted list
- Each item has a short title + one-line explanation
- Consistent formatting across items
- Header establishing the topic

**Prompt template**:
```
Dark-themed infographic showing a numbered list of [N] items about 
"[TOPIC]". Each item has a bold title and brief description. 
Dark navy background. Clean modern layout. White and cyan text. 
Professional and minimal. No decorative elements.
```

### 4. Quote/Insight Cards
**Use for**: Key observations, essay highlights, provocative claims
**Structure**:
- Large quotation or insight text
- Attribution or source
- Optional subtle background graphic
- Brand watermark

**Prompt template**:
```
Dark-themed quote card. Large text: "[QUOTE]" in white on dark navy 
background (#0f172a). Subtle blue gradient accent. Author attribution 
below. Modern sans-serif font. Clean, premium design. Minimal.
```

### 5. Process/Flow Diagrams
**Use for**: How something works, timeline of events, causal chains
**Structure**:
- Linear flow (left-to-right or top-to-bottom)
- Connected nodes with labels
- Arrows or lines showing progression
- Clear start and end points

**Prompt template**:
```
Dark-themed process flow diagram showing [N] steps of "[PROCESS]". 
Connected nodes with arrows. Each step has an icon and label. 
Dark background with glowing accent lines. Modern, technical aesthetic. 
Clean typography.
```

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
- [ ] Dark background (not white, not gray)
- [ ] Text is readable at mobile resolution
- [ ] No spelling errors in image text
- [ ] No AI slop phrases in image text
- [ ] Numbers/stats are accurate and sourced
- [ ] veda.ng watermark present (if promoting tools)
- [ ] Image complements post text, doesn't duplicate it
- [ ] File size appropriate for target platform
- [ ] Unique image (not reused from another post)
