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
    title: 'Vedang Vatsa - AI & Web3 Thought Leader',
    description:
      'Vedang Vatsa - Founder of Hashtag Web3 (120k+ professionals), FRSA, IIT Kanpur alumnus. Essays, research, and free courses on AI agents and Web3.',
    url: '/',
    keywords: ['AI Thought Leader', 'Web3 Expert', 'Blockchain Technology', 'Generative AI', 'Future of AI', 'Decentralized Finance', 'DeFi', 'Digital Assets', 'Web3 Ecosystem'],
  },
  essays: {
    title: 'Essays on AI & Web3',
    description:
      'Essays and research papers on AI agents, blockchain systems, stablecoins, and decentralized economies by Vedang Vatsa.',
    url: '/essays',
    keywords: ['Essays', 'Research Papers', 'AI Agents', 'Stablecoins', 'Blockchain', 'Decentralized Economies', 'Vedang Vatsa'],
  },
  web3101: {
    title: 'Web3 101 - Blockchain Fundamentals Course',
    description:
      'Free course on blockchain, cryptocurrencies, smart contracts, dApps, NFTs, DAOs, and decentralized systems.',
    url: '/web3',
    keywords: ['Web3 Course', 'Blockchain Fundamentals', 'Learn Crypto', 'Smart Contracts', 'dApps', 'NFTs', 'DAOs'],
  },
  promptEngineering: {
    title: 'Prompt Engineering 101 - AI Course',
    description:
      'Master prompt engineering fundamentals. Learn to craft effective prompts for LLMs and AI assistants.',
    url: '/prompt',
    keywords: ['Prompt Engineering Course', 'Learn AI Prompts', 'LLM Tutorial', 'AI Assistants', 'Generative AI', 'Prompt Design'],
  },
  community: {
    title: 'Community Building Guide',
    description:
      'Strategies for building engaged communities. Lessons from scaling Hashtag Web3 to 100k+ members.',
    url: '/community',
    keywords: ['Community Building', 'Scaling Communities', 'Hashtag Web3', 'Web3 Community', 'Member Engagement', 'Growth Strategy'],
  },
  profile: {
    title: 'Vedang Vatsa - Founder & AI Researcher',
    description:
      'Profile of Vedang Vatsa: founder of Hashtag Web3, speaker, researcher, and thought leader in AI and Web3.',
    url: '/profile',
    keywords: ['AI Thought Leaders', 'Top Web3 Speakers', 'Artificial Intelligence Expert', 'Web3 Keynote Speaker', 'Blockchain Thought Leaders', 'AI in Business', 'AI Innovation'],
  },
  media: {
    title: 'Speaking Engagements & Media',
    description:
      'Speaking engagements, interviews, and media mentions. Featured in TechCrunch, Forbes, Crypto Briefing.',
    url: '/media',
    keywords: ['AI Keynote Speaker', 'Web3 Keynote Speaker', 'Innovation Speaker', 'Top AI Speakers', 'Futurist Speaker', 'Industry Expert Keynote', 'Conference Speaker'],
  },
  agenticWeb: {
    title: 'The Agentic Web - AI Agents Course',
    description:
      'Learn about autonomous AI agents and agentic systems transforming the web and digital economy.',
    url: '/agentic',
    keywords: ['Agentic Web', 'AI Agents Course', 'Autonomous AI', 'Agentic Systems', 'Digital Economy', 'Future of Web'],
  },
  vibeCoding: {
    title: 'Vibe Coding 101 by Vedang Vatsa',
    description:
      'Vibe Coding 101: A free course on building real apps with AI. Learn to build software in plain English using Cursor, Replit, Antigravity, and Lovable.',
    url: '/vibecoding',
    keywords: ['Vibe Coding', 'Intuitive Engineering', 'Creative Software Design', 'Technical Excellence', 'Design Engineering'],
  },
  seo: {
    title: 'Growth Marketing & SEO Expertise',
    description:
      'Data-driven growth strategies for Web3, FinTech, and mobile. Expert in SEO, ASO, and community-led growth.',
    url: '/seo',
    keywords: ['Growth Marketing', 'SEO Expert', 'Web3 Marketing', 'FinTech Marketing', 'ASO Specialist', 'Community-Led Growth'],
  },
  glossary: {
    title: 'AI & Web3 Glossary',
    description:
      'Definitions of AI and Web3 terms, including LLMs, AGI, smart contracts, and DeFi.',
    url: '/glossary',
    keywords: ['AI Glossary', 'Web3 Glossary', 'Artificial Intelligence Definitions', 'Blockchain Terms', 'Generative AI Terms', 'Crypto Glossary', 'Large Language Model (LLM)', 'DeFi Terms'],
  },
  mcpDev: {
    title: 'MCP Development 101 - Build AI Tool Servers',
    description:
      'Free course on building MCP servers. Learn the Model Context Protocol to connect AI to databases, APIs, and any data source.',
    url: '/mcp',
    keywords: ['MCP', 'Model Context Protocol', 'MCP Server', 'AI Tools', 'Claude MCP', 'Cursor MCP', 'TypeScript MCP', 'Build MCP Server'],
  },
  aiAutomation: {
    title: 'AI Automation 101 - Automate Anything with AI',
    description:
      'Free course on AI-powered automation. Build pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools.',
    url: '/automation',
    keywords: ['AI Automation', 'n8n', 'MCP Automation', 'AI Agents', 'API Automation', 'Workflow Automation', 'No-Code AI', 'Telegram Bot'],
  },
  healthProtocols: {
    title: 'Bryan Johnson Blueprint Protocol - Full Reference Guide',
    description:
      'A detailed breakdown of Bryan Johnson\'s Blueprint longevity protocol: supplements, diet, exercise, and sleep routines backed by transcript data.',
    url: '/health-protocols',
    keywords: ['Bryan Johnson', 'Blueprint Protocol', 'Longevity', 'Anti-Aging', 'Supplements', 'Biohacking', 'Health Optimization', 'Sleep Protocol'],
  },
  aiReports: {
    title: 'AI Reports & Research Library - 2025-2026',
    description:
      '1000+ AI reports, research papers, and industry analyses from Stanford, McKinsey, Deloitte, OpenAI, and more.',
    url: '/ailib',
    keywords: ['AI Reports', 'AI Research Papers', 'State of AI', 'McKinsey AI', 'Stanford AI Index', 'AI Industry Reports', 'AI Governance', 'Generative AI Reports'],
  },
  meeting: {
    title: 'Book a Meeting with Vedang Vatsa',
    description:
      'Schedule a 1:1 conversation with Vedang Vatsa. Available for AI strategy, Web3 advisory, speaking engagements, and collaboration.',
    url: '/meeting',
    keywords: ['Book Meeting', 'Schedule Call', 'Vedang Vatsa', 'AI Consulting', 'Web3 Advisory', 'Speaking Engagement'],
  },
  stateOfWeb3: {
    title: 'The State of Web3 | Vedang Vatsa',
    description:
      'On 12 June 2026 OpenAlex tagged 128,286 blockchain papers. Yearly output grew 117 times from 2013 to 2025. A paper total is not a count of working software or of statutes in force.',
    url: '/stateofweb3',
    keywords: ['Web3', 'blockchain', 'OpenAlex', 'DeFi', 'NFT', 'post-quantum', 'CBDC', 'MiCA', 'smart contracts', 'China', 'India'],
  },
  privacy: {
    title: 'Privacy Policy - veda.ng',
    description:
      'How veda.ng handles data: no accounts, no profiles. Google Analytics 4 and Microsoft Clarity analytics plus a Cal.com booking embed, described in plain language.',
    url: '/privacy',
    keywords: ['Privacy Policy', 'Data Protection', 'Google Analytics', 'Microsoft Clarity', 'Cal.com', 'GDPR', 'CCPA'],
  },
  developers: {
    title: 'veda.ng Developer Resources - API, MCP Server, Feeds',
    description:
      'Developer and AI agent interfaces for veda.ng: public research search API, MCP server over Streamable HTTP, OpenAPI spec, RSS feed, sitemap, llms.txt index, and Markdown content negotiation.',
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
    ogImage,
    ogImageAlt = 'Vedang Vatsa',
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

  // Only set images if an explicit ogImage is provided.
  // Otherwise, Next.js will use the dynamic opengraph-image.tsx generator.
  const openGraph: any = {
    title,
    description,
    url,
    type,
    ...(ogImage ? {
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }],
    } : {}),
  };

  const twitter: any = {
    card: 'summary_large_image',
    title,
    description,
    ...(ogImage ? { images: [ogImage] } : {}),
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
