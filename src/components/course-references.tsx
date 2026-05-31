import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface ReferenceCategory {
  name: string;
  links: { name: string; url: string }[];
}

interface CourseReferencesProps {
  title?: string;
  subtitle?: string;
  categories: ReferenceCategory[];
  layout?: 'grid-3' | 'grid-4';
  align?: 'center' | 'left';
}

export function CourseReferences({ title = 'Learn More', subtitle, categories, layout = 'grid-4', align = 'center' }: CourseReferencesProps) {
  const isCenter = align === 'center';
  const gridClass = layout === 'grid-3'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

  return (
    <section id="references" className="py-8">
      <div className={`${isCenter ? 'text-center' : 'text-left'} mb-5`}>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className={`mt-2 text-base md:text-lg text-muted-foreground ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className={`mt-8 ${gridClass}`}>
        {categories.map((category) => (
          <div key={category.name} className="text-center">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              {category.name}
            </h3>
            <ul className="space-y-2">
              {category.links.map((link) => {
                const isInternal = link.url.startsWith('/');
                return (
                  <li key={link.url} className="flex justify-center">
                    <Link
                      href={link.url}
                      target={isInternal ? undefined : '_blank'}
                      rel={isInternal ? undefined : 'noopener noreferrer'}
                      className="text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      {link.name}
                      {!isInternal && <ExternalLink className="w-3 h-3" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
