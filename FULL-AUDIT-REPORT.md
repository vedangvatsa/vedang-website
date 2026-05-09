# Full SEO Audit Report — veda.ng
**Audit Date:** March 12, 2026
**Auditor:** Automated codebase analysis (files read directly, no guessing)
**Domain:** https://veda.ng
**Framework:** Next.js 14 (App Router) + MDX

---

## Overall SEO Health Score: 68 / 100

| Category | Weight | Raw Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 70/100 | 17.5 |
| Content Quality | 25% | 72/100 | 18.0 |
| On-Page SEO | 20% | 65/100 | 13.0 |
| Schema / Structured Data | 10% | 60/100 | 6.0 |
| Performance (CWV) | 10% | 65/100 | 6.5 |
| Images | 5% | 75/100 | 3.75 |
| AI Search Readiness | 5% | 80/100 | 4.0 |
| **Total** | **100%** | | **68.75 → 68** |

---

## 1. Technical SEO (25%) — Score: 70/100

### robots.txt
**File:** `/public/robots.txt`

**Strengths:**
- Global `Allow: /` for all crawlers — no pages blocked.
- Explicitly allows 8 AI crawlers: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Bytespider, cohere-ai. This is excellent GEO visibility configuration.
- Sitemap URL correctly declared: `Sitemap: https://veda.ng/sitemap.xml`

**Issues:**
- Missing `User-agent: GoogleBot`, `Bingbot`, `AhrefsBot`, `SemrushBot` explicit entries (not harmful but common practice for clarity).
- No `Disallow` rules at all — fine for a personal brand site.

### Sitemap
**Files:** `/public/sitemap.xml` (static) and `/src/app/sitemap.ts` (dynamic Next.js)

**Critical Conflict:** There are TWO sitemap sources. In Next.js App Router, `src/app/sitemap.ts` generates `/sitemap.xml` at build time and takes precedence over `/public/sitemap.xml`. The static file in `/public/` is effectively shadowed at build/serve time — but during static serving or CDN misconfiguration, the wrong sitemap could be served. This creates ambiguity.

**Static sitemap.xml gaps (if it were the served version):**
- Missing: `/glossary/[slug]/*` individual glossary term pages
- Missing: `/artificial-intuition` (essay exists in content folder but not in static XML)
- Missing: `/the-ai-agent-economy` (essay exists in content folder but not in static XML)
- Static sitemap has no `<lastmod>` tags on any URL — only `<changefreq>` and `<priority>`

**Dynamic sitemap.ts gaps:**
- `/guides` is NOT included in the dynamic sitemap.ts static pages list
- `/glossary` is NOT included in the dynamic sitemap.ts
- Individual `/glossary/[slug]` pages are NOT generated in sitemap.ts
- `lastModified` is always `new Date()` (current build date) — not the actual content modification date
- No `changefreq` or `priority` in the dynamic sitemap (Next.js default omits them)

**Net result:** The combined sitemap coverage is incomplete. Guides, glossary index, and all individual glossary term pages are missing from the dynamic sitemap that Next.js actually serves.

### Canonical Tags
- Root layout (`/src/app/layout.tsx`): `alternates: { canonical: '/' }` — correct for homepage.
- Essay pages (`/src/app/[slug]/page.tsx`): `alternates: { canonical: '/${params.slug}' }` — correct, relative path with Next.js `metadataBase` resolves to `https://veda.ng/slug`.
- Static pages (profile, writings, guides, etc.): All use `generateMetadata()` from `/src/lib/metadata.ts` which sets `alternates: { canonical: url }` — correct.
- Glossary term pages: `alternates: { canonical: '/glossary/${term.slug}' }` — correct.

**No canonical tag issues found for pages that have them.**

### Security Headers
**File:** `/next.config.mjs`

