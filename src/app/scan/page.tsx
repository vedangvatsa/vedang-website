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

// ─── Constants ───────────────────────────────────────────────────────────────

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

const LAYER_LABELS: Record<string, string> = {
  all: 'All',
  discovery: 'Discovery',
  access: 'Access',
  usability: 'Usability',
  security: 'Security',
  seo: 'SEO',
  payments: 'Payments',
};

// ─── Prompt generators ───────────────────────────────────────────────────────

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

  let p = `You are an expert engineer resolving ${layer.name} layer issues for ${domain}.\n\n`;
  p += `### Layer: ${layer.name} (Score: ${layer.score}/${layer.maxScore} — ${layer.percentage}%)\n`;
  p += `${layer.description}\n\n`;

  if (failing.length > 0) {
    p += `#### Failures (${failing.length}):\n`;
    failing.forEach((c, i) => {
      p += `\n${i + 1}. ${c.name}\n`;
      p += `   - Issue: ${c.details}\n`;
      if (c.why) p += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) p += `   - Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) p += `   \`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
    });
  }
  if (warnings.length > 0) {
    p += `\n#### Warnings (${warnings.length}):\n`;
    warnings.forEach((c, i) => {
      p += `\n${i + 1}. ${c.name}\n`;
      p += `   - Issue: ${c.details}\n`;
      if (c.why) p += `   - Rationale: ${c.why}\n`;
      if (c.recommendation) p += `   - Fix: ${c.recommendation}\n`;
    });
  }
  p += `\n### Instructions:\n1. Apply static files and headers to resolve these issues.\n2. Ensure full compatibility with our application framework.\n3. Provide verification curl commands to test against the live deployment.`;
  return p;
}

