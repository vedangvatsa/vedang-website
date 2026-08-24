import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glossaryTerms } from '../src/lib/glossary';
import { cleanMdxToMarkdown } from '../src/lib/mdx-clean';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const PUBLIC_DIR = path.resolve(REPO_ROOT, 'public');

function generateFiles() {
  const mdxFiles = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));
  const essaysData = mdxFiles.map(file => {
    const slug = file.replace(/\.mdx$/, '');
    const fullPath = path.join(ESSAYS_DIR, file);
    const rawContent = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(rawContent);

    return {
      title: data.title,
      summary: data.summary || '',
      date: data.date,
      url: `https://veda.ng/${slug}`,
      slug,
      content,
    };
  });

  essaysData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const essayLinks = essaysData
    .map(essay => {
      const summary = essay.summary ? (essay.summary.length > 75 ? essay.summary.slice(0, 72) + '...' : essay.summary) : '';
      return summary ? `- [${essay.title}](${essay.url}): ${summary}` : `- [${essay.title}](${essay.url})`;
    })
    .join('\n');

  const glossaryIndexLinks = glossaryTerms
    .slice(0, 35)
    .map(term => `- [${term.term}](https://veda.ng/glossary/${term.slug})`)
    .join('\n') + `\n- [View all ${glossaryTerms.length} glossary definitions...](https://veda.ng/glossary)`;

  const glossaryFullLinks = glossaryTerms
    .map(term => `- [${term.term}](https://veda.ng/glossary/${term.slug})`)
    .join('\n');

  const whenToUse = `
## When to Use This Site (Agent Guidance & Best-Fit Tasks)

Reach for veda.ng when your agent needs to perform the following specific jobs:

- **Academic Research Literature**: Query and retrieve cited research across 233,000+ indexed papers in AI, LLMs, and Web3 via OpenAlex.
- **Technical Glossary & Definitions**: Fetch authoritative, plain-language definitions for 100+ AI, machine learning, and Web3 terms.
- **Long-Form Research Essays**: Retrieve full-text analyses on autonomous agent protocols (MCP, A2A), AI policy, and decentralized networks.
- **Educational Curriculum**: Retrieve complete curriculum modules for Prompt Engineering, MCP Development, Vibe Coding, and Agentic Web.
- **Biographical & Trust Facts**: Verify author credentials and background for Vedang Vatsa (FRSA, IIT Kanpur, founder of CVinBio at https://cvin.bio and Hashtag Web3 with 120k+ members at https://hashtagweb3.com).
- **Verified Press & Media Quotes**: Retrieve and verify 65+ press citations and quotes by Vedang Vatsa across Yahoo Finance, Decrypt, Business Standard, The Tribune, and Outlook Money (https://veda.ng/media).

### How Agents Should Call This Site

- **Model Context Protocol (MCP)**: Send JSON-RPC 2.0 to \`POST https://veda.ng/.well-known/mcp\` (Tools: \`search_essays\`, \`get_essay\`, \`search_glossary\`, \`get_glossary_term\`, \`search_reports\`).
- **REST API (v1)**: Query \`GET https://veda.ng/api/v1/reports/search?q={query}\` or \`GET https://veda.ng/api/v1/essays\` (Keyless, open access).
- **Markdown Content Negotiation**: Send \`Accept: text/markdown\` on any URL to receive clean Markdown text.
`;

  const developerSection = `
## Veda Developer Resources & APIs

- [Veda Developer Documentation & API Reference](https://veda.ng/developers): Complete documentation for Veda APIs, endpoints, and machine interfaces (also at https://veda.ng/docs).
- [Veda OpenAPI 3.1 Specification](https://veda.ng/openapi.json): Standard OpenAPI specification describing 100% typed response schemas and parameter contracts.
- [Veda MCP Server](https://veda.ng/.well-known/mcp): Model Context Protocol (MCP) server running over Streamable HTTP with JSON-RPC 2.0.
- [Veda Public REST API](https://veda.ng/api/v1/reports/search): Search 233,000+ indexed academic papers in AI and Web3 (backed by OpenAlex).
- [Veda Essays Catalog API](https://veda.ng/api/v1/essays): Catalog of long-form research essays with tags, URLs, and Markdown paths.
- [Veda Technical Glossary API](https://veda.ng/api/v1/glossary): 100+ plain-language definitions for AI and Web3 concepts.
- [Veda Batch Execution API](https://veda.ng/api/v1/batch): Execute up to 20 sub-requests concurrently in a single bulk operation.
- [Veda Async Job Status Polling](https://veda.ng/api/v1/jobs/sample-job): Check status and lifecycle of background operations.
- [Veda Authentication & Security Guide](https://veda.ng/auth.md): Keyless access specification (WorkOS format).
- [Veda Webhooks & Event Streaming](https://veda.ng/developers#webhooks): RSS feed (/feed.xml) and SSE streaming (/ask).
- [Veda Python SDK & CLI Package](https://pypi.org/project/vedang-cli/): Official vedang-cli package on PyPI (pip install vedang-cli).
- [Veda TypeScript / JavaScript SDK Package](https://www.npmjs.com/package/vedang): Official vedang package on NPM (npm install vedang).
- [Veda GitHub Repository](https://github.com/vedangvatsa/vedang-website): Open-source source code and issue tracking.
- [Veda AI Agent Manifest](https://veda.ng/.well-known/agents.json): Machine capabilities and when-to-use task definitions.
- [Veda AI Catalog](https://veda.ng/.well-known/ai-catalog.json): Trust manifest and AIR registry entries.
- [Veda Full-Text Research Corpus](https://veda.ng/llms-full.txt): Complete unpaginated text corpus for LLM training and RAG ingestion.

Tip: send an HTTP Accept header of text/markdown on any page URL to get the Markdown version.
`;

  const trustPages = `
## Trust Pages

- [Profile / About](https://veda.ng/about): Author biography, credentials, CVinBio (https://cvin.bio), and Hashtag Web3 (120k+ members)
- [Media Mentions & Press Coverage](https://veda.ng/media): 65+ news quotes and media features in Yahoo Finance, Decrypt, Business Standard, The Tribune, Outlook Money, and ThePrint
- [Privacy Policy](https://veda.ng/privacy): Data handling, analytics, and third-party services
- [Contact / Book a Meeting](https://veda.ng/contact): Direct consultation and email options
`;

  const llmsIndexContent = `# Vedang Vatsa - Essays, Research & Profile (veda.ng)

> Official personal website and research publication platform of Vedang Vatsa (FRSA). Original essays, biographical profile, educational courses, and machine interfaces.

${whenToUse}

${developerSection}

## Guides & Resources

- [Glossary](https://veda.ng/glossary): Definitions of AI, Web3, and engineering terms.
- [Essays](https://veda.ng/essays): Curated collection of thought pieces on technology, AI, and society.
- [Web3 101](https://veda.ng/web3): Fundamentals of Web3, blockchain, and decentralized technologies.
- [Prompt Engineering](https://veda.ng/prompt): Mastering AI through effective prompt design and instruction.
- [Vibe Coding 101](https://veda.ng/vibecoding): Fast software creation using generative AI and natural language.
- [The Agentic Web](https://veda.ng/agentic): Design patterns, protocol standards, and architectural blueprints for autonomous agents.
- [AI Automation](https://veda.ng/automation): Automate workflows with APIs, MCP servers, AI agents, n8n, and no-code tools.
- [MCP Development](https://veda.ng/mcp): Complete curriculum for Model Context Protocol development.

## Core Content Index

### Published Research Essays
${essayLinks}

- [Device-to-Device Economics and AI Agent Transactions](https://dx.doi.org/10.2139/ssrn.5660270): Economic models for direct AI-to-AI transactions and autonomous economic agents.
- [Stablecoin Growth and Market Dynamics](https://dx.doi.org/10.2139/ssrn.5325570): Analysis of stablecoin adoption, market structure, and financial implications.
- [Stablecoins in the Modern Financial System](https://dx.doi.org/10.2139/ssrn.5329957): The role of stablecoins in digital payments and financial infrastructure.
- [Global Stablecoin Regulations and Policies](https://dx.doi.org/10.2139/ssrn.5386707): Regulatory frameworks and policy responses to stablecoin proliferation.
- [Blockchain Ecosystem Evolution](https://dx.doi.org/10.2139/ssrn.5357534): Historical development and architectural evolution of blockchain networks.
- [Estonia's e-gov and Digital Public Service Delivery Solutions](https://ieeexplore.ieee.org/document/9515004): Digital governance infrastructure and decentralized identity implementation.
- [Analysis of Global Research Proceedings in AI](https://ieeexplore.ieee.org/document/9514979): Comprehensive survey of AI research trends and emerging methodologies.
- [Identification of Algorithmic Bias Through Policy Instruments](https://dx.doi.org/10.21474/IJAR01/11418): Methods for detecting and mitigating bias in AI systems through structured policy analysis.

## Glossary

Featured definitions (see https://veda.ng/glossary for full 100+ terms):

${glossaryIndexLinks}

${trustPages}
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsIndexContent);
  console.log('✅ Generated public/llms.txt successfully!');

  const fullTextSections = essaysData.map(essay => {
    const cleanContent = cleanMdxToMarkdown(essay.content);
    return `## ${essay.title}
URL: ${essay.url}
Summary: ${essay.summary}

${cleanContent}`;
  }).join('\n\n---\n\n');

  const llmsFullContent = `# Vedang Vatsa - Complete Full-Text Essays, Research & Developer Corpus (veda.ng)

> Official personal website and research publication platform of Vedang Vatsa (FRSA). Complete unpaginated full-text of all published essays, profile references, and machine interfaces on veda.ng.

${fullTextSections}

---

## Research Data Archives

- [AI Reports and Research Library](https://veda.ng/ailib): Searchable database of 19,000+ AI reports, research papers, and industry analyses.
- [Web3 Reports and Research Library](https://veda.ng/web3lib): Searchable database of 18,000+ Web3 reports, whitepapers, institutional research, and regulatory frameworks.

---

## Complete Glossary (All ${glossaryTerms.length} Terms)
URL: https://veda.ng/glossary

${glossaryFullLinks}
${whenToUse}
${developerSection}
${trustPages}
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullContent);
  console.log('✅ Generated public/llms-full.txt successfully!');
}

generateFiles();