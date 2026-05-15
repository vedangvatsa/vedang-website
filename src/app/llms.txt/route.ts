import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Vedang Vatsa — veda.ng
> Personal research hub covering AI, Web3, technology strategy, and institutional analysis.

## About
Vedang Vatsa is a researcher and builder focused on AI infrastructure, Web3 institutional adoption, and technology-driven strategy. This site hosts 52 original essays, 5 interactive courses, 21,000+ indexed AI research papers, and 23,000+ indexed Web3 research papers.

## Primary Pages
- [Home](https://veda.ng/)
- [Writings](https://veda.ng/writings)
- [Profile](https://veda.ng/profile)
- [Media](https://veda.ng/media)

## Research Archives
- [AI Reports Archive — 21,000+ Papers](https://veda.ng/ai-reports)
- [Web3 Reports Archive — 23,000+ Papers](https://veda.ng/web3-reports)

## Featured Analysis
- [State of AI 2026](https://veda.ng/state-of-ai-2026)
- [State of Web3 2026](https://veda.ng/state-of-web3-2026)

## Essays
- [The Agentic Web](https://veda.ng/towards-the-agentic-web)
- [Agents Eating SaaS](https://veda.ng/agents-eating-saas)
- [The AI Economy](https://veda.ng/ai-economy)
- [The AI Agent Economy](https://veda.ng/ai-agent-economy)
- [AGI Governance](https://veda.ng/agi-governance)
- [Agentic Commerce](https://veda.ng/agentic-commerce)
- [The Agentic State](https://veda.ng/agentic-state)
- [AI Implementation Playbook](https://veda.ng/ai-implementation-playbook)
- [Ambient Intelligence](https://veda.ng/ambient-intelligence)
- [API States](https://veda.ng/api-states)
- [Artificial Intuition](https://veda.ng/artificial-intuition)
- [ASI Timeline](https://veda.ng/asi-timeline)
- [The Attention Refinery](https://veda.ng/attention-refinery)
- [Blockchain Journey](https://veda.ng/blockchain-journey)
- [The Bureaucracy Tax](https://veda.ng/bureaucracy-tax)
- [Cheap to Competitive](https://veda.ng/cheap-to-competitive)
- [Cognitive Load](https://veda.ng/cognitive-load)
- [Computational Constitutions](https://veda.ng/computational-constitutions)
- [Computational Social Science](https://veda.ng/computational-social-science)
- [Dark Forest Internet](https://veda.ng/dark-forest-internet)
- [Digital Monasticism](https://veda.ng/digital-monasticism)
- [The God Protocol](https://veda.ng/god-protocol)
- [Hustle Culture](https://veda.ng/hustle-culture)
- [The In-Between State](https://veda.ng/in-between-state)
- [The Infinity Economy](https://veda.ng/infinity-economy)
- [Internet of Lies](https://veda.ng/internet-of-lies)
- [Intuitive Singularity](https://veda.ng/intuitive-singularity)
- [The Mesh Economy](https://veda.ng/mesh-economy)
- [The Plurality Trap](https://veda.ng/plurality-trap)
- [Post-Interface Internet](https://veda.ng/post-interface-internet)
- [Post-Scarcity Technology](https://veda.ng/post-scarcity-technology)
- [Privacy](https://veda.ng/privacy)
- [Programmable Trust](https://veda.ng/programmable-trust)
- [Pseudonymous Agency](https://veda.ng/pseudonymous-agency)
- [Rationality in AI](https://veda.ng/rationality-in-ai)
- [The Revision Gap](https://veda.ng/revision-gap)
- [Sacred Algorithms](https://veda.ng/sacred-algorithms)
- [The Sensory Internet](https://veda.ng/sensory-internet)
- [The Simulation Hypothesis](https://veda.ng/simulation-hypothesis)
- [The Simulation Layer](https://veda.ng/simulation-layer)
- [Singapore's Arc](https://veda.ng/singapores-arc)
- [The Singularity Paradox](https://veda.ng/singularity-paradox)
- [Singularity](https://veda.ng/singularity)
- [Stepwise AI](https://veda.ng/stepwise-ai)
- [The Substrate Shift](https://veda.ng/substrate-shift)
- [Synthetic Empathy](https://veda.ng/synthetic-empathy)
- [The Twilight Economy](https://veda.ng/twilight-economy)
- [Universal Text UI](https://veda.ng/universal-text-ui)
- [YC Landscape](https://veda.ng/yc-landscape)

## Interactive Courses
- [Agentic Web Development](https://veda.ng/agentic-web)
- [AI Automation](https://veda.ng/ai-automation)
- [MCP Development](https://veda.ng/mcp-development)
- [Prompt Engineering 101](https://veda.ng/prompt-engineering-101)
- [Vibe Coding](https://veda.ng/vibe-coding)
- [Web3 101](https://veda.ng/web3-101)

## Other
- [Glossary](https://veda.ng/glossary)
- [Health Protocols](https://veda.ng/health-protocols)
- [AI Discovery Standards](https://veda.ng/ai-discovery-standards)
- [Swarm Prediction](https://veda.ng/swarm-prediction)
- [Community](https://veda.ng/community)
- [Literature](https://veda.ng/lit)
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