function generateFixPrompt(result: ScanResult): string {
  const failing = result.layers.flatMap(l => l.checks).filter(c => c.status === 'fail');
  const warnings = result.layers.flatMap(l => l.checks).filter(c => c.status === 'warning');

  let prompt = `You are an expert full-stack engineer and AI web readiness architect.
Our website (${result.url}) scored ${result.score}/100 (Grade ${result.grade}) on the AI & Web Readiness Scanner (https://veda.ng/scan).

Fix everything below to reach 100/100.

---
Domain: ${result.domain}
Score: ${result.score}/100 · Grade ${result.grade}
Issues: ${failing.length} failures, ${warnings.length} warnings

---
`;

  if (failing.length > 0) {
    prompt += `\n### FAILURES (${failing.length}):\n`;
    failing.forEach((c, i) => {
      prompt += `\n${i + 1}. [${c.layer.toUpperCase()}] ${c.name}\n`;
      prompt += `   Issue: ${c.details}\n`;
      if (c.why) prompt += `   Why: ${c.why}\n`;
      if (c.recommendation) prompt += `   Fix: ${c.recommendation}\n`;
      if (c.fixSnippet) prompt += `   \`\`\`\n${c.fixSnippet.code}\n\`\`\`\n`;
    });
  }

  if (warnings.length > 0) {
    prompt += `\n### WARNINGS (${warnings.length}):\n`;
    warnings.forEach((c, i) => {
      prompt += `\n${i + 1}. [${c.layer.toUpperCase()}] ${c.name}\n`;
      prompt += `   Issue: ${c.details}\n`;
      if (c.why) prompt += `   Why: ${c.why}\n`;
      if (c.recommendation) prompt += `   Fix: ${c.recommendation}\n`;
    });
  }

  if (failing.length === 0 && warnings.length === 0) {
    prompt += `\nAll checks passed. Run regular CI checks at https://veda.ng/api/v1/scan.\n`;
  }

  prompt += `
---
Instructions:
1. Detect the tech stack and apply static file + header fixes.
2. Implement missing endpoints (robots.txt, llms.txt, /.well-known/*, MCP, OpenAPI).
3. Return verification curl commands for each fix.`;

  return prompt;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function IconArrowRight({ className = 'w-3 h-3' }: { className?: string }) {
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

// ─── Check Row ────────────────────────────────────────────────────────────────

function CheckRow({ check, domain }: { check: CheckResult; domain: string }) {
  const [expanded, setExpanded] = useState(check.status === 'fail');
  const [copied, setCopied] = useState(false);
  const hasDetails = Boolean(check.why || check.recommendation || check.fixSnippet || check.referenceUrl);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyText(generateCheckPrompt(check, domain)).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-border rounded-lg bg-card">
      <div
        className={cn('px-4 py-3 flex items-start justify-between gap-4', hasDetails && 'cursor-pointer select-none')}
        onClick={() => hasDetails && setExpanded(!expanded)}
        role={hasDetails ? 'button' : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="mt-0.5 shrink-0">
            <StatusPill status={check.status} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-sm text-foreground">{check.name}</span>
              <span className="text-[10px] font-medium text-muted-foreground">{check.layer}</span>
              {check.impact && check.impact !== 'optional' && (
                <StatusPill status={check.impact} />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{check.details}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {check.status === 'na'
              ? 'N/A'
              : check.impact === 'optional'
              ? (check.score > 0 ? `+${check.score}` : '—')
              : `${check.score}/${check.maxScore}`}
          </span>
          {hasDetails && (
            <div className={cn('text-muted-foreground transition-transform duration-150', expanded && 'rotate-180')}>
              <IconChevronDown className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {expanded && hasDetails && (
        <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/10 text-xs">
          {check.why && (
            <div>
              <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1">Why it matters</p>
              <p className="text-muted-foreground leading-relaxed">{check.why}</p>
            </div>
          )}
          {check.recommendation && (
            <div>
              <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-1">How to fix</p>
              <p className="text-muted-foreground leading-relaxed">{check.recommendation}</p>
            </div>
          )}
          {check.fixSnippet && (
            <CodeBlock
              code={check.fixSnippet.code}
              filename={check.fixSnippet.filename}
              language={check.fixSnippet.language}
            />
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <><IconCheck className="w-3 h-3" /><span>Copied</span></>
              ) : (
                <><IconSparkles className="w-3 h-3" /><span>Copy AI fix prompt</span></>
              )}
            </button>
            {check.referenceUrl && (
              <Link
                href={check.referenceUrl}
                className="inline-flex items-center gap-1 text-primary text-xs hover:underline underline-offset-2"
                onClick={e => e.stopPropagation()}
              >
                <span>Specification</span>
                <IconExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
    const text = `${result.domain} scored ${result.score}/100 (Grade ${result.grade}) on the AI & Web Readiness Scanner\nhttps://veda.ng/scan?url=${encodeURIComponent(result.domain)}`;
    try {
      await copyText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch { /* keep UI resilient */ }
  }

  async function handleCopyFixPrompt() {
    if (!result) return;
    try {
      await copyText(generateFixPrompt(result));
      setCopiedFixPrompt(true);
      setTimeout(() => setCopiedFixPrompt(false), 2000);
    } catch { /* keep UI resilient */ }
  }

  const handleCopyLayerPrompt = (e: React.MouseEvent, layer: LayerScore) => {
    e.stopPropagation();
    if (!result) return;
    copyText(generateLayerPrompt(layer, result.domain)).catch(() => {});
    setCopiedLayerId(layer.id);
    setTimeout(() => setCopiedLayerId(null), 2000);
  };

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

  return (
    <PageLayout>
      <div className="w-full space-y-8 sm:space-y-10 pb-16">
        <header>
          <PageHero
            title="AI & Web Readiness Scanner"
            subtitle="Deterministic audit for AI answer engines, MCP clients, and machine consumers. Scores your site across Discovery, Access, Usability, Security, SEO, and Payments."
          />
          <div className="-mt-3">
            <AuthorByline links={[{ label: 'Audit Tool' }]} />
          </div>
        </header>

        {/* ── Input Form ── */}
        <section aria-label="Scan Target" className="w-full space-y-3">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!urlInput.trim() || loading) return;
              executeScan(urlInput);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-grow">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                <IconSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Enter domain or URL — e.g. stripe.com or https://github.com"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm transition"
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

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-muted-foreground/60">Try:</span>
            {PRESETS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => { setUrlInput(p.url); executeScan(p.url); }}
                disabled={loading}
                className="px-2 py-0.5 rounded border border-border bg-muted/40 hover:bg-muted text-foreground/80 transition text-xs"
              >
                {p.name}
              </button>
            ))}
          </div>
        </section>

        {/* ── Loading ── */}
        {loading && (
          <section className="w-full py-12 rounded-lg border border-border bg-card text-center space-y-4">
            <div className="text-sm font-medium text-foreground">{urlInput}</div>
            <p className="text-xs text-muted-foreground min-h-[1rem]">{SCAN_STEPS[activeStepIndex]}</p>
            <div className="w-48 mx-auto bg-muted rounded-full h-1 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Probing across 6 machine-readiness layers</p>
          </section>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <section className="w-full px-4 py-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm">
            <span className="font-semibold">Scan failed — </span>{error}
          </section>
        )}

        {/* ── Pre-scan info ── */}
        {!result && !loading && !error && (
          <div className="space-y-6">
            <section className="border border-border rounded-lg bg-card divide-y divide-border">
              {[
                { layer: 'Discovery', probes: '13', desc: 'robots.txt AI policies, llms.txt, ARD v0.91, RFC 9727 API Catalog, agents.txt, sitemaps' },
                { layer: 'Access', probes: '9', desc: 'Markdown content negotiation, .md URL twins, robots meta AI directives, SSR no-JS fallback, rate limits' },
                { layer: 'Usability & MCP', probes: '10', desc: 'Streamable MCP servers, OpenAPI 3.1 with examples, auth guides, RFC 8414 OAuth, TDMRep' },
                { layer: 'Security', probes: '11', desc: 'HTTPS, HSTS preload, CSP, nosniff, frame protection, RFC 9116 security.txt, RFC 9421 signatures' },
                { layer: 'SEO & Citations', probes: '15', desc: 'Title/Meta tags, JSON-LD @graph, E-E-A-T sameAs links, inverted pyramid Q&A, RSS feeds' },
                { layer: 'Micropayments', probes: '3', desc: 'L402 / HTTP 402, WebLN wallet discovery, machine terms of service' },
              ].map(item => (
                <div key={item.layer} className="flex items-baseline gap-4 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground w-40 shrink-0">{item.layer}</span>
                  <span className="text-muted-foreground/60 text-xs tabular-nums w-8 shrink-0">{item.probes} probes</span>
                  <span className="text-muted-foreground text-xs leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </section>

            <section className="border border-border rounded-lg bg-card p-4 sm:p-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                Enter any domain above to run the audit, or copy the prompt below into your AI coding agent to implement all 6 layers in your codebase.
              </p>
              <CodeBlock
                code={`# AI & Web Readiness — Master Implementation Prompt
# Paste into Claude, ChatGPT, Cursor, or your AI coding agent

You are an expert full-stack engineer and AI web readiness architect.
Audit and upgrade our web application to achieve 100/100 on https://veda.ng/scan.

Our website URL: [PASTE YOUR URL]
Our tech stack: [e.g. Next.js / Astro / Django / FastAPI / Express]

Implement the following 6 layers:

1. DISCOVERY — robots.txt AI bot rules, /llms.txt, /llms-full.txt,
   /.well-known/agents.json, /.well-known/api-catalog (RFC 9727), /.well-known/ard.json

2. ACCESS — Markdown content negotiation (Accept: text/markdown),
   .md URL twins for each page, SSR no-JS fallback, RateLimit-* headers

3. MCP & USABILITY — Streamable HTTP MCP server at /.well-known/mcp,
   OpenAPI 3.1 at /openapi.json with concrete examples, /auth.md spec

4. SECURITY — HTTPS, HSTS preload (max-age=63072000; includeSubDomains; preload),
   strict CSP, /.well-known/security.txt (RFC 9116)

5. SEO & CITATIONS — JSON-LD @graph (Organization, WebSite, Article),
   E-E-A-T sameAs links, inverted pyramid headings, active RSS feed

6. MICROPAYMENTS — L402 / HTTP 402 payment headers or /terms-of-use.md

Provide exact code files, server configuration, and curl verification commands.`}
                filename="ai-readiness-master-prompt.md"
              />
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            RESULTS
        ══════════════════════════════════════════════ */}
        {result && !loading && (
          <section className="w-full space-y-6 animate-in fade-in duration-200">

            {/* ── Score header ── */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold tracking-tight text-foreground">{result.domain}</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">{result.durationMs}ms</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">{new Date(result.scannedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{result.summary}</p>
                  <div className="flex items-center gap-3 text-xs font-medium pt-0.5">
                    <span className="text-emerald-600">{passingCount} passed</span>
                    <span className="text-border">·</span>
                    <span className="text-amber-600">{warningCount} warnings</span>
                    <span className="text-border">·</span>
                    <span className="text-rose-600">{failingCount} failed</span>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-bold tracking-tight">{result.score}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-border bg-muted">Grade {result.grade}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCopyFixPrompt}
                      className="text-xs gap-1.5 h-8 px-3"
                    >
                      {copiedFixPrompt ? (
                        <><IconCheck className="w-3 h-3" /><span>Copied</span></>
                      ) : (
                        <><IconSparkles className="w-3 h-3" /><span>Copy fix prompt</span></>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleShareResult}
                      className="text-xs gap-1.5 h-8 px-3"
                    >
                      {copiedShare ? (
                        <><IconCheck className="w-3 h-3 text-emerald-500" /><span>Copied</span></>
                      ) : (
                        <><IconCopy className="w-3 h-3 text-muted-foreground" /><span>Share</span></>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => executeScan(result.url, true)}
                      className="text-xs gap-1.5 h-8 px-3"
                    >
                      <IconRefresh className="w-3 h-3 text-muted-foreground" />
                      <span>Re-scan</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Layer breakdown ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      'p-3.5 rounded-lg border text-left flex flex-col gap-2 transition-colors',
                      isSelected
                        ? 'border-primary bg-muted/60 ring-1 ring-primary'
                        : 'border-border bg-card hover:border-primary/40'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-xs text-foreground">{layer.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleCopyLayerPrompt(e, layer)}
                          title="Copy AI fix prompt for this layer"
                          className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedLayerId === layer.id
                            ? <IconCheck className="w-3 h-3 text-emerald-500" />
                            : <IconSparkles className="w-3 h-3" />
                          }
                        </button>
                        <span className="text-xs font-semibold text-muted-foreground">{layer.score}/{layer.maxScore}</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${layer.percentage}%` }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{layer.percentage}% · {layer.checks.filter(c => c.status === 'pass').length}/{layer.checks.length} passed</span>
                  </button>
                );
              })}
            </div>

            {/* ── Capabilities ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'robots.txt AI policy', active: result.badges.aiBotFriendly },
                { label: 'llms.txt catalog', active: result.badges.llmsTxt },
                { label: 'ARD registry', active: result.badges.ardCatalog },
                { label: 'RFC 9727 API catalog', active: result.badges.apiCatalog },
                { label: 'Markdown twins', active: result.badges.markdownTwins },
                { label: 'OpenAPI 3.1 spec', active: result.badges.openapiSpec },
                { label: 'Live MCP server', active: result.badges.mcpServer },
                { label: 'HTTPS & HSTS', active: result.badges.httpsSecure },
                { label: 'Robots meta directives', active: result.badges.robotsMetaAi },
                { label: 'E-E-A-T signals', active: result.badges.authorEeat },
                { label: 'No-JS HTML fallback', active: result.badges.jsRenderingSelfSufficient },
                { label: 'JSON-LD entity graph', active: result.badges.schemaEntityGraph },
                { label: 'XML/JSON sitemap', active: result.badges.xmlOrJsonSitemap },
                { label: 'API examples', active: result.badges.openapiExamplesReady },
                { label: 'Structured data', active: result.badges.structuredData },
                { label: 'Micropayments', active: result.badges.micropaymentsSupported },
              ].map(item => (
                <div
                  key={item.label}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between gap-2',
                    item.active
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground'
                      : 'border-border bg-muted/10 text-muted-foreground'
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  <span className={cn('text-[11px] font-semibold shrink-0', item.active ? 'text-emerald-600' : 'text-muted-foreground/50')}>
                    {item.active ? '✓' : '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Check filters & list ── */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <h3 className="text-sm font-semibold text-foreground flex-1">Audit Findings</h3>
                {/* Status toggle */}
                <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
                  {[
                    { key: 'all', label: `All (${allChecks.length})` },
                    { key: 'attention', label: `Issues (${warningCount + failingCount})` },
                    { key: 'pass', label: `Passed (${passingCount})` },
                  ].map(f => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilterStatus(f.key)}
                      className={cn(
                        'px-2.5 py-1 rounded-md transition font-medium',
                        filterStatus === f.key ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layer filter pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFilterLayer('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-full border transition',
                    filterLayer === 'all'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  )}
                >
                  All layers
                </button>
                {(['discovery', 'access', 'usability', 'security', 'seo', 'payments'] as const).map(layer => (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setFilterLayer(layer)}
                    className={cn(
                      'px-2.5 py-1 rounded-full border transition',
                      filterLayer === layer
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                    )}
                  >
                    {LAYER_LABELS[layer]}
                  </button>
                ))}
              </div>

              {(filterLayer !== 'all' || filterStatus !== 'all') && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Showing {filteredChecks.length} of {allChecks.length} checks</span>
                  <button
                    type="button"
                    onClick={() => { setFilterLayer('all'); setFilterStatus('all'); }}
                    className="text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {filteredChecks.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                  No checks match the selected filter.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredChecks.map(check => (
                    <CheckRow key={check.id} check={check} domain={result.domain} />
                  ))}
                </div>
              )}
            </div>

            {/* ── API reference ── */}
            <div className="p-4 rounded-lg border border-border bg-card text-xs space-y-3">
              <SectionHeader
                title="Programmatic API"
                subtitle="Run audits in CI/CD pipelines or from the veda.ng MCP server."
              />
              <CodeBlock
                code={`curl -X POST https://veda.ng/api/v1/scan \\
  -H "Content-Type: application/json" \\
  -d '{"url":"${result.domain}"}'`}
              />
              <div className="flex flex-wrap gap-4 text-xs font-medium pt-1">
                <Link href="/developers" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>API docs</span><IconArrowRight className="w-2.5 h-2.5" />
                </Link>
                <Link href="/aistandards" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>AI standards</span><IconArrowRight className="w-2.5 h-2.5" />
                </Link>
                <Link href="/sitecheck" className="text-primary hover:underline inline-flex items-center gap-1">
                  <span>Web checklist</span><IconArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
