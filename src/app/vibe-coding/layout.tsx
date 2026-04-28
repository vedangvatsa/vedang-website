import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';

export default function CourseLayout({ children }: { children: ReactNode }) {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-12 flex flex-col md:flex-row gap-12">
         {/* Sidebar */}
         <aside className="w-full md:w-64 flex-shrink-0">
             <nav className="sticky top-24 space-y-3">
                 <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Vibe Coding 101</h4>
                 <div className="space-y-2">
                   <Link href="/vibe-coding" className="block text-sm hover:text-primary transition-colors">Course Overview</Link>
                   <Link href="/vibe-coding/module-1-philosophy" className="block text-sm hover:text-primary transition-colors">1. The Philosophy</Link>
                   <Link href="/vibe-coding/module-2-toolkit" className="block text-sm hover:text-primary transition-colors">2. The Modern Toolkit</Link>
                   <Link href="/vibe-coding/module-3-prompts" className="block text-sm hover:text-primary transition-colors">3. The Art of the Prompt</Link>
                   <Link href="/vibe-coding/module-4-lab" className="block text-sm hover:text-primary transition-colors">4. Lab: Name Generator</Link>
                   <Link href="/vibe-coding/module-5-product" className="block text-sm hover:text-primary transition-colors">5. To Professional Product</Link>
                 </div>
             </nav>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 min-w-0">
            {children}
         </main>
      </div>
    </PageLayout>
  );
}
