import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import matter from 'gray-matter';
import { courseConfigs } from '@/lib/course-config';
import { CourseModuleLayout } from '@/components/courses/course-module-layout';

// Custom visual components for MCP
import { 
  MCPArchitecture, TransportDiagram, ServerSkeleton, MCPPrimitives, 
  ClientEcosystem, DatabaseServerDiagram, ProductionChecklist, 
  MCPEcosystemMap, TransportComparison, ServerBoilerplate, 
  PrimitiveMatrix, ClientCapabilities, IntegrationPatterns, ProductionReadiness 
} from '@/components/courses/mcp-visuals';

const customComponents = {
  MCPArchitecture,
  TransportDiagram,
  ServerSkeleton,
  MCPPrimitives,
  ClientEcosystem,
  DatabaseServerDiagram,
  ProductionChecklist,
  MCPEcosystemMap, TransportComparison, ServerBoilerplate,
  PrimitiveMatrix, ClientCapabilities, IntegrationPatterns, ProductionReadiness,
};

const config = courseConfigs['mcp-development'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'mcp-development');

export async function generateStaticParams() {
  if (!fs.existsSync(CONTENT_PATH)) return [];
  const files = fs.readdirSync(CONTENT_PATH);
  return files.map(file => ({
    slug: file.replace('.mdx', ''),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();

  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter } = matter(markdown);
  const title = `${frontmatter.title} | MCP Development 101`;
  const description = frontmatter.description;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/mcp-development/${slug}` },
    openGraph: { title, description, url: `https://veda.ng/mcp-development/${slug}` },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CourseModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();

  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdown);

  const currentIndex = config.modules.findIndex(m => m.slug === slug);
  const prevModule = currentIndex > 0 ? config.modules[currentIndex - 1] : null;
  const nextModule = currentIndex < config.modules.length - 1 ? config.modules[currentIndex + 1] : null;

  return (
    <CourseModuleLayout
      courseTitle={config.courseTitle}
      courseId={config.courseId}
      basePath={config.basePath}
      moduleSlug={slug}
      moduleTitle={frontmatter.title}
      moduleDescription={frontmatter.description}
      content={content}
      currentModuleIndex={currentIndex}
      totalModules={config.modules.length}
      prevModule={prevModule}
      nextModule={nextModule}
      customComponents={customComponents}
    />
  );
}
