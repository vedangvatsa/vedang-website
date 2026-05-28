# The Agent Infrastructure Stack

<div class="author-info">
**Vedang Ratan Vatsa**<br>
*vedangvats@gmail.com*<br>
</div>

## Abstract

Between 2024 and 2026, the developer toolchain for building AI agents split into eight specialized infrastructure layers, each attracting dedicated venture-backed companies and over $12 billion in combined disclosed funding across infrastructure and agent-product companies. This paper presents a taxonomy of these layers, analyzes how they depend on and compete with each other, and identifies six architectural trends changing how the stack works. The analysis draws on venture funding databases, SEC filings, company disclosures, consulting surveys, and marketplace data for more than 40 companies. Key findings include extreme capital concentration (a Gini coefficient of approximately 0.78 across company funding, higher than US household income inequality), rapid consolidation in security (three of four startups acquired within eighteen months, with time-to-acquisition shrinking from four years to two), and the emergence of platform bundlers like Vercel and Cloudflare that are absorbing standalone tools into unified provisioning surfaces. Enterprise surveys show a "high intent, low maturity" gap, with 60% of organizations planning agent deployment within two years but only 17% having done so (Gartner, 2026). This gap creates the demand that infrastructure companies fill. The paper argues that the eight-layer structure is transitional. Some layers, particularly security and observability, are already collapsing into adjacent platforms, while others, particularly compute and perception, may remain independent because their technical requirements resist bundling.

_**Keywords**_: AI agents, agent infrastructure, developer tools, compute inference, agent security, evaluation, orchestration, platform bundling, market consolidation

---

## 1. Introduction

Two years ago, building an AI agent meant stitching together fifteen or more separate services by hand. A developer needed a model API, a headless browser, a web scraper, a workflow engine, a vector database, an evaluation harness, a secrets manager, and a sandbox for code execution. Each service required a separate account, billing page, and integration effort. The developer toolchain assumed a human programmer writing deterministic code. Agents broke that assumption.

Agents do not follow predetermined paths. They make decisions at runtime, call external tools, execute code they wrote themselves, and maintain state across long-running sessions. The existing developer toolchain had no answer for durable execution of non-deterministic workflows, sandboxed execution of untrusted code, or identity management for autonomous software that acts on behalf of humans. A new infrastructure layer had to be built.

The scale of this gap is measurable. McKinsey's 2025 State of AI survey found that 23% of organizations had scaled at least one agentic AI system, usually in only one or two business functions [45]. Gartner's 2026 Hype Cycle for Agentic AI put the number at 17% deployed, with 60% or more expecting deployment within two years [46]. Deloitte's 2026 enterprise AI report found that only one in five companies has a mature governance model for autonomous agents [47]. This combination of high intent, low maturity, and minimal governance creates the demand that infrastructure companies fill.

By mid-2026, a developer can provision every one of these capabilities from a single marketplace page. Vercel added a dedicated "Agents" category in 2025. Cloudflare hosts 78 AI models at the edge with built-in function calling. The transition from manual integration to one-click provisioning took roughly two years and consumed over $5 billion in venture capital across more than 40 companies.

This paper makes three contributions. First, it proposes an eight-layer taxonomy of agent infrastructure based on the functional requirements of autonomous AI systems. Second, it maps the dependencies and competition between these layers, identifying which are becoming commodities and which hold defensible positions. Third, it identifies six architectural trends that are changing how developers build around agent-first patterns, from edge inference to agent-native identity to sandboxed execution as a standard building block.

**Data and methodology.** The analysis covers 40+ companies that raised venture funding or were acquired for agent infrastructure functions between January 2024 and May 2026. Company-level funding, valuation, and ARR data come from venture funding databases (Crunchbase, PitchBook), SEC filings (Cerebras S-1), company blog posts, and media reports. Enterprise adoption data come from three consulting surveys (McKinsey 2025, Gartner 2026, Deloitte 2026). Marketplace and product data come from Vercel, Cloudflare, and company documentation. The dataset is limited to disclosed funding only and skews toward US-headquartered companies (approximately 82% of captured capital). Chinese agent infrastructure companies are largely absent due to data source limitations. All funding figures use the most recent available totals as of May 2026.

## 2. Related Work

The infrastructure requirements of AI agents have received growing academic attention alongside the commercial activity documented in this paper. This section briefly surveys the most relevant academic literature to ground the taxonomy and analysis that follow.

On multi-agent orchestration, a recent survey formalizes the Model Context Protocol (MCP) for tool access and the Agent2Agent (A2A) protocol for peer coordination across agent systems [48]. A large-scale empirical study analyzing 42,000+ commits across LangChain, CrewAI, AutoGen, and similar frameworks found that orchestration complexity is a primary source of bugs and developer friction [49]. These findings align with the commercial investment in durable execution (Temporal, Inngest) documented in Section 3.

The memory layer has attracted particular academic interest. A comprehensive survey organizes foundation agent memory by substrate, covering in-context memory, external memory stores, and parametric memory encoded in model weights [50]. Research on graph-based memory architectures surveys how structured knowledge graphs can serve as agent memory backends [51]. Work on continuum memory architectures defines the requirements for persistent, temporally chained memory in long-horizon agent tasks [52]. Another survey compares LLM memory mechanisms against human memory paradigms across implicit, explicit, and agentic dimensions [53]. Collectively, these papers identify four memory paradigms for agents (episodic, semantic, working, and procedural), none of which current commercial infrastructure fully addresses. This academic gap mirrors the commercial funding pause documented in Section 4.5.

On software engineering agents, a review of LLM-based agentic systems across the development lifecycle catalogs how agents are being applied to coding, testing, debugging, and deployment [54]. This maps directly to the "Agents as Products" layer, where companies like Cognition, Factory, and CodeRabbit operate.

The academic literature confirms two observations relevant to this paper. First, the functional decomposition proposed in commercial taxonomies (perception, orchestration, memory, evaluation, security) maps closely to the architectural decomposition that academic researchers use when studying agent systems. Second, the hardest unsolved problems in the academic literature (memory, evaluation, and safety) correspond to the commercial layers with the most uncertain funding trajectories.

## 3. The Eight-Layer Taxonomy

Table 1 summarizes the eight functional layers of the agent infrastructure stack.

**Table 1. The Eight-Layer Agent Infrastructure Taxonomy**

