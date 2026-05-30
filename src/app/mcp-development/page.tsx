export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

export const metadata: Metadata = {
  title: { absolute: 'MCP Development - Build AI Tool Servers | Vedang Vatsa' },
  description: 'Free course on building MCP (Model Context Protocol) servers. Learn to create tools that connect AI models to databases, APIs, and any data source.',
  keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude', 'Cursor', 'TypeScript', 'JSON-RPC', 'Anthropic'],
  alternates: { canonical: '/mcp-development' },
  openGraph: {
    title: 'MCP Development - Build AI Tool Servers',
    description: 'Free course on building MCP servers that connect AI to databases, APIs, and any data source.',
    url: 'https://veda.ng/mcp-development',
    type: 'website',
  },
};

const curriculumItems = [
  { href: '/mcp-development/module-1-what-is-mcp', title: '1. What is MCP?', description: 'The universal connector for AI. understand the problem, architecture, and why it matters now.' },
  { href: '/mcp-development/module-2-transports', title: '2. Transports & Message Format', description: 'JSON-RPC, stdio, SSE, and Streamable HTTP. how data flows between clients and servers.' },
  { href: '/mcp-development/module-3-first-server', title: '3. Building Your First MCP Server', description: 'Set up a TypeScript project, register a tool, test with MCP Inspector, connect to Claude Desktop.' },
  { href: '/mcp-development/module-4-primitives', title: '4. Tools, Resources & Prompts', description: 'The three MCP primitives. when to use each, who controls them, and design best practices.' },
  { href: '/mcp-development/module-5-clients', title: '5. Connecting to Clients', description: 'Configure Claude Desktop, Cursor, VS Code, and build your own custom MCP client.' },
  { href: '/mcp-development/module-6-real-world', title: '6. Real-World MCP Servers', description: 'Build database, API wrapper, multi-tool, and authenticated server patterns.' },
  { href: '/mcp-development/module-7-production', title: '7. Production, Security & Distribution', description: 'Error handling, security hardening, npm publishing, monitoring, and the MCP registry.' },
];

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
  name: 'MCP Development',
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

      <CourseHero
        title="MCP Development"
        subtitle="Build servers that connect AI to anything. Learn the Model Context Protocol, the open standard that lets AI models use tools, query databases, and interact with APIs. The USB-C port for AI."
      />

      <CurriculumSection
        description="Seven modules to go from zero to production MCP server."
        items={curriculumItems}
      />

      <CourseReferences
        title="Learn More"
        subtitle="Official documentation, SDKs, and community resources for MCP development."
        categories={referenceLinks}
        layout="grid-4"
      />

      <CourseFAQ
        subtitle="Common questions about MCP development answered directly."
        items={faqItems}
      />
    </div>
  );
}
