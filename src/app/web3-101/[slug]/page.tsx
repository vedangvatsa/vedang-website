import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import Image from 'next/image';
import { WebEvolution, BlockchainExplainer, SmartContractExplainer, Web3Ecosystem, Web3Passport, Web3Future, L2ScalingDiagram, TokenomicsVisual } from '@/components/courses/web3-visuals';

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
};

export default async function CourseModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleData = getCourseModule(slug);
  if (!moduleData) notFound();

  const allModules = [
    { slug: 'module-1-vision', title: '1. The Vision' },
    { slug: 'module-2-bedrock', title: '2. The Bedrock' },
    { slug: 'module-3-smart-contracts', title: '3. Smart Contracts' },
    { slug: 'module-4-ecosystem', title: '4. The Ecosystem' },
    { slug: 'module-5-getting-started', title: '5. Getting Started' },
    { slug: 'module-6-future', title: '6. The Future' },
    { slug: 'module-7-layer2s', title: '7. Layer 2s & Scaling' },
    { slug: 'module-8-tokenomics', title: '8. Tokenomics & Governance' },
  ];
  
  const currentIndex = allModules.findIndex(m => m.slug === slug);
  const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
  const nextModule = currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;

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

      <div className="mt-16 pt-8 border-t flex justify-between items-center">
        {prevModule ? (
          <Link href={`/web3-101/${prevModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous: {prevModule.title}
          </Link>
        ) : (
          <Link href="/web3-101" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Link>
        )}
        
        {nextModule ? (
          <Link href={`/web3-101/${nextModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
            Next: {nextModule.title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        ) : (
          <Link href="/web3-101" className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
            Back to Overview
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
