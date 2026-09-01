'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { CodeBlock } from '@/components/ui/code-block';
import { SectionHeader } from '@/components/ui/section-header';
import { copyText } from '@/lib/copy-text';
import { cn } from '@/lib/utils';
import { ScanResult, CheckResult, LayerScore } from '@/lib/scanner/types';

// ─── Presets & Constants ───────────────────────────────────────────────────

const PRESETS = [
  { name: 'veda.ng', url: 'https://veda.ng' },
  { name: 'stripe.com', url: 'https://stripe.com' },
  { name: 'github.com', url: 'https://github.com' },
  { name: 'anthropic.com', url: 'https://anthropic.com' },
  { name: 'cloudflare.com', url: 'https://cloudflare.com' },
];

const SCAN_STEPS = [
  'Probing robots.txt AI bot rules & crawler policies...',
  'Checking llms.txt, llms-full.txt, and ARD catalogs...',
  'Evaluating markdown content negotiation & URL twins...',
  'Inspecting no-JS fallback and SSR payload...',
  'Testing Model Context Protocol (MCP) endpoints...',
  'Auditing OpenAPI schemas & parameter examples...',
  'Verifying HTTPS, HSTS, CSP, and security disclosures...',
  'Inspecting JSON-LD entity graph & structured feeds...',
  'Checking micropayments & x402 payment headers...',
  'Aggregating 0–100 Agentic Readiness Score...',
];

const AUDIT_LAYERS_INFO = [
  { name: 'Discovery (13 Probes)', desc: 'robots.txt AI bot policies, llms.txt, ARD v0.91, RFC 9727 API Catalog, agents.txt, XML/JSON sitemaps' },
  { name: 'Access (9 Probes)', desc: 'Markdown content negotiation (Accept: text/markdown), .md twins, robots meta AI directives, SSR no-JS fallback, rate limits' },
  { name: 'Usability & MCP (10 Probes)', desc: 'Streamable MCP servers, OpenAPI 3.1 schema & examples, auth guides, RFC 8414 OAuth, TDMRep rights' },
  { name: 'Security (11 Probes)', desc: 'HTTPS, HSTS preload, CSP, nosniff, frame protection, RFC 9116 security.txt, RFC 9421 signatures' },
  { name: 'SEO & Citations (15 Probes)', desc: 'Title/Meta tags, JSON-LD @graph schemas, E-E-A-T sameAs links, inverted pyramid Q&A, favicons, RSS feeds' },
  { name: 'Micropayments (3 Probes)', desc: 'L402 / HTTP 402 macaroons, WebLN wallet discovery, machine terms of service' },
];

const LAYER_LABELS: Record<string, string> = {
  all: 'All Checks',
  discovery: 'Discovery',
  access: 'Access',
  usability: 'Usability & MCP',
  security: 'Security',
  seo: 'SEO & Structured Data',
  payments: 'Micropayments',
};

