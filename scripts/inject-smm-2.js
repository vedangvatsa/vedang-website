const fs = require('fs');

function addTrigger(file, platform, urlExtractor) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('triggerBoost(')) return; // already added

  // Add import
  if (!content.includes('smm-boost-trigger.js') && !content.includes('smm-boost-trigger.ts')) {
    content = content.replace(/(import .*;\n)+/, match => match + "import { triggerBoost } from './smm-boost-trigger.js';\n");
  }

  const targetRegex = /(post\.posted\s*=\s*true;.*?)(fs\.writeFileSync)/s;
  if (targetRegex.test(content)) {
    content = content.replace(targetRegex, (match, p1, p2) => {
      return p1 + `\n    try { triggerBoost('${platform}', ${urlExtractor}); } catch(e) {}\n    ` + p2;
    });
    fs.writeFileSync(file, content);
    console.log('Added to ' + file);
  }
}

addTrigger('scripts/instagram-scheduled-executor.ts', 'instagram', 'post.postUri || `https://instagram.com/`');
addTrigger('scripts/facebook-scheduled-executor.ts', 'facebook', 'post.postUri || `https://facebook.com/`');
addTrigger('scripts/threads-scheduled-executor.ts', 'threads', 'post.postUri || `https://threads.net/`');