| Layer | Function | Funding | Key Companies |
|-------|----------|---------|---------------|
| Perception | Web data extraction | ~$339M | Browserbase, Firecrawl, Parallel, Apify |
| Orchestration | Durable execution, tool integration | ~$709M | Temporal, Inngest, Composio |
| Eval & Observability | Accuracy measurement, logging | ~$256M+ | Braintrust, Arize AI, Langfuse, Helicone |
| Compute & Inference | GPU infrastructure, model hosting | ~$4.4B+ | Cerebras, Together AI, Modal, Fireworks AI, Groq, fal.ai |
| Memory & Retrieval | Persistent context, vector search | ~$347M | Mem0, Upstash, Pinecone, Qdrant, Weaviate, Chroma |
| Sandboxed Execution | Isolated code execution | ~$32M | E2B |
| Security | Prompt defense, agent identity | ~$312M+ | Lakera, Robust Intelligence, Galileo AI, Patronus AI, Corridor, Arcjet, Descope |
| Agents as Products | Vertical autonomous agents | ~$5.9B+ | Cognition, Sierra, Harvey, Decagon, Factory, CodeRabbit |

This taxonomy overlaps with other industry mappings. MightyBot's 2026 market map uses seven categories (coding agents, browser agents, workflow automation, vertical AI agents, agent infrastructure, customer/employee agents, and regulated workflow agents) that cut across functional boundaries differently [55]. The taxonomy in this paper groups by infrastructure function rather than by use case, which better shows the competition and dependency relationships between layers. Alternative taxonomies are equally valid for different analytical purposes.

**Perception** converts the visual, interactive web into structured data that language models can process. Browserbase ($67.5M raised) provides interactive browser sessions, serving over 50 million sessions in 2025 [1]. Firecrawl ($16.2M) extracts web content without running a full browser and serves over one million developers [2]. Parallel, founded by former Twitter CEO Parag Agrawal, raised $230M at a $2B valuation for structured web data extraction [3]. Apify, the oldest player, generates $13.3M ARR on only $3M in external funding by running 30,000+ pre-built web scrapers [42].

**Orchestration** turns language model outputs into durable, retryable action sequences that survive failures and restarts. Temporal ($650M raised, $5B valuation) runs the most widely adopted durable execution platform; OpenAI uses Temporal to run Codex [5]. Inngest ($30M from a16z) provides serverless-first orchestration with its AgentKit product for multi-agent coordination [6]. Composio ($29M) gives agents access to 100,000+ external tools through a single integration layer, adopted by over 100,000 developers [7].

**Evaluation and Observability** measures whether agents produce correct outputs before those outputs reach production. Braintrust ($120M+, $800M valuation) provides evaluation, logging, and prompt management for Stripe, Notion, and Airtable [8]. Arize AI ($131M) covers both traditional ML monitoring and LLM-specific evaluation for Booking.com, Uber, and Duolingo [10]. Langfuse reached 19 of the Fortune 50 on $4.5M before ClickHouse acquired it in January 2026 [9]. Helicone was acquired by Mintlify in March 2026 [56].

**Compute and Inference** provides the GPU infrastructure behind every agent call. This layer contains the largest value pool in the stack. Cerebras IPO'd on NASDAQ in May 2026 at approximately $95B market capitalization [11]. Together AI raised $1.5B at $8.5B valuation and reports approximately $1B ARR [12]. Modal ($442M raised, $4.65B valuation, ~$300M ARR) grew revenue 5x in eight months [13]. Fireworks AI ($327M+) processes 15 trillion tokens per day [14]. Groq ($1.75B raised) designed custom LPU chips, with the architecture reportedly licensed by Nvidia in a deal valued at approximately $20B per media estimates [15]. fal.ai ($400M+, $4.5B valuation) provides serverless media generation for Adobe, Canva, and Shopify [16].

**Memory and Retrieval** provides persistent context so agents remember what they have done and what users prefer. Mem0 ($24M) became the exclusive memory provider in the AWS Agent SDK [22, 44]. Pinecone ($138M) serves 9,000+ customers across 800,000 developers [18]. Qdrant ($87.8M) is the only vector database to raise a new round after 2023 [19].

**Sandboxed Execution** gives agents a safe place to run code they write themselves. E2B ($32M) provides ephemeral micro-VMs for AI-generated code execution, integrated by Hugging Face, Perplexity, and Groq [24]. The company reports 88% Fortune 100 adoption.

**Security** protects agents from prompt injection, validates model outputs, and manages agent identity. This layer experienced the fastest consolidation in the stack. Of the earliest security-focused startups, three out of four (Robust Intelligence [29], Lakera [28], and Galileo AI [30]) were acquired within eighteen months, leaving Patronus AI ($40M) [31] as the sole independent survivor from that cohort (detailed in Section 6). Newer entrants include Corridor ($30.4M) [32], Arcjet ($12.1M) [33], and Descope ($88M) [34].

**Agents as Products** sits at the top of the stack, representing companies that ship agents as finished products to end users. Cognition ($2.5B+ raised, $26B valuation, $492M ARR) builds Devin for software engineering [35]. Sierra ($1.475B, $15B valuation) targets customer experience [36]. Harvey ($1.22B+, $11B valuation) serves legal [37]. Decagon ($481M, $4.5B valuation) handles customer support [38]. Factory ($200M, $1.5B valuation) focuses on software development [39]. CodeRabbit ($88M, $550M valuation) automates code review [40]. These six companies represent over $58B in combined valuation.

A market risk worth noting is what MightyBot calls "agent washing," the practice of vendors renaming chatbots, copilots, or RPA bots as "AI agents" without adding meaningful autonomy, tool use, memory, or governance [55]. This creates buyer confusion and inflates apparent market size. The production readiness criteria that separate genuine agent systems from relabeled chatbots include defined workflow boundaries, tool access with controls, memory and state management, evaluation and observability, human checkpoints, audit trails, and cost discipline [55].

## 4. Market Map Analysis

### 4.1 The Dependency Graph

The eight layers do not exist in isolation. They form a dependency chain that determines which layers hold lasting power and which are vulnerable to becoming commodities.

Compute sits at the bottom of the stack. Every other layer depends on it. An orchestration engine calls a model. An evaluation harness runs inference to score outputs. A perception tool uses a model to interpret web content. Even security tools run inference to detect prompt injection. Compute depends on nothing except hardware supply, which is why it attracts the most capital and produces the largest outcomes.

Perception feeds into orchestration. An agent that browses the web needs perception (Browserbase, Firecrawl) to extract data, then orchestration (Temporal, Inngest) to sequence actions on that data. Memory stores the results for future sessions. Evaluation sits across all layers, measuring output quality regardless of whether the output came from a coding agent, a customer support agent, or a web scraping pipeline.

