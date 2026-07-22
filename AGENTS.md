# Project Guidelines

When working on this project, you MUST read and follow these guidelines before making any changes:

## Essay Content
- **Essay Writing Guide**: `docs/essay-writing-guide.md` — Structure, MDX components, formatting rules, banned phrases, citation standards, and the 10-step essay pipeline.
- **AI Slop Avoidance**: `docs/ai-slop-avoidance.md` — Comprehensive list of banned AI-generated phrases. Check ALL content against this before committing.
- **Opening paragraph before hero image**: Every essay MUST have a plain-text opening paragraph BEFORE the `<Figure>` hero infographic. Never put the image first.
- **No opening Callout boxes**: Do NOT wrap the essay's opening paragraph in a `<Callout>` (e.g., "The Core Thesis", "Key Findings", "Executive Summary"). Callouts are for mid-body asides only.

## Design & Visuals
- **Infographic Design Guide**: `docs/infographic-design-guide.md` — Brand colors, typography, SVG/chart standards, light-mode aesthetic, OG image design guidelines.
- **OG Image Pattern**: Tool and project pages use a split layout with large title on the left and a terminal card on the right. Light background (#f8fafc), indigo accent (#6366f1), Inter font. See `docs/infographic-design-guide.md` OG Image Design Guidelines section for full spec.
- **SVG Requirements**: All SVGs MUST have explicit `width` and `height` attributes. All SVGs MUST pass `xmllint --noout` validation (no unescaped `&`, no duplicate attributes).

## SEO & Discovery
- **AI Search & SEO Guidelines**: `docs/ai_search_and_seo_guidelines.md` — Meta tags, semantic HTML, alt text requirements, agent-readiness protocols.

## Social Media
- **Social Media Persona**: `docs/social-media-persona.md` — Voice, tone, hashtag strategy for LinkedIn/Twitter/cross-posts.
- **Automation Infrastructure**: `docs/automation-infrastructure.md` — Platform pipeline, scheduling, and cross-posting workflows.

## Quality Checks (Run Before Every Commit)
1. `grep -r '—\|–' src/content/essays/` — Zero em-dashes
2. `grep -rn 'landscape\|tapestry\|leverage\|unlock\|holistic\|foster\|facilitate\|paradigm shift\|reshape\|redefine\|synergy\|empower\|streamline' src/ --include='*.tsx' --include='*.ts' --include='*.mdx' | grep -v node_modules | grep -v ai-slop-avoidance` — Zero AI slop in prose (scans all src/, not just essays)
3. `find public/images -name "*.svg" -exec xmllint --noout {} \;` — All SVGs valid XML
4. `npx next build` — Build passes

## Data Integrity Rules
- **Verify all funding/valuation numbers** against Crunchbase, SEC filings, or company disclosures before publishing
- **Use qualified language** for unconfirmed data: "reportedly," "according to [source]"
- **Internal consistency**: numbers in prose, SVGs, and StatRows MUST match. When one number changes, recalculate all derived numbers (e.g., "combined valuation")
- **Cross-reference across essays**: if a company appears in multiple essays, the data must be consistent in all of them
- **Track verification dates**: funding data goes stale fast (market caps change daily, funding rounds close)

## CSP & External Resources
- CSP is configured in `next.config.mjs` under `headers()`
- When adding features that fetch from external domains (map tiles, CDN fonts, APIs), update the relevant CSP directive (`connect-src`, `font-src`, `worker-src`)
- If something works locally but breaks in production, check browser DevTools Console for `Refused to connect to` CSP errors

## Website
- Domain: `veda.ng`
- Hosting: Firebase App Hosting (backend: `studio`, project: `studio-9488916948-c80fb`)
- Essays use `[slug]` routing at root level (e.g., `veda.ng/agent-infrastructure-stack`, NOT `veda.ng/essays/...`)

## Layout & Components
- **Content width**: All pages use `content-width` class (61.8% on desktop, 80% tablet, 100% mobile). No page should override this with `wide={true}` unless it has a genuinely full-width layout (maps, dashboards).
- **PageLayout**: Every page wraps in `<PageLayout>`. Header and footer are automatic.
- **Course pages**: Use shared components (`CourseHero`, `CurriculumSection`, `CourseReferences`, `CourseFAQ`). No sidebars. No "Start Course" button. No prerequisite badges.
- **CourseHero**: Matches essay header pattern: centered h1, subtitle, avatar + author name. No badges or buttons.
- **CourseReferences**: Default alignment is `center`. Do NOT pass `align="left"`.
- **Header pattern**: All content pages (essays, courses, tools) use the same centered h1 + subtitle + avatar byline pattern.

## Accessibility
- **Skip link**: First focusable element in `<body>` links to `<main id="main">`. Invisible to mouse users, visible on keyboard Tab. Do NOT remove.
- **RSS feed discovery**: `<link rel="alternate" type="application/rss+xml">` in `<head>` for `/feed.xml`. Do NOT remove.
- **Semantic landmarks**: `<header>`, `<nav>`, `<main id="main">`, `<footer>` are required on every page.
- **Image alt text**: Every `<img>` must have an `alt` attribute. Zero exceptions.
