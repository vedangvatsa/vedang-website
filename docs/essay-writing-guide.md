# Vedang Vatsa — Essay Writing Guide

## Essay Library Overview

52 essays at `veda.ng/{slug}` (root-level routing), written in MDX format at `src/content/essays/`.

## Thematic Categories

### AI & Intelligence Systems
| Essay | Slug | Core Argument |
|-------|------|---------------|
| Agentic Commerce | agentic-commerce | AI agents will reshape commerce by acting as autonomous buyers and sellers |
| The AI Agent Economy | ai-agent-economy | Agents as economic actors, not just tools |
| The AI Economy | ai-economy | How AI restructures labor, capital, and value creation |
| Artificial Intuition | artificial-intuition | AI developing pattern recognition beyond explicit programming |
| AI Superintelligence Timeline | asi-timeline | When ASI arrives and what it means for civilization |
| Intuitive Singularity | intuitive-singularity | The moment machines develop genuine intuition |
| Rationality in AI | rationality-in-ai | AI's rationality is bounded differently than human rationality |
| The Singularity Paradox | singularity-paradox | Why predicting the singularity inherently contradicts itself |
| What is the Singularity? | singularity | Accessible explainer of technological singularity |
| Synthetic Empathy | synthetic-empathy | When machines simulate genuine emotional understanding |
| Towards the Agentic Web | towards-the-agentic-web | The internet evolving from pages to agents |
| Governance in the Age of AGI | agi-governance | How governance structures must adapt for AGI |
| The Post-Interface Internet | post-interface-internet | The GUI era is ending; agents interact through protocols, not screens |

### Internet & Digital Society
| Essay | Slug | Core Argument |
|-------|------|---------------|
| The Dark Forest Internet | dark-forest-internet | The internet is becoming hostile; visibility is dangerous |
| An Internet of Lies | internet-of-lies | Misinformation as the internet's default state |
| Attention Refinery | attention-refinery | Platforms refine human attention into profit |
| Digital Monasticism | digital-monasticism | The case for deliberate digital withdrawal |
| Cognitive Load Crisis | cognitive-load | Modern digital life exceeds human processing capacity |
| Sensory Internet | sensory-internet | The internet expanding beyond visual/text to all senses |
| Pseudonymous Agency | pseudonymous-agency | Freedom through strategic identity management |
| The Plurality Trap | plurality-trap | More information produces less shared understanding |

### Economics & Geopolitics
| Essay | Slug | Core Argument |
|-------|------|---------------|
| From Cheap to Competitive | cheap-to-competitive | India's transition from cost arbitrage to genuine quality |
| Bureaucracy is the friction tax | bureaucracy-tax | Bureaucracy is an invisible drag on everything |
| Hustle culture is a cage | hustle-culture | Hustle culture exploits workers while pretending to empower them |
| The Infinity Economy | infinity-economy | Digital goods have zero marginal cost, with implications |
| The Mesh Economy | mesh-economy | Decentralized, interconnected economic networks |
| Twilight Economy | twilight-economy | The economy between old systems dying and new ones emerging |
| Lessons from Singapore's Arc | singapores-arc | What other nations can learn from Singapore's deliberate development |
| The In-Between State | in-between-state | Nations and institutions caught between paradigms |
| The Revision Gap | revision-gap | The delay between reality changing and narratives updating |

### Web3, Trust & Governance
| Essay | Slug | Core Argument |
|-------|------|---------------|
| Programmable Trust | programmable-trust | Trust encoded in code, not institutions |
| The God Protocol | god-protocol | A protocol that perfectly mediates every transaction |
| Tracing Blockchain's Journey | blockchain-journey | Blockchain's evolution beyond cryptocurrency |
| Computational Constitutions | computational-constitutions | Governance rules as executable code |
| API States | api-states | Nations that operate like software platforms |
| Plurality Trap | plurality-trap | When too many governance options create paralysis |