Security also cuts across layers rather than sitting in a single position. Prompt injection defense applies at the perception layer (malicious web content), the orchestration layer (tool-use exploits), and the agent-product layer (user-facing attacks). This cross-cutting nature helps explain why security companies get acquired by platform incumbents rather than growing independently. A standalone security tool has a narrow surface area. An incumbent like Cisco can integrate security across its entire product line.

Sandboxed execution has a unique position. It serves a narrow function (running untrusted code safely) but is required by almost every AI coding agent. E2B's dominance of this layer with 88% Fortune 100 adoption suggests the function may be too narrow to support multiple competitors but too critical to skip.

### 4.2 What the Numbers Reveal

The funding data for 40+ companies in this analysis allows for quantitative analysis beyond individual deal reporting. Several metrics reveal how the market actually works.

**Capital concentration is extreme.** The Gini coefficient across company-level funding is approximately 0.78. The Gini coefficient measures inequality on a scale from 0 (perfectly equal) to 1 (one entity gets everything). At 0.78, the agent infrastructure market is more unequal than US household income distribution (Gini ~0.49) and comparable to global wealth distribution. In practical terms, this means a small number of companies absorb the vast majority of capital and the typical agent infrastructure startup operates on far less funding than the headline numbers suggest.

**The mean-median gap confirms this.** The mean funding per company across the dataset exceeds $250M, driven by massive rounds at Cognition ($2.5B+) [35], Together AI ($1.5B) [12], and Groq ($1.75B) [15]. The median sits far lower, closer to $40-50M. The gap between mean and median tells a simple story. The "average" agent infrastructure company does not exist. There are a few very large companies and many smaller ones, with little in between.

**Revenue multiples vary dramatically by layer.** Where ARR data is available, the valuation-to-revenue ratios reveal investor expectations about growth potential per layer.

**Table 2. Revenue Multiples by Layer (Where ARR Data Available)**

| Company | Layer | ARR | Valuation | Revenue Multiple |
|---------|-------|-----|-----------|-----------------|
| Cognition | Agents as Products | $492M | $26B | ~53x |
| Together AI | Compute | ~$1B | $8.5B | ~8.5x |
| Modal | Compute | ~$300M | $4.65B | ~15.5x |
| Apify | Perception | $13.3M | N/A (bootstrapped) | N/A |
| Chatbase | Agents as Products | $10M | N/A (bootstrapped) | N/A |

Cognition's 53x revenue multiple is the standout. Investors are pricing agent-as-product companies as if they will capture a large share of the software engineering labor market, not just grow recurring software revenue. Compute companies trade at 8-16x, reflecting a more infrastructure-like pricing model with lower expected margins but higher predictability. The contrast says that investors see agent products as having platform-scale upside while treating compute as a (very large) utility business.

**Capital efficiency splits cleanly by layer.** Apify generates $13.3M ARR on $3M in external funding, a return of $4.43 per dollar raised [42]. Chatbase generates $10M ARR on zero external funding [43]. At the other end, Cognition generates $492M ARR on $2.5B+ raised, or roughly $0.20 per dollar raised so far [35]. The capital-efficient companies cluster in layers (perception, developer tools) that serve individual developers with credit-card pricing. The capital-intensive companies operate in layers (compute, agent products) that require enterprise sales teams, GPU procurement, or both. This is not a value judgment on either model. Cognition's $492M ARR may ultimately justify its $2.5B in capital many times over. But the data shows clearly that some layers can produce profitable businesses on minimal funding while others cannot.

### 4.3 Commoditization Versus Differentiation

Not all layers carry equal competitive moats. The analysis identifies a clear split between layers where companies can build durable advantages and layers where the product is converging toward commodity status.

**Layers becoming commodities.** Vector databases are the clearest example. Pinecone, Weaviate, and Chroma have not announced new funding rounds since 2023. Qdrant is the sole exception. PostgreSQL with pgvector and Redis with vector modules now offer "good enough" vector search as a feature of general-purpose databases, weakening the case for standalone vector database companies. Observability follows a similar pattern. Langfuse and Helicone were both acquired, suggesting that LLM observability is becoming a feature of database and developer documentation platforms rather than an independent category.

**Layers with defensible positions.** Compute remains hard to turn into a commodity because it requires custom hardware (Cerebras wafer-scale chips, Groq LPU architecture) or massive GPU procurement (Together AI, Modal). Perception is similarly defensible because browser infrastructure and web scraping at scale require deep technical investment. Orchestration sits in the middle. Temporal's durable execution model has strong adoption (OpenAI, Netflix, Stripe), but foundation model providers are adding native orchestration features that could weaken standalone orchestration tools over time.

### 4.4 The Thin Wrapper Problem

The most vulnerable companies in the stack are those offering a thin layer of software over a foundation model API with no proprietary data, workflow, or infrastructure advantage. Industry analysts estimate that 80 to 90% of early-stage AI agent startups face closure or consolidation during the current shakeout.

The primary failure mode is straightforward. OpenAI, Anthropic, and Google are shipping native features (function calling, tool use, code execution, built-in web browsing) that eliminate the value proposition of companies whose sole product is wrapping these capabilities in a slightly different interface. Every time a model provider adds a new built-in capability, a category of wrapper startups loses its reason to exist. Major platform moves in May 2026 alone included Microsoft Agent 365 reaching general availability, ServiceNow expanding its Autonomous Workforce across IT, HR, finance, and legal, and Google launching Antigravity 2.0 with a multi-agent framework and CLI [55].

The companies that survive own a piece of the workflow that the model provider cannot replicate. Browserbase owns the browser session. E2B owns the sandbox. Temporal owns the execution state. Braintrust owns the evaluation data. Mem0 owns the memory layer. None of these can be replaced by adding a feature to a foundation model.

### 4.5 Cross-Layer Companies

Several companies span multiple layers, positioning themselves at the intersection of two or more functional categories.

Composio spans orchestration and tools, providing both the integration layer (100,000+ tools) and the workflow logic to sequence tool calls. Descope spans security and authentication, offering both traditional auth infrastructure and an Agentic Identity Hub with OAuth 2.1 for AI agents, used by Databricks, MongoDB, and GoodRx [34]. Braintrust spans evaluation and observability, combining accuracy measurement with logging, tracing, and prompt management.

These cross-layer companies test the taxonomy's boundaries. They also tend to be better positioned competitively because they create switching costs across multiple categories simultaneously. A customer using Braintrust for both evaluation and observability faces higher friction when considering alternatives than a customer using separate tools for each function.

### 4.6 Funding Concentration

The distribution of capital across the stack is extremely uneven, both across layers and within them.

**Table 3. Capital Concentration in Agentic AI Funding (Early 2026)**

