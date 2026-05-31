import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CardGridItem {
  title: string;
  url: string;
  external?: boolean;
  date?: string;
}

interface CardGridProps {
  title: string;
  items: CardGridItem[];
  cta?: { label: string; url: string; external?: boolean };
  id?: string;
}

export function CardGrid({ title, items, cta, id }: CardGridProps) {
  return (
    <section id={id} className="py-8">
      <div>
        <h2 className="mb-5 text-center text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Link
              href={item.url}
              key={i}
              className="group"
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
            >
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border bg-card p-4 text-center md:text-left transition-colors duration-200 hover:border-primary/50">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                {item.date && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        {cta && (
          <div className="mt-5 flex justify-center">
            <Button variant="outline" asChild className="w-full md:max-w-sm">
              <Link
                href={cta.url}
                target={cta.external ? '_blank' : undefined}
                rel={cta.external ? 'noopener noreferrer' : undefined}
              >
                {cta.label}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
