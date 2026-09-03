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
    title: 'Vedang Vatsa - Essays, Research & Profile (veda.ng)',
    description:
      'Official personal website and research hub of Vedang Vatsa (FRSA) on veda.ng. Personal essays, research papers, profile, and free courses on AI agents and Web3.',
    url: '/',
    keywords: ['Vedang Vatsa', 'veda.ng', 'Vedang Vatsa Website', 'Essays', 'AI Thought Leader', 'Web3 Expert', 'CVinBio', 'Hashtag Web3', 'AI Researcher', 'DeFi', 'Profile'],
  },
  essays: {
    title: 'Essays by Vedang Vatsa | veda.ng',
    description:
      '40+ original essays and architectural guides by Vedang Vatsa on autonomous AI agents, Model Context Protocol, and decentralized systems.',
    url: '/essays',
    keywords: ['Essays', 'Research Papers', 'AI Agents', 'Stablecoins', 'Blockchain', 'Decentralized Economies', 'Vedang Vatsa', 'veda.ng'],
  },
  web3101: {
    title: 'Web3 101 - Blockchain Fundamentals Course | Vedang Vatsa',
    description:
      'Free course on blockchain, cryptocurrencies, smart contracts, dApps, NFTs, DAOs, and decentralized systems by Vedang Vatsa on veda.ng.',
    url: '/web3',
    keywords: ['Web3 Course', 'Blockchain Fundamentals', 'Learn Crypto', 'Smart Contracts', 'dApps', 'NFTs', 'DAOs', 'Vedang Vatsa'],
  },
  promptEngineering: {
    title: 'Prompt Engineering 101 - AI Course | Vedang Vatsa',
    description:
      'Master prompt engineering fundamentals. Learn to craft effective prompts for LLMs and AI agents with practical examples by Vedang Vatsa on veda.ng.',
    url: '/prompt',
    keywords: ['Prompt Engineering Course', 'Learn AI Prompts', 'LLM Tutorial', 'AI Assistants', 'Generative AI', 'Prompt Design', 'Vedang Vatsa'],
  },
  community: {
    title: 'Community Building Guide | Vedang Vatsa',
    description:
      'Community building playbook: lessons and frameworks from scaling Hashtag Web3 to 120k+ professional members by Vedang Vatsa.',
    url: '/community',
    keywords: ['Community Building', 'Scaling Communities', 'Hashtag Web3', 'Web3 Community', 'Member Engagement', 'Growth Strategy', 'Vedang Vatsa'],
  },
  about: {
    title: 'About Vedang Vatsa - Bio, Research & Profile | veda.ng',
    description:
      'Profile and biography of Vedang Vatsa (FRSA): founder of CVinBio and Hashtag Web3 (120k+ members), IIT Kanpur alumnus, and author of 25+ papers.',
    url: '/about',
    keywords: ['About Vedang Vatsa', 'Vedang Vatsa Profile', 'Vedang Vatsa Bio', 'AI Thought Leaders', 'Top Web3 Speakers', 'Artificial Intelligence Expert', 'Web3 Keynote Speaker', 'CVinBio', 'veda.ng', 'Vedang Vatsa'],
  },
  media: {
    title: 'Speaking Engagements & Media Coverage | Vedang Vatsa',
    description:
      'Press coverage and 65+ media quotes of Vedang Vatsa in Decrypt, Yahoo Finance, Business Standard, The Tribune, and Outlook Money.',
    url: '/media',
    keywords: ['Vedang Vatsa', 'AI Keynote Speaker', 'Web3 Keynote Speaker', 'Innovation Speaker', 'Top AI Speakers', 'Futurist Speaker', 'Industry Expert Keynote', 'Conference Speaker'],
  },
  agenticWeb: {
    title: 'The Agentic Web - AI Agents Course | Vedang Vatsa',
    description:
      'Free course on autonomous AI agents, multi-agent coordination, MCP protocols, and agentic architecture by Vedang Vatsa on veda.ng.',
    url: '/agentic',
    keywords: ['Agentic Web', 'AI Agents Course', 'Autonomous AI', 'Agentic Systems', 'Digital Economy', 'Future of Web', 'Vedang Vatsa'],
  },
  vibeCoding: {
    title: 'Vibe Coding 101 - AI Software Engineering | Vedang Vatsa',
    description:
      'Vibe Coding 101: Free course by Vedang Vatsa on building production software with AI tools like Cursor, Antigravity, and Replit.',
    url: '/vibecoding',
    keywords: ['Vibe Coding', 'Intuitive Engineering', 'Creative Software Design', 'Technical Excellence', 'Design Engineering', 'Vedang Vatsa'],
  },
  seo: {
    title: 'Growth Marketing & SEO Expertise | Vedang Vatsa',
    description:
      'Data-driven growth strategies for Web3, FinTech, and AI by Vedang Vatsa. Frameworks for programmatic SEO, ASO, and organic acquisition.',
    url: '/seo',
    keywords: ['Growth Marketing', 'SEO Expert', 'Web3 Marketing', 'FinTech Marketing', 'ASO Specialist', 'Community-Led Growth', 'Vedang Vatsa'],
  },
  glossary: {
    title: 'AI & Web3 Glossary | Vedang Vatsa (veda.ng)',
    description:
      'Authoritative plain-language definitions for 100+ AI, LLM, machine learning, and Web3 terms curated by Vedang Vatsa on veda.ng.',
    url: '/glossary',
    keywords: ['AI Glossary', 'Web3 Glossary', 'Artificial Intelligence Definitions', 'Blockchain Terms', 'Generative AI Terms', 'Crypto Glossary', 'Large Language Model (LLM)', 'DeFi Terms', 'Vedang Vatsa'],
  },
  mcpDev: {
    title: 'MCP Development 101 - Build AI Tool Servers | Vedang Vatsa',
    description:
      'Free course on Model Context Protocol (MCP) by Vedang Vatsa. Learn to build tool servers connecting AI agents to APIs, databases, and services.',
    url: '/mcp',
    keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude MCP', 'Cursor MCP', 'TypeScript MCP', 'Build MCP Server', 'Vedang Vatsa'],
  },
  aiAutomation: {
    title: 'AI Automation 101 - Automate Anything with AI | Vedang Vatsa',
    description:
      'Free guide to AI automation by Vedang Vatsa: build autonomous pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools.',
    url: '/automation',
    keywords: ['AI Automation', 'n8n', 'MCP Automation', 'AI Agents', 'API Automation', 'Workflow Automation', 'No-Code AI', 'Telegram Bot', 'Vedang Vatsa'],
  },
  healthProtocols: {
    title: 'Bryan Johnson Blueprint Protocol - Reference Guide | Vedang Vatsa',
    description:
      "Reference guide to Bryan Johnson's Blueprint protocol: supplements, diet, biomarkers, and routines by Vedang Vatsa on veda.ng.",
    url: '/health-protocols',
    keywords: ['Bryan Johnson', 'Blueprint Protocol', 'Longevity', 'Anti-Aging', 'Supplements', 'Biohacking', 'Health Optimization', 'Sleep Protocol', 'Vedang Vatsa'],
  },
  aiReports: {
    title: 'AI Reports & Research Library - 2025-2026 | Vedang Vatsa',
    description:
      'Searchable repository of 1,000+ AI research papers, industry reports, and governance benchmarks curated by Vedang Vatsa on veda.ng.',
    url: '/ailib',
    keywords: ['AI Reports', 'AI Research Papers', 'State of AI', 'McKinsey AI', 'Stanford AI Index', 'AI Industry Reports', 'AI Governance', 'Generative AI Reports', 'Vedang Vatsa'],
  },
  contact: {
    title: 'Contact Vedang Vatsa - Book a Consultation (veda.ng)',
    description:
      'Book an advisory consultation with Vedang Vatsa (FRSA) for AI strategy, Web3 architecture, or speaking engagements.',
    url: '/contact',
    keywords: ['Book Meeting', 'Schedule Call', 'Vedang Vatsa', 'Contact Vedang Vatsa', 'AI Consulting', 'Web3 Advisory', 'Speaking Engagement'],
  },
  stateOfWeb3: {
    title: 'The State of Web3 - Research Study | Vedang Vatsa',
    description:
      'Empirical analysis of 128,000+ blockchain research papers indexed on OpenAlex by Vedang Vatsa, evaluating global Web3 output and trends.',
    url: '/stateofweb3',
    keywords: ['Web3', 'blockchain', 'OpenAlex', 'DeFi', 'NFT', 'post-quantum', 'CBDC', 'MiCA', 'smart contracts', 'Vedang Vatsa'],
  },
  privacy: {
    title: 'Privacy Policy | Vedang Vatsa (veda.ng)',
    description:
      'Privacy policy for veda.ng by Vedang Vatsa: keyless open access, no user accounts, minimal privacy-preserving analytics, and GDPR compliance.',
    url: '/privacy',
    keywords: ['Privacy Policy', 'Data Protection', 'Google Analytics', 'Microsoft Clarity', 'Cal.com', 'GDPR', 'CCPA', 'Vedang Vatsa'],
  },
  developers: {
    title: 'Vedang Vatsa Developer Resources, API Docs & MCP Server (veda.ng)',
    description:
      'Official developer portal for Vedang Vatsa (veda.ng): open REST APIs, Model Context Protocol (MCP) server, OpenAPI 3.1 spec, Python SDK (vedang-cli), and NPM SDK (vedang).',
    url: '/developers',
    keywords: ['Vedang Vatsa Developer Resources', 'Vedang Vatsa API', 'Vedang Vatsa MCP server', 'Vedang Vatsa developer docs', 'veda.ng API', 'veda.ng MCP server', 'Hashtag Web3 developer resources', 'AI research API', 'OpenAlex search API'],
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
    other: {
      'article:modified_time': '2026-09-03T00:00:00.000Z',
      'dateModified': '2026-09-03',
    },
  };
}
