import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cleanMdxToMarkdown } from '@/lib/mdx-clean';
import { glossaryTerms } from '@/lib/glossary';
import { courseConfigs } from '@/lib/course-config';
import { essays } from '@/lib/essays';
import { recentPapers } from '@/components/recent-papers';
import {
  PROFILE_SUMMARY,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  CONTACT_INTRO,
  CONTACT_SECTIONS,
  sectionsToMarkdown,
} from '@/lib/trust-content';
import {
  AUTHOR_NAME,
  AUTHOR_URL,
  CONTACT_EMAIL,
  LLMSTXT_URL,
  LLMSFULLTXT_URL,
  MCP_ENDPOINT,
  CONTACT_PATH,
  CONTACT_URL,
  OPENAPI_URL,
  SITE_NAME,
  SITE_URL,
  SITEMAP_URL,
} from '@/lib/site';

const ESSAYS_DIR = path.join(process.cwd(), 'src', 'content', 'essays');

export const MARKDOWN_NEGOTIATION_TIP =
  'Tip: send an HTTP Accept header of text/markdown on any page URL to get the Markdown version.';

function frontmatterFor(title: string, sourcePath: string): string {
  return `Source: ${SITE_URL}${sourcePath}\nAuthor: ${AUTHOR_NAME} (${AUTHOR_URL})\n`;
}

export function essayMarkdown(slug: string): string | null {
  const filePath = path.join(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const body = cleanMdxToMarkdown(content);
    return [
      `# ${data.title ?? slug}`,
      '',
      frontmatterFor(String(data.title ?? slug), `/${slug}`).trimEnd(),
      data.date ? `Published: ${data.date}` : null,
      '',
      data.summary ?? '',
      '',
      '---',
      '',
      body,
    ]
      .filter((line) => line !== null)
      .join('\n');
  } catch {
    return null;
  }
}

export function glossaryMarkdown(slug: string): string | null {
  const term = glossaryTerms.find((t) => t.slug === slug);
  if (!term) return null;
  return [
    `# ${term.term}`,
    '',
    frontmatterFor(term.term, `/glossary/${term.slug}`).trimEnd(),
    '',
    term.definition.trim(),
    '',
    `Glossary index: ${SITE_URL}/glossary`,
  ].join('\n');
}

export function homeResources(): { title: string; url: string }[] {
  return [
    { title: 'Learn Web3', url: '/web3' },
    { title: 'Learn Agentic Web', url: '/agentic' },
    { title: 'Learn Prompt Engineering', url: '/prompt' },
    { title: 'Learn Vibe Coding', url: '/vibecoding' },
    { title: 'Learn MCP Development', url: '/mcp' },
    { title: 'Learn AI Automation', url: '/automation' },
    { title: 'LinkedIn Translator', url: '/lit' },
    { title: 'Swarm Prediction', url: '/swarm-prediction' },
    { title: 'AI Discovery Standards', url: '/aistandards' },
    { title: 'Website Checklist', url: '/sitecheck' },
    { title: 'AI Reports Library', url: '/ailib' },
    { title: 'Web3 Reports Library', url: '/web3lib' },
    { title: 'Web3 & AI Glossary', url: '/glossary' },
    { title: 'Health Protocols', url: '/health-protocols' },
  ];
}

function linkList(items: { title: string; url: string }[]): string {
  return items.map((i) => `- [${i.title}](${i.url.startsWith('http') ? i.url : SITE_URL + i.url})`).join('\n');
}

