import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { glossaryTerms } from '../src/lib/glossary';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const PUBLIC_DIR = path.resolve(REPO_ROOT, 'public');

function cleanMDX(content: string): string {
  let text = content;
  
  // Remove HTML and MDX comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // 1. Convert Callout to Blockquote
  text = text.replace(/<Callout\b[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/Callout>/g, '> **$1**\n> $2');
  text = text.replace(/<Callout\b[^>]*>([\s\S]*?)<\/Callout>/g, '> $1');
  
  // 2. Convert KeyTakeaway to Blockquote
  text = text.replace(/<KeyTakeaway\b[^>]*>([\s\S]*?)<\/KeyTakeaway>/g, '> **Key Takeaway**\n> $1');
  
  // 3. Convert PullQuote to Blockquote
  text = text.replace(/<PullQuote\b[^>]*>([\s\S]*?)<\/PullQuote>/g, '> $1');
  
  // 4. Convert StatRow and Stat components
  // Parse individual Stats in StatRow
  text = text.replace(/<Stat\s+value="([^"]+)"\s+label="([^"]+)"(?:\s+source="([^"]+)")?[^>]*\/>/g, (match, value, label, source) => {
    return `- **${value}**: ${label}${source ? ` (${source})` : ''}`;
  });
  // Strip StatRow tags
  text = text.replace(/<\/?StatRow>/g, '');
  
  // 5. Convert Figure components to clean markdown image tags or remove them
  text = text.replace(/<Figure\s+src="([^"]+)"\s+alt="([^"]+)"[^>]*\/>/g, '![$2]($1)');
  text = text.replace(/<Figure\b[^>]*\/>/g, ''); // strip default figures without alt
  
  // 6. Strip all other self-closing JSX components (like custom charts, matrix tables, grids)
  text = text.replace(/<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*?)?\/>/g, '');
  
  // 7. Strip any opening or closing tags of custom React components that contain text but we just want to keep the text inside
  text = text.replace(/<\/?(?:Columns|Column|div|span|section|article)\b[^>]*>/g, '');
  
  // Trim multiple consecutive newlines down to 2
  text = text.replace(/\n{3,}/g, '\n\n');
  
  return text.trim();
}

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

  // Sort essays by date descending
  essaysData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 1. Generate public/llms.txt (Structured Index)
  const essayLinks = essaysData
    .map(essay => `- [${essay.title}](${essay.url}): ${essay.summary}`)
    .join('\n');

  const glossaryLinks = glossaryTerms
    .map(term => {
      const firstSentence = term.definition.split(/[.!?](?:\s|$)/)[0] + '.';
      return `- [${term.term}](https://veda.ng/glossary/${term.slug}): ${firstSentence}`;
    })
    .join('\n');

  const llmsIndexContent = `# Vedang Vatsa

> Founder of Hashtag Web3, a community of over 100,000 AI & Web3 professionals. This website serves as a central hub for my research, essays, and professional profile.

This file provides a structured overview of the site's content for Large Language Models. The essays linked below explore the frontiers of technology, AI, and society.

## Guides & Resources

- [Glossary](https://veda.ng/glossary): Comprehensive definitions of AI, Web3, and technical terms. Reference guide for developers and researchers.
- [Essays](https://veda.ng/essays): Curated collection of thought pieces on technology, AI, and society.
- [Web3 101](https://veda.ng/web3-101): Fundamentals of Web3, blockchain, and decentralized technologies.
- [Prompt Engineering](https://veda.ng/prompt-engineering-101): Mastering AI through effective prompt design and instruction.
- [Agentic Web](https://veda.ng/agentic-web): The future of autonomous AI agents and their role in the internet.
- [Vibe Coding](https://veda.ng/vibe-coding): A philosophy of intuitive, human-centered software development.
- [English to LinkedIn Translator](https://veda.ng/lit): AI-powered tool that translates honest human language into over-the-top LinkedIn corporate speak.

## Essays

${essayLinks}

## Research Data Archives

- [AI Reports and Research Library](https://veda.ng/ai-reports): Searchable database of 19,000+ AI reports, research papers, and industry analyses from Stanford, McKinsey, Deloitte, OpenAI, and more.
- [Web3 Reports and Research Library](https://veda.ng/web3-reports): Searchable database of 18,000+ Web3 reports, whitepapers, institutional research, and regulatory frameworks.

## Research Papers

Selected peer-reviewed research on AI, Web3, and economic systems:

- [Device-to-Device Economics and AI Agent Transactions](https://dx.doi.org/10.2139/ssrn.5660270): Economic models for direct AI-to-AI transactions and autonomous economic agents.
- [Stablecoin Growth and Market Dynamics](https://dx.doi.org/10.2139/ssrn.5325570): Analysis of stablecoin adoption, market structure, and financial implications.
- [Stablecoins in the Modern Financial System](https://dx.doi.org/10.2139/ssrn.5329957): The role of stablecoins in digital payments and financial infrastructure.
- [Global Stablecoin Regulations and Policies](https://dx.doi.org/10.2139/ssrn.5386707): Regulatory frameworks and policy responses to stablecoin proliferation.
- [Blockchain Ecosystem Evolution](https://dx.doi.org/10.2139/ssrn.5357534): Historical development and architectural evolution of blockchain networks.
- [Estonia's e-gov and Digital Public Service Delivery Solutions](https://ieeexplore.ieee.org/document/9515004): Digital governance infrastructure and decentralized identity implementation.
- [Analysis of Global Research Proceedings in AI](https://ieeexplore.ieee.org/document/9514979): Comprehensive survey of AI research trends and emerging methodologies.
- [Identification of Algorithmic Bias Through Policy Instruments](https://dx.doi.org/10.21474/IJAR01/11418): Methods for detecting and mitigating bias in AI systems through structured policy analysis.

## Glossary

Individual definitions for AI, Web3, and technical terms at \`/glossary/[slug]\`. All ${glossaryTerms.length} terms:

${glossaryLinks}
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsIndexContent);
  console.log('✅ Generated public/llms.txt successfully!');

  // 2. Generate public/llms-full.txt (Full Content Index)
  const fullTextSections = essaysData.map(essay => {
    const cleanContent = cleanMDX(essay.content);
    return `## ${essay.title}
URL: ${essay.url}
Summary: ${essay.summary}

${cleanContent}`;
  }).join('\n\n---\n\n');

  const llmsFullContent = `# Vedang Vatsa - Full Content Index

> This is the full-text version of llms.txt, containing complete essay content for AI model training and citation.

${fullTextSections}

---

## Research Data Archives

- [AI Reports and Research Library](https://veda.ng/ai-reports): Searchable database of 19,000+ AI reports, research papers, and industry analyses.
- [Web3 Reports and Research Library](https://veda.ng/web3-reports): Searchable database of 18,000+ Web3 reports, whitepapers, institutional research, and regulatory frameworks.

---

## Glossary
URL: https://veda.ng/glossary

This site includes a comprehensive glossary of ${glossaryTerms.length} terms covering AI, Web3, and Technology.
Each term has a detailed 300+ word definition. Browse all terms at https://veda.ng/glossary
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullContent);
  console.log('✅ Generated public/llms-full.txt successfully!');
}

generateFiles();
