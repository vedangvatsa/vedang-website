import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
import { PredictionEngine, CoreTechniques, AdvancedReasoning, CodePrompting, BestPractices, RAGPipeline, PromptChaining, ModelComparison, PromptAnatomy, ReasoningStrategies, CodePromptPatterns, PromptAntiPatterns, RAGArchitecture, ChainTypes } from '@/components/courses/pe-visuals';

const mdxComponents = {
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
    PredictionEngine,
    CoreTechniques,
    AdvancedReasoning,
    CodePrompting,
    BestPractices,
    RAGPipeline,
    PromptChaining,
    ModelComparison, PromptAnatomy, ReasoningStrategies,
    CodePromptPatterns, PromptAntiPatterns, RAGArchitecture, ChainTypes,
    Link,
};
import matter from 'gray-matter';

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
    const title = `${moduleTitle} | Prompt Engineering 101 | Vedang Vatsa`;
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

    if (currentModuleIndex === -1) {
        notFound();
    }

    const currentModule = config.modules[currentModuleIndex];
    const prevModule = currentModuleIndex > 0 ? config.modules[currentModuleIndex - 1] : null;
    const nextModule = currentModuleIndex < config.modules.length - 1 ? config.modules[currentModuleIndex + 1] : null;

    const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        notFound();
    }

    return (
        <article className="prose dark:prose-invert max-w-none">
            <div className="mb-8">
                <Badge variant="secondary" className="mb-4">
                    Module {currentModuleIndex + 1} of {config.modules.length}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {currentModule.title}
                </h1>
            </div>

            <div className="mt-8">
                <MDXRemote source={fileContent} components={mdxComponents} />
            </div>

            <MarkComplete 
                courseId={config.courseId} 
                moduleSlug={slug} 
                prevModule={prevModule}
                nextModule={nextModule}
                basePath={config.basePath}
            />
        </article>
    );
}