| Metric | Value |
|--------|-------|
| Top 3 deals' share of total capital | 44% |
| Top 10 deals' share of total capital | 78% |
| Bottom 50% of deals' share of total capital | 11.5% |
| Median AI seed round (2026) | $4.6M |
| Total agentic AI funding, 2024 | $1.5B |
| Total agentic AI funding, 2025 | $2.9B |
| Total agentic AI funding, annualized 2026 | ~$2.6B |

Compute and inference alone account for over $4.4B of the roughly $12B total across all layers. Agents as products account for $5.9B+. Together, these two layers take over 85% of total capital, leaving the remaining six layers to split roughly $2B. Section 8 breaks down the investor thesis behind this concentration in detail.

## 5. Architectural Trends in Developer AI Systems

Six architectural trends are changing how developers build and deploy agents. Each represents a shift from pre-agent patterns to agent-first infrastructure design.

### 5.1 From APIs to Protocols

The connections between infrastructure layers are settling into formal protocols and standards. Three are worth examining.

Anthropic's Model Context Protocol (MCP) defines a standard way for agents to connect to external tools, data sources, and services. Before MCP, every tool integration required custom code. MCP provides a common interface that any tool provider can implement and any agent framework can consume. The protocol turns tool integration from an N-by-M problem (N agents times M tools) into an N-plus-M problem (each side implements once). Academic work formalizing MCP and the related Agent2Agent (A2A) protocol for peer coordination confirms that these standards are receiving attention beyond their commercial implementations [48].

OpenAI's function calling specification defines a structured format for models to request tool execution. Rather than generating freeform text that a parser must interpret, the model outputs a structured JSON object specifying which function to call and with what arguments. This format has become a de facto standard that other model providers (including those hosted on Cloudflare Workers AI) support through OpenAI-compatible endpoints.

Stripe's Agentic Commerce Protocol addresses a different interface, the boundary between agents and payment systems. When an agent completes a purchase on behalf of a user, the transaction needs structured authorization, fraud checks, and audit trails that traditional checkout flows were not designed to handle.

These three protocols share a pattern. Standards are forming at the interfaces between layers, not within layers. The internal implementation of a compute provider or an orchestration engine remains proprietary. But the connection points between them are converging on shared specifications. This is the same pattern that HTTP, REST, and SQL followed in earlier infrastructure cycles, and it suggests the stack is maturing beyond its earliest experimental phase.

### 5.2 Edge Inference

Inference is moving from centralized GPU clusters to distributed edge locations, and the effects on agent workloads are large.

Cloudflare Workers AI now runs 78 models at 300+ edge locations globally, with OpenAI-compatible endpoints, function calling, LoRA fine-tuning, vision inputs, and batch processing built in [17]. The models come from Meta, Google, OpenAI, Qwen, Mistral, and NVIDIA. A CDN company running inference at the edge is a major shift in how compute reaches applications.

Fireworks AI processes 15 trillion tokens per day, operating at a scale that requires distributed infrastructure by necessity [14]. The company serves Samsung, Uber, and Cursor.

For agent workloads, edge inference matters because agents often need to respond within latency budgets that centralized GPU clusters cannot meet. A customer support agent handling a live conversation cannot tolerate 500ms round trips to a distant data center. A coding agent providing inline suggestions needs sub-100ms responses. Edge inference brings the compute closer to the application, reducing latency for the many small, fast inference calls that characterize agent workloads (as opposed to the large batch jobs that characterize training workloads).

This trend also changes how compute companies compete with each other. If inference becomes available at every CDN edge node, the advantage for standalone compute providers shifts from "having GPUs" to "having faster, cheaper, or more specialized GPUs." Cloudflare cannot match the raw throughput of Cerebras or Together AI, but it can offer adequate inference at lower latency for a large class of agent tasks.

### 5.3 Serverless-First Infrastructure

The agent workload has a distinctive shape. It is bursty (an agent may sit idle for hours, then fire 50 tool calls in 30 seconds), stateless between calls (each inference request is independent), and needs fast cold starts (a user waiting for an agent response will not tolerate a 10-second container spin-up).

This workload maps naturally to serverless and ephemeral infrastructure patterns, and multiple companies in the stack have built around this insight.

Modal ($442M raised, $300M ARR) provides serverless GPU access, letting developers run inference jobs without provisioning or managing machines [13]. fal.ai ($400M+) takes the same approach for media generation [16]. Inngest ($30M) provides serverless-first orchestration with zero infrastructure to manage [6]. E2B ($32M) runs each code sandbox as an ephemeral micro-VM that spins up on demand and disappears when done [24]. Upstash ($11.9M) provides serverless Redis, Kafka, and vector storage designed for the bursty access patterns of agent workloads [23].

The contrast with training workloads is instructive. Training requires sustained, predictable GPU access for hours or days. Inference requires fast, sporadic access for milliseconds at a time. The infrastructure patterns that serve training (reserved GPU clusters, long-running containers) are poorly suited to inference, and the serverless model is a direct response to this mismatch.

### 5.4 Agent-Native Identity and Auth

Agents acting autonomously on behalf of users create an identity problem that traditional authentication systems were not designed to solve. When a human logs into a service, the auth flow assumes a person sitting at a browser. When an agent logs into that same service, there is no person, no browser, and potentially no human in the loop at all.

Descope ($88M raised) built an Agentic Identity Hub that provides OAuth 2.1 for AI agents, allowing agents to authenticate to third-party services with scoped permissions, audit trails, and revocable access [34]. Databricks, MongoDB, and GoodRx use this system. The product represents a new building block that separates agent identity from human auth.

The need for agent-specific identity is growing as agents perform more consequential actions. An agent that books flights, signs contracts, or moves money needs verifiable identity credentials that the receiving service can validate, scope, and revoke. Traditional API keys are insufficient because they lack the granular permission scoping and audit capabilities that autonomous agents require. The OAuth 2.1 standard provides a framework, but the tooling to make it work for non-human actors is still early.

Deloitte's 2026 enterprise AI report found that only one in five companies has a mature governance model for autonomous agents [47]. Agent identity is a prerequisite for governance. Without verifiable, scoped, revocable credentials for agents, governance models remain theoretical.

### 5.5 The Memory Problem

Memory is the least solved layer in the agent infrastructure stack, and both the funding data and the academic literature support this assessment.

Mem0 ($24M) became the exclusive memory provider in the AWS Agent SDK, giving it a privileged distribution position [22, 44]. But the broader memory and retrieval category shows signs of stalling. Pinecone ($138M), Weaviate ($67.7M), and Chroma ($18M) have not announced new funding rounds since 2023 [18, 20, 21]. Qdrant ($87.8M) is the only vector database to raise post-2023 [19].

