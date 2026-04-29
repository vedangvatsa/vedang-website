import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MarkComplete } from '@/components/mark-complete';
import { courseConfigs } from '@/lib/course-config';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import Image from 'next/image';
import { WebEvolution, BlockchainExplainer, SmartContractExplainer, Web3Ecosystem, Web3Passport, Web3Future, L2ScalingDiagram, TokenomicsVisual, DeFiStackDiagram, SecurityRedFlags } from '@/components/courses/web3-visuals';

const config = courseConfigs['web3-101'];
const coursesDirectory = path.join(process.cwd(), 'src', 'content', 'courses', 'web3-101');

export function generateStaticParams() {
  if (!fs.existsSync(coursesDirectory)) return [];
  const files = fs.readdirSync(coursesDirectory);
  return files.map(file => ({
    slug: file.replace('.mdx', ''),
  }));
}

function getCourseModule(slug: string) {
  const filePath = path.join(coursesDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(markdown);
  return { frontmatter, content };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const moduleData = getCourseModule(slug);
  if (!moduleData) notFound();
  return {
    title: `${moduleData.frontmatter.title} | Web3 101`,
    description: moduleData.frontmatter.description,
  };
}

const components = {
  Image: (props: any) => <Image {...props} alt={props.alt || 'Course module illustration'} />,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  KnowledgeCheck,
  Link,
  WebEvolution,
  BlockchainExplainer,
  SmartContractExplainer,
  Web3Ecosystem,
  Web3Passport,
  Web3Future,
  L2ScalingDiagram,
  TokenomicsVisual,
  DeFiStackDiagram,
  SecurityRedFlags,
};

export default async function CourseModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleData = getCourseModule(slug);
  if (!moduleData) notFound();

  const currentIndex = config.modules.findIndex(m => m.slug === slug);
  const prevModule = currentIndex > 0 ? config.modules[currentIndex - 1] : null;
  const nextModule = currentIndex < config.modules.length - 1 ? config.modules[currentIndex + 1] : null;

  return (
    <div className="max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">{moduleData.frontmatter.title}</h1>
        <p className="text-xl text-muted-foreground">{moduleData.frontmatter.description}</p>
      </div>

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <MDXRemote 
          source={moduleData.content} 
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            }
          }}
        />
      </article>

      <MarkComplete 
        courseId={config.courseId} 
        moduleSlug={slug} 
        prevModule={prevModule}
        nextModule={nextModule}
        basePath={config.basePath}
      />
    </div>
  );
}
