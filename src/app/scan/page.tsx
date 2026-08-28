'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { ScanResult, CheckResult } from '@/lib/scanner/types';
import {
  Search, Sparkles, CheckCircle2, AlertTriangle, XCircle, Clock,
  ArrowRight, Copy, Check, RefreshCw, ExternalLink, Shield,
  FileCode, Terminal, Layers, Cpu, Zap, Lock, BarChart3,
  BookOpen, Wrench, ChevronDown, ChevronUp,
} from 'lucide-react';

const PRESETS = [
  { name: 'veda.ng', url: 'https://veda.ng' },
  { name: 'stripe.com', url: 'https://stripe.com' },
  { name: 'github.com', url: 'https://github.com' },
  { name: 'anthropic.com', url: 'https://anthropic.com' },
  { name: 'cloudflare.com', url: 'https://cloudflare.com' },
];

const SCAN_STEPS = [
  'Probing robots.txt AI bot policies & crawler rules...',
  'Checking llms.txt, llms-full.txt, ARD catalogs...',
  'Scanning agents.txt, agents.json, A2A agent cards...',
  'Evaluating Markdown content negotiation & URL twins...',
  'Pinging Model Context Protocol (MCP) HTTP endpoints...',
  'Validating OpenAPI specifications & structured data...',
  'Auditing HTTPS, security headers (CSP, HSTS, XCTO)...',
  'Checking Open Graph tags, JSON-LD, canonical & RSS feeds...',
  'Aggregating 0–100 Agentic Readiness Score...',
];

const IMPACT_LABELS: Record<string, { label: string; color: string }> = {
  critical:    { label: 'Critical',    color: 'text-rose-600   dark:text-rose-400   bg-rose-500/10   border-rose-500/30' },
  important:   { label: 'Important',   color: 'text-amber-600  dark:text-amber-400  bg-amber-500/10  border-amber-500/30' },
  recommended: { label: 'Recommended', color: 'text-blue-600   dark:text-blue-400   bg-blue-500/10   border-blue-500/30' },
  optional:    { label: 'Optional',    color: 'text-zinc-500   dark:text-zinc-400   bg-zinc-500/10   border-zinc-500/30' },
};