The funding pause reflects a deeper problem. The field has not yet found the right abstraction for agent memory. Vector databases solve one specific sub-problem (similarity search over embeddings), but agent memory involves at least three distinct functions. Academic surveys identify these as episodic memory (what happened in past sessions), semantic memory (what facts the agent knows), and procedural memory (what workflows the agent has learned) [50, 53]. No single commercial product addresses all three well. Research on continuum memory architectures defines the requirements for persistent, temporally chained memory in long-horizon agent tasks [52], and work on graph-based memory architectures explores how structured knowledge graphs could serve as alternative memory backends [51]. The gap between what academic research describes as needed and what commercial products actually offer is wider in the memory layer than in any other part of the stack.

General-purpose databases are also moving into this space. PostgreSQL with pgvector and Redis with vector modules offer "good enough" vector search as a built-in feature, reducing the case for a standalone vector database. Upstash ($11.9M, backed by a16z) approaches memory from the serverless data store angle rather than the vector-specific angle, integrating Redis, Kafka, and vector search into a single serverless product [23].

### 5.6 Sandboxed Execution as a Standard Building Block

E2B ($32M) turned code execution into an API call [24]. A developer sends code to E2B's API, and E2B runs it in an isolated micro-VM with its own filesystem, network, and process tree, then returns the output. The sandbox spins up in milliseconds and disappears when done.

This matters because every AI coding agent needs it. Cognition's Devin, Cursor, and every other tool that generates and runs code requires a safe execution environment. Running untrusted, LLM-generated code on production servers creates obvious security risks. Academic research on LLM-based agentic systems for software engineering confirms that sandboxed execution is a core requirement, not an optional feature [54]. E2B's 88% Fortune 100 adoption rate suggests that sandboxed execution is becoming a standard utility rather than a competitive advantage.

The layer is notable for being dominated by a single company. The narrow functional scope (isolated code execution) may explain why the layer has not attracted competitive density. But the narrowness is also a vulnerability. If cloud providers (AWS, Google Cloud, Azure) add sandboxed code execution as a built-in feature of their agent platforms, E2B's standalone position could erode quickly. For now, the cloud providers have not moved aggressively into this space, leaving E2B as the de facto standard.

## 6. Consolidation Dynamics

### 6.1 The Acquirer Profile

Eight acquisitions occurred in the agent infrastructure space between October 2024 and May 2026. The acquirers share a consistent profile. They are large infrastructure incumbents that missed the initial agent wave and bought their way in.

**Table 4. Agent Infrastructure Acquisitions (Oct 2024 - May 2026)**

| Acquirer | Target | Date | Estimated Value | Layer |
|----------|--------|------|----------------|-------|
| Cisco | Robust Intelligence | Oct 2024 | Undisclosed | Security |
| Check Point | Lakera | Sep 2025 | ~$300M | Security |
| Cisco | Galileo AI | Apr 2026 | Undisclosed | Security |
| ClickHouse | Langfuse | Jan 2026 | Undisclosed | Evaluation & Observability |
| Mintlify | Helicone | Mar 2026 | Undisclosed | Evaluation & Observability |
| IBM | Confluent | N/A | $11B | Data Infrastructure (adjacent) |
| IBM | HashiCorp | N/A | $6.4B | Infra Provisioning (adjacent) |
| Meta | Manus | N/A | ~$2B | Agent Platform |

Cisco alone bought two agent security companies within eighteen months [25, 26]. IBM bought two adjacent infrastructure companies (Confluent for data streaming, HashiCorp for infrastructure provisioning) at a combined $17.4B. These IBM deals are not agent-specific but signal how incumbents are assembling the broader platform capabilities that agent infrastructure runs on. Meta paid approximately $2B for Manus, an autonomous agent platform. None of these acquirers built their agent capabilities in-house. All of them bought.

**Time-to-acquisition is shrinking.** Robust Intelligence was founded around 2020 and acquired in October 2024, roughly four years to exit. Lakera was founded in 2023 and acquired in September 2025, roughly two years to exit [27, 28]. The window between founding and acquisition has compressed from four years to two. This acceleration suggests that incumbents are buying earlier in a startup's lifecycle, possibly because the pace of model provider feature releases makes waiting risky. A security startup that waits three more years for growth may find that OpenAI or Anthropic has shipped a competing feature for free.

### 6.2 What Gets Acquired Versus What Stays Independent

A pattern emerges in which layers produce acquirable companies and which layers produce independent ones.

**Acquirable layers include security and observability.** Security companies (Robust Intelligence [29], Lakera [28], Galileo AI [30]) and observability companies (Langfuse, Helicone) share several traits that make them attractive acquisition targets. Their products do a specific, well-defined job. They fit easily into an acquirer's existing platform. Their sales motion targets the same enterprise buyers the acquirer already serves. And their standalone revenue potential, while real, may not justify the cost of building a full go-to-market operation from scratch.

**Independent layers include compute and perception.** Compute companies (Cerebras, Together AI, Modal, Groq) and perception companies (Browserbase, Parallel) have not been acquired, and this is likely because their technical assets are harder to copy through acquisition. A wafer-scale chip fabrication capability (Cerebras) [11] or a high-throughput inference platform (Together AI at ~$1B ARR) [12] cannot be easily folded into an existing product line. These companies generate enough standalone revenue to justify independence.

Orchestration sits in an ambiguous position. Temporal ($5B valuation) [5] is large enough to remain independent, but if its growth slows, it could become an acquisition target for a cloud provider looking to add durable execution as a platform feature.

### 6.3 Observability Collapsing Into Databases

The Langfuse and Helicone acquisitions reveal a specific consolidation pattern worth examining [9, 56]. ClickHouse, a database company, acquired Langfuse. Mintlify, a developer documentation platform, acquired Helicone. In both cases, an LLM observability tool was absorbed into an adjacent product category.

This pattern suggests that LLM observability is not a standalone category. It is a feature set that database companies, documentation platforms, and developer tools can add to their existing products. The data generated by LLM observability (traces, logs, latency measurements, cost tracking) is fundamentally database content. Storing and querying that data is a core competency of database companies, not a new category requiring new companies.

Braintrust ($120M+, $800M valuation) and Arize AI ($131M) are the remaining independent players in this layer [8, 10]. Their survival may depend on expanding beyond pure observability into evaluation, experimentation, and workflow management, functions that are harder for a database company to replicate.

### 6.4 The Bootstrapped Counterexample

Not every layer requires venture capital. Several companies built profitable businesses with minimal external funding, and the capital efficiency numbers tell the story clearly.

