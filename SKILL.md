---
name: veda-research-hub
description: Search 50+ long-form essays, 100+ AI and Web3 glossary definitions, and 233,000+ academic papers via OpenAlex from veda.ng.
---

# veda.ng Research Hub Skill

This skill enables AI agents to query essays, glossary terms, and academic research papers published on [veda.ng](https://veda.ng).

## Capabilities & MCP Tools

- **`search_essays`**: Query 50+ research essays on AI agents, AI policy, cognitive architecture, and Web3 infrastructure.
- **`get_essay`**: Retrieve the full Markdown text of any essay by slug.
- **`search_glossary`**: Search 100+ plain-language definitions of AI and Web3 technical terms.
- **`get_glossary_term`**: Retrieve the full Markdown definition of a specific glossary term.
- **`search_reports`**: Query 233,000+ indexed academic papers via OpenAlex across AI and Web3 corpora, sorted by citation count.

## Usage

Connect via the live Model Context Protocol (MCP) server over Streamable HTTP:

```bash
# Streamable HTTP MCP Server
POST https://veda.ng/.well-known/mcp
```

Or query the REST API:

```bash
GET https://veda.ng/api/reports/search?q=agents&corpus=ai
```

See [Developer Documentation](https://veda.ng/developers) and [OpenAPI 3.1 Spec](https://veda.ng/openapi.json).
