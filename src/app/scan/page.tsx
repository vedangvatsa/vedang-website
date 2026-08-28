'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { Button } from '@/components/ui/button';
import { copyText } from '@/lib/copy-text';
import { cn } from '@/lib/utils';
import { ScanResult, CheckResult } from '@/lib/scanner/types';

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
  { name: 'Discovery', desc: 'robots.txt AI rules, llms.txt, ARD catalog, agents.txt, sitemaps' },
  { name: 'Access', desc: 'Markdown twins (Accept: text/markdown), SSR payload, no-JS fallback' },
  { name: 'Usability & MCP', desc: 'MCP endpoints (/.well-known/mcp), OpenAPI 3.1 schema & examples' },
  { name: 'Security', desc: 'HTTPS enforcement, HSTS preload, CSP header, security.txt RFC 9116' },
  { name: 'SEO & Structured Data', desc: 'JSON-LD entity graph, Open Graph tags, canonical URLs, RSS/Atom feeds' },
  { name: 'Micropayments', desc: 'L402 / HTTP 402 macaroons, WebLN, autonomous machine payments' },
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

const IMPACT_STYLES: Record<string, { label: string; badge: string }> = {
  critical: {
    label: 'Critical',
    badge: 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/30',
  },
  important: {
    label: 'Important',
    badge: 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30',
  },
  recommended: {
    label: 'Recommended',
    badge: 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/30',
  },
  optional: {
    label: 'Optional',
    badge: 'text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
  },
};

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

