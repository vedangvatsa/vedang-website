import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_THREAD_DIR = path.join(REPO_ROOT, 'public', 'images', 'thread');
const COMMON_DIR = path.join(PUBLIC_THREAD_DIR, 'common');

if (!fs.existsSync(COMMON_DIR)) {
  fs.mkdirSync(COMMON_DIR, { recursive: true });
}

// Copy common assets
fs.copyFileSync(
  '/Users/vedang/Desktop/university_ai_courses_thread_images/courses_v2.png',
  path.join(COMMON_DIR, 'courses_v2.png')
);
fs.copyFileSync(
  '/Users/vedang/Desktop/web3_ai_depin_thread_images/web3_channels.png',
  path.join(COMMON_DIR, 'web3_channels.png')
);
console.log('✅ Copied common typography cards to public/images/thread/common/');

const mapping = {
  'university-ai-courses-thread': {
    dir: '/Users/vedang/Desktop/university_ai_courses_thread_images',
    folder: 'university_ai_courses',
    date: '2026-11-11',
    time: '17:05'
  },
  'prompt-engineering-thread': {
    dir: '/Users/vedang/Desktop/prompt_engineering_thread_images',
    folder: 'prompt_engineering',
    date: '2026-11-12',
    time: '01:05'
  },
  'local-ai-models-thread': {
    dir: '/Users/vedang/Desktop/local_ai_models_thread_images',
    folder: 'local_ai_models',
    date: '2026-11-12',
    time: '09:05'
  },
  'ai-code-editors-thread': {
    dir: '/Users/vedang/Desktop/ai_code_editors_thread_images',
    folder: 'ai_code_editors',
    date: '2026-11-12',
    time: '17:05'
  },
  'production-rag-thread': {
    dir: '/Users/vedang/Desktop/production_rag_thread_images',
    folder: 'production_rag',
    date: '2026-11-13',
    time: '01:05'
  },
  'web3-ai-depin-thread': {
    dir: '/Users/vedang/Desktop/web3_ai_depin_thread_images',
    folder: 'web3_ai_depin',
    date: '2026-11-13',
    time: '09:05'
  },
  'voice-multimodal-agents-thread': {
    dir: '/Users/vedang/Desktop/voice_multimodal_agents_thread_images',
    folder: 'voice_multimodal_agents',
    date: '2026-11-13',
    time: '17:05'
  },
  'smart-contract-security-thread': {
    dir: '/Users/vedang/Desktop/smart_contract_security_thread_images',
    folder: 'smart_contract_security',
    date: '2026-11-14',
    time: '01:05'
  },
  'ai-web-scrapers-thread': {
    dir: '/Users/vedang/Desktop/ai_web_scrapers_thread_images',
    folder: 'ai_web_scrapers',
    date: '2026-11-14',
    time: '09:05'
  },
  'ai-evaluation-testing-thread': {
    dir: '/Users/vedang/Desktop/ai_evaluation_testing_thread_images',
    folder: 'ai_evaluation_testing',
    date: '2026-11-14',
    time: '17:05'
  },
  'defi-architecture-thread': {
    dir: '/Users/vedang/Desktop/defi_architecture_thread_images',
    folder: 'defi_architecture',
    date: '2026-11-15',
    time: '01:05'
  },
  'computer-vision-models-thread': {
    dir: '/Users/vedang/Desktop/computer_vision_models_thread_images',
    folder: 'computer_vision_models',
    date: '2026-11-15',
    time: '09:05'
  }
};

const postsFilePath = path.join(REPO_ROOT, 'scripts', 'x-posts.json');
const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));

const RAW_BASE = 'https://raw.githubusercontent.com/vedangvatsa/vedang-website/main/public/images/thread';

let copiedCount = 0;
let updatedTweetImages = 0;

for (const [threadId, info] of Object.entries(mapping)) {
  const post = posts.find(p => p.id === threadId);
  if (!post) {
    console.error(`Post not found: ${threadId}`);
    continue;
  }

  // Update schedule date and time
  post.scheduleDate = info.date;
  post.scheduleTime = info.time;
  delete post.error;

  const targetDir = path.join(PUBLIC_THREAD_DIR, info.folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const hostedJson = JSON.parse(fs.readFileSync(path.join(info.dir, 'hosted_images.json'), 'utf8'));
  const urlToFilename = {};
  for (const [file, url] of Object.entries(hostedJson)) {
    urlToFilename[url] = file;
  }

  for (const tweet of post.tweets) {
    if (!tweet.image) continue;

    if (tweet.image === 'https://iili.io/nbTjh0J.png') {
      tweet.image = `${RAW_BASE}/common/courses_v2.png`;
      updatedTweetImages++;
    } else if (tweet.image === 'https://iili.io/nbTjUsn.png') {
      tweet.image = `${RAW_BASE}/common/web3_channels.png`;
      updatedTweetImages++;
    } else if (urlToFilename[tweet.image]) {
      const filename = urlToFilename[tweet.image];
      const srcFile = path.join(info.dir, filename);
      const destFile = path.join(targetDir, filename);

      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(srcFile, destFile);
        copiedCount++;
      }

      tweet.image = `${RAW_BASE}/${info.folder}/${filename}`;
      updatedTweetImages++;
    } else {
      console.warn(`Could not resolve image in ${threadId}: ${tweet.image}`);
    }
  }

  console.log(`✅ Synced ${threadId} -> scheduled: ${info.date} ${info.time} IST`);
}

fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
console.log(`\n🎉 Migration complete!`);
console.log(`- Copied ${copiedCount} files to public/images/thread/`);
console.log(`- Updated ${updatedTweetImages} tweet image URLs in x-posts.json`);
