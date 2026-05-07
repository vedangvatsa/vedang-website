export const dynamic = 'force-dynamic';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: { absolute: 'MCP Development 101 - Build AI Tool Servers | Vedang Vatsa' },
  description: 'Free course on building MCP (Model Context Protocol) servers. Learn to create tools that connect AI models to databases, APIs, and any data source.',
  keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude', 'Cursor', 'TypeScript', 'JSON-RPC', 'Anthropic'],
  alternates: { canonical: '/mcp-development' },
  openGraph: {
    title: 'MCP Development 101 - Build AI Tool Servers',
    description: 'Free course on building MCP servers that connect AI to databases, APIs, and any data source.',
    url: 'https://veda.ng/mcp-development',
    type: 'website',
  },
};

const referenceLinks = [
    { 
        name: 'Official MCP',
        links: [
            { name: 'MCP Specification', url: 'https://spec.modelcontextprotocol.io' },
            { name: 'MCP Documentation', url: 'https://modelcontextprotocol.io/docs' },
            { name: 'MCP TypeScript SDK', url: 'https://github.com/modelcontextprotocol/typescript-sdk' },
            { name: 'MCP Python SDK', url: 'https://github.com/modelcontextprotocol/python-sdk' },
        ]
    },
    { 
        name: 'Tools & Registries',
        links: [
            { name: 'MCP Inspector', url: 'https://github.com/modelcontextprotocol/inspector' },
            { name: 'Smithery (MCP Registry)', url: 'https://smithery.ai' },
            { name: 'MCP.run', url: 'https://mcp.run' },
        ]
    },
    { 
        name: 'Client Documentation',
        links: [
            { name: 'Claude Desktop MCP Guide', url: 'https://modelcontextprotocol.io/quickstart/user' },
            { name: 'Cursor MCP Docs', url: 'https://docs.cursor.com/context/model-context-protocol' },
            { name: 'VS Code MCP Support', url: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers' },
        ]
    },
    {
        name: 'Example Servers',
        links: [
            { name: 'Official MCP Servers Repo', url: 'https://github.com/modelcontextprotocol/servers' },
            { name: 'Awesome MCP Servers', url: 'https://github.com/punkpeye/awesome-mcp-servers' },
        ],
    },
];

const faqItems = [
  {
    question: "Do I need to know TypeScript?",
    answer: "Basic TypeScript or JavaScript knowledge helps, but you don't need to be an expert. The MCP SDK handles most complexity. If you've completed the Vibe Coding course, you have enough foundation to follow along."
  },
  {
    question: "Can I build MCP servers in Python?",
    answer: "Yes! MCP has official SDKs for both TypeScript and Python. This course uses TypeScript because it's the most commonly used in the ecosystem, but the concepts are identical. The Python SDK uses the same architecture and primitives."
  },
  {
    question: "Is MCP only for Anthropic/Claude?",
    answer: "No. MCP is an open standard adopted across the industry. It works with Claude, Cursor, VS Code (GitHub Copilot), Windsurf, Antigravity, and any custom application. Building an MCP server means your tools work everywhere."
  },
  {
    question: "How is MCP different from function calling?",
    answer: "Function calling is a feature of individual LLMs (like OpenAI's or Claude's). MCP is a protocol that standardizes how tools are discovered, described, and invoked across any LLM and any client. Think of function calling as the engine and MCP as the highway system."
  },
  {
    question: "Can I monetize MCP servers?",
    answer: "Yes. You can publish paid MCP servers, offer them as part of a SaaS product, or build custom servers as a freelance service. The demand for MCP development is growing rapidly as more companies adopt AI tooling."
  },
  {
    question: "What's the difference between MCP and API development?",
    answer: "MCP servers are essentially specialized APIs designed for AI consumption. The key differences are: (1) tools include natural language descriptions that help LLMs understand when to use them, (2) the protocol handles discovery and capability negotiation automatically, and (3) the response format is optimized for LLM processing."
  },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'MCP Development 101',
  description: 'A free, self-paced course on building MCP (Model Context Protocol) servers. Learn to create tools that connect AI models to databases, APIs, and any data source.',
  url: 'https://veda.ng/mcp-development',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Intermediate',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function MCPDevelopmentCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="text-left pt-8 pb-12">
             <div className="max-w-none">
                <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1.5" />
                    A Free, Self-Paced Course
                </Badge>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    MCP Development 101
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
                Build servers that connect AI to anything. Learn the Model Context Protocol, the open standard that lets AI models use tools, query databases, and interact with APIs. The USB-C port for AI.
                </p>

                <div className="mt-8 flex flex-wrap justify-start items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: Basic TypeScript</Badge>
                    <Badge variant="outline">7 Modules</Badge>
                </div>

                <div className="mt-8 flex justify-start">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/mcp-development/module-1-what-is-mcp">
                            Start Course <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="max-w-none">
                <div className="text-left mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
                    <p className="mt-2 text-muted-foreground">Seven modules to go from zero to production MCP server.</p>
                </div>
                <div className="space-y-4">
                    <Link href="/mcp-development/module-1-what-is-mcp" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">1. What is MCP?</h3>
                                <p className="text-sm text-muted-foreground mt-1">The universal connector for AI. understand the problem, architecture, and why it matters now.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-2-transports" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">2. Transports & Message Format</h3>
                                <p className="text-sm text-muted-foreground mt-1">JSON-RPC, stdio, SSE, and Streamable HTTP. how data flows between clients and servers.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-3-first-server" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">3. Building Your First MCP Server</h3>
                                <p className="text-sm text-muted-foreground mt-1">Set up a TypeScript project, register a tool, test with MCP Inspector, connect to Claude Desktop.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-4-primitives" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">4. Tools, Resources & Prompts</h3>
                                <p className="text-sm text-muted-foreground mt-1">The three MCP primitives. when to use each, who controls them, and design best practices.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-5-clients" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">5. Connecting to Clients</h3>
                                <p className="text-sm text-muted-foreground mt-1">Configure Claude Desktop, Cursor, VS Code, and build your own custom MCP client.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-6-real-world" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">6. Real-World MCP Servers</h3>
                                <p className="text-sm text-muted-foreground mt-1">Build database, API wrapper, multi-tool, and authenticated server patterns.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/mcp-development/module-7-production" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">7. Production, Security & Distribution</h3>
                                <p className="text-sm text-muted-foreground mt-1">Error handling, security hardening, npm publishing, monitoring, and the MCP registry.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>

        <section id="references" className="py-16">
            <div className="text-left mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Learn More</h2>
                <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
                    Official documentation, SDKs, and community resources for MCP development.
                </p>
            </div>
             
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {referenceLinks.map((tool) => (
                    <div key={tool.name} className="break-inside-avoid">
                        <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                        <ul className="space-y-2">
                            {tool.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary group">
                                        {link.name}
                                        <ExternalLink className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
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
                <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Common questions about MCP development answered directly.
                </p>
            </div>
            <div className="max-w-5xl mx-auto mt-12">
                <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8">
                   {faqItems.map((item, index) => (
                     <AccordionItem key={index} value={`faq-${index + 1}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                   ))}
                </Accordion>
            </div>
        </section>
    </div>
  );
}
