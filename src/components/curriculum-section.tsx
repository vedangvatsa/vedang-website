import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CurriculumItem {
  href: string;
  title: string;
  description: string;
}

interface CurriculumSectionProps {
  description: string;
  items: CurriculumItem[];
}

export function CurriculumSection({ description, items }: CurriculumSectionProps) {
  return (
    <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
      <div className="max-w-none">
        <div className="text-left mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-6 rounded-lg border bg-card hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
