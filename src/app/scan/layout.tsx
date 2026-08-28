import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agentic Readiness Scanner | Audit AI Agents & LLM Discovery',
  description:
    'Free live scanner for AI agent-readiness and machine discovery: audit robots.txt AI bot policies, llms.txt, Model Context Protocol (MCP) servers, OpenAPI schemas, and Markdown twins.',
  alternates: {
    canonical: 'https://veda.ng/scan',
  },
  openGraph: {
    title: 'Agentic Readiness Scanner | veda.ng',
    description:
      'Test your website for AI agents, LLM search engines, and MCP servers with an instant 0-100 score and actionable fix snippets.',
    url: 'https://veda.ng/scan',
    type: 'website',
  },
};

export default function ScanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
