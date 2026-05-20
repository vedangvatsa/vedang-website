import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { courseConfigs } from '@/lib/course-config';
import { CourseModuleLayout } from '@/components/courses/course-module-layout';

// Custom visual components for this course
import { 
  ActionWebEvolution, AgentComponents, AgenticDimensions, AgenticApps, 
  AgenticFuture, ProtocolDiagram, AgentBuildSteps, WebParadigmStats, 
  ToolEcosystem, AutonomySpectrum, AgenticIndustryAdoption, AgentRiskMatrix, 
  AgentProtocolComparison, AgentBuildChecklist 
} from '@/components/courses/agentic-visuals';

const customComponents = {
  ActionWebEvolution, AgentComponents, AgenticDimensions,
  AgenticApps, AgenticFuture, ProtocolDiagram, AgentBuildSteps,
  WebParadigmStats, ToolEcosystem, AutonomySpectrum, AgenticIndustryAdoption,
  AgentRiskMatrix, AgentProtocolComparison, AgentBuildChecklist
};

const config = courseConfigs['agentic-web'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'agentic-web');

export async function generateStaticParams() {
  return config.modules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  
  const moduleConfig = config.modules.find(m => m.slug === slug);
  let moduleTitle = moduleConfig?.title || slug;
  let moduleDesc = `Learn ${moduleTitle} in The Agentic Web course by Vedang Vatsa.`;
  
  try {
    const { data } = matter(fs.readFileSync(filePath, 'utf8'));
    if (data.title) moduleTitle = data.title;
    if (data.description) moduleDesc = data.description;
  } catch {}
  
  const title = `${moduleTitle} | The Agentic Web`;
  return {
    title: { absolute: title },
    description: moduleDesc,
    alternates: { canonical: `/agentic-web/${slug}` },
    openGraph: { title, description: moduleDesc, url: `https://veda.ng/agentic-web/${slug}` },
    twitter: { card: 'summary_large_image', title, description: moduleDesc },
  };
}

export default async function AgenticWebModulePage({ params }: { params: Promise<{ slug: string }> }) {
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
  } catch { 
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
