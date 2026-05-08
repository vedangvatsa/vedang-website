import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const REPO_ROOT = '/Users/vedang/vedang-website';
dotenv.config({ path: path.resolve(REPO_ROOT, '.env.local') });

const TOKEN = process.env.HASHNODE_TOKEN!;
const PUB_ID = process.env.HASHNODE_PUBLICATION_ID!;
const GQL_URL = 'https://gql.hashnode.com';
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const POSTS_FILE = path.resolve(REPO_ROOT, 'scripts/hashnode-posts.json');

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
    // Append ?v=2 to explicitly bust Hashnode's image proxy cache!
    if (src.includes('.svg')) src = src.replace(/\.svg(\?.*)?$/, '.webp?v=2');
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

async function gql(query: string, variables: Record<string, any> = {}): Promise<any> {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json() as any;
  if (data.errors) throw new Error(data.errors.map((e: any) => e.message).join('; '));
  return data.data;
}

async function main() {
  const postsJson = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8')).filter((p: any) => p.posted);
  
  for (const post of postsJson) {
    const essay = extractEssayContent(post.slug);
    if (!essay) continue;

    const q = `
      query GetPost($host: String!, $slug: String!) {
        publication(host: $host) {
          post(slug: $slug) {
            id
            tags { name slug }
          }
        }
      }
    `;
    let hashnodePost;
    try {
      const data = await gql(q, { host: "vedangvatsa.hashnode.dev", slug: post.slug });
      hashnodePost = data.publication.post;
      if (!hashnodePost) continue;
    } catch (e) { continue; }

    const canonicalUrl = `https://veda.ng/essays/${post.slug}`;
    const updateMutation = `
      mutation UpdatePost($input: UpdatePostInput!) {
        updatePost(input: $input) { post { id } }
      }
    `;
    const input = {
      id: hashnodePost.id,
      title: essay.title,
      contentMarkdown: essay.body + `\n\n---\n*This essay was originally published on [veda.ng](${canonicalUrl}).*`,
      originalArticleURL: canonicalUrl,
      publicationId: PUB_ID,
      tags: hashnodePost.tags,
    };

    try {
      await gql(updateMutation, { input });
      console.log(`✅ Updated ${post.slug}`);
    } catch (e: any) {
      console.log(`❌ Failed ${post.slug}: ${e.message}`);
    }
  }
}

main().catch(console.error);