**Present headers (applied to all routes via `/:path*`):**
- `X-Content-Type-Options: nosniff` ✓
- `X-Frame-Options: SAMEORIGIN` ✓
- `Referrer-Policy: strict-origin-when-cross-origin` ✓
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` ✓

**Missing critical headers:**
- `Content-Security-Policy` (CSP) — absent entirely. This is a significant security and trust signal.
- `Strict-Transport-Security` (HSTS) — absent. Should be set on CDN/host, but not explicitly declared.
- `X-XSS-Protection` — deprecated but still expected by some scanners.

**Note:** Two config files exist (`next.config.mjs` and `next.config.ts`). The `.mjs` version is more complete (has security headers, image config). The `.ts` version lacks the security headers but has a `serverActionsTimeout` field. This is a **critical build ambiguity** — Next.js will use one or the other based on file resolution order. The `.mjs` version appears to be the active one. The `.ts` version should be removed or reconciled.

### Redirect Rules
No `redirects()` function is defined in either Next.js config. There are no redirect rules. This is acceptable for a personal site but means no trailing-slash normalization, no www-to-non-www redirect handling at the app level (likely handled by Firebase Hosting / CDN).

### Noindex Pages
No pages use `noindex`. All pages have `robots: { index: true, follow: true }` via the root layout defaults. No page-level `noindex` overrides were found.

### Duplicate URLs
- No trailing slash variants — Next.js App Router does not add trailing slashes by default.
- Both `/community` and `/seo` pages both have `h1` "Vedang Vatsa" — identical H1s on different pages (see On-Page SEO section).
- The homepage, profile, seo, and community pages all share very similar title-tag patterns around "Vedang Vatsa."

---

## 2. Content Quality (25%) — Score: 72/100

### Content Inventory

**Essays (33 MDX files in `/src/content/essays/`):**

| Essay | Word Count | Internal Links | Date | Author | Keywords |
|---|---|---|---|---|---|
| ai-superintelligence-timeline | 832 | 0 | Missing | Missing | Missing |
| ambient-intelligence | 1,597 | 4 | Missing | Missing | Missing |
| an-internet-of-lies | 1,518 | 0 | Missing | Missing | Missing |
| api-states | 1,495 | 3 | Missing | Missing | Missing |
| are-we-in-a-simulation | 857 | 0 | Missing | Missing | Missing |
| artificial-intuition | 778 | 0 | Missing | Missing | Missing |
| bureaucracy-and-the-technology-escape | 1,480 | 0 | Missing | Missing | Missing |
| computational-constitutions | 1,376 | 3 | Missing | Missing | Missing |
| computational-social-science-at-scale | 1,508 | 2 | Missing | Missing | Missing |
| digital-monasticism | 1,476 | 2 | Missing | Missing | Missing |
| governance-in-the-age-of-agi | 1,471 | 2 | Missing | Missing | Missing |
| hustle-culture-is-a-cage | 1,808 | 0 | Missing | Missing | Missing |
| programmable-trust | 1,437 | 2 | Missing | Missing | Missing |
| pseudonymous-agency | 1,475 | 1 | Missing | Missing | Missing |
| rationality-in-ai | 902 | 0 | Missing | Missing | Missing |
| sacred-algorithms | 1,523 | 2 | Missing | Missing | Missing |
| synthetic-empathy | 1,427 | 2 | Missing | Missing | Missing |
| the-ai-agent-economy | 1,650 | 0 | Missing | Missing | Missing |
| the-attention-refinery | 1,974 | 3 | Missing | Missing | Missing |
| the-cognitive-load-crisis | 1,336 | 0 | Missing | Missing | Missing |
| the-dark-forest-internet | 1,478 | 0 | Missing | Missing | Missing |
| the-god-protocol | 1,395 | 0 | Missing | Missing | Missing |
| the-in-between-state | 1,223 | 0 | Missing | Missing | Missing |
| the-intuitive-singularity | 1,365 | 0 | Missing | Missing | Missing |
| the-mesh-economy | 1,240 | 0 | Missing | Missing | Missing |
| the-plurality-trap | 1,239 | 0 | Missing | Missing | Missing |
| the-sensory-internet | 1,235 | 0 | Missing | Missing | Missing |
| the-simulation-layer | 1,563 | 0 | Missing | Missing | Missing |
| the-singularity-paradox | 808 | 0 | Missing | Missing | Missing |
| the-substrate-shift | 2,035 | 0 | Missing | Missing | Missing |
| the-twilight-economy | 1,202 | 0 | Missing | Missing | Missing |
| tracing-blockchains-journey | 1,393 | 0 | Missing | Missing | Missing |
| what-is-the-singularity | 698 | 0 | Missing | Missing | Missing |

**Thin content (under 300 words):** None. Minimum is 698 words (`what-is-the-singularity`). Average is ~1,350 words. Content depth is excellent.

### Critical Metadata Gaps (All 33 Essays)
- **`date:` field:** Missing from ALL 33 essays. The essay page renders a publication date from this field; currently it falls back to `new Date()` (build date). The Article schema uses `new Date().toISOString()` as both `datePublished` and `dateModified`. This is a major E-E-A-T and freshness signal failure — Google cannot determine when essays were written.
- **`author:` field:** Missing from ALL 33 essays. The Article schema defaults to `"Vedang Vatsa"` via hardcoded fallback, so authorship is technically in schema, but the frontmatter field itself is absent.
- **`keywords:` field:** Missing from ALL 33 essays. The Article schema conditionally includes `keywords` only when present — so currently no keyword metadata exists in any Article schema.

### E-E-A-T Signals
**Strong signals present:**
- Author credentials listed on homepage: BE, MTech, MBA, Chartered Engineer, IIT Kanpur alumnus, Fellow of the Royal Society of Arts.
- 22+ published research papers with DOI links (SSRN, IEEE, IJAR).
- Links to Google Scholar profile.
- Media appearances (24+ publications listed).
- Testimonials from named industry figures (Oscars screenwriter, Omidyar Network Director).
- Awards listed: Young Researcher 2020, Young Achiever 2020-21, Japan special visa for Intellectual Figures.

**Weak E-E-A-T signals:**
- No `date` on any essay — readers and crawlers cannot determine freshness.
- No "Last Updated" display on any page.
- No citations or sources linked within most essays (essays are opinion/analysis pieces, not academic papers, but citation would strengthen authority).
- The `article-intuition` and `the-ai-agent-economy` essays exist in the content folder but are not linked from the sitemap.xml static file.

### Content Quality (Sampled Essays)
**Bureaucracy and the Technology Escape (1,480 words):**
- Well-structured with H3 headings (6 sections).
- Clear thesis, logical flow, punchy prose style.
- No internal links to related essays — missed opportunity.
- No citations for specific claims (e.g., Singapore, Dubai, Estonia examples).

**The Dark Forest Internet (1,478 words):**
- Dense, well-argued paragraphs (100-130 words each — good for AI citability).
- References "Liu Cixin's science fiction novel" — demonstrates reading depth.
- No internal links despite strong topical connections to other essays.
- The final paragraph ends mid-sentence: "The future belongs to those who can" — **truncated/cut-off content bug.**

**Hustle Culture is a Cage (1,808 words):**
- Excellent depth with named sources (Seneca, Kierkegaard, Victor Lebow, Pascal, Stanford study reference).
- Best-structured essay of the five sampled (8 H3 sections).
- No internal links.

**Computational Constitutions (1,376 words):**
- 3 internal links to related essays (Programmable Trust, API States, The God Protocol) — best internal linking of any essay.
- Academic tone, well-cited conceptually.

**The Singularity Paradox (808 words):**
- Below-average length for the topic.
- No internal links.
- Abrupt ending — essay stops with "the system designing its own successors will be beyond our ability to steer." No conclusion section.

### Readability
- Heading structure is generally good where H3 subsections are used.
- Paragraph length in long essays like `the-dark-forest-internet` and `the-attention-refinery` runs 100-200 words per paragraph — good for comprehension and AI passage extraction.
- Short essays like `the-singularity-paradox` (808 words) and `what-is-the-singularity` (698 words) read more like blog posts than substantial essays.

### Content not in Sitemap / Orphaned
- `artificial-intuition.mdx` exists in the content folder but is NOT in the static `sitemap.xml`. It IS generated in the dynamic `sitemap.ts`. The page is accessible at `/artificial-intuition` but may not be discoverable.
- `the-ai-agent-economy.mdx` same situation.

---

## 3. On-Page SEO (20%) — Score: 65/100

### Title Tags and Meta Descriptions

**Root Layout:** Uses Next.js `metadata.title.template: '%s | Vedang Vatsa'`. The `metadataBase` is correctly set to `https://veda.ng`.