Chatbase reached $10M ARR while fully bootstrapped with 18 employees [43]. On zero external funding, its capital efficiency is effectively infinite. Apify generates $13.3M ARR on only $3M in external funding, returning $4.43 in revenue per dollar raised [42]. Compare these with Cognition, which generates $492M ARR on $2.5B+ raised, or $0.20 in revenue per dollar raised so far [35]. Cognition's ratio will likely improve as revenue scales, but the contrast is instructive.

The capital-efficient companies cluster in layers that sell directly to individual developers and small teams. The bootstrapped path works for perception tools (Apify), developer experience products (Chatbase), and monitoring tools with self-serve pricing. It does not work for compute (too capital-intensive), security (requires enterprise sales), or orchestration (infrastructure complexity demands sustained investment).

The distinction is informative. Layers where the buyer is an individual developer with a credit card can support bootstrapped companies. Layers where the buyer is an enterprise security team or a CTO making a platform decision require the sales and marketing budgets that venture capital provides. The capital requirements of a layer tell a story about its buyer, not just its technology.

## 7. Platform Convergence

### 7.1 The Vercel Marketplace as Case Study

The Vercel Marketplace contains 97+ integrations across 22 categories, with a dedicated "Agents" category added in 2025 [41]. The Agents category includes Browserbase, Firecrawl, Braintrust, CodeRabbit, Inngest, Parallel, Corridor, and others. Each can be provisioned with one click, billed through a single invoice, and connected to a Vercel project with automatic API key injection.

This is the AWS model applied to agent infrastructure. AWS did not build most of its services from scratch. It acquired companies, built some services in-house, and integrated third-party tools into a unified billing and provisioning surface. Over roughly a decade, AWS absorbed databases, compute, storage, monitoring, and security into a single bill. Vercel is attempting the same pattern for agent infrastructure in roughly two years.

