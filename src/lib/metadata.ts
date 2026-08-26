import { Metadata } from 'next';

interface MetadataParams {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  type?: 'website' | 'article';
}

export const pageMetadata = {
  home: {
    title: 'Vedang Vatsa - Essays, Research & Profile | veda.ng',
    description:
      'Official website of Vedang Vatsa (FRSA) on veda.ng. Personal essays, research papers, profile, and free courses on AI agents and Web3.',
    url: '/',
    keywords: ['Vedang Vatsa', 'veda.ng', 'Essays', 'AI Thought Leader', 'Web3 Expert', 'CVinBio', 'Hashtag Web3', 'AI Researcher', 'DeFi', 'Profile'],
  },
  essays: {
    title: 'Essays by Vedang Vatsa | veda.ng',
    description:
      '40+ original essays and architectural guides by Vedang Vatsa on autonomous AI agents, Model Context Protocol, and decentralized systems.',
    url: '/essays',
    keywords: ['Essays', 'Research Papers', 'AI Agents', 'Stablecoins', 'Blockchain', 'Decentralized Economies', 'Vedang Vatsa', 'veda.ng'],
  },
  web3101: {
    title: 'Web3 101 - Blockchain Fundamentals Course',
    description:
      'Free course on blockchain, cryptocurrencies, smart contracts, dApps, NFTs, DAOs, and decentralized systems on Veda (veda.ng).',
    url: '/web3',
    keywords: ['Web3 Course', 'Blockchain Fundamentals', 'Learn Crypto', 'Smart Contracts', 'dApps', 'NFTs', 'DAOs'],
  },
  promptEngineering: {
    title: 'Prompt Engineering 101 - AI Course',
    description:
      'Master prompt engineering fundamentals. Learn to craft effective prompts for LLMs and AI agents with practical examples on Veda.',
    url: '/prompt',
    keywords: ['Prompt Engineering Course', 'Learn AI Prompts', 'LLM Tutorial', 'AI Assistants', 'Generative AI', 'Prompt Design'],
  },
  community: {
    title: 'Community Building Guide',
    description:
      'Community building playbook: lessons and frameworks from scaling Hashtag Web3 to 120k+ professional members by Vedang Vatsa.',
    url: '/community',
    keywords: ['Community Building', 'Scaling Communities', 'Hashtag Web3', 'Web3 Community', 'Member Engagement', 'Growth Strategy'],
  },
  about: {
    title: 'About Vedang Vatsa - Bio, Research & Profile | veda.ng',
    description:
      'Profile and biography of Vedang Vatsa (FRSA): founder of CVinBio and Hashtag Web3 (120k+ members), IIT Kanpur alumnus, and author of 25+ papers.',
    url: '/about',
    keywords: ['About Vedang Vatsa', 'Vedang Vatsa Profile', 'Vedang Vatsa Bio', 'AI Thought Leaders', 'Top Web3 Speakers', 'Artificial Intelligence Expert', 'Web3 Keynote Speaker', 'CVinBio', 'veda.ng'],
  },
  media: {
    title: 'Speaking Engagements & Media',
    description:
      'Press coverage and 65+ media quotes of Vedang Vatsa in Decrypt, Yahoo Finance, Business Standard, The Tribune, and Outlook Money.',
    url: '/media',
    keywords: ['AI Keynote Speaker', 'Web3 Keynote Speaker', 'Innovation Speaker', 'Top AI Speakers', 'Futurist Speaker', 'Industry Expert Keynote', 'Conference Speaker'],
  },
  agenticWeb: {
    title: 'The Agentic Web - AI Agents Course',
    description:
      'Free course on autonomous AI agents, multi-agent coordination, MCP protocols, and agentic architecture on Veda (veda.ng).',
    url: '/agentic',
    keywords: ['Agentic Web', 'AI Agents Course', 'Autonomous AI', 'Agentic Systems', 'Digital Economy', 'Future of Web'],
  },
  vibeCoding: {
    title: 'Vibe Coding 101 by Vedang Vatsa',
    description:
      'Vibe Coding 101: Free course by Vedang Vatsa on building production software with AI tools like Cursor, Antigravity, and Replit.',
    url: '/vibecoding',
    keywords: ['Vibe Coding', 'Intuitive Engineering', 'Creative Software Design', 'Technical Excellence', 'Design Engineering'],
  },
  seo: {
    title: 'Growth Marketing & SEO Expertise',
    description:
      'Data-driven growth strategies for Web3, FinTech, and AI. Frameworks for programmatic SEO, ASO, and organic acquisition.',
    url: '/seo',
    keywords: ['Growth Marketing', 'SEO Expert', 'Web3 Marketing', 'FinTech Marketing', 'ASO Specialist', 'Community-Led Growth'],
  },
  glossary: {
    title: 'AI & Web3 Glossary',
    description:
      'Authoritative plain-language definitions for 100+ AI, LLM, machine learning, and Web3 terms on Veda (veda.ng).',
    url: '/glossary',
    keywords: ['AI Glossary', 'Web3 Glossary', 'Artificial Intelligence Definitions', 'Blockchain Terms', 'Generative AI Terms', 'Crypto Glossary', 'Large Language Model (LLM)', 'DeFi Terms'],
  },
  mcpDev: {
    title: 'MCP Development 101 - Build AI Tool Servers',
    description:
      'Free course on Model Context Protocol (MCP). Learn to build tool servers connecting AI agents to APIs, databases, and services.',
    url: '/mcp',
    keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude MCP', 'Cursor MCP', 'TypeScript MCP', 'Build MCP Server'],
  },
  aiAutomation: {
    title: 'AI Automation 101 - Automate Anything with AI',
    description:
      'Free guide to AI automation: build autonomous pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools.',
    url: '/automation',
    keywords: ['AI Automation', 'n8n', 'MCP Automation', 'AI Agents', 'API Automation', 'Workflow Automation', 'No-Code AI', 'Telegram Bot'],
  },
  healthProtocols: {
    title: 'Bryan Johnson Blueprint Protocol - Full Reference Guide',
    description:
      "Reference guide to Bryan Johnson's Blueprint protocol: supplements, diet, biomarkers, and routines with transcript data.",
    url: '/health-protocols',
    keywords: ['Bryan Johnson', 'Blueprint Protocol', 'Longevity', 'Anti-Aging', 'Supplements', 'Biohacking', 'Health Optimization', 'Sleep Protocol'],
  },
  aiReports: {
    title: 'AI Reports & Research Library - 2025-2026',
    description:
      'Searchable repository of 1,000+ AI research papers, industry reports, and governance benchmarks on Veda (veda.ng).',
    url: '/ailib',
    keywords: ['AI Reports', 'AI Research Papers', 'State of AI', 'McKinsey AI', 'Stanford AI Index', 'AI Industry Reports', 'AI Governance', 'Generative AI Reports'],
  },
  contact: {
    title: 'Book a Meeting with Vedang Vatsa',
    description:
      'Book a consultation or advisory meeting with Vedang Vatsa (FRSA) for AI strategy, Web3 architecture, or speaking engagements.',
    url: '/contact',
    keywords: ['Book Meeting', 'Schedule Call', 'Vedang Vatsa', 'AI Consulting', 'Web3 Advisory', 'Speaking Engagement'],
  },
  stateOfWeb3: {
    title: 'The State of Web3 | Vedang Vatsa',
    description:
      'Empirical analysis of 128,000+ blockchain research papers indexed on OpenAlex, evaluating global Web3 output and trends.',
    url: '/stateofweb3',
    keywords: ['Web3', 'blockchain', 'OpenAlex', 'DeFi', 'NFT', 'post-quantum', 'CBDC', 'MiCA', 'smart contracts', 'China', 'India'],
  },
  privacy: {
    title: 'Privacy Policy - veda.ng',
    description:
      'Privacy policy for veda.ng: keyless open access, no user accounts, minimal privacy-preserving analytics, and GDPR compliance.',
    url: '/privacy',
    keywords: ['Privacy Policy', 'Data Protection', 'Google Analytics', 'Microsoft Clarity', 'Cal.com', 'GDPR', 'CCPA'],
  },
  developers: {
    title: 'veda.ng Developer Resources - API, MCP Server, Feeds',
    description:
      'Developer portal for veda.ng: open REST APIs, Model Context Protocol (MCP) server, OpenAPI 3.1 spec, and llms.txt index.',
    url: '/developers',
    keywords: ['veda.ng API', 'veda.ng MCP server', 'veda.ng developer docs', 'Vedang Vatsa API', 'Hashtag Web3 developer resources', 'AI research API', 'OpenAlex search API'],
  },
};