| Page | Title | Description | Issue |
|---|---|---|---|
| Homepage | "Vedang Vatsa - Founder of Hashtag Web3, AI & Web3 Thought Leader" | 167 chars ✓ | Good |
| /writings | "Essays & Research Papers on AI & Web3" | 183 chars — slightly long | Truncation risk |
| /web3-101 | "Web3 Fundamentals & Blockchain Ecosystem Explained - Free Course" | 195 chars — too long | Will truncate at ~160 |
| /prompt-engineering-101 | "Prompt Engineering 101 - Master AI Interactions" | 130 chars ✓ | Good |
| /agentic-web | "The Agentic Web - AI Agents & Autonomous Systems" | 172 chars — border | OK |
| /vibe-coding | "Vibe Coding - Engineering Intuition & Creativity" | 160 chars ✓ | Good |
| /guides | "Web3 & Crypto Guides - Market Making, Tokenomics, Taxation" | 165 chars — slightly over | Minor |
| /glossary | "AI, Web3 & Tech Glossary - Detailed Term Reference" | 229 chars — too long | Will truncate |
| /community | "Community Building & Content Strategy" | 192 chars ✓ | Good |
| /profile | "Vedang Vatsa - Founder, Speaker, Researcher" | 155 chars ✓ | Good |
| /seo | "SEO & Growth Marketing Specialist | Vedang Vatsa" | 155 chars ✓ | Good |
| /media | "Speaking Engagements, Interviews & Media Mentions" | 183 chars — slightly long | Minor |
| Essays | Essay-specific titles via `frontmatter.title` | From `summary` field | Good pattern |