### Philosophy & Simulation
| Essay | Slug | Core Argument |
|-------|------|---------------|
| Are We in a Computer Simulation? | simulation-hypothesis | Evaluating the simulation argument with intellectual rigor |
| Simulation Layer | simulation-layer | Reality as a computational substrate |
| Sacred Algorithms | sacred-algorithms | When algorithms take on quasi-religious authority |
| Computational Social Science at Scale | computational-social-science | Using computation to study human behavior at scale |
| The World as an Interface | ambient-intelligence | The physical world becoming a computing surface |
| The Substrate Shift | substrate-shift | Intelligence moving from biological to digital substrates |

## Writing Style Rules

### Structure
- **Length**: 3,500-4,500 words. Each essay is a McKinsey-grade research piece with charts, data visualizations, and verified statistics.
- **Opening**: Start with a concrete observation, historical fact, or provocative claim. NEVER start with a definition or "In today's world..."
- **Body**: Build the argument through specific examples, data, and analogies. Each section should advance the thesis, not repeat it. Pair every core claim with a StatRow, chart component, or data table.
- **Closing**: End with an implication or unanswered question. NOT a summary of what was just said.

### MDX Components Used
```tsx
<PullQuote>Key insight text</PullQuote>     // Highlighted quotes (uses children, NOT quote prop)
<Callout type="insight" title="Title">     // Info callouts with typed variants
  Content here
</Callout>
<KeyTakeaway>Core lesson text</KeyTakeaway> // Summary takeaways (uses children)
<StatRow>                                   // Data stat rows (McKinsey-style)
  <Stat value="51%" label="Description" source="Source Name" sourceUrl="https://..." />
</StatRow>
```

### Banned Components
- **`<SectionLabel>`** — Do NOT use. It renders as an all-caps, light-blue, non-semantic `<span>` that duplicates the `##` heading below it. Use standard `##` markdown headings for all section dividers.

### Custom Chart Components
Each essay should have its own chart file at `src/components/mdx/{essay-slug}-charts.tsx`. Charts must:
- Use `'use client'` directive
- Follow light-mode aesthetic (white bg, `#37352f` text, `#e3e3e0` borders)
- Include source attribution in `text-[10px] text-muted-foreground/60`
- Be registered in `src/app/[slug]/page.tsx` (import + component mapping)
- Use verified data with hyperlinked sources where possible

### Formatting Rules
- **No em-dashes** (`—`). Use commas, colons, semicolons, or restructure the sentence.
- **No dark backgrounds** in inline components. All charts and infographics use light backgrounds matching the site theme.
- **Hyperlink all sources**. Every cited organization should link to the source report/page.

### Voice
- **First person sparingly** — "The data shows..." not "I believe..."
- **Active voice always** — "AI reshapes commerce" not "Commerce is being reshaped by AI"
- **Concrete over abstract** — "DJI holds 70% of the drone market" not "China dominates technology sectors"
- **Historical anchoring** — Connect new ideas to historical precedents
- **Intellectual honesty** — Acknowledge counterarguments and limitations

### Data Integrity
- **Verify all funding/valuation numbers** against Crunchbase, SEC filings, or company disclosures before publishing
- **Use qualified language** for unconfirmed data: "reportedly in discussions" or "according to [source]"
- **Track verification dates** — numbers go stale fast (e.g., market caps change daily)
- **Internal consistency** — numbers in prose, SVGs, and StatRows must match. When one number changes, recalculate all derived numbers (e.g., "combined valuation")
- **Cross-reference across essays** — if Cerebras appears in 3 essays, the market cap must be consistent in all 3

### Banned Phrases (AI Slop)
These phrases have been purged from all essays. Never reintroduce them:

