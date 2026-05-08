import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client, PrivateKey } from '@hiveio/dhive';

const REPO_ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const HIVE_USERNAME = process.env.HIVE_USERNAME;
const HIVE_POSTING_KEY = process.env.HIVE_POSTING_KEY;

const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const POSTS_FILE = path.resolve(REPO_ROOT, 'scripts/hive-posts.json');

const COOLDOWN_HOURS = 8;
const DRY_RUN = process.argv.includes('--dry-run');

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

async function publishToHive(slug: string, title: string, markdown: string) {
  if (!HIVE_USERNAME || !HIVE_POSTING_KEY) {
    throw new Error('HIVE_USERNAME and HIVE_POSTING_KEY are required in .env.local');
  }

  const client = new Client('https://api.hive.blog');
  const key = PrivateKey.fromString(HIVE_POSTING_KEY);

  const permlink = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  const tags = ['technology', 'ai', 'programming', 'future'];
  
  const canonicalUrl = `https://veda.ng/essays/${slug}`;
  const finalMarkdown = `${markdown}\n\n---\n*This essay was originally published on [veda.ng](${canonicalUrl}).*`;

  const commentOp: any = [
    'comment',
    {
      parent_author: '',
      parent_permlink: tags[0],
      author: HIVE_USERNAME,
      permlink: permlink,
      title: title,
      body: finalMarkdown,
      json_metadata: JSON.stringify({
        tags: tags,
        app: 'veda-syndicator/1.0',
        canonical_url: canonicalUrl
      })
    }
  ];

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would publish to Hive: ${title}`);
    return `https://hive.blog/${tags[0]}/@${HIVE_USERNAME}/${permlink}`;
  }

  await client.broadcast.sendOperation(commentOp, key);
  return `https://hive.blog/${tags[0]}/@${HIVE_USERNAME}/${permlink}`;
}

async function main() {
  if (!fs.existsSync(POSTS_FILE)) {
    console.error('hive-posts.json not found!');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8'));
  const postedAtList = posts.filter((p: any) => p.posted && p.postedAt).map((p: any) => new Date(p.postedAt).getTime());
  
  if (postedAtList.length > 0) {
    const lastPostedAt = Math.max(...postedAtList);
    const hoursSinceLastPost = (Date.now() - lastPostedAt) / (1000 * 60 * 60);
    
    if (hoursSinceLastPost < COOLDOWN_HOURS) {
      console.log(`⏳ Cooldown active. Last post was ${hoursSinceLastPost.toFixed(1)} hours ago. Need to wait ${COOLDOWN_HOURS} hours.`);
      return;
    }
  }

  const unposted = posts.filter((p: any) => !p.posted);
  if (unposted.length === 0) {
    console.log('✅ All essays have been published to Hive!');
    return;
  }

  const nextPost = unposted[0];
  console.log(`📝 Publishing to Hive: ${nextPost.slug}`);

  const essay = extractEssayContent(nextPost.slug);
  if (!essay) {
    console.error(`❌ Could not find or parse essay: ${nextPost.slug}`);
    nextPost.posted = true;
    nextPost.error = "File missing or unparseable";
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    process.exit(1);
  }

  try {
    const url = await publishToHive(nextPost.slug, essay.title, essay.body);
    console.log(`✅ Published: ${url}`);
    
    if (!DRY_RUN) {
      nextPost.posted = true;
      nextPost.postedAt = new Date().toISOString();
      nextPost.hiveUrl = url;
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    }
  } catch (error: any) {
    console.error(`❌ Failed to publish to Hive: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
