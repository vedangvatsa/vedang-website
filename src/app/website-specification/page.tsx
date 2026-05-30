import Link from 'next/link';

// ─── Spec Data ───────────────────────────────────────────────────────────────

type Status = 'Required' | 'Recommended' | 'Optional' | 'Avoid';

interface SpecItem {
  name: string;
  desc: string;
  status: Status;
  ref?: string;
}

interface SpecCategory {
  name: string;
  slug: string;
  tagline: string;
  items: SpecItem[];
}

const SPEC: SpecCategory[] = [
  {
    name: 'Foundations',
    slug: 'foundations',
    tagline: 'The HTML, head, and document basics every page needs.',
    items: [
      { name: 'HTML doctype', desc: 'Every document starts with <!doctype html>. Without it, browsers fall into quirks mode and layouts break.', status: 'Required', ref: 'https://html.spec.whatwg.org/multipage/syntax.html#the-doctype' },
      { name: 'lang attribute on <html>', desc: 'Set a valid BCP 47 language tag so screen readers, translators, and search engines know what language the page is in.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#language-of-page' },
      { name: '<meta charset="utf-8">', desc: 'Declare UTF-8 in the first 1024 bytes so browsers parse text correctly before hitting non-ASCII content.', status: 'Required', ref: 'https://html.spec.whatwg.org/multipage/semantics.html#charset' },
      { name: '<meta viewport>', desc: 'Tell mobile browsers to render at device width instead of pretending to be a 980px desktop. Never disable user scaling.', status: 'Required', ref: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag' },
      { name: '<title> element', desc: 'Exactly one non-empty <title> in <head>. Used by browsers, search engines, screen readers, social previews, and AI agents.', status: 'Required', ref: 'https://html.spec.whatwg.org/multipage/semantics.html#the-title-element' },
      { name: '<meta name="description">', desc: 'A short, unique page summary used by search engines as a snippet. A good description gets rewritten less often by Google.', status: 'Recommended', ref: 'https://developers.google.com/search/docs/appearance/snippet' },
      { name: 'Canonical URL', desc: 'Declare the preferred URL with rel="canonical" so search engines consolidate ranking signals when multiple URLs serve the same content.', status: 'Recommended', ref: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization' },
      { name: 'Favicons and app icons', desc: 'Ship an SVG favicon, an ICO fallback at /favicon.ico, apple-touch-icon, and a maskable PWA icon. Five files cover every surface.', status: 'Recommended', ref: 'https://web.dev/articles/monochrome-icons' },
      { name: '<meta name="theme-color">', desc: 'Tints browser chrome and OS surfaces to match your brand. Use the media attribute for separate light and dark mode colors.', status: 'Optional', ref: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color' },
      { name: '<meta name="color-scheme">', desc: 'Prevents the white flash dark-mode users see before CSS loads. Lets the browser style scrollbars and form controls to match.', status: 'Recommended', ref: 'https://web.dev/articles/color-scheme' },
      { name: 'Open Graph protocol', desc: 'Controls how pages look when shared on social platforms. Set og:title, og:description, og:image, og:url, and og:type on every page.', status: 'Recommended', ref: 'https://ogp.me/' },
      { name: 'Feed discovery', desc: 'If you publish RSS, Atom, or JSON Feed, announce it in <head> with <link rel="alternate">. Readers and agents discover it without guessing.', status: 'Optional', ref: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#alternate' },
      { name: 'Feed content hygiene', desc: 'Ship feeds well-formed: stable guids, atom:link rel="self", declared update cadence, and validate before deploy.', status: 'Optional' },
      { name: 'Popover API', desc: 'Replace JavaScript modals and tooltips with the native popover attribute. The browser handles opening, closing, and accessibility wiring.', status: 'Optional', ref: 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API' },
    ],
  },
  {
    name: 'SEO',
    slug: 'seo',
    tagline: 'Search visibility: robots.txt, sitemaps, canonicals, structured data.',
    items: [
      { name: 'robots.txt', desc: 'Plain-text file at the site root telling crawlers which paths they may fetch. Standardized in RFC 9309.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc9309' },
      { name: 'XML sitemaps', desc: 'Lists canonical URLs with lastmod metadata. The fastest way to tell search engines what exists on your site.', status: 'Recommended', ref: 'https://www.sitemaps.org/protocol.html' },
      { name: 'Sitemap index files', desc: 'A sitemap of sitemaps. Required when a site exceeds 50,000 URLs or wants to split by content type for cleaner reporting.', status: 'Optional' },
      { name: 'Image and video sitemap extensions', desc: 'Optional XML extensions adding media metadata. Useful when media loads via JavaScript or lives on a CDN crawlers cannot follow.', status: 'Optional' },
      { name: 'URL structure', desc: 'Lowercase, hyphenated, descriptive, shallow. URLs are a public API for your content. Treat them that way.', status: 'Required' },
      { name: 'Redirects (301/302/308)', desc: '301 or 308 for permanent moves, 302 or 307 for temporary. Never chain more than necessary.', status: 'Required' },
      { name: 'Soft 404s', desc: 'Pages that look like "not found" but return 200 OK. Search engines treat these as a quality problem and refuse to index them.', status: 'Avoid' },
      { name: 'Meta robots and X-Robots-Tag', desc: 'Explicit indexing policy on every page. Default index/follow on public pages, explicit noindex on staging, admin, and thin content.', status: 'Required' },
      { name: 'Heading hierarchy', desc: 'Headings form a nested outline. Never used for styling alone, never skip levels. One h1 per page.', status: 'Required' },
      { name: 'Internal linking', desc: 'The strongest signal you control for telling crawlers and AI agents what a page is about and how important it is.', status: 'Required' },
      { name: 'Structured data (JSON-LD)', desc: 'Machine-readable annotations using schema.org. JSON-LD is the format search engines and AI agents expect.', status: 'Recommended', ref: 'https://schema.org/' },
      { name: 'Breadcrumbs', desc: 'Visible trail showing page position in the hierarchy. Marked up as BreadcrumbList JSON-LD for search engines.', status: 'Recommended' },
      { name: 'IndexNow', desc: 'Push protocol telling Bing, Yandex, Naver, and Seznam that a URL changed. Google does not participate.', status: 'Optional', ref: 'https://www.indexnow.org/' },
    ],
  },
  {
    name: 'Accessibility',
    slug: 'accessibility',
    tagline: 'WCAG-aligned rules so people of all abilities can use the site.',
    items: [
      { name: 'Color contrast', desc: 'Text and meaningful non-text elements must have enough contrast against their background. WCAG AA requires 4.5:1 for normal text.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#contrast-minimum' },
      { name: 'Image alt text', desc: 'Every <img> has an alt attribute. Describes the image for screen readers, search engines, and broken image scenarios.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#non-text-content' },
      { name: 'Form labels', desc: 'Every form control needs a programmatically associated label. A placeholder is not a label.', status: 'Required' },
      { name: 'Keyboard navigation', desc: 'Every interactive element reachable and operable with keyboard alone, in logical order, with no focus traps.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#keyboard' },
      { name: 'Visible focus indicators', desc: 'Clear, high-contrast indicator on keyboard focus. Removing focus outlines without a replacement is a top accessibility failure.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#focus-visible' },
      { name: 'Skip links', desc: '"Skip to main content" as the first focusable element. Lets keyboard and screen reader users jump past repeated navigation.', status: 'Required' },
      { name: 'Semantic HTML and landmarks', desc: 'Use <header>, <nav>, <main>, <footer>. Assistive tech announces structure and lets users skip between regions.', status: 'Required', ref: 'https://www.w3.org/TR/wai-aria-practices-1.1/#landmark-regions' },
      { name: 'ARIA usage', desc: 'First rule of ARIA: do not use ARIA. Reach for native HTML elements first. Add ARIA only when nothing native fits.', status: 'Recommended', ref: 'https://www.w3.org/TR/using-aria/' },
      { name: 'Descriptive link text', desc: '"Click here" and "read more" fail screen reader users who navigate by jumping between links. Every link describes its destination.', status: 'Required' },
      { name: 'Empty links and buttons', desc: 'A control with no accessible name is invisible to screen readers. Icon-only controls without a label are the usual cause.', status: 'Avoid' },
      { name: 'Accessible form errors', desc: 'Errors identified in text, associated with the failing input, and announced to assistive technology.', status: 'Required' },
      { name: 'Document and parts language', desc: 'Set page language on <html lang>. Mark inline content in other languages with its own lang attribute.', status: 'Required' },
      { name: 'Reduced motion', desc: 'Respect prefers-reduced-motion. Decorative animation, parallax, and autoplay can trigger vestibular distress and seizures.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#animation-from-interactions' },
      { name: 'Accessibility overlays', desc: 'Third-party widgets claiming WCAG compliance at runtime. They do not work, harm screen reader users, and attract lawsuits.', status: 'Avoid', ref: 'https://overlayfactsheet.com/' },
      { name: 'Captions and transcripts', desc: 'Video needs synchronized captions. Audio needs a transcript. Auto-captions alone are not sufficient.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#captions-prerecorded' },
      { name: 'Accessible data tables', desc: 'Real <table> markup with caption, header cells, and scope attributes. Screen readers need row and column relationships.', status: 'Required' },
      { name: 'Touch target size', desc: 'WCAG 2.2 sets 24x24 CSS px minimum, 44x44 as enhanced. Controls must be large enough to tap reliably.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#target-size-minimum' },
      { name: 'Hidden until found', desc: 'Use hidden="until-found" for collapsible content so browser find-in-page and search engines can still reach the text.', status: 'Optional' },
      { name: 'Native interactive elements', desc: 'Prefer <button>, <a>, <details>/<summary>, <dialog> over divs with click handlers. Free keyboard support and semantics.', status: 'Required' },
      { name: 'CSS state selectors', desc: 'Use :has(), :user-invalid, :user-valid, :placeholder-shown, :focus-within for state in CSS. Removes class-toggling race conditions.', status: 'Recommended' },
    ],
  },
  {
    name: 'Security',
    slug: 'security',
    tagline: 'Headers, transport, and policies that keep visitors safe.',
    items: [
      { name: 'HTTPS and TLS', desc: 'Serve every page over HTTPS with TLS 1.2 or 1.3. Redirect plain HTTP to HTTPS. Disable obsolete SSL and early TLS.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc8446' },
      { name: 'HSTS', desc: 'Strict-Transport-Security tells browsers to use HTTPS only, for a long time. Add max-age, includeSubDomains, and preload.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc6797' },
      { name: 'Content Security Policy', desc: 'CSP tells browsers which sources of script, style, image, and frame content to trust. Stops most XSS and data-exfiltration attacks.', status: 'Required', ref: 'https://www.w3.org/TR/CSP3/' },
      { name: 'security.txt', desc: 'Standard file at /.well-known/security.txt for vulnerability reporting. Per RFC 9116.', status: 'Recommended', ref: 'https://www.rfc-editor.org/rfc/rfc9116' },
      { name: 'X-Content-Type-Options: nosniff', desc: 'Stops browsers from guessing content type. Blocks attacks where a benign file is interpreted as script.', status: 'Required' },
      { name: 'Clickjacking protection', desc: 'CSP frame-ancestors controls who can embed your pages in iframes. X-Frame-Options is the legacy fallback.', status: 'Required' },
      { name: 'Referrer-Policy', desc: 'Controls URL information leaked on navigation. strict-origin-when-cross-origin is the sensible default.', status: 'Recommended' },
      { name: 'Permissions-Policy', desc: 'Turn off browser features you do not use: camera, microphone, geolocation, payment, USB.', status: 'Recommended' },
      { name: 'Subresource Integrity', desc: 'Cryptographic hash on third-party scripts and stylesheets. Browser refuses to run modified files.', status: 'Recommended', ref: 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity' },
      { name: 'Cookie attributes', desc: 'Every cookie: Secure, HttpOnly where possible, explicit SameSite. Use __Host- and __Secure- prefixes for sessions.', status: 'Required' },
      { name: 'DNS CAA records', desc: 'Tells certificate authorities which of them may issue certificates for your domain. Blocks a class of mis-issuance attacks.', status: 'Recommended' },
      { name: 'DNSSEC', desc: 'Cryptographic signing of DNS records. Strong defense in depth, but requires full registrar and registry support.', status: 'Optional' },
    ],
  },
  {
    name: 'Well-Known URIs',
    slug: 'well-known',
    tagline: 'Standard paths under /.well-known/ for site-level metadata.',
    items: [
      { name: '/.well-known/ overview', desc: 'The /.well-known/ path prefix is standardized in RFC 8615. IANA keeps the registry of allowed names.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc8615' },
      { name: '/.well-known/change-password', desc: 'Redirect endpoint pointing password managers at your real change-password page. Only if the site has user accounts.', status: 'Optional' },
      { name: '/.well-known/openid-configuration', desc: 'OIDC discovery document. Only if you are an OpenID Connect identity provider.', status: 'Optional' },
      { name: '/.well-known/api-catalog', desc: 'RFC 9727. Machine-readable index of APIs and resources a host exposes, served as a Linkset JSON document.', status: 'Optional', ref: 'https://www.rfc-editor.org/rfc/rfc9727' },
      { name: '/.well-known/webfinger', desc: 'RFC 7033. Resolves account identifiers to links. The Fediverse uses it to discover ActivityPub actors.', status: 'Optional', ref: 'https://www.rfc-editor.org/rfc/rfc7033' },
      { name: 'Apple app-site-association', desc: 'JSON file telling iOS/macOS which apps handle which URLs. Required for Universal Links.', status: 'Optional' },
      { name: 'assetlinks.json', desc: 'Android Digital Asset Links. Proves app and web domain share ownership. Required for Android App Links.', status: 'Optional' },
      { name: '/.well-known/nodeinfo', desc: 'Discovery URI for federated platforms. Returns NodeInfo documents describing software, version, and statistics.', status: 'Optional' },
      { name: '/.well-known/traffic-advice', desc: 'JSON file controlling private prefetch proxies (Chrome). Optional opt-out or throttle mechanism.', status: 'Optional' },
    ],
  },
  {
    name: 'Agent Readiness',
    slug: 'agent-readiness',
    tagline: 'Making a site readable by AI agents and LLM crawlers.',
    items: [
      { name: 'Agent readiness overview', desc: 'Stable URLs, structured data, clean semantics, robots controls, and machine-readable endpoints: the full stack of AI discoverability.', status: 'Required' },
      { name: '/llms.txt', desc: 'Markdown file at the site root giving LLMs a curated index of your most important content. Emerging convention, not a ratified standard.', status: 'Recommended', ref: 'https://llmstxt.org/' },
      { name: '/llms-full.txt', desc: 'Extended companion to llms.txt that concatenates full markdown content of key pages into a single file.', status: 'Optional' },
      { name: 'Markdown source endpoints', desc: 'Expose every page as raw Markdown at a predictable URL (.md suffix or content negotiation). Agents pull source instead of parsing HTML.', status: 'Optional' },
      { name: 'robots.txt for AI crawlers', desc: 'Explicit allow/disallow per AI user-agent: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and others.', status: 'Recommended' },
      { name: 'Content Signals in robots.txt', desc: 'Content-Signal directives declaring whether AI crawlers may search, ingest, or train on content. Emerging IETF/IAB proposal.', status: 'Optional' },
      { name: 'Web Bot Auth', desc: 'Bot identity verification via RFC 9421 HTTP Message Signatures. Sites allow or block bots cryptographically, not by user-agent string.', status: 'Optional' },
      { name: 'Stable URLs', desc: 'URLs are public contracts. Breaking them invalidates citations, bookmarks, links, and agent caches. Almost always avoidable.', status: 'Required' },
      { name: 'Structured data for agents', desc: 'JSON-LD with schema.org types gives agents typed facts. Same markup search engines use, and agents rely on it equally.', status: 'Recommended' },
      { name: 'Machine-readable formats', desc: 'Offer JSON, RSS, or Markdown endpoints alongside HTML. Agents and feed readers prefer typed data over scraped HTML.', status: 'Recommended' },
      { name: 'HTTP Link headers', desc: 'Advertise llms.txt, sitemap, api-catalog, RSS directly in the HTTP response. Agents that never parse HTML can still discover resources.', status: 'Optional' },
      { name: 'MCP and tool discovery', desc: 'Model Context Protocol exposes queryable tools to agents over JSON-RPC. Relevant when content has structure worth filtering.', status: 'Optional', ref: 'https://modelcontextprotocol.io/' },
      { name: 'A2A agent cards', desc: 'Agent-to-Agent protocol discovery via /.well-known/agent-card.json. JSON-RPC interface for autonomous agent delegation.', status: 'Optional' },
      { name: 'Agent Skills discovery', desc: 'Well-known URI listing Agent Skills: short, scoped instructions an AI agent loads to work better with your site.', status: 'Optional' },
      { name: 'DNS for AI Discovery', desc: 'SVCB/HTTPS records under _agents.example.com for DNS-level agent service discovery. Pair with DNSSEC for authentication.', status: 'Optional' },
      { name: 'NLWeb', desc: 'Conversational interface discovery. An /ask-style endpoint via rel="nlweb" link, serving MCP-compatible JSON-RPC for natural language queries.', status: 'Optional' },
      { name: 'WebMCP', desc: 'Browser-native tool registration via navigator.modelContext JavaScript API. Turns a page into an agent surface without server-side MCP.', status: 'Optional' },
    ],
  },
  {
    name: 'Performance',
    slug: 'performance',
    tagline: 'Core Web Vitals, caching, images, fonts, network behavior.',
    items: [
      { name: 'Core Web Vitals', desc: 'LCP under 2.5s, INP under 200ms, CLS under 0.1. Measured at the 75th percentile of real users.', status: 'Required', ref: 'https://web.dev/articles/vitals' },
      { name: 'Image optimization', desc: 'Modern formats (WebP, AVIF), correct sizing for viewport, explicit width and height dimensions on every image.', status: 'Required' },
      { name: 'Lazy loading', desc: 'Native loading="lazy" for off-screen images, iframes, and video. Never on the LCP element.', status: 'Recommended' },
      { name: 'Preload, prefetch, preconnect', desc: 'Resource hints: preload the LCP image and critical fonts, preconnect to third-party origins, prefetch next navigation.', status: 'Recommended' },
      { name: 'Cache-Control headers', desc: 'immutable + max-age=31536000 for fingerprinted assets. Short or no-cache for HTML documents.', status: 'Required' },
      { name: 'No-Vary-Search', desc: 'Tells browsers that tracking/UTM query parameters do not change the response. Fewer fetches, better prefetch hits.', status: 'Optional' },
      { name: 'Compression', desc: 'Brotli where supported, gzip everywhere else. zstd is emerging. Do not compress already-compressed media.', status: 'Required' },
      { name: 'Web font loading', desc: 'Self-host WOFF2, subset aggressively, set font-display: swap. Preload only the critical face for above-the-fold content.', status: 'Recommended' },
      { name: 'Critical CSS', desc: 'Inline CSS for above-the-fold content, defer the rest. Render-blocking resources in <head> are the biggest cause of slow first paint.', status: 'Recommended' },
      { name: 'Script loading', desc: 'defer for app code, async for independent third-party, type=module for modern code. Bare <script> in <head> is always wrong.', status: 'Required' },
      { name: 'HTTP/2 and HTTP/3', desc: 'HTTP/2 minimum. HTTP/3 (QUIC) where possible. Multiplexing eliminates head-of-line blocking, QUIC removes TCP handshake delays.', status: 'Required' },
      { name: 'Speculation Rules', desc: 'Tell the browser which links to prefetch or prerender before the user clicks. Done well, navigations feel instant.', status: 'Optional', ref: 'https://developer.chrome.com/docs/web-platform/prerender-pages' },
      { name: 'View Transitions', desc: 'Animate between states or pages with CSS opt-in. Replaces ad-hoc SPA animation libraries with a platform primitive.', status: 'Optional' },
      { name: 'Back/forward cache', desc: 'Keep pages BFCache-eligible for instant back/forward navigation. No reload, no hydration, no repaint.', status: 'Recommended' },
      { name: 'content-visibility', desc: 'Skip layout and paint for off-screen content. Use with contain-intrinsic-size for stable scroll behavior.', status: 'Optional' },
      { name: 'CSS containment', desc: 'contain: layout paint style isolates reflow and repaint to a subtree. Performance gain on complex pages.', status: 'Optional' },
      { name: 'Scroll-driven animations', desc: 'Drive CSS animations from scroll position via scroll-timeline and view-timeline. Compositor-thread, no JS scroll listeners.', status: 'Optional' },
      { name: 'Scrollbar gutter', desc: 'scrollbar-gutter: stable reserves scrollbar space and stops horizontal layout shift between overflow states.', status: 'Optional' },
    ],
  },
  {
    name: 'Privacy',
    slug: 'privacy',
    tagline: 'Consent, signals, and respecting visitor choice.',
    items: [
      { name: 'Privacy policy', desc: 'What data you collect, why, on what legal basis, who you share with, how long you keep it, and what rights visitors have.', status: 'Required' },
      { name: 'Cookie consent', desc: 'In the EU/UK, non-essential cookies require freely given, informed, specific, unambiguous opt-in before being set.', status: 'Required' },
      { name: 'Global Privacy Control', desc: 'Browser-level opt-out signal. California and Colorado legally require sites to honor it.', status: 'Recommended', ref: 'https://globalprivacycontrol.org/' },
      { name: 'Third-party scripts', desc: 'Every external script can read cookies, see URLs, and exfiltrate data. Audit, justify, and lock them down.', status: 'Required' },
      { name: 'Privacy-respecting analytics', desc: 'Aggregate, cookieless, EU-hosted analytics answer most questions without ad-tech consent and transfer problems.', status: 'Recommended' },
      { name: 'Data minimization', desc: 'Collect only what you need for a specific purpose, keep it only as long as necessary, redact from logs and backups.', status: 'Required' },
    ],
  },
  {
    name: 'Resilience',
    slug: 'resilience',
    tagline: 'Graceful failure: error pages, offline support, redirects.',
    items: [
      { name: 'Custom error pages', desc: '404 and 500 pages must return correct HTTP status codes, explain the error in plain language, and offer a way forward.', status: 'Required' },
      { name: 'Maintenance pages (503)', desc: 'Return HTTP 503 with Retry-After header. Tell users what is happening and when to come back.', status: 'Recommended' },
      { name: 'Offline support', desc: 'Service worker serves a cached fallback when the network fails. Turns hard failures into graceful degradation.', status: 'Optional' },
      { name: 'Web app manifest', desc: 'JSON file telling browsers how the site appears when installed: name, icons, start URL, theme, display mode.', status: 'Optional', ref: 'https://www.w3.org/TR/appmanifest/' },
      { name: 'Monitoring and uptime', desc: 'Monitor from outside your infrastructure. Combine synthetic checks with real user data. Status page on a separate host.', status: 'Recommended' },
    ],
  },
  {
    name: 'Internationalisation',
    slug: 'i18n',
    tagline: 'Language, locale, direction, and translated content.',
    items: [
      { name: 'International URL structure', desc: 'Pick one pattern for multilingual content (ccTLD, subdomain, or subdirectory) and stick with it.', status: 'Required' },
      { name: 'hreflang', desc: 'Tells search engines which language/regional version to show which users. Must be reciprocal across all alternates.', status: 'Required', ref: 'https://developers.google.com/search/docs/specialty/international/localized-versions' },
      { name: 'Localized page metadata', desc: 'Translate title, meta description, Open Graph, JSON-LD names. A localized body with English metadata is a half-translation.', status: 'Required' },
      { name: 'hreflang in XML sitemaps', desc: 'Declare language alternates in sitemap with xhtml:link instead of HTML head. Easier to maintain at scale.', status: 'Recommended' },
      { name: 'Avoid auto geo-redirects', desc: 'IP-based language redirects trap users, break crawlers, and break shared links. Let users choose their language.', status: 'Avoid' },
      { name: 'Inline lang attributes', desc: 'Mark phrases in other languages with lang attributes so screen readers switch pronunciation correctly.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#language-of-parts' },
      { name: 'Language switcher', desc: 'List each locale in its own language. Do not use flags: flags are countries, not languages.', status: 'Recommended' },
      { name: 'RTL and bidirectional text', desc: 'Arabic, Hebrew, Persian, Urdu: set dir="rtl" and use CSS logical properties so layouts mirror correctly.', status: 'Required' },
      { name: 'Writing modes and CJK', desc: 'Vertical text needs CSS writing-mode. Chinese, Japanese, Korean, Thai need explicit line-break and word-break rules.', status: 'Optional' },
      { name: 'Locale-aware content', desc: 'Format dates, numbers, currency, units in user locale using Intl APIs in the browser and matching data server-side.', status: 'Recommended' },
      { name: 'Plural rules', desc: 'Use CLDR plural categories (zero, one, two, few, many, other) via Intl.PluralRules. Most languages do not pluralize like English.', status: 'Recommended' },
      { name: 'Internationalised Domain Names', desc: 'IDNs allow non-ASCII domain names. Encoded as Punycode on the wire, rendered as Unicode in the browser.', status: 'Optional' },
    ],
  },
];

const TOTAL_ITEMS = SPEC.reduce((sum, cat) => sum + cat.items.length, 0);

const STATUS_STYLES: Record<Status, string> = {
  Required: 'bg-red-50 text-red-700 border-red-200',
  Recommended: 'bg-blue-50 text-blue-700 border-blue-200',
  Optional: 'bg-gray-50 text-gray-600 border-gray-200',
  Avoid: 'bg-amber-50 text-amber-700 border-amber-200',
};

const STATUS_DOT: Record<Status, string> = {
  Required: 'bg-red-500',
  Recommended: 'bg-blue-500',
  Optional: 'bg-gray-400',
  Avoid: 'bg-amber-500',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function WebsiteSpecificationPage() {
  const statusCounts = {
    Required: SPEC.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'Required').length, 0),
    Recommended: SPEC.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'Recommended').length, 0),
    Optional: SPEC.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'Optional').length, 0),
    Avoid: SPEC.reduce((sum, cat) => sum + cat.items.filter(i => i.status === 'Avoid').length, 0),
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="pt-12 md:pt-20 pb-10 md:pb-14">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            The Website Specification
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {TOTAL_ITEMS} requirements across {SPEC.length} categories. Every technical feature a modern
            website needs, from &lt;!doctype html&gt; to AI agent readiness.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/ved.png"
                alt="Vedang Vatsa"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <div className="flex items-center gap-0 text-sm">
              <Link href="/profile" className="font-medium text-foreground hover:text-primary transition-colors">Vedang Vatsa</Link>
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="text-muted-foreground">May 2026</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-none">
          <div className="space-y-24 not-prose">

        {/* ── Why This Exists ── */}
        <section className="prose max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">Why This Exists</h2>
          <p className="text-muted-foreground leading-relaxed">
            The web is a layer cake of standards. WHATWG defines HTML. W3C ratifies WCAG. The IETF publishes
            RFCs for security headers and /.well-known/ URIs. IANA registers the namespaces. Search engines
            add their own rules. Browsers introduce quirks. Almost nobody carries the whole picture in their head.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This page collects the slices into one platform-agnostic reference. It is not a framework. It is not
            a tutorial. It describes outcomes and requirements, not implementations. You choose the tools;
            these are the goals they need to hit.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Every requirement is sourced from an official specification, RFC, or W3C recommendation.
            Where no formal standard exists, the spec says so.
          </p>
        </section>

        {/* ── At a Glance ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">At a Glance</h2>
          <p className="text-sm text-muted-foreground mb-8">Distribution of {TOTAL_ITEMS} requirements by priority level.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['Required', 'Recommended', 'Optional', 'Avoid'] as Status[]).map((status) => (
              <div key={status} className="rounded-lg border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                  <span className="text-sm font-medium">{status}</span>
                </div>
                <p className="text-3xl font-semibold tracking-tight">{statusCounts[status]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {status === 'Required' && 'The platform breaks without it'}
                  {status === 'Recommended' && 'Modern sites should do it'}
                  {status === 'Optional' && 'Depends on context'}
                  {status === 'Avoid' && 'Outdated or harmful'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Category Navigation ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Categories</h2>
          <p className="text-sm text-muted-foreground mb-6">Jump to a section or scroll through all {SPEC.length} categories below.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPEC.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors text-center"
              >
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{cat.items.length} items</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Spec Sections ── */}
        {SPEC.map((category) => (
          <section key={category.slug} id={category.slug}>
            <div className="mb-2">
              <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{category.tagline}</p>

            <div className="space-y-px rounded-lg overflow-hidden border">
              {category.items.map((item) => (
                <div key={item.name} className="bg-card flex items-start gap-4 p-4">
                  <div className="shrink-0 mt-0.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{item.name}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                  {item.ref && (
                    <Link
                      href={item.ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[11px] text-muted-foreground/60 hover:text-primary transition-colors"
                    >
                      source
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── How to Use This ── */}
        <section className="prose max-w-none">
          <h2 className="text-2xl font-semibold tracking-tight !mb-4">How to Use This</h2>
          <p className="text-muted-foreground leading-relaxed">
            Start with the Required items. Every site on the public web should pass them.
            Recommended items cover what users and search engines expect from a professional site in 2026.
            Optional items are context-dependent: a blog does not need OIDC discovery, but a SaaS product does.
            Avoid items are traps that look helpful but cause harm.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Use this as a launch checklist, a quarterly audit framework, or a contract specification.
            The categories are independent. You can hand the Security section to your infrastructure team and
            the Accessibility section to your front-end engineers without either group needing the other.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Where a requirement has a &quot;source&quot; link, it points to the official specification,
            RFC, or W3C recommendation. If no source is listed, the requirement is based on
            consistent browser behavior and industry consensus rather than a formal standard body document.
          </p>
        </section>

        {/* ── What This is Not ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">What This is Not</h2>
          <p className="text-sm text-muted-foreground mb-6">Setting expectations for what this reference does and does not do.</p>
          <div className="space-y-px rounded-lg overflow-hidden border">
            {[
              { label: 'Not platform-specific', desc: 'No "use this Next.js plugin" advice. The spec describes the outcome, you choose the implementation.' },
              { label: 'Not opinion', desc: 'Where there is no settled standard, the spec says so. No invented requirements.' },
              { label: 'Not exhaustive', desc: 'Web standards evolve weekly. This covers the high-impact requirements that affect real users and real search rankings.' },
              { label: 'Not a compliance guarantee', desc: 'Passing every item does not guarantee WCAG or GDPR compliance. Those require domain-specific legal and accessibility audits.' },
            ].map((row) => (
              <div key={row.label} className="bg-card flex items-start gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-48">{row.label}</span>
                <p className="flex-1 text-sm text-muted-foreground leading-relaxed min-w-0">{row.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Key Sources ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Key Sources</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The authoritative references behind the requirements listed above.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'WHATWG HTML Living Standard', url: 'https://html.spec.whatwg.org/' },
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
              { name: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' },
              { name: 'IETF RFCs', url: 'https://www.rfc-editor.org/' },
              { name: 'schema.org', url: 'https://schema.org/' },
              { name: 'Google Search Central', url: 'https://developers.google.com/search' },
              { name: 'web.dev', url: 'https://web.dev/' },
              { name: 'sitemaps.org', url: 'https://www.sitemaps.org/' },
              { name: 'llmstxt.org', url: 'https://llmstxt.org/' },
            ].map((source) => (
              <Link
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors block"
              >
                <span className="text-sm font-medium">{source.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-muted-foreground/60 text-center pb-4">
          Web standards evolve continuously. Last updated May 2026.
        </p>

          </div>
        </article>
      </div>
    </>
  );
}
