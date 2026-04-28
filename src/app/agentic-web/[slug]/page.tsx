import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Import all custom components used in MDX
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import { ActionWebEvolution, AgentComponents, AgenticDimensions, AgenticApps, AgenticFuture, ProtocolDiagram, AgentBuildSteps } from '@/components/courses/agentic-visuals';


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
    ActionWebEvolution,
    AgentComponents,
    AgenticDimensions,
    AgenticApps,
    AgenticFuture,
    ProtocolDiagram,
    AgentBuildSteps,
    Link,
};

const CONTENT_PATH = path.join(process.cwd(), 'src', 'content', 'courses', 'agentic-web');

const modules = [
    { slug: 'module-1-core-idea', title: '1. The Core Idea', description: 'From Information Web to Action Web' },
    { slug: 'module-2-components', title: '2. Core Components', description: 'The building blocks of agentic systems' },
    { slug: 'module-3-dimensions', title: '3. The Three Dimensions', description: 'Understanding the interconnected layers' },
    { slug: 'module-4-applications', title: '4. Applications', description: 'The Agentic Web in Action' },
    { slug: 'module-5-future', title: '5. Future Challenges', description: 'Security, ethics, and economics' },
    { slug: 'module-6-protocols', title: '6. Protocols: MCP & A2A', description: 'The standardized languages of the Agentic Web' },
    { slug: 'module-7-build-agent', title: '7. Build Your First Agent', description: 'A practical guide from design to deployment' },
];

export async function generateStaticParams() {
    return modules.map((module) => ({
        slug: module.slug,
    }));
}

export default async function AgenticWebModulePage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const currentModuleIndex = modules.findIndex((m) => m.slug === slug);

    if (currentModuleIndex === -1) {
        notFound();
    }

    const currentModule = modules[currentModuleIndex];
    const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
    const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null;

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
                    Module {currentModuleIndex + 1} of {modules.length}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                    {currentModule.title}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {currentModule.description}
                </p>
            </div>

            <div className="mt-8">
                <MDXRemote source={fileContent} components={mdxComponents} />
            </div>

            <hr className="my-12 border-muted" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {prevModule ? (
                    <Link
                        href={`/agentic-web/${prevModule.slug}`}
                        className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto p-4 border rounded-lg hover:bg-muted/50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <div className="text-left">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-1">Previous</div>
                            <div className="font-semibold">{prevModule.title}</div>
                        </div>
                    </Link>
                ) : (
                    <div className="w-full sm:w-auto" />
                )}

                {nextModule ? (
                    <Link
                        href={`/agentic-web/${nextModule.slug}`}
                        className="flex items-center justify-end text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto p-4 border rounded-lg hover:bg-muted/50"
                    >
                        <div className="text-right">
                            <div className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-1">Next</div>
                            <div className="font-semibold">{nextModule.title}</div>
                        </div>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                ) : (
                    <Link
                        href="/agentic-web"
                        className="flex items-center justify-end text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full sm:w-auto p-4 border border-primary/20 bg-primary/5 rounded-lg"
                    >
                        <div className="text-right">
                            <div className="text-xs uppercase tracking-wider text-primary/70 mb-1">Course Complete</div>
                            <div className="font-semibold">Return to Overview</div>
                        </div>
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                )}
            </div>
        </article>
    );
}