| Banned | Use Instead |
|--------|-------------|
| "explore into" | "examine," "look at," specific verb |
| "landscape" | "market," "field," specific noun |
| "reshape" / "redefine" | AI transformation cliché | "alter," "change," describe the specific change |
| "tapestry" | Remove entirely or use specific description |
| "" | State the thing directly |
| "in the realm of" | "in" |
| "major shift" | Describe the specific change |
| "model shift" | Describe what actually shifted |
| "leverage" (as verb) | "use," "apply," specific verb |
| "collaboration" | Describe the specific benefit |
| "unlock" (potential/value) | Describe what actually happens |
| "holistic" | "complete," "full," or remove |
| "strong" | "strong," "reliable," specific adjective |
| "modern" | Describe what makes it new |
| "smooth" | Describe the specific UX improvement |
| "ecosystem" (as buzzword) | "market," "community," "network" |
| "shift" (as noun) | Vague transition word | Describe the specific change |
| "foster" / "facilitate" | Corporate speak | "enable," "create," "support," or describe specifically |
| "paradigm" (in non-technical context) | Academic buzzword | OK in technical use ("programming paradigm"); banned in prose ("paradigm shift") |

### Frontmatter Format
```yaml
---
title: "Essay Title"
date: "YYYY-MM-DD"
description: "One-sentence summary for SEO and social previews"
---
```

### Cross-Posting Context
- **Dev.to**: Full essay with `canonical_url: https://veda.ng/{slug}`. Tags limited to 4.
- **Hashnode**: Full essay with `originalArticleURL`. Published to `vedangvatsa.hashnode.dev`.
- **Social media**: Short 50-100 word hooks derived from the essay, with link to full version.

## Research & Citation Standards

- Vedang has **22 academic publications** (IEEE, IOSR, international journals)
- **All data must be verified against primary sources** before publication. Never use fabricated statistics or projections presented as fact.
- When citing research: mention the institution/source, not just "studies show"
- Preferred citation style: inline with parenthetical source notes and hyperlinks
- Original research and primary sources preferred over news articles
- **Accepted sources**: Gallup, Pew Research, Gartner, McKinsey, Edelman Trust Barometer, Imperva, Reuters Institute, Crunchbase, Tracxn, peer-reviewed journals (Science, Nature, PNAS)
- **If a statistic cannot be verified**, label it clearly as "illustrative" or "directional estimate" with honest sourcing

## Essay Pipeline

1. **Ideation**: Identify a counter-narrative or underexplored angle on a trending topic
2. **Research**: 5-10 specific, verified data points from primary sources to anchor the argument
3. **Draft**: Write in MDX with StatRows, chart components, and tables for data density
4. **Chart creation**: Build custom React chart components at `src/components/mdx/{slug}-charts.tsx`
5. **Registration**: Import and register chart components in `src/app/[slug]/page.tsx`
6. **Fact-check**: Verify every number against its cited source. Remove or relabel anything unverifiable.
7. **Style audit**: Run all 4 checks:
   - `grep -r '—\|–' src/content/essays/` — Zero em-dashes
   - `grep -rn 'landscape\|tapestry\|leverage\|unlock\|holistic\|foster\|facilitate\|reshape\|redefine' src/content/essays/` — Zero AI slop in prose
   - `find public/images -name "*.svg" -exec xmllint --noout {} \;` — All SVGs valid XML
   - Verify internal consistency: prose numbers match SVG numbers
8. **Build test**: Run `npx next build` to verify compilation
9. **Publish**: Deploy, then schedule cross-posts
10. **Promote**: Create 2-3 short-form posts across platforms linking to the essay

## SVG Requirements

All SVGs in `public/images/essays/` must:
- Have explicit `width` and `height` attributes on the root `<svg>` element (browsers require these for `<img>` tag rendering)
- Pass `xmllint --noout` validation with zero errors
- Use `&amp;` instead of `&` in all text elements and attributes (unescaped `&` breaks XML parsing)
- Have no duplicate attributes on any element
- Follow light-mode aesthetic (white backgrounds, `#37352f` text)
