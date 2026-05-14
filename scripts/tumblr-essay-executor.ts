import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import OAuth from 'oauth';

const REPO_ROOT = path.resolve(process.cwd());
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.TUMBLR_ACCESS_TOKEN;
const ACCESS_SECRET = process.env.TUMBLR_ACCESS_SECRET;
const BLOG_NAME = process.env.TUMBLR_BLOG_NAME;

const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const POSTS_FILE = path.resolve(REPO_ROOT, 'scripts/tumblr-essay-posts.json');

const COOLDOWN_HOURS = 7;
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

function createOAuth() {
  return new OAuth.OAuth(
    'https://www.tumblr.com/oauth/request_token',
    'https://www.tumblr.com/oauth/access_token',
    CONSUMER_KEY!,
    CONSUMER_SECRET!,
    '1.0A',
    null,
    'HMAC-SHA1'
  );
}

function oauthPostRaw(url: string, body: Record<string, any>): Promise<string> {
  const oa = createOAuth();
  return new Promise((resolve, reject) => {
    oa.post(
      url,
      ACCESS_TOKEN!,
      ACCESS_SECRET!,
      body,
      'application/x-www-form-urlencoded',
      (err: any, data: any) => {
        if (err) return reject(new Error(`Tumblr API error: ${JSON.stringify(err)}`));
        resolve(data as string);
      }
    );
  });
}

async function publishToTumblr(slug: string, title: string, markdown: string) {
  if (!CONSUMER_KEY || !ACCESS_TOKEN || !BLOG_NAME) {
    throw new Error('Tumblr credentials missing in .env.local');
  }

  const url = `https://api.tumblr.com/v2/blog/${BLOG_NAME}/post`;
  const canonicalUrl = `https://veda.ng/${slug}`;
  const finalMarkdown = `${markdown}\n\n---\n*This essay was originally published on [veda.ng](${canonicalUrl}).*`;

  const body: Record<string, any> = {
    type: 'text',
    title: title,
    body: finalMarkdown,
    tags: 'technology,ai,programming,future',
    format: 'markdown',
  };

  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would publish to Tumblr: ${title}`);
    return `dummy-id-dry-run`;
  }

  const raw = await oauthPostRaw(url, body);
  const idMatch = raw.match(/"id"\s*:\s*(\d+)/);
  if (!idMatch) throw new Error(`Could not parse Tumblr response: ${raw}`);
  return idMatch[1];
}

async function main() {
  if (!fs.existsSync(POSTS_FILE)) {
    console.error('tumblr-essay-posts.json not found!');
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
    console.log('✅ All essays have been published to Tumblr!');
    return;
  }

  const nextPost = unposted[0];
  console.log(`📝 Publishing essay to Tumblr: ${nextPost.slug}`);

  const essay = extractEssayContent(nextPost.slug);
  if (!essay) {
    console.error(`❌ Could not find or parse essay: ${nextPost.slug}`);
    nextPost.posted = true;
    nextPost.error = "File missing or unparseable";
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    process.exit(1);
  }

  try {
    const postId = await publishToTumblr(nextPost.slug, essay.title, essay.body);
    console.log(`✅ Published to Tumblr! ID: ${postId}`);
    
    if (!DRY_RUN) {
      nextPost.posted = true;
      nextPost.postedAt = new Date().toISOString();
      nextPost.tumblrId = postId;
      fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
    }
  } catch (error: any) {
    console.error(`❌ Failed to publish to Tumblr: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