function homeMarkdown(): string {
  const recent = essays.slice(0, 12).map((e) => ({ title: e.title, url: e.url }));
  return [
    `# ${SITE_NAME}`,
    '',
    frontmatterFor(SITE_NAME, '/').trimEnd(),
    '',
    `${SITE_NAME} FRSA is the founder of Hashtag Web3, a community of more than 120,000 AI and Web3 professionals, and of CVinBio. This site publishes his essays on AI agents and Web3, six free courses, a technical glossary, and two research report libraries.`,
    '',
    '## Recent Papers',
    '',
    linkList(recentPapers.slice(0, 6).map((p) => ({ title: p.title, url: p.url }))),
    '',
    'More on Google Scholar: https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    '',
    '## Recent Essays',
    '',
    linkList(recent),
    '',
    '## Resources',
    '',
    linkList(homeResources()),
    '',
    '## For AI agents',
    '',
    `- Content index for LLMs: ${LLMSTXT_URL}`,
    `- Full-text version: ${LLMSFULLTXT_URL}`,
    `- Developer resources: ${SITE_URL}/developers`,
    `- MCP server (Streamable HTTP): ${MCP_ENDPOINT}`,
    `- OpenAPI spec: ${OPENAPI_URL}`,
    `- Contact: ${CONTACT_URL} or ${CONTACT_EMAIL}`,
    '',
    MARKDOWN_NEGOTIATION_TIP,
  ].join('\n');
}

function essaysIndexMarkdown(): string {
  return [
    '# Essays by Vedang Vatsa',
    '',
    frontmatterFor('Essays', '/essays').trimEnd(),
    '',
    linkList(essays.map((e) => ({ title: e.title, url: e.url }))),
  ].join('\n');
}

function glossaryIndexMarkdown(): string {
  return [
    '# AI & Web3 Glossary',
    '',
    frontmatterFor('Glossary', '/glossary').trimEnd(),
    '',
    `${glossaryTerms.length} terms with detailed definitions and interactive visualizations.`,
    '',
    linkList(glossaryTerms.map((t) => ({ title: t.term, url: `/glossary/${t.slug}` }))),
  ].join('\n');
}

function profileMarkdown(): string {
  return [`# ${PROFILE_SUMMARY.heading}`, '', frontmatterFor(PROFILE_SUMMARY.heading, '/about').trimEnd(), '', sectionsToMarkdown(PROFILE_SUMMARY.paragraphs.join('\n\n'), [])].join('\n');
}

function privacyMarkdown(): string {
  return [
    '# Privacy Policy',
    '',
    frontmatterFor('Privacy Policy', '/privacy').trimEnd(),
    '',
    sectionsToMarkdown(PRIVACY_INTRO, PRIVACY_SECTIONS),
  ].join('\n');
}

function meetingContactMarkdown(): string {
  return [
    '# Contact Vedang Vatsa',
    '',
    frontmatterFor('Contact', CONTACT_PATH).trimEnd(),
    '',
    sectionsToMarkdown(CONTACT_INTRO, CONTACT_SECTIONS),
  ].join('\n');
}

export function developersSummaryLines(): string[] {
  return [
    `- Public report search API: GET ${SITE_URL}/api/reports/search?q=agents&corpus=ai (OpenAlex-backed; see ${OPENAPI_URL})`,
    `- OpenAPI 3.1 specification: ${OPENAPI_URL}`,
    `- MCP server over Streamable HTTP (JSON-RPC 2.0): ${MCP_ENDPOINT}; tools: search_essays, get_essay, search_glossary, get_glossary_term, search_reports`,
    `- RSS feed: ${SITE_URL}/feed.xml`,
    `- Sitemap: ${SITEMAP_URL}`,
    `- Agent manifests: ${SITE_URL}/.well-known/agents.json, ${SITE_URL}/ai.json, ${SITE_URL}/ai.txt`,
    '- Markdown access: send Accept: text/markdown on any page URL',
    `- No authentication required for any read endpoint. Contact: ${CONTACT_EMAIL}`,
  ];
}

function developersMarkdown(): string {
  return [
    '# Vedang Vatsa Developer Resources & API Documentation (veda.ng)',
    '',
    frontmatterFor('Developer Resources', '/developers').trimEnd(),
    '',
    'Official machine and developer interfaces for Vedang Vatsa (veda.ng): public research paper search API over 233,000+ indexed papers, Model Context Protocol (MCP) server, OpenAPI 3.1 specification, Python SDK (vedang-cli), and agent discovery files.',
    '',
    '## Endpoints',
    '',
    developersSummaryLines().join('\n'),
    '',
    MARKDOWN_NEGOTIATION_TIP,
  ].join('\n');
}

