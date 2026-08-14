export type GlossarySourceFact = {
  label: string;
  url: string;
  fact: string;
};

/** Canonical papers and official docs only. Skip a term rather than invent a URL. */
export const GLOSSARY_SOURCE_FACTS: Record<string, GlossarySourceFact[]> = {
  agi: [{
    label: "OpenAI Charter",
    url: "https://openai.com/charter/",
    fact: "OpenAI's charter defines AGI as systems that outperform humans at most economically valuable work. That is a company definition, not a scientific test that has been passed.",
  }],
  llm: [{
    label: "OpenAI, GPT-4 Technical Report (2023)",
    url: "https://arxiv.org/abs/2303.08774",
    fact: "OpenAI's GPT-4 technical report (2023) describes a large multimodal model trained to predict the next token. The public report does not disclose parameter count.",
  }],
  'prompt-engineering': [{
    label: "OpenAI, Prompt engineering",
    url: "https://platform.openai.com/docs/guides/prompt-engineering",
    fact: "OpenAI's own prompt guide says to be specific about format, constraints, and examples. Chain-of-thought and few-shot prompting are documented there as standard methods.",
  }],
  'fine-tuning': [{
    label: "OpenAI, Fine-tuning",
    url: "https://platform.openai.com/docs/guides/fine-tuning",
    fact: "OpenAI documents fine-tuning as extra training on your examples so the model follows a style or task more reliably than prompting alone.",
  }],
  rag: [{
    label: "Lewis et al., Retrieval-Augmented Generation (2020)",
    url: "https://arxiv.org/abs/2005.11401",
    fact: "Patrick Lewis and coauthors at Facebook AI published RAG in 2020. The model retrieves Wikipedia passages, then generates an answer from those passages instead of from memory alone.",
  }],
  hallucination: [{
    label: "Ji et al., Survey of Hallucination in Natural Language Generation (2023)",
    url: "https://arxiv.org/abs/2202.03629",
    fact: "A 2023 ACM Computing Surveys paper reviews how language models invent fluent but false text, and why grounding in retrieved documents reduces that risk.",
  }],
  alignment: [{
    label: "Christiano et al., Deep RL from Human Preferences (2017)",
    url: "https://arxiv.org/abs/1706.03741",
    fact: "Paul Christiano and coauthors showed in 2017 that ranking model outputs can steer behavior. That paper is a root of today's RLHF alignment stack.",
  }],
  'constitutional-ai': [{
    label: "Anthropic, Constitutional AI (2022)",
    url: "https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback",
    fact: "Anthropic published Constitutional AI in 2022. A written list of principles replaces much of the human labeling used in RLHF.",
  }],
  'zero-shot-learning': [{
    label: "Brown et al., Language Models are Few-Shot Learners (2020)",
    url: "https://arxiv.org/abs/2005.14165",
    fact: "GPT-3's 2020 paper showed that a large model can do new tasks from instructions alone, or from a few examples in the prompt, without a fine-tune.",
  }],
  rlhf: [{
    label: "Ouyang et al., InstructGPT (2022)",
    url: "https://arxiv.org/abs/2203.02155",
    fact: "OpenAI's InstructGPT paper (2022) showed that a 1.3B model trained with human preference rankings could follow instructions better than a 175B base GPT-3.",
  }],
  transformer: [{
    label: "Vaswani et al., Attention Is All You Need (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "Eight Google researchers published the Transformer in 2017. GPT, Claude, Gemini, and BERT all sit on that design.",
  }],
  'transformer-architecture': [{
    label: "Vaswani et al., Attention Is All You Need (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "The 2017 paper replaced recurrence with self-attention so models could train in parallel on long sequences.",
  }],
  token: [{
    label: "OpenAI, What are tokens?",
    url: "https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them",
    fact: "OpenAI's help page says English runs about 4 characters per token, or roughly 100 tokens per 75 words. Bills are per token, not per word.",
  }],
  tokenizer: [{
    label: "Sennrich et al., Neural Machine Translation of Rare Words with Subword Units (2016)",
    url: "https://arxiv.org/abs/1508.07909",
    fact: "Byte Pair Encoding for translation was published in 2016. GPT-2, GPT-3, and many later models tokenize with a BPE variant.",
  }],
  bpe: [{
    label: "Sennrich et al., Subword Units (2016)",
    url: "https://arxiv.org/abs/1508.07909",
    fact: "Rico Sennrich, Barry Haddow, and Alexandra Birch introduced BPE subwords for neural translation in 2016.",
  }],
  embeddings: [{
    label: "Mikolov et al., Efficient Estimation of Word Representations (2013)",
    url: "https://arxiv.org/abs/1301.3781",
    fact: "Tomas Mikolov and coauthors at Google published word2vec in 2013. Nearby vectors meant similar words, which is still how embedding search works.",
  }],
  'word-embeddings': [{
    label: "Mikolov et al., word2vec (2013)",
    url: "https://arxiv.org/abs/1301.3781",
    fact: "The 2013 word2vec paper showed that vector offsets can capture analogies such as king minus man plus woman.",
  }],
  agent: [{
    label: "Russell and Norvig, Artificial Intelligence: A Modern Approach",
    url: "https://aima.cs.berkeley.edu/",
    fact: "Russell and Norvig define an agent as anything that perceives an environment and acts. That textbook definition is what people now apply to LLM tool-users.",
  }],
  'autonomous-agents': [{
    label: "Russell and Norvig, AIMA",
    url: "https://aima.cs.berkeley.edu/",
    fact: "The standard AI textbook treats autonomy as acting without a human in every loop. Today's coding and browsing agents are a practical version of that idea.",
  }],
  'multimodal-ai': [{
    label: "OpenAI, GPT-4V System Card",
    url: "https://openai.com/index/gpt-4v-system-card/",
    fact: "OpenAI's GPT-4V system card (2023) describes a model that accepts images and text. That is one shipped example of multimodal input.",
  }],
  blockchain: [{
    label: "Nakamoto, Bitcoin: A Peer-to-Peer Electronic Cash System (2008)",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "Satoshi Nakamoto's 2008 Bitcoin paper described a timestamped chain of hashed blocks so money could move without a bank.",
  }],
  'smart-contract': [{
    label: "Ethereum, Introduction to smart contracts",
    url: "https://ethereum.org/en/developers/docs/smart-contracts/",
    fact: "Ethereum's docs define a smart contract as a program on the blockchain. Nick Szabo coined the phrase in the 1990s. Ethereum made it a live platform in 2015.",
  }],
  defi: [{
    label: "Ethereum, Decentralized finance (DeFi)",
    url: "https://ethereum.org/en/defi/",
    fact: "ethereum.org describes DeFi as financial products on public contracts: lending, trading, and stablecoins without a company holding the books.",
  }],
  nft: [{
    label: "Ethereum, Non-fungible tokens (NFT)",
    url: "https://ethereum.org/en/nft/",
    fact: "Ethereum's NFT page explains a unique token whose metadata points at an image, pass, or deed. ERC-721 is the common standard.",
  }],
  dao: [{
    label: "Ethereum, Decentralized autonomous organizations (DAOs)",
    url: "https://ethereum.org/en/dao/",
    fact: "ethereum.org describes a DAO as a group coordinated by on-chain rules and a treasury, with votes recorded on the chain.",
  }],
  'consensus-mechanism': [{
    label: "Ethereum, Consensus mechanisms",
    url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/",
    fact: "Ethereum's docs contrast proof of work (miners spend energy) with proof of stake (validators lock coins). Ethereum switched to proof of stake in 2022.",
  }],
  'gas-fees': [{
    label: "Ethereum, Gas and fees",
    url: "https://ethereum.org/en/developers/docs/gas/",
    fact: "Every EVM operation has a gas cost. EIP-1559 (2021) split the fee into a burned base fee and an optional tip.",
  }],
  'layer-2': [{
    label: "Ethereum, Layer 2",
    url: "https://ethereum.org/en/layer-2/",
    fact: "ethereum.org defines Layer 2 as a separate chain that posts data or proofs back to Ethereum so users pay less while still inheriting Ethereum's security claims.",
  }],
  wallet: [{
    label: "Ethereum, Wallets",
    url: "https://ethereum.org/en/wallets/",
    fact: "A wallet holds keys, not coins. The coins live on the chain. MetaMask, Rainbow, and hardware devices are interfaces to those keys.",
  }],
  'governance-token': [{
    label: "Ethereum, DAOs",
    url: "https://ethereum.org/en/dao/",
    fact: "Many DAOs vote with a token. Holding more tokens usually means more voting weight, which is why large holders can dominate.",
  }],
  stablecoin: [{
    label: "USDC, What is USDC?",
    url: "https://www.circle.com/en/usdc",
    fact: "Circle's USDC page describes a dollar-backed token. Tether publishes reserves for USDT. Both are centralized issuers, not algorithms.",
  }],
  bridge: [{
    label: "Ethereum, Blockchain bridges",
    url: "https://ethereum.org/en/bridges/",
    fact: "ethereum.org warns that bridges are a common hack target because they lock large pots of tokens while minting wrapped copies on another chain.",
  }],
  oracle: [{
    label: "Chainlink, What is an oracle?",
    url: "https://chain.link/education/blockchain-oracles",
    fact: "Chainlink's explainer: contracts cannot fetch URLs. An oracle network posts prices and other off-chain data on-chain.",
  }],
  validator: [{
    label: "Ethereum, Proof-of-stake (PoS)",
    url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
    fact: "On Ethereum, a validator stakes 32 ETH, proposes or attests to blocks, and can be slashed for cheating or going offline too long.",
  }],
  'liquid-staking': [{
    label: "Lido, What is liquid staking?",
    url: "https://lido.fi/",
    fact: "Lido takes ETH, runs validators, and issues stETH so the staker can still trade or use DeFi while the ETH stays staked.",
  }],
  restaking: [{
    label: "EigenLayer, Overview",
    url: "https://docs.eigenlayer.xyz/eigenlayer/overview/",
    fact: "EigenLayer's docs describe restaking as opting staked ETH (or liquid staking tokens) into extra slashing rules for new services, in exchange for extra fees.",
  }],
  'liquid-restaking': [{
    label: "EigenLayer, Overview",
    url: "https://docs.eigenlayer.xyz/eigenlayer/overview/",
    fact: "Liquid restaking tokens wrap EigenLayer positions so users can trade a receipt while the underlying stake secures extra services.",
  }],
  api: [{
    label: "MDN, API",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/API",
    fact: "MDN defines an API as a set of rules for software to talk to other software. The browser's fetch() call is an API. So is Stripe's HTTP interface.",
  }],
  'rest-api': [{
    label: "Fielding, Architectural Styles and the Design of Network-based Software Architectures (2000)",
    url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",
    fact: "Roy Fielding named REST in his 2000 dissertation. Resources, URLs, and HTTP verbs are the practical form most web APIs still use.",
  }],
  graphql: [{
    label: "GraphQL Foundation, GraphQL spec",
    url: "https://spec.graphql.org/",
    fact: "Facebook open-sourced GraphQL in 2015. The client names the fields it wants so it does not need several REST round trips.",
  }],
  grpc: [{
    label: "gRPC, Documentation",
    url: "https://grpc.io/docs/",
    fact: "Google's gRPC uses HTTP/2 and Protocol Buffers. It is built for service-to-service calls, not for a browser typing a URL.",
  }],
  protobuf: [{
    label: "Protocol Buffers, Developer Guide",
    url: "https://protobuf.dev/",
    fact: "Google's protobuf docs describe a typed binary format. The same schema generates code in many languages.",
  }],
  kubernetes: [{
    label: "Kubernetes, Overview",
    url: "https://kubernetes.io/docs/concepts/overview/",
    fact: "Kubernetes started at Google and was open-sourced in 2014. You declare desired replicas. The control plane keeps the cluster there.",
  }],
  docker: [{
    label: "Docker, Overview",
    url: "https://docs.docker.com/get-started/overview/",
    fact: "Docker's docs describe an image as a snapshot and a container as a running instance. The image is what you ship.",
  }],
  serverless: [{
    label: "AWS, Serverless on AWS",
    url: "https://aws.amazon.com/serverless/",
    fact: "AWS Lambda (2014) popularized pay-per-invocation functions. You upload code. AWS starts it on a request and bills for run time.",
  }],
  'serverless-architecture': [{
    label: "AWS, Serverless",
    url: "https://aws.amazon.com/serverless/",
    fact: "Serverless still runs on servers. The vendor owns patching, scaling, and idle capacity. You own the function code.",
  }],
  cicd: [{
    label: "GitLab, CI/CD",
    url: "https://docs.gitlab.com/ee/ci/",
    fact: "GitLab's CI docs describe pipelines that test and deploy on every push. GitHub Actions and Jenkins do the same job.",
  }],
  'ci-cd': [{
    label: "GitHub Actions, Documentation",
    url: "https://docs.github.com/en/actions",
    fact: "GitHub Actions runs workflows from YAML in the repo. A push can lint, test, and deploy without a separate Jenkins box.",
  }],
  git: [{
    label: "Git, Documentation",
    url: "https://git-scm.com/doc",
    fact: "Linus Torvalds created Git in 2005 for the Linux kernel. Every clone holds the full history, not just the latest files.",
  }],
  dns: [{
    label: "IETF RFC 1035, Domain names",
    url: "https://www.rfc-editor.org/rfc/rfc1035",
    fact: "DNS was specified in RFC 1034 and 1035 (1987). Names map to records. Resolvers walk from the root to the authoritative server.",
  }],
  'tcp-ip': [{
    label: "IETF RFC 793, Transmission Control Protocol",
    url: "https://www.rfc-editor.org/rfc/rfc793",
    fact: "TCP (RFC 793) adds connections, retransmission, and ordered delivery on top of IP. The internet still runs on that pair.",
  }],
  'ssl-tls': [{
    label: "IETF RFC 8446, TLS 1.3",
    url: "https://www.rfc-editor.org/rfc/rfc8446",
    fact: "TLS 1.3 (RFC 8446, 2018) cut the handshake to one round trip and dropped old ciphers. Browsers now treat HTTPS as the default.",
  }],
  cdn: [{
    label: "Cloudflare, What is a CDN?",
    url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/",
    fact: "A CDN caches copies of files in many cities. Cloudflare, Fastly, Akamai, and CloudFront all sell that network.",
  }],
  webhook: [{
    label: "MDN, Webhooks",
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Webhook",
    fact: "MDN: the source service POSTs to your URL when an event happens. Stripe, GitHub, and Slack all use this instead of asking you to poll.",
  }],
  oauth: [{
    label: "IETF RFC 6749, OAuth 2.0",
    url: "https://datatracker.ietf.org/doc/html/rfc6749",
    fact: "OAuth 2.0 (RFC 6749) is how \"Sign in with Google\" works. The app gets a token with scopes. It never sees your password.",
  }],
  cors: [{
    label: "MDN, CORS",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
    fact: "Browsers block cross-origin requests unless the server sends Access-Control-Allow-Origin. That header is the whole mechanism.",
  }],
  websocket: [{
    label: "IETF RFC 6455, The WebSocket Protocol",
    url: "https://www.rfc-editor.org/rfc/rfc6455",
    fact: "RFC 6455 (2011) defines the upgrade from HTTP to a two-way socket. Chat, games, and live prices use it.",
  }],
  ipfs: [{
    label: "IPFS, Docs",
    url: "https://docs.ipfs.tech/concepts/what-is-ipfs/",
    fact: "IPFS addresses files by content hash, not by server name. If the bits match the hash, you have the right file.",
  }],
  webassembly: [{
    label: "W3C, WebAssembly Core Specification",
    url: "https://www.w3.org/TR/wasm-core-2/",
    fact: "W3C standardized WebAssembly so browsers can run compact bytecode near native speed. Figma and some games ship Wasm modules.",
  }],
  'zero-knowledge-proof': [{
    label: "Ethereum, Zero-knowledge proofs",
    url: "https://ethereum.org/en/zero-knowledge-proofs/",
    fact: "ethereum.org: a prover convinces a verifier that a statement is true without showing the secret. ZK-rollups use this to compress Ethereum traffic.",
  }],
  'zero-knowledge-proofs-zkps': [{
    label: "Ethereum, Zero-knowledge proofs",
    url: "https://ethereum.org/en/zero-knowledge-proofs/",
    fact: "The same idea as a ZK-proof on Ethereum: prove a computation happened, post a small proof, skip re-running every step on Layer 1.",
  }],
  'merkle-tree': [{
    label: "Bitcoin wiki, Merkle Tree",
    url: "https://developer.bitcoin.org/reference/block_chain.html",
    fact: "Bitcoin stores transactions in a Merkle tree so a light client can check inclusion without downloading the full block.",
  }],
  sharding: [{
    label: "Ethereum, Danksharding",
    url: "https://ethereum.org/en/roadmap/danksharding/",
    fact: "Ethereum's danksharding roadmap is about data blobs for rollups, not splitting execution into many shards. Proto-danksharding shipped as EIP-4844.",
  }],
  'database-sharding': [{
    label: "MongoDB, Sharding",
    url: "https://www.mongodb.com/docs/manual/sharding/",
    fact: "MongoDB's sharding docs: split a collection across machines by a shard key. Bad keys create hot shards. Good keys spread writes.",
  }],
  'acid-properties': [{
    label: "Gray and Reuter, Transaction Processing (classic ACID)",
    url: "https://www.microsoft.com/en-us/research/publication/the-transaction-concept-virtues-and-limitations/",
    fact: "Jim Gray described transactions that are atomic, consistent, isolated, and durable. SQL databases still advertise those four guarantees.",
  }],
  'context-window': [{
    label: "OpenAI, GPT-4 Turbo",
    url: "https://openai.com/index/new-models-and-developer-products-announced-at-devday/",
    fact: "OpenAI announced a 128k-token GPT-4 Turbo window at DevDay 2023. The window is a hard cap: tokens outside it are invisible to that call.",
  }],
  temperature: [{
    label: "OpenAI API, Temperature",
    url: "https://platform.openai.com/docs/api-reference/chat/create",
    fact: "OpenAI's API treats temperature as a randomness knob. 0 is near-greedy. Higher values flatten the next-token distribution.",
  }],
  inference: [{
    label: "NVIDIA, What is inference?",
    url: "https://blogs.nvidia.com/blog/what-is-inference/",
    fact: "NVIDIA describes inference as running a trained model to produce outputs. Training writes the weights. Inference uses them.",
  }],
  'chain-of-thought': [{
    label: "Wei et al., Chain-of-Thought Prompting (2022)",
    url: "https://arxiv.org/abs/2201.11903",
    fact: "Jason Wei and coauthors at Google showed in 2022 that asking a large model to show steps lifts math and logic accuracy.",
  }],
  'reasoning-model': [{
    label: "OpenAI, OpenAI o1",
    url: "https://openai.com/index/learning-to-reason-with-llms/",
    fact: "OpenAI's o1 post (2024) describes a model that spends more compute on hidden chain-of-thought before answering. That is the reasoning-model pattern.",
  }],
  mcp: [{
    label: "Model Context Protocol, Specification",
    url: "https://modelcontextprotocol.io/specification",
    fact: "Anthropic open-sourced MCP in 2024 so tools, prompts, and data sources can speak one protocol to Claude, Cursor, and other hosts.",
  }],
  'vector-database': [{
    label: "Pinecone, What is a vector database?",
    url: "https://www.pinecone.io/learn/vector-database/",
    fact: "Pinecone's explainer: store embedding vectors and search by nearest neighbor. RAG systems use this to fetch passages by meaning, not keywords.",
  }],
  'model-distillation': [{
    label: "Hinton et al., Distilling the Knowledge in a Neural Network (2015)",
    url: "https://arxiv.org/abs/1503.02531",
    fact: "Geoffrey Hinton, Oriol Vinyals, and Jeff Dean formalized distillation in 2015: train a small student on a teacher's soft probabilities.",
  }],
  'knowledge-distillation': [{
    label: "Hinton et al., Distilling the Knowledge in a Neural Network (2015)",
    url: "https://arxiv.org/abs/1503.02531",
    fact: "The 2015 distillation paper is the usual citation when a small model copies a large one.",
  }],
  tokenization: [{
    label: "Ethereum, ERC-20 Token Standard",
    url: "https://eips.ethereum.org/EIPS/eip-20",
    fact: "ERC-20 (2015) is the common Ethereum interface for fungible tokens: transfer, approve, and balanceOf.",
  }],
  amm: [{
    label: "Uniswap, Automated market maker",
    url: "https://docs.uniswap.org/concepts/protocol/automated-market-maker",
    fact: "Uniswap popularized x*y=k pools. Liquidity providers deposit two tokens. Traders swap against the pool instead of an order book.",
  }],
  'seed-phrase': [{
    label: "Bitcoin BIP-39",
    url: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki",
    fact: "BIP-39 defines the 12 or 24 word mnemonic. Anyone with those words can derive the keys. There is no reset email.",
  }],
  mev: [{
    label: "Flashbots, MEV",
    url: "https://docs.flashbots.net/flashbots-auction/overview",
    fact: "Flashbots formed to route MEV through auctions instead of chaotic priority-gas bidding. Searchers bid for block space. Builders assemble blocks.",
  }],
  'mev-burn': [{
    label: "Ethereum, EIP-1559",
    url: "https://eips.ethereum.org/EIPS/eip-1559",
    fact: "EIP-1559 burns the base fee. That does not stop MEV. It does remove a slice of fee revenue from miners and validators.",
  }],
  depin: [{
    label: "Messari, DePIN",
    url: "https://messari.io/report/depin-the-emergence-of-a-new-category",
    fact: "Messari popularized the DePIN label for networks that pay tokens for real-world hardware: wireless, storage, compute, sensors.",
  }],
  'depin-networks': [{
    label: "Helium, How it works",
    url: "https://docs.helium.com/",
    fact: "Helium pays people to run wireless hotspots. That is a concrete DePIN: hardware in the world, tokens on a chain.",
  }],
  airdrop: [{
    label: "Uniswap, UNI token",
    url: "https://uniswap.org/blog/uni",
    fact: "Uniswap's September 2020 UNI airdrop sent 400 UNI to early users. That drop is the template later protocols copied.",
  }],
  tokenomics: [{
    label: "Vitalik Buterin, Sound Money, Sound Currency",
    url: "https://vitalik.eth.limo/general/2022/05/25/stable.html",
    fact: "Supply rules, fee burns, and unlock schedules decide whether a token is scarce or inflationary. Read the contract and the vesting, not the slogan.",
  }],
  'attention-mechanism': [{
    label: "Bahdanau et al., Neural Machine Translation by Jointly Learning to Align and Translate (2015)",
    url: "https://arxiv.org/abs/1409.0473",
    fact: "Dzmitry Bahdanau's 2015 alignment paper introduced attention for translation. Transformers later made attention the whole architecture.",
  }],
  'self-attention': [{
    label: "Vaswani et al., Attention Is All You Need (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "In the Transformer, every token attends to every other token in the same sequence. That is self-attention.",
  }],
  'cross-attention': [{
    label: "Vaswani et al., Attention Is All You Need (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "Encoder-decoder Transformers use cross-attention so decoder queries can read encoder keys and values, which is how classic translation models look at the source sentence.",
  }],
  quantization: [{
    label: "Jacob et al., Quantization and Training of Neural Networks for Integer-Arithmetic-Only Inference (2018)",
    url: "https://arxiv.org/abs/1712.05877",
    fact: "Google's 2018 quantization paper showed 8-bit integer inference with little accuracy loss, which is how many mobile models ship.",
  }],
  'model-quantization': [{
    label: "Jacob et al., Integer-Arithmetic-Only Inference (2018)",
    url: "https://arxiv.org/abs/1712.05877",
    fact: "The usual path is 32-bit floats down to 8-bit integers so a phone GPU or NPU can run the net.",
  }],
  'prompt-injection': [{
    label: "OWASP, LLM01: Prompt Injection",
    url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    fact: "OWASP lists prompt injection as the top LLM risk: untrusted text that overrides the system prompt and steers the model.",
  }],
  'mixture-of-experts': [{
    label: "Fedus et al., Switch Transformer (2021)",
    url: "https://arxiv.org/abs/2101.03961",
    fact: "Google's Switch Transformer (2021) routes each token to one expert feedforward layer so parameter count can grow without matching compute.",
  }],
  'sparse-expert': [{
    label: "Shazeer et al., Outrageously Large Neural Networks (2017)",
    url: "https://arxiv.org/abs/1701.06538",
    fact: "The 2017 sparsely-gated MoE paper showed that only a few experts need to run per token.",
  }],
  grounding: [{
    label: "Lewis et al., RAG (2020)",
    url: "https://arxiv.org/abs/2005.11401",
    fact: "Grounding usually means tying the answer to retrieved documents. RAG is the standard pattern.",
  }, {
    label: "Google, Grounding overview (Vertex AI)",
    url: "https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview",
    fact: "Google Cloud documents grounding as connecting model output to your data or to search so answers can be checked.",
  }],
  'liquidity-pool': [{
    label: "Uniswap, Pools",
    url: "https://docs.uniswap.org/concepts/protocol/concentrated-liquidity",
    fact: "A pool is a contract holding token reserves. Uniswap v3 lets LPs concentrate that liquidity inside a price range.",
  }],
  'concentrated-liquidity': [{
    label: "Uniswap v3 Core",
    url: "https://uniswap.org/whitepaper-v3.pdf",
    fact: "The Uniswap v3 whitepaper (2021) lets LPs pick a price range. Capital outside that range earns no fees.",
  }],
  'yield-farming': [{
    label: "Compound, COMP distribution",
    url: "https://compound.finance/",
    fact: "Compound's COMP rewards (2020) paid people to supply and borrow. That loop is what people still call yield farming.",
  }],
  'flash-loan': [{
    label: "Aave, Flash Loans",
    url: "https://aave.com/docs/developers/flash-loans",
    fact: "Aave's flash loans must be borrowed and repaid in the same transaction. If repayment fails, the whole transaction reverts.",
  }],
  'layer-1': [{
    label: "Ethereum, Intro to Ethereum",
    url: "https://ethereum.org/en/developers/docs/intro-to-ethereum/",
    fact: "A Layer 1 is the base chain that settles itself: Bitcoin, Ethereum, Solana. Layer 2s post back to a Layer 1.",
  }],
  'proof-of-work': [{
    label: "Nakamoto, Bitcoin paper (2008)",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "Bitcoin's proof of work makes a block expensive to produce and cheap to verify. Changing history means redoing that work.",
  }],
  'proof-of-stake': [{
    label: "Ethereum, Proof-of-stake",
    url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
    fact: "Ethereum's proof of stake went live on 15 September 2022 (the Merge). Validators lock ETH instead of burning electricity to mine.",
  }],
  'cold-wallet': [{
    label: "Ledger, What is a cold wallet?",
    url: "https://www.ledger.com/academy/crypto/what-is-a-cold-wallet",
    fact: "A cold wallet keeps keys offline. Ledger and Trezor are the usual hardware. The device signs. The key does not sit on a hot laptop.",
  }],
  'cold-storage': [{
    label: "Bitcoin.org, How to store Bitcoin",
    url: "https://bitcoin.org/en/secure-your-wallet",
    fact: "bitcoin.org recommends keeping large balances offline. Paper, hardware, and air-gapped machines are all cold storage.",
  }],
  'hot-wallet': [{
    label: "Ethereum, Wallets",
    url: "https://ethereum.org/en/wallets/",
    fact: "A hot wallet's keys sit on a phone or browser that is online. Convenient for spending. Worse if malware hits the device.",
  }],
  'wrapped-token': [{
    label: "wETH, Wrapped Ether",
    url: "https://weth.io/",
    fact: "WETH is ETH locked in a contract so it can follow ERC-20 rules. Unwrap burns WETH and returns ETH.",
  }],
  'load-balancer': [{
    label: "NGINX, What is load balancing?",
    url: "https://www.nginx.com/resources/glossary/load-balancing/",
    fact: "A load balancer spreads requests across servers. NGINX, HAProxy, and cloud LBs are the usual boxes.",
  }],
  'attention-head': [{
    label: "Vaswani et al. (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "The original Transformer used 8 heads in the base model so different heads could track different relationships at once.",
  }],
  'positional-encoding': [{
    label: "Vaswani et al. (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "The 2017 paper added sine and cosine waves so the model knew token order. Later models often use RoPE instead.",
  }],
  'batch-normalization': [{
    label: "Ioffe and Szegedy, Batch Normalization (2015)",
    url: "https://arxiv.org/abs/1502.03167",
    fact: "Sergey Ioffe and Christian Szegedy published batch norm in 2015. It made deep nets much easier to train.",
  }],
  'layer-normalization': [{
    label: "Ba, Kiros, Hinton, Layer Normalization (2016)",
    url: "https://arxiv.org/abs/1607.06450",
    fact: "Layer norm (2016) normalizes across features in one example. Transformers use it instead of batch norm.",
  }],
  'residual-connection': [{
    label: "He et al., Deep Residual Learning (2015)",
    url: "https://arxiv.org/abs/1512.03385",
    fact: "Kaiming He's ResNet paper (2015) added skip connections so 100-layer nets could train. Transformers use the same trick.",
  }],
  dropout: [{
    label: "Srivastava et al., Dropout (2014)",
    url: "https://jmlr.org/papers/v15/srivastava14a.html",
    fact: "Dropout randomly zeros units during training so the net cannot rely on one path. The 2014 JMLR paper is the source.",
  }],
  'beam-search': [{
    label: "Graves, Sequence Transduction with Recurrent Neural Networks",
    url: "https://arxiv.org/abs/1211.3711",
    fact: "Beam search keeps the top k partial sequences instead of one greedy token. Machine translation systems still use it.",
  }],
  'top-k-sampling': [{
    label: "Fan et al., Hierarchical Neural Story Generation (2018)",
    url: "https://arxiv.org/abs/1805.04833",
    fact: "Top-k sampling was popularized for story generation in 2018: sample only from the k most likely next tokens.",
  }],
  'top-p-sampling': [{
    label: "Holtzman et al., The Curious Case of Neural Text Degeneration (2020)",
    url: "https://arxiv.org/abs/1904.09751",
    fact: "Nucleus (top-p) sampling was proposed in 2020. You sample from the smallest set of tokens whose probabilities sum to p.",
  }],
  softmax: [{
    label: "Goodfellow, Bengio, Courville, Deep Learning",
    url: "https://www.deeplearningbook.org/",
    fact: "Softmax turns a vector of scores into probabilities that sum to 1. Classification heads and attention weights both use it.",
  }],
  'activation-function': [{
    label: "Nair and Hinton, Rectified Linear Units (2010)",
    url: "https://www.cs.toronto.edu/~fritz/absps/reluICML.pdf",
    fact: "ReLU (max(0, x)) became the default after 2010 because it is cheap and avoids vanishing gradients on the positive side.",
  }],
  'cross-entropy-loss': [{
    label: "Goodfellow et al., Deep Learning",
    url: "https://www.deeplearningbook.org/contents/prob.html",
    fact: "Cross-entropy is the usual loss when the model outputs a probability distribution. Next-token training is cross-entropy on the true token.",
  }],
  lora: [{
    label: "Hu et al., LoRA (2021)",
    url: "https://arxiv.org/abs/2106.09685",
    fact: "LoRA freezes the base weights and trains two small matrices whose product is added back. Microsoft published it in 2021.",
  }],
  'low-rank-adaptation-lora': [{
    label: "Hu et al., LoRA (2021)",
    url: "https://arxiv.org/abs/2106.09685",
    fact: "The same LoRA paper: rank is tiny compared with the full matrix, so fine-tunes stay small enough to swap per task.",
  }],
  dpo: [{
    label: "Rafailov et al., Direct Preference Optimization (2023)",
    url: "https://arxiv.org/abs/2305.18290",
    fact: "DPO (2023) skips training a separate reward model. It fits the policy directly to preferred versus rejected answers.",
  }],
  clip: [{
    label: "Radford et al., CLIP (2021)",
    url: "https://arxiv.org/abs/2103.00020",
    fact: "OpenAI's CLIP (2021) trained image and text encoders together on 400 million pairs so captions and pictures share a vector space.",
  }],
  vit: [{
    label: "Dosovitskiy et al., An Image is Worth 16x16 Words (2021)",
    url: "https://arxiv.org/abs/2010.11929",
    fact: "Google's ViT paper splits an image into patches and runs a Transformer on them. At scale it matched CNNs.",
  }],
  'vision-transformers-vit': [{
    label: "Dosovitskiy et al., ViT (2021)",
    url: "https://arxiv.org/abs/2010.11929",
    fact: "ViT treats image patches like tokens. That is why the same attention stack can do vision and language.",
  }],
  sam: [{
    label: "Kirillov et al., Segment Anything (2023)",
    url: "https://arxiv.org/abs/2304.02643",
    fact: "Meta's Segment Anything Model (2023) was trained to mask objects from a click, box, or text prompt.",
  }],
  bert: [{
    label: "Devlin et al., BERT (2019)",
    url: "https://arxiv.org/abs/1810.04805",
    fact: "Google's BERT (2019) filled in masked words using both left and right context. Search and classification still use BERT-style encoders.",
  }],
  gan: [{
    label: "Goodfellow et al., Generative Adversarial Nets (2014)",
    url: "https://arxiv.org/abs/1406.2661",
    fact: "Ian Goodfellow's 2014 GAN paper: a generator fakes samples, a discriminator tries to spot fakes, and both improve.",
  }],
  'diffusion-model': [{
    label: "Ho et al., Denoising Diffusion Probabilistic Models (2020)",
    url: "https://arxiv.org/abs/2006.11239",
    fact: "DDPM (2020) is the usual citation for the noise-then-denoise image models behind Stable Diffusion and DALL-E 2.",
  }],
  vae: [{
    label: "Kingma and Welling, Auto-Encoding Variational Bayes (2014)",
    url: "https://arxiv.org/abs/1312.6114",
    fact: "The 2014 VAE paper maps inputs to a smooth latent distribution so you can sample new examples from that space.",
  }],
  lstm: [{
    label: "Hochreiter and Schmidhuber, Long Short-Term Memory (1997)",
    url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    fact: "LSTMs were published in 1997 to carry information across long sequences. Transformers later replaced them for most language work.",
  }],
  cnn: [{
    label: "LeCun et al., Gradient-Based Learning Applied to Document Recognition (1998)",
    url: "http://yann.lecun.com/exdb/publis/pdf/lecun-98.pdf",
    fact: "Yann LeCun's LeNet showed convolutional nets on handwritten digits. AlexNet (2012) then won ImageNet and restarted the deep-learning boom.",
  }],
  'scaling-law': [{
    label: "Kaplan et al., Scaling Laws for Neural Language Models (2020)",
    url: "https://arxiv.org/abs/2001.08361",
    fact: "OpenAI's 2020 scaling-laws paper found smooth power laws: more data, more parameters, more compute, lower loss, until you hit a bottleneck.",
  }],
  'speculative-decoding': [{
    label: "Leviathan et al., Fast Inference from Transformers via Speculative Decoding (2023)",
    url: "https://arxiv.org/abs/2211.17192",
    fact: "Google's speculative decoding (2023) lets a small model draft tokens and a large model accept or reject them in a batch, which speeds inference.",
  }],
  'kv-cache': [{
    label: "Pope et al., Efficiently Scaling Transformer Inference (2022)",
    url: "https://arxiv.org/abs/2211.05102",
    fact: "Inference servers keep key and value tensors from past tokens so they are not recomputed every step. That cache is often the memory bottleneck.",
  }],
  'instruction-tuning': [{
    label: "Wei et al., Finetuned Language Models Are Zero-Shot Learners (2022)",
    url: "https://arxiv.org/abs/2109.01652",
    fact: "Google's FLAN paper showed that fine-tuning on many instruction tasks makes a model better at new instructions it was not trained on.",
  }],
  scaffold: [{
    label: "Zhou et al., Least-to-Most Prompting (2023)",
    url: "https://arxiv.org/abs/2205.10625",
    fact: "Least-to-most prompting (Google, 2023) is a published scaffold: split a hard problem into easier subproblems, then solve them in order. The template is the scaffold. The model fills it.",
  }],
  'few-shot-prompting': [{
    label: "Brown et al., GPT-3 (2020)",
    url: "https://arxiv.org/abs/2005.14165",
    fact: "GPT-3's paper called this in-context learning: put a few input-output examples in the prompt and the model copies the pattern.",
  }],
  'federated-learning': [{
    label: "McMahan et al., Communication-Efficient Learning of Deep Networks from Decentralized Data (2017)",
    url: "https://arxiv.org/abs/1602.05629",
    fact: "Google's 2017 federated averaging paper trained a model across phones by shipping weight updates, not raw data.",
  }],
  'reinforcement-learning': [{
    label: "Sutton and Barto, Reinforcement Learning: An Introduction",
    url: "https://www.andrew.cmu.edu/course/10-703/textbook/BartoSutton.pdf",
    fact: "Sutton and Barto's textbook is the standard map: agent, environment, reward, policy. AlphaGo and RLHF both sit on that loop.",
  }],
  'deep-learning': [{
    label: "LeCun, Bengio, Hinton, Deep Learning (Nature, 2015)",
    url: "https://www.nature.com/articles/nature14539",
    fact: "The 2015 Nature review by LeCun, Bengio, and Hinton is the usual citation for stacked neural nets trained with backpropagation.",
  }],
  backpropagation: [{
    label: "Rumelhart, Hinton, Williams, Learning representations by back-propagating errors (1986)",
    url: "https://www.nature.com/articles/323533a0",
    fact: "The 1986 Nature paper showed how to push error backwards through a net so every weight can update. Training still uses that idea.",
  }],
  'gradient-descent': [{
    label: "Ruder, An overview of gradient descent optimization algorithms",
    url: "https://arxiv.org/abs/1609.04747",
    fact: "Gradient descent walks downhill on the loss. SGD, Adam, and AdamW are the usual variants in deep learning.",
  }],
  'foundation-model': [{
    label: "Bommasani et al., On the Opportunities and Risks of Foundation Models (2021)",
    url: "https://arxiv.org/abs/2108.07258",
    fact: "Stanford CRFM coined \"foundation model\" in 2021 for large models trained broadly and adapted to many tasks.",
  }],
  'generative-ai': [{
    label: "Goodfellow et al., Deep Learning, generative models chapter",
    url: "https://www.deeplearningbook.org/",
    fact: "Generative models learn to sample new text, images, or audio. GANs, VAEs, diffusion, and LLMs are all in that family.",
  }],
  'generative-model': [{
    label: "Kingma and Welling, VAE (2014)",
    url: "https://arxiv.org/abs/1312.6114",
    fact: "A generative model can draw new examples. VAEs, GANs, and diffusion models are three different ways to do that.",
  }],
  'transfer-learning': [{
    label: "Pan and Yang, A Survey on Transfer Learning (2010)",
    url: "https://ieeexplore.ieee.org/document/5288526",
    fact: "Transfer learning reuses a model trained on one task as the start of another. Fine-tuning an ImageNet net on medical photos is the classic case.",
  }],
  overfitting: [{
    label: "Goodfellow et al., Deep Learning",
    url: "https://www.deeplearningbook.org/contents/regularization.html",
    fact: "Overfitting means train loss is low and test loss is high. Dropout, weight decay, and more data are the usual fixes.",
  }],
  generalization: [{
    label: "Goodfellow et al., Deep Learning",
    url: "https://www.deeplearningbook.org/contents/ml.html",
    fact: "Generalization is test performance on new samples from the same distribution. That is the actual goal of training.",
  }],
  'reward-model': [{
    label: "Ouyang et al., InstructGPT (2022)",
    url: "https://arxiv.org/abs/2203.02155",
    fact: "InstructGPT trains a reward model on human rankings, then uses PPO so the policy scores higher on that reward model.",
  }],
  'ai-safety': [{
    label: "Amodei et al., Concrete Problems in AI Safety (2016)",
    url: "https://arxiv.org/abs/1606.06565",
    fact: "The 2016 \"Concrete Problems\" paper listed reward hacking, safe exploration, and distributional shift. Those problems are still open.",
  }],
  'artificial-superintelligence-asi': [{
    label: "Bostrom, Superintelligence (2014)",
    url: "https://global.oup.com/academic/product/superintelligence-9780199678112",
    fact: "Nick Bostrom's 2014 book is the usual citation for intelligence that exceeds humans across the board. It is a hypothesis, not a deployed system.",
  }],
  'ai-alignment': [{
    label: "Christiano, Deep RL from Human Preferences (2017)",
    url: "https://arxiv.org/abs/1706.03741",
    fact: "Preference learning is the practical alignment method labs ship today. The deeper \"whose values\" problem is not solved by RLHF.",
  }],
  'explainable-ai-xai': [{
    label: "DARPA, Explainable Artificial Intelligence",
    url: "https://www.darpa.mil/program/explainable-artificial-intelligence",
    fact: "DARPA's XAI program pushed methods that show why a model fired. Attention maps and feature attributions are the common tools.",
  }],
  'algorithmic-bias': [{
    label: "Buolamwini and Gebru, Gender Shades (2018)",
    url: "https://proceedings.mlr.press/v81/buolamwini18a.html",
    fact: "Gender Shades (2018) showed commercial face systems failing more on darker-skinned women. Bias is measurable, not just a slogan.",
  }],
  'multi-agent-systems': [{
    label: "Wooldridge, An Introduction to MultiAgent Systems",
    url: "https://www.cs.ox.ac.uk/people/michael.wooldridge/pubs/imas/IMAS2e.html",
    fact: "Multi-agent systems are older than LLMs. The field studies agents that cooperate or compete in a shared environment.",
  }],
  'agentic-loop': [{
    label: "Yao et al., ReAct (2022)",
    url: "https://arxiv.org/abs/2210.03629",
    fact: "ReAct (2022) interleaves reasoning traces with tool actions. That observe-think-act loop is what people now call an agentic loop.",
  }],
  'agentic-workflow': [{
    label: "Yao et al., ReAct (2022)",
    url: "https://arxiv.org/abs/2210.03629",
    fact: "An agentic workflow is that loop plus your tools and stop rules. LangGraph, Temporal, and similar systems schedule those steps.",
  }],
  'synthetic-data': [{
    label: "NVIDIA, What is synthetic data?",
    url: "https://www.nvidia.com/en-us/glossary/synthetic-data/",
    fact: "NVIDIA and others generate fake-but-useful training data when real labels are scarce or private. Quality still has to be checked against real holds.",
  }],
  rollup: [{
    label: "Ethereum, Scaling",
    url: "https://ethereum.org/en/developers/docs/scaling/",
    fact: "A rollup executes off-chain and posts data or proofs to Ethereum. Optimistic and ZK are the two main designs.",
  }],
  'optimistic-rollup': [{
    label: "Ethereum, Optimistic rollups",
    url: "https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/",
    fact: "Optimism and Arbitrum assume batches are valid, then allow a challenge window. Withdrawals wait out that window unless a fast bridge is used.",
  }],
  'zk-rollup': [{
    label: "Ethereum, Zero-knowledge rollups",
    url: "https://ethereum.org/en/developers/docs/scaling/zk-rollups/",
    fact: "A ZK-rollup posts a validity proof with the batch. Ethereum checks the proof. It does not re-run every transaction.",
  }],
  zkevm: [{
    label: "Polygon, zkEVM",
    url: "https://docs.polygon.technology/zkEVM/",
    fact: "A zkEVM aims to prove Ethereum-style bytecode. Polygon, Scroll, and Linea ship variants with different compatibility tradeoffs.",
  }],
  'data-availability': [{
    label: "Ethereum, Data availability",
    url: "https://ethereum.org/en/developers/docs/data-availability/",
    fact: "If rollup data cannot be downloaded, users cannot reconstruct state. EIP-4844 blobs made that data cheaper on Ethereum.",
  }],
  sequencer: [{
    label: "Ethereum, Optimistic rollups",
    url: "https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/",
    fact: "Most rollups still use one sequencer to order transactions. That is fast. It is also a censorship and downtime point until sequencing is shared.",
  }],
  'account-abstraction': [{
    label: "Ethereum, ERC-4337",
    url: "https://www.erc4337.io/",
    fact: "ERC-4337 lets a contract wallet pay gas, use passkeys, and set spend rules without changing Ethereum's base protocol.",
  }],
  'social-recovery': [{
    label: "Vitalik Buterin, Why we need wide adoption of social recovery wallets",
    url: "https://vitalik.eth.limo/general/2021/01/11/recovery.html",
    fact: "Vitalik's 2021 note: guardians help recover a wallet if you lose the device, without giving any one guardian full control.",
  }],
  'ethereum-virtual-machine': [{
    label: "Ethereum, Ethereum Virtual Machine (EVM)",
    url: "https://ethereum.org/en/developers/docs/evm/",
    fact: "The EVM is the shared computer. Solidity compiles to EVM bytecode. Every full node runs the same opcodes.",
  }],
  'real-world-assets': [{
    label: "BlackRock, BUIDL",
    url: "https://www.blackrock.com/corporate/newsroom/press-releases/article/corporate-one/press-releases/blackrock-launches-first-tokenized-fund-buidl",
    fact: "BlackRock's BUIDL fund (2024) is a tokenized Treasury product. That is RWA: a legal off-chain asset with an on-chain receipt.",
  }],
  'decentralized-identity': [{
    label: "W3C, Decentralized Identifiers (DIDs) v1.0",
    url: "https://www.w3.org/TR/did-1.0/",
    fact: "W3C standardized DIDs so an identifier can be resolved without one company's login database.",
  }],
  'self-sovereign-identity': [{
    label: "W3C, Verifiable Credentials",
    url: "https://www.w3.org/TR/vc-data-model-2.0/",
    fact: "Verifiable credentials let an issuer sign a claim (age, degree) that you present without handing over the whole file.",
  }],
  'soulbound-token': [{
    label: "Weyl, Ohlhaver, Buterin, Decentralized Society: Finding Web3's Soul (2022)",
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763",
    fact: "The 2022 \"Soulbound\" paper proposed non-transferable tokens for reputation. If they can be sold, they stop being a reputation signal.",
  }],
  'public-key-cryptography': [{
    label: "Diffie and Hellman, New Directions in Cryptography (1976)",
    url: "https://ee.stanford.edu/~hellman/publications/24.pdf",
    fact: "Diffie-Hellman (1976) showed two parties can agree a secret on an open channel. Bitcoin and TLS still use public-key math.",
  }],
  'cryptographic-hash-function': [{
    label: "NIST, SHA-256",
    url: "https://csrc.nist.gov/publications/detail/fips/180/4/final",
    fact: "SHA-256 is specified in FIPS 180-4. Bitcoin hashes with SHA-256. Ethereum mostly uses Keccak-256.",
  }],
  'proof-of-history-poh': [{
    label: "Yakovenko, Solana: A new architecture for a high performance blockchain",
    url: "https://solana.com/solana-whitepaper.pdf",
    fact: "Solana's whitepaper describes Proof of History as a verifiable delay so nodes agree on time without waiting on a clock message.",
  }],
  'peer-to-peer-p2p': [{
    label: "Nakamoto, Bitcoin paper",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "Bitcoin's subtitle is \"A Peer-to-Peer Electronic Cash System.\" Nodes talk to nodes. There is no company in the middle of settlement.",
  }],
  'double-spend': [{
    label: "Nakamoto, Bitcoin paper",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "The Bitcoin paper's core problem is double-spending. The chain plus proof of work is the proposed fix.",
  }],
  'double-spending': [{
    label: "Nakamoto, Bitcoin paper",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "If two spends of the same coin can both look valid, digital cash fails. Consensus picks one history.",
  }],
  '51-percent-attack': [{
    label: "Nakamoto, Bitcoin paper",
    url: "https://bitcoin.org/bitcoin.pdf",
    fact: "Nakamoto argued that an attacker with a majority of hash power can rewrite recent blocks. Several smaller proof-of-work coins have been 51% attacked in practice.",
  }],
  'sybil-attack': [{
    label: "Douceur, The Sybil Attack (2002)",
    url: "https://www.microsoft.com/en-us/research/publication/the-sybil-attack/",
    fact: "John Douceur named Sybil attacks in 2002: one operator pretends to be many peers. Proof of work and proof of stake make extra identities expensive.",
  }],
  'genesis-block': [{
    label: "Bitcoin genesis block",
    url: "https://www.blockchain.com/explorer/blocks/btc/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f",
    fact: "Bitcoin's genesis block was mined on 3 January 2009. It embeds the Times headline about bank bailouts.",
  }],
  'hard-fork': [{
    label: "Ethereum, History and forks",
    url: "https://ethereum.org/en/history/",
    fact: "A hard fork is a rule change that old software rejects. Ethereum's 2016 DAO fork split ETH and ETC.",
  }],
  'soft-fork': [{
    label: "Bitcoin, Soft fork",
    url: "https://developer.bitcoin.org/devguide/versions.html",
    fact: "A soft fork tightens rules so old nodes still see new blocks as valid. SegWit on Bitcoin was a soft fork.",
  }],
  'rug-pull': [{
    label: "FBI, Cryptocurrency Investment Scams",
    url: "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/common-scams-and-crimes/cryptocurrency-investment-scams",
    fact: "The FBI warns that anonymous teams, locked liquidity you cannot verify, and guaranteed returns are common rug-pull marks.",
  }],
  slippage: [{
    label: "Uniswap, Slippage",
    url: "https://docs.uniswap.org/concepts/protocol/swaps",
    fact: "On an AMM, a larger swap moves the price more. The slippage setting is how far you allow that move before the transaction reverts.",
  }],
  tvl: [{
    label: "DefiLlama, TVL",
    url: "https://defillama.com/docs/api",
    fact: "DefiLlama popularized TVL: the dollar value of assets sitting in a protocol. It is not the same as revenue or user profit.",
  }],
  'protocol-revenue': [{
    label: "Token Terminal, Metrics",
    url: "https://tokenterminal.com/",
    fact: "Token Terminal tracks fees a protocol keeps. That is closer to a business than TVL, which can be mercenary deposits.",
  }],
  'perpetual-futures': [{
    label: "BitMEX, Perpetual Contracts",
    url: "https://www.bitmex.com/app/perpetualContractsGuide",
    fact: "BitMEX launched crypto perpetual swaps in 2016. There is no expiry. A funding rate tethers the contract to the spot price.",
  }],
  'funding-rate': [{
    label: "Binance, Introduction to Binance Futures Funding Rates",
    url: "https://www.binance.com/en/support/faq/where-can-i-find-the-funding-rate-history-360033525031",
    fact: "If the perpetual trades above spot, longs pay shorts. That payment is the funding rate. It is how the contract stays near the index.",
  }],
  uniswap: [{
    label: "Uniswap v2 Core",
    url: "https://uniswap.org/whitepaper.pdf",
    fact: "Uniswap v2's whitepaper is the usual AMM citation. Constant product. Anyone can create a pair.",
  }],
  'order-book': [{
    label: "SEC, Limit Order Display",
    url: "https://www.sec.gov/investor/pubs/tradexec.htm",
    fact: "An order book lists bids and asks. Matching engines at Nasdaq or Binance pair them. AMMs replaced that list with a pool.",
  }],
  'limit-order': [{
    label: "Investor.gov, Limit Orders",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/limit-order",
    fact: "A limit order sets the worst price you will take. It may not fill. A market order fills at whatever is there.",
  }],
  'market-order': [{
    label: "Investor.gov, Market Order",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/market-order",
    fact: "A market order says fill now. In thin books the fill can be far from the last print.",
  }],
  'market-cap': [{
    label: "CoinMarketCap, Market capitalization",
    url: "https://coinmarketcap.com/alexandria/glossary/market-capitalization",
    fact: "Market cap is price times circulating supply. Fully diluted cap uses the max supply, including tokens not released yet.",
  }],
  'circulating-supply': [{
    label: "CoinMarketCap, Circulating supply",
    url: "https://coinmarketcap.com/alexandria/glossary/circulating-supply",
    fact: "Circulating supply counts coins that can trade. Locked team tokens are usually excluded until they unlock.",
  }],
  quantum: [{
    label: "IBM, What is quantum computing?",
    url: "https://www.ibm.com/topics/quantum-computing",
    fact: "IBM's explainer: qubits can be in superposition. Today's machines are noisy. Useful chemistry and crypto-breaking are still research.",
  }],
  'quantum-computing': [{
    label: "IBM, What is quantum computing?",
    url: "https://www.ibm.com/topics/quantum-computing",
    fact: "IBM and Google publish machine stats in qubits and error rates. Shor's algorithm is why NIST is standardizing post-quantum crypto now.",
  }],
  'internet-of-things-iot': [{
    label: "ITU, Internet of Things",
    url: "https://www.itu.int/en/ITU-T/ssc/Pages/iot.aspx",
    fact: "IoT means sensors and actuators on a network: meters, cameras, factory PLCs. Security and updates are the hard part, not the radio.",
  }],
  'digital-twin': [{
    label: "IBM, What is a digital twin?",
    url: "https://www.ibm.com/topics/digital-twin",
    fact: "A digital twin is a live model of a physical asset fed by sensors. GE and Siemens sell this for turbines and plants.",
  }],
  'spatial-computing': [{
    label: "Apple, visionOS",
    url: "https://developer.apple.com/visionos/",
    fact: "Apple uses \"spatial computing\" for Vision Pro: apps sit in the room, not on a 2D screen. Microsoft HoloLens used the same idea earlier.",
  }],
  web2: [{
    label: "O'Reilly, What Is Web 2.0 (2005)",
    url: "https://www.oreilly.com/pub/a/web2/archive/what-is-web-20.html",
    fact: "Tim O'Reilly's 2005 essay named Web 2.0: platforms, user content, and central companies. Web3 is a reaction to that stack.",
  }],
  'edge-computing': [{
    label: "Linux Foundation, Edge computing",
    url: "https://www.lfedge.org/",
    fact: "Edge computing puts compute near the user or the machine: a CDN node, a factory box, a phone. The point is latency and bandwidth.",
  }],
  'edge-ai': [{
    label: "Qualcomm, On-device AI",
    url: "https://www.qualcomm.com/products/mobile/snapdragon/smartphones/on-device-ai",
    fact: "Phone NPUs (Apple, Qualcomm, Google) run models locally. That is edge AI: no round trip for every frame or keystroke.",
  }],
  microservices: [{
    label: "Fowler, Microservices",
    url: "https://martinfowler.com/articles/microservices.html",
    fact: "Martin Fowler's 2014 note is the usual definition: small services, independent deploy, talking over the network. The cost is operations.",
  }],
  monorepo: [{
    label: "Google, Why Google stores billions of lines of code in a single repository",
    url: "https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext",
    fact: "Google's 2016 CACM paper describes a company-wide monorepo. Many startups copy the idea with Nx, Bazel, or Turborepo at much smaller scale.",
  }],
  'rate-limiting': [{
    label: "IETF, RateLimit header fields",
    url: "https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers",
    fact: "APIs cap requests per key or IP so one client cannot knock the service over. HTTP 429 means you hit the cap.",
  }],
  'message-queue': [{
    label: "RabbitMQ, AMQP",
    url: "https://www.rabbitmq.com/tutorials/amqp-concepts.html",
    fact: "A queue holds messages until a worker is free. RabbitMQ, SQS, and Kafka (a log) are the common tools.",
  }],
  idempotency: [{
    label: "Stripe, Idempotent requests",
    url: "https://docs.stripe.com/api/idempotent_requests",
    fact: "Stripe asks you to send an Idempotency-Key so a retried payment does not charge twice. That is the definition in production.",
  }],
  'circuit-breaker': [{
    label: "Fowler, CircuitBreaker",
    url: "https://martinfowler.com/bliki/CircuitBreaker.html",
    fact: "Michael Fowler's circuit breaker: after enough failures, stop calling the dependency for a while so the rest of the system can survive.",
  }],
  'database-index': [{
    label: "PostgreSQL, Indexes",
    url: "https://www.postgresql.org/docs/current/indexes.html",
    fact: "Postgres B-tree indexes are the default. They speed lookups and slow writes. You pay storage for that speed.",
  }],
  'caching-strategy': [{
    label: "AWS, Caching best practices",
    url: "https://aws.amazon.com/caching/best-practices/",
    fact: "Cache-aside, write-through, and TTL eviction are the usual patterns. Redis and Memcached are the usual stores.",
  }],
  'consistency-hashing': [{
    label: "Karger et al., Consistent Hashing and Random Trees (1997)",
    url: "https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/karger97consistent.pdf",
    fact: "Consistent hashing (1997) is how Dynamo, Cassandra, and many caches add a node without reshuffling every key.",
  }],
  containerization: [{
    label: "Docker, Overview",
    url: "https://docs.docker.com/get-started/overview/",
    fact: "Containers share the host kernel and isolate the process. That is lighter than a VM and is what Kubernetes schedules.",
  }],
  'supervised-learning': [{
    label: "Russell and Norvig, AIMA",
    url: "https://aima.cs.berkeley.edu/",
    fact: "Supervised learning is training on labeled pairs. Spam filters and ImageNet classifiers are the textbook examples.",
  }],
  'semi-supervised-learning': [{
    label: "van Engelen and Hoos, A survey on semi-supervised learning (2020)",
    url: "https://link.springer.com/article/10.1007/s10994-019-05855-6",
    fact: "Semi-supervised methods use a few labels plus many unlabeled examples. That is how teams cope when labeling is expensive.",
  }],
  'neural-network': [{
    label: "LeCun, Bengio, Hinton, Deep Learning (2015)",
    url: "https://www.nature.com/articles/nature14539",
    fact: "A neural net is stacked linear maps and nonlinearities trained by gradient descent. \"Deep\" means many of those layers.",
  }],
  rnn: [{
    label: "Hochreiter and Schmidhuber, LSTM (1997)",
    url: "https://www.bioinf.jku.at/publications/older/2604.pdf",
    fact: "Plain RNNs forget long-range context. LSTMs and later Transformers were built to fix that.",
  }],
  autoencoder: [{
    label: "Hinton and Salakhutdinov, Reducing the Dimensionality of Data with Neural Networks (2006)",
    url: "https://www.science.org/doi/10.1126/science.1127647",
    fact: "An autoencoder compresses then reconstructs. Hinton's 2006 Science paper used this to pretrain deep nets.",
  }],
  'computer-vision': [{
    label: "Krizhevsky, Sutskever, Hinton, ImageNet Classification with Deep Convolutional Neural Networks (2012)",
    url: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf",
    fact: "AlexNet (2012) cut ImageNet error enough that almost all production vision stacks became convolutional, then later Transformers.",
  }],
  'object-detection': [{
    label: "Redmon et al., You Only Look Once (2016)",
    url: "https://arxiv.org/abs/1506.02640",
    fact: "YOLO (2016) framed detection as one pass over the image. Boxes and class scores come out together.",
  }],
  'image-segmentation': [{
    label: "Ronneberger et al., U-Net (2015)",
    url: "https://arxiv.org/abs/1505.04597",
    fact: "U-Net (2015) is still the default for medical pixel labels. SAM (2023) made promptable masks mainstream.",
  }],
  ocr: [{
    label: "Smith, An Overview of the Tesseract OCR Engine",
    url: "https://github.com/tesseract-ocr/docs/blob/main/tesseracticdar2007.pdf",
    fact: "Tesseract is the long-running open OCR engine. Modern cloud OCR adds layout and handwriting on top of that job: pixels to text.",
  }],
  'speech-recognition': [{
    label: "Hannun et al., Deep Speech (2014)",
    url: "https://arxiv.org/abs/1412.5567",
    fact: "Deep Speech (2014) showed end-to-end speech-to-text with neural nets. Whisper (2022) later made multilingual ASR widely available.",
  }],
  tts: [{
    label: "Wang et al., Tacotron (2017)",
    url: "https://arxiv.org/abs/1703.10135",
    fact: "Tacotron (2017) mapped text to spectrograms with a sequence model. Today's voice APIs still do text in, audio out.",
  }],
  'machine-translation': [{
    label: "Vaswani et al. (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "The Transformer was built for translation. Google Translate and DeepL now run on that family of models.",
  }],
  'support-vector-machine-svm': [{
    label: "Cortes and Vapnik, Support-Vector Networks (1995)",
    url: "https://link.springer.com/article/10.1007/BF00994018",
    fact: "SVMs (1995) find a maximum-margin split. They dominated many tabular and text tasks before deep nets scaled.",
  }],
  'random-forest': [{
    label: "Breiman, Random Forests (2001)",
    url: "https://link.springer.com/article/10.1023/A:1010933404324",
    fact: "Leo Breiman's 2001 paper: many decision trees, random features, vote. Still strong on tabular data.",
  }],
  hyperparameter: [{
    label: "Bergstra and Bengio, Random Search for Hyper-Parameter Optimization (2012)",
    url: "https://www.jmlr.org/papers/v13/bergstra12a.html",
    fact: "Learning rate, batch size, and depth are hyperparameters. You pick them. The model does not learn them as weights.",
  }],
  'hyperparameter-tuning': [{
    label: "Akiba et al., Optuna (2019)",
    url: "https://arxiv.org/abs/1907.10902",
    fact: "Tools such as Optuna and Vizier search hyperparameter space so you are not guessing the learning rate by hand.",
  }],
  'prefix-tuning': [{
    label: "Li and Liang, Prefix-Tuning (2021)",
    url: "https://arxiv.org/abs/2101.00190",
    fact: "Prefix-tuning (2021) keeps the model frozen and learns a small prefix of virtual tokens per task.",
  }],
  'prompt-tuning': [{
    label: "Lester et al., The Power of Scale for Parameter-Efficient Prompt Tuning (2021)",
    url: "https://arxiv.org/abs/2104.08691",
    fact: "Prompt tuning learns soft prompt vectors. At large scale it can match full fine-tuning with far fewer trained parameters.",
  }],
  adapter: [{
    label: "Houlsby et al., Parameter-Efficient Transfer Learning for NLP (2019)",
    url: "https://arxiv.org/abs/1902.00751",
    fact: "Adapters (2019) insert small bottleneck modules into a frozen Transformer so each task has its own tiny add-on.",
  }],
  'contrastive-learning': [{
    label: "Chen et al., SimCLR (2020)",
    url: "https://arxiv.org/abs/2002.05709",
    fact: "SimCLR (2020) pulls two augmented views of the same image together and pushes other images apart. CLIP uses the same idea across image and text.",
  }],
  'causal-masking': [{
    label: "Radford et al., Improving Language Understanding by Generative Pre-Training (GPT-1)",
    url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf",
    fact: "GPT-style models mask future tokens so position i cannot see i+1. That is teacher-forced next-token training.",
  }],
  logit: [{
    label: "Goodfellow et al., Deep Learning",
    url: "https://www.deeplearningbook.org/",
    fact: "Logits are raw scores before softmax. Temperature and top-p sampling both act on those scores.",
  }],
  vocabulary: [{
    label: "Sennrich et al., BPE (2016)",
    url: "https://arxiv.org/abs/1508.07909",
    fact: "The vocabulary is the finite set of tokens the model knows. If a string is not in that set, the tokenizer splits it into pieces that are.",
  }],
  chunking: [{
    label: "Lewis et al., RAG (2020)",
    url: "https://arxiv.org/abs/2005.11401",
    fact: "RAG systems split documents into chunks before embedding. Chunk size is a retrieval hyperparameter: too big and the hit is noisy, too small and context dies.",
  }],
  'document-retrieval': [{
    label: "Manning, Raghavan, Schütze, Introduction to Information Retrieval",
    url: "https://nlp.stanford.edu/IR-book/",
    fact: "Classic IR ranks documents for a query. Vector search is the same job with embeddings instead of only keyword indexes.",
  }],
  're-ranking': [{
    label: "Nogueira and Cho, Passage Re-ranking with BERT (2019)",
    url: "https://arxiv.org/abs/1901.04085",
    fact: "A cheap retriever fetches 100 hits. A slower model re-ranks them. That two-stage setup is standard in search and RAG.",
  }],
  'semantic-similarity': [{
    label: "Reimers and Gurevych, Sentence-BERT (2019)",
    url: "https://arxiv.org/abs/1908.10084",
    fact: "Sentence-BERT (2019) made sentence embeddings practical so cosine similarity can score paraphrase and retrieval.",
  }],
  ner: [{
    label: "Tjong Kim Sang and De Meulder, CoNLL-2003 NER",
    url: "https://aclanthology.org/W03-0419/",
    fact: "Named entity recognition tags people, places, and organizations. CoNLL-2003 is the long-running benchmark.",
  }],
  'sentiment-analysis': [{
    label: "Socher et al., Recursive Deep Models for Semantic Compositionality (SST)",
    url: "https://aclanthology.org/D13-1170/",
    fact: "Sentiment models score whether text is positive or negative. The Stanford Sentiment Treebank is a standard dataset.",
  }],
  'question-answering': [{
    label: "Rajpurkar et al., SQuAD (2016)",
    url: "https://arxiv.org/abs/1606.05250",
    fact: "SQuAD (2016) asked models to span-extract answers from Wikipedia paragraphs. RAG later added retrieval in front of generation.",
  }],
  'knowledge-graph': [{
    label: "Google, Introducing the Knowledge Graph (2012)",
    url: "https://blog.google/products/search/introducing-knowledge-graph-things-not/",
    fact: "Google's 2012 Knowledge Graph post: search entities and relations, not only strings. Wikidata is the public cousin.",
  }],
  'feature-extraction': [{
    label: "Krizhevsky et al., AlexNet (2012)",
    url: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf",
    fact: "Early layers of a trained net become feature extractors. People freeze them and train a small head on a new task.",
  }],
  'pattern-recognition': [{
    label: "Bishop, Pattern Recognition and Machine Learning",
    url: "https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/",
    fact: "Bishop's textbook is the standard map of classifiers, density models, and the math behind \"the machine found a pattern.\"",
  }],
  'cluster-analysis': [{
    label: "MacQueen, Some methods for classification and analysis of multivariate observations (k-means)",
    url: "https://projecteuclid.org/ebooks/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and/chapter/Some-methods-for-classification-and-analysis-of-multivariate-observations/bsmsp/1200512992",
    fact: "k-means (1967) is still the first clustering method people run: pick k centers, assign points, move centers, repeat.",
  }],
  'predictive-analytics': [{
    label: "CRISP-DM 1.0",
    url: "https://www.the-modeling-agency.com/crisp-dm.pdf",
    fact: "Industry predictive work still follows CRISP-DM: understand the job, prepare data, model, evaluate, deploy. The algorithm is one step.",
  }],
  'expert-systems': [{
    label: "Shortliffe, MYCIN",
    url: "https://profiles.nlm.nih.gov/spotlight/qq/feature/mycin",
    fact: "MYCIN (1970s) was a medical expert system of hand-written rules. Deep learning later replaced most of that style, but the goal (encode specialist knowledge) is the same.",
  }],
  'feedforward-network': [{
    label: "Vaswani et al. (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "Each Transformer block has a position-wise feedforward net after attention. Two linear layers with a nonlinearity in between.",
  }],
  'attention-score': [{
    label: "Vaswani et al. (2017)",
    url: "https://arxiv.org/abs/1706.03762",
    fact: "Scores are Query dot Key, scaled, then softmax. The paper's formula is still what GPT-style models compute.",
  }],
  perplexity: [{
    label: "Jurafsky and Martin, Speech and Language Processing",
    url: "https://web.stanford.edu/~jurafsky/slp3/3.pdf",
    fact: "Jurafsky and Martin's textbook defines perplexity as exp(cross-entropy). Lower means the model is less surprised by the text. It is not a truth score.",
  }],
  'perplexity-trap': [{
    label: "Holtzman et al., Neural Text Degeneration (2020)",
    url: "https://arxiv.org/abs/1904.09751",
    fact: "Low perplexity can still mean dull, repetitive text. That paper is why people sample instead of always taking the argmax token.",
  }],
  latency: [{
    label: "Google, RAIL model",
    url: "https://web.dev/articles/rail",
    fact: "web.dev's RAIL guidance: users feel delays above about 100 ms. For LLMs, time-to-first-token and tokens per second are the two latency numbers that matter.",
  }],
  throughput: [{
    label: "NVIDIA, Inference performance",
    url: "https://docs.nvidia.com/deeplearning/performance/index.html",
    fact: "Throughput is tokens or requests per second. Batching raises throughput and usually raises latency for a single user.",
  }],
  'slashing': [{
    label: "Ethereum, Proof-of-stake",
    url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
    fact: "Ethereum slashes validators who double-sign or surround-vote. A portion of stake is destroyed. That is the penalty that makes proof of stake costly to cheat.",
  }],
  yield: [{
    label: "Aave, Markets",
    url: "https://aave.com/",
    fact: "On Aave, suppliers earn a variable APY paid by borrowers. That rate moves with utilization. It is not a guaranteed bank coupon.",
  }],
  'apy-vs-apr': [{
    label: "Investor.gov, Compound interest",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest",
    fact: "APR ignores compounding. APY includes it. DeFi UIs often show APY. Compare the same basis or the number lies.",
  }],
  'impermanent-loss': [{
    label: "Uniswap, Impermanent loss",
    url: "https://docs.uniswap.org/concepts/protocol/fees",
    fact: "If prices diverge, an AMM LP can hold less value than if they had just kept the tokens. Fees may or may not cover that gap.",
  }],
  composability: [{
    label: "Ethereum, Introduction to dapps",
    url: "https://ethereum.org/en/developers/docs/dapps/",
    fact: "Public contract APIs mean Aave can take Uniswap LP tokens as collateral. That stacking is composability. It also stacks risk.",
  }],
  'cross-chain-bridge': [{
    label: "Ethereum, Bridges",
    url: "https://ethereum.org/en/bridges/",
    fact: "Most bridge hacks steal the locked inventory on the source chain. Treat large bridges as high-value targets, not as pipes.",
  }],
  'state-channel': [{
    label: "Lightning Network, Overview",
    url: "https://docs.lightning.engineering/",
    fact: "Lightning is Bitcoin's main state-channel network: two parties update a balance off-chain and only settle on-chain when they close.",
  }],
  'payment-channel': [{
    label: "Lightning Network, Overview",
    url: "https://docs.lightning.engineering/",
    fact: "A payment channel is a two-party ledger you can update cheaply. Lightning routes across many of those channels.",
  }],
  'atomic-swap': [{
    label: "Nolan, Atomic swaps (Bitcoin talk, 2013) / HTLCs",
    url: "https://en.bitcoin.it/wiki/Atomic_swap",
    fact: "Hash timelock contracts let two chains swap without a custodian. If one side does not reveal the secret, funds return after a timeout.",
  }],
  'dust-attack': [{
    label: "Bitcoin wiki, Privacy",
    url: "https://en.bitcoin.it/wiki/Privacy",
    fact: "Tiny \"dust\" outputs can mark your addresses so an observer links them later. Many wallets refuse dust or isolate it.",
  }],
  leverage: [{
    label: "CFTC, Leverage",
    url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/futuresshort.html",
    fact: "10x leverage means a 10% move against you can wipe the position. Crypto perps make that number a UI setting.",
  }],
  margin: [{
    label: "Investor.gov, Margin",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/margin",
    fact: "Margin is collateral. Maintenance margin is the floor. Drop below it and the venue liquidates.",
  }],
  liquidation: [{
    label: "Aave, Liquidations",
    url: "https://aave.com/docs/concepts/liquidations",
    fact: "Aave liquidates when health factor drops under 1. A third party repays part of the debt and takes collateral plus a bonus.",
  }],
  'borrow-rate': [{
    label: "Aave, Interest rates",
    url: "https://aave.com/docs/concepts/interest-and-yield",
    fact: "Aave's borrow rate rises with utilization. More of the pool borrowed, higher the rate. That is the control loop.",
  }],
  'supply-rate': [{
    label: "Aave, Interest rates",
    url: "https://aave.com/docs/concepts/interest-and-yield",
    fact: "Suppliers earn a share of what borrowers pay, minus a reserve. Utilization links the two rates.",
  }],
  'utilization-rate': [{
    label: "Aave, Interest rate model",
    url: "https://aave.com/docs/concepts/interest-and-yield",
    fact: "Utilization is borrowed divided by supplied. Too high and suppliers cannot withdraw. The kink in Aave's curve exists to stop that.",
  }],
  'collateralization-ratio': [{
    label: "MakerDAO, Vaults",
    url: "https://docs.makerdao.com/",
    fact: "Maker-style vaults need extra collateral above the debt. Drop under the ratio and the vault can be liquidated.",
  }],
  'delta-neutral': [{
    label: "CME, Delta",
    url: "https://www.cmegroup.com/education/courses/introduction-to-options/delta.html",
    fact: "Delta near zero means the book does not move 1:1 with the underlying. Crypto basis trades try to stay there: long spot, short perp, or the reverse.",
  }],
  'basis-trade': [{
    label: "CME, What is basis?",
    url: "https://www.cmegroup.com/education/courses/introduction-to-futures/basis.html",
    fact: "Basis is futures minus spot. A cash-and-carry trade holds the asset and shorts the future (or perp) to harvest that gap.",
  }],
  twap: [{
    label: "Uniswap, TWAP oracles",
    url: "https://docs.uniswap.org/concepts/protocol/oracle",
    fact: "Uniswap v2/v3 oracles accumulate price over time so a one-block spike is a bad input. Attackers still try to move TWAPs. Read the window.",
  }],
  'value-at-risk': [{
    label: "Jorion, Value at Risk",
    url: "https://www.jstor.org/stable/2329257",
    fact: "VaR is a loss quantile: with probability p, you do not lose more than X over a horizon. It is not the worst case. Tails still break it.",
  }],
  'liquidity-pool-volume': [{
    label: "DefiLlama, DEXs",
    url: "https://defillama.com/dexs",
    fact: "Volume is how much traded. TVL is how much sits in the pool. Fees are a cut of volume. All three numbers can tell different stories.",
  }],
  'liquidity-provider': [{
    label: "Uniswap, Liquidity provider",
    url: "https://docs.uniswap.org/concepts/protocol/fees",
    fact: "An LP deposits into a pool and earns a share of swap fees. Impermanent loss is the main hidden cost.",
  }],
  'token-burn': [{
    label: "Ethereum, EIP-1559",
    url: "https://eips.ethereum.org/EIPS/eip-1559",
    fact: "ETH base fees are burned. Some tokens send supply to a dead address. Burns only matter if issuance does not replace them.",
  }],
  'emission-rate': [{
    label: "Bitcoin, Controlled supply",
    url: "https://en.bitcoin.it/wiki/Controlled_supply",
    fact: "Bitcoin's issuance halves about every four years. That schedule is in the code. Most alt tokens publish a different curve. Read it.",
  }],
  'vesting-schedule': [{
    label: "SEC, Employee compensation / vesting (investor basics)",
    url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/vesting",
    fact: "Team tokens that unlock on a cliff can hit the market on one date. Always check the vesting table before you treat circulating supply as the whole story.",
  }],
  'modular-blockchain': [{
    label: "Celestia, What is a modular blockchain?",
    url: "https://docs.celestia.org/learn/how-celestia-works/modular-blockchains-stack",
    fact: "Celestia splits consensus and data availability from execution. Rollups then execute and post data to that layer.",
  }],
  intent: [{
    label: "UniswapX, Intents",
    url: "https://docs.uniswap.org/contracts/uniswapx/overview",
    fact: "UniswapX and similar systems let you sign what you want (\"receive at least Y\") and let fillers compete to satisfy it.",
  }],
  'intent-centric-architecture': [{
    label: "UniswapX overview",
    url: "https://docs.uniswap.org/contracts/uniswapx/overview",
    fact: "An intent is a signed outcome, not a path. Solvers pick the route. You do not have to pick the pool.",
  }],
  'parallelized-evm': [{
    label: "Sei, Parallelization",
    url: "https://www.sei.io/",
    fact: "Sei, Monad, and similar designs try to run non-overlapping EVM transactions at the same time. The hard part is detecting overlap correctly.",
  }],
  'decentralized-sequencer': [{
    label: "Espresso Systems, Shared sequencing",
    url: "https://docs.espressosys.com/",
    fact: "Shared sequencer designs exist so many rollups do not each depend on one company to order transactions.",
  }],
  'data-availability-sampling-das': [{
    label: "Ethereum, Danksharding",
    url: "https://ethereum.org/en/roadmap/danksharding/",
    fact: "DAS lets nodes check that blob data exists by sampling pieces, so not every node downloads every byte. That is the danksharding plan.",
  }],
  'decentralized-exchange-dex': [{
    label: "Uniswap, Concepts",
    url: "https://docs.uniswap.org/concepts/overview",
    fact: "A DEX is a venue whose custody is a contract. Uniswap is an AMM. dYdX is an order book. Neither holds your keys if you trade from a wallet.",
  }],
  'delegated-proof-of-stake-dpos': [{
    label: "EOS, Delegated Proof of Stake",
    url: "https://eos.io/",
    fact: "DPoS lets token holders elect a small set of block producers. EOS and Tron used this. Turnout and cartel risk are the usual criticisms.",
  }],
  'mining-pool': [{
    label: "Bitcoin wiki, Pooled mining",
    url: "https://en.bitcoin.it/wiki/Pooled_mining",
    fact: "Pools share block rewards by hashrate. That smooths income. It also concentrates who decides which transactions go in a block.",
  }],
  'cryptocurrency-wallet': [{
    label: "Ethereum, Wallets",
    url: "https://ethereum.org/en/wallets/",
    fact: "The wallet is software or hardware for keys. Coinbase can also be a custodial account. Those are different trust models.",
  }],
  'directed-acyclic-graph-dag': [{
    label: "IOTA, Tangle",
    url: "https://wiki.iota.org/learn/networks/tangle",
    fact: "Some ledgers (IOTA's Tangle, Kaspa) order messages in a DAG instead of a single chain so more blocks can confirm in parallel.",
  }],
};
