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
  MEETING_PATH,
  MEETING_URL,
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
    `- Contact: ${MEETING_URL} or ${CONTACT_EMAIL}`,
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
  return [`# ${PROFILE_SUMMARY.heading}`, '', frontmatterFor(PROFILE_SUMMARY.heading, '/profile').trimEnd(), '', sectionsToMarkdown(PROFILE_SUMMARY.paragraphs.join('\n\n'), [])].join('\n');
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
    frontmatterFor('Contact', MEETING_PATH).trimEnd(),
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
  switch (pathname) {
    case '/':
      return homeMarkdown();
    case '/essays':
      return essaysIndexMarkdown();
    case '/glossary':
      return glossaryIndexMarkdown();
    case '/profile':
      return profileMarkdown();
    case '/privacy':
      return privacyMarkdown();
    case '/meeting':
      return meetingContactMarkdown();
    case '/developers':
      return developersMarkdown();
    default:
      break;
  }
  if (pathname.startsWith('/glossary/')) {
    return glossaryMarkdown(pathname.slice('/glossary/'.length));
  }
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    return essayMarkdown(segments[0]);
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
    `- [Contact or book a meeting](${MEETING_URL})`,
    '',
    MARKDOWN_NEGOTIATION_TIP,
  ].join('\n');
}
