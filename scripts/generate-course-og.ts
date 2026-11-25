import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import {
  buildCourseOgImage,
} from '../src/lib/og-image';
import {
  COURSE_OG_DISPLAY_TITLE,
  courseLandingOgImagePath,
  courseModuleOgImagePath,
} from '../src/lib/course-module-metadata';
import { courseConfigs, type CourseId } from '../src/lib/course-config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_ROOT = path.join(REPO_ROOT, 'public', 'og', 'courses');

const LANDING_SUBTITLE: Record<CourseId, string> = {
  mcp: 'Free Developer Course',
  automation: 'Autonomous Workflows & Agents',
  web3: 'Decentralized Systems & Blockchain',
  prompt: 'Free Comprehensive Course',
  agentic: 'Autonomous AI Agents Course',
  vibecoding: 'AI Software Engineering Course',
  'vibecoding-bootcamp': '7-Day Sprint to Launch',
};

async function writeImage(filePath: string, image: Response) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const buf = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync(filePath, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(OUT_ROOT, { recursive: true });

  for (const courseId of Object.keys(courseConfigs) as CourseId[]) {
    const config = courseConfigs[courseId];
    const contentDir = path.join(REPO_ROOT, 'src', 'content', 'courses', courseId);
    if (!fs.existsSync(contentDir)) {
      console.warn(`skip missing course content: ${courseId}`);
      continue;
    }

    const displayTitle = COURSE_OG_DISPLAY_TITLE[courseId];
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'));

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const outPath = path.join(REPO_ROOT, 'public', courseModuleOgImagePath(courseId, slug).slice(1));
      if (fs.existsSync(outPath) && !process.env.FORCE_OG) {
        continue;
      }
      const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
      const { data } = matter(raw);
      const subtitle = data.title || config.courseTitle;
      const image = buildCourseOgImage({
        title: displayTitle,
        subtitle,
        url: `veda.ng${config.basePath}/${slug}`,
      });
      const bytes = await writeImage(outPath, image);
      console.log(`wrote ${path.relative(REPO_ROOT, outPath)} (${bytes} bytes)`);
    }

    const landingPath = path.join(REPO_ROOT, 'public', courseLandingOgImagePath(courseId).slice(1));
    if (!fs.existsSync(landingPath) || process.env.FORCE_OG) {
      const landingImage = buildCourseOgImage({
        title: displayTitle,
        subtitle: LANDING_SUBTITLE[courseId],
        url: `veda.ng${config.basePath}`,
      });
      const bytes = await writeImage(landingPath, landingImage);
      console.log(`wrote ${path.relative(REPO_ROOT, landingPath)} (${bytes} bytes)`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});