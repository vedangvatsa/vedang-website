# AI Slop Prevention Rules

All essays and written content added to `vedang-website` MUST follow these strict rules to eliminate AI writing patterns, corporate slop, and formulaic phrasing.

## Mandatory Pre-Commit Check
Before completing any work that adds or edits essays in `src/content/essays/`, you MUST run:
```bash
npm run lint:slop
```
Zero violations are permitted.

## Banned Words & Phrases (Tier 1)
Never use these words or phrases in prose:
- `explore` / `exploring` / `exploration` -> Use "examine," "analyze," "study," or state directly.
- `landscape` -> Use "market," "field," "industry," or specify the exact domain.
- `reshape` / `redefine` -> Use "alter," "change," or describe the actual shift.
- `foster` / `facilitate` -> Use "enable," "create," "support," or describe the mechanism.
- `tapestry` -> Remove or describe specific components.
- `delve` / `delve into` -> Use "investigate," "examine," or state directly.
- `realm` / `in the realm of` -> Use "in" or name the specific domain.
- `it's notable that` / `it's important to note` -> Delete throat-clearing and state the fact directly.
- `in today's world` / `in today's rapidly evolving` -> Specify exact timeframe or context.
- `paradigm shift` / `model shift` -> Describe the specific structural change.
- `at the end of the day` / `food for thought` / `only time will tell` -> Avoid cliché non-conclusions. Take a clear stance.
- `double-edged sword` / `game-changer` / `pivotal role` / `synergy` -> Use precise functional descriptions.

## Banned Conversational AI Tropes
Never start explanatory paragraphs with conversational AI prompts:
- "Think of it as..." / "Think of Layer 1 as..." -> State what it is directly.
- "Imagine trying to..." / "Imagine you want to..." -> Give a concrete real-world example directly.
- "Consider a mid-market enterprise..." / "Consider how this works..." -> Use "Take a mid-market enterprise..." or state the scenario directly.
- "Picture thousands of computers..." -> Describe the scenario directly.
- "At its core..." -> Use "Fundamentally" or state the mechanism directly.
- "In simple terms..." -> Explain simply without announcing it.
- "Here's how it works..." -> State mechanics directly.

## Banned Hedging & Double Hedges
- Never use double hedges: `could potentially`, `might possibly`, `may potentially`. Collapse to one word.
- Never use position-avoiding hedges: `in certain scenarios`, `while there are certainly challenges`, `remains to be seen`. State your thesis cleanly.

## Essay Structural & Formatting Rules
1. **Plain-Text Opener**: Every essay MUST start with a plain-text opening paragraph BEFORE any `<Figure>` or `<Callout>`.
2. **No Opening Callouts**: Do not wrap the opening paragraph in a `<Callout>`.
3. **No Em-Dashes**: Do not use `—` or `–` in essay prose. Use hyphens `-` or restructure into separate sentences.
4. **Data Accuracy**: Verify all funding numbers, market caps, and dates. Ensure consistency across SVG charts, StatRows, and prose.
