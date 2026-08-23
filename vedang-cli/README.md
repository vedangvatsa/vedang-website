# vedang-cli

CLI client for [veda.ng](https://veda.ng) — AI agents, Web3 research, MCP server, and agent-readiness scanning.

## Install

```bash
pip install vedang-cli
```

Or from source:
```bash
pip install -e .
```

## Quickstart

```bash
# Check site health
vedang status

# Fetch any page as Markdown
vedang markdown /agentstack
vedang markdown / --save agentstack.md

# List MCP server tools
vedang tools

# Call an MCP tool
vedang call search_essays '{"query": "stablecoin"}'
vedang call get_essay '{"slug": "agentstack"}'

# Run Ora agent-readiness scan
vedang scan veda.ng
vedang scan veda.ng --include-essentials

# Get cached Ora score
vedang score veda.ng

# Discover agent resources
vedang discover
```

## Commands

| Command | Description |
|---------|-------------|
| `status` | Check site health and basic info |
| `markdown` | Fetch any page as Markdown (Accept: text/markdown) |
| `tools` | List MCP server tools |
| `call` | Call an MCP tool with JSON arguments |
| `scan` | Run agent-readiness scan via Ora API |
| `score` | Get cached Ora score |
| `discover` | List all agent-facing resources (llms.txt, agents.json, MCP, etc.) |

## Configuration

Environment variables:
- `VEDANG_BASE_URL` — Base URL (default: `https://veda.ng`)

## Development

```bash
pip install -e ".[dev]"
pytest
ruff check .
mypy vedang_cli
```

## License

MIT