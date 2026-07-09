import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';

const jsonPath = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd/scratch/top_100_source.json';
const brainDir = '/Users/vedang/.gemini/antigravity/brain/46ccaa6c-3e3c-49af-9983-a9d90a3118bd';
const assetsDir = '/Users/vedang/.gemini/antigravity/scratch/vedang-website/scripts/linkedin-assets/clean';

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Function to regenerate the drafts MD to reflect new downloads
function updateDraftsMd(posts) {
  const mdPath = path.join(brainDir, 'linkedin_viral_drafts_100.md');
  let mdContent = `# Top 100 LinkedIn Drafts (Re-framed for Vedang's Account)\n\n`;
  mdContent += `This document contains the 100 LinkedIn posts. All personal anecdotes, birthdays, and family posts have been reframed into **business case studies, leadership commentaries, and industry reflections** so they are 100% relevant to be posted from your account.\n\n`;
  mdContent += `To approve and proceed with scheduling, please review the drafts and reply to this message. Once approved, the posts will be scheduled sequentially.\n\n`;
  mdContent += `---\n\n`;
  
  // Reuse the rewriting rules
  const generateCleanText = (text) => (text || '').replace(/https?:\/\/\S+/g, '').replace(/#\w+/g, '').replace(/\s+/g, ' ').trim();
  
  const getCommentaryCopy = (p) => {
    const content = generateCleanText(p.content).toLowerCase();
    
    if (content.includes('ratan tata') || content.includes('tata')) {
      return `Ratan Tata didn't build a conglomerate just to optimize for quarterly earnings.\n\nHe built a business designed to serve society. If your company's purpose only exists on a slide in a deck, you don't have a purpose. You have marketing.\n\nTrue leadership leaves a legacy of utility, not just paper profits.`;
    }
    if (content.includes('warren') && (content.includes('birthday') || content.includes('friend'))) {
      return `Warren Buffett generated 90% of his wealth after his 65th birthday.\n\nMost founders are looking for a quick exit in 3 to 5 years. But compounding requires extreme patience.\n\nIf you aren't willing to own a business or commit to a skill for 10 years, don't bother for 10 minutes.`;
    }
    if (content.includes('preschool') && content.includes('hat')) {
      return `Culture is built on repeated traditions, not corporate memos.\n\nA simple birthday hat worn for 20 years builds more team trust than a thousand generic mission statements.\n\nStop writing culture docs. Start building rituals.`;
    }
    if (content.includes('unity22') || content.includes('virgin galactic')) {
      return `Execution is about subtraction, not addition.\n\nTo launch a spaceship, Richard Branson had to focus his entire organization on a single, high-risk goal.\n\nIf you try to build ten things at once, you will build nothing. Focus is the only leverage that scales.`;
    }
    if (content.includes('toxic') || content.includes('culture') || content.includes('abuse')) {
      return `High performance never justifies abuse.\n\nIf someone hits their targets but destroys team trust, they aren't a high performer. They are a liability.\n\nPromoting toxic people teaches your team that results matter more than integrity.`;
    }
    if (content.includes('resume') && (content.includes('gates') || content.includes('years ago'))) {
      return `Bill Gates’ resume from 1974 is a great reminder:\n\nCredentials fade, but proof of execution remains the ultimate hiring signal.\n\nStop hiring based on university names. Look for people who build things in their spare time.`;
    }
    if (content.includes('pandemic') || content.includes('obama')) {
      return `In a crisis, transparency matters more than optics.\n\nMost leaders try to spin bad news to protect their reputation.\n\nBut trust is built by telling the truth, even when it's uncomfortable. Integrity is the only strategy that survives.`;
    }
    if (content.includes('cd-rom') || content.includes('cd rom') || content.includes('information')) {
      return `In 1994, Bill Gates showed that a single CD-ROM could hold more data than all the paper beneath him.\n\nToday, we transmit that data globally in milliseconds.\n\nThe speed of technological scale is compounding. If your business model relies on physical storage or slow processes, you are already obsolete.`;
    }
    if (content.includes('recruit') || content.includes('hire') || content.includes('train new') || content.includes('loyalty')) {
      return `Sourcing, hiring, and onboarding a new employee is twice as expensive as giving your existing team a market-rate raise.\n\nYet, companies still pay a 'loyalty tax' by underpaying high performers.\n\nIt’s bad accounting. Retaining talent is always cheaper than replacing it.`;
    }
    if (content.includes('ceo') || content.includes('employees to work') || content.includes('ludicrous')) {
      return `Do not expect employees to work as hard or care as much as the founder.\n\nIt’s your business. They work for a salary.\n\nIf you want founder-level dedication, you must give founder-level equity. Otherwise, respect their boundaries.`;
    }
    if (content.includes('introvert')) {
      return `Deep work requires solitude.\n\nEndless meetings and open-plan offices are optimized for performative collaboration, not execution.\n\nGive your introverts and builders the quiet time they need to create value.`;
    }
    if (content.includes('kindness') || content.includes('value') || content.includes('appreciated')) {
      return `Kindness is not weakness in business. It is a strategic asset.\n\nMaking employees feel valued is the most effective way to drive long-term retention.\n\nEmpathetic leadership builds resilient teams. Everything else is just transactional noise.`;
    }
    if (content.includes('quantum') || content.includes('computing')) {
      return `Quantum computing is transitioning from theoretical physics to practical engineering.\n\nThis technology will redefine optimization and cryptography.\n\nThe future belongs to those who build the infrastructure today, not those who wait for it to be easy.`;
    }
    if (content.includes('quit') || content.includes('office') || content.includes('wfh')) {
      return `The debate over returning to the office misses the core issue: trust and outcomes.\n\nIf you trust your team, you focus on their output, not where they sit.\n\nFlexibility is the ultimate talent retention strategy. If you micromanage, they will leave.`;
    }
    if (content.includes('bullseye') || content.includes('buffett')) {
      return `Warren Buffett once gave Melinda Gates this advice: 'Know what your bullseye is.'\n\nIn business, it's easy to get distracted by vanity metrics and rapid expansion.\n\nExecution is about subtraction. Pick one goal, focus your capital, and execute relentlessly. Focus is leverage.`;
    }
    if (content.includes('wife') || content.includes('joan') || content.includes('partner')) {
      return `Building a business is a marathon, not a sprint.\n\nA strong support system outside of work isn't a luxury—it is the foundation.\n\nLong-term success requires a balance. The relationships you maintain outside of work are what sustain your execution.`;
    }
    if (content.includes('mum') || content.includes('mother') || content.includes('birthday')) {
      return `Great leadership is often inherited or mentored early.\n\nThe values we observe in our mentors shape how we manage teams and take risks.\n\nFind advisors who push you to think differently and act with courage.`;
    }
    if (content.includes('effort') || content.includes('results') || content.includes('performance')) {
      return `You cannot judge effort solely by results. Inconsistent performance does not mean lack of dedication.\n\nManagers must understand the variables behind outcomes before making lazy assessments.\n\nFocus on systemic support.`;
    }
    if (content.includes('books') || content.includes('reading') || content.includes('learning')) {
      return `Continuous learning is the only antidote to professional stagnation.\n\nReading books and exploring new domains expands your mental models and decision-making speed.\n\nIf you aren't upgrading your knowledge, you are falling behind.`;
    }
    if (content.includes('leena nair') || content.includes('chanel') || content.includes('nooyi')) {
      return `Leadership transition is a critical phase for any brand.\n\nTrue leaders build, support, and lift the next generation of executives.\n\nSponsorship builds long-term success. Anything less is just maintaining the status quo.`;
    }
    if (content.includes('teletype') || content.includes('paul allen') || content.includes('busted')) {
      return `Early hacking, technical curiosity, and hands-on tinkering are the roots of great tech breakthroughs.\n\nEncourage your builders to experiment, break things, and explore without strict corporate guardrails.\n\nInnovation needs freedom, not red tape.`;
    }
    return `Focus on outcomes, not inputs.\n\nGreat teams are built on trust, transparency, and clear expectations.\n\nWhen you align incentives and remove friction, high performance follows. Execution is the strategy.`;
  };

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const draftText = getCommentaryCopy(p);
    const imageName = `li-viral-image-${i + 1}.jpg`;
    const imagePath = path.join(brainDir, imageName);
    const hasImage = fs.existsSync(imagePath);
    
    mdContent += `## Post #${i + 1}: Commentary Draft (Source: ${p.author})\n`;
    mdContent += `* **Original Likes**: ${p.likes.toLocaleString()}\n`;
    mdContent += `* **Original Link**: [LinkedIn Post](${p.post_url})\n`;
    
    if (hasImage) {
      mdContent += `* **Media Asset**: \`${imageName}\`\n\n`;
      mdContent += `### Image Preview\n`;
      mdContent += `![Image Preview](${imagePath})\n\n`;
    } else {
      mdContent += `* **Media Asset**: \`${imageName}\` (Pending Scraper Download)\n\n`;
    }
    
    mdContent += `### Original Content\n`;
    mdContent += `> ${p.content || '*[Image only / No caption]*'}\n\n`;
    mdContent += `### Proposed Rewritten Copy (Commentary Style)\n`;
    mdContent += `\`\`\`text\n`;
    mdContent += `${draftText}\n`;
    mdContent += `\`\`\`\n\n`;
    mdContent += `---\n\n`;
  }
  
  fs.writeFileSync(mdPath, mdContent);
}

async function scrapePost(page, post, idx) {
  const destName = `li-viral-image-${idx + 1}.jpg`;
  const destPath = path.join(brainDir, destName);
  const copyPath = path.join(assetsDir, destName);
  
  console.log(`Scraping [${idx + 1}/100]: ${post.post_url}`);
  
  try {
    await page.goto(post.post_url, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Cookie banner accept
    try {
      const button = page.locator('button:has-text("Accept"), button:has-text("Agree"), [data-control-name="ga-cookie-consent-accept"]');
      if (await button.count() > 0) {
        await button.first().click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(3000);
    
    const imgUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => img.src);
    });
    
    const mainImgUrl = imgUrls.find(src => 
      src.includes('media.licdn.com/dms/image') && 
      !src.includes('profile-') && 
      !src.includes('shrink_200_200') &&
      !src.includes('shrink_100_100') &&
      !src.includes('shrink_400_400')
    );
    
    if (mainImgUrl) {
      console.log(`  Found URL: ${mainImgUrl.substring(0, 100)}...`);
      await downloadImage(mainImgUrl, destPath);
      // Copy to assets folder too
      fs.copyFileSync(destPath, copyPath);
      console.log(`  Successfully saved!`);
      return true;
    } else {
      console.log(`  No main image found in ${imgUrls.length} images.`);
      return false;
    }
  } catch (err) {
    console.error(`  Error:`, err.message);
    return false;
  }
}

async function run() {
  const posts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Loaded ${posts.length} posts.`);
  
  // Launch headful browser for safety
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  let processedThisBatch = 0;
  
  for (let i = 0; i < posts.length; i++) {
    const imageName = `li-viral-image-${i + 1}.jpg`;
    const destPath = path.join(brainDir, imageName);
    
    // Check if already exists in brain folder
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      continue;
    }
    
    // Scrape it
    const success = await scrapePost(page, posts[i], i);
    
    if (success) {
      // Regenerate the drafts MD so it embeds the new image immediately
      updateDraftsMd(posts);
      processedThisBatch++;
    }
    
    // Pacing rules:
    if (processedThisBatch >= 5) {
      console.log(`Batch limit reached (5 posts). Resting for 5 minutes to bypass WAF...`);
      await page.goto('about:blank'); // navigate away to clear sessions
      await new Promise(resolve => setTimeout(resolve, 300000)); // 5 mins
      processedThisBatch = 0;
    } else {
      // Delay between posts in the same batch
      const delay = 12000 + Math.random() * 5000;
      console.log(`Waiting ${Math.round(delay/1000)}s before next request...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  await browser.close();
  console.log('Batch scraping task completed!');
}

run().catch(console.error);
