export const dynamic = 'force-dynamic';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Automation 101 - Automate Anything with AI Agents | Vedang Vatsa',
  description: 'Free course on AI-powered automation. Learn to build pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools. From social media broadcasting to data pipelines.',
  keywords: ['AI Automation', 'n8n', 'MCP Automation', 'AI Agents', 'API Automation', 'Zapier Alternative', 'No-Code AI', 'Workflow Automation', 'Telegram Bot'],
  openGraph: {
    title: 'AI Automation 101 - Automate Anything with AI',
    description: 'Free course on building automated pipelines with AI agents, APIs, MCP servers, and no-code tools.',
    url: 'https://veda.ng/ai-automation',
    type: 'website',
  },
};

const referenceLinks = [
    {
        name: 'No-Code Tools',
        links: [
            { name: 'n8n (Open Source)', url: 'https://n8n.io' },
            { name: 'Make (Integromat)', url: 'https://make.com' },
            { name: 'Zapier', url: 'https://zapier.com' },
            { name: 'Pipedream', url: 'https://pipedream.com' },
        ]
    },
    {
        name: 'AI APIs',
        links: [
            { name: 'Anthropic (Claude)', url: 'https://docs.anthropic.com' },
            { name: 'OpenAI API', url: 'https://platform.openai.com/docs' },
            { name: 'Google Gemini API', url: 'https://ai.google.dev' },
        ]
    },
    {
        name: 'Infrastructure',
        links: [
            { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions' },
            { name: 'Vercel Cron Jobs', url: 'https://vercel.com/docs/cron-jobs' },
            { name: 'Supabase', url: 'https://supabase.com' },
            { name: 'Resend (Email API)', url: 'https://resend.com' },
        ]
    },
    {
        name: 'Related Courses',
        links: [
            { name: 'MCP Development 101', url: '/mcp-development' },
            { name: 'Prompt Engineering 101', url: '/prompt-engineering-101' },
            { name: 'Vibe Coding 101', url: '/vibe-coding' },
            { name: 'The Agentic Web', url: '/agentic-web' },
        ]
    },
];

const faqItems = [
  { question: "Do I need coding experience?", answer: "Modules 1-3 are fully no-code. Modules 4-7 include code examples but are designed to be followed with AI assistance, and you can use Vibe Coding techniques to build automations even without deep coding skills." },
  { question: "Is this course just about n8n and Zapier?", answer: "No. This course covers the full automation spectrum: no-code tools (n8n, Make, Zapier), raw API integration, AI agents (Claude, Antigravity, GPT), and MCP-powered automation. The goal is to know when to use each approach." },
  { question: "What's the difference between this and the MCP Development course?", answer: "MCP Development teaches you to build MCP servers from scratch. This course teaches you to use MCP servers (and other tools) as building blocks for automated workflows. They're complementary. MCP Dev is 'build the tools,' this course is 'use the tools.'" },
  { question: "Can I automate social media posting?", answer: "Yes. Module 4 covers social media automation in detail, including Telegram broadcasting, Twitter/X threads, LinkedIn posts, content repurposing pipelines, and community engagement automation." },
  { question: "How much does it cost to run automations?", answer: "Many automations run for free: GitHub Actions has 2,000 free minutes/month, Supabase and Vercel have generous free tiers, and n8n is free to self-host. AI API costs are typically $1-10/month for moderate usage. Module 7 covers cost optimization in detail." },
  { question: "What real-world examples are included?", answer: "The course includes case studies from actual production systems: job aggregation pipelines that process 300+ listings daily, social media broadcasting to Telegram channels, content publishing workflows, competitor tracking, and data quality automation." },
];

const courseSchema = {
  '@context': 'https://schema.org', '@type': 'Course',
  name: 'AI Automation 101',
  description: 'A free, self-paced course on building AI-powered automations with agents, APIs, MCP servers, and no-code tools.',
  url: 'https://veda.ng/ai-automation',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true, educationalLevel: 'Beginner to Intermediate',
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', instructor: { '@type': 'Person', name: 'Vedang Vatsa' } },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function AIAutomationCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="text-left pt-8 pb-12">
        <div className="max-w-none">
          <Badge variant="secondary"><Star className="w-3 h-3 mr-1.5" />A Free, Self-Paced Course</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">AI Automation 101</h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
            Automate anything with AI agents, APIs, MCP servers, and no-code tools. From social media broadcasting to data pipelines. build systems that run 24/7 without you.
          </p>
          <div className="mt-8 flex flex-wrap justify-start items-center gap-4">
            <Badge variant="outline">By: Vedang Vatsa</Badge>
            <Badge variant="outline">Prerequisite: None</Badge>
            <Badge variant="outline">7 Modules</Badge>
          </div>
          <div className="mt-8 flex justify-start">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/ai-automation/module-1-mindset">Start Course <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
        <div className="max-w-none">
          <div className="text-left mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
            <p className="mt-2 text-muted-foreground">Seven modules covering no-code, APIs, AI agents, MCP, and production pipelines.</p>
          </div>
          <div className="space-y-4">
            {[
              { href: 'module-1-mindset', title: '1. The Automation Mindset', desc: 'Identify automation opportunities, think in workflows, and choose the right tool for every job.' },
              { href: 'module-2-apis', title: '2. API Fundamentals', desc: 'REST APIs, authentication, webhooks, pagination: the building blocks every automation uses.' },
              { href: 'module-3-nocode', title: '3. No-Code Automation', desc: 'Build powerful workflows with n8n, Make, and Zapier. add AI nodes for intelligent processing.' },
              { href: 'module-4-agents', title: '4. AI Agents as Automators', desc: 'Use Claude, Antigravity, and GPT as autonomous workflow executors for social media and beyond.' },
              { href: 'module-5-mcp-automation', title: '5. MCP-Powered Automation', desc: 'Connect AI agents to Google Sheets, databases, Slack, and any service via MCP servers.' },
              { href: 'module-6-pipelines', title: '6. Building Custom Pipelines', desc: 'Combine APIs + AI + MCP into end-to-end systems: job aggregation, content publishing, data quality.' },
              { href: 'module-7-production', title: '7. Production & Monitoring', desc: 'Scheduling with cron/GitHub Actions, monitoring, alerting, cost management, and scaling.' },
            ].map((m) => (
              <Link key={m.href} href={`/ai-automation/${m.href}`} className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="references" className="py-16">
        <div className="text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Tools & Resources</h2>
          <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">Platforms, APIs, and related courses referenced throughout the curriculum.</p>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {referenceLinks.map((tool) => (
            <div key={tool.name} className="break-inside-avoid">
              <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
              <ul className="space-y-2">
                {tool.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.url} target={link.url.startsWith('/') ? undefined : '_blank'} rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'} className="flex items-center text-sm text-muted-foreground hover:text-primary group">
                      {link.name}
                      {!link.url.startsWith('/') && <ExternalLink className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="py-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">Common questions about AI automation answered directly.</p>
        </div>
        <div className="max-w-5xl mx-auto mt-12">
          <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`faq-${index + 1}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
