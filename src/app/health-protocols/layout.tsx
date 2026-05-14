import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';

export default function HealthProtocolsLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 md:px-6 max-w-5xl py-12">
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </PageLayout>
    );
}
