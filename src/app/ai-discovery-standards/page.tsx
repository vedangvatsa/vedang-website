import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  FileText,
  Shield,
  Bot,
  Globe,
  Terminal,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Search,
  Code,
  Layers,
} from 'lucide-react';

const DISCOVERY_FILES = [
  { name: 'robots.txt', desc: 'Crawler access policies for 25+ AI bots', category: 'Access Control', icon: Shield },
  { name: 'llms.txt', desc: 'Curated content summary for LLMs', category: 'Content Discovery', icon: FileText },
  { name: 'llms-full.txt', desc: 'Full-text content for AI ingestion', category: 'Content Discovery', icon: FileText },
  { name: 'ai.txt', desc: 'AI usage permissions (training, citation, indexing)', category: 'Permissions', icon: Shield },
  { name: 'ai.json', desc: 'Structured content map for AI agents', category: 'Permissions', icon: Code },
  { name: 'brand.txt', desc: 'Brand governance rules for AI systems', category: 'Brand', icon: Globe },
  { name: 'ai-plugin.json', desc: 'ChatGPT plugin manifest', category: 'Agent Discovery', icon: Bot },
  { name: 'agents.json', desc: 'A2A agent capability advertisement', category: 'Agent Discovery', icon: Bot },
  { name: 'security.txt', desc: 'Vulnerability reporting (RFC 9116)', category: 'Trust', icon: Shield },
  { name: 'humans.txt', desc: 'Team credits and technologies', category: 'Trust', icon: BookOpen },
  { name: 'sitemap.xml', desc: 'URL index with metadata', category: 'Content Discovery', icon: Layers },
  { name: 'manifest.json', desc: 'PWA metadata and icons', category: 'Platform', icon: Globe },
  { name: 'browserconfig.xml', desc: 'Windows tile configuration', category: 'Platform', icon: Globe },
];

const AI_CRAWLERS = [
  { company: 'OpenAI', bots: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'] },
  { company: 'Anthropic', bots: ['ClaudeBot', 'Claude-SearchBot', 'Claude-User'] },
  { company: 'Google', bots: ['Googlebot', 'Google-Extended', 'GoogleOther'] },
  { company: 'Perplexity', bots: ['PerplexityBot', 'Perplexity-User'] },
  { company: 'Meta', bots: ['meta-externalagent', 'meta-externalfetcher'] },
  { company: 'Apple', bots: ['Applebot', 'Applebot-Extended'] },
  { company: 'Amazon', bots: ['Amazonbot'] },
  { company: 'ByteDance', bots: ['Bytespider', 'TikTokSpider'] },
  { company: 'Others', bots: ['CCBot', 'cohere-ai', 'CopilotBot', 'YouBot', 'Diffbot'] },
];

const FAQS = [
  {
    q: 'What is llms.txt?',
    a: 'A Markdown file at /llms.txt that gives LLMs a curated summary of your site. It includes a title, a one-paragraph description, and organized links to your key pages. Created by Jeremy Howard (Answer.AI) in 2024. Adopted by Anthropic, Stripe, Vercel, and Cloudflare.',
  },
  {
    q: 'What is the difference between AEO and GEO?',
    a: 'AEO (Answer Engine Optimization) targets question-answer extraction by AI systems like ChatGPT and Perplexity. GEO (Generative Engine Optimization) targets citation rate and "Share of AI Voice" across all AI platforms. AEO is about being the answer. GEO is about being the cited source.',
  },
  {
    q: 'Which AI crawlers should I allow?',
    a: 'Separate training bots (GPTBot, ClaudeBot, Google-Extended) from search bots (OAI-SearchBot, Claude-SearchBot, PerplexityBot). Blocking training bots prevents your content from being absorbed into model weights. Blocking search bots removes you from AI-generated answers entirely.',
  },
  {
    q: 'What is brand.txt?',
    a: 'A plain-text file that tells AI systems how to represent your brand: correct name capitalization, preferred terminology, prohibited terms, tone guidance, and competitor disambiguation. Reduces hallucinations about your brand identity.',
  },
  {
    q: 'What is ai.txt?',
    a: 'A plain-text file declaring what AI systems may do with your content: training, indexing, citation, or summarization. Works alongside robots.txt but with AI-specific granularity. Not yet standardized but gaining adoption.',
  },
];

export default function AiDiscoveryStandardsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-16 sm:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
              <Bot className="h-4 w-4" />
              Open-Source Project
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              AI Discovery Standards
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every file, protocol, and technique used to make websites discoverable by AI systems, search engines, and autonomous agents. One command to set up everything.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href="https://github.com/vedangvatsa/ai-discovery-standards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="rounded-md border border-border bg-card px-4 py-3 font-mono text-sm">
                npx ai-discovery-standards
              </div>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="py-12 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold tracking-tight">What it does</h2>
            <p className="text-muted-foreground leading-relaxed">
              Run one command and generate 13 AI discovery files for any web project. The CLI tool auto-detects your <code className="text-sm bg-card px-1.5 py-0.5 rounded border border-border">public/</code> or <code className="text-sm bg-card px-1.5 py-0.5 rounded border border-border">static/</code> directory, asks for your site details, and creates every file you need. Existing files are never overwritten.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Terminal, title: 'One-command setup', desc: 'npx ai-discovery-standards generates all 13 files' },
                { icon: Shield, title: '25+ AI crawlers', desc: 'Complete robots.txt with every known AI bot' },
                { icon: Search, title: 'AEO & GEO guides', desc: 'Answer Engine and Generative Engine optimization' },
                { icon: Code, title: 'Claude Code skill', desc: 'Slash command for AI-assisted setup' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card/50">
                  <item.icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Discovery Files Table */}
        <section className="py-12 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Discovery Files</h2>
            <p className="text-muted-foreground">
              Static files you place on your web server to communicate with AI crawlers and agents.
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card border-b border-border">
                    <th className="text-left px-4 py-3 font-medium">File</th>
                    <th className="text-left px-4 py-3 font-medium">Purpose</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {DISCOVERY_FILES.map((file, i) => (
                    <tr key={file.name} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-card/30'}`}>
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <file.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {file.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{file.desc}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex text-xs rounded-full border border-border px-2 py-0.5">
                          {file.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* AI Crawlers */}
        <section className="py-12 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">AI Crawler Registry</h2>
            <p className="text-muted-foreground">
              All known AI crawler user-agent strings as of April 2026, organized by company.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_CRAWLERS.map((group) => (
                <div key={group.company} className="rounded-lg border border-border p-4 bg-card/50">
                  <h3 className="font-medium text-sm mb-2">{group.company}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.bots.map((bot) => (
                      <code key={bot} className="text-xs bg-background px-2 py-1 rounded border border-border">
                        {bot}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group rounded-lg border border-border bg-card/50">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Get started</h2>
            <div className="rounded-lg border border-border bg-card p-6 max-w-lg mx-auto space-y-4">
              <div className="font-mono text-sm bg-background rounded-md p-4 text-left border border-border">
                <span className="text-muted-foreground">$</span> npx ai-discovery-standards
              </div>
              <p className="text-sm text-muted-foreground">
                Generates all 13 discovery files interactively. Auto-detects your project structure.
              </p>
              <a
                href="https://github.com/vedangvatsa/ai-discovery-standards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Full documentation on GitHub
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
