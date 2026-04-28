import { CourseSidebar } from "@/components/course-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const courseLinks = [
    {
        title: "Introduction",
        links: [
            { href: "/ai-automation", label: "Overview", disabled: false },
        ]
    },
    {
        title: "Modules",
        links: [
            { href: "/ai-automation/module-1-mindset", label: "1. Automation Mindset", disabled: false },
            { href: "/ai-automation/module-2-apis", label: "2. API Fundamentals", disabled: false },
            { href: "/ai-automation/module-3-nocode", label: "3. No-Code Tools", disabled: false },
            { href: "/ai-automation/module-4-agents", label: "4. AI Agents", disabled: false },
            { href: "/ai-automation/module-5-mcp-automation", label: "5. MCP Automation", disabled: false },
            { href: "/ai-automation/module-6-pipelines", label: "6. Custom Pipelines", disabled: false },
            { href: "/ai-automation/module-7-production", label: "7. Production & Monitoring", disabled: false },
        ]
    }
];

export default function AIAutomationCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30">
                <div className="sticky top-0 h-screen overflow-y-auto py-8">
                    <CourseSidebar courseName="AI Automation 101" sections={courseLinks} />
                </div>
            </aside>
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="absolute top-4 right-4 z-50">
                   <ThemeToggle />
                </div>
                <div className="lg:hidden mb-8 border-b pb-4">
                    <CourseSidebar courseName="AI Automation 101" sections={courseLinks} />
                </div>
                {children}
            </main>
        </div>
    );
}
