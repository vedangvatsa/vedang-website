import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const REPO_ROOT = path.resolve(process.cwd());
const ESSAYS_DIR = path.resolve(REPO_ROOT, 'src/content/essays');
const SITE_DOMAIN = 'vedangvatsa.wordpress.com';
const USER_DATA_DIR = path.resolve(REPO_ROOT, '.wp-browser-session');

const VEDANG_ABOUT_TEXT = `Vedang Vatsa FRSA

Founder of Hashtag Web3 (120k community of AI & Web3 professionals).
MTech, MBA, Chartered Engineer, IIT Kanpur alumnus, Fellow of the Royal Society of Arts.

Product engineer, educator, and founder based in Singapore. 
Specializing in Web3, Agentic Web, AI Automation, and Vibe Coding.

Connect with me:
Website: https://veda.ng
LinkedIn: https://linkedin.com/in/vatsvedang`;

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
    
    // PRESERVE SVGs exactly as requested! We only append the base domain.
    const absoluteSrc = src.startsWith('/') ? `https://veda.ng${src}` : src;
    return `\n![${alt}](${absoluteSrc})\n`;
  });

  body = body.replace(/<SectionLabel[^>]*label=["']([^"']*)["'][^>]*\/?>/g, '\n## $1\n');
  body = body.replace(/<PullQuote[^>]*quote=["']([^"']*)["'][^>]*\/?>/g, '\n> $1\n');
  body = body.replace(/<Callout[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> 💡 $1\n');
  body = body.replace(/<KeyTakeaway[^>]*text=["']([^"']*)["'][^>]*\/?>/g, '\n> ✅ $1\n');
  body = body.replace(/<\/?([A-Z][A-Za-z0-9]*)[^>]*>/g, '');

  const canonicalUrl = `https://veda.ng/${slug}`;
  body += `\n\n---\n*Original source: [${canonicalUrl}](${canonicalUrl})*`;

  return { title, body: body.trim() };
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const files = fs.readdirSync(ESSAYS_DIR).filter(f => f.endsWith('.mdx'));
  console.log(`🚀 Found ${files.length} essays. Launching WordPress automation...`);

  // Launch persistent browser so user login is saved to disk!
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, { 
    headless: false,
    viewport: null 
  });
  
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log('👀 Please ensure you are logged into WordPress.com in the browser window.');
  console.log('⏳ Waiting for you to log in and reach the dashboard...');

  await page.goto('https://wordpress.com/log-in');

  // Robust URL polling loop to prevent timeouts if WordPress redirects to strange URLs
  let loggedIn = false;
  for (let i = 0; i < 300; i++) { // Wait up to 10 minutes (300 * 2s)
    const url = page.url();
    if (url.includes('/home') || url.includes('/posts') || url.includes('/read') || url.includes('wp-admin')) {
      loggedIn = true;
      break;
    }
    await sleep(2000);
  }

  if (!loggedIn) {
    console.error('❌ Timed out waiting for login. Please run the script again.');
    await context.close();
    return;
  }

  console.log('✅ Logged in successfully! Taking over automation now...');

  // 1. UPDATE SITE SETTINGS
  console.log('⚙️ Updating Site Title and Tagline...');
  try {
    await page.goto(`https://${SITE_DOMAIN}/wp-admin/options-general.php`);
    await page.waitForSelector('#blogname', { timeout: 15000 });
    
    await page.fill('#blogname', 'Vedang Vatsa FRSA');
    await page.fill('#blogdescription', 'Founder, Hashtag Web3 | MTech, MBA, Chartered Engineer');
    
    await page.click('#submit');
    await sleep(2000);
    console.log('  ✅ Site settings updated successfully.');
  } catch (err: any) {
    console.log('  ⚠️ Could not auto-update settings via wp-admin (might be blocked by new UI).');
  }

  // 2. CREATE/UPDATE ABOUT PAGE
  console.log('📝 Creating the About page...');
  try {
    await page.goto(`https://wordpress.com/page/${SITE_DOMAIN}`);
    await page.waitForSelector('h1.editor-post-title__input', { state: 'visible', timeout: 30000 });
    
    await page.fill('h1.editor-post-title__input', 'About');
    await sleep(500);
    await page.keyboard.press('Tab');
    await sleep(500);

    await page.evaluate((content) => {
      const activeElement = document.activeElement as any;
      if (activeElement && activeElement.isContentEditable) {
        activeElement.innerText = content;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, VEDANG_ABOUT_TEXT);
    await sleep(1000);

    await page.click('button.editor-post-publish-panel__toggle');
    await sleep(1000);
    await page.click('button.editor-post-publish-button');
    console.log('  ✅ About page created successfully.');
    await sleep(3000);
  } catch (err: any) {
    console.log('  ⚠️ Could not auto-create About page.');
  }

  // 3. PUBLISH ESSAYS
  for (let i = 0; i < files.length; i++) {
    const slug = files[i].replace('.mdx', '');
    const essay = extractEssayContent(slug);
    if (!essay) continue;

    console.log(`\n[${i + 1}/${files.length}] Publishing: ${essay.title}`);

    try {
      await page.goto(`https://wordpress.com/post/${SITE_DOMAIN}`);
      await page.waitForSelector('h1.editor-post-title__input', { state: 'visible', timeout: 30000 });
      
      await page.fill('h1.editor-post-title__input', essay.title);
      await sleep(500);

      await page.keyboard.press('Tab');
      await sleep(500);

      await page.evaluate((content) => {
        const activeElement = document.activeElement as any;
        if (activeElement && activeElement.isContentEditable) {
          activeElement.innerText = content;
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, essay.body);
      await sleep(1000);

      await page.click('button.editor-post-publish-panel__toggle');
      await sleep(1000);
      await page.click('button.editor-post-publish-button');
      
      console.log(`  ✅ Successfully published!`);
      await sleep(3000); 
    } catch (err: any) {
      console.error(`  ❌ Failed to publish ${essay.title}: ${err.message}`);
    }
  }

  console.log(`\n🎉 WordPress frontend syndication complete!`);
  await context.close();
}

main().catch(console.error);
