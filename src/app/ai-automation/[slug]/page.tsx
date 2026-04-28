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
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { KnowledgeCheck } from '@/components/mdx/knowledge-check';
import { AutomationLayers, APIFlowDiagram, NoCodeToolsGrid, AgentArchitecture, MCPAutomationStack, PipelineBlueprint, MonitoringDashboard } from '@/components/courses/automation-visuals';

const coursesDirectory = path.join(process.cwd(), 'src', 'content', 'courses', 'ai-automation');

const modules = [
    { slug: 'module-1-mindset', title: '1. The Automation Mindset', description: 'See automation opportunities everywhere' },
    { slug: 'module-2-apis', title: '2. API Fundamentals', description: 'REST, auth, webhooks — the building blocks' },
    { slug: 'module-3-nocode', title: '3. No-Code Automation', description: 'n8n, Make, Zapier with AI nodes' },
    { slug: 'module-4-agents', title: '4. AI Agents as Automators', description: 'Claude, Antigravity, GPT for workflows' },
    { slug: 'module-5-mcp-automation', title: '5. MCP-Powered Automation', description: 'Connect agents to real-world services' },
    { slug: 'module-6-pipelines', title: '6. Building Custom Pipelines', description: 'End-to-end automated systems' },
    { slug: 'module-7-production', title: '7. Production & Monitoring', description: 'Scheduling, alerting, and scaling' },
];

export async function generateStaticParams() {
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
        title: `${moduleData.frontmatter.title} | AI Automation 101`,
        description: moduleData.frontmatter.description,
    };
}

const mdxComponents = {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    Card, CardHeader, CardTitle, CardContent, CardDescription,
    KnowledgeCheck, Link,
    AutomationLayers, APIFlowDiagram, NoCodeToolsGrid, AgentArchitecture,
    MCPAutomationStack, PipelineBlueprint, MonitoringDashboard,
};

export default async function CourseModulePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const moduleData = getCourseModule(slug);
    if (!moduleData) notFound();

    const currentIndex = modules.findIndex(m => m.slug === slug);
    const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
    const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

    return (
        <div className="max-w-none">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-4">{moduleData.frontmatter.title}</h1>
                <p className="text-xl text-muted-foreground">{moduleData.frontmatter.description}</p>
            </div>

            <article className="prose prose-zinc dark:prose-invert max-w-none">
                <MDXRemote 
                    source={moduleData.content} 
                    components={mdxComponents}
                    options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
            </article>

            <div className="mt-16 pt-8 border-t flex justify-between items-center">
                {prevModule ? (
                    <Link href={`/ai-automation/${prevModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />Previous: {prevModule.title}
                    </Link>
                ) : (
                    <Link href="/ai-automation" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />Back to Overview
                    </Link>
                )}
                {nextModule ? (
                    <Link href={`/ai-automation/${nextModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
                        Next: {nextModule.title}<ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                ) : (
                    <Link href="/ai-automation" className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
                        Back to Overview<ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
