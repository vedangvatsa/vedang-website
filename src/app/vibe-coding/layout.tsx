import { ReactNode } from "react";
import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
export default function CourseLayout({ children }: { children: ReactNode }) {
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
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Vibe Coding 101</h4>
                        </div>
                        <nav className="space-y-3">
                        <Link href="/vibe-coding" className="block text-sm font-medium hover:text-primary transition-colors">Course Overview</Link>
                        <Link href="/vibe-coding/module-1-philosophy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">1. The Philosophy</Link>
                        <Link href="/vibe-coding/module-2-toolkit" className="block text-sm text-muted-foreground hover:text-primary transition-colors">2. The Modern Toolkit</Link>
                        <Link href="/vibe-coding/module-3-prompts" className="block text-sm text-muted-foreground hover:text-primary transition-colors">3. The Art of the Prompt</Link>
                        <Link href="/vibe-coding/module-4-lab" className="block text-sm text-muted-foreground hover:text-primary transition-colors">4. Lab: Name Generator</Link>
                        <Link href="/vibe-coding/module-5-product" className="block text-sm text-muted-foreground hover:text-primary transition-colors">5. To Professional Product</Link>
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
