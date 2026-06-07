import * as React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { MarkComplete } from '@/components/mark-complete';
import { GlossaryVisualizer } from '@/components/mdx/glossary-visualizer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import Link from 'next/link';

interface CourseModuleLayoutProps {
  courseTitle: string;
  courseId: string;
  basePath: string;
  moduleSlug: string;
  moduleTitle: string;
  moduleDescription?: string;
  content: string;
  currentModuleIndex: number;
  totalModules: number;
  prevModule: { slug: string; title: string } | null;
  nextModule: { slug: string; title: string } | null;
  customComponents?: Record<string, React.ComponentType<any>>;
}

export function CourseModuleLayout({
  courseTitle,
  courseId,
  basePath,
  moduleSlug,
  moduleTitle,
  moduleDescription,
  content,
  currentModuleIndex,
  totalModules,
  prevModule,
  nextModule,
  customComponents = {},
}: CourseModuleLayoutProps) {
  // Base components available in all courses
  const baseComponents = {
    GlossaryVisualizer,
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    KnowledgeCheck,
    Link,
  };

  const components = {
    ...baseComponents,
    ...customComponents,
  };

  return (
    <div className="max-w-none">
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-4 font-mono">
          <Link href={basePath} className="hover:text-foreground transition-colors">{courseTitle}</Link>
          <span>/</span>
          <span className="text-foreground">{currentModuleIndex + 1}<span className="text-muted-foreground/50"> / {totalModules}</span></span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {moduleTitle}
        </h1>
        {moduleDescription && (
          <p className="text-xl text-muted-foreground mt-2">
            {moduleDescription}
          </p>
        )}
      </div>

      <article className="prose prose-zinc max-w-none">
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>

      <MarkComplete
        courseId={courseId}
        moduleSlug={moduleSlug}
        prevModule={prevModule}
        nextModule={nextModule}
        basePath={basePath}
      />
    </div>
  );
}