export function generateMetadata(params: MetadataParams): Metadata {
  const {
    title,
    description,
    url,
    keywords,
    ogImage = 'https://veda.ng/images/og-homepage.png',
    ogImageAlt = 'Vedang Vatsa - Personal Website, Essays & Research Hub',
    type = 'website',
  } = params;

  // Auto-resolve keywords from pageMetadata if missing
  let resolvedKeywords = keywords;
  if (!resolvedKeywords) {
    const pageKey = Object.keys(pageMetadata).find(
      key => pageMetadata[key as keyof typeof pageMetadata].url === url
    );
    if (pageKey) {
      resolvedKeywords = pageMetadata[pageKey as keyof typeof pageMetadata].keywords;
    }
  }

  const resolvedOgImage = ogImage.startsWith('http') ? ogImage : `https://veda.ng${ogImage}`;

  const openGraph: any = {
    title,
    description,
    url,
    type,
    siteName: 'Vedang Vatsa',
    locale: 'en_US',
    images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: ogImageAlt }],
  };

  const twitter: any = {
    card: 'summary_large_image',
    title,
    description,
    images: [resolvedOgImage],
  };

  const isLongTitle = title.length > 45 || title.includes('Vedang Vatsa');

  return {
    title: isLongTitle ? { absolute: title } : title,
    description,
    keywords: resolvedKeywords,
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter,
  };
}
