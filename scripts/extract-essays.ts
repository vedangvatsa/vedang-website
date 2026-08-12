// scripts/extract-essays.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Essay {
  id: string;
  title: string;
  slug: string;
  body: string;
  frontmatter: Record<string, any>;
}

const essaysDir = path.resolve(__dirname, '..', '..', 'content', 'essays');

function getAllEssayFiles(): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(essaysDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(path.join(essaysDir, entry.name));
    }
  }
  return files;
}

function loadEssays(): Essay[] {
  const essayFiles = getAllEssayFiles();
  const essays: Essay[] = [];
  for (const filePath of essayFiles) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const slug = path.basename(filePath, '.md');
    essays.push({
      id: slug,
      title: data.title ?? slug,
      slug,
      body: content,
      frontmatter: data,
    });
  }
  return essays;
}

const essays = loadEssays();
const outPath = path.resolve(__dirname, '..', 'essays.json');
fs.writeFileSync(outPath, JSON.stringify(essays, null, 2), 'utf-8');
console.log(`Extracted ${essays.length} essays to ${outPath}`);