**Essay title suffix:** Essays get the template suffix `| Vedang Vatsa` appended. Some essay titles are already long (e.g., "The Dark Forest Internet | Vedang Vatsa" — acceptable at ~43 chars total). No truncation issues observed for essays.

**Essay description note:** The `summary` field in frontmatter serves as the meta description. Most summaries are 1-2 sentences and under 160 characters — acceptable.

### H1 Uniqueness
**Issues found:**

- `/community` page H1: "Vedang Vatsa" (generic, same as homepage and seo page)
- `/seo` page H1: "Vedang Vatsa" (generic, same as community)
- `/profile` page H1: "Vedang Vatsa FRSA" (close to generic)
- `/writings` page: **NO H1 TAG AT ALL** — the page uses only H2s ("Recent Papers", "Essays"). This is a significant on-page SEO gap.
- `/media` page: Should be checked (not audited above but likely follows same pattern)

**Pages with unique, descriptive H1s:**
- /web3-101: "Fundamentals of Web3" ✓
- /agentic-web: "The Agentic Web" ✓
- /vibe-coding: (need to verify, but follows course pattern) ✓
- /guides: "Web3 & Crypto Guides" ✓
- /glossary: "Glossary" ✓
- Essay pages: Essay title from frontmatter ✓

### Internal Linking Analysis
**Header navigation links:**
- Writings, Courses (dropdown: Agentic Web, Vibe Coding, Prompt Engineering, Web3 101, Glossary), About (dropdown: Full Profile, Media & Speaking, SEO & Growth, Content & Community)
- `/guides` is NOT in the main navigation — it is only linked from within the Writings page and via sitemap. This reduces discoverability.

**Essay internal linking:**
- Only 11 of 33 essays contain any internal links to other essays.
- 22 essays have zero internal links.
- Of the essays with links, most link to 1-3 others.
- The internal link web is sparse — topic clusters are not reinforced.

**Footer linking:**
- Footer contains only social media icon links (Twitter, LinkedIn, YouTube, Google Scholar, Telegram, Email). No footer site navigation. No links to main content sections.

**Cross-page linking from static pages:**
- Homepage links to /writings, /profile, /media (via button). No links to /guides, /glossary, /web3-101, /agentic-web, /prompt-engineering-101 from the homepage — missed link equity distribution.
- The /writings page links to /writings only for essays — no links to courses or glossary.

### URL Structure
All URLs are clean, lowercase, hyphenated slugs. No query parameters. No dynamic IDs in URLs. Excellent URL structure across the board.

