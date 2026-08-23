"""vedang-cli — Command-line interface for veda.ng"""

import json
import os
from pathlib import Path
from typing import Optional

import click
import httpx
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.json import JSON

console = Console()

BASE_URL = os.getenv("VEDANG_BASE_URL", "https://veda.ng")
TIMEOUT = httpx.Timeout(30.0, connect=10.0)


def get_client() -> httpx.Client:
    return httpx.Client(base_url=BASE_URL, timeout=TIMEOUT, headers={"User-Agent": f"vedang-cli/{__import__('vedang_cli').__version__}"})


@click.group(context_settings={"help_option_names": ["-h", "--help"]})
@click.version_option(version=__import__("vedang_cli").__version__, prog_name="vedang")
@click.option("--url", envvar="VEDANG_BASE_URL", default=BASE_URL, help="Base URL for veda.ng API")
@click.pass_context
def app(ctx: click.Context, url: str) -> None:
    """CLI client for veda.ng — AI agents, Web3 research, MCP server, and agent-readiness."""
    ctx.ensure_object(dict)
    ctx.obj["base_url"] = url


@click.command()
@click.option("--format", "fmt", type=click.Choice(["table", "json", "yaml"]), default="table", help="Output format")
def status(fmt: str) -> None:
    """Check site health and basic info."""
    with get_client() as client:
        resp = client.get("/")
        resp.raise_for_status()

    data = {
        "url": BASE_URL,
        "http_status": resp.status_code,
        "content_type": resp.headers.get("content-type"),
        "server": resp.headers.get("server"),
    }

    if fmt == "json":
        console.print(JSON.from_data(data))
    elif fmt == "yaml":
        import yaml
        console.print(yaml.dump(data))
    else:
        table = Table(title="veda.ng Status")
        table.add_column("Property", style="cyan")
        table.add_column("Value", style="green")
        for k, v in data.items():
            table.add_row(k, str(v))
        console.print(table)


@click.command()
@click.argument("path", default="/")
@click.option("--save", "-s", type=click.Path(), help="Save markdown to file")
def markdown(path: str, save: Optional[str]) -> None:
    """Fetch page as Markdown (via Accept: text/markdown)."""
    if not path.startswith("/"):
        path = "/" + path

    with get_client() as client:
        resp = client.get(path, headers={"Accept": "text/markdown"})
        resp.raise_for_status()

    content = resp.text

    if save:
        Path(save).write_text(content, encoding="utf-8")
        console.print(f"[green]Saved to {save}[/green]")
    else:
        console.print(Panel(content, title=f"Markdown: {path}", border_style="blue"))


