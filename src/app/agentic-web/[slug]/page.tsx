import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { MarkComplete } from '@/components/mark-complete';
import { courseConfigs } from '@/lib/course-config';
import Link from 'next/link';

// Import all custom components used in MDX
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import { ActionWebEvolution, AgentComponents, AgenticDimensions, AgenticApps, AgenticFuture, ProtocolDiagram, AgentBuildSteps } from '@/components/courses/agentic-visuals';

const mdxComponents = {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent,
    Card, CardHeader, CardTitle, CardContent, CardDescription,
    KnowledgeCheck, ActionWebEvolution, AgentComponents, AgenticDimensions,
    AgenticApps, AgenticFuture, ProtocolDiagram, AgentBuildSteps, Link,
};

const config = courseConfigs['agentic-web'];
const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'agentic-web');

export async function generateStaticParams() {
    return config.modules.map((module) => ({ slug: module.slug }));
}

export default async function AgenticWebModulePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const currentModuleIndex = config.modules.findIndex((m) => m.slug === slug);
    if (currentModuleIndex === -1) notFound();

    const currentModule = config.modules[currentModuleIndex];
    const prevModule = currentModuleIndex > 0 ? config.modules[currentModuleIndex - 1] : null;
    const nextModule = currentModuleIndex < config.modules.length - 1 ? config.modules[currentModuleIndex + 1] : null;

    const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
    let fileContent;
    try { fileContent = fs.readFileSync(filePath, 'utf8'); } catch { notFound(); }

    return (
        <article className="prose dark:prose-invert max-w-none">
            <div className="mb-8">
                <Badge variant="secondary" className="mb-4">
                    Module {currentModuleIndex + 1} of {config.modules.length}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{currentModule.title}</h1>
            </div>
            <div className="mt-8">
                <MDXRemote source={fileContent} components={mdxComponents} />
            </div>
            {prevModule && (
                <div className="mt-8">
                    <Link href={`/agentic-web/${prevModule.slug}`} className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />Previous: {prevModule.title}
                    </Link>
                </div>
            )}
            <MarkComplete courseId={config.courseId} moduleSlug={slug} nextModule={nextModule} basePath={config.basePath} />
        </article>
    );
}
