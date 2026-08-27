import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cleanMdxToMarkdown } from '@/lib/mdx-clean';
import { glossaryTerms } from '@/lib/glossary';
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
    '# veda.ng Developer Resources',
    '',
    frontmatterFor('Developer Resources', '/developers').trimEnd(),
    '',
    `Machine interfaces for ${SITE_NAME}'s research hub: a public search API over 233,000+ indexed papers, an MCP server, syndication feeds, and agent discovery files.`,
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
    case '/api':
    case '/docs':
      return developersMarkdown();
    case '/api/v1/essays':
      return essaysIndexMarkdown();
    case '/api/v1/glossary':
      return glossaryIndexMarkdown();
    case '/auth':
    case '/auth.md':
      return [
        '# Authentication & Security Guide',
        '',
        frontmatterFor('Authentication & Security Guide', '/auth.md').trimEnd(),
        '',
        '## Keyless Open Access',
        'All read endpoints on veda.ng are public and open-access. No API keys, Bearer tokens, or registration are required.',
        '',
        '## Machine Interfaces',
        '- REST API: `https://veda.ng/api/v1/reports/search`',
        '- MCP Server: `https://veda.ng/.well-known/mcp`',
        '- OpenAPI Specification: `https://veda.ng/openapi.json`',
      ].join('\n');
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
