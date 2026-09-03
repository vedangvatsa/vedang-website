# Pricing & Access — Vedang Vatsa (veda.ng)

Last updated: 2025-09-03  
Canonical URL: https://veda.ng/pricing

---

## Summary

veda.ng is free and open-access for humans and autonomous AI agents. There are no API keys, no accounts, and no credit cards required for any read operation.

---

## Plans

### Free — $0 / month

Available to everyone, including AI agents and automated systems.

| Feature | Limit |
|---|---|
| Academic paper search (233,000+ papers, OpenAlex) | Unlimited |
| Long-form essay reading (68 essays, full Markdown) | Unlimited |
| Technical glossary lookups (100+ AI & Web3 terms) | Unlimited |
| MCP server access (Product + Docs) | Unlimited, keyless |
| REST API calls | 60 requests / minute |
| Markdown content negotiation (Accept: text/markdown) | All pages |
| OpenAPI 3.1 spec download | Unlimited |
| RSS / Atom feed | Unlimited |
| Education courses (Prompt, MCP, Vibe Coding, Agentic Web, Automation, Web3) | Unlimited |
| AI & Web Readiness scanner (/scan) | Unlimited |
| Swarm prediction engine | Unlimited |
| Authentication required | None |
| API key required | None |

**Rate limits**: Standard keyless bucket — 60 requests/minute per IP. Headers returned on all API responses:
```
RateLimit-Policy: 60;w=60
RateLimit-Limit: 60
RateLimit-Remaining: <n>
RateLimit-Reset: <epoch>
```

---

### Enterprise / Custom — Contact

For high-volume ingestion, SLA guarantees, white-label access, or custom integrations:

- **Contact**: https://veda.ng/contact
- **Machine-readable request**: POST https://veda.ng/api/v1/batch with `{"intent": "enterprise-inquiry"}`
- **Response time**: 2 business days

Custom options include:
- Dedicated rate-limit tier
- Private OpenAPI schema snapshots
- Bulk essay / glossary data exports (JSONL)
- Custom MCP tool exposure for internal agent workflows

---

## Machine Endpoints

All endpoints are accessible without authentication:

| Endpoint | Description |
|---|---|
| `POST /api/v1/scan` | AI & web readiness audit (returns JSON score + check results) |
| `GET /api/v1/essays` | Essay index (JSON) |
| `GET /api/v1/glossary` | Glossary term index (JSON) |
| `POST /api/v1/reports/search` | Academic paper search (JSON) |
| `GET /openapi.json` | OpenAPI 3.1 specification |
| `POST /.well-known/mcp` | MCP Product Server (JSON-RPC 2.0) |
| `POST /.well-known/mcp/docs` | MCP Docs Server (JSON-RPC 2.0) |
| `GET /llms.txt` | LLM site catalog (Markdown) |
| `GET /llms-full.txt` | Full-text LLM digest (Markdown) |
| `GET /feed.xml` | RSS feed (68 essays) |

---

## Usage Policy

- All content is available for reading, research, and machine consumption.
- Training on the content is subject to veda.ng's robots.txt AI-bot directives.
- Commercial redistribution or repackaging of the data is not permitted without written consent.
- See: https://veda.ng/auth.md for the authentication and access specification.
