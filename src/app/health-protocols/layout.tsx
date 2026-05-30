import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';

export default function HealthProtocolsLayout({ children }: { children: ReactNode }) {
    return (
        <PageLayout>
            <div className="py-12">
                {children}
            </div>
        </PageLayout>
    );
}
