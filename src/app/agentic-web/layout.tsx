import { CourseSidebar } from "@/components/course-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const courseLinks = [
    {
        title: "Introduction",
        links: [
            { href: "/agentic-web", label: "Overview", disabled: false },
        ]
    },
    {
        title: "Modules",
        links: [
            { href: "/agentic-web/module-1-core-idea", label: "1. The Core Idea", disabled: false },
            { href: "/agentic-web/module-2-components", label: "2. Core Components", disabled: false },
            { href: "/agentic-web/module-3-dimensions", label: "3. The Three Dimensions", disabled: false },
            { href: "/agentic-web/module-4-applications", label: "4. Applications", disabled: false },
            { href: "/agentic-web/module-5-future", label: "5. Future Challenges", disabled: false },
            { href: "/agentic-web/module-6-protocols", label: "6. Protocols: MCP & A2A", disabled: false },
            { href: "/agentic-web/module-7-build-agent", label: "7. Build Your First Agent", disabled: false },
        ]
    }
];

export default function AgenticWebCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar is hidden on mobile, visible on lg screens */}
            <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30">
                <div className="sticky top-0 h-screen overflow-y-auto py-8">
                    <CourseSidebar courseName="The Agentic Web" sections={courseLinks} />
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="absolute top-4 right-4 z-50">
                   <ThemeToggle />
                </div>
                {/* Mobile Sidebar Navigation */}
                <div className="lg:hidden mb-8 border-b pb-4">
                    <CourseSidebar courseName="The Agentic Web" sections={courseLinks} />
                </div>
                {children}
            </main>
        </div>
    );
}
