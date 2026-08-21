import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface EssayBacklinkInfo {
  slug: string;
  title: string;
  url: string;
  summary: string;
  keywords: string[];
  shareLinks: {
    hackerNews: string;
    reddit: string;
    twitter: string;
    linkedIn: string;
    bluesky: string;
    pocket: string;
  };
  recommendedSubreddits: string[];
  searchQueries: {
    webMentions: string;
    githubMentions: string;
  };
}

const HOST = 'veda.ng';

function getRecommendedSubreddits(keywords: string[], category?: string): string[] {
  const defaults = ['r/technology', 'r/programming'];
  const text = (keywords.join(' ') + ' ' + (category || '')).toLowerCase();

  const map: Record<string, string[]> = {
    ai: ['r/MachineLearning', 'r/ArtificialInteligence', 'r/LocalLLaMA', 'r/Singularity'],
    agent: ['r/ArtificialInteligence', 'r/LocalLLaMA', 'r/programming'],
    web3: ['r/ethereum', 'r/CryptoCurrency', 'r/web3'],
    crypto: ['r/ethereum', 'r/CryptoCurrency'],
    blockchain: ['r/ethereum', 'r/web3'],
    india: ['r/india', 'r/IndiaTech'],
    yc: ['r/startups', 'r/ycombinator'],
    startup: ['r/startups', 'r/entrepreneur']
  };

  const subs = new Set<string>(defaults);

  for (const [key, list] of Object.entries(map)) {
    if (text.includes(key)) {
      list.forEach((s) => subs.add(s));
    }
  }

  return Array.from(subs);
}

function generateEmailOutreachTemplate(essay: EssayBacklinkInfo): string {
  return `Subject: Article idea / resource for your reader base: "${essay.title}"

Hi [Name],

I came across your newsletter / publication and noticed your recent work covering [Topic].

I recently published a deep-dive research essay on ${essay.title} (https://${HOST}/${essay.slug}).

Key takeaways from the piece:
- ${essay.summary || essay.title}

If you think your readers would find value in this analysis, feel free to reference or link to it in an upcoming issue.

Best regards,
Vedang Vatsa
https://${HOST}
`;
}

async function main() {
  console.log('🔗 Generating Backlink & Distribution Matrix for 68 Essays...\n');

  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  if (!fs.existsSync(essaysDir)) {
    console.error('❌ Essays directory not found:', essaysDir);
    process.exit(1);
  }

  const files = fs.readdirSync(essaysDir).filter((f) => f.endsWith('.mdx'));
  const matrix: EssayBacklinkInfo[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const rawContent = fs.readFileSync(path.join(essaysDir, file), 'utf-8');
    const { data: frontmatter } = matter(rawContent);

    const title = frontmatter.title || slug;
    const summary = frontmatter.summary || '';
    const keywords = frontmatter.keywords || [];
    const essayUrl = `https://${HOST}/${slug}`;

    const shareLinks = {
      hackerNews: `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(essayUrl)}&t=${encodeURIComponent(title)}`,
      reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(essayUrl)}&title=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title}\n${essayUrl} via @vedangvatsa`)}`,
      linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(essayUrl)}`,
      bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${essayUrl}`)}`,
      pocket: `https://getpocket.com/save?url=${encodeURIComponent(essayUrl)}`
    };

    const recommendedSubreddits = getRecommendedSubreddits(keywords, frontmatter.category);

    matrix.push({
      slug,
      title,
      url: essayUrl,
      summary,
      keywords,
      shareLinks,
      recommendedSubreddits,
      searchQueries: {
        webMentions: `"${HOST}/${slug}" OR "${title}"`,
        githubMentions: `"${HOST}/${slug}"`
      }
    });
  }

  // Save to backlink-matrix.json
  const outputPath = path.join(process.cwd(), 'scripts', 'backlink-matrix.json');
  fs.writeFileSync(outputPath, JSON.stringify(matrix, null, 2), 'utf-8');
  console.log(`💾 Saved complete backlink matrix to ${outputPath}`);

  // Generate outreach templates file
  const outreachPath = path.join(process.cwd(), 'scripts', 'outreach-templates.md');
  let outreachContent = '# Essay Outreach & Distribution Playbook\n\n';

  for (const essay of matrix.slice(0, 10)) {
    // Top 10 sample templates
    outreachContent += `## Essay: ${essay.title}\n`;
    outreachContent += `**URL**: ${essay.url}\n`;
    outreachContent += `**Target Subreddits**: ${essay.recommendedSubreddits.join(', ')}\n\n`;
    outreachContent += '```text\n' + generateEmailOutreachTemplate(essay) + '```\n\n---\n\n';
  }

  fs.writeFileSync(outreachPath, outreachContent, 'utf-8');
  console.log(`📄 Saved outreach templates to ${outreachPath}`);

  // Display CLI summary
  console.log('\n📊 Backlink Strategy Matrix Summary:');
  console.log(`  Total Essays Processed: ${matrix.length}`);
  console.log(`  Total Distribution URLs Generated: ${matrix.length * 6}`);
  console.log('\nSample Essay Distribution Links (First 3):');

  for (const item of matrix.slice(0, 3)) {
    console.log(`\n📌 [${item.slug}] ${item.title}`);
    console.log(`   HN Submit:      ${item.shareLinks.hackerNews}`);
    console.log(`   Reddit Submit:  ${item.shareLinks.reddit}`);
    console.log(`   Subreddits:     ${item.recommendedSubreddits.join(', ')}`);
  }

  console.log('\n✨ Backlink CLI tool execution complete!');
}

main().catch((err) => {
  console.error('Fatal error in backlink tool:', err);
  process.exit(1);
});
