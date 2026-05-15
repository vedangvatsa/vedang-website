const fs = require('fs');

function addTrigger(file, platform, urlExtractor) {
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
  } else {
    console.log('Could not match target in ' + file);
  }
}

addTrigger('scripts/x-scheduled-executor.ts', 'twitter', '`https://twitter.com/vedangvatsa/status/${post.postUri}`');
addTrigger('scripts/linkedin-scheduled-executor.ts', 'linkedin', 'post.postUri');
addTrigger('scripts/bluesky-scheduled-executor.ts', 'bluesky', 'uri');
