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
import { MCPArchitecture, TransportDiagram, ServerSkeleton, MCPPrimitives, ClientEcosystem, DatabaseServerDiagram, ProductionChecklist } from '@/components/courses/mcp-visuals';

const coursesDirectory = path.join(process.cwd(), 'src', 'content', 'courses', 'mcp-development');

const modules = [
    { slug: 'module-1-what-is-mcp', title: '1. What is MCP?', description: 'The universal connector for AI' },
    { slug: 'module-2-transports', title: '2. Transports & Messages', description: 'How clients and servers communicate' },
    { slug: 'module-3-first-server', title: '3. Your First Server', description: 'Build a working MCP server from scratch' },
    { slug: 'module-4-primitives', title: '4. Tools, Resources & Prompts', description: 'The three primitives and when to use each' },
    { slug: 'module-5-clients', title: '5. Connecting to Clients', description: 'Claude Desktop, Cursor, VS Code, and custom apps' },
    { slug: 'module-6-real-world', title: '6. Real-World Servers', description: 'Database, API, and multi-tool patterns' },
    { slug: 'module-7-production', title: '7. Production & Security', description: 'Error handling, hardening, and publishing' },
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
        title: `${moduleData.frontmatter.title} | MCP Development 101`,
        description: moduleData.frontmatter.description,
    };
}

const mdxComponents = {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    KnowledgeCheck,
    MCPArchitecture,
    TransportDiagram,
    ServerSkeleton,
    MCPPrimitives,
    ClientEcosystem,
    DatabaseServerDiagram,
    ProductionChecklist,
    Link,
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
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                        }
                    }}
                />
            </article>

            <div className="mt-16 pt-8 border-t flex justify-between items-center">
                {prevModule ? (
                    <Link href={`/mcp-development/${prevModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous: {prevModule.title}
                    </Link>
                ) : (
                    <Link href="/mcp-development" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Overview
                    </Link>
                )}
                
                {nextModule ? (
                    <Link href={`/mcp-development/${nextModule.slug}`} className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
                        Next: {nextModule.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                ) : (
                    <Link href="/mcp-development" className="flex items-center text-sm font-medium hover:text-primary transition-colors text-right">
                        Back to Overview
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                )}
            </div>
        </div>
    );
}
