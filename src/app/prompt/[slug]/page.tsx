import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { courseConfigs } from '@/lib/course-config';
import { buildCourseModuleMetadata } from '@/lib/course-module-metadata';
import { CourseModuleLayout } from '@/components/courses/course-module-layout';

// Custom visual components for Prompt Engineering
import { 
  PredictionEngine, CoreTechniques, AdvancedReasoning, CodePrompting, 
  BestPractices, RAGPipeline, PromptChaining, ModelComparison, 
  PromptAnatomy, ReasoningStrategies, CodePromptPatterns, 
  PromptAntiPatterns, RAGArchitecture, ChainTypes 
} from '@/components/courses/pe-visuals';

const customComponents = {
  PredictionEngine,
  CoreTechniques,
  AdvancedReasoning,
  CodePrompting,
  BestPractices,
  RAGPipeline,
  PromptChaining,
  ModelComparison,
  PromptAnatomy,
  ReasoningStrategies,
  CodePromptPatterns,
  PromptAntiPatterns,
  RAGArchitecture,
  ChainTypes,
};

const config = courseConfigs['prompt'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'prompt');

export const dynamicParams = false;

export async function generateStaticParams() {
  return config.modules.map((module) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(markdown);
  return buildCourseModuleMetadata('prompt', slug, frontmatter);
}

export default async function PromptEngineeringModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const currentModuleIndex = config.modules.findIndex((m) => m.slug === slug);
  if (currentModuleIndex === -1) notFound();

  const prevModule = currentModuleIndex > 0 ? config.modules[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < config.modules.length - 1 ? config.modules[currentModuleIndex + 1] : null;

  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  let fileContent;
  let moduleTitle = config.modules[currentModuleIndex].title;
  let moduleDescription = undefined;

  try {
    const fileRaw = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileRaw);
    fileContent = content;
    if (data.title) moduleTitle = data.title;
    if (data.description) moduleDescription = data.description;
  } catch (error) {
    notFound();
  }

  return (
    <CourseModuleLayout
      courseTitle={config.courseTitle}
      courseId={config.courseId}
      basePath={config.basePath}
      moduleSlug={slug}
      moduleTitle={moduleTitle}
      moduleDescription={moduleDescription}
      content={fileContent}
      currentModuleIndex={currentModuleIndex}
      totalModules={config.modules.length}
      prevModule={prevModule}
      nextModule={nextModule}
      customComponents={customComponents}
    />
  );
}
