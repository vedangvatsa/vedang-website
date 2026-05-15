
import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glossaryTerms } from '@/lib/glossary';
import { courseConfigs } from '@/lib/course-config';

const BASE_URL = 'https://veda.ng';

// Stable fallback date for content without explicit dates
const CONTENT_FALLBACK_DATE = new Date('2025-01-01');

function getEssayRoutes(): MetadataRoute.Sitemap {
  const essaysDirectory = path.join(process.cwd(), 'src', 'content', 'essays');
  if (!fs.existsSync(essaysDirectory)) {
    return [];
  }

  try {
    const essayFiles = fs.readdirSync(essaysDirectory);
    return essayFiles
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const slug = file.replace(/\.mdx$/, '');
        const fullPath = path.join(essaysDirectory, file);
        let lastModified = CONTENT_FALLBACK_DATE;
        try {
          const raw = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(raw);
          if (data.lastUpdated) lastModified = new Date(data.lastUpdated);
          else if (data.date) lastModified = new Date(data.date);
        } catch {
          // use fallback
        }
        return {
          url: `${BASE_URL}/${slug}`,
          lastModified,
        };
      });
  } catch (error) {
    console.error('Could not read essays directory for sitemap:', error);
    return [];
  }
}

function getCourseModuleRoutes(): MetadataRoute.Sitemap {
  const buildDate = new Date();
  const routes: MetadataRoute.Sitemap = [];

  for (const [courseKey, config] of Object.entries(courseConfigs)) {
    // Course landing page
    routes.push({
      url: `${BASE_URL}${config.basePath}`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Course final exam page (if it exists)
    const examPath = path.join(process.cwd(), 'src', 'app', courseKey, 'final-exam');
    if (fs.existsSync(examPath)) {
      routes.push({
        url: `${BASE_URL}${config.basePath}/final-exam`,
        lastModified: buildDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    // Individual module pages
    for (const mod of config.modules) {
      routes.push({
        url: `${BASE_URL}${config.basePath}/${mod.slug}`,
        lastModified: buildDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Use build-time date so Google sees fresh crawl signals after each deploy
  const buildDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: buildDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/writings`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/glossary`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/ai-reports`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/web3-reports`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/health-protocols`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ai-discovery-standards`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/swarm-prediction`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/swarm-prediction/wiki`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/profile`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/media`, lastModified: buildDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/community`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/seo`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/lit`, lastModified: buildDate, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const glossaryRoutes: MetadataRoute.Sitemap = glossaryTerms.map(term => ({
    url: `${BASE_URL}/glossary/${term.slug}`,
    lastModified: buildDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const essayRoutes = getEssayRoutes();
  const courseRoutes = getCourseModuleRoutes();

  const allRoutes = [...staticPages, ...courseRoutes, ...glossaryRoutes, ...essayRoutes];

  // Deduplicate by URL
  const seen = new Set<string>();
  return allRoutes.filter(route => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
