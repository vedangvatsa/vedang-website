import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGETS = [
  { name: 'Homepage', path: '/' },
  { name: 'Writings', path: '/writings' },
  { name: 'AI Reports Library', path: '/ai-reports' },
];

interface LHCategory {
  title: string;
  score: number; // 0 to 1
  description?: string;
}

interface LHReport {
  categories: {
    performance: LHCategory;
    accessibility: LHCategory;
    'best-practices': LHCategory;
    seo: LHCategory;
  };
}

async function run() {
  console.log('⚡ Starting Lighthouse audit on production server...');
  const reportPath = '/Users/vedang/.gemini/antigravity/brain/037cadf9-cedd-4bd3-b15d-2fc7f7b22ba1/lighthouse_scores_report.md';
  let md = `# 📊 Lighthouse Audit & Scores Report\n\n`;
  md += `*Generated using Lighthouse CLI (v12.8.2) in Headless Chrome environment.*\n`;
  md += `*Timestamp: ${new Date().toISOString()}*\n\n`;

  for (const target of TARGETS) {
    const url = `http://localhost:3000${target.path}`;
    const tempJsonPath = path.join(__dirname, `lh-${target.name.replace(/\s+/g, '-').toLowerCase()}.json`);

    console.log(`\n🚦 Auditing ${target.name} (${url})...`);
    try {
      // Run Lighthouse CLI
      execSync(
        `npx lighthouse ${url} --chrome-flags="--headless --no-sandbox" --output json --output-path=${tempJsonPath} --only-categories=performance,accessibility,best-practices,seo`,
        { stdio: 'inherit' }
      );

      const rawJson = fs.readFileSync(tempJsonPath, 'utf8');
      const data = JSON.parse(rawJson) as LHReport;

      // Extract scores
      const p = Math.round(data.categories.performance.score * 100);
      const a = Math.round(data.categories.accessibility.score * 100);
      const bp = Math.round(data.categories['best-practices'].score * 100);
      const s = Math.round(data.categories.seo.score * 100);

      // Clean temp file
      fs.unlinkSync(tempJsonPath);

      // Append results to markdown
      md += `## ${target.name} Audit (\`${target.path}\`)\n\n`;
      md += `| Category | Score | Status | Description |\n`;
      md += `|---|---|---|---|\n`;
      md += `| **Performance** | **${p}/100** | ${getBadge(p)} | Page speed, bundle size, and layout shifts |\n`;
      md += `| **Accessibility** | **${a}/100** | ${getBadge(a)} | Aria tags, keyboard focus, and contrast |\n`;
      md += `| **Best Practices** | **${bp}/100** | ${getBadge(bp)} | Security headers, console logs, and HTTPS |\n`;
      md += `| **SEO** | **${s}/100** | ${getBadge(s)} | Canonical URLs, title templates, and meta descriptions |\n\n`;

      md += `### Score Visual Card\n`;
      md += `\`\`\`\n`;
      md += `Performance:      [${getBar(p)}] ${p}%\n`;
      md += `Accessibility:    [${getBar(a)}] ${a}%\n`;
      md += `Best Practices:   [${getBar(bp)}] ${bp}%\n`;
      md += `SEO:              [${getBar(s)}] ${s}%\n`;
      md += `\`\`\`\n\n`;
      md += `---\n\n`;

    } catch (err: any) {
      console.error(`❌ Failed to audit ${target.name}:`, err.message);
      md += `## ${target.name} Audit (\`${target.path}\`) - FAILED\n\n`;
      md += `Error during execution: \`${err.message}\`\n\n---\n\n`;
    }
  }

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`\n🎉 Scores report written to: ${reportPath}`);
}

function getBadge(score: number): string {
  if (score >= 90) return '🟢 **Optimal (90-100)**';
  if (score >= 50) return '🟡 **Needs Improvement (50-89)**';
  return '🔴 **Poor (0-49)**';
}

function getBar(score: number): string {
  const filled = Math.round(score / 5);
  const empty = 20 - filled;
  return '='.repeat(filled) + ' '.repeat(empty);
}

run().catch(console.error);
