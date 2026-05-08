import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const REPO_ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

// To use this, add WP_SITE_DOMAIN, WP_USERNAME, and WP_APP_PASSWORD to .env.local
const WP_SITE_DOMAIN = process.env.WP_SITE_DOMAIN; // e.g., vedang.wordpress.com
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');

function extractEssayContent(slug: string): { title: string; body: string } | null {
  const filePath = path.resolve(ESSAYS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;

  const fm = fmMatch[1];
  const titleMatch = fm.match(/title:\s*['"]?(.+?)['"]?\n/);
  const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : slug;

  let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');
  body = body.replace(/^import\s+.*$/gm, '');
  
  body = body.replace(/<(?:Figure|Image)\s+([^>]+)\/?>/g, (match, props) => {
    const srcMatch = props.match(/src=["']([^"']+)["']/);
    const altMatch = props.match(/alt=["']([^"']*)["']/);
    let src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    if (!src) return '';
    if (src.includes('.svg')) src = src.replace(/\.svg(\?.*)?$/, '.webp');
    const absoluteSrc = src.startsWith('/') ? `https://veda.ng${src}` : src;
    return `\n![${alt}](${absoluteSrc})\n`;
  });

  body = body.replace(/<SectionLabel[^>]*label=["']([^"']*)["'][^>]*\/?>/g, '\n## $1\n');
  body = body.replace(/<PullQuote[^>]*quote=["']([^"']*)["'][^>]*\/?>/g, '\n> $1\n');
  body = body.replace(/<Callout[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> 💡 $1\n');
  body = body.replace(/<KeyTakeaway[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> ✅ $1\n');
  body = body.replace(/<\/?([A-Z][A-Za-z0-9]*)[^>]*>/g, '');

  return { title, body: body.trim() };
}

async function postToWordPress(slug: string, title: string, markdown: string) {
  if (!WP_SITE_DOMAIN || !WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error('WordPress credentials missing in .env.local');
  }

  // Convert simple markdown to HTML manually for WP REST API
  // A robust approach in production would use 'marked' or 'showdown'
  let htmlBody = markdown.replace(/\n\n/g, '</p><p>');
  htmlBody = htmlBody.replace(/^#\s+(.*$)/gm, '<h1>$1</h1>');
  htmlBody = htmlBody.replace(/^##\s+(.*$)/gm, '<h2>$1</h2>');
  htmlBody = htmlBody.replace(/^###\s+(.*$)/gm, '<h3>$1</h3>');
  htmlBody = htmlBody.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  htmlBody = htmlBody.replace(/\*(.*?)\*/g, '<em>$1</em>');
  htmlBody = htmlBody.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  htmlBody = htmlBody.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  htmlBody = '<p>' + htmlBody + '</p>';

  const canonicalUrl = `https://veda.ng/${slug}`;
  htmlBody += `\n<hr>\n<p><em>Original source: <a href="${canonicalUrl}">${canonicalUrl}</a></em></p>`;

  const endpoint = `https://public-api.wordpress.com/wp/v2/sites/${WP_SITE_DOMAIN}/posts`;
  const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      content: htmlBody,
      status: 'publish' // Change to 'draft' if you want to review first
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WP API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.link;
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  if (!WP_SITE_DOMAIN || !WP_USERNAME || !WP_APP_PASSWORD) {
    console.error('❌ Please add WP_SITE_DOMAIN, WP_USERNAME, and WP_APP_PASSWORD to .env.local');
    process.exit(1);
  }

  const files = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`🚀 Starting manual mass-publish of ${files.length} essays to WordPress...`);

  for (let i = 0; i < files.length; i++) {
    const slug = files[i].replace('.mdx', '');
    const essay = extractEssayContent(slug);
    if (!essay) continue;

    console.log(`\n[${i+1}/${files.length}] Publishing to WP: ${essay.title}`);

    try {
      const url = await postToWordPress(slug, essay.title, essay.body);
      console.log(`  ✅ Success: ${url}`);
    } catch (e: any) {
      console.error(`  ❌ Failed: ${e.message}`);
    }

    if (i < files.length - 1) {
      console.log(`  ⏳ Waiting 5 seconds...`);
      await sleep(5000); // Respect WP rate limits
    }
  }

  console.log(`\n🎉 WordPress mass syndication complete!`);
}

main().catch(console.error);