This happened quickly because agent infrastructure companies are smaller, younger, and more modular than the services AWS bundled. A Browserbase integration takes days to add to a marketplace, not months. The companies themselves benefit from marketplace distribution (Vercel's developer audience) in exchange for platform lock-in (billing through Vercel, authentication through Vercel, customer relationship partially owned by Vercel).

### 7.2 Cloudflare Workers AI

Cloudflare's entry into the compute layer represents a different kind of platform convergence. Cloudflare started as a CDN and DDoS protection service. It added serverless compute (Workers), key-value storage (KV), object storage (R2), and databases (D1). Workers AI, which runs 78 models at 300+ edge locations, extends this pattern into inference [17].

The competitive position is distinct from pure-play compute providers. Cloudflare cannot match the raw throughput or model selection of Together AI or Fireworks AI. But Cloudflare can offer inference at every edge location where it already serves web traffic, with zero additional infrastructure for the developer to manage. For the large class of agent tasks that require adequate (not state-of-the-art) inference with low latency, Cloudflare's position is strong.

The function calling support built into Cloudflare Workers AI is particularly relevant. An agent running on Cloudflare can call a model, receive a structured function call response, execute the function on a Cloudflare Worker, and return the result, all within the same edge location. This tight integration between compute, inference, and execution is difficult for standalone compute providers to replicate.

### 7.3 Platform Moves in 2026

This pattern goes beyond developer-focused platforms. In May 2026 alone, three major platform companies made agent infrastructure moves. Microsoft launched Agent 365 as a general-availability centralized governance layer for agents. ServiceNow expanded its Autonomous Workforce product across IT, HR, finance, and legal functions. Google released Antigravity 2.0 with a multi-agent framework and CLI [55]. Each of these moves folds agent infrastructure capabilities (orchestration, identity, evaluation) into an existing platform, shrinking the addressable market for standalone tools.

### 7.4 Which Layers Are Vulnerable

The historical parallel with AWS suggests that platform bundling will not affect all layers equally.

**Table 5. Layer Vulnerability to Platform Absorption**

| Vulnerability Level | Layers | Reasoning |
|---------------------|--------|-----------|
| High | Security, Observability | Already being folded in. Feature-like functionality. |
| Medium | Memory & Retrieval, Orchestration | Databases adding vector search. Cloud providers adding workflow engines. But specialized use cases persist. |
| Low | Compute & Inference, Perception | Requires specialized hardware or deep technical infrastructure. Hard to replicate as a platform feature. |
| Special case | Sandboxed Execution | Narrow function, but no platform has replicated it yet. Single-company layer is both strength and risk. |

Security and observability are the most vulnerable because their products do well-defined, modular jobs that platform companies can add without changing their core architecture. Compute and perception are the least vulnerable because their technical requirements (custom chips, browser infrastructure at scale) create barriers that platform companies cannot easily cross.

## 8. Capital Allocation and What It Signals

### 8.1 Funding Velocity

Disclosed equity funding for agentic AI companies nearly doubled from $1.5B in 2024 to $2.9B in 2025. The January-May 2026 pace of $1.1B across 29 deals, annualized to approximately $2.6B, indicates slight deceleration from the 2025 peak but continued elevated activity. The deal count also grew from 31 in 2024 to 50 in 2025, suggesting broadening investor interest rather than simple check-size inflation.

### 8.2 Where the Money Goes

Capital allocation across the stack reveals a clear investor thesis. The top and bottom layers attract the vast majority of capital. Agents as products ($5.9B+) and compute ($4.4B+) together account for over 85% of total funding. The middle layers split roughly $2B across six categories.

**Table 6. Capital Allocation by Layer**

| Layer | Combined Funding | % of Total | Investor Signal |
|-------|-----------------|------------|-----------------|
| Agents as Products | ~$5.9B+ | ~49% | Betting on direct revenue from finished products |
| Compute & Inference | ~$4.4B+ | ~36% | Compute as permanent bottleneck; massive capital needs |
| Orchestration | ~$709M | ~6% | Durable execution seen as sticky infrastructure |
| Memory & Retrieval | ~$347M | ~3% | Funding stalled; category may be commoditizing |
| Perception | ~$339M | ~3% | Active but smaller rounds; defensible tech |
| Security | ~$312M+ | ~3% | Consolidating via M&A rather than new funding |
| Evaluation & Observability | ~$256M+ | ~2% | Collapsing into adjacent categories |
| Sandboxed Execution | ~$32M | <1% | Single-company layer; narrow but critical |

The concentration of capital at the extremes (finished products and raw compute) mirrors patterns from earlier infrastructure cycles. In the cloud computing era, the biggest outcomes went to application companies (Salesforce, Workday) and compute/storage providers (AWS, Azure). The middleware layers (monitoring, security, CI/CD) produced smaller but still important exits. The same distribution appears to be forming in agent infrastructure.

### 8.3 The Investor Thesis Split

Top venture firms have developed distinct thesis orientations that map to different parts of the stack.

**Table 7. Investor Thesis Orientations**

| Investor | Strategy | Representative Deals |
|----------|----------|---------------------|
| Sequoia Capital | Growth-stage vertical agents and compute | Sierra, fal.ai, Parallel |
| a16z | Horizontal infrastructure | Inngest, Upstash |
| Kleiner Perkins | Perception and vertical agents | Browserbase ($67.5M lead), Harvey |
| ICONIQ Growth | Enterprise evaluation | Braintrust ($120M+, $800M val) |
| Y Combinator | Seed pipeline for infrastructure | Firecrawl, Kernel [4], E2B, Composio |

Sequoia leads growth-stage rounds for the companies it believes will define their categories, focusing on vertical agents and compute platforms. a16z funds horizontal infrastructure, the picks-and-shovels companies that agents run on. Kleiner Perkins straddles both, leading the largest perception deal (Browserbase) while backing vertical players like Harvey. Y Combinator operates as the primary seed pipeline for the infrastructure layers, with Firecrawl, Kernel, E2B, and Composio all passing through its batches.

### 8.4 The Category Split

Vertical AI agents attract approximately 55% of total capital and 48% of total deals. Agent execution infrastructure (picks-and-shovels) accounts for approximately 30% of capital with a growing deal count. Agent development platforms (orchestration, SDKs) take approximately 15% with fluctuating deal activity. These category-level splits are derived from the same company-level dataset described in the methodology section. The United States captures approximately 82% of all agentic AI venture capital, based on the geographic distribution of companies in this dataset. Europe accounts for 10 to 12%, with France, the UK, and Germany producing the majority of European agent companies. Israel contributes a disproportionate share in agent security specifically.

## 9. Open Questions and Risks

**Will the eight layers stay independent or collapse into three or four platform bundles?** The AWS precedent suggests eventual consolidation, but the timeline matters. AWS took roughly a decade to absorb most cloud infrastructure categories. Vercel and Cloudflare are moving faster, but the technical specificity of some agent layers (compute, perception) may protect specialist companies in ways that earlier cloud categories did not.

**The wrapper startup die-off.** Industry estimates put the failure rate for early-stage AI agent startups at 80 to 90%. The primary failure mode is thin wrappers around foundation model APIs. Every time OpenAI, Anthropic, or Google adds a native feature (function calling, code execution, web browsing), a cohort of wrapper startups loses its value proposition. The companies that survive own infrastructure the model providers cannot replicate. The coming 12 to 18 months will likely produce a wave of closures and acqui-hires as the shakeout accelerates.

**Compute as the permanent bottleneck.** Every layer in the stack depends on inference. If GPU supply constraints persist, compute costs could limit the growth of every other layer regardless of how well those layers execute. The Cerebras IPO ($95B market cap) [11] and the Groq-Nvidia licensing deal (reportedly ~$20B per media estimates) [15] reflect the market's belief that compute scarcity is a durable condition. If compute becomes cheap and abundant (through custom chips, edge inference, or efficiency gains), the entire stack reprices.

**The geographic concentration problem.** The United States captures approximately 82% of agentic AI venture capital. China is largely absent from this analysis due to data source limitations, but Chinese AI companies are building their own agent infrastructure stacks. When Chinese agent infrastructure scales and begins competing globally, the current US-dominated market map could shift in ways this paper's data does not capture.

**Regulatory uncertainty.** Agents acting autonomously raise liability questions that no existing legal framework addresses well. When an agent makes a purchase, signs a contract, or sends a communication on behalf of a user, who bears liability if something goes wrong? The OAuth 2.1 work at Descope and the Agentic Commerce Protocol at Stripe represent early technical responses, but the legal and regulatory frameworks lag behind the technology by years. Jurisdictional differences (EU AI Act, US state-level regulation, no comprehensive US federal framework) add complexity for companies operating globally.

**The "high intent, low maturity" gap.** Gartner reports 60% of organizations plan agent deployment within two years, but only 17% have deployed [46]. McKinsey found only 23% have scaled even one agentic system [45]. Deloitte found only 20% have mature governance [47]. This gap is good for infrastructure companies today, since enterprises need tools to close it. But if the gap persists because agents fail to deliver expected value, the entire market contracts. The infrastructure stack exists to serve agent builders. If agent builders fail, the infrastructure fails with them.

**Limitations of this analysis.** This paper relies on disclosed funding data, which understates total capital deployment since many deals remain confidential. The dataset skews toward US-headquartered companies (82% of captured capital), and Chinese agent infrastructure companies are largely absent. Company-reported ARR figures (Cognition, Together AI, Modal) have not been independently audited. Metrics like E2B's "88% Fortune 100 adoption" depend on company-defined criteria for what counts as adoption. The Gini coefficient and concentration metrics are sensitive to how company boundaries are drawn (e.g., whether Composio belongs in orchestration, tools, or both). Finally, the eight-layer taxonomy is one of several valid ways to decompose this market; alternative groupings (such as MightyBot's seven-category map [55]) would produce different layer boundaries and funding distributions.

## 10. Conclusion

The agent infrastructure stack took shape in roughly 24 months, producing eight functional layers, over $12B in venture capital deployment, and more than 40 specialized companies. The analysis in this paper suggests that the current structure is transitional rather than permanent.

The dependency chain puts the compute layer at the center of power, since every other layer depends on inference. Capital allocation confirms this, with compute and agent products together taking over 85% of total funding. A Gini coefficient of 0.78 across company-level funding shows that the typical agent infrastructure startup operates in a very different reality from the headline numbers. The middle layers of the stack, orchestration, evaluation, memory, perception, security, and sandboxed execution, split roughly $2B among them, reflecting investor uncertainty about which of these layers will survive on their own.

Three forces are changing the stack at the same time. Platform bundling is pulling standalone tools into unified marketplaces (Vercel, Cloudflare, Microsoft, Google). New architectural patterns are creating new building blocks (agent-native identity, sandboxed execution, edge inference) that did not exist two years ago. And consolidation is removing independent companies in security and observability through acquisition, with time-to-acquisition shrinking from four years to two.

The paper leaves open a question that the data alone cannot answer. In cloud computing, AWS folded databases, storage, compute, and monitoring into a single platform over a decade, and specialist companies that survived did so by going deeper into their niche than the platform could follow. The same pattern appears to be forming in agent infrastructure. Some layers (security, observability) look headed toward being folded into platforms. Others (compute, perception) may remain independent because their technical depth resists bundling. The interesting question is what happens to the layers in between, orchestration, memory, and sandboxed execution, where the outcome remains genuinely uncertain. Enterprise adoption data suggests the demand is real (60% intend to deploy agents within two years), but the maturity gap is also real (only 17% have done so). Whether the infrastructure stack proves durable or temporary depends on which of these numbers moves faster.