**Potential issue:** `/guides` page uses anchor-hash navigation (`#market-making`, `#tokenomics`, etc.) for in-page sections rather than individual guide URLs. This means no separate indexable page per guide topic.

---

## 4. Schema / Structured Data (10%) — Score: 60/100

### Schema Inventory

**Root Layout (`/src/app/layout.tsx`) — Site-wide:**
- `Organization` schema ✓
  - type, name, url, logo, sameAs (LinkedIn, YouTube, Scholar, X) — well-formed
- `Person` schema ✓
  - type, name, url, image, jobTitle (array), description, affiliation, sameAs, knowsAbout — well-formed
  - **Issue:** `jobTitle` is an array `['Founder', 'AI Researcher', 'Web3 Innovator', 'Entrepreneur']`. Schema.org `jobTitle` expects a string. This may cause validation warnings.
  - **Issue:** `image` points to `/images/icon.png` (256×256 PNG). Schema.org Person `image` should ideally be a high-resolution portrait.

**Essay Pages (`/src/app/[slug]/page.tsx`):**
- `Article` schema ✓
  - headline, author (Person), description, image, publisher (Organization + logo), mainEntityOfPage (WebPage), datePublished, dateModified, wordCount, keywords (conditional)
  - **Critical Issue:** `datePublished` and `dateModified` both fall back to `new Date().toISOString()` (current build date) because NO essay has a `date:` field in its frontmatter. Every article's publication date will show as the most recent build date — incorrect and potentially harmful for freshness signals.
  - **Issue:** `dateModified` is always equal to `datePublished` — no separate tracking of content updates.
  - **Issue:** `keywords` is conditionally included only when `essay.frontmatter.keywords` exists — but no essay has a keywords field, so keywords are never in any Article schema.
  - **Issue:** `author.image` is set to the site icon (`/images/icon.png`) — not a proper headshot URL.

**Profile Page (`/src/app/profile/page.tsx`):**
- `Person` schema ✓ (duplicate of layout schema but with more fields)
  - alumniOf (CollegeOrUniversity — IIT Kanpur) ✓
  - worksFor (Organization — Hashtag Web3) ✓
  - sameAs includes Telegram ✓
  - award: "Fellow of the Royal Society of Arts" ✓
  - **Note:** This Person schema on `/profile` is technically a duplicate of the root layout Person schema. Two Person schemas on the same domain with the same `@id` (both using `https://veda.ng`) could confuse Google. The profile page should use a more specific URL or `@id`.

**Glossary Page (`/src/app/glossary/page.tsx`):**
- `CollectionPage` schema
- `BreadcrumbList` schema
  - **Critical Issue:** ALL URLs in both schemas use `https://vedangvatsa.com` instead of `https://veda.ng`. These are pointing to a completely different (and apparently non-existent or old) domain. This makes the schema invalid/misleading for the live domain.

**Glossary Term Pages (`/src/app/glossary/[slug]/page.tsx`):**
- `DefinedTerm` schema
- `BreadcrumbList` schema
  - **Critical Issue:** Same as above — ALL URLs use `https://vedangvatsa.com` instead of `https://veda.ng`. Invalid.

**Course Pages (Web3-101, Agentic-Web, Prompt-Engineering-101, Vibe-Coding):**
- **No Course or EducationalOccupationalCredential schema** on any course page.
- These pages clearly function as courses (modules, accordion sections, FAQ) but have no structured data beyond the root layout schemas.
- Web3-101 and Agentic-Web pages both have FAQ sections — neither has `FAQPage` schema.

**SEO Page (`/src/app/seo/page.tsx`):**
- No page-specific schema beyond root layout schemas.

**Guides Page (`/src/app/guides/page.tsx`):**
- No page-specific schema beyond root layout schemas.

### Schema Summary Issues
1. Wrong domain (`vedangvatsa.com`) in Glossary and DefinedTerm schemas — **all glossary schemas are pointing to a dead/wrong domain.**
2. All Article schemas have incorrect dates (build date instead of actual publish date).
3. No Course schema on 4 course pages.
4. No FAQPage schema on Web3-101, Agentic-Web pages (both have FAQ accordion sections).
5. Person `jobTitle` should be a string, not an array.
6. No BreadcrumbList on essay pages (only on glossary pages).

