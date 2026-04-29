import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const modules = [
    { href: "/mcp-development", label: "Course Overview" },
    { href: "/mcp-development/module-1-what-is-mcp", label: "1. What is MCP?" },
    { href: "/mcp-development/module-2-transports", label: "2. Transports & Messages" },
    { href: "/mcp-development/module-3-first-server", label: "3. Your First Server" },
    { href: "/mcp-development/module-4-primitives", label: "4. Tools, Resources & Prompts" },
    { href: "/mcp-development/module-5-clients", label: "5. Connecting to Clients" },
    { href: "/mcp-development/module-6-real-world", label: "6. Real-World Servers" },
    { href: "/mcp-development/module-7-production", label: "7. Production & Security" },
];

export default function MCPDevelopmentCourseLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
                <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-1/3 space-y-6">
                        <Card className="shadow-sm bg-muted/30 border-muted">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                                    <BookOpen className="h-5 w-5" />
                                    <h4 className="font-semibold text-sm uppercase tracking-wider">MCP Development 101</h4>
                                </div>
                                <nav className="space-y-3">
                                    {modules.map((m, i) => (
                                        <Link key={m.href} href={m.href} className={`block text-sm ${i === 0 ? 'font-medium' : 'text-muted-foreground'} hover:text-primary transition-colors`}>
                                            {m.label}
                                        </Link>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>
                </aside>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </PageLayout>
    );
}