const BASELINE_MASTER_PROMPT = `You are an expert full-stack engineer and AI web readiness architect.
Audit and upgrade our web application to achieve 100/100 readiness on the Agentic Readiness Scanner (https://veda.ng/scan).

Our website URL: [PASTE YOUR URL]
Our tech stack: [e.g. Next.js / Astro / Remix / Django / FastAPI / Express / Laravel]

Please implement the following 6 layers of machine-readiness upgrades in our codebase:
1. DISCOVERY LAYER:
   - Add a permissive /robots.txt differentiating training bots (CCBot) from search/answer bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot).
   - Generate a concise /llms.txt and full-text /llms-full.txt digest.
   - Add /.well-known/agents.json, /.well-known/api-catalog (RFC 9727), and /.well-known/ard.json (ARD v0.91).
   - Reference canonical XML sitemaps in robots.txt.

2. ACCESS & RENDERING LAYER:
   - Implement Markdown content negotiation: return clean Markdown when receiving header 'Accept: text/markdown'.
   - Ensure initial SSR HTML contains complete, self-sufficient semantic text without requiring JavaScript execution.
   - Add standard RateLimit-* and Sunset headers on all API endpoints.

3. USABILITY & MCP LAYER:
   - Expose a Streamable HTTP MCP (Model Context Protocol) server at /.well-known/mcp supporting JSON-RPC 2.0.
   - Publish a 100% typed OpenAPI 3.1 schema at /openapi.json with concrete request/response examples.
   - Provide a machine-readable authentication specification at /auth.md.

4. SECURITY LAYER:
   - Enforce HTTPS, HSTS preload (max-age=63072000; includeSubDomains; preload), and strict CSP.
   - Publish cryptographic security contact info at /.well-known/security.txt (RFC 9116).

5. SEO & CITATIONS LAYER:
   - Embed complete JSON-LD @graph structured data (Organization, WebSite, Article/TechArticle) with E-E-A-T sameAs profile links.
   - Structure articles with answer-first inverted pyramid headings (h1 -> h2 -> h3).
   - Publish an active RSS/Atom feed at /feed.xml.

6. MICROPAYMENTS & ACTION LAYER:
   - Add L402 / HTTP 402 payment headers or machine terms of service at /terms-of-use.md.

Provide the exact code files, server configuration, and curl commands to verify each check.`;

function generateCheckPrompt(check: CheckResult, domain: string): string {
  let p = `You are an expert full-stack developer fixing an agentic readiness issue on ${domain}.\n\n`;
  p += `### Issue: [${check.layer.toUpperCase()}] ${check.name}\n`;
  p += `- Status: ${check.status.toUpperCase()}\n`;
  p += `- Current Finding: ${check.details}\n`;
  if (check.why) p += `- Why this matters for AI/LLMs: ${check.why}\n`;
  if (check.recommendation) p += `- Recommended Fix: ${check.recommendation}\n`;
  if (check.fixSnippet) {
    p += `\n### Reference Implementation Snippet (${check.fixSnippet.filename || check.fixSnippet.language || 'code'}):\n\`\`\`${check.fixSnippet.language || ''}\n${check.fixSnippet.code}\n\`\`\`\n`;
  }
  if (check.referenceUrl) p += `\n- Technical Specification: ${check.referenceUrl}\n`;
  p += `\n### Instructions:\n`;
  p += `1. Review our codebase and identify where to apply this configuration or source code.\n`;
  p += `2. Implement the fix cleanly and verify there are no syntax, lint, or build errors.\n`;
  p += `3. Provide verification curl commands to test against the live endpoint.`;
  return p;
}