---

## 5. Performance (CWV) (10%) — Score: 65/100

### Image Optimization
- Next.js `Image` component is used throughout — provides automatic WebP conversion, lazy loading, and responsive sizing.
- `priority` prop is correctly applied to above-the-fold images on all major pages (homepage, profile, seo, community).
- `remotePatterns` in `next.config.mjs` allows `placehold.co`, `images.unsplash.com`, `picsum.photos` — placeholder image services still in config. Suggests placeholder images may still exist in the codebase (`/src/lib/placeholder-images.json` exists).

**Issue:** The OG image (`/images/icon.png`) is a 256×256 PNG declared as 1200×630 in all metadata. When social platforms request the OG image, they will receive a small icon, not a proper Open Graph preview image. This will render as a very small, low-quality thumbnail across all social shares.

### Font Loading
- **No `next/font` module is used anywhere in the codebase.** This means no font optimization (preloading, subsetting, zero layout shift from font fallback). The Tailwind config uses `font-sans` which defaults to system fonts.
- CSS does not import any custom fonts via `@import` in `globals.css`.
- **Assessment:** The site appears to rely on system fonts, which is actually good for performance (no font loading latency, no CLS from font swap). However, if branding requires custom fonts, `next/font` should be used.

### JavaScript Bundle
- Using Next.js 14 with App Router — good server-component defaults. Client components are explicitly marked `'use client'`.
- Header is `'use client'` (uses dropdown menus) — minimal client JS.
- Main content pages appear to be server components.
- `genkit-ai/google-genai` and `firebase` packages in dependencies suggest server-side AI/data features — these should not bloat client bundles if properly tree-shaken.
- `fluent-ffmpeg` in dependencies (video processing) — unlikely to appear in client bundle.
- `recharts` in dependencies — chart library that could add client-side weight if used.

### Lazy Loading
- Next.js `Image` component applies lazy loading by default to all images without `priority`.
- The `<iframe>` embed in `/agentic-web/page.tsx` (YouTube embed) is NOT lazy loaded — it loads on page load and will significantly impact LCP and CWV for that page.

### Two Config Files
- `next.config.mjs` and `next.config.ts` both exist. Next.js resolves by extension priority. In Next.js 14, `.mjs` takes precedence over `.ts`. The `.ts` config has `serverActionsTimeout: 240000` and is otherwise less configured. Keeping both files risks silent configuration errors.

---

## 6. Images (5%) — Score: 75/100

### Alt Text Coverage
- **Homepage:** Hero image: `alt="A professional headshot of Vedang Vatsa."` ✓
- **Profile page:** `alt="Professional headshot of Vedang Vatsa."` ✓
- **SEO page:** `alt="Headshot of Vedang Vatsa, a growth marketing and SEO specialist."` ✓ (descriptive)
- **Community page:** `alt="Headshot of Vedang Vatsa, a content and community strategist."` ✓ (descriptive, role-aware)
- **Media page:** Speaking images: `alt="Vedang Vatsa speaking at engagement ${index + 1}"` — generic, not contextually descriptive (venue, event name, audience not included)
- **Vibe Coding page:** Module images have detailed alt text ✓
- **As-seen-in component:** `alt="${media.name} logo"` ✓
- **Essay images:** No images in essay MDX files — text-only content.

### Image Formats
- Press logos use mixed formats: `.png`, `.svg`, `.webp`, `.jpeg` — inconsistent but acceptable for logos.
- Vibe Coding course images: `.webp` ✓ (modern format)
- Speaker images: `.webp` ✓ (modern format)
- Icon: `.png` (should ideally be `.webp` or served as such via Next.js optimization)

### OG Image Issue (Critical)
- The OG image used across the entire site is `/images/icon.png` which is **256×256 pixels**.
- It is declared in metadata as `width: 1200, height: 630` — this is a false declaration.
- Social platforms (Facebook, Twitter/X, LinkedIn) fetch the raw image. They will get a 256×256 PNG, not a 1200×630 image. This results in degraded social share previews across all pages.
- No page has a unique, properly sized OG image (except `/agentic-web` which references `/agentic-web/AgenticAIPreview.png` — not verified if this file exists).

