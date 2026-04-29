import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import { CourseSidebar } from '@/components/course-sidebar';
import { courseConfigs } from '@/lib/course-config';

const config = courseConfigs['agentic-web'];

export default function AgenticWebCourseLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
                <CourseSidebar {...config} />
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </PageLayout>
    );
}
