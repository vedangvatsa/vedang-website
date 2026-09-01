# Vedang Vatsa Authentication & Security Specification (veda.ng)

All public machine interfaces, research search APIs, OpenAPI endpoints, and MCP servers for Vedang Vatsa (veda.ng) are **open, keyless, and require no authentication**.

## Discover

Clients and autonomous AI agents discover veda.ng's machine interfaces through standard discovery protocols:

- **Agent Auth Metadata**: `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server`
- **MCP Server**: `/.well-known/mcp` (Streamable HTTP, JSON-RPC 2.0)
- **API Catalog (RFC 9727)**: `/.well-known/api-catalog`
- **OpenAPI Specification**: `/openapi.json`
- **LLM Index**: `/llms.txt`

## Pick a method

Supported authentication mechanisms:

- **Anonymous / None (`none`)**: All endpoints support direct anonymous read access without API keys, bearer tokens, or identity assertions.
- **Identity Assertion (`identity_assertion`)**: AI agents calling on behalf of users may optionally send standard `Authorization: Bearer <token>` or `id-jag` assertions.

```text
agent_auth:
  auth_type: none
  identity_types_supported:
    - anonymous
    - identity_assertion
```

## Register

Because all endpoints are keyless and public, **no registration is required**.

- `register_uri`: `https://veda.ng/api/auth/register` (stateless registration endpoint for automated agents)

## Claim

To access public resources, no credential exchange or claim step is needed:

```bash
# Direct access to research paper search
curl "https://veda.ng/api/reports/search?q=agents&corpus=ai"

# Direct access to MCP server
curl -X POST "https://veda.ng/.well-known/mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Use the credential

For unauthenticated requests, send standard HTTP requests. If an authorization header is supplied by an agent framework:

```http
GET /api/reports/search?q=blockchain HTTP/1.1
Host: veda.ng
Accept: application/json
Authorization: Bearer anonymous
```

## Errors

Error responses are returned in structured JSON format with error codes and descriptions:

```json
{
  "error": {
    "code": "missing_query",
    "message": "Provide a non-empty query parameter.",
    "status": 400
  }
}
```

Protected endpoints returning `401 Unauthorized` will include standard headers:

```http
WWW-Authenticate: Bearer resource_metadata="https://veda.ng/.well-known/oauth-protected-resource"
```

## Revocation

Because credentials are not stored or issued for public access, revocation is not required.

- `revocation_uri`: `https://veda.ng/api/auth/revoke`

## Contact

- Security & Abuse: `vatsvedang@gmail.com`
- Contact & Meetings: `https://veda.ng/contact`
