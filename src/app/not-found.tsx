import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/page-layout';
import { NotFoundGame } from '@/app/not-found-game';

const recoveryLinks = [
  { href: '/llms.txt', label: 'llms.txt index' },
  { href: '/sitemap.xml', label: 'Sitemap' },
  { href: '/essays', label: 'Essays' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex min-h-[70vh] w-full max-w-xl mx-auto flex-col items-center justify-center px-4 py-10 sm:py-14 text-center">
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-muted-foreground/25 mb-3 select-none">
          404
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-md px-2">
          This page does not exist or may have been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 w-full">
          <Button asChild className="min-w-[140px]">
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild className="min-w-[140px]">
            <Link href="/essays">Browse essays</Link>
          </Button>
        </div>

        <div className="w-full max-w-[540px] flex justify-center">
          <NotFoundGame />
        </div>

        <nav aria-label="Recovery links" className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-muted-foreground max-w-md px-2">
          {recoveryLinks.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="text-muted-foreground/40">·</span>}
              <Link href={link.href} className="hover:text-foreground transition-colors py-0.5">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </PageLayout>
  );
}