function generateLayerPrompt(layer: LayerScore, domain: string): string {
  const failing = layer.checks.filter(c => c.status === 'fail');
  const warnings = layer.checks.filter(c => c.status === 'warning');

  let p = `You are an expert engineer resolving ${layer.name} layer issues for ${domain} identified by the Agentic Readiness Scanner (https://veda.ng/scan).\n\n`;
  p += `### Layer: ${layer.name} (Current Score: ${layer.score}/${layer.maxScore} - ${layer.percentage}%)\n`;
  p += `Overview: ${layer.description}\n\n`;

  if (failing.length > 0) {
    p += `#### Critical Failures (${failing.length}):\n`;
    failing.forEach((c, idx) => {
      p += `\n${idx + 1}. ${c.name}\n`;
      p += `   - Issue: ${c.details}\n`;
      if (c.why) p += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) p += `   - Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) {
        p += `   - Snippet (${c.fixSnippet.filename || c.fixSnippet.language}):\n\`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
      }
    });
  }

  if (warnings.length > 0) {
    p += `\n#### Recommended Improvements (${warnings.length}):\n`;
    warnings.forEach((c, idx) => {
      p += `\n${idx + 1}. ${c.name}\n`;
      p += `   - Issue: ${c.details}\n`;
      if (c.why) p += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) p += `   - Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) {
        p += `   - Snippet (${c.fixSnippet.filename || c.fixSnippet.language}):\n\`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
      }
    });
  }

  if (failing.length === 0 && warnings.length === 0) {
    p += `\nAll checks in this layer are passing! Maintain compliance with regular automated tests.\n`;
  }

  p += `\n### Instructions:\n1. Apply the static files and server headers to resolve these issues.\n2. Ensure full compatibility with our application framework.\n3. Provide verification curl commands to test against the live deployment.`;
  return p;
}

function generateFixPrompt(result: ScanResult): string {
  const failing = result.layers.flatMap(l => l.checks).filter(c => c.status === 'fail');
  const warnings = result.layers.flatMap(l => l.checks).filter(c => c.status === 'warning');

  let prompt = `You are an expert full-stack engineer and AI web readiness architect.
Our website (${result.url}) was audited on the Agentic Readiness Scanner (https://veda.ng/scan) with a score of ${result.score}/100 (Grade ${result.grade}).

Your objective is to update our codebase, server response headers, and static files to achieve a 100/100 score for autonomous AI agents, LLM answer engines (SearchGPT, Claude, Perplexity), and MCP clients.

---
### SUMMARY OF AUDIT FINDINGS:
- Target Domain: ${result.domain}
- Current Score: ${result.score}/100 (Grade ${result.grade})
- Issues to resolve: ${failing.length} Failures, ${warnings.length} Warnings

---
### ACTION ITEMS & REMEDIATION SPECIFICATIONS:
`;

  if (failing.length > 0) {
    prompt += `\n#### 🔴 CRITICAL FAILURES (${failing.length}):\n`;
    failing.forEach((c, idx) => {
      prompt += `\n${idx + 1}. [${c.layer.toUpperCase()}] ${c.name}\n`;
      prompt += `   - Issue: ${c.details}\n`;
      if (c.why) prompt += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) prompt += `   - Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) {
        prompt += `   - Code/Config snippet (${c.fixSnippet.filename || c.fixSnippet.language || 'code'}):\n\`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
      }
    });
  }

  if (warnings.length > 0) {
    prompt += `\n#### 🟡 RECOMMENDED IMPROVEMENTS & WARNINGS (${warnings.length}):\n`;
    warnings.forEach((c, idx) => {
      prompt += `\n${idx + 1}. [${c.layer.toUpperCase()}] ${c.name}\n`;
      prompt += `   - Issue: ${c.details}\n`;
      if (c.why) prompt += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) prompt += `   - Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) {
        prompt += `   - Code/Config snippet (${c.fixSnippet.filename || c.fixSnippet.language || 'code'}):\n\`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
      }
    });
  }

  if (failing.length === 0 && warnings.length === 0) {
    prompt += `\n🎉 All 61 checks passed! Maintain your agentic readiness by running regular CI/CD checks against https://veda.ng/api/v1/scan.\n`;
  }

  prompt += `
---
### IMPLEMENTATION INSTRUCTIONS:
1. Review the existing codebase and detect our tech stack (e.g. Next.js, Astro, Remix, Django, FastAPI, Laravel, Express, etc.).
2. Apply the exact static files (e.g. /robots.txt, /llms.txt, /llms-full.txt, /.well-known/agents.json, /.well-known/api-catalog, /.well-known/security.txt) in the public/static folder.
3. Configure server response headers (Content-Security-Policy, HSTS, X-Content-Type-Options, RateLimit headers, and Markdown content negotiation for Accept: text/markdown).
4. Implement or expose the Model Context Protocol (MCP) endpoint if applicable.
5. Provide verification curl commands to confirm each fix after deploying.`;

  return prompt;
}

// ─── Minimal Icons (Pure SVGs) ─────────────────────────────────────────────

function IconSearch({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconCheck({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconCopy({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function IconSparkles({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    </svg>
  );
}

function IconChevronDown({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconExternalLink({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function IconArrowRight({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconRefresh({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

// ─── Individual Check Item ─────────────────────────────────────────────────

function CheckRow({ check, domain, defaultExpanded = false }: { check: CheckResult; domain: string; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const hasDetails = Boolean(check.why || check.recommendation || check.fixSnippet || check.referenceUrl);

  const handleCopyCheckPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = generateCheckPrompt(check, domain);
    copyText(prompt).catch(() => {});
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="border border-border rounded-lg bg-card transition-colors hover:border-primary/40">
      <div
        className={cn(
          'p-4 sm:p-5 flex items-start justify-between gap-4',
          hasDetails && 'cursor-pointer select-none'
        )}
        onClick={() => hasDetails && setExpanded(!expanded)}
        role={hasDetails ? 'button' : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
      >
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={check.status} />
            <span className="font-semibold text-sm sm:text-base text-foreground tracking-tight">
              {check.name}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {check.layer}
            </span>
            {check.impact && (
              <StatusPill status={check.impact} />
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {check.details}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            {check.status === 'na'
              ? 'N/A'
              : check.impact === 'optional'
              ? (check.score > 0 ? `+${check.score} Bonus` : 'Optional')
              : `${check.score}/${check.maxScore}`}
          </span>
          {hasDetails && (
            <div className={cn('text-muted-foreground transition-transform duration-150', expanded && 'rotate-180')}>
              <IconChevronDown className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="border-t border-border px-4 sm:px-5 py-4 space-y-4 bg-muted/15 text-xs sm:text-sm">
          {check.why && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground">
                Rationale
              </span>
              <p className="text-muted-foreground leading-relaxed">{check.why}</p>
            </div>
          )}

          {check.recommendation && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-foreground">
                How to Fix
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {check.recommendation}
              </p>
            </div>
          )}

          {check.fixSnippet && (
            <div className="space-y-1.5 pt-1">
              <CodeBlock
                code={check.fixSnippet.code}
                filename={check.fixSnippet.filename}
                language={check.fixSnippet.language}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={handleCopyCheckPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              {copiedPrompt ? (
                <>
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Copied Issue Prompt</span>
                </>
              ) : (
                <>
                  <IconSparkles className="w-3.5 h-3.5" />
                  <span>Copy AI Fix Prompt for this Issue</span>
                </>
              )}
            </button>

            {check.referenceUrl && (
              <Link
                href={check.referenceUrl}
                className="inline-flex items-center gap-1 text-primary text-xs hover:underline underline-offset-2 font-medium"
                onClick={e => e.stopPropagation()}
              >
                <span>Read specification</span>
                <IconExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Scan Page Component ───────────────────────────────────────────────────

export default function ScanPage() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedFixPrompt, setCopiedFixPrompt] = useState(false);
  const [copiedLayerId, setCopiedLayerId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleCopyLayerPrompt = (e: React.MouseEvent, layer: LayerScore) => {
    e.stopPropagation();
    if (!result) return;
    const prompt = generateLayerPrompt(layer, result.domain);
    copyText(prompt).catch(() => {});
    setCopiedLayerId(layer.id);
    setTimeout(() => setCopiedLayerId(null), 2000);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qUrl = params.get('url') || params.get('domain') || params.get('q');
    if (qUrl && !result && !loading) {
      setUrlInput(qUrl);
      executeScan(qUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setActiveStepIndex(p => (p + 1) % SCAN_STEPS.length), 450);
    return () => clearInterval(interval);
  }, [loading]);

  async function executeScan(target: string, bypassCache = false) {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    setActiveStepIndex(0);
    try {
      const res = await fetch('/api/v1/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, refresh: bypassCache }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error?.message || data.error || 'Failed to scan target domain');
      }
      startTransition(() => {
        setResult(data);
        const u = new URL(window.location.href);
        u.searchParams.set('url', data.domain);
        window.history.replaceState({}, '', u.toString());
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  async function handleShareResult() {
    if (!result) return;
    const text = `Agentic Readiness Audit for ${result.domain}: Score ${result.score}/100 (Grade ${result.grade})\nhttps://veda.ng/scan?url=${encodeURIComponent(result.domain)}`;
    try {
      await copyText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // keep UI resilient
    }
  }

  async function handleCopyFixPrompt() {
    if (!result) return;
    const prompt = generateFixPrompt(result);
    try {
      await copyText(prompt);
      setCopiedFixPrompt(true);
      setTimeout(() => setCopiedFixPrompt(false), 2000);
    } catch {
      // keep UI resilient
    }
  }

  const allChecks = result?.layers.flatMap(l => l.checks) || [];
  const passingCount = allChecks.filter(c => c.status === 'pass').length;
  const warningCount = allChecks.filter(c => c.status === 'warning').length;
  const failingCount = allChecks.filter(c => c.status === 'fail').length;

  const filteredChecks = allChecks.filter(c => {
    if (filterLayer !== 'all' && c.layer !== filterLayer) return false;
    if (filterStatus === 'attention') return c.status === 'fail' || c.status === 'warning';
    if (filterStatus === 'pass') return c.status === 'pass';
    return true;
  });

  const criticalIssues = allChecks.filter(c => (c.status === 'fail' || c.status === 'warning') && (c.impact === 'critical' || c.impact === 'important'));

  return (
    <PageLayout>
      <div className="w-full space-y-8 sm:space-y-10 pb-16">
        <header>
          <PageHero
            title="Agentic Readiness Scanner"
            subtitle="Deterministic audit for AI agent discovery, MCP servers, OpenAPI schemas, markdown twins, HTTPS security, and structured data."
          />
          <div className="-mt-3">
            <AuthorByline links={[{ label: 'Audit Tool' }]} />
          </div>
        </header>

        {/* ── Input Form ── */}
        <section aria-label="Website Audit Target" className="w-full space-y-3">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!urlInput.trim() || loading) return;
              executeScan(urlInput);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-grow">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <IconSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter domain or URL (e.g. stripe.com, github.com, veda.ng)..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm transition"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="h-auto py-3 px-6 text-sm shrink-0"
            >
              {loading ? 'Auditing...' : 'Run Audit'}
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Presets:</span>
            {PRESETS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setUrlInput(p.url);
                  executeScan(p.url);
                }}
                disabled={loading}
                className="px-2.5 py-1 rounded-md border border-border bg-muted/40 hover:bg-muted text-foreground/90 transition text-xs font-medium"
              >
                {p.name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Loading State ── */}
        {loading && (
          <section className="w-full p-8 rounded-lg border border-border bg-card text-center space-y-3">
            <div className="text-sm font-medium">Scanning {urlInput}</div>
            <p className="text-xs text-muted-foreground min-h-[1.25rem]">
              {SCAN_STEPS[activeStepIndex]}
            </p>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Probing 61 machine-readiness and AI citation standards across 6 layers
            </p>
          </section>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <section className="w-full p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm space-y-1">
            <div className="font-semibold text-xs uppercase tracking-wider">Audit Failed</div>
            <p className="text-foreground/90">{error}</p>
          </section>
        )}

        {/* ── Default Educational State (Pre-scan) ── */}
        {!result && !loading && !error && (
          <div className="space-y-6 sm:space-y-8">
            <section className="w-full border border-border rounded-lg bg-card p-5 sm:p-6 space-y-4">
              <SectionHeader
                title="What This Audit Checks"
                subtitle="Deterministic probes evaluate whether autonomous LLM agents, crawler bots, and machine consumers can discover, parse, authenticate, and interact with your web services."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
                {AUDIT_LAYERS_INFO.map(layer => (
                  <div key={layer.name} className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-1">
                    <div className="font-semibold text-foreground text-sm">{layer.name}</div>
                    <p className="text-muted-foreground leading-relaxed text-xs">{layer.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Master Implementation Prompt for Pre-scan ── */}
            <section className="w-full border border-border rounded-lg bg-card p-5 sm:p-6 space-y-3">
              <SectionHeader
                title="Master AI Remediation Prompt"
                subtitle="Copy this master prompt into Claude, ChatGPT, Cursor, or your AI coding agent to implement all 6 layers of agentic readiness in your codebase."
              />
              <CodeBlock
                code={BASELINE_MASTER_PROMPT}
                filename="ai-readiness-master-prompt.md"
              />
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RESULTS DASHBOARD (POST SCAN)
        ══════════════════════════════════════════════════════════════════ */}
        {result && !loading && (
          <section className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* ── Score Header ── */}
            <div className="p-5 sm:p-6 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {result.domain}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-medium">
                      {result.durationMs}ms
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-medium">
                      {new Date(result.scannedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    {result.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-xs">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{passingCount} Passed</span>
                    <span className="text-border">·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{warningCount} Warnings</span>
                    <span className="text-border">·</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{failingCount} Failed</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                      {result.score}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">/100</span>
                    <span className="ml-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-muted text-foreground">
                      Grade {result.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleCopyFixPrompt}
                      className="flex-1 sm:flex-none text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {copiedFixPrompt ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5" />
                          <span>Copied Fix Prompt</span>
                        </>
                      ) : (
                        <>
                          <IconSparkles className="w-3.5 h-3.5" />
                          <span>Copy AI Fix Prompt</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleShareResult}
                      className="flex-1 sm:flex-none text-xs"
                    >
                      {copiedShare ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Copy Summary</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => executeScan(result.url, true)}
                      className="flex-1 sm:flex-none text-xs"
                    >
                      <IconRefresh className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Re-scan</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── AI Remediation Master Prompt Card (Tailored to Audit) ── */}
            <div id="ai-prompt" className="border border-border rounded-lg bg-card p-5 space-y-3">
              <SectionHeader
                title="AI Remediation Master Prompt"
                subtitle="Paste this tailored prompt directly into Claude, ChatGPT, Cursor, Copilot, or Antigravity to fix all failing checks, generate missing files, and configure response headers for this website:"
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFixPrompt}
                  className="h-8 px-3 text-xs gap-1.5 shrink-0"
                >
                  {copiedFixPrompt ? (
                    <>
                      <IconCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied Prompt</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </Button>
              </SectionHeader>
              <CodeBlock
                code={generateFixPrompt(result)}
                filename={`${result.domain}-remediation-prompt.md`}
              />
            </div>

            {/* ── Capabilities Matrix ── */}
            <div className="border border-border rounded-lg bg-card p-5 space-y-3">
              <SectionHeader
                title="Machine Interface Capabilities"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {[
                  { label: 'robots.txt AI Policy', active: result.badges.aiBotFriendly },
                  { label: 'llms.txt Catalog', active: result.badges.llmsTxt },
                  { label: 'ARD Registry', active: result.badges.ardCatalog },
                  { label: 'RFC 9727 API Catalog', active: result.badges.apiCatalog },
                  { label: 'Markdown Twins', active: result.badges.markdownTwins },
                  { label: 'OpenAPI 3.1 Spec', active: result.badges.openapiSpec },
                  { label: 'Live MCP Server', active: result.badges.mcpServer },
                  { label: 'HTTPS & HSTS', active: result.badges.httpsSecure },
                  { label: 'Robots Meta Directives', active: result.badges.robotsMetaAi },
                  { label: 'Author E-E-A-T Signals', active: result.badges.authorEeat },
                  { label: 'No-JS HTML Fallback', active: result.badges.jsRenderingSelfSufficient },
                  { label: 'JSON-LD Entity Graph', active: result.badges.schemaEntityGraph },
                  { label: 'Structured Sitemap', active: result.badges.xmlOrJsonSitemap },
                  { label: 'API Examples', active: result.badges.openapiExamplesReady },
                  { label: 'Structured Data', active: result.badges.structuredData },
                  { label: 'Micropayments (L402)', active: result.badges.micropaymentsSupported },
                ].map(item => (
                  <div
                    key={item.label}
                    className={cn(
                      'p-2.5 rounded-lg border text-xs font-medium flex items-center justify-between gap-2',
                      item.active
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground'
                        : 'border-border bg-muted/20 text-muted-foreground'
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className={cn('text-[11px] font-semibold', item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
                      {item.active ? 'Yes' : 'No'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Layer Performance Grid ── */}
            <div className="space-y-3">
              <SectionHeader
                title="Layer Breakdown"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.layers.map(layer => {
                  const isSelected = filterLayer === layer.id;
                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => {
                        setFilterLayer(isSelected ? 'all' : layer.id);
                        setFilterStatus('all');
                      }}
                      className={cn(
                        'p-4 rounded-lg border text-left flex flex-col justify-between transition-colors',
                        isSelected
                          ? 'border-primary bg-muted/60 ring-1 ring-primary'
                          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {layer.name}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLayerPrompt(e, layer);
                              }}
                              title={`Copy AI fix prompt for ${layer.name} layer`}
                              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              {copiedLayerId === layer.id ? (
                                <IconCheck className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <IconSparkles className="w-3.5 h-3.5 text-primary" />
                              )}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {layer.score}/{layer.maxScore}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {layer.description}
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${layer.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                          <span>{layer.checks.filter(c => c.status === 'pass').length}/{layer.checks.length} passed</span>
                          <span>{layer.percentage}%</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Priority Action Items (if issues exist) ── */}
            {criticalIssues.length > 0 && (
              <div className="border border-border rounded-lg bg-card p-5 space-y-3">
                <SectionHeader
                  title={`High Priority Action Items (${criticalIssues.length})`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStatus('attention');
                      setFilterLayer('all');
                    }}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Filter Attention Only
                  </button>
                </SectionHeader>
                <div className="space-y-2">
                  {criticalIssues.slice(0, 4).map(c => (
                    <div key={c.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{c.name}</span>
                          <span className="text-[11px] text-muted-foreground font-medium">({c.layer})</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed truncate">{c.details}</p>
                      </div>
                      <StatusPill status={c.impact || 'optional'} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Detailed Checks & Findings ── */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col gap-3 border-b border-border pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Audit Findings & Specifications
                  </h3>

                  {/* Status filter buttons */}
                  <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
                    {[
                      { key: 'all', label: `All (${allChecks.length})` },
                      { key: 'attention', label: `Attention (${warningCount + failingCount})` },
                      { key: 'pass', label: `Passed (${passingCount})` },
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilterStatus(f.key)}
                        className={cn(
                          'px-2.5 py-1 rounded-md transition font-medium',
                          filterStatus === f.key
                            ? 'bg-card text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer filter buttons */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterLayer('all')}
                    className={cn(
                      'px-2.5 py-1 rounded-md border transition font-medium',
                      filterLayer === 'all'
                        ? 'border-primary bg-primary text-primary-foreground font-semibold'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    All Layers
                  </button>
                  {(['discovery', 'access', 'usability', 'security', 'seo', 'payments'] as const).map(layer => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => setFilterLayer(layer)}
                      className={cn(
                        'px-2.5 py-1 rounded-md border transition font-medium',
                        filterLayer === layer
                          ? 'border-primary bg-primary text-primary-foreground font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      {LAYER_LABELS[layer] || layer}
                    </button>
                  ))}
                </div>

                {(filterLayer !== 'all' || filterStatus !== 'all') && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Showing {filteredChecks.length} of {allChecks.length} checks</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterLayer('all');
                        setFilterStatus('all');
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Check items list */}
              {filteredChecks.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  No checks match the selected filter.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChecks.map(check => (
                    <CheckRow
                      key={check.id}
                      check={check}
                      domain={result.domain}
                      defaultExpanded={check.status === 'fail'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── API & Automation Reference ── */}
            <div className="p-5 rounded-lg border border-border bg-card text-xs space-y-3">
              <SectionHeader
                title="Programmatic Audit API"
                subtitle="Run agent-readiness scans directly in CI/CD pipelines, autonomous scripts, or via the scan_agent_readiness tool in the veda.ng MCP server."
              >
                <span className="text-muted-foreground font-medium text-xs">HTTP & MCP</span>
              </SectionHeader>
              <CodeBlock
                code={`curl -X POST https://veda.ng/api/v1/scan -H "Content-Type: application/json" -d '{"url":"${result.domain}"}'`}
              />
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-medium">
                <Link href="/developers" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>API Documentation</span>
                  <IconArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/aistandards" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>AI Discovery Standards</span>
                  <IconArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/sitecheck" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>Web Standards Checklist</span>
                  <IconArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