export function getMarkdownForPath(pathname: string): string | null {
  const body = getMarkdownBodyForPath(pathname);
  if (body === null) return null;
  const titleMatch = body.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : SITE_NAME;
  const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;
  const frontmatter = [
    '---',
    `title: ${title}`,
    `description: ${body.split('\n').find((l) => l.startsWith('Source: '))?.replace('Source: ', `Page on ${SITE_NAME}'s site: `) ?? `${SITE_NAME} - AI and Web3 research hub`}`,
    `canonical: ${canonical}`,
    `last_updated: ${new Date().toISOString().slice(0, 10)}`,
    'type: text/markdown',
    '---',
    '',
  ].join('\n');
  return `${frontmatter}${body}`;
}

function courseMarkdown(title: string, slug: string, desc: string, modules: string[]): string {
  return [
    `# ${title}`,
    '',
    frontmatterFor(title, `/${slug}`).trimEnd(),
    '',
    desc,
    '',
    '## Curriculum Modules',
    '',
    ...modules.map((m, i) => `${i + 1}. **${m}**: https://veda.ng/${slug}`),
    '',
    `Explore interactive lessons and exams at https://veda.ng/${slug}`,
    '',
    MARKDOWN_NEGOTIATION_TIP,
  ].join('\n');
}

function getMarkdownBodyForPath(pathname: string): string | null {
  switch (pathname) {
    case '/':
      return homeMarkdown();
    case '/essays':
      return essaysIndexMarkdown();
    case '/glossary':
      return glossaryIndexMarkdown();
    case '/about':
      return profileMarkdown();
    case '/privacy':
      return privacyMarkdown();
    case '/contact':
      return meetingContactMarkdown();
    case '/developers':
      return developersMarkdown();
    case '/prompt':
      return courseMarkdown(
        'Prompt Engineering 101 - AI Course',
        'prompt',
        'Master prompt engineering fundamentals. Learn to craft effective prompts for LLMs and AI agents with practical examples on veda.ng.',
        ['Foundations & Mental Models', 'Context & Few-Shot Learning', 'Chain-of-Thought & Reasoning', 'System Prompts & Personas', 'Function Calling & Tools', 'Defense & Prompt Injection', 'Evaluation & Optimization']
      );
    case '/web3':
      return courseMarkdown(
        'Web3 101 - Blockchain Fundamentals Course',
        'web3',
        'Free course on blockchain, cryptocurrencies, smart contracts, dApps, NFTs, DAOs, and decentralized systems on veda.ng.',
        ['Blockchain Architecture & Consensus', 'Smart Contracts & EVM', 'DeFi Primitives & AMMs', 'Tokens, NFTs & Digital Property', 'DAOs & Decentralized Governance', 'Zero-Knowledge Proofs & Scaling', 'Security & Smart Contract Auditing']
      );
    case '/vibecoding':
      return courseMarkdown(
        'Vibe Coding 101 - Build Software with Generative AI',
        'vibecoding',
        'Vibe Coding 101: Free course by Vedang Vatsa on building production software with AI tools like Cursor, Antigravity, and Replit.',
        ['The Vibe Coding Paradigm', 'IDE Setup & Agentic Workflows', 'Specification Driven Development', 'Iterative Debugging & Testing', 'Deploying to Production', 'Fullstack App Architecture', 'Building AI Agents']
      );
    case '/mcp':
      return courseMarkdown(
        'MCP Development 101 - Build AI Tool Servers',
        'mcp',
        'Free course on Model Context Protocol (MCP). Learn to build tool servers connecting AI agents to APIs, databases, and services.',
        ['Protocol Fundamentals & Architecture', 'Transports: stdio & Streamable HTTP', 'Implementing Tools & JSON Schema', 'Resources, Prompts & Subscriptions', 'Security, Sandbox & Permissions', 'Building Multi-Agent Systems', 'Production Deployment & Monitoring']
      );
    case '/agentic':
      return courseMarkdown(
        'The Agentic Web - Autonomous AI Systems & Protocols',
        'agentic',
        'Free course on autonomous AI agents, multi-agent coordination, MCP protocols, and agentic architecture on veda.ng.',
        ['Autonomous Agent Architecture', 'Tool Use & Environment Grounding', 'Multi-Agent Coordination & A2A', 'Economic Agency & Micropayments', 'Safety, Alignment & Governance', 'Self-Improving Pipelines', 'Future of the Agentic Web']
      );
    case '/automation':
      return courseMarkdown(
        'AI Automation 101 - Automate Anything with AI',
        'automation',
        'Free guide to AI automation: build autonomous pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools.',
        ['Automation Mental Models', 'Webhook & API Workflows', 'n8n & Workflow Orchestration', 'LLM Chains & Structured Extraction', 'Agentic Autonomous Triage', 'Error Handling & Idempotency', 'Enterprise Deployment']
      );
    case '/pricing':
      return [
        '# Pricing & Access - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Pricing & Access', '/pricing').trimEnd(),
        '',
        'Vedang Vatsa\'s research hub (veda.ng) is 100% Free and Open-Access for humans and autonomous AI agents.',
        '',
        '## Public & Developer Tier ($0 / month)',
        '- **Cost**: $0 USD (Free, Keyless, Open Access)',
        '- **Academic Research Search**: Unlimited queries across 233,000+ indexed papers in AI and Web3 (backed by OpenAlex)',
        '- **Model Context Protocol (MCP)**: Unauthenticated access to Product MCP (`/.well-known/mcp`) and Docs MCP (`/.well-known/mcp/docs`)',
        '- **Long-Form Essays & Research**: Full-text reading and Markdown twins (`.md`) across all publications',
        '- **Educational Curriculum**: Free access to Prompt Engineering, MCP Development, Vibe Coding, and Agentic Web courses',
        '- **Technical Glossary**: 100+ plain-language definitions',
        '- **REST API Rate Limit**: Standard RFC 60 requests/minute keyless bucket',
        '- **Authentication Required**: None (No credit card, no account required)',
        '',
        '## Developer Portal & Specs',
        '- Documentation: https://veda.ng/developers',
        '- OpenAPI 3.1 Spec: https://veda.ng/openapi.json',
        '- MCP Server: https://veda.ng/.well-known/mcp',
      ].join('\n');
    case '/scan':
      return [
        '# Agentic Readiness Scanner - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Agentic Readiness Scanner', '/scan').trimEnd(),
        '',
        'Live, free, and deterministic website scanner for AI agent-readiness and machine discovery.',
        '',
        '## Audited Layers & Protocols',
        '- **Discovery**: robots.txt AI crawler rules (GPTBot, ClaudeBot, PerplexityBot), llms.txt, llms-full.txt, ARD v0.91, Agent Plugins (plugin.json), XML Sitemap',
        '- **Access**: Markdown content negotiation (Accept: text/markdown), .md URL twins, bot User-Agent reachability, RFC RateLimit headers',
        '- **Usability & MCP**: Streamable HTTP MCP server handshake (JSON-RPC 2.0 initialize & tools/list), OpenAPI 3.1 specification (/openapi.json), Auth guides',
        '- **Payments**: x402, MPP, UCP, ACP agentic payment discovery',
        '',
        '## Machine API & Automation',
        '- REST Endpoint: `POST https://veda.ng/api/v1/scan` or `GET https://veda.ng/api/v1/scan?url={domain}`',
        '- MCP Tool: `scan_agent_readiness(url="{domain}")` on `https://veda.ng/.well-known/mcp`',
      ].join('\n');
    case '/api/v1/scan':
      return [
        '# Agentic Readiness Scan API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Scan API', '/api/v1/scan').trimEnd(),
        '',
        'Keyless REST endpoint to run parallel agent-readiness audits on any public website.',
        '',
        '## Usage',
        '- **Method**: `POST https://veda.ng/api/v1/scan`',
        '- **Body**: `{"url": "example.com", "refresh": false}`',
        '- **GET Alternative**: `GET https://veda.ng/api/v1/scan?url=example.com`',
        '- **Output**: Structured JSON report with 0-100 score, letter grade, layer breakdowns, and copy-paste fix snippets.',
      ].join('\n');
    case '/api':
      return [
        '# Vedang Vatsa Public API Root (veda.ng)',
        '',
        frontmatterFor('API Directory', '/api').trimEnd(),
        '',
        'Official public, open, and keyless REST API for academic paper search, published essays, and technical glossaries by Vedang Vatsa.',
        '',
        '## Endpoints',
        '- **Search**: `GET https://veda.ng/api/v1/reports/search?q={query}&corpus={ai|web3}`',
        '- **Scan**: `POST https://veda.ng/api/v1/scan`',
        '- **Essays**: `GET https://veda.ng/api/v1/essays`',
        '- **Glossary**: `GET https://veda.ng/api/v1/glossary`',
        '- **Batch Execution**: `POST https://veda.ng/api/v1/batch`',
        '- **Async Jobs**: `GET https://veda.ng/api/v1/jobs/{jobId}`',
        '',
        '## Protocol & Specs',
        '- OpenAPI 3.1 Specification: https://veda.ng/openapi.json',
        '- Product MCP Server: https://veda.ng/.well-known/mcp',
        '- Documentation MCP Server: https://veda.ng/.well-known/mcp/docs',
      ].join('\n');
    case '/docs':
      return [
        '# Vedang Vatsa Developer Documentation (veda.ng)',
        '',
        frontmatterFor('Developer Documentation', '/docs').trimEnd(),
        '',
        developersSummaryLines().join('\n'),
        '',
        '## Quick Links',
        '- Interactive Developer Portal: https://veda.ng/developers',
        '- OpenAPI 3.1 Specification: https://veda.ng/openapi.json',
        '- Product MCP Server: https://veda.ng/.well-known/mcp',
        '- Docs MCP Server: https://veda.ng/.well-known/mcp/docs',
        '- Authentication Guide: https://veda.ng/auth.md',
      ].join('\n');
    case '/auth':
    case '/auth.md':
      return [
        '# Authentication Guide - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Authentication Guide', '/auth').trimEnd(),
        '',
        'Vedang Vatsa machine interfaces and APIs are 100% keyless and open access. No API key, bearer token, or OAuth handshake is required.',
      ].join('\n');
    case '/api/v1/batch':
      return [
        '# Batch Execution API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Batch API', '/api/v1/batch').trimEnd(),
        '',
        'Execute up to 20 sub-requests concurrently in a single atomic HTTP request.',
        '',
        '## Protocol',
        '- **Method**: `POST https://veda.ng/api/v1/batch`',
        '- **Content-Type**: `application/json`',
        '- **Rate Limit**: 60 requests/minute (RFC standard headers)',
        '- **Schema**: Described in https://veda.ng/openapi.json',
        '',
        '## Example Request',
        '```json',
        '{',
        '  "requests": [',
        '    { "method": "GET", "path": "/api/v1/reports/search?q=mcp" },',
        '    { "method": "GET", "path": "/api/v1/glossary" }',
        '  ]',
        '}',
        '```',
      ].join('\n');
    case '/api/v1/reports/search':
      return [
        '# Academic Research Paper Search API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Search API', '/api/v1/reports/search').trimEnd(),
        '',
        'Search 233,000+ indexed academic papers across AI and Web3 corpora backed by OpenAlex, sorted by citation count.',
        '',
        '## Parameters',
        '- `q` (string, required): Search query term (min 2 characters)',
        '- `corpus` (string, optional): `ai` (default) or `web3`',
        '- `page` (integer, optional): Page number (default: 1)',
        '- `per_page` (integer, optional): Results per page (default: 20, max: 200)',
        '- `cursor` (string, optional): Base64 opaque pagination cursor',
      ].join('\n');
    case '/api/v1/essays':
      return [
        '# Essays Catalog API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Essays API', '/api/v1/essays').trimEnd(),
        '',
        'Retrieve the complete catalog of long-form research essays by Vedang Vatsa with tags, metadata, and Markdown URLs.',
      ].join('\n');
    case '/api/v1/glossary':
      return [
        '# Technical Glossary API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Glossary API', '/api/v1/glossary').trimEnd(),
        '',
        'Retrieve 100+ plain-language definitions for AI, machine learning, and Web3 terms.',
      ].join('\n');
    case '/api/v1/jobs':
      return [
        '# Background Job Status API - Vedang Vatsa (veda.ng)',
        '',
        frontmatterFor('Jobs API', '/api/v1/jobs').trimEnd(),
        '',
        'Check status and lifecycle of asynchronous background operations on veda.ng.',
      ].join('\n');
    case '/media':
      return [
        '# Speaking Engagements & Media Coverage',
        '',
        frontmatterFor('Media & Speaking', '/media').trimEnd(),
        '',
        'Press coverage, keynotes, and 65+ media quotes of Vedang Vatsa in Decrypt, Yahoo Finance, Business Standard, The Tribune, and Outlook Money.',
        '',
        '## Press Features',
        '- Decrypt: Analysis of blockchain trends and institutional adoption',
        '- Yahoo Finance: Digital assets, stablecoin regulatory landscape',
        '- Business Standard: AI policy and technological impact on emerging markets',
        '- The Tribune: Academic research and education in Web3 and AI',
        '- Outlook Money: Future of decentralized finance',
      ].join('\n');
    case '/community':
      return [
        '# Community Building Guide by Vedang Vatsa',
        '',
        frontmatterFor('Community Building', '/community').trimEnd(),
        '',
        'Playbook and operational frameworks from scaling Hashtag Web3 to 120,000+ members and founding CVinBio.',
      ].join('\n');
    case '/health-protocols':
      return [
        '# Bryan Johnson Blueprint Protocol - Reference Guide',
        '',
        frontmatterFor('Health Protocols', '/health-protocols').trimEnd(),
        '',
        'Full reference guide to biomarker tracking, longevity science, and routines with transcript data.',
      ].join('\n');
    default:
      break;
  }
  if (pathname.startsWith('/glossary/')) {
    return glossaryMarkdown(pathname.slice('/glossary/'.length));
  }
  if (pathname.startsWith('/api/v1/jobs/')) {
    const jobId = pathname.slice('/api/v1/jobs/'.length);
    return `# Async Job Status: ${jobId}\n\n${frontmatterFor(`Job ${jobId}`, pathname).trimEnd()}\n\nStatus: completed\nJob ID: ${jobId}\nPolled At: ${new Date().toISOString()}\n`;
  }
  // Course module markdown handler
  for (const [courseKey, config] of Object.entries(courseConfigs)) {
    if (pathname === config.basePath) {
      return courseMarkdown(
        `${config.courseTitle} - Complete Course Guide`,
        courseKey,
        `Official course curriculum for ${config.courseTitle} on veda.ng.`,
        config.modules.map((m) => m.title)
      );
    }
    if (pathname === `${config.basePath}/final-exam`) {
      return `# ${config.courseTitle} - Final Exam\n\n${frontmatterFor(`${config.courseTitle} Final Exam`, pathname).trimEnd()}\n\nFinal assessment and certification exam for ${config.courseTitle}.\n`;
    }
    for (const mod of config.modules) {
      if (pathname === `${config.basePath}/${mod.slug}`) {
        return `# ${config.courseTitle}: ${mod.title}\n\n${frontmatterFor(`${config.courseTitle} - ${mod.title}`, pathname).trimEnd()}\n\nCourse Module: ${mod.title} (${mod.slug})\nParent Course: ${config.courseTitle} (${config.basePath})\n\nFull Course Index: ${SITE_URL}${config.basePath}\n`;
      }
    }
  }
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    const essay = essayMarkdown(segments[0]);
    if (essay) return essay;
  }
  return null;
}

export function getAgentNotFoundMarkdown(pathname: string): string {
  return [
    '# 404 - Page Not Found',
    '',
    `\`${pathname}\` does not exist on \`${SITE_URL}\`.`,
    '',
    '## Where to look next',
    '',
    `- [Home](${SITE_URL}/)`,
    `- [llms.txt content index](${LLMSTXT_URL})`,
    `- [Full-text content index](${LLMSFULLTXT_URL})`,
    `- [HTML sitemap of every page](${SITEMAP_URL})`,
    `- [Essays](https://veda.ng/essays) and [Glossary](https://veda.ng/glossary)`,
    `- [Developer resources and API docs](${SITE_URL}/developers)`,
    `- [Contact or book a meeting](${CONTACT_URL})`,
    '',
    MARKDOWN_NEGOTIATION_TIP,
  ].join('\n');
}
