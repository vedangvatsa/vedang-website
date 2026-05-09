import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import sharp from 'sharp';

const REPO_ROOT = path.resolve(process.cwd());
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const PUBLIC_DIR = path.resolve(REPO_ROOT, 'public');

const WP_DOMAIN = 'vedangvatsa.wordpress.com';
const WP_USER = 'vatsvedang';
const WP_PASS = 'hr3a 7wd4 rcvt ao6s';

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

// Upload a file to WordPress and return the Attachment ID and URL
async function uploadMedia(localPath: string, altText: string): Promise<{ id: string; url: string } | null> {
    try {
        let fileBuffer = fs.readFileSync(localPath);
        let fileName = path.basename(localPath);
        let mimeType = 'image/jpeg';
        
        // WordPress completely blocks SVGs for security. We MUST convert them to PNGs.
        if (fileName.endsWith('.svg')) {
            console.log(`  [Media] Converting SVG to PNG: ${fileName}`);
            fileBuffer = await sharp(fileBuffer).png().toBuffer();
            fileName = fileName.replace('.svg', '.png');
            mimeType = 'image/png';
        } else if (fileName.endsWith('.png')) {
            mimeType = 'image/png';
        } else if (fileName.endsWith('.webp')) {
            mimeType = 'image/webp';
        }

        const base64Data = fileBuffer.toString('base64');

        const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>wp.uploadFile</methodName>
  <params>
    <param><value><int>1</int></value></param>
    <param><value><string>${escapeXml(WP_USER)}</string></value></param>
    <param><value><string>${escapeXml(WP_PASS)}</string></value></param>
    <param>
      <value>
        <struct>
          <member><name>name</name><value><string>${escapeXml(fileName)}</string></value></member>
          <member><name>type</name><value><string>${mimeType}</string></value></member>
          <member><name>bits</name><value><base64>${base64Data}</base64></value></member>
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;

        const response = await fetch(`https://${WP_DOMAIN}/xmlrpc.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: xmlPayload
        });

        const text = await response.text();
        const urlMatch = text.match(/<name>url<\/name>\s*<value><string>([^<]+)<\/string>/);
        const idMatch = text.match(/<name>id<\/name>\s*<value><string>([^<]+)<\/string>/);
        
        if (urlMatch && idMatch) {
            return { id: idMatch[1], url: urlMatch[1] };
        }
        return null;
    } catch (e: any) {
        console.error(`  [Media] Failed to upload ${localPath}: ${e.message}`);
        return null;
    }
}

async function publishViaXmlRpc(title: string, htmlContent: string, thumbnailId: string | null, summary: string, keywords: string[]) {
    
  let customFieldsXml = '';
  // Set SEO metadata if a plugin like Yoast or AIOSEO is active (they read from custom fields)
  if (summary) {
      customFieldsXml += `
      <value><struct>
        <member><name>key</name><value><string>_yoast_wpseo_metadesc</string></value></member>
        <member><name>value</name><value><string>${escapeXml(summary)}</string></value></member>
      </struct></value>
      <value><struct>
        <member><name>key</name><value><string>_aioseo_description</string></value></member>
        <member><name>value</name><value><string>${escapeXml(summary)}</string></value></member>
      </struct></value>`;
  }

  const termsXml = keywords.map(k => `<value><string>${escapeXml(k)}</string></value>`).join('');

  const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
<methodCall>
  <methodName>wp.newPost</methodName>
  <params>
    <param><value><int>1</int></value></param>
    <param><value><string>${escapeXml(WP_USER)}</string></value></param>
    <param><value><string>${escapeXml(WP_PASS)}</string></value></param>
    <param>
      <value>
        <struct>
          <member><name>post_title</name><value><string>${escapeXml(title)}</string></value></member>
          <member><name>post_content</name><value><string>${escapeXml(htmlContent)}</string></value></member>
          <member><name>post_status</name><value><string>publish</string></value></member>
          ${thumbnailId ? `<member><name>post_thumbnail</name><value><int>${thumbnailId}</int></value></member>` : ''}
          <member><name>custom_fields</name><value><array><data>${customFieldsXml}</data></array></value></member>
          <member>
            <name>terms_names</name>
            <value>
              <struct>
                <member><name>post_tag</name><value><array><data>${termsXml}</data></array></value></member>
              </struct>
            </value>
          </member>
        </struct>
      </value>
    </param>
  </params>
</methodCall>`;

  const response = await fetch(`https://${WP_DOMAIN}/xmlrpc.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml' },
    body: xmlPayload
  });

  const text = await response.text();
  if (text.includes('<fault>')) throw new Error('XML-RPC Fault: ' + text);
  return text;
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const files = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`🚀 Publishing ${files.length} essays with Featured Images and SEO...`);

  for (let i = 0; i < files.length; i++) {
    const slug = files[i].replace('.mdx', '');
    const filePath = path.resolve(ESSAYS_DIR, files[i]);
    const raw = fs.readFileSync(filePath, 'utf-8');
    
    // Parse Frontmatter
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    
    const fm = fmMatch[1];
    const titleMatch = fm.match(/title:\s*['"]?(.+?)['"]?\n/);
    const summaryMatch = fm.match(/summary:\s*>?\s*(.+?)\n(?:[a-z]+:|$)/s);
    const keywordsMatch = fm.match(/keywords:\s*\[(.*?)\]/);
    
    const title = titleMatch ? titleMatch[1].trim().replace(/^['"]|['"]$/g, '') : slug;
    const summary = summaryMatch ? summaryMatch[1].trim().replace(/^['"]|['"]$/g, '').replace(/\n/g, ' ') : '';
    const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.trim().replace(/['"]/g, '')) : [];

    let body = raw.replace(/^---\n[\s\S]*?\n---\n*/, '');
    body = body.replace(/^import\s+.*$/gm, '');

    console.log(`[${i + 1}/${files.length}] Processing: ${title}`);

    // Find and Upload Images
    let featuredImageId: string | null = null;
    const imageMatches = [...body.matchAll(/<(?:Figure|Image)\s+([^>]+)\/?>/g)];
    
    for (const match of imageMatches) {
        const props = match[1];
        const srcMatch = props.match(/src=["']([^"']+)["']/);
        const altMatch = props.match(/alt=["']([^"']*)["']/);
        let src = srcMatch ? srcMatch[1].split('?')[0] : '';
        const alt = altMatch ? altMatch[1] : '';
        
        if (src && src.startsWith('/')) {
            const localImgPath = path.join(PUBLIC_DIR, src);
            if (fs.existsSync(localImgPath)) {
                const uploaded = await uploadMedia(localImgPath, alt);
                if (uploaded) {
                    // Set first uploaded image as featured!
                    if (!featuredImageId) featuredImageId = uploaded.id;
                    // Replace the custom tag with standard markdown using the WP hosted URL
                    body = body.replace(match[0], `\n\n![${alt}](${uploaded.url})\n\n`);
                }
            } else {
                 body = body.replace(match[0], ''); // Remove broken images
            }
        }
    }

    // Clean up other custom components
    
    // Callouts with children (Convert to standard heading + content, NO blockquote wrapping so tables parse correctly)
    body = body.replace(/<Callout[^>]*title=["']([^"']*)["'][^>]*>([\s\S]*?)<\/Callout>/g, '\n\n### $1\n\n$2\n\n');
    
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
    body = body.replace(/<Separator[^>]*\/?>/g, '\n\n---\n\n');
    
    // Remove all remaining JSX self-closing tags (charts, etc) and replace with a note
    body = body.replace(/<([A-Z][A-Za-z0-9]*)[^>]*\/>/g, '\n\n*(Interactive chart available on original post)*\n\n');
    
    // Remove remaining opening/closing JSX tags (just strip the tags, keep content)
    body = body.replace(/<\/?([A-Z][A-Za-z0-9]*)[^>]*>/g, '\n\n');

    const canonicalUrl = `https://veda.ng/${slug}`;
    body += `\n\n---\n*Original source: [${canonicalUrl}](${canonicalUrl})*`;

    // Convert to proper HTML for WordPress
    let htmlBody = marked.parse(body.trim()) as string;

    try {
      await publishViaXmlRpc(title, htmlBody, featuredImageId, summary, keywords);
      console.log(`  ✅ Published with Featured Image!`);
    } catch (e: any) {
      console.error(`  ❌ Failed: ${e.message}`);
    }
    await sleep(1000); 
  }

  console.log(`🎉 Mass syndication complete!`);
}

main().catch(console.error);
