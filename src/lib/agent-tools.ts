import { essays } from '@/lib/essays';
import { glossaryTerms } from '@/lib/glossary';
import { essayMarkdown, glossaryMarkdown } from '@/lib/agent-md';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ToolOutput {
  content: { type: 'text'; text: string }[];
  isError?: boolean;
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<ToolOutput> | ToolOutput;

const MAX_REPORT_RESULTS = 20;

function text(content: string): ToolOutput {
  return { content: [{ type: 'text', text: content }] };
}

function errorText(message: string): ToolOutput {
  return { content: [{ type: 'text', text: message }], isError: true };
}

function matchEssay(query: string) {
  const q = query.toLowerCase();
  return essays.filter((e) => {
    const haystack = `${e.title} ${e.summary} ${e.slug}`.toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}

const OPENALEX_CONCEPTS: Record<string, string> = {
  ai: 'C154945302|C11413529|C119857082',
  web3: 'C2779687700|C180706569',
};

async function searchReports(args: Record<string, unknown>): Promise<ToolOutput> {
  const query = typeof args.query === 'string' ? args.query.trim() : '';
  if (query.length < 2) {
    return errorText('Provide a query of at least 2 characters.');
  }
  const corpus = args.corpus === 'web3' ? 'web3' : 'ai';
  const perPageRaw = typeof args.per_page === 'number' ? Math.floor(args.per_page) : 10;
  const perPage = Math.min(Math.max(perPageRaw, 1), MAX_REPORT_RESULTS);

  const params = new URLSearchParams({
    search: query,
    filter: `concepts.id:${OPENALEX_CONCEPTS[corpus]}`,
    sort: 'cited_by_count:desc',
    page: '1',
    per_page: String(perPage),
    select: 'id,title,type,publication_year,doi,cited_by_count,primary_location',
    mailto: 'vatsvedang@gmail.com',
  });

  try {
    const res = await fetch(`https://api.openalex.org/works?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      return errorText(`OpenAlex request failed with status ${res.status}.`);
    }
    const data = await res.json();
    const results = (data.results ?? []).map((work: Record<string, unknown>) => {
      const doi = work.doi as string | undefined;
      const primaryUrl = (work.primary_location as Record<string, unknown> | undefined)?.landing_page_url as string | undefined;
      return {
        title: work.title,
        url: doi || primaryUrl || work.id,
        year: work.publication_year,
        citations: work.cited_by_count,
        type: work.type,
      };
    });
    return text(
      JSON.stringify({ corpus, total: data.meta?.count ?? results.length, returned: results.length, results }, null, 2)
    );
  } catch {
    return errorText('Failed to reach the OpenAlex API. Try again later.');
  }
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'search_essays',
    description:
      'Search long-form essays by Vedang Vatsa on AI agents, AI policy, and Web3. Matches against titles and summaries.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search for, e.g. "stablecoin regulation".' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_essay',
    description: 'Fetch the full Markdown text of one essay by its URL slug, e.g. "agentstack".',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Essay slug (the path segment after veda.ng/).' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'search_glossary',
    description: 'Search the AI & Web3 glossary (100+ terms). Returns term names, slugs, and definition previews.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords to search for, e.g. "rollup".' },
        limit: { type: 'number', description: 'Maximum number of terms to return (1-25, default 8).' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_glossary_term',
    description: 'Fetch the full Markdown definition of one glossary term by its slug, e.g. "zk-rollup".',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Glossary term slug.' },
      },
      required: ['slug'],
    },
  },
  {
    name: 'search_reports',
    description:
      'Search 233,000+ indexed academic papers via OpenAlex in the AI or Web3 corpus, sorted by citations.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keywords.' },
        corpus: { type: 'string', enum: ['ai', 'web3'], description: 'Corpus to search (default ai).' },
        per_page: { type: 'number', description: 'Results to return (1-20, default 10).' },
      },
      required: ['query'],
    },
  },
];

export function searchEssays(args: Record<string, unknown>): ToolOutput {
  const query = typeof args.query === 'string' ? args.query.trim() : '';
  if (!query) return errorText('query is required.');
  const matches = matchEssay(query).slice(0, 10);
  if (matches.length === 0) return text(JSON.stringify({ results: [], hint: 'Try broader keywords.' }));
  return text(
    JSON.stringify(
      {
        results: matches.map((e) => ({
          title: e.title,
          url: `https://veda.ng${e.url}`,
          date: e.date,
          summary: e.summary,
          get_full_text_with: `get_essay(slug="${e.slug}")`,
        })),
      },
      null,
      2
    )
  );
}

export function getEssay(args: Record<string, unknown>): ToolOutput {
  const slug = typeof args.slug === 'string' ? args.slug.replace(/^\//, '').replace(/\.mdx$/, '') : '';
  if (!slug) return errorText('slug is required.');
  const markdown = essayMarkdown(slug);
  if (markdown === null) return errorText(`No essay found for slug "${slug}". Use search_essays first.`);
  return text(markdown);
}

export function searchGlossary(args: Record<string, unknown>): ToolOutput {
  const query = typeof args.query === 'string' ? args.query.trim().toLowerCase() : '';
  if (!query) return errorText('query is required.');
  const limitRaw = typeof args.limit === 'number' ? Math.floor(args.limit) : 8;
  const limit = Math.min(Math.max(limitRaw, 1), 25);
  const words = query.split(/\s+/);
  const matches = glossaryTerms
    .filter((t) => {
      const haystack = `${t.term} ${t.definition}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    })
    .slice(0, limit);
  return text(
    JSON.stringify(
      {
        results: matches.map((t) => ({
          term: t.term,
          slug: t.slug,
          url: `https://veda.ng/glossary/${t.slug}`,
          definition_preview: `${t.definition.slice(0, 280)}...`,
          get_full_definition_with: `get_glossary_term(slug="${t.slug}")`,
        })),
      },
      null,
      2
    )
  );
}

export function getGlossaryTerm(args: Record<string, unknown>): ToolOutput {
  const slug = typeof args.slug === 'string' ? args.slug.replace(/^\//, '') : '';
  if (!slug) return errorText('slug is required.');
  const markdown = glossaryMarkdown(slug);
  if (markdown === null) return errorText(`No glossary term found for slug "${slug}". Use search_glossary first.`);
  return text(markdown);
}

export const TOOL_HANDLERS: Record<string, ToolHandler> = {
  search_essays: searchEssays,
  get_essay: getEssay,
  search_glossary: searchGlossary,
  get_glossary_term: getGlossaryTerm,
  search_reports: (args) => searchReports(args),
};
