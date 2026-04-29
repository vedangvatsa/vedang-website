export interface ExamQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export const examQuestions: Record<string, ExamQuestion[]> = {
  'vibe-coding': [
    {
      question: 'In the GCES framework, what is the purpose of defining "Anti-Features" in your PRD?',
      options: [
        'To list features you want to build in the next version',
        'To explicitly tell the AI what NOT to build, preventing it from adding unwanted complexity',
        'To document bugs found during testing',
        'To define the color scheme and typography rules',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the "Golden Rule of Iteration" taught in the course?',
      options: [
        'Always use the most expensive AI model available for best results',
        'Make one change per prompt, test after every change, and revert if the AI goes off track',
        'Write the entire application specification in a single prompt for consistency',
        'Switch AI tools after every three prompts to get diverse output',
      ],
      correctIndex: 1,
    },
    {
      question: 'When the AI enters a "fix loop" — fixing one bug but creating another repeatedly — what does the course recommend?',
      options: [
        'Keep iterating until the AI figures it out',
        'Add more detail to the same prompt and try again',
        'Stop, revert to the last working commit, describe the feature from scratch with more context, or switch tools for a fresh perspective',
        'Delete the entire project and use a different AI tool',
      ],
      correctIndex: 2,
    },
    {
      question: 'The "Debugging Trifecta" requires providing three things to the AI. What are they?',
      options: [
        'The project name, your operating system, and the AI model version',
        'The full error message, the relevant code, and what you were trying to do (intended behavior)',
        'A screenshot, the file name, and the line number',
        'The Git commit hash, the branch name, and the test results',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is "Negative Space Prompting" as described in the advanced techniques?',
      options: [
        'Using dark color schemes in your design prompts',
        'Telling the AI what to leave out of the design or build, reducing scope to only what you need',
        'Prompting the AI to critique its own output and find flaws',
        'Asking the AI to generate alternative approaches and choose the worst one',
      ],
      correctIndex: 1,
    },
    {
      question: 'According to the course, what is the correct name for the rule file used by Antigravity (Google\'s coding agent)?',
      options: [
        '.cursorrules',
        'CLAUDE.md',
        '.gemini/style.md',
        '.windsurfrules',
      ],
      correctIndex: 2,
    },
    {
      question: 'A TypeError: "Cannot read properties of undefined (reading \'map\')" most likely indicates what?',
      options: [
        'A syntax error like a missing semicolon',
        'The variable you\'re calling .map() on hasn\'t been set or loaded yet (data hasn\'t arrived from the API)',
        'Your internet connection dropped during the API call',
        'The AI generated code in Python instead of JavaScript',
      ],
      correctIndex: 1,
    },
  ],

  'prompt-engineering-101': [
    {
      question: 'What is the "Self-Consistency" technique and how does it improve on Chain-of-Thought?',
      options: [
        'It asks the model to verify its grammar and spelling before responding',
        'It generates multiple reasoning chains at higher temperature, then takes the majority-vote answer across all paths',
        'It forces the model to produce the same answer regardless of how the question is phrased',
        'It checks the model\'s answer against a pre-defined database of correct responses',
      ],
      correctIndex: 1,
    },
    {
      question: 'What temperature setting should you use for code generation and data extraction tasks?',
      options: [
        'Temperature 1.0+ for maximum creativity',
        'Temperature 0.7 as the balanced default',
        'Temperature 0.0 for deterministic, reproducible output',
        'Temperature is irrelevant for code generation tasks',
      ],
      correctIndex: 2,
    },
    {
      question: 'What does "Top-P (Nucleus Sampling)" control, and what is the recommended practice when using it?',
      options: [
        'It controls response length; always use it alongside temperature for best results',
        'It controls the diversity of token selection by limiting to the top P% of probable tokens; tune either temperature OR Top-P, not both',
        'It controls the number of paragraphs in the response; use it for all creative tasks',
        'It controls the model\'s memory of previous conversations; always set it to 1.0',
      ],
      correctIndex: 1,
    },
    {
      question: 'In the ReAct paradigm, what is the correct sequence of steps in each loop iteration?',
      options: [
        'Action → Observation → Thought',
        'Thought → Action → Observation',
        'Observation → Thought → Action',
        'Thought → Observation → Action',
      ],
      correctIndex: 1,
    },
    {
      question: 'When should you escalate from zero-shot to few-shot prompting?',
      options: [
        'Always start with few-shot because it\'s strictly better',
        'Only when the task involves mathematical calculations',
        'When zero-shot output is wrong or inconsistently formatted — add examples incrementally (1, then 3-5) using the minimum needed to balance quality against token cost',
        'Never, because few-shot is deprecated in modern models',
      ],
      correctIndex: 2,
    },
    {
      question: 'What is "Structured Output" prompting and why is it critical for building applications?',
      options: [
        'Asking the model to always respond in English rather than other languages',
        'Instructing the model to return responses in specific parseable formats (JSON, XML, tables) so your code can process the output programmatically',
        'Organizing your prompt into numbered paragraphs for readability',
        'Using bullet points in your prompt to make instructions clearer',
      ],
      correctIndex: 1,
    },
    {
      question: 'According to the course\'s "cost-quality ladder," what is the recommended approach to model selection?',
      options: [
        'Always use the most powerful model to ensure highest quality',
        'Use the cheapest model that gives acceptable results, and only upgrade when quality is insufficient',
        'Alternate between cheap and expensive models for each prompt',
        'Use open-source models exclusively to avoid vendor lock-in',
      ],
      correctIndex: 1,
    },
  ],

  'ai-automation': [
    {
      question: 'What is the five-stage architecture pattern that every automation pipeline follows?',
      options: [
        'Plan → Build → Test → Deploy → Monitor',
        'Trigger → Fetch → Transform → Act → Report',
        'Input → Process → Output → Log → Archive',
        'Connect → Authenticate → Query → Format → Send',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the key difference between polling an API and using a webhook?',
      options: [
        'Polling is real-time; webhooks have delays',
        'Webhooks require you to repeatedly ask "is there new data?" on a schedule',
        'Polling repeatedly checks for new data on a schedule, wasting requests when nothing changed; webhooks push data to you immediately when an event occurs',
        'There is no meaningful difference — they both achieve the same result',
      ],
      correctIndex: 2,
    },
    {
      question: 'Why is idempotency critical in automation pipelines?',
      options: [
        'It makes the pipeline execute faster by parallelizing steps',
        'It ensures running the same step twice with identical input produces the same result, so you can safely retry failed steps without creating duplicates',
        'It encrypts data between pipeline stages for security',
        'It automatically scales the pipeline based on traffic',
      ],
      correctIndex: 1,
    },
    {
      question: 'When an API returns HTTP status code 429, what should your automation do?',
      options: [
        'Immediately retry the request as fast as possible',
        'Log an error and skip the entire pipeline',
        'Implement exponential backoff — wait progressively longer (1s, 2s, 4s) before retrying',
        'Switch to a different API provider',
      ],
      correctIndex: 2,
    },
    {
      question: 'What is a "Dead Letter Queue" in the context of resilient pipeline design?',
      options: [
        'A queue of deprecated API endpoints that should no longer be called',
        'A separate storage area for items that failed after all retries, preserved for manual review or later retry instead of being lost',
        'An email notification system for pipeline errors',
        'A log file that records all successful pipeline executions',
      ],
      correctIndex: 1,
    },
    {
      question: 'In REST API authentication, what is the difference between an API Key and a Bearer Token?',
      options: [
        'They are identical — both are strings sent in headers',
        'API Keys are static, long-lived tokens; Bearer Tokens are typically short-lived, often obtained through OAuth flows, and sent in the Authorization header',
        'API Keys are more secure than Bearer Tokens',
        'Bearer Tokens are only used for GET requests; API Keys work for all methods',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is a "Circuit Breaker" pattern in pipeline architecture?',
      options: [
        'A hardware device that protects servers from power surges',
        'A design pattern that stops calling a consistently failing API and alerts the team, instead of burning through rate limits with futile retries',
        'An encryption mechanism that breaks connections after a timeout',
        'A load balancer that distributes requests across multiple servers',
      ],
      correctIndex: 1,
    },
  ],

  'mcp-development': [
    {
      question: 'Who controls when each of the three MCP primitives is invoked?',
      options: [
        'Tools = user, Resources = model, Prompts = app',
        'Tools = model, Resources = app/host, Prompts = user',
        'All three are controlled by the AI model based on conversation context',
        'All three are controlled by the user via explicit commands',
      ],
      correctIndex: 1,
    },
    {
      question: 'Why must you never write console.log output to stdout in an MCP server using stdio transport?',
      options: [
        'stdout is reserved for error messages only by convention',
        'stdout is the exclusive JSON-RPC communication channel — any non-JSON output corrupts the protocol and crashes the connection',
        'console.log is too slow and causes performance bottlenecks',
        'The MCP specification prohibits all forms of logging',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the key advantage of the Streamable HTTP transport over SSE transport?',
      options: [
        'It only works with WebSocket connections, which are faster',
        'It requires two separate endpoints (/sse and /messages) for full-duplex communication',
        'It is stateless by default, works with serverless platforms (Vercel, Lambda, Cloudflare Workers), uses a single endpoint, and can upgrade to streaming only when needed',
        'It replaces JSON-RPC with a proprietary binary format for efficiency',
      ],
      correctIndex: 2,
    },
    {
      question: 'When should you use an MCP Resource instead of a Tool?',
      options: [
        'When you need the AI to perform actions that modify data',
        'When you want to provide read-only context (config files, documentation, schemas) that the host application decides when to load, not the AI',
        'When you want the user to select the capability from a menu',
        'Resources and Tools are interchangeable — use whichever you prefer',
      ],
      correctIndex: 1,
    },
    {
      question: 'What does the "destructive: true" annotation on an MCP tool indicate?',
      options: [
        'The tool will crash the server if used incorrectly',
        'The tool permanently deletes the MCP server after execution',
        'The tool modifies state (creates, updates, or deletes data), signaling to the host that it should request user confirmation before executing',
        'The tool is deprecated and will be removed in the next version',
      ],
      correctIndex: 2,
    },
    {
      question: 'In MCP, what is the message format standard used for all communication between client and server?',
      options: [
        'GraphQL with subscriptions',
        'Protocol Buffers (protobuf)',
        'JSON-RPC 2.0',
        'REST with OpenAPI schemas',
      ],
      correctIndex: 2,
    },
    {
      question: 'What is the difference between a static resource and a dynamic resource in MCP?',
      options: [
        'Static resources are faster; dynamic resources are slower',
        'Static resources are registered at startup with a fixed list; dynamic resources are generated on demand using URI templates (e.g., db://mydb/table/{tableName})',
        'Static resources use JSON; dynamic resources use XML',
        'There is no difference — all resources are dynamic by default',
      ],
      correctIndex: 1,
    },
  ],

  'agentic-web': [
    {
      question: 'What is an "Agent Card" in the A2A protocol and where is it hosted?',
      options: [
        'A credit card used by agents to make purchases online',
        'A JSON manifest hosted at /.well-known/agent.json that describes an agent\'s capabilities, authentication requirements, and supported interaction patterns',
        'A visual UI component that displays an agent\'s avatar and status',
        'An encrypted certificate stored in the agent\'s local memory',
      ],
      correctIndex: 1,
    },
    {
      question: 'How do MCP and A2A relate to each other in the Agentic Web?',
      options: [
        'They are competing standards — projects must choose one or the other',
        'MCP replaced A2A as the newer, more modern protocol',
        'MCP connects agents to tools and data (agent ↔ tool), while A2A connects agents to other agents (agent ↔ agent) — they are complementary',
        'A2A is a subset of MCP that handles only authentication',
      ],
      correctIndex: 2,
    },
    {
      question: 'In the ReAct loop, what makes the "Observation" step critical for agent reliability?',
      options: [
        'It saves the agent\'s reasoning to a log file for debugging',
        'It allows the agent to observe the actual result of its action before deciding the next step, grounding its reasoning in real feedback rather than assumptions',
        'It pauses the agent to request human approval before continuing',
        'It compresses the conversation history to save memory',
      ],
      correctIndex: 1,
    },
    {
      question: 'What problem does "Capability-Based Security" solve in the Agentic Web?',
      options: [
        'It prevents agents from connecting to the internet',
        'It ensures agents declare their required permissions upfront (e.g., "read calendar" only, not "full account access"), limiting their scope of action',
        'It encrypts all agent-to-agent communication',
        'It verifies that agents are running on approved hardware',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the fundamental unit of work in the A2A protocol?',
      options: [
        'A Message containing text and file parts',
        'A Tool call with parameters and return values',
        'A Task with statuses (submitted, working, completed, failed) that a client agent creates for a remote agent',
        'A Resource URI that points to shared data',
      ],
      correctIndex: 2,
    },
    {
      question: 'According to the course, what are the three core components of an AI agent?',
      options: [
        'A database, a web server, and an API gateway',
        'An LLM for reasoning, tools for taking actions, and memory for context persistence',
        'A user interface, a backend server, and a message queue',
        'A training pipeline, an inference engine, and a deployment platform',
      ],
      correctIndex: 1,
    },
    {
      question: 'How does A2A handle long-running tasks that may take minutes or hours to complete?',
      options: [
        'It requires the client to poll the server repeatedly until the task finishes',
        'It supports Server-Sent Events (SSE) for real-time streaming of progress updates from the remote agent',
        'It automatically times out and fails after 30 seconds',
        'It queues tasks and delivers results via email notification',
      ],
      correctIndex: 1,
    },
  ],

  'web3-101': [
    {
      question: 'What is the "Scalability Trilemma" first articulated by Vitalik Buterin?',
      options: [
        'A blockchain can only support three types of tokens: utility, governance, and security',
        'A blockchain can optimize for at most two of: security, decentralization, and scalability — Layer 2s attempt to solve this by handling scalability on a separate layer',
        'Building a blockchain requires choosing between three programming languages: Solidity, Rust, and Move',
        'A blockchain must choose between being public, private, or consortium — it cannot be all three',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the key difference between Optimistic Rollups and ZK Rollups?',
      options: [
        'Optimistic Rollups are decentralized; ZK Rollups require a central server',
        'Optimistic Rollups assume transactions are valid and rely on a 7-day fraud proof challenge period; ZK Rollups prove validity cryptographically upfront with no challenge period needed',
        'ZK Rollups can only process simple token transfers, not smart contract interactions',
        'Optimistic Rollups are newer technology; ZK Rollups are the legacy approach',
      ],
      correctIndex: 1,
    },
    {
      question: 'If a token has a Market Cap of $100M but a Fully Diluted Valuation (FDV) of $1B, what does this indicate?',
      options: [
        'The token is significantly undervalued and will increase 10x',
        'Only 10% of total supply is currently circulating — the remaining 90% will enter the market over time, potentially creating significant selling pressure',
        'The project has $900M in its treasury',
        'The token has a deflationary burn mechanism that will reduce supply',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is the difference between how DAI and USDC maintain their peg to the US dollar?',
      options: [
        'DAI is backed by gold reserves; USDC is backed by cryptocurrency',
        'USDC is backed 1:1 by US dollar reserves held by Circle; DAI maintains its peg algorithmically through overcollateralized crypto loans',
        'Both use identical mechanisms — they are backed by US Treasury bonds',
        'USDC is a governance token; DAI is a utility token',
      ],
      correctIndex: 1,
    },
    {
      question: 'Why are cross-chain bridges considered one of the highest-risk components in Web3?',
      options: [
        'They are slow and charge high transaction fees',
        'They hold massive amounts of locked funds in smart contracts, making them prime targets for hackers — over $2.5B has been stolen from bridge hacks historically',
        'They are not compatible with most wallets',
        'They require KYC verification which exposes user identity',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is "vote buying" in the context of DAO governance, and why is it a problem?',
      options: [
        'DAOs charging users a fee to participate in governance votes',
        'Governance tokens can be temporarily borrowed via DeFi lending to swing a vote, then returned — undermining the democratic intent of token-based governance',
        'Paying validators to include your transaction in the next block',
        'Purchasing NFTs that grant access to exclusive governance forums',
      ],
      correctIndex: 1,
    },
    {
      question: 'What is EIP-1559 and how does it affect Ethereum\'s tokenomics?',
      options: [
        'A protocol that increases the maximum supply of ETH to match demand',
        'A burn mechanism that destroys a portion of gas fees — when burn rate exceeds issuance rate, ETH becomes deflationary ("ultrasound money")',
        'A governance proposal that gives ETH holders voting rights on protocol changes',
        'A Layer 2 scaling solution that reduces transaction costs by 99%',
      ],
      correctIndex: 1,
    },
  ],
};