function CheckRow({ check, defaultExpanded = false }: { check: CheckResult; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedCode, setCopiedCode] = useState(false);

  async function handleCopySnippet(code: string) {
    try {
      await copyText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // keep UI resilient
    }
  }

  const impact = IMPACT_STYLES[check.impact || 'optional'] || IMPACT_STYLES.optional;
  const hasDetails = Boolean(check.why || check.recommendation || check.fixSnippet || check.referenceUrl);

  const statusBadge = {
    pass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    fail: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    na: 'bg-muted text-muted-foreground border-border',
  }[check.status];

  const statusText = {
    pass: 'PASS',
    warning: 'WARN',
    fail: 'FAIL',
    na: 'N/A',
  }[check.status];

  return (
    <div className="border border-border rounded-lg bg-card transition-colors hover:border-foreground/30">
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
            <span className={cn('text-[11px] font-mono font-semibold px-2 py-0.5 rounded border', statusBadge)}>
              {statusText}
            </span>
            <span className="font-semibold text-sm sm:text-base text-foreground tracking-tight">
              {check.name}
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {check.layer}
            </span>
            {check.impact && (
              <span className={cn('text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded border', impact.badge)}>
                {impact.label}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {check.details}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-0.5">
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {check.score}/{check.maxScore}
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
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                Rationale
              </span>
              <p className="text-foreground/90 leading-relaxed">{check.why}</p>
            </div>
          )}

          {check.recommendation && (
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-foreground">
                How to Fix
              </span>
              <p className="text-foreground/90 leading-relaxed">
                {check.recommendation}
                {check.referenceUrl && (
                  <Link
                    href={check.referenceUrl}
                    className="ml-2 inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 font-medium"
                    onClick={e => e.stopPropagation()}
                  >
                    <span>Read specification</span>
                    <IconExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </p>
            </div>
          )}

          {check.fixSnippet && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-muted-foreground text-[11px] font-mono">
                <span>{check.fixSnippet.filename || check.fixSnippet.language || 'snippet'}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    handleCopySnippet(check.fixSnippet!.code);
                  }}
                  className="h-7 px-2 text-xs font-mono"
                >
                  {copiedCode ? (
                    <>
                      <IconCheck className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="w-3 h-3" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </Button>
              </div>
              <pre className="p-3.5 rounded-lg border border-border bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap break-words">
                <code>{check.fixSnippet.code}</code>
              </pre>
            </div>
          )}

          {!check.recommendation && check.referenceUrl && (
            <div className="pt-1 text-right">
              <Link
                href={check.referenceUrl}
                className="inline-flex items-center gap-1 text-primary text-xs hover:underline underline-offset-2"
                onClick={e => e.stopPropagation()}
              >
                <span>View full specification</span>
                <IconExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
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
    const text = `Agentic Readiness Audit for ${result.domain}: Score ${result.score}/100 (Grade ${result.grade})\nhttps://veda.ng/scan?url=${encodeURIComponent(result.domain)}`;
    try {
      await copyText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
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
            <span className="font-mono">Presets:</span>
            {PRESETS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setUrlInput(p.url);
                  executeScan(p.url);
                }}
                disabled={loading}
                className="px-2 py-0.5 rounded border border-border bg-muted/40 hover:bg-muted text-foreground/90 font-mono transition"
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
            <p className="text-xs font-mono text-muted-foreground min-h-[1.25rem]">
              {SCAN_STEPS[activeStepIndex]}
            </p>
            <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Probing 23 machine-readiness standards across 6 layers
            </p>
          </section>
        )}

        {/* ── Error State ── */}
        {error && !loading && (
          <section className="w-full p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm space-y-1">
            <div className="font-semibold text-xs uppercase tracking-wider font-mono">Audit Failed</div>
            <p className="text-foreground/90">{error}</p>
          </section>
        )}

        {/* ── Default Educational State (Pre-scan) ── */}
        {!result && !loading && !error && (
          <section className="w-full border border-border rounded-lg bg-card p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                What This Audit Checks
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deterministic probes evaluate whether autonomous LLM agents, crawler bots, and machine consumers can read, parse, authenticate, and transact with your web services.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
              {AUDIT_LAYERS_INFO.map(layer => (
                <div key={layer.name} className="p-3 rounded border border-border bg-muted/20 space-y-1">
                  <div className="font-semibold text-foreground">{layer.name}</div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">{layer.desc}</p>
                </div>
              ))}
            </div>
          </section>
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
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {result.domain}
                    </h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground">
                      {result.durationMs}ms
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-muted text-muted-foreground">
                      {new Date(result.scannedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    {result.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{passingCount} Passed</span>
                    <span className="text-border">·</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{warningCount} Warnings</span>
                    <span className="text-border">·</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">{failingCount} Failed</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-foreground">
                      {result.score}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">/100</span>
                    <span className="ml-1 text-xs font-mono uppercase font-bold px-2 py-0.5 rounded border border-border bg-muted">
                      Grade {result.grade}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
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

            {/* ── Capabilities Matrix ── */}
            <div className="border border-border rounded-lg bg-card p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Machine Interface Capabilities
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {[
                  { label: 'robots.txt AI Policy', active: result.badges.aiBotFriendly },
                  { label: 'llms.txt Catalog', active: result.badges.llmsTxt },
                  { label: 'ARD Registry', active: result.badges.ardCatalog },
                  { label: 'Markdown Twins', active: result.badges.markdownTwins },
                  { label: 'OpenAPI 3.1 Spec', active: result.badges.openapiSpec },
                  { label: 'Live MCP Server', active: result.badges.mcpServer },
                  { label: 'HTTPS & HSTS', active: result.badges.httpsSecure },
                  { label: 'No-JS HTML Fallback', active: result.badges.jsRenderingSelfSufficient },
                  { label: 'JSON-LD Graph', active: result.badges.schemaEntityGraph },
                  { label: 'Structured Sitemap', active: result.badges.xmlOrJsonSitemap },
                  { label: 'API Examples', active: result.badges.openapiExamplesReady },
                  { label: 'Micropayments (L402)', active: result.badges.micropaymentsSupported },
                ].map(item => (
                  <div
                    key={item.label}
                    className={cn(
                      'p-2.5 rounded border font-mono text-[11px] flex items-center justify-between gap-2',
                      item.active
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-foreground'
                        : 'border-border/70 bg-muted/20 text-muted-foreground'
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className={cn('text-[10px] font-bold', item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-600')}>
                      {item.active ? 'YES' : 'NO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Layer Performance Grid ── */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Layer Breakdown
              </div>
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
                          ? 'border-foreground bg-muted/60 ring-1 ring-border'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-foreground">
                            {layer.name}
                          </span>
                          <span className="font-mono text-xs font-semibold text-muted-foreground">
                            {layer.score}/{layer.maxScore}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {layer.description}
                        </p>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-foreground h-full rounded-full transition-all duration-300"
                            style={{ width: `${layer.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                          <span>{layer.checks.filter(c => c.status === 'pass').length}/{layer.checks.length} pass</span>
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
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-semibold text-foreground">
                    High Priority Action Items ({criticalIssues.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFilterStatus('attention');
                      setFilterLayer('all');
                    }}
                    className="text-xs text-primary hover:underline font-mono"
                  >
                    Filter Attention Only
                  </button>
                </div>
                <div className="space-y-2">
                  {criticalIssues.slice(0, 4).map(c => (
                    <div key={c.id} className="p-3 rounded border border-border bg-muted/20 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{c.name}</span>
                          <span className="text-[10px] font-mono uppercase text-muted-foreground">({c.layer})</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed truncate">{c.details}</p>
                      </div>
                      <span className={cn('text-[10px] font-mono uppercase font-semibold shrink-0 px-1.5 py-0.5 rounded border', IMPACT_STYLES[c.impact || 'optional']?.badge)}>
                        {c.impact}
                      </span>
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
                  <div className="flex items-center bg-muted/60 p-0.5 rounded border border-border text-xs font-mono">
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
                          'px-2.5 py-1 rounded transition font-medium',
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
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {(['all', 'discovery', 'access', 'usability', 'security', 'seo', 'payments'] as const).map(layer => (
                    <button
                      key={layer}
                      type="button"
                      onClick={() => setFilterLayer(layer)}
                      className={cn(
                        'px-2.5 py-1 rounded border transition',
                        filterLayer === layer
                          ? 'border-foreground bg-foreground text-background font-semibold'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                      )}
                    >
                      {LAYER_LABELS[layer] || layer}
                    </button>
                  ))}
                </div>

                {(filterLayer !== 'all' || filterStatus !== 'all') && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>Showing {filteredChecks.length} of {allChecks.length} checks</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterLayer('all');
                        setFilterStatus('all');
                      }}
                      className="text-primary hover:underline"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Check items list */}
              {filteredChecks.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-muted-foreground border border-dashed border-border rounded-lg">
                  No checks match the selected filter.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChecks.map(check => (
                    <CheckRow
                      key={check.id}
                      check={check}
                      defaultExpanded={check.status === 'fail'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── API & Automation Reference ── */}
            <div className="p-5 rounded-lg border border-border bg-card text-xs space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground uppercase tracking-wider">
                  Programmatic Audit API
                </span>
                <span className="text-muted-foreground">HTTP & MCP</span>
              </div>
              <p className="text-muted-foreground font-sans text-xs leading-relaxed">
                Run agent-readiness scans directly in CI/CD pipelines, autonomous scripts, or via the <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono">scan_agent_readiness</code> tool in the veda.ng MCP server.
              </p>
              <div className="space-y-1.5 pt-1">
                <div className="p-2.5 rounded bg-zinc-950 text-zinc-300 overflow-x-auto border border-border">
                  <code>curl -X POST https://veda.ng/api/v1/scan -H &quot;Content-Type: application/json&quot; -d &apos;&#123;&quot;url&quot;:&quot;{result.domain}&quot;&#125;&apos;</code>
                </div>
              </div>
              <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-sans">
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
