export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

export const metadata: Metadata = {
  title: { absolute: 'MCP Development - Build AI Tool Servers | Vedang Vatsa' },
  description: 'Free course on building MCP (Model Context Protocol) servers. Learn to create tools that connect AI models to databases, APIs, and any data source.',
  keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude', 'Cursor', 'TypeScript', 'JSON-RPC', 'Anthropic', 'Vedang Vatsa', 'Vedang Vatsa MCP'],
  alternates: { canonical: '/mcp' },
  openGraph: {
    title: 'MCP Development - Build AI Tool Servers',
    description: 'Free course on building MCP servers that connect AI to databases, APIs, and any data source.',
    url: 'https://veda.ng/mcp',
    type: 'website',
    images: [{ url: '/mcp/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/mcp/opengraph-image.png'],
  },
};

const curriculumItems = [
  { href: '/mcp/module-1-what-is-mcp', title: '1. What is MCP?', description: 'The universal connector for AI. understand the problem, architecture, and why it matters now.' },
  { href: '/mcp/module-2-transports', title: '2. Transports & Message Format', description: 'JSON-RPC, stdio, SSE, and Streamable HTTP. how data flows between clients and servers.' },
  { href: '/mcp/module-3-first-server', title: '3. Building Your First MCP Server', description: 'Set up a TypeScript project, register a tool, test with MCP Inspector, connect to Claude Desktop.' },
  { href: '/mcp/module-4-primitives', title: '4. Tools, Resources & Prompts', description: 'The three MCP primitives. when to use each, who controls them, and design best practices.' },
  { href: '/mcp/module-5-clients', title: '5. Connecting to Clients', description: 'Configure Claude Desktop, Cursor, VS Code, and build your own custom MCP client.' },
  { href: '/mcp/module-6-real-world', title: '6. Real-World MCP Servers', description: 'Build database, API wrapper, multi-tool, and authenticated server patterns.' },
  { href: '/mcp/module-7-production', title: '7. Production, Security & Distribution', description: 'Error handling, security hardening, npm publishing, monitoring, and the MCP registry.' },
];

const referenceLinks = [
  {
    name: 'Canonical Registries (The "npm" Layer)',
    links: [
      { name: 'Official MCP Registry', url: 'https://registry.modelcontextprotocol.io' },
      { name: 'MCP Registry GitHub', url: 'https://github.com/modelcontextprotocol/registry' },
      { name: 'Agent Skills Standard (SKILL.md)', url: 'https://agentskills.io' },
      { name: 'Vercel Skills Leaderboard (skills.sh)', url: 'https://skills.sh' },
      { name: 'ClawHub Registry (OpenClaw)', url: 'https://clawhub.ai' },
      { name: 'Docker MCP Catalog', url: 'https://hub.docker.com/mcp' },
      { name: 'Smithery (Hosted 1-Click MCP)', url: 'https://smithery.ai' },
      { name: 'Glama (Open MCP Directory)', url: 'https://glama.ai/mcp/servers' },
    ],
  },
  {
    name: 'Community MCP Registries & Toolkits',
    links: [
      { name: 'PulseMCP Directory', url: 'https://pulsemcp.com' },
      { name: 'MCP.so Index', url: 'https://mcp.so' },
      { name: 'Awesome Tools', url: 'https://awesome.tools' },
      { name: 'MCP Marketplace', url: 'https://mcp-marketplace.io' },
      { name: 'MCP Servers Org', url: 'https://mcpservers.org' },
      { name: 'Composio (1,000+ Managed Tools)', url: 'https://composio.dev' },
      { name: 'Zapier MCP Marketplace', url: 'https://github.com/zapier/marketplace' },
    ],
  },
  {
    name: 'Skills & Plugin Marketplaces',
    links: [
      { name: 'SkillsMP', url: 'https://skillsmp.com' },
      { name: 'AISkillStore', url: 'https://aiskillstore.io' },
      { name: 'Sigistry (Verified Claude Plugins)', url: 'https://sigistry.com' },
      { name: 'Claude Marketplace Net', url: 'https://claudemarketplace.net' },
      { name: 'Claude Market Repo', url: 'https://github.com/claude-market/marketplace' },
      { name: 'Multi-Harness Agents Repo', url: 'https://github.com/wshobson/agents' },
      { name: 'Docker Claude Plugins', url: 'https://github.com/docker/claude-plugins' },
      { name: 'Kong AI Marketplace', url: 'https://github.com/Kong/ai-marketplace' },
      { name: '47 Claude Marketplaces Compared', url: 'https://gradually.ai/en/claude-marketplaces' },
      { name: 'marketplace.json Generator', url: 'https://github.com/webrix-ai/plugin-marketplace' },
    ],
  },
  {
    name: 'First-Party Stores & Marketplaces',
    links: [
      { name: 'OpenAI ChatGPT Apps', url: 'https://chatgpt.com/apps' },
      { name: 'ChatGPT GPTs Store', url: 'https://chatgpt.com/gpts' },
      { name: 'OpenAI Plugin & Skills Spec', url: 'https://developers.openai.com/plugins' },
      { name: 'Claude Platform Marketplace', url: 'https://claude.com/platform/marketplace' },
      { name: 'Claude Plugins Directory', url: 'https://claude.com/plugins' },
      { name: 'Claude Code Official Plugins', url: 'https://github.com/anthropics/claude-plugins-official' },
      { name: 'Anthropic Agent Skills', url: 'https://github.com/anthropics/skills' },
      { name: 'Cursor Marketplace', url: 'https://cursor.com/marketplace' },
      { name: 'GitHub Copilot Plugins', url: 'https://github.com/github/copilot-plugins' },
      { name: 'Windsurf Cascade MCP', url: 'https://docs.windsurf.com/windsurf/cascade/mcp' },
      { name: 'Cline MCP Marketplace', url: 'https://docs.cline.bot/mcp/mcp-marketplace' },
      { name: 'Google Antigravity Plugins', url: 'https://antigravity.google/docs/plugins' },
      { name: 'Gemini CLI Extensions', url: 'https://geminicli.com/docs/extensions' },
      { name: 'xAI Grok Bot Docs', url: 'https://docs.x.ai/grok-bot' },
      { name: 'Grok Plugin Marketplace', url: 'https://github.com/xai-org/plugin-marketplace' },
      { name: 'Hermes Skills Hub (Nous Research)', url: 'https://hermes-agent.nousresearch.com/docs/skills' },
      { name: 'Zinc (Agent Autonomous Commerce)', url: 'https://zinc.com' },
    ],
  },
  {
    name: 'Official MCP Specifications & SDKs',
    links: [
      { name: 'MCP Specification', url: 'https://spec.modelcontextprotocol.io' },
      { name: 'MCP Documentation', url: 'https://modelcontextprotocol.io/docs' },
      { name: 'MCP TypeScript SDK', url: 'https://github.com/modelcontextprotocol/typescript-sdk' },
      { name: 'MCP Python SDK', url: 'https://github.com/modelcontextprotocol/python-sdk' },
      { name: 'MCP Go SDK', url: 'https://github.com/modelcontextprotocol/go-sdk' },
      { name: 'MCP Inspector', url: 'https://github.com/modelcontextprotocol/inspector' },
      { name: 'Official MCP Servers Repo', url: 'https://github.com/modelcontextprotocol/servers' },
    ],
  },
  {
    name: 'Client Integration Guides',
    links: [
      { name: 'Claude Desktop MCP Guide', url: 'https://modelcontextprotocol.io/quickstart/user' },
      { name: 'Claude Code MCP Docs', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
      { name: 'Cursor MCP Docs', url: 'https://docs.cursor.com/context/model-context-protocol' },
      { name: 'Windsurf MCP Docs', url: 'https://docs.windsurf.com/windsurf/mcp' },
      { name: 'VS Code MCP Support', url: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers' },
      { name: 'Antigravity MCP Docs', url: 'https://antigravity.dev/docs/mcp' },
      { name: 'Zed MCP Support', url: 'https://zed.dev/docs/assistant/model-context-protocol' },
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
  url: 'https://veda.ng/mcp',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Intermediate',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
  teaches: [
    'MCP architecture and problem it solves',
    'Transports: stdio, SSE, Streamable HTTP',
    'Building MCP servers in TypeScript',
    'Tools, Resources, and Prompts primitives',
    'Connecting to Claude, Cursor, VS Code',
    'Real-world MCP server patterns',
    'Production security and distribution',
  ],
  timeRequired: 'PT6H',
  coursePrerequisites: 'Basic TypeScript/JavaScript knowledge.',
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

import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export default function MCPDevelopmentCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[{ name: "MCP Development", url: "https://veda.ng/mcp" }]} />

      {/* Semantic definition block for AI engines */}
      <div className="sr-only">
        <h2>What is Model Context Protocol (MCP)?</h2>
        <p>
          Model Context Protocol (MCP) is an open standard created by Anthropic that enables Large Language Models (LLMs) and autonomous AI clients to securely access external tools, databases, resources, and live context.
        </p>
      </div>

      <CourseHero
        title="MCP Development"
        subtitle={<>The open standard that connects AI models to tools, databases, and APIs.<br />Build your own MCP server from scratch.</>}
      />

      <CurriculumSection
        description="Seven modules to go from zero to production MCP server."
        items={curriculumItems}
      />

      <CourseReferences
        categories={referenceLinks}
      />

      <CourseFAQ
        items={faqItems}
      />
    </div>
  );
}
