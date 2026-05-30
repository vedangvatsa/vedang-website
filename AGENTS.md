# Project Guidelines

When working on this project, you MUST read and follow these guidelines before making any changes:

## Essay Content
- **Essay Writing Guide**: `docs/essay-writing-guide.md` — Structure, MDX components, formatting rules, banned phrases, citation standards, and the 10-step essay pipeline.
- **AI Slop Avoidance**: `docs/ai-slop-avoidance.md` — Comprehensive list of banned AI-generated phrases. Check ALL content against this before committing.

## Design & Visuals
- **Infographic Design Guide**: `docs/infographic-design-guide.md` — Brand colors, typography, SVG/chart standards, light-mode aesthetic.
- **SVG Requirements**: All SVGs MUST have explicit `width` and `height` attributes. All SVGs MUST pass `xmllint --noout` validation (no unescaped `&`, no duplicate attributes).

## SEO & Discovery
- **AI Search & SEO Guidelines**: `docs/ai_search_and_seo_guidelines.md` — Meta tags, semantic HTML, alt text requirements, agent-readiness protocols.

## Social Media
- **Social Media Persona**: `docs/social-media-persona.md` — Voice, tone, hashtag strategy for LinkedIn/Twitter/cross-posts.
- **Automation Infrastructure**: `docs/automation-infrastructure.md` — Platform pipeline, scheduling, and cross-posting workflows.

## Quality Checks (Run Before Every Commit)
1. `grep -r '—\|–' src/content/essays/` — Zero em-dashes
2. `grep -rn 'landscape\|tapestry\|leverage\|unlock\|holistic\|foster\|facilitate' src/content/essays/` — Zero AI slop in prose
3. `find public/images -name "*.svg" -exec xmllint --noout {} \;` — All SVGs valid XML
4. `npx next build` — Build passes

## Website
- Domain: `veda.ng`
- Hosting: Firebase App Hosting (backend: `studio`, project: `vedang-fig5b`)
- Essays use `[slug]` routing at root level (e.g., `veda.ng/agent-infrastructure-stack`, NOT `veda.ng/essays/...`)
