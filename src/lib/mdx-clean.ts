export function cleanMdxToMarkdown(content: string): string {
  let text = content;

  text = text.replace(/<!--[\s\S]*?-->/g, '');

  text = text.replace(/<Callout\b[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/Callout>/g, '> **$1**\n> $2');
  text = text.replace(/<Callout\b[^>]*>([\s\S]*?)<\/Callout>/g, '> $1');

  text = text.replace(/<KeyTakeaway\b[^>]*>([\s\S]*?)<\/KeyTakeaway>/g, '> **Key Takeaway**\n> $1');

  text = text.replace(/<PullQuote\b[^>]*>([\s\S]*?)<\/PullQuote>/g, '> $1');

  text = text.replace(/<Stat\s+value="([^"]+)"\s+label="([^"]+)"(?:\s+source="([^"]+)")?[^>]*\/>/g, (_match, value, label, source) => {
    return `- **${value}**: ${label}${source ? ` (${source})` : ''}`;
  });
  text = text.replace(/<\/?StatRow>/g, '');

  text = text.replace(/<Figure\s+src="([^"]+)"\s+alt="([^"]+)"[^>]*\/>/g, '![$2]($1)');
  text = text.replace(/<Figure\b[^>]*\/>/g, '');

  text = text.replace(/<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*?)?\/>/g, '');

  text = text.replace(/<\/?(?:Columns|Column|div|span|section|article)\b[^>]*>/g, '');

  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}