@click.command()
@click.option("--format", "fmt", type=click.Choice(["table", "json"]), default="table")
def tools(fmt: str) -> None:
    """List MCP server tools."""
    with get_client() as client:
        resp = client.post(
            "/.well-known/mcp",
            json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"},
            headers={"Accept": "application/json", "Content-Type": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()

    tools_list = data.get("result", {}).get("tools", [])

    if fmt == "json":
        console.print(JSON.from_data(tools_list))
    else:
        table = Table(title="MCP Tools")
        table.add_column("Name", style="cyan")
        table.add_column("Description", style="green")
        for t in tools_list:
            table.add_row(t["name"], t.get("description", ""))
        console.print(table)


@click.command()
@click.argument("tool_name")
@click.argument("args", nargs=-1)
@click.option("--format", "fmt", type=click.Choice(["json", "pretty"]), default="pretty")
def call(tool_name: str, args: tuple, fmt: str) -> None:
    """Call an MCP tool with JSON arguments.

    Example:
      vedang call search_essays '{"query": "agent"}'
      vedang call get_essay '{"slug": "agentstack"}'
    """
    if len(args) != 1:
        click.echo("Usage: vedang call TOOL_NAME 'JSON_ARGS'", err=True)
        raise click.Abort()

    try:
        arguments = json.loads(args[0])
    except json.JSONDecodeError as e:
        click.echo(f"Invalid JSON: {e}", err=True)
        raise click.Abort()

    with get_client() as client:
        resp = client.post(
            "/.well-known/mcp",
            json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": tool_name, "arguments": arguments}},
            headers={"Accept": "application/json", "Content-Type": "application/json"},
        )
        resp.raise_for_status()
        data = resp.json()

    if fmt == "json":
        console.print(JSON.from_data(data))
    else:
        result = data.get("result", {})
        content = result.get("content", [])
        for item in content:
            if item.get("type") == "text":
                console.print(Panel(item["text"], title=f"Result: {tool_name}", border_style="green"))


@click.command()
@click.argument("domain", default="veda.ng")
@click.option("--include-essentials", is_flag=True, help="Include essentials score")
@click.option("--format", "fmt", type=click.Choice(["table", "json"]), default="table")
def scan(domain: str, include_essentials: bool, fmt: str) -> None:
    """Run agent-readiness scan via Ora API."""
    url = "https://ora.ai/api/scan"
    params = {"include": "essentials"} if include_essentials else {}

    with httpx.Client(timeout=TIMEOUT) as client:
        resp = client.post(url, json={"url": domain}, params=params)
        resp.raise_for_status()
        data = resp.json()

    if fmt == "json":
        console.print(JSON.from_data(data))
    else:
        console.print(Panel(
            f"Score: [bold]{data.get('score')}[/bold]/100\n"
            f"Grade: [bold]{data.get('grade')}[/bold]\n"
            f"Essentials: [bold]{data.get('essentials', {}).get('score', 'N/A')}[/bold]\n"
            f"Status: {data.get('analysisStatus')}",
            title=f"Ora Scan: {domain}",
            border_style="magenta"
        ))


@click.command()
@click.argument("domain", default="veda.ng")
@click.option("--format", "fmt", type=click.Choice(["table", "json"]), default="table")
def score(domain: str, fmt: str) -> None:
    """Get cached Ora score for a domain."""
    url = f"https://ora.ai/api/score/{domain}"
    params = {"include": "essentials"}

    with httpx.Client(timeout=TIMEOUT) as client:
        resp = client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    if fmt == "json":
        console.print(JSON.from_data(data))
    else:
        essentials = data.get("essentials", {})
        console.print(Panel(
            f"Score: [bold]{data.get('score')}[/bold]/100\n"
            f"Grade: [bold]{data.get('grade')}[/bold]\n"
            f"Essentials: [bold]{essentials.get('score', 'N/A')}[/bold]/100\n"
            f"Scanned: {data.get('scannedAt')}",
            title=f"Ora Score: {domain}",
            border_style="blue"
        ))


@click.command()
@click.option("--format", "fmt", type=click.Choice(["table", "json"]), default="table")
def discover(fmt: str) -> None:
    """Show agent-ready resources from veda.ng (llms.txt, agents.json, etc.)."""
    endpoints = [
        ("llms.txt", f"{BASE_URL}/llms.txt", "Structured content index"),
        ("llms-full.txt", f"{BASE_URL}/llms-full.txt", "Full-text content"),
        ("agents.json", f"{BASE_URL}/.well-known/agents.json", "Agent capabilities & guidance"),
        ("ai.txt", f"{BASE_URL}/ai.txt", "AI permissions"),
        ("ai.json", f"{BASE_URL}/ai.json", "AI discovery manifest"),
        ("sitemap.xml", f"{BASE_URL}/sitemap.xml", "All public URLs"),
        ("feed.xml", f"{BASE_URL}/feed.xml", "RSS feed"),
        ("openapi.json", f"{BASE_URL}/openapi.json", "OpenAPI 3.1 spec"),
        ("MCP Server", f"{BASE_URL}/.well-known/mcp", "Streamable HTTP MCP"),
    ]

    if fmt == "json":
        console.print(JSON.from_data([{"name": n, "url": u, "desc": d} for n, u, d in endpoints]))
    else:
        table = Table(title="veda.ng Agent Resources")
        table.add_column("Resource", style="cyan")
        table.add_column("URL", style="blue")
        table.add_column("Description", style="green")
        for name, url, desc in endpoints:
            table.add_row(name, url, desc)
        console.print(table)


# Register commands
app.add_command(status)
app.add_command(markdown)
app.add_command(tools)
app.add_command(call)
app.add_command(scan)
app.add_command(score)
app.add_command(discover)