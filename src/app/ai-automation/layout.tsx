import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const modules = [
    { href: "/ai-automation", label: "Course Overview" },
    { href: "/ai-automation/module-1-mindset", label: "1. Automation Mindset" },
    { href: "/ai-automation/module-2-apis", label: "2. API Fundamentals" },
    { href: "/ai-automation/module-3-nocode", label: "3. No-Code Tools" },
    { href: "/ai-automation/module-4-agents", label: "4. AI Agents" },
    { href: "/ai-automation/module-5-mcp-automation", label: "5. MCP Automation" },
    { href: "/ai-automation/module-6-pipelines", label: "6. Custom Pipelines" },
    { href: "/ai-automation/module-7-production", label: "7. Production & Monitoring" },
];

export default function AIAutomationCourseLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
                <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-1/3 space-y-6">
                        <Card className="shadow-sm bg-muted/30 border-muted">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                                    <BookOpen className="h-5 w-5" />
                                    <h4 className="font-semibold text-sm uppercase tracking-wider">AI Automation 101</h4>
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
