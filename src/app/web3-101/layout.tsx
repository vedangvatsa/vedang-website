import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.web3101.title,
  description: pageMetadata.web3101.description,
  url: pageMetadata.web3101.url,
  ogImageAlt: 'Web3 Fundamentals Course - Learn Blockchain & Decentralization',
});

export default function Web3CourseLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
         {/* Sidebar */}
         <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
             <div className="sticky top-1/3 space-y-6">
                 <Card className="shadow-sm bg-muted/30 border-muted">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                            <BookOpen className="h-5 w-5" />
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Web3 101</h4>
                        </div>
                        <nav className="space-y-3">
                        <Link href="/web3-101" className="block text-sm font-medium hover:text-primary transition-colors">Course Overview</Link>
                        <Link href="/web3-101/module-1-vision" className="block text-sm text-muted-foreground hover:text-primary transition-colors">1. The Vision</Link>
                        <Link href="/web3-101/module-2-bedrock" className="block text-sm text-muted-foreground hover:text-primary transition-colors">2. The Bedrock</Link>
                        <Link href="/web3-101/module-3-smart-contracts" className="block text-sm text-muted-foreground hover:text-primary transition-colors">3. Smart Contracts</Link>
                        <Link href="/web3-101/module-4-ecosystem" className="block text-sm text-muted-foreground hover:text-primary transition-colors">4. The Ecosystem</Link>
                        <Link href="/web3-101/module-5-getting-started" className="block text-sm text-muted-foreground hover:text-primary transition-colors">5. Getting Started</Link>
                        <Link href="/web3-101/module-6-future" className="block text-sm text-muted-foreground hover:text-primary transition-colors">6. The Future</Link>
                        <Link href="/web3-101/module-7-layer2s" className="block text-sm text-muted-foreground hover:text-primary transition-colors">7. Layer 2s & Scaling</Link>
                        <Link href="/web3-101/module-8-tokenomics" className="block text-sm text-muted-foreground hover:text-primary transition-colors">8. Tokenomics & Governance</Link>
                        </nav>
                    </CardContent>
                 </Card>
             </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 min-w-0">
            {children}
         </main>
      </div>
    </PageLayout>
  );
}
