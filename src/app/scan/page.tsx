'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { ScanResult } from '@/lib/scanner/types';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Shield,
  FileCode,
  Terminal,
  Layers,
  Cpu,
  Zap,
  Lock,
  BarChart3,
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

export default function ScanPage() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Auto-scan if query param url is provided
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qUrl = params.get('url') || params.get('domain') || params.get('q');
    if (qUrl && !result && !loading) {
      setUrlInput(qUrl);
      executeScan(qUrl);
    }
  }, []);

  // Step cycling animation during scan
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 450);
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
        throw new Error(data.error?.message || data.error || 'Failed to scan domain');
      }

      startTransition(() => {
        setResult(data);
        // Sync URL query string without page reload
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('url', data.domain);
        window.history.replaceState({}, '', newUrl.toString());
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while scanning.');
    } finally {
      setLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim() || loading) return;
    executeScan(urlInput);
  }

  function handleCopySnippet(id: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  }

  function handleShareResult() {
    if (!result) return;
    const text = `I audited ${result.domain} on the Agentic Readiness Scanner (veda.ng/scan) and scored ${result.score}/100 (Grade ${result.grade})!\n\nCheck yours: https://veda.ng/scan?url=${encodeURIComponent(result.domain)}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  }

  const allChecks = result?.layers.flatMap((l) => l.checks) || [];
  const filteredChecks = allChecks.filter((c) => {
    if (filterLayer !== 'all' && c.layer !== filterLayer) return false;
    if (filterStatus === 'attention') return c.status === 'fail' || c.status === 'warning';
    if (filterStatus === 'pass') return c.status === 'pass';
    return true;
  });

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

        {/* ─── Search Bar Section ─── */}
        <section className="max-w-3xl mx-auto mb-10">
          <form onSubmit={handleFormSubmit} className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter any domain or URL (e.g. stripe.com, github.com, veda.ng)..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-card/60 backdrop-blur text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base shadow-sm transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Run Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Try presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setUrlInput(p.url);
                  executeScan(p.url);
                }}
                disabled={loading}
                className="px-2.5 py-1 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-foreground/90 transition hover:border-foreground/30 font-mono"
              >
                {p.name}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Scanning Progress State ─── */}
        {loading && (
          <section className="max-w-2xl mx-auto my-12 p-8 rounded-2xl border border-border/70 bg-card/40 text-center animate-pulse backdrop-blur">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Agent Readiness for {urlInput}</h3>
            <p className="text-sm font-mono text-primary min-h-[1.5rem]">
              {SCAN_STEPS[activeStepIndex]}
            </p>
            <div className="mt-6 w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
              />
            </div>
          </section>
        )}

        {/* ─── Error Alert ─── */}
        {error && !loading && (
          <section className="max-w-2xl mx-auto my-8 p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Scan Failed</p>
              <p className="mt-0.5 text-destructive/90">{error}</p>
            </div>
          </section>
        )}

        {/* ─── Result Dashboard ─── */}
        {result && !loading && (
          <section className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Top Score Banner */}
            <div className="p-6 md:p-8 rounded-2xl border border-border bg-card/80 backdrop-blur shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Score Gauge Circle */}
                <div
                  className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shrink-0 shadow-inner ${
                    result.score >= 90
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : result.score >= 75
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  <span className="text-3xl font-extrabold tracking-tight">{result.score}</span>
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                    Grade {result.grade}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold tracking-tight">{result.domain}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground">
                      {result.durationMs}ms
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xl leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleShareResult}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition"
                >
                  {copiedShare ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedShare ? 'Copied Summary!' : 'Share Score'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => executeScan(result.url, true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-scan (Bypass Cache)</span>
                </button>
              </div>
            </div>

            {/* Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {[
                { label: 'MCP Server', active: result.badges.mcpServer, icon: Cpu },
                { label: 'llms.txt', active: result.badges.llmsTxt, icon: FileCode },
                { label: 'ARD Catalog', active: result.badges.ardCatalog, icon: Layers },
                { label: 'Markdown Twins', active: result.badges.markdownTwins, icon: Terminal },
                { label: 'OpenAPI 3.1', active: result.badges.openapiSpec, icon: Zap },
                { label: 'AI Bot Policy', active: result.badges.aiBotFriendly, icon: Shield },
                { label: 'HTTPS + HSTS', active: result.badges.httpsSecure, icon: Lock },
                { label: 'Structured Data', active: result.badges.structuredData, icon: BarChart3 },
              ].map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.label}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition ${
                      b.active
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                        : 'border-border/60 bg-card/40 text-muted-foreground/80'
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 shrink-0 ${b.active ? 'text-emerald-500' : 'text-muted-foreground/60'}`} />
                    <span className="truncate">{b.label}</span>
                  </div>
                );
              })}
            </div>

            {/* ─── Layer Breakdown Cards ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.layers.map((layer) => (
                <div
                  key={layer.id}
                  className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm capitalize">{layer.name}</h4>
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        {layer.score}/{layer.maxScore}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {layer.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          layer.percentage >= 80
                            ? 'bg-emerald-500'
                            : layer.percentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${layer.percentage}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground mt-1.5 block text-right">
                      {layer.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Granular Check Results ─── */}
            <div className="space-y-4">
              <div className="flex flex-col gap-3 border-b border-border pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-bold tracking-tight">Audit Findings & Fix Guidance</h3>
                  {/* Status Filter */}
                  <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border text-xs">
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-1 rounded-md transition font-medium ${
                        filterStatus === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      All ({allChecks.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('attention')}
                      className={`px-2.5 py-1 rounded-md transition font-medium ${
                        filterStatus === 'attention' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      Needs Action ({allChecks.filter((c) => c.status === 'fail' || c.status === 'warning').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('pass')}
                      className={`px-2.5 py-1 rounded-md transition font-medium ${
                        filterStatus === 'pass' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                      }`}
                    >
                      Passed ({allChecks.filter((c) => c.status === 'pass').length})
                    </button>
                  </div>
                </div>

                {/* Layer Filter Chips */}
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {(['all', 'discovery', 'access', 'usability', 'security', 'seo'] as const).map((layer) => {
                    const labels: Record<string, string> = {
                      all: 'All Layers',
                      discovery: '🔍 Discovery',
                      access: '📡 Access',
                      usability: '🤖 Usability & MCP',
                      security: '🔒 Security',
                      seo: '📊 SEO & Content',
                    };
                    return (
                      <button
                        key={layer}
                        type="button"
                        onClick={() => setFilterLayer(layer)}
                        className={`px-2.5 py-1 rounded-full border font-medium transition ${
                          filterLayer === layer
                            ? 'border-primary/60 bg-primary/10 text-primary'
                            : 'border-border/70 bg-muted/30 text-muted-foreground hover:border-foreground/30'
                        }`}
                      >
                        {labels[layer]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Check Items List */}
              <div className="space-y-3">
                {filteredChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-border/80 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {check.status === 'pass' && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'warning' && (
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'fail' && (
                          <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'na' && (
                          <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm sm:text-base text-foreground">
                              {check.name}
                            </h4>
                            <span className="text-[11px] uppercase tracking-wider font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              {check.layer}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                            {check.details}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {check.score}/{check.maxScore} pts
                        </span>
                      </div>
                    </div>

                    {/* Recommendation & Code Fix Snippet */}
                    {check.recommendation && (
                      <div className="mt-3 pl-8 text-xs sm:text-sm space-y-2.5">
                        <div className="p-3 rounded-lg border border-border/80 bg-muted/40 text-foreground/90">
                          <span className="font-semibold text-primary">Recommendation: </span>
                          <span>{check.recommendation}</span>
                          {check.referenceUrl && (
                            <Link
                              href={check.referenceUrl}
                              className="ml-2 inline-flex items-center gap-0.5 text-primary hover:underline underline-offset-2 font-medium"
                            >
                              <span>Read guide</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>

                        {check.fixSnippet && (
                          <div className="rounded-lg border border-border overflow-hidden bg-zinc-950 text-zinc-100 font-mono text-xs shadow-inner">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                              <span>{check.fixSnippet.filename || 'Code Snippet'}</span>
                              <button
                                type="button"
                                onClick={() => handleCopySnippet(check.id, check.fixSnippet!.code)}
                                className="inline-flex items-center gap-1 hover:text-zinc-200 transition"
                              >
                                {copiedCodeId === check.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 overflow-x-auto text-zinc-200 leading-relaxed">
                              <code>{check.fixSnippet.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Machine & API Integration Banner ─── */}
            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 text-sm space-y-3">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <span>Automate Scans with the veda.ng REST API & MCP Server</span>
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Run agent-readiness scans programmatically in CI/CD pipelines, autonomous agent workflows, or via ChatGPT and Claude with our keyless machine interfaces.
              </p>
              <div className="flex flex-wrap gap-3 pt-1 font-mono text-xs">
                <div className="p-2 rounded-lg bg-card/80 border border-border">
                  <code>POST https://veda.ng/api/v1/scan &#123; &quot;url&quot;: &quot;example.com&quot; &#125;</code>
                </div>
                <div className="p-2 rounded-lg bg-card/80 border border-border">
                  <code>MCP Tool: scan_agent_readiness</code>
                </div>
              </div>
              <div className="pt-2 flex items-center gap-4 text-xs font-medium text-primary">
                <Link href="/developers" className="hover:underline flex items-center gap-1">
                  <span>View API Documentation</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/aistandards" className="hover:underline flex items-center gap-1">
                  <span>AI Discovery Standards</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link href="/sitecheck" className="hover:underline flex items-center gap-1">
                  <span>Website Checklist</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
