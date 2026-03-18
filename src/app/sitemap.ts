
import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glossaryTerms } from '@/lib/glossary';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/writings`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/glossary`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/profile`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/media`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/community`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/seo`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/vibe-coding`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/prompt-engineering-101`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/web3-101`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/agentic-web`, lastModified: new Date('2026-03-14') },
    { url: `${BASE_URL}/linkedin-translator`, lastModified: new Date('2026-03-18') },
  ];

  const glossaryRoutes: MetadataRoute.Sitemap = glossaryTerms.map(term => ({
    url: `${BASE_URL}/glossary/${term.slug}`,
    lastModified: CONTENT_FALLBACK_DATE,
  }));

  const essayRoutes = getEssayRoutes();

  const allRoutes = [...staticPages, ...glossaryRoutes, ...essayRoutes];

  // Deduplicate by URL
  const seen = new Set<string>();
  return allRoutes.filter(route => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  });
}