function CheckCard({ check, defaultExpanded = false }: { check: CheckResult; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedCode, setCopiedCode] = useState(false);

  function copySnippet(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }

  const impactInfo = IMPACT_LABELS[check.impact || 'optional'];
  const hasDetails = check.why || check.recommendation || check.fixSnippet;

  return (
    <div className={`rounded-xl border transition-all ${
      check.status === 'pass'
        ? 'border-emerald-500/20 bg-emerald-500/[0.03]'
        : check.status === 'fail'
        ? 'border-rose-500/30 bg-rose-500/[0.03]'
        : check.status === 'warning'
        ? 'border-amber-500/20 bg-amber-500/[0.03]'
        : 'border-border/60 bg-card/40'
    }`}>
      {/* ── Header row ── */}
      <div
        className={`flex items-start gap-3 p-5 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setExpanded(!expanded)}
        role={hasDetails ? 'button' : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
      >
        {/* Status icon */}
        <div className="shrink-0 mt-0.5">
          {check.status === 'pass'    && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          {check.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          {check.status === 'fail'    && <XCircle className="h-5 w-5 text-rose-500" />}
          {check.status === 'na'      && <Clock className="h-5 w-5 text-muted-foreground" />}
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm sm:text-base text-foreground">{check.name}</span>

            {/* Layer chip */}
            <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-muted/70 text-muted-foreground border border-border/50">
              {check.layer}
            </span>

            {/* Impact chip */}
            {check.impact && (
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${impactInfo.color}`}>
                {impactInfo.label}
              </span>
            )}
          </div>

          {/* Finding — always visible */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{check.details}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">
          <span className="font-mono text-xs font-bold text-muted-foreground whitespace-nowrap">
            {check.score}/{check.maxScore}
          </span>
          {hasDetails && (
            <div className="text-muted-foreground">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && hasDetails && (
        <div className="border-t border-border/50 divide-y divide-border/30">

          {/* Why it matters */}
          {check.why && (
            <div className="px-5 py-4 flex gap-3">
              <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Why this matters</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{check.why}</p>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {check.recommendation && (
            <div className="px-5 py-4 flex gap-3">
              <Wrench className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wider">How to fix</p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {check.recommendation}
                  {check.referenceUrl && (
                    <Link
                      href={check.referenceUrl}
                      className="ml-2 inline-flex items-center gap-1 text-primary hover:underline underline-offset-2 font-medium text-xs"
                      onClick={e => e.stopPropagation()}
                    >
                      <span>Read full guide</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Code Snippet */}
          {check.fixSnippet && (
            <div className="px-5 py-4">
              <div className="rounded-lg border border-border overflow-hidden bg-zinc-950 text-zinc-100 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-zinc-500 text-[11px]">{check.fixSnippet.filename || check.fixSnippet.language || 'snippet'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); copySnippet(check.fixSnippet!.code); }}
                    className="inline-flex items-center gap-1.5 hover:text-zinc-200 transition px-2 py-0.5 rounded hover:bg-zinc-800"
                  >
                    {copiedCode ? <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied!</span></> : <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
                  <code>{check.fixSnippet.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* Ref link when no recommendation but has referenceUrl */}
          {!check.recommendation && check.referenceUrl && (
            <div className="px-5 py-3 flex items-center justify-end">
              <Link
                href={check.referenceUrl}
                className="inline-flex items-center gap-1.5 text-primary text-xs hover:underline underline-offset-2"
                onClick={e => e.stopPropagation()}
              >
                <span>View full specification</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
    if (qUrl && !result && !loading) { setUrlInput(qUrl); executeScan(qUrl); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => setActiveStepIndex(p => (p + 1) % SCAN_STEPS.length), 500);
    return () => clearInterval(interval);
  }, [loading]);

  async function executeScan(target: string, bypassCache = false) {
    if (!target.trim()) return;
    setLoading(true); setError(null); setActiveStepIndex(0);
    try {
      const res = await fetch('/api/v1/scan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target, refresh: bypassCache }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error?.message || data.error || 'Failed to scan domain');
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

  function handleShareResult() {
    if (!result) return;
    const text = `I audited ${result.domain} on veda.ng/scan and scored ${result.score}/100 (Grade ${result.grade})!\n\nCheck yours → https://veda.ng/scan?url=${encodeURIComponent(result.domain)}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  }

  const allChecks = result?.layers.flatMap(l => l.checks) || [];
  const filteredChecks = allChecks.filter(c => {
    if (filterLayer !== 'all' && c.layer !== filterLayer) return false;
    if (filterStatus === 'attention') return c.status === 'fail' || c.status === 'warning';
    if (filterStatus === 'pass') return c.status === 'pass';
    return true;
  });

  // Key findings for summary panel
  const criticalFails  = allChecks.filter(c => c.status === 'fail'    && c.impact === 'critical');
  const importantFails = allChecks.filter(c => (c.status === 'fail' || c.status === 'warning') && c.impact === 'important');
  const topWins        = allChecks.filter(c => c.status === 'pass'    && (c.impact === 'critical' || c.impact === 'important'));

  return (
    <PageLayout>
      <div className="py-2">
        <PageHero
          title="Agentic Readiness Scanner"
          subtitle="Comprehensive 6-layer audit: AI agent discovery, MCP endpoints, HTTPS security, SEO & structured data, Open Graph, JSON-LD, and more. Free, no sign-up, deterministic."
        />

        <div className="max-w-3xl mx-auto -mt-3 mb-10">
          <AuthorByline links={[{ label: 'Interactive Tool' }]} />
        </div>

        {/* ── Search Bar ── */}
        <section className="max-w-3xl mx-auto mb-10">
          <form onSubmit={e => { e.preventDefault(); if (!urlInput.trim() || loading) return; executeScan(urlInput); }} className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter any domain or URL (e.g. stripe.com, github.com, veda.ng)..."
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base shadow-sm transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition shadow-sm"
            >
              {loading ? <><RefreshCw className="h-4 w-4 animate-spin" /><span>Scanning...</span></> : <><Sparkles className="h-4 w-4" /><span>Run Audit</span></>}
            </button>
          </form>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Try presets:</span>
            {PRESETS.map(p => (
              <button key={p.name} type="button" onClick={() => { setUrlInput(p.url); executeScan(p.url); }} disabled={loading}
                className="px-2.5 py-1 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-foreground/90 transition hover:border-foreground/30 font-mono"
              >{p.name}</button>
            ))}
          </div>
        </section>

        {/* ── Scanning Progress ── */}
        {loading && (
          <section className="max-w-2xl mx-auto my-12 p-8 rounded-2xl border border-border/70 bg-card/40 text-center backdrop-blur">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyzing {urlInput}</h3>
            <p className="text-sm font-mono text-primary min-h-[1.5rem] transition-all">{SCAN_STEPS[activeStepIndex]}</p>
            <div className="mt-6 w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500 rounded-full" style={{ width: `${((activeStepIndex + 1) / SCAN_STEPS.length) * 100}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Running 23 parallel probes across 6 audit layers…</p>
          </section>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <section className="max-w-2xl mx-auto my-8 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div><p className="font-semibold">Scan Failed</p><p className="mt-0.5 text-destructive/90">{error}</p></div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            RESULTS DASHBOARD
        ══════════════════════════════════════════════════════════════════ */}
        {result && !loading && (
          <section className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">

            {/* ── Score Banner ── */}
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shrink-0 shadow-inner ${
                  result.score >= 90 ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : result.score >= 75 ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  <span className="text-3xl font-extrabold tracking-tight">{result.score}</span>
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">Grade {result.grade}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold tracking-tight">{result.domain}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">{result.durationMs}ms</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xl leading-relaxed">{result.summary}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span>{allChecks.filter(c => c.status === 'pass').length} passing</span>
                    <span className="text-border">·</span>
                    <span className="text-amber-500">{allChecks.filter(c => c.status === 'warning').length} warnings</span>
                    <span className="text-border">·</span>
                    <span className="text-rose-500">{allChecks.filter(c => c.status === 'fail').length} failing</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                <button type="button" onClick={handleShareResult}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition">
                  {copiedShare ? <><Check className="h-4 w-4 text-emerald-500" /><span>Copied!</span></> : <><Copy className="h-4 w-4" /><span>Share Score</span></>}
                </button>
                <button type="button" onClick={() => executeScan(result.url, true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition">
                  <RefreshCw className="h-4 w-4" /><span>Re-scan (Fresh)</span>
                </button>
              </div>
            </div>

            {/* ── Capability Badges ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {[
                { label: 'MCP Server',      active: result.badges.mcpServer,      icon: Cpu },
                { label: 'llms.txt',        active: result.badges.llmsTxt,        icon: FileCode },
                { label: 'ARD Catalog',     active: result.badges.ardCatalog,     icon: Layers },
                { label: 'Markdown Twins',  active: result.badges.markdownTwins,  icon: Terminal },
                { label: 'OpenAPI 3.1',     active: result.badges.openapiSpec,    icon: Zap },
                { label: 'AI Bot Policy',   active: result.badges.aiBotFriendly,  icon: Shield },
                { label: 'HTTPS + HSTS',    active: result.badges.httpsSecure,    icon: Lock },
                { label: 'Structured Data', active: result.badges.structuredData, icon: BarChart3 },
              ].map(b => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition ${b.active ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300' : 'border-border/60 bg-card/40 text-muted-foreground/80'}`}>
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${b.active ? 'text-emerald-500' : 'text-muted-foreground/60'}`} />
                    <span className="truncate">{b.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ── Key Findings Panel ── */}
            {(criticalFails.length > 0 || importantFails.length > 0 || topWins.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* What needs attention */}
                {(criticalFails.length > 0 || importantFails.length > 0) && (
                  <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.03] space-y-3">
                    <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Priority Fixes ({(criticalFails.length + importantFails.length)} issues)
                    </h4>
                    <div className="space-y-2">
                      {[...criticalFails, ...importantFails].slice(0, 5).map(c => (
                        <div key={c.id} className="flex items-start gap-2">
                          {c.status === 'fail' ? <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                          <div>
                            <p className="text-xs font-semibold text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground leading-snug">{c.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => { setFilterStatus('attention'); setFilterLayer('all'); }}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium">
                      <span>View all issues with fix instructions</span><ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* What's working well */}
                {topWins.length > 0 && (
                  <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-3">
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Working Well ({topWins.length} checks passing)
                    </h4>
                    <div className="space-y-2">
                      {topWins.slice(0, 5).map(c => (
                        <div key={c.id} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground leading-snug">{c.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => { setFilterStatus('pass'); setFilterLayer('all'); }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium">
                      <span>View all passing checks</span><ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Layer Breakdown ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.layers.map(layer => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => { setFilterLayer(layer.id); setFilterStatus('all'); }}
                  className={`p-5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer ${filterLayer === layer.id ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-card/60 hover:border-border/80 hover:bg-card/80'} backdrop-blur`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm capitalize">{layer.name}</h4>
                      <span className="font-mono text-xs font-bold text-muted-foreground">{layer.score}/{layer.maxScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug">{layer.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${layer.percentage >= 80 ? 'bg-emerald-500' : layer.percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${layer.percentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[11px] text-muted-foreground">{layer.checks.filter(c => c.status === 'pass').length}/{layer.checks.length} checks pass</span>
                      <span className="text-[11px] font-mono text-muted-foreground">{layer.percentage}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* ══ Detailed Check Findings ══ */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 border-b border-border pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-bold tracking-tight">Detailed Findings & Fix Guidance</h3>
                  {/* Status filter */}
                  <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
                    {[
                      { key: 'all',       label: `All (${allChecks.length})` },
                      { key: 'attention', label: `Needs Fix (${allChecks.filter(c => c.status === 'fail' || c.status === 'warning').length})` },
                      { key: 'pass',      label: `Passed (${allChecks.filter(c => c.status === 'pass').length})` },
                    ].map(f => (
                      <button key={f.key} type="button" onClick={() => setFilterStatus(f.key)}
                        className={`px-2.5 py-1 rounded-md transition font-medium whitespace-nowrap ${filterStatus === f.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer filter chips */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {(['all', 'discovery', 'access', 'usability', 'security', 'seo'] as const).map(layer => {
                    const labels: Record<string, string> = {
                      all: 'All Layers', discovery: '🔍 Discovery', access: '📡 Access',
                      usability: '🤖 Usability & MCP', security: '🔒 Security', seo: '📊 SEO & Content',
                    };
                    return (
                      <button key={layer} type="button" onClick={() => setFilterLayer(layer)}
                        className={`px-2.5 py-1 rounded-full border font-medium transition ${filterLayer === layer ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/70 bg-muted/30 text-muted-foreground hover:border-foreground/30'}`}>
                        {labels[layer]}
                      </button>
                    );
                  })}
                </div>

                {/* Active filter hint */}
                {(filterLayer !== 'all' || filterStatus !== 'all') && (
                  <p className="text-xs text-muted-foreground">
                    Showing {filteredChecks.length} of {allChecks.length} checks.{' '}
                    <button type="button" onClick={() => { setFilterLayer('all'); setFilterStatus('all'); }} className="text-primary hover:underline">Clear filters</button>
                  </p>
                )}
              </div>

              {filteredChecks.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No checks match this filter. <button type="button" onClick={() => { setFilterLayer('all'); setFilterStatus('all'); }} className="text-primary hover:underline">Clear filters</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredChecks.map(check => (
                    <CheckCard
                      key={check.id}
                      check={check}
                      defaultExpanded={check.status === 'fail'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── Machine API Banner ── */}
            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-sm space-y-3">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Automate Scans via REST API & MCP Server
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Run agent-readiness audits programmatically in CI/CD pipelines, autonomous agent workflows, or via Claude and ChatGPT with the <code className="text-xs bg-muted px-1.5 py-0.5 rounded">scan_agent_readiness</code> MCP tool.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <code className="block p-2.5 rounded-lg bg-card/80 border border-border font-mono text-xs text-foreground/90">
                  POST https://veda.ng/api/v1/scan &#123; &quot;url&quot;: &quot;example.com&quot; &#125;
                </code>
                <code className="block p-2.5 rounded-lg bg-card/80 border border-border font-mono text-xs text-foreground/90">
                  GET https://veda.ng/api/v1/scan?url=example.com
                </code>
              </div>
              <div className="pt-2 flex items-center gap-4 text-xs font-medium text-primary">
                <Link href="/developers" className="hover:underline flex items-center gap-1"><span>API Documentation</span><ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link href="/aistandards" className="hover:underline flex items-center gap-1"><span>AI Discovery Standards</span><ArrowRight className="h-3.5 w-3.5" /></Link>
                <Link href="/sitecheck" className="hover:underline flex items-center gap-1"><span>Site Checklist</span><ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
