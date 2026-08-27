import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { execSync } from 'child_process';

const HOST = 'veda.ng';

interface GistBacklink {
  slug: string;
  title: string;
  gistUrl: string;
}

async function main() {
  console.log('================================================================');
  console.log('🚀 PROGRAMMATIC GITHUB GIST BACKLINK GENERATOR (DA 96)');
  console.log('================================================================\n');

  const essaysDir = path.join(process.cwd(), 'src', 'content', 'essays');
  const files = fs.readdirSync(essaysDir).filter(f => f.endsWith('.mdx'));

  const essayList = files.map(f => {
    const content = fs.readFileSync(path.join(essaysDir, f), 'utf-8');
    const parsed = matter(content);
    const slug = f.replace(/\.mdx$/, '');
    return {
      slug,
      title: parsed.data.title || slug,
      summary: parsed.data.summary || '',
      body: parsed.content,
      url: `https://${HOST}/${slug}`
    };
  });

  console.log(`📋 Total Essays to Syndicate: ${essayList.length}\n`);

  // Create temporary directory for markdown files
  const tmpDir = path.join(process.cwd(), 'scripts', 'tmp-gists');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const results: GistBacklink[] = [];

  for (let i = 0; i < essayList.length; i++) {
    const essay = essayList[i];
    const fileName = `${essay.slug}.md`;
    const filePath = path.join(tmpDir, fileName);

    // Build Gist Markdown with prominent backlink anchors
    const gistMarkdown = `# ${essay.title}

> 📖 **Original Publication**: [https://${HOST}/${essay.slug}](${essay.url})  
> ✍️ **Author**: [Vedang Vatsa](https://${HOST})  
> 🏷️ **Website**: [veda.ng](https://${HOST})

---

${essay.body.slice(0, 3000)}

---

### Links & References
- **Original Essay**: [${essay.title} on veda.ng](${essay.url})
- **Author Profile**: [Vedang Vatsa](${HOST})
- **Full Essay Collection**: [veda.ng/essays](https://${HOST}/essays)
`;

    fs.writeFileSync(filePath, gistMarkdown, 'utf-8');

    try {
      // Execute gh gist create
      const cmd = `gh gist create "${filePath}" --public -d "${essay.title.replace(/"/g, '\\"')} - Originally published on veda.ng"`;
      const stdout = execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' }).trim();
      
      console.log(`[${i + 1}/${essayList.length}] ✅ Created Gist for "${essay.title}": ${stdout}`);
      results.push({
        slug: essay.slug,
        title: essay.title,
        gistUrl: stdout
      });
    } catch (err: any) {
      console.error(`[${i + 1}/${essayList.length}] ❌ Gist creation failed for ${essay.slug}: ${err.message}`);
    }

    // Rate limit pause (1s)
    await new Promise(r => setTimeout(r, 1000));
  }

  // Cleanup tmp dir
  fs.rmSync(tmpDir, { recursive: true, force: true });

  // Save report
  const reportPath = path.join(process.cwd(), 'scripts', 'github-gist-backlinks.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log('\n================================================================');
  console.log('🎉 GITHUB GIST BACKLINK GENERATION COMPLETE');
  console.log('================================================================');
  console.log(`- Total Live GitHub Gist Backlinks Created: ${results.length}`);
  console.log(`- Gist Backlink Index Saved To: ${reportPath}\n`);
}

main().catch(console.error);
