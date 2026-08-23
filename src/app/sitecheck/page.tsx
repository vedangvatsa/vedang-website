import Link from 'next/link';
import { AuthorByline } from '@/components/author-byline';

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = 'Required' | 'Recommended' | 'Optional' | 'Avoid';

interface SpecItem {
  name: string;
  what: string;
  how: string;
  status: Status;
  ref?: string;
}

interface SpecCategory {
  name: string;
  slug: string;
  items: SpecItem[];
}

// ─── Spec Data ───────────────────────────────────────────────────────────────
// Each item has: what (the requirement), how (specific implementation guidance)

const SPEC: SpecCategory[] = [
  {
    name: 'Foundations',
    slug: 'foundations',
    items: [
      { name: '<!doctype html>', what: 'First line of every HTML document. Triggers standards mode.', how: 'Without it, browsers enter quirks mode: box models break, CSS behaves differently, layouts fail silently.', status: 'Required', ref: 'https://html.spec.whatwg.org/multipage/syntax.html#the-doctype' },
      { name: '<html lang="...">', what: 'BCP 47 language tag on the root element.', how: 'Screen readers use this to pick the pronunciation engine. Google uses it for language detection. Translators use it to decide what to offer. Use lang="en", lang="fr", lang="ja", not lang="english".', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#language-of-page' },
      { name: '<meta charset="utf-8">', what: 'Character encoding declaration, must appear in the first 1024 bytes.', how: 'Place immediately after <head>. Without it, non-ASCII characters (accents, CJK, emoji) may render as garbled text. UTF-8 covers every writing system.', status: 'Required', ref: 'https://html.spec.whatwg.org/multipage/semantics.html#charset' },
      { name: '<meta name="viewport">', what: 'Tells mobile browsers to use the device width.', how: 'content="width=device-width, initial-scale=1". Without this, phones render pages at 980px and zoom out. Never set maximum-scale=1 or user-scalable=no - that breaks pinch-to-zoom for low-vision users.', status: 'Required', ref: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag' },
      { name: '<title>', what: 'Exactly one non-empty title per page.', how: 'Format: "Page Name - Site Name" or "Page Name | Site Name". Keep under 60 characters. This shows in browser tabs, search results, social shares, and screen reader announcements. Each page needs a unique title.', status: 'Required' },
      { name: '<meta name="description">', what: 'Page summary for search engine snippets.', how: '150-160 characters. Unique per page. Google may rewrite it, but a specific, accurate description gets rewritten less often. Include the primary keyword naturally.', status: 'Recommended', ref: 'https://developers.google.com/search/docs/appearance/snippet' },
      { name: 'rel="canonical"', what: 'Declares the preferred URL for duplicate/similar pages.', how: '<link rel="canonical" href="https://example.com/page">. Use the full absolute URL. Points to the version you want indexed when the same content lives at multiple URLs (www vs non-www, HTTP vs HTTPS, trailing slash variants).', status: 'Recommended', ref: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization' },
      { name: 'Favicons', what: 'SVG favicon + ICO fallback + apple-touch-icon + PWA icon.', how: '<link rel="icon" href="/favicon.svg" type="image/svg+xml"> for modern browsers. /favicon.ico at 32x32 for legacy. <link rel="apple-touch-icon" href="/apple-touch-icon.png"> at 180x180. Maskable 512x512 PNG for PWA manifest.', status: 'Recommended' },
      { name: '<meta name="color-scheme">', what: 'Prevents white flash before CSS loads for dark-mode users.', how: '<meta name="color-scheme" content="light dark">. Tells the browser to pre-paint the page background in the user\'s preferred color scheme. Add matching theme-color meta tags for browser chrome tinting.', status: 'Recommended', ref: 'https://web.dev/articles/color-scheme' },
      { name: 'Open Graph tags', what: 'Controls how pages appear when shared on social platforms.', how: 'og:title, og:description, og:image (1200x630px), og:url, og:type. Test with the Facebook Sharing Debugger and Twitter Card Validator. Without og:image, social shares look plain and get lower engagement.', status: 'Recommended', ref: 'https://ogp.me/' },
      { name: 'Feed discovery', what: 'Announce RSS/Atom/JSON feeds in <head>.', how: '<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml">. Feed readers and agents auto-discover this. If you publish content regularly, ship a feed.', status: 'Optional' },
      { name: 'Popover API', what: 'Native browser primitive for modals, tooltips, menus.', how: '<div popover>Content</div> <button popovertarget="my-popover">Open</button>. Browser handles opening, closing, light-dismiss, focus trapping, and Escape key. Replaces hundreds of lines of modal JavaScript.', status: 'Optional', ref: 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API' },
    ],
  },
  {
    name: 'SEO',
    slug: 'seo',
    items: [
      { name: 'robots.txt', what: 'Plain-text file at domain root controlling crawler access.', how: 'User-agent: *\\nAllow: /\\nSitemap: https://example.com/sitemap.xml. Place at /robots.txt. Standardized in RFC 9309. Disallow blocks crawling but not indexing - use noindex for that.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc9309' },
      { name: 'XML sitemap', what: 'Lists canonical URLs with lastmod dates.', how: 'Max 50,000 URLs per file, max 50MB uncompressed. Reference it from robots.txt. Submit to Google Search Console. Most frameworks generate this automatically - verify the output is correct.', status: 'Recommended', ref: 'https://www.sitemaps.org/protocol.html' },
      { name: 'URL structure', what: 'Lowercase, hyphenated, descriptive, shallow.', how: 'Good: /web3-101/smart-contracts. Bad: /page?id=47&cat=3. URLs are permanent public contracts. Changing them breaks bookmarks, citations, and agent caches. Plan them before launch.', status: 'Required' },
      { name: 'Redirects', what: '301/308 for permanent moves, 302/307 for temporary.', how: 'A 301 tells search engines to transfer all ranking signals to the new URL. A 302 keeps them on the old URL. Never chain more than 2 redirects. Audit old redirects annually.', status: 'Required' },
      { name: 'Soft 404s', what: 'Pages returning 200 OK for "not found" content.', how: 'Google Search Console reports these as errors. They dilute crawl budget and site quality. Your 404 page must return HTTP 404. Test: curl -sI https://yoursite.com/nonexistent | head -1 should show 404.', status: 'Avoid' },
      { name: 'Meta robots', what: 'Indexing policy per page.', how: 'Public pages: default index,follow (no tag needed). Staging, admin, thin content: <meta name="robots" content="noindex,nofollow">. HTTP alternative: X-Robots-Tag: noindex header.', status: 'Required' },
      { name: 'Heading hierarchy', what: 'One h1 per page, nested h2/h3/h4 outline.', how: 'h1 = page title. h2 = major sections. h3 = subsections. Never skip levels (h1 then h3). Never use headings for visual styling - use CSS classes instead.', status: 'Required' },
      { name: 'Internal linking', what: 'Links between your own pages.', how: 'The strongest ranking signal you control. Every important page should be reachable within 3 clicks from the homepage. Use descriptive anchor text, not "click here".', status: 'Required' },
      { name: 'JSON-LD structured data', what: 'Machine-readable page annotations using schema.org.', how: '<script type="application/ld+json">{...}</script>. Use Article for blog posts, FAQPage for FAQs, Product for products, BreadcrumbList for navigation, Person/Organization for identity. Validate at search.google.com/test/rich-results.', status: 'Recommended', ref: 'https://schema.org/' },
      { name: 'Breadcrumbs', what: 'Navigation trail showing page position in site hierarchy.', how: 'Visible in UI + marked up as BreadcrumbList JSON-LD. Google displays them in search results as clickable path segments. One of the highest-ROI structured data types.', status: 'Recommended' },
      { name: 'IndexNow', what: 'Push protocol for instant re-crawl notification.', how: 'One POST request to api.indexnow.org when a URL changes. Bing, Yandex, Naver, Seznam support it. Google ignores it (they rely on their own crawling). Free, no registration.', status: 'Optional', ref: 'https://www.indexnow.org/' },
    ],
  },
  {
    name: 'Accessibility',
    slug: 'accessibility',
    items: [
      { name: 'Color contrast', what: '4.5:1 ratio for normal text, 3:1 for large text (18px bold / 24px regular).', how: 'Check with Chrome DevTools (inspect element > contrast ratio) or webaim.org/resources/contrastchecker. Common failure: light gray text on white backgrounds. WCAG AA is the minimum; AAA requires 7:1.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#contrast-minimum' },
      { name: 'Image alt text', what: 'Every <img> gets an alt attribute.', how: 'Descriptive images: describe what you see ("Bar chart showing 40% growth in Q3"). Decorative images: alt="" (empty, not missing). Functional images (icons in buttons): describe the action ("Close", "Search").', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#non-text-content' },
      { name: 'Form labels', what: 'Every input has a programmatically associated <label>.', how: '<label for="email">Email</label> <input id="email" type="email">. Or wrap: <label>Email <input type="email"></label>. Placeholders disappear on input and are not labels. Screen readers announce the label when the field gets focus.', status: 'Required' },
      { name: 'Keyboard navigation', what: 'All interactive elements operable via keyboard alone.', how: 'Test: unplug your mouse, use Tab/Shift+Tab to move, Enter to activate, Escape to close. Focus must follow a logical order. No focus traps (except modals, which trap intentionally and release on close).', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#keyboard' },
      { name: 'Focus indicators', what: 'Visible outline on keyboard-focused elements.', how: 'Never use *:focus { outline: none } without a replacement. Safe default: :focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }. :focus-visible fires only on keyboard focus, not mouse clicks.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#focus-visible' },
      { name: 'Skip link', what: '"Skip to main content" as the first focusable element.', how: '<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a> before the <header>. Visually hidden until Tab is pressed. Saves keyboard users from tabbing through 30 nav links on every page.', status: 'Required' },
      { name: 'Semantic landmarks', what: 'Use <header>, <nav>, <main>, <footer>, <aside>.', how: 'One <main> per page. Screen readers let users jump between landmarks (Rotor on VoiceOver, Landmarks on NVDA). <div> has no semantic meaning - it tells assistive tech nothing.', status: 'Required' },
      { name: 'ARIA usage', what: 'Use native HTML elements before reaching for ARIA.', how: '<button> beats <div role="button" tabindex="0" onclick="...">. The native element gives you keyboard support, focus management, and click events for free. ARIA only when no native element fits (custom widgets, live regions).', status: 'Recommended', ref: 'https://www.w3.org/TR/using-aria/' },
      { name: 'Link text', what: 'Every link describes its destination.', how: 'Good: "Read the WCAG 2.2 color contrast guidelines". Bad: "Click here". Screen reader users navigate by pulling up a list of all links on the page - "click here" x20 is useless.', status: 'Required' },
      { name: 'Empty controls', what: 'Links and buttons with no accessible name.', how: 'Icon-only buttons need aria-label="Close" or visually hidden text inside: <button><svg .../><span class="sr-only">Close</span></button>. Without it, screen readers announce "button" with no context.', status: 'Avoid' },
      { name: 'Form error handling', what: 'Errors announced to assistive tech with field association.', how: 'On submit failure: move focus to the first error, associate error text with the field via aria-describedby, announce with role="alert" or aria-live="polite". Color alone is not enough - use text + icon.', status: 'Required' },
      { name: 'Reduced motion', what: 'Respect prefers-reduced-motion OS setting.', how: '@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } } Parallax, autoplay video, and decorative animation can trigger vestibular distress.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#animation-from-interactions' },
      { name: 'Accessibility overlays', what: 'Third-party widgets claiming one-line WCAG compliance.', how: 'AccessiBe, UserWay, AudioEye. They break screen readers, add legal liability, and the National Federation of the Blind has publicly opposed them. The only fix is fixing the actual code.', status: 'Avoid', ref: 'https://overlayfactsheet.com/' },
      { name: 'Captions', what: 'Synchronized captions on video, transcripts on audio.', how: 'YouTube auto-captions have 10-15% error rates. WCAG requires human-reviewed captions. Upload .vtt or .srt files. For audio-only content (podcasts), provide a text transcript.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#captions-prerecorded' },
      { name: 'Touch targets', what: '24x24 CSS px minimum, 44x44 recommended.', how: 'WCAG 2.2 Level AA. Common failure: inline text links in dense paragraphs, close-together icon buttons in toolbars. Add padding to increase the tap area without changing visual size.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#target-size-minimum' },
      { name: 'Native elements', what: 'Use <button>, <a>, <details>, <dialog> over <div onClick>.', how: '<button> gives you keyboard support (Enter + Space), focus management, and screen reader announcement for free. A <div> with a click handler gives you none of that without manual ARIA + tabindex + keydown handlers.', status: 'Required' },
    ],
  },
  {
    name: 'Security',
    slug: 'security',
    items: [
      { name: 'HTTPS + TLS', what: 'TLS 1.2+ on every page, HTTP redirected to HTTPS.', how: 'Free via Let\'s Encrypt. All major hosts (Vercel, Netlify, Cloudflare, Firebase) handle this automatically. Test: openssl s_client -connect example.com:443 should show TLSv1.2 or TLSv1.3.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc8446' },
      { name: 'HSTS', what: 'Strict-Transport-Security header.', how: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload. Once set with preload, browsers will never attempt HTTP for your domain. This is irreversible via hstspreload.org. Start with max-age=300 to test.', status: 'Required', ref: 'https://www.rfc-editor.org/rfc/rfc6797' },
      { name: 'CSP', what: 'Content-Security-Policy header.', how: 'Start with Content-Security-Policy-Report-Only: default-src \'self\' to find what breaks. Then enforce. A strict CSP blocks most XSS attacks. In Next.js: configure in next.config.mjs headers(). Common pain point: inline scripts need nonces.', status: 'Required', ref: 'https://www.w3.org/TR/CSP3/' },
      { name: 'X-Content-Type-Options', what: 'Prevent MIME type sniffing.', how: 'X-Content-Type-Options: nosniff. One header, one value, set-and-forget. Without it, browsers may interpret a .txt file as JavaScript.', status: 'Required' },
      { name: 'Frame protection', what: 'Prevent clickjacking via iframe embedding.', how: 'CSP: frame-ancestors \'none\' (no one embeds you) or frame-ancestors \'self\' (only your own domain). Legacy fallback: X-Frame-Options: DENY.', status: 'Required' },
      { name: 'Referrer-Policy', what: 'Control URL info leaked on navigation.', how: 'Referrer-Policy: strict-origin-when-cross-origin. Sends origin (https://example.com) to external sites, full URL only to same-origin. Protects paths with tokens or sensitive query strings.', status: 'Recommended' },
      { name: 'Permissions-Policy', what: 'Disable unused browser APIs.', how: 'Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(). Prevents injected scripts from accessing these APIs. List only the permissions you actually use.', status: 'Recommended' },
      { name: 'SRI', what: 'Subresource Integrity hashes on external scripts/styles.', how: '<script src="https://cdn.example.com/lib.js" integrity="sha384-..." crossorigin="anonymous">. Browser refuses to execute if the file hash changes. Generate: openssl dgst -sha384 -binary file.js | openssl base64 -A', status: 'Recommended', ref: 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity' },
      { name: 'security.txt', what: 'Vulnerability disclosure contact at /.well-known/security.txt.', how: 'Contact: mailto:security@example.com\\nExpires: 2027-01-01T00:00:00.000Z\\nPreferred-Languages: en. Per RFC 9116. Security researchers check this before going public with a vulnerability.', status: 'Recommended', ref: 'https://www.rfc-editor.org/rfc/rfc9116' },
      { name: 'Cookie hardening', what: 'Secure + HttpOnly + SameSite on every cookie.', how: 'Set-Cookie: __Host-session=abc123; Secure; HttpOnly; SameSite=Lax; Path=/. The __Host- prefix requires Secure, no Domain, Path=/. HttpOnly prevents JavaScript access. SameSite prevents CSRF.', status: 'Required' },
      { name: 'DNS CAA', what: 'Restrict which CAs can issue certs for your domain.', how: 'DNS record: example.com. CAA 0 issue "letsencrypt.org". Set via your DNS provider. Prevents a compromised CA from issuing unauthorized certificates for your domain.', status: 'Recommended' },
    ],
  },
  {
    name: 'Agent Readiness',
    slug: 'agent-readiness',
    items: [
      { name: '/llms.txt', what: 'Markdown index of your most important pages for LLMs.', how: '# Site Name\\n> One-line description.\\n\\n## Section\\n- [Page](URL): Description. Keep under 100 entries. Place at /llms.txt. Emerging convention via llmstxt.org, not a ratified standard. See our AI Discovery Standards page for full details.', status: 'Recommended', ref: 'https://llmstxt.org/' },
      { name: '/llms-full.txt', what: 'Full Markdown content of key pages concatenated into one file.', how: 'Practical for sites under ~500 pages. Gives LLMs complete context in a single request. Costs bandwidth but eliminates multi-page crawling. Regenerate on every deploy.', status: 'Optional' },
      { name: 'AI crawler rules', what: 'Explicit robots.txt rules per AI user-agent.', how: 'GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot, Google-Extended (Gemini training), CCBot (Common Crawl), Bytespider (ByteDance). Allow bots whose search products you want to appear in. Block training-only crawlers if you choose.', status: 'Recommended' },
      { name: 'Stable URLs', what: 'URLs are permanent contracts. Breaking them breaks everything.', how: 'When you must move a URL: set a 301 redirect and keep it running indefinitely. Agent caches, bookmarks, citations, and backlinks all reference the original URL. Cool URIs don\'t change (W3C, 1998).', status: 'Required' },
      { name: 'Structured data for agents', what: 'JSON-LD gives agents typed facts instead of guessing from prose.', how: 'Same schema.org markup search engines use. Article, Person, Organization, FAQPage, HowTo, Product. Agents extract structured fields (author, date, price) directly. No scraping needed.', status: 'Recommended' },
      { name: 'Machine-readable formats', what: 'JSON, RSS, or Markdown endpoints alongside HTML.', how: 'An /api/posts.json endpoint is more useful to an agent than scraping your blog listing page. Content negotiation (Accept: text/markdown) or .md URL suffixes both work.', status: 'Recommended' },
      { name: 'MCP server', what: 'Model Context Protocol - queryable tools for agents over JSON-RPC.', how: 'Publish a server card at /.well-known/mcp/server-card.json. Agents discover your tools and call them programmatically. Relevant when your content has structure worth filtering (product catalog, documentation, dataset).', status: 'Optional', ref: 'https://modelcontextprotocol.io/' },
      { name: 'A2A agent cards', what: 'Agent-to-Agent protocol for autonomous agent delegation.', how: '/.well-known/agent-card.json describes your agent\'s capabilities. Other agents find it and delegate tasks via JSON-RPC. Google-led specification. Relevant for sites that expose agentic behavior.', status: 'Optional' },
      { name: 'Agent Skills', what: 'Scoped instruction files that teach AI agents how to use your site.', how: '/.well-known/agent-skills/index.json lists SKILL.md files. Each Skill tells an agent when and how to query your content. Cloudflare-led proposal.', status: 'Optional' },
      { name: 'HTTP Link headers', what: 'Advertise resources in HTTP response headers.', how: 'Link: </llms.txt>; rel="alternate"; type="text/markdown", </sitemap.xml>; rel="sitemap". Agents that skip HTML parsing can still discover your machine-readable resources.', status: 'Optional' },
    ],
  },
  {
    name: 'Performance',
    slug: 'performance',
    items: [
      { name: 'Core Web Vitals', what: 'LCP < 2.5s, INP < 200ms, CLS < 0.1 at p75 of real users.', how: 'Measure at pagespeed.web.dev (lab) and Chrome UX Report (field data). Most sites fail on LCP (unoptimized hero images, render-blocking CSS) and CLS (images without width/height, late-loading web fonts).', status: 'Required', ref: 'https://web.dev/articles/vitals' },
      { name: 'Image optimization', what: 'WebP/AVIF, responsive sizes, explicit dimensions.', how: '<img src="hero.webp" width="1200" height="630" alt="..." loading="eager"> for LCP image. Use <picture> with AVIF + WebP + JPEG fallback. Always set width and height to prevent layout shift.', status: 'Required' },
      { name: 'Lazy loading', what: 'loading="lazy" on off-screen images and iframes.', how: 'Never on the LCP element (hero image, first visible image). The browser delays fetching until the element is near the viewport. For the LCP image, use loading="eager" and add <link rel="preload">.', status: 'Recommended' },
      { name: 'Resource hints', what: 'preload, preconnect, prefetch for critical resources.', how: '<link rel="preload" href="/hero.webp" as="image"> for LCP image. <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> for third-party fonts. Over-preloading is worse than not preloading - limit to 2-3 resources.', status: 'Recommended' },
      { name: 'Cache-Control', what: 'Long cache for hashed assets, short/no-cache for HTML.', how: 'Hashed files (app.a1b2c3.js): Cache-Control: public, max-age=31536000, immutable. HTML pages: Cache-Control: no-cache. Never cache HTML for a year - users will see stale content.', status: 'Required' },
      { name: 'Compression', what: 'Brotli for text, gzip as fallback.', how: 'Content-Encoding: br for HTML, CSS, JS, JSON, SVG. Do not compress JPEG, PNG, WOFF2, or video (already compressed). Most CDNs and hosts handle this automatically - verify with: curl -sI -H "Accept-Encoding: br" https://example.com | grep content-encoding', status: 'Required' },
      { name: 'Font loading', what: 'Self-hosted WOFF2, subsetted, font-display: swap.', how: 'Download from Google Fonts, self-host. Subset to Latin (or your needed character set) with pyftsubset. font-display: swap shows fallback text immediately. Preload only the one font used above the fold.', status: 'Recommended' },
      { name: 'Script loading', what: 'defer for app code, async for third-party, type=module for ESM.', how: 'Bare <script src="..."> in <head> blocks rendering. Always use defer (executes after parsing) or async (executes when ready). type="module" scripts are deferred by default.', status: 'Required' },
      { name: 'HTTP/2+', what: 'Multiplexed connections, QUIC if available.', how: 'HTTP/2 at minimum (all major hosts support it). HTTP/3 (QUIC) eliminates TCP head-of-line blocking. Check: curl -sI --http2 https://example.com | head -1 should show HTTP/2.', status: 'Required' },
      { name: 'Speculation Rules', what: 'Prerender likely next pages for instant navigation.', how: '<script type="speculationrules">{"prerender":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>. "moderate" = on hover, "conservative" = on click. Chromium only, progressive enhancement.', status: 'Optional', ref: 'https://developer.chrome.com/docs/web-platform/prerender-pages' },
      { name: 'BFCache', what: 'Back/forward cache for instant history navigation.', how: 'Avoid: unload listeners, Cache-Control: no-store on HTML, unclosed WebSockets. Test in Chrome DevTools > Application > Back/forward cache. Pages restored from BFCache load in 0ms.', status: 'Recommended' },
    ],
  },
  {
    name: 'Privacy',
    slug: 'privacy',
    items: [
      { name: 'Privacy policy', what: 'What you collect, why, who gets it, how long you keep it, user rights.', how: 'Required by law in the EU (GDPR), California (CCPA/CPRA), and most jurisdictions. Must be written in plain language. Update when your data practices change. Link from the footer of every page.', status: 'Required' },
      { name: 'Cookie consent', what: 'Opt-in before setting non-essential cookies (EU/UK).', how: 'Pre-checked boxes do not count as consent. Rejecting must be as easy as accepting (no dark patterns). Essential cookies (session, CSRF) do not need consent. Analytics cookies do.', status: 'Required' },
      { name: 'Global Privacy Control', what: 'Browser signal for "do not sell/share my data."', how: 'Check: navigator.globalPrivacyControl === true or the Sec-GPC: 1 request header. California (CCPA) and Colorado (CPA) legally require honoring this signal.', status: 'Recommended', ref: 'https://globalprivacycontrol.org/' },
      { name: 'Third-party script audit', what: 'Every external script can read cookies and exfiltrate data.', how: 'Audit every <script src="https://..."> quarterly. Remove scripts you no longer use. Lock remaining ones with CSP and SRI. A single compromised CDN script can steal every user\'s session.', status: 'Required' },
      { name: 'Cookieless analytics', what: 'Traffic data without personal data collection.', how: 'Plausible, Fathom, Umami, or Cloudflare Web Analytics. No cookies, no personal data, no GDPR consent banner needed. Google Analytics requires a consent mechanism in the EU.', status: 'Recommended' },
      { name: 'Data minimization', what: 'Collect only what you need, keep only as long as needed.', how: 'Do not log full IP addresses if you only need country-level geo. Set retention periods and enforce them. Redact PII from error logs. GDPR Article 5(1)(c) mandates this.', status: 'Required' },
    ],
  },
  {
    name: 'Resilience',
    slug: 'resilience',
    items: [
      { name: 'Custom error pages', what: '404 returns 404, 500 returns 500, both are helpful.', how: 'Explain the error in plain language. Link to homepage and search. Never return 200 OK for error pages (soft 404). Test: curl -sI https://yoursite.com/nonexistent should show 404, not 200.', status: 'Required' },
      { name: '503 + Retry-After', what: 'Planned maintenance response.', how: 'HTTP 503 with Retry-After: 3600 (seconds). Tells search engines the downtime is temporary - do not deindex. Without Retry-After, crawlers may return and still get 503, wasting crawl budget.', status: 'Recommended' },
      { name: 'Offline fallback', what: 'Service worker caches a fallback page.', how: 'Register a service worker that returns a cached "You\'re offline" page when fetch fails. Workbox makes this a 10-line setup. Users see a branded page instead of the browser\'s dinosaur.', status: 'Optional' },
      { name: 'Web app manifest', what: 'JSON file for installable PWA behavior.', how: 'manifest.webmanifest with name, short_name, icons (192px + 512px), start_url, display: "standalone", theme_color, background_color. Link from <head>: <link rel="manifest" href="/manifest.webmanifest">.', status: 'Optional', ref: 'https://www.w3.org/TR/appmanifest/' },
      { name: 'External monitoring', what: 'Uptime checks from outside your infrastructure.', how: 'UptimeRobot (free tier), Pingdom, Better Uptime. Combine synthetic checks (is the site up?) with Real User Monitoring (how fast is it for actual users?). Put the status page on a separate host.', status: 'Recommended' },
    ],
  },
  {
    name: 'Internationalisation',
    slug: 'i18n',
    items: [
      { name: 'URL pattern', what: 'Pick one: subdirectory (/fr/), subdomain (fr.example.com), or ccTLD (example.fr).', how: 'Subdirectories are simplest and recommended by Google. Do not mix patterns. Each language version needs its own URL - do not use cookies or JS to switch content on the same URL.', status: 'Required' },
      { name: 'hreflang', what: 'Tells search engines which language version to serve which users.', how: '<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">. Must be reciprocal: EN points to FR, FR points back to EN. Include hreflang="x-default" for the fallback version.', status: 'Required', ref: 'https://developers.google.com/search/docs/specialty/international/localized-versions' },
      { name: 'Localized metadata', what: 'Translate title, description, OG tags, JSON-LD - not just the body.', how: 'A French page with English <title> and og:description is a half-translation. Search engines and social platforms pull from metadata, not the body. Translate everything in <head>.', status: 'Required' },
      { name: 'No auto geo-redirects', what: 'IP-based language redirects break crawlers and VPN users.', how: 'Googlebot crawls from the US. A US-based redirect sends it to /en/ and it never sees /fr/. Users on VPNs get the wrong language. Show a banner suggesting the local version instead of forcing a redirect.', status: 'Avoid' },
      { name: 'Inline lang attributes', what: 'Mark foreign phrases so screen readers switch pronunciation.', how: '<span lang="ja">東京</span>. Without this, a screen reader using English pronunciation will try to read Japanese characters as English, producing nonsense.', status: 'Required', ref: 'https://www.w3.org/TR/WCAG22/#language-of-parts' },
      { name: 'Language switcher', what: 'List languages in their own names, never with flags.', how: '"Deutsch", "日本語", "العربية". Not "German 🇩🇪". Flags are countries, not languages. Which flag for Spanish - Spain, Mexico, Argentina? Which for English - US, UK, Australia?', status: 'Recommended' },
      { name: 'RTL support', what: 'dir="rtl" on <html> for Arabic, Hebrew, Persian, Urdu.', how: 'Use CSS logical properties: margin-inline-start instead of margin-left, padding-block-end instead of padding-bottom. Layouts mirror automatically. Do not hardcode left/right in CSS.', status: 'Required' },
      { name: 'Intl APIs', what: 'Format dates, numbers, currency per locale.', how: 'new Intl.NumberFormat("de-DE").format(1234.56) returns "1.234,56". new Intl.DateTimeFormat("ja-JP").format(date) returns "2026/5/31". Never hardcode date/number formats.', status: 'Recommended' },
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

// ─── Master Prompt ───────────────────────────────────────────────────────────

const MASTER_PROMPT = `You are auditing a website for compliance with modern web standards. I will give you a URL. For each item below, report PASS, FAIL (with the exact fix), or N/A.

My website URL: [PASTE YOUR URL]
My tech stack: [Next.js / Astro / plain HTML / etc.]

## Check these items:

### HTML Foundations
- [ ] <!doctype html> as first line
- [ ] <html lang="..."> with valid BCP 47 tag
- [ ] <meta charset="utf-8"> in first 1024 bytes
- [ ] <meta name="viewport" content="width=device-width, initial-scale=1">
- [ ] Unique, descriptive <title> under 60 chars
- [ ] <meta name="description"> under 160 chars, unique per page
- [ ] <link rel="canonical"> with absolute URL
- [ ] Favicon SVG + ICO fallback + apple-touch-icon
- [ ] <meta name="color-scheme" content="light dark">
- [ ] Open Graph tags: og:title, og:description, og:image (1200x630), og:url, og:type

### SEO
- [ ] /robots.txt exists and references sitemap
- [ ] /sitemap.xml exists and is valid XML
- [ ] URLs are lowercase, hyphenated, descriptive
- [ ] 404 page returns HTTP 404 (not 200)
- [ ] One h1 per page, heading hierarchy never skips levels
- [ ] JSON-LD structured data (Article, FAQPage, BreadcrumbList, etc.)
- [ ] Internal links use descriptive anchor text

### Accessibility
- [ ] Color contrast 4.5:1 for normal text, 3:1 for large text
- [ ] Every <img> has alt text (decorative images: alt="")
- [ ] Every form input has a <label>
- [ ] All interactive elements keyboard-accessible (Tab, Enter, Escape)
- [ ] Visible focus indicators on keyboard focus
- [ ] Skip link as first focusable element
- [ ] Semantic landmarks: <header>, <nav>, <main>, <footer>
- [ ] No links or buttons without accessible names
- [ ] @media (prefers-reduced-motion: reduce) disables animations
- [ ] Touch targets at least 24x24 CSS px

### Security Headers (check with: curl -sI [URL])
- [ ] Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
- [ ] Content-Security-Policy (not just Report-Only)
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy disabling unused APIs
- [ ] frame-ancestors 'none' or 'self' in CSP

### Agent Readiness
- [ ] /llms.txt exists with structured content index
- [ ] robots.txt has rules for GPTBot, ClaudeBot, PerplexityBot
- [ ] JSON-LD structured data on every content page
- [ ] Stable URLs (no breaking changes without 301 redirects)

### Performance
- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Images in WebP/AVIF with width and height attributes
- [ ] loading="lazy" on off-screen images (NOT on LCP image)
- [ ] Cache-Control: immutable on hashed assets, no-cache on HTML
- [ ] Brotli compression on text responses
- [ ] Scripts use defer, async, or type="module" (no bare <script> in <head>)
- [ ] HTTP/2 or HTTP/3

### Privacy
- [ ] Privacy policy linked from footer
- [ ] Cookie consent before non-essential cookies (EU/UK)
- [ ] Global Privacy Control signal respected
- [ ] No unused third-party scripts

### Resilience
- [ ] Custom 404 page returning HTTP 404
- [ ] Custom 500 page returning HTTP 500

After the audit, provide:
1. A prioritized list of failures, grouped by severity
2. The exact code or config to fix each failure
3. Verification commands to confirm each fix`;

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
      <header className="pt-12 md:pt-20 pb-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            The Site Checklist
          </h1>

          {/* Semantic definition block for AI engines */}
          <div className="sr-only">
            <h2>What is The Site Checklist?</h2>
            <p>
              The Site Checklist is an exhaustive technical specification of modern web standards, structured data requirements, security protocols, performance optimizations, and AI discoverability best practices for production web applications.
            </p>
          </div>

          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {TOTAL_ITEMS} requirements across {SPEC.length} categories.<br />
            What to do, how to do it, and where the standard lives.
          </p>
          <AuthorByline links={[{ label: 'May 2026' }]} />
        </div>
      </header>

      <div className="py-10 md:py-14">
        <article className="notion-article prose prose-lg prose-neutral max-w-4xl mx-auto">
          <div className="space-y-20 not-prose">

        {/* ── Stats ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['Required', 'Recommended', 'Optional', 'Avoid'] as Status[]).map((status) => (
              <div key={status} className="rounded-lg border bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[status]}`} />
                  <span className="text-sm font-medium">{status}</span>
                </div>
                <p className="text-3xl font-semibold tracking-tight">{statusCounts[status]}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {status === 'Required' && 'Breaks without it'}
                  {status === 'Recommended' && 'Expected in 2026'}
                  {status === 'Optional' && 'Context-dependent'}
                  {status === 'Avoid' && 'Causes harm'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Master Prompt ── */}
        <section id="master-prompt">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Master Prompt</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Copy this prompt, paste it into ChatGPT / Claude / Gemini with your site URL, and get a full audit with fixes.
          </p>
          <div className="rounded-lg overflow-hidden border">
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Paste into any AI - replace [PASTE YOUR URL] and [tech stack]</span>
            </div>
            <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed bg-card max-h-[400px] overflow-y-auto">
              <code>{MASTER_PROMPT}</code>
            </pre>
          </div>
        </section>

        {/* ── Quick Verification ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Quick Verification</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Run against your live site. Replace example.com with your domain.
          </p>
          <div className="terminal-chrome rounded-lg overflow-hidden border">
            <div className="terminal-chrome-bar px-4 py-2 flex items-center gap-2">
              <span className="text-xs font-medium">Terminal</span>
            </div>
            <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed">
              <code>{`# Security headers
curl -sI https://example.com | grep -iE "strict-transport|content-security|x-content-type|referrer-policy|permissions-policy"

# Soft 404 check (should return 404, not 200)
curl -sI https://example.com/this-page-does-not-exist | head -1

# robots.txt and llms.txt
curl -s https://example.com/robots.txt | head -10
curl -sI https://example.com/llms.txt | grep "200"

# HTTP version (should show HTTP/2 or HTTP/3)
curl -sI --http2 https://example.com | head -1

# Compression (should show br or gzip)
curl -sI -H "Accept-Encoding: br,gzip" https://example.com | grep -i content-encoding

# TLS version
echo | openssl s_client -connect example.com:443 2>/dev/null | grep "Protocol"

# DNS CAA records
dig CAA example.com +short

# Structured data validation
# https://search.google.com/test/rich-results?url=https://example.com

# Full security header audit
# https://securityheaders.com/?q=example.com`}</code>
            </pre>
          </div>
        </section>

        {/* ── Category Navigation ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Full Specification</h2>
          <p className="text-sm text-muted-foreground mb-6">{SPEC.length} categories. Click any item to see implementation details.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPEC.map((cat) => (
              <a key={cat.slug} href={`#${cat.slug}`} className="rounded-lg border bg-card p-3 hover:border-primary/50 transition-colors text-center">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{cat.items.length} items</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── Spec Categories ── */}
        {SPEC.map((category) => (
          <section key={category.slug} id={category.slug}>
            <h2 className="text-2xl font-semibold tracking-tight mb-6">{category.name}</h2>
            <div className="space-y-px rounded-lg overflow-hidden border">
              {category.items.map((item) => (
                <details key={item.name} className="bg-card group">
                  <summary className="flex items-start gap-4 p-4 cursor-pointer select-none hover:bg-muted/30 transition-colors">
                    <div className="shrink-0 mt-0.5">
                      <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm">{item.name}</span>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">{item.what}</p>
                    </div>
                    <svg className="w-4 h-4 shrink-0 mt-1 text-muted-foreground/40 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </summary>
                  <div className="px-4 pb-4 pt-1 ml-[72px] sm:ml-[76px]">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.how}</p>
                    {item.ref && (
                      <Link href={item.ref} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-muted-foreground/60 hover:text-primary transition-colors">
                        Official specification ↗
                      </Link>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* ── Related ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Related</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/aistandards" className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block">
              <span className="font-medium text-sm">AI Discovery Standards</span>
              <p className="text-sm text-muted-foreground mt-1">
                llms.txt, structured data for agents, robots.txt AI crawler rules, MCP endpoints, and agent skill files.
              </p>
            </Link>
            <Link href="/agentic" className="rounded-lg border bg-card p-5 hover:border-primary/50 transition-colors block">
              <span className="font-medium text-sm">The Agentic Web</span>
              <p className="text-sm text-muted-foreground mt-1">
                How autonomous AI agents interact with the web, and what your site needs to be ready for them.
              </p>
            </Link>
          </div>
        </section>

        {/* ── Sources ── */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Sources</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'WHATWG HTML', url: 'https://html.spec.whatwg.org/' },
              { name: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' },
              { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
              { name: 'web.dev', url: 'https://web.dev/' },
              { name: 'IETF RFCs', url: 'https://www.rfc-editor.org/' },
              { name: 'schema.org', url: 'https://schema.org/' },
              { name: 'Google Search Central', url: 'https://developers.google.com/search' },
              { name: 'securityheaders.com', url: 'https://securityheaders.com/' },
            ].map((s) => (
              <Link key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border bg-card px-4 py-3 hover:border-primary/50 transition-colors block text-sm font-medium">
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        <p className="text-xs text-muted-foreground/60 text-center">Last updated May 2026.</p>

          </div>
        </article>
      </div>
    </>
  );
}
