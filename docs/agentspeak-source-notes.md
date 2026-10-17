# Sources and scope for the agentspeak revision

The revised essay uses a fictional booking example to argue for clear message meanings, explicit limits, and checkable results. It reports no benchmark of agent communication. Prices and identifiers in the examples are illustrative application fields, not observed transactions or official MCP/A2A schemas.

Sources checked on 17 October 2026.

## Claim support

| Source | Claim used in the essay |
|---|---|
| [JSON-RPC 2.0](https://www.jsonrpc.org/specification) | Request/response structure, transport independence, and request IDs used to match responses. Correlation IDs alone do not define duplicate-effect prevention. |
| [MCP tools, 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) | Tool definitions and input schemas; tool results can contain text and structured data; optional output schemas. |
| [A2A core concepts](https://a2a-protocol.org/latest/topics/key-concepts/) | Messages, parts, artifacts, Agent Cards, and structured JSON values. Text is not limited to English, and numerical arrays are not inherently excluded. |
| [A2A task lifecycle](https://a2a-protocol.org/latest/topics/life-of-a-task/) | Immediate messages versus tracked tasks, requests for input, and final task states. Business completion still needs an application definition. |
| [JSON Schema object reference](https://json-schema.org/understanding-json-schema/reference/object) | Properties, required fields, allowed types, and the distinction between an absent property and a null value. |
| [OpenAI Structured Outputs announcement](https://openai.com/index/introducing-structured-outputs-in-the-api/) | Constraining output shape does not prevent mistakes in field values. Historical announcement, not a current model-support or performance comparison. |
| [ISO 20022 FAQ](https://www.iso20022.org/faq) | Data Dictionary, Business Process Catalogue, and the distinction between business concepts and message syntax. No claim that all banks adopted the standard because they were forced. |
| [AP2 v0.2 specification](https://ap2-protocol.org/ap2/specification/) | Checkout and Payment Mandates, role-specific verification, and limits of scope. Delegating mandates between shopping agents is explicitly outside this version's scope. |
| [x402 introduction](https://docs.x402.org/introduction) | HTTP 402 payment requirements and a flow that includes verification and settlement before serving the resource. This is distinct from AP2's mandate and authority model. |
| [FHIR R5 narrative](https://www.hl7.org/fhir/narrative.html) | Many resource types can carry human-readable narrative alongside structured data. The essay does not claim that every resource type requires a narrative. |
| [OpenAI embeddings documentation](https://platform.openai.com/docs/guides/embeddings) | Embeddings as numerical representations used for relatedness, retrieval, and similar tasks. No measured benefit for an agent-to-agent messaging format is inferred. |
| [Morris et al., 2023](https://arxiv.org/abs/2310.06816) | The authors report reconstructing text from embeddings under their tested conditions. The essay makes no universal recovery-rate claim. |
| [OWASP prompt injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) | Outside content can influence model behavior. Valid JSON does not make text inside a field an authorized instruction. |

## Corrections to the earlier essay

- Removed the inference from a greeting in a sample to the content of production agent traffic.
- Removed the claim that English cannot be tested and that structured values make an agent resistant to deception.
- Corrected the diagram that described AP2 as HTTP 402 plus a payment field.
- Removed unsupported fixed token-size comparisons and changing payment-dashboard totals.
- Replaced the claim that embeddings cannot travel through A2A with the distinction between carrying an array and agreeing on its meaning.
- Removed broad legal predictions and unsupported accounts of why earlier standards succeeded or failed.
- Replaced an invented seat-fee allowance with an explicit unknown value, followed by a separately described user approval.

## Maintenance

The MCP citation is versioned. AP2 is identified as v0.2. The A2A and other documentation links can change over time, so recheck their content before updating technical details. Protocol documentation supports the stated interface features, not measured adoption, guaranteed task success, or the truth of data supplied by a service.

## Revision checks

The production build and its TypeScript check passed. The essay has 3,574 words excluding code and figure attributes, twelve sections, three valid JSON examples, and no exact repeated prose sentences. The targeted writing audit found zero violations. All 400 available image SVGs passed XML validation. Browser checks at 1440px and 390px confirmed the title, canonical URL, three tables, both figures, image zoom, and parseable rendered JSON examples, with no page-level JavaScript errors or horizontal page overflow. The booking example explicitly requires approval of a specific offer before a separate purchase operation.
