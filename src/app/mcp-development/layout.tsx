import { CourseSidebar } from "@/components/course-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const courseLinks = [
    {
        title: "Introduction",
        links: [
            { href: "/mcp-development", label: "Overview", disabled: false },
        ]
    },
    {
        title: "Modules",
        links: [
            { href: "/mcp-development/module-1-what-is-mcp", label: "1. What is MCP?", disabled: false },
            { href: "/mcp-development/module-2-transports", label: "2. Transports & Messages", disabled: false },
            { href: "/mcp-development/module-3-first-server", label: "3. Your First Server", disabled: false },
            { href: "/mcp-development/module-4-primitives", label: "4. Tools, Resources & Prompts", disabled: false },
            { href: "/mcp-development/module-5-clients", label: "5. Connecting to Clients", disabled: false },
            { href: "/mcp-development/module-6-real-world", label: "6. Real-World Servers", disabled: false },
            { href: "/mcp-development/module-7-production", label: "7. Production & Security", disabled: false },
        ]
    }
];

export default function MCPDevelopmentCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar is hidden on mobile, visible on lg screens */}
            <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30">
                <div className="sticky top-0 h-screen overflow-y-auto py-8">
                    <CourseSidebar courseName="MCP Development 101" sections={courseLinks} />
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="absolute top-4 right-4 z-50">
                   <ThemeToggle />
                </div>
                {/* Mobile Sidebar Navigation */}
                <div className="lg:hidden mb-8 border-b pb-4">
                    <CourseSidebar courseName="MCP Development 101" sections={courseLinks} />
                </div>
                {children}
            </main>
        </div>
    );
}
