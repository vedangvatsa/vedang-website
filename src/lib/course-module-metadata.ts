import type { Metadata } from 'next';
import { courseConfigs, type CourseId } from '@/lib/course-config';

/** Large title on generated course OG cards (matches opengraph-image.tsx). */
export const COURSE_OG_DISPLAY_TITLE: Record<CourseId, string> = {
  mcp: 'Model Context Protocol (MCP)',
  automation: 'AI Automation 101',
  web3: 'Web3 101',
  prompt: 'Prompt Engineering 101',
  agentic: 'The Agentic Web',
  vibecoding: 'Vibe Coding 101',
  'vibecoding-bootcamp': 'Vibe Coding Bootcamp',
};

/** Suffix in page & share titles (| MCP Development 101, etc.). */
export const COURSE_PAGE_TITLE_SUFFIX: Record<CourseId, string> = {
  mcp: 'MCP Development 101',
  automation: 'AI Automation 101',
  web3: 'Web3 101',
  prompt: 'Prompt Engineering 101',
  agentic: 'The Agentic Web',
  vibecoding: 'Vibe Coding 101',
  'vibecoding-bootcamp': 'Vibe Coding Bootcamp',
};

/** Static PNGs from scripts/generate-course-og.ts (served from public/). */
export function courseModuleOgImagePath(courseId: CourseId, slug: string): string {
  return `/og/courses/${courseId}/${slug}.png`;
}

export function courseLandingOgImagePath(courseId: CourseId): string {
  return `/og/courses/${courseId}/_landing.png`;
}

export function patchMetadataWithCourseLandingImage(
  metadata: Metadata,
  courseId: CourseId,
): Metadata {
  const imagePath = courseLandingOgImagePath(courseId);
  const ogImage = {
    url: imagePath,
    width: 1200,
    height: 630,
    alt: COURSE_OG_DISPLAY_TITLE[courseId],
    type: 'image/png' as const,
  };
  return {
    ...metadata,
    openGraph: {
      ...(typeof metadata.openGraph === 'object' ? metadata.openGraph : {}),
      images: [ogImage],
    },
    twitter: {
      ...(typeof metadata.twitter === 'object' ? metadata.twitter : {}),
      card: 'summary_large_image',
      images: [imagePath],
    },
  };
}

export function buildCourseModuleMetadata(
  courseId: CourseId,
  slug: string,
  frontmatter: { title?: string; description?: string },
): Metadata {
  const config = courseConfigs[courseId];
  const moduleTitle = frontmatter.title ?? config.courseTitle;
  const pageTitle = `${moduleTitle} | ${COURSE_PAGE_TITLE_SUFFIX[courseId]}`;
  const description = frontmatter.description ?? '';
  const canonicalPath = `${config.basePath}/${slug}`;
  const imagePath = courseModuleOgImagePath(courseId, slug);
  const ogImage = {
    url: imagePath,
    width: 1200,
    height: 630,
    alt: moduleTitle,
    type: 'image/png' as const,
  };

  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: pageTitle,
      description,
      url: `https://veda.ng${canonicalPath}`,
      siteName: 'Vedang Vatsa',
      locale: 'en_US',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [imagePath],
    },
  };
}