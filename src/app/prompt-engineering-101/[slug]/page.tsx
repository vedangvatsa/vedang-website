import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { courseConfigs } from '@/lib/course-config';
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

const config = courseConfigs['prompt-engineering-101'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'prompt-engineering-101');

export async function generateStaticParams() {
  return config.modules.map((module) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  
  const moduleConfig = config.modules.find(m => m.slug === slug);
  let moduleTitle = moduleConfig?.title || slug;
  let moduleDesc = `Learn ${moduleTitle} in the Prompt Engineering 101 course by Vedang Vatsa.`;
  
  try {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    if (data.title) moduleTitle = data.title;
    if (data.description) moduleDesc = data.description;
  } catch {}
  
  const title = `${moduleTitle} | Prompt Engineering 101`;
  return {
    title: { absolute: title },
    description: moduleDesc,
    alternates: { canonical: `/prompt-engineering-101/${slug}` },
    openGraph: { title, description: moduleDesc, url: `https://veda.ng/prompt-engineering-101/${slug}` },
    twitter: { card: 'summary_large_image', title, description: moduleDesc },
  };
}

export default async function PromptEngineeringModulePage({ params }: { params: { slug: string } }) {
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
