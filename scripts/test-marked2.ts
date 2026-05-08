import { marked } from 'marked';
import fs from 'fs';

const raw = fs.readFileSync('/Users/vedang/vedang-website/src/content/essays/plurality-trap.mdx', 'utf-8');
let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');
body = body.replace(/^import\s+.*$/gm, '');

// Callouts with children
body = body.replace(/<Callout[^>]*title=["']([^"']*)["'][^>]*>([\s\S]*?)<\/Callout>/g, (match, title, content) => {
    return `\n\n> **${title}**\n> ${content.trim().replace(/\n/g, '\n> ')}\n\n`;
});
// Callouts with text attribute
body = body.replace(/<Callout[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n\n> 💡 $1\n\n');

// Stats
body = body.replace(/<Stat\s+[^>]*value=["']([^"']*)["'][^>]*label=["']([^"']*)["'][^>]*\/?>/g, '- **$1**: $2');
body = body.replace(/<\/?StatRow>/g, '\n\n');

// Other known components
body = body.replace(/<SectionLabel[^>]*label=["']([^"']*)["'][^>]*\/?>/g, '\n\n## $1\n\n');
body = body.replace(/<PullQuote[^>]*quote=["']([^"']*)["'][^>]*\/?>/g, '\n\n> $1\n\n');
body = body.replace(/<PullQuote[^>]*>([\s\S]*?)<\/PullQuote>/g, '\n\n> $1\n\n');
body = body.replace(/<KeyTakeaway[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n\n> ✅ $1\n\n');
body = body.replace(/<KeyTakeaway[^>]*>([\s\S]*?)<\/KeyTakeaway>/g, '\n\n> ✅ $1\n\n');

body = body.replace(/<([A-Z][A-Za-z0-9]*)[^>]*\/>/g, '\n\n*(Interactive chart available on original post)*\n\n');
body = body.replace(/<\/?([A-Z][A-Za-z0-9]*)[^>]*>/g, '\n\n');

console.log(marked.parse(body.trim()).substring(0, 1000));
