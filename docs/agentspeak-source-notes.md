# Sources and scope for agentspeak

## Editorial scope

The original essay, retained in commit `cf79b7befea2f5ca24733d88c073b7cbec8d5d5e`, concerned how agents communicate, the protocols they use, and the possible movement from human-language messages toward structured or learned representations. The author rejected the later booking-and-permissions framing because it changed that subject.

This revision restores the title *When Agents Stop Speaking English* and that original scope. It covers MCP, A2A, ACP, AGNTCY, AP2, x402, earlier agent languages, domain standards, communication cost, learned representations, and human readability. Permissions appear as one consequence of the communication design, not as the essay's main argument. The weather examples illustrate message structure; they are not observations of production traffic or a measured performance comparison.

The source review was completed on 17 October 2026. The original essay and both original diagrams were reread from Git before this correction was drafted.

## Source support

| Source | Use and boundary |
|---|---|
| [MCP tools, 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) | Tool definitions, calls, text and structured results, and optional output schemas. The weather values in the essay are fictional. |
| [JSON-RPC 2.0](https://www.jsonrpc.org/specification) | Request/response envelope, method, parameters, response IDs, and transport independence. |
| [A2A core concepts](https://a2a-protocol.org/latest/topics/key-concepts/) | Agent Cards, content parts, messages, and artifacts. Content is not restricted to English. |
| [A2A task lifecycle](https://a2a-protocol.org/latest/topics/life-of-a-task/) | Work tracked across updates, requests for input, and final states. |
| [A2A bindings](https://a2a-protocol.org/latest/topics/custom-protocol-bindings/) | Standard JSON-RPC, gRPC, and HTTP+JSON/REST bindings. Binding and content representation are distinct choices. |
| [ACP repository](https://github.com/i-am-bee/acp) | Archive date of August 27, 2025, notice that ACP joined A2A, and REST/OpenAPI design. |
| [AGNTCY documentation](https://docs.agntcy.org/) | Directory, OASF, identity, SLIM, and observation components. No claim that the project supplies one universal content language. |
| [AP2 v0.2](https://ap2-protocol.org/ap2/specification/) and [x402](https://docs.x402.org/introduction) | Different payment-related responsibilities. AP2 is not equated with HTTP 402. |
| [gRPC introduction](https://grpc.io/docs/what-is-grpc/introduction/) | Service definitions and Protocol Buffers as the default encoding, with support for other formats. Binary encoding can still carry language strings. |
| [OpenAI Structured Outputs](https://openai.com/index/introducing-structured-outputs-in-the-api/) | Schema-constrained output and the remaining possibility of wrong values. No current model-support or accuracy claim is imported. |
| [Finin et al., 1994, UMBC repository](https://doi.org/10.13016/m2bvis-7jvt) | Historical KQML message format, message-handling protocol, and named communication acts. The repository records the original ACM publication. |
| [JADE ACLMessage API](https://jade-project.gitlab.io/API/jade/lang/acl/ACLMessage.html) | A documented FIPA message implementation with performatives, language, ontology, and conversation fields. The original FIPA host returned an access block; the essay cites this accessible implementation documentation. |
| [FIX Protocol](https://fixtrading.org/standards/fix-protocol/) | Trading fields and workflows distinct from transport and encoding. No unverified order-message fragment is presented as a complete FIX request. |
| [ISO 20022 FAQ](https://www.iso20022.org/faq) | Financial data dictionary and business process catalogue, beyond message syntax alone. |
| [FHIR R5 narrative](https://www.hl7.org/fhir/narrative.html) | Coexistence of structured data and human-readable narrative in many resource types. |
| [JSON Schema object reference](https://json-schema.org/understanding-json-schema/reference/object) | Required properties, types, and allowed values. Validation does not establish the truth of field values. |
| [Embeddings documentation](https://platform.openai.com/docs/guides/embeddings) | Numerical representations used for relatedness and retrieval, not a universal agent language. |
| [HyLaT, May 2026](https://arxiv.org/html/2605.25421v1) | Methods and main results reviewed. The paper trains hybrid latent/text exchange, primarily with a shared Llama model; it also tests a heterogeneous pair with adapters. Findings are limited to the paper's settings. Generation counts are not equated with network bytes or commercial API charges. |
| [Morris et al., 2023](https://arxiv.org/abs/2310.06816) | Reported reconstruction of text from embeddings under tested conditions. Numerical representation is not treated as a privacy guarantee. |

## Evidence boundaries

The essay makes a reasoned argument about communication design and a qualified forecast about mixed representations. It does not measure how much production agent traffic uses English, JSON, or latent channels. Examples in protocol documentation are not used as adoption evidence. No fixed token saving, universal cross-model latent language, or prediction about what courts require is asserted.

The HyLaT discussion reports the authors' work, not an independent replication. The inspected methods and tables support its training requirements and scoped efficiency comparison, rather than a claim that latent exchange is always better.

## Verification

The revised essay has 3,580 words excluding code and figure attributes, thirteen sections, three tables, and three valid JSON examples. The example checks verify the MCP request/response identifiers, weather value and unit, and the A2A content parts. The writing audit found zero listed violations and no exact repeated prose sentences. The full production build and its TypeScript check passed. Browser checks at desktop and mobile widths passed for the restored title, metadata, canonical URL, rendered JSON, both diagrams, image zoom, and absence of page-level JavaScript errors or horizontal page overflow. All 400 available SVGs passed XML validation.
