export interface ExamQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const examQuestions: Record<string, ExamQuestion[]> = {
  'vibe-coding': [
    {
      question: 'In the GCES framework, what does the "S" stand for?',
      options: ['Structure', 'Source', 'Style', 'Scope'],
      correctIndex: 1,
    },
    {
      question: 'What is the primary role of a vibe coder compared to a traditional developer?',
      options: [
        'Writing optimized algorithms',
        'Acting as a creative director who guides AI with intent and constraints',
        'Debugging compiled binaries',
        'Managing server infrastructure',
      ],
      correctIndex: 1,
    },
    {
      question: 'Which tool category runs entirely in your terminal as an autonomous coding agent?',
      options: ['Lovable and v0', 'Replit', 'Claude Code and Antigravity', 'Figma'],
      correctIndex: 2,
    },
    {
      question: 'When debugging AI-generated code, what is the most effective first step?',
      options: [
        'Rewrite the entire file manually',
        'Paste the exact error message back to the AI with context about what you expected',
        'Switch to a different AI model immediately',
        'Delete the project and start over',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the recommended approach for deploying a vibe-coded project to production?',
      options: [
        'Email the code to your hosting provider',
        'Use Git-based CI/CD pipelines with platforms like Vercel or Firebase App Hosting',
        'Copy files via FTP to a shared server',
        'Run the dev server on your laptop and share the URL',
      ],
      correctIndex: 1,
    },
  ],

  'prompt-engineering-101': [
    {
      question: 'What is the fundamental mechanism behind how large language models generate text?',
      options: [
        'Searching a database of pre-written answers',
        'Predicting the next most probable token based on the input sequence',
        'Executing code to compute answers',
        'Copying from training documents verbatim',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the key benefit of Chain-of-Thought (CoT) prompting?',
      options: [
        'It makes the model respond faster',
        'It forces the model to show intermediate reasoning steps, improving accuracy on complex tasks',
        'It reduces token usage',
        'It bypasses the model safety filters',
      ],
      correctIndex: 1,
    },
    {
      question: 'In few-shot prompting, what are you providing the model?',
      options: [
        'Access to external databases',
        'Example input-output pairs that demonstrate the desired pattern',
        'Additional compute resources',
        'A compiled function to execute',
      ],
      correctIndex: 1,
    },
    {
      question: 'What does RAG (Retrieval-Augmented Generation) solve?',
      options: [
        'Making models run on mobile devices',
        'The knowledge cutoff problem by retrieving relevant documents before generation',
        'Generating images from text',
        'Training new models from scratch',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the purpose of a system prompt?',
      options: [
        'To train the model on new data',
        'To set persistent instructions, persona, and constraints for the entire conversation',
        'To delete previous conversations',
        'To change the model architecture',
      ],
      correctIndex: 1,
    },
  ],

  'ai-automation': [
    {
      question: 'What is the "automation mindset" fundamentally about?',
      options: [
        'Replacing all human workers with robots',
        'Identifying repetitive tasks and designing systems where machines handle them',
        'Using only no-code tools for everything',
        'Writing code as fast as possible',
      ],
      correctIndex: 1,
    },
    {
      question: 'What makes n8n different from Zapier for automation?',
      options: [
        'n8n only works on Windows',
        'n8n is open-source, self-hostable, has no per-task limits, and includes AI nodes and a code node',
        'n8n does not support any third-party integrations',
        'Zapier is always free while n8n is always paid',
      ],
      correctIndex: 1,
    },
    {
      question: 'In API authentication, what is a Bearer token?',
      options: [
        'A physical USB security key',
        'A credential string sent in the Authorization header that grants access to protected endpoints',
        'The URL of the API server',
        'A type of database query',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is MCP (Model Context Protocol) used for in automation?',
      options: [
        'Compressing video files',
        'Providing a standardized way for AI agents to connect to external tools and data sources',
        'Managing CSS stylesheets',
        'Encrypting email messages',
      ],
      correctIndex: 1,
    },
    {
      question: 'When should you move from no-code automation to custom code?',
      options: [
        'Never, no-code handles everything',
        'When you need complex data processing, custom APIs, cost efficiency at scale, or version control',
        'Only when your boss tells you to',
        'When you want the automation to run slower',
      ],
      correctIndex: 1,
    },
  ],

  'mcp-development': [
    {
      question: 'What problem does MCP (Model Context Protocol) solve?',
      options: [
        'Making AI models smaller',
        'Providing a universal, standardized protocol for connecting AI models to external tools and data',
        'Replacing HTTP as a web protocol',
        'Generating training data for models',
      ],
      correctIndex: 1,
    },
    {
      question: 'What are the three primitives in MCP?',
      options: [
        'GET, POST, DELETE',
        'Tools, Resources, and Prompts',
        'Input, Process, Output',
        'Server, Client, Network',
      ],
      correctIndex: 1,
    },
    {
      question: 'What transport does MCP use for local (same-machine) communication?',
      options: [
        'WebSockets over TLS',
        'stdio (standard input/output)',
        'GraphQL subscriptions',
        'UDP multicast',
      ],
      correctIndex: 1,
    },
    {
      question: 'In MCP, what is the difference between a Tool and a Resource?',
      options: [
        'There is no difference',
        'Tools perform actions (side effects), Resources provide read-only data',
        'Tools are free, Resources cost money',
        'Resources run code, Tools store data',
      ],
      correctIndex: 1,
    },
    {
      question: 'What security practice is critical when deploying an MCP server to production?',
      options: [
        'Making all endpoints public with no authentication',
        'Input validation, rate limiting, and never hardcoding secrets',
        'Using HTTP instead of HTTPS for speed',
        'Disabling all logging to save disk space',
      ],
      correctIndex: 1,
    },
  ],

  'agentic-web': [
    {
      question: 'What is the "Agentic Web" fundamentally about?',
      options: [
        'A new social media platform',
        'The evolution from an information-retrieval web to one where AI agents take actions on behalf of users',
        'A blockchain-based internet replacement',
        'A virtual reality metaverse',
      ],
      correctIndex: 1,
    },
    {
      question: 'What are the core components of an AI agent?',
      options: [
        'CPU, RAM, and SSD',
        'An LLM for reasoning, tools for action, and memory for context persistence',
        'HTML, CSS, and JavaScript',
        'A database and a web server',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the A2A (Agent-to-Agent) protocol designed for?',
      options: [
        'Agent-to-admin communication',
        'Standardized communication between AI agents built by different providers',
        'Audio-to-audio transcription',
        'Automated testing of APIs',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is a key challenge of the Agentic Web related to trust?',
      options: [
        'Agents are too slow',
        'Determining when to grant agents permission to act, how to verify their identity, and how to handle errors',
        'Agents use too much electricity',
        'Agents cannot connect to the internet',
      ],
      correctIndex: 1,
    },
    {
      question: 'In a ReAct loop, what does an agent do?',
      options: [
        'Only reads data, never acts',
        'Alternates between reasoning about the task and taking actions, observing results after each step',
        'Runs a single function and stops',
        'Trains a new model on each request',
      ],
      correctIndex: 1,
    },
  ],

  'web3-101': [
    {
      question: 'What is the core innovation of blockchain technology?',
      options: [
        'Faster internet speeds',
        'A decentralized, immutable ledger that enables trustless transactions without intermediaries',
        'A new programming language',
        'Wireless networking protocol',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is a smart contract?',
      options: [
        'A legal document signed digitally',
        'Self-executing code deployed on a blockchain that runs automatically when conditions are met',
        'A type of cryptocurrency wallet',
        'An AI chatbot for customer service',
      ],
      correctIndex: 1,
    },
    {
      question: 'What problem do Layer 2 solutions (like Arbitrum or Optimism) solve?',
      options: [
        'They replace Ethereum entirely',
        'They increase transaction throughput and reduce gas fees by processing transactions off the main chain',
        'They mine new Bitcoin',
        'They provide cloud storage',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the difference between a custodial and non-custodial wallet?',
      options: [
        'Custodial wallets are free, non-custodial cost money',
        'In a custodial wallet, a third party holds your private keys. In non-custodial, only you control your keys.',
        'They are the same thing',
        'Non-custodial wallets only work offline',
      ],
      correctIndex: 1,
    },
    {
      question: 'What does "tokenomics" refer to?',
      options: [
        'The physical design of crypto coins',
        'The economic model governing a token: supply, distribution, utility, and incentive mechanisms',
        'The speed of token transfers',
        'The color scheme of a project website',
      ],
      correctIndex: 1,
    },
  ],
};
