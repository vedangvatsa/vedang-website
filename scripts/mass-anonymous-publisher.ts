import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd());
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const REPORT_FILE = path.resolve(REPO_ROOT, 'anonymous-syndication-report.csv');

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

async function postToWriteAs(title: string, body: string): Promise<string> {
  const response = await fetch('https://write.as/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, appearance: 'norm' })
  });
  if (!response.ok) throw new Error(`Write.as error: ${response.status}`);
  const data = await response.json();
  return `https://write.as/${data.data.id}.md`;
}

async function postToDpaste(body: string): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('content', body);
  formData.append('format', 'markdown');
  
  const response = await fetch('https://dpaste.com/api/v2/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  });
  if (!response.ok) throw new Error(`Dpaste error: ${response.status}`);
  return (await response.text()).trim();
}

async function postToPasteRs(body: string): Promise<string> {
  const response = await fetch('https://paste.rs/', {
    method: 'POST',
    body: body
  });
  if (!response.ok) throw new Error(`Paste.rs error: ${response.status}`);
  return (await response.text()).trim();
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const files = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));
  
  // CSV Header
  fs.writeFileSync(REPORT_FILE, 'Title,Write.as,Dpaste,Paste.rs\n');
  console.log(`🚀 Starting mass anonymous syndication of ${files.length} essays...`);

  for (let i = 0; i < files.length; i++) {
    const slug = files[i].replace('.mdx', '');
    const essay = extractEssayContent(slug);
    if (!essay) continue;

    console.log(`\n[${i+1}/${files.length}] Publishing: ${essay.title}`);
    
    let writeAsUrl = 'FAILED';
    let dpasteUrl = 'FAILED';
    let pasteRsUrl = 'FAILED';

    const canonicalBody = `${essay.body}\n\n---\n*Original source: [veda.ng/${slug}](https://veda.ng/${slug})*`;

    try {
      writeAsUrl = await postToWriteAs(essay.title, canonicalBody);
      console.log(`  ✅ Write.as: ${writeAsUrl}`);
    } catch (e: any) { console.error(`  ❌ Write.as failed: ${e.message}`); }

    try {
      dpasteUrl = await postToDpaste(canonicalBody);
      console.log(`  ✅ Dpaste: ${dpasteUrl}`);
    } catch (e: any) { console.error(`  ❌ Dpaste failed: ${e.message}`); }

    try {
      pasteRsUrl = await postToPasteRs(canonicalBody);
      console.log(`  ✅ Paste.rs: ${pasteRsUrl}`);
    } catch (e: any) { console.error(`  ❌ Paste.rs failed: ${e.message}`); }

    const csvRow = `"${essay.title.replace(/"/g, '""')}",${writeAsUrl},${dpasteUrl},${pasteRsUrl}\n`;
    fs.appendFileSync(REPORT_FILE, csvRow);

    if (i < files.length - 1) {
      console.log(`  ⏳ Waiting 3 seconds to avoid rate limits...`);
      await sleep(3000);
    }
  }

  console.log(`\n🎉 Mass syndication complete! Report saved to: ${REPORT_FILE}`);
}

main().catch(console.error);
