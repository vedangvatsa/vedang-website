# Vedang Vatsa — Essay Writing Guide

## Essay Library Overview

40 essays at `veda.ng/essays/{slug}`, written in MDX format at `src/content/essays/`.

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

### Economics & Geopolitics
| Essay | Slug | Core Argument |
|-------|------|---------------|
| From Cheap to Competitive | cheap-to-competitive | India's transition from cost arbitrage to genuine quality |
| Bureaucracy is the friction tax | bureaucracy-tax | Bureaucracy is an invisible drag on everything |
| Hustle culture is a cage | hustle-culture | Hustle culture exploits workers while pretending to empower them |
| The Infinity Economy | infinity-economy | Digital goods have zero marginal cost — implications |
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
- **Length**: 1500-3000 words. Long enough to develop an argument, short enough to finish in one sitting.
- **Opening**: Start with a concrete observation, historical fact, or provocative claim. NEVER start with a definition or "In today's world..."
- **Body**: Build the argument through specific examples, data, and analogies. Each section should advance the thesis, not repeat it.
- **Closing**: End with an implication or unanswered question. NOT a summary of what was just said.

### MDX Components Used
```tsx
<SectionLabel label="Section Title" />     // Section dividers
<PullQuote quote="Key insight" />          // Highlighted quotes
<Callout text="Important context" />       // Info callouts
<KeyTakeaway text="Core lesson" />         // Summary takeaways
```

### Voice
- **First person sparingly** — "The data shows..." not "I believe..."
- **Active voice always** — "AI reshapes commerce" not "Commerce is being reshaped by AI"
- **Concrete over abstract** — "DJI holds 70% of the drone market" not "China dominates technology sectors"
- **Historical anchoring** — Connect new ideas to historical precedents
- **Intellectual honesty** — Acknowledge counterarguments and limitations

### Banned Phrases (AI Slop)
These phrases have been purged from all 40 essays. Never reintroduce them:

| Banned | Use Instead |
|--------|-------------|
| "delve into" | "examine," "look at," specific verb |
| "landscape" | "market," "field," specific noun |
| "tapestry" | Remove entirely or use specific description |
| "at its core" | State the thing directly |
| "in the realm of" | "in" |
| "game-changer" | Describe the specific change |
| "paradigm shift" | Describe what actually shifted |
| "leverage" (as verb) | "use," "apply," specific verb |
| "synergy" | Describe the specific benefit |
| "unlock" (potential/value) | Describe what actually happens |
| "holistic" | "complete," "full," or remove |
| "robust" | "strong," "reliable," specific adjective |
| "cutting-edge" | Describe what makes it new |
| "seamless" | Describe the specific UX improvement |
| "ecosystem" (as buzzword) | "market," "community," "network" |

### Frontmatter Format
```yaml
---
title: "Essay Title"
date: "YYYY-MM-DD"
description: "One-sentence summary for SEO and social previews"
---
```

### Cross-Posting Context
- **Dev.to**: Full essay with `canonical_url: https://veda.ng/essays/{slug}`. Tags limited to 4.
- **Hashnode**: Full essay with `originalArticleURL`. Published to `vedangvatsa.hashnode.dev`.
- **Social media**: Short 50-100 word hooks derived from the essay, with link to full version.

## Research & Citation Standards

- Vedang has **22 academic publications** (IEEE, IOSR, international journals)
- Essays should reference specific data points, not vague claims
- When citing research: mention the institution/source, not just "studies show"
- Preferred citation style: inline with parenthetical source notes
- Original research and primary sources preferred over news articles

## Essay Pipeline

1. **Ideation**: Identify a counter-narrative or underexplored angle on a trending topic
2. **Research**: 3-5 specific data points or historical examples to anchor the argument
3. **Draft**: Write in MDX with components for visual breaks
4. **Edit**: Run through AI slop filter, ensure every paragraph advances the thesis
5. **Publish**: Add to `src/content/essays/`, deploy, then schedule cross-posts
6. **Promote**: Create 2-3 short-form posts across platforms linking to the essay
