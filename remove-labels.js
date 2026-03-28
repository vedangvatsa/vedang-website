const fs = require('fs');
const glob = require('glob');

const files = [
  '/Users/vedang/vedang-website/src/content/essays/singapores-arc.mdx',
  '/Users/vedang/vedang-website/src/content/essays/towards-the-agentic-web.mdx',
  '/Users/vedang/vedang-website/src/content/essays/agentic-commerce.mdx',
  '/Users/vedang/vedang-website/src/content/essays/intuitive-singularity.mdx',
  '/Users/vedang/vedang-website/src/content/essays/asi-timeline.mdx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<SectionLabel>.*?<\/SectionLabel>\n?/g, '');
  content = content.replace(/<SectionLabel>.*?<\/SectionLabel>/g, '');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed', file);
}
