# Authentication for veda.ng

All public machine interfaces on veda.ng require **no authentication**. Every read endpoint below is open, keyless, and rate-limit friendly. There are no API keys, OAuth flows, or sign-ups.

## How to authenticate

You do not. Send a normal request:

```
curl https://veda.ng/api/reports/search?q=stablecoin
curl https://veda.ng/llms.txt
curl -X POST https://veda.ng/.well-known/mcp -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Endpoints (all public, all GET unless noted)

| Endpoint | Auth | Notes |
|----------|------|-------|
| `/api/reports/search` | none | Research paper search (OpenAlex-backed) |
| `/.well-known/mcp` (POST) | none | MCP Streamable HTTP, JSON-RPC 2.0, stateless |
| `/llms.txt`, `/llms-full.txt` | none | Content indexes for LLMs |
| `/feed.xml`, `/sitemap.xml` | none | RSS and URL sitemap |
| `/.well-known/agents.json` | none | Agent capabilities manifest |
| `/openapi.json` | none | OpenAPI 3.1 specification |
| Any page URL with `Accept: text/markdown` | none | Markdown representation |

## Rate limits

The public search endpoint is cached server-side for one hour per query. Be polite: cache responses, send a descriptive User-Agent, and prefer the MCP tools for structured access.

## Write access

There is no write surface. The site publishes only authored content; nothing on veda.ng accepts user submissions through the API.

## Contact

Security or abuse concerns: vatsvedang@gmail.com (see also /.well-known/security.txt). Human contact: https://veda.ng/contact
