import { essays } from '@/lib/essays';
import { glossaryTerms } from '@/lib/glossary';
import { essayMarkdown, glossaryMarkdown, getMarkdownForPath, developersSummaryLines } from '@/lib/agent-md';
import { SITE_NAME, SITE_URL, OPENAPI_URL, LLMSTXT_URL, MCP_ENDPOINT } from '@/lib/site';
import { McpToolDefinition, ToolOutput } from '@/lib/agent-tools';

function text(content: string): ToolOutput {
  return { content: [{ type: 'text', text: content }] };
}

function errorText(message: string): ToolOutput {
  return { content: [{ type: 'text', text: message }], isError: true };
}

export const MCP_DOCS_TOOLS: McpToolDefinition[] = [
  {
    name: 'get_api_documentation',
    description: 'Fetch complete developer documentation, OpenAPI 3.1 specification, and API endpoints on veda.ng.',
    inputSchema: {
      type: 'object',
      properties: {
        format: { type: 'string', enum: ['markdown', 'summary'], default: 'markdown', description: 'Documentation format.' },
      },
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  {
    name: 'search_documentation',
    description: 'Search documentation, guide pages, courses, and glossaries on veda.ng by keyword.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search in documentation.' },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  {
    name: 'get_course_curriculum',
    description: 'Fetch full curriculum modules for any course: prompt, web3, vibecoding, mcp, agentic, or automation.',
    inputSchema: {
      type: 'object',
      properties: {
        course: {
          type: 'string',
          enum: ['prompt', 'web3', 'vibecoding', 'mcp', 'agentic', 'automation'],
          description: 'Course slug name.',
        },
      },
      required: ['course'],
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
  {
    name: 'get_doc_page',
    description: 'Fetch the full Markdown content for any documentation page, essay, glossary term, or guide by path or slug.',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path or slug to fetch (e.g. "/developers", "auth.md", "pricing", or "zk-rollup").' },
      },
      required: ['path'],
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true },
  },
];

export function getApiDocumentation(args: Record<string, unknown>): ToolOutput {
  const md = getMarkdownForPath('/developers');
  return text(md || developersSummaryLines().join('\n'));
}

export async function getOpenapiSpecification(): Promise<ToolOutput> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const raw = fs.readFileSync(path.join(process.cwd(), 'public', 'openapi.json'), 'utf8');
    return text(raw);
  } catch {
    return text(JSON.stringify({ openapi: '3.1.0', info: { title: 'Veda API', version: '1.1.0' }, url: OPENAPI_URL }));
  }
}

export function getAuthGuide(): ToolOutput {
  const md = getMarkdownForPath('/auth.md');
  return text(md || '# Authentication Guide\n\nAll endpoints on veda.ng are public and keyless.');
}

export function searchDocumentation(args: Record<string, unknown>): ToolOutput {
  const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
  if (!query) return errorText('query is required.');

  const docs = [
    { title: 'Developer Resources & APIs', url: 'https://veda.ng/developers', tags: 'api rest mcp openapi endpoints batch jobs' },
    { title: 'OpenAPI 3.1 Spec', url: 'https://veda.ng/openapi.json', tags: 'openapi schema specification types' },
    { title: 'Keyless Auth Guide', url: 'https://veda.ng/auth.md', tags: 'auth authentication token security' },
    { title: 'Vibe Coding 101 Course', url: 'https://veda.ng/vibecoding', tags: 'course vibecoding ai code cursor' },
    { title: 'Prompt Engineering 101 Course', url: 'https://veda.ng/prompt', tags: 'course prompt engineering llm' },
    { title: 'Web3 101 Course', url: 'https://veda.ng/web3', tags: 'course web3 blockchain ethereum' },
    { title: 'MCP Development 101 Course', url: 'https://veda.ng/mcp', tags: 'course mcp model context protocol server' },
    { title: 'The Agentic Web Course', url: 'https://veda.ng/agentic', tags: 'course agentic agents protocols autonomous' },
    { title: 'AI Automation Guide', url: 'https://veda.ng/automation', tags: 'guide automation n8n webhooks' },
  ];

  const matches = docs.filter(d => d.title.toLowerCase().includes(query) || d.tags.includes(query));
  return text(JSON.stringify({ results: matches.length > 0 ? matches : docs.slice(0, 5) }, null, 2));
}

export function getCourseCurriculum(args: Record<string, unknown>): ToolOutput {
  const course = typeof args.course === 'string' ? args.course.trim().toLowerCase() : '';
  const md = getMarkdownForPath(`/${course}`);
  if (!md) return errorText(`Course "${course}" not found. Valid: prompt, web3, vibecoding, mcp, agentic, automation`);
  return text(md);
}

export function getGlossaryTerm(args: Record<string, unknown>): ToolOutput {
  const slug = typeof args.slug === 'string' ? args.slug.replace(/^\//, '') : '';
  if (!slug) return errorText('slug is required.');
  const markdown = glossaryMarkdown(slug);
  if (markdown === null) return errorText(`No glossary term found for slug "${slug}".`);
  return text(markdown);
}

export function getEssay(args: Record<string, unknown>): ToolOutput {
  const slug = typeof args.slug === 'string' ? args.slug.replace(/^\//, '').replace(/\.mdx$/, '') : '';
  if (!slug) return errorText('slug is required.');
  const markdown = essayMarkdown(slug);
  if (markdown === null) return errorText(`No essay found for slug "${slug}".`);
  return text(markdown);
}

export function getDocPage(args: Record<string, unknown>): ToolOutput {
  const targetPath = typeof args.path === 'string' ? args.path.trim() : '';
  if (!targetPath) return errorText('path is required.');
  const normalized = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  const markdown = getMarkdownForPath(normalized) || getMarkdownForPath(targetPath);
  if (markdown === null) return errorText(`No documentation page found for "${targetPath}".`);
  return text(markdown);
}

export const DOCS_TOOL_HANDLERS: Record<string, (args: Record<string, unknown>) => Promise<ToolOutput> | ToolOutput> = {
  get_api_documentation: getApiDocumentation,
  get_openapi_specification: getOpenapiSpecification,
  get_auth_guide: () => getAuthGuide(),
  search_documentation: searchDocumentation,
  get_course_curriculum: getCourseCurriculum,
  get_glossary_term: getGlossaryTerm,
  get_essay: getEssay,
  get_doc_page: getDocPage,
};