## References

1. Browserbase. "Browserbase raises $50M Series B." Company blog, 2025. Funding data via company disclosures (accessed May 2026).

2. Firecrawl. Company disclosures. https://www.firecrawl.dev/ (accessed May 2026).

3. Parallel. Funding announcement. Company disclosures, 2025. Total funding per venture funding databases (accessed May 2026).

4. Kernel. Company profile. Venture funding databases (accessed May 2026).

5. Temporal Technologies. "Temporal raises Series C." Company blog. Total funding per venture funding databases (accessed May 2026).

6. Inngest. Company disclosures. https://www.inngest.com/ (accessed May 2026).

7. Composio. Company disclosures. https://composio.dev/ (accessed May 2026).

8. Braintrust Data. Company disclosures. Funding data per venture funding databases (accessed May 2026).

9. Langfuse. "Langfuse joins ClickHouse." Company blog, January 2026. https://langfuse.com/blog/langfuse-joins-clickhouse

10. Arize AI. Company disclosures. Funding data per venture funding databases (accessed May 2026).

11. Cerebras Systems. Form S-1 Registration Statement. U.S. Securities and Exchange Commission, EDGAR. Filed 2026. Post-IPO market cap per NASDAQ (accessed May 2026).

12. Together AI. Company disclosures. Funding and ARR data per venture funding databases and media reports (accessed May 2026).

13. Modal Labs. Company disclosures. Funding data per venture funding databases (accessed May 2026).

14. Fireworks AI. Company disclosures. Funding and throughput data per venture funding databases (accessed May 2026).

15. Groq. Company disclosures. Funding data and Nvidia licensing per media reports (accessed May 2026).

16. fal.ai. Company disclosures. Funding data per venture funding databases (accessed May 2026).

17. Cloudflare Workers AI Models. Cloudflare Developer Documentation. https://developers.cloudflare.com/workers-ai/models/ (accessed May 2026).

18. Pinecone. Company disclosures. Funding data per venture funding databases (accessed May 2026).

19. Qdrant. Company disclosures. Funding data per venture funding databases (accessed May 2026).

20. Weaviate. Company disclosures. Funding data per venture funding databases (accessed May 2026).

21. Chroma. Company disclosures. Funding data per venture funding databases (accessed May 2026).

22. Mem0. Company disclosures. Funding and AWS partnership data per venture funding databases (accessed May 2026).

23. Upstash. Company disclosures. https://upstash.com/ (accessed May 2026).

24. E2B. Company disclosures. https://e2b.dev/ (accessed May 2026).

25. Cisco. "Cisco Acquires Robust Intelligence." Cisco Security Blog. October 2024. https://blogs.cisco.com/security/cisco-acquires-robust-intelligence

26. Cisco. "Cisco Acquires Galileo." Cisco Security Blog. April 2026. https://blogs.cisco.com/security/cisco-acquires-galileo

27. Check Point Software Technologies. "Check Point Acquires Lakera." Press release. September 2025. https://www.checkpoint.com/press-releases/check-point-acquires-lakera/

28. Lakera. Company disclosures. Founding date and funding data per venture funding databases (accessed May 2026).

29. Robust Intelligence. Company disclosures. Funding data per venture funding databases (accessed May 2026).

30. Galileo AI. Company disclosures. Funding data per venture funding databases (accessed May 2026).

31. Patronus AI. Company disclosures. Funding data per venture funding databases (accessed May 2026).

32. Corridor. Company disclosures. Funding data per venture funding databases (accessed May 2026).

33. Arcjet. Company disclosures. Funding data per venture funding databases (accessed May 2026).

34. Descope. Company disclosures. Funding and product data per venture funding databases (accessed May 2026).

35. Cognition AI. Funding and ARR data per venture funding databases and media reports (accessed May 2026).

36. Sierra AI. Funding data per venture funding databases (accessed May 2026).

37. Harvey AI. Funding data per venture funding databases and media reports (accessed May 2026).

38. Decagon. Funding data per venture funding databases (accessed May 2026).

39. Factory AI. Funding data per venture funding databases (accessed May 2026).

40. CodeRabbit. Funding data per venture funding databases (accessed May 2026).

41. Vercel Marketplace. https://vercel.com/marketplace (accessed May 2026).

42. Apify. Company disclosures. Revenue and funding data. https://apify.com/ (accessed May 2026).

43. Chatbase. Company disclosures. https://www.chatbase.co/ (accessed May 2026).

44. AWS Bedrock Agents. Amazon Web Services. https://aws.amazon.com/bedrock/agents/ (accessed May 2026).

45. McKinsey & Company. "The State of AI in 2025." McKinsey Global Survey, 2025.

46. Gartner. "Hype Cycle for Agentic AI, 2026." Gartner Research, 2026.

47. Deloitte. "State of AI in the Enterprise, 7th Edition." Deloitte Insights, 2026.

48. A. Adimulam, R. Gupta, and S. Kumar. "The Orchestration of Multi-Agent Systems: Architectures, Protocols, and Enterprise Adoption." arXiv:2601.13671, 2026.

49. D. Liu, K. Upadhyay, V. Chhetri, A. B. Siddique, and U. Farooq. "A Large-Scale Study on the Development and Issues of Multi-Agent AI Systems." arXiv:2601.07136, 2026.

50. W. Huang, W. Zhang et al. "Rethinking Memory Mechanisms of Foundation Agents in the Second Half: A Survey." arXiv:2602.06052, 2026.

51. C. Yang, C. Zhou, Y. Xiao et al. "Graph-based Agent Memory: Taxonomy, Techniques, and Applications." arXiv:2602.05665, 2026.

52. J. Logan. "Continuum Memory Architectures for Long-Horizon LLM Agents." arXiv:2601.09913, 2026.

53. Z. Jia, J. Li, Y. Kang et al. "The AI Hippocampus: How Far are We From Human Memory?" arXiv:2601.09113, 2026.

54. Y. Tang and T. Runkler. "LLM-Based Agentic Systems for Software Engineering: Challenges and Opportunities." arXiv:2601.09822, 2026.

55. MightyBot. "AI Agents Market Map 2026: Every Category Mapped." May 2026. https://mightybot.ai/blog/ai-automation-agents-market-maps-gone-wild/

56. Mintlify. "Mintlify acquires Helicone." Company blog, March 2026.