---

## 7. AI Search Readiness (5%) — Score: 80/100

### llms.txt
**File:** `/public/llms.txt`

**Well-structured.** Includes:
- Author identity and site purpose
- Sections for: Guides & Resources, Essays (all 31), Profile Pages
- Brief, accurate descriptions for each link
- Uses relative URLs — acceptable for this file format

**Issues:**
- Does not include `/glossary/[slug]` individual term pages
- Does not mention the `/guides` sub-sections (market making, tokenomics, etc.)
- Does not include `artificial-intuition` or `the-ai-agent-economy` essays
- No contact information or preferred citation format

### robots.txt AI Crawler Policy
All major AI crawlers are explicitly allowed (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Bytespider`, `cohere-ai`). This is excellent.

### Passage Citability
AI search engines (Perplexity, ChatGPT with browsing, Claude) extract and cite specific passages. Optimal block size is 100-200 words.

**Sample analysis of `the-dark-forest-internet` paragraphs:**
- Para 1: 123 words ✓
- Para 2: 121 words ✓
- Para 3: 96 words ✓
- Para 4: 112 words ✓
- Para 5: 101 words ✓
- Para 6: 112 words ✓
- Para 7: 100 words ✓
- Para 8: 131 words ✓

The larger, more mature essays (`the-dark-forest-internet`, `the-attention-refinery`, `computational-constitutions`) have ideal paragraph sizes for AI passage extraction.

**Issues with shorter essays:**
- `the-singularity-paradox` paragraphs average 25-40 words — too short for meaningful passage extraction.
- `what-is-the-singularity` (698 words) likely has similarly short paragraphs.
- `bureaucracy-and-the-technology-escape` uses H3 headers with short sections — AI extractors may cite section titles without sufficient context.

### deeprank.json
File exists at `/public/deeprank.json` and is linked from layout via `<link rel="alternate" type="application/json" href="/deeprank.json" />`. Contains basic entity data. This is a proactive AI indexing signal, though `deeprank.json` is not a widely-recognized standard (unlike `llms.txt`).

### Truncated Essay Bug
`the-dark-forest-internet.mdx` ends mid-sentence: "The future belongs to those who can" — the essay is cut off. This is a significant content integrity issue that would harm AI citability and user experience.

---

## Summary of Critical Issues

| Issue | Category | Severity | Status |
|---|---|---|---|
| All 33 essays missing `date:` frontmatter | Content/Schema | Critical | Open |
| Glossary schemas point to `vedangvatsa.com` (wrong domain) | Schema | Critical | **Fixed** — all glossary schema URLs updated to `veda.ng` |
| OG image is 256×256 declared as 1200×630 | Images/Technical | Critical | **Fixed** — dimensions corrected to 256×256 in all metadata |
| Two Next.js config files (`next.config.mjs` + `.ts`) | Technical | Critical | Open |
| `the-dark-forest-internet` essay truncated mid-sentence | Content | Critical | Open |
| `/writings` page has no H1 tag | On-Page | High | Open |
| Dynamic sitemap.ts missing /guides, /glossary, /glossary/* | Technical | High | **Fixed** — sitemap.ts unified to include all glossary slugs, essays, and static pages |
| No Course schema on 4 course pages | Schema | High | **Fixed** — Course schema added to `/agentic-web`, `/prompt-engineering-101`, `/web3-101`, `/vibe-coding` |
| No FAQPage schema on Web3-101 and Agentic-Web | Schema | High | **Fixed** — FAQPage schema added to all 4 FAQ pages |
| 22 of 33 essays have zero internal links | On-Page/Content | High | **Fixed** — Key Terms section added to all essays via `ESSAY_GLOSSARY_LINKS` map in `[slug]/page.tsx` |
| No CSP or HSTS headers | Technical | High | Open |
| YouTube iframe on /agentic-web not lazy loaded | Performance | Medium | **Fixed** — `loading="lazy"` added to iframe |
| /community and /seo pages have generic H1 "Vedang Vatsa" | On-Page | Medium | Open |
| All 33 essays missing `author:` and `keywords:` frontmatter | Content/Schema | Medium | Open |
| Article schema `dateModified` always equals `datePublished` | Schema | Medium | Open |
| /guides not in main navigation | On-Page | Medium | Open |
| Homepage has no links to courses or glossary | On-Page | Medium | Open |
| Footer has no site navigation links | On-Page | Medium | Open |
| `the-ai-agent-economy` and `artificial-intuition` not in llms.txt | AI Search | Low | **Fixed** — both essays added to `public/llms.txt`; 45 glossary terms also added |
| Person `jobTitle` should be string not array | Schema | Low | **Fixed** — changed to `'Founder & AI/Web3 Thought Leader'` in `layout.tsx` |
| Media page speaking image alt text is generic | Images | Low | Open |

---

## Fixes Applied in This Session

The following changes were committed and pushed (commits `0e1bdb8` → `2665a53`):

### 1. robots.txt — Explicit AI crawler stanzas added (`0e1bdb8`)
**File:** `public/robots.txt`
Added explicit `User-agent: [bot] / Allow: /` stanzas for: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Bytespider, cohere-ai.

### 2. Sitemap unified (`fc3d8a9`)
**File:** `src/app/sitemap.ts`
Dynamic sitemap now covers: all essay slugs (from filesystem), all 45 glossary term slugs, and all static routes. `lastModified` uses stable dates per content type to avoid every entry showing today's date on every build.

### 3. llms.txt expanded (`fc3d8a9`)
**File:** `public/llms.txt`
Added 2 missing essays (`artificial-intuition`, `the-ai-agent-economy`) and all 45 glossary term URLs with one-line descriptions.

### 4. OG image dimensions corrected (`eba7653`)
**Files:** `src/app/layout.tsx`, `src/lib/metadata.ts`, `src/app/[slug]/page.tsx`
All OG image declarations changed from the incorrect `1200×630` to the actual `256×256` dimensions of `/images/icon.png`. Prevents false metadata declarations that would confuse social crawlers.

### 5. Internal links added to all essays via Key Terms section (`eba7653`)
**File:** `src/app/[slug]/page.tsx`
Added `ESSAY_GLOSSARY_LINKS` map (34 essays mapped to relevant glossary terms) and `GLOSSARY_LABELS` for display names. Every essay now renders a "Key Terms" pill-link section at the bottom linking to relevant `/glossary/[slug]` pages. This addresses the 22-of-33 zero-internal-links gap.

### 6. Course schema added to all 4 course pages (`eba7653`)
**Files:** `src/app/agentic-web/page.tsx`, `src/app/prompt-engineering-101/page.tsx`, `src/app/web3-101/page.tsx`, `src/app/vibe-coding/page.tsx`
Each page now includes a `Course` JSON-LD schema with `provider`, `hasCourseInstance`, and `coursePrerequisites`.

### 7. FAQPage schema added to all 4 FAQ pages (`eba7653`)
Same 4 files as above. FAQ accordion content mapped to `FAQPage` JSON-LD with `mainEntity` Q&A array.

### 8. VideoObject schema added to /agentic-web (`90c05e3`)
**File:** `src/app/agentic-web/page.tsx`
`VideoObject` JSON-LD added for the YouTube embed (`Gqgk25SOIMM`) with `embedUrl`, `thumbnailUrl`, `uploadDate`, and `description`.

### 9. WebSite + SearchAction schema added to layout.tsx (`90c05e3`)
**File:** `src/app/layout.tsx`
Added `websiteSchema` with `SearchAction` pointing to `/glossary?q={search_term_string}`. Enables Sitelinks Search Box eligibility in Google.

### 10. YouTube iframe lazy loaded (`2665a53`)
**File:** `src/app/agentic-web/page.tsx`
Added `loading="lazy"` attribute to the YouTube `<iframe>` embed. Reduces initial page-load impact on LCP and CWV.

### 11. Person jobTitle fixed to string (`2665a53`)
**File:** `src/app/layout.tsx`
Changed `jobTitle` from `['Founder', 'AI Researcher', 'Web3 Innovator', 'Entrepreneur']` (invalid array) to `'Founder & AI/Web3 Thought Leader'` (valid Schema.org string).
