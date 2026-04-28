import { CourseSidebar } from "@/components/course-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

const courseLinks = [
    {
        title: "Introduction",
        links: [
            { href: "/prompt-engineering-101", label: "Overview", disabled: false },
        ]
    },
    {
        title: "Modules",
        links: [
            { href: "/prompt-engineering-101/module-1-core-idea", label: "1. The Core Idea", disabled: false },
            { href: "/prompt-engineering-101/module-2-core-techniques", label: "2. Core Techniques", disabled: false },
            { href: "/prompt-engineering-101/module-3-advanced-reasoning", label: "3. Advanced Reasoning", disabled: false },
            { href: "/prompt-engineering-101/module-4-code-prompting", label: "4. Code Prompting", disabled: false },
            { href: "/prompt-engineering-101/module-5-best-practices", label: "5. Best Practices", disabled: false },
        ]
    }
];

export default function PromptEngineeringCourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            {/* Sidebar is hidden on mobile, visible on lg screens */}
            <aside className="hidden lg:block w-64 shrink-0 border-r bg-muted/30">
                <div className="sticky top-0 h-screen overflow-y-auto py-8">
                    <CourseSidebar courseName="Prompt Engineering 101" sections={courseLinks} />
                </div>
            </aside>

            {/* Main content area */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="absolute top-4 right-4 z-50">
                   <ThemeToggle />
                </div>
                {/* Mobile Sidebar Navigation */}
                <div className="lg:hidden mb-8 border-b pb-4">
                    <CourseSidebar courseName="Prompt Engineering 101" sections={courseLinks} />
                </div>
                {children}
            </main>
        </div>
    );
}
