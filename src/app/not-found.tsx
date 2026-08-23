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
      <div className="flex min-h-[70vh] w-full max-w-2xl mx-auto flex-col items-center justify-center px-4 py-8 sm:py-12 text-center">
        <p className="text-5xl sm:text-6xl font-bold tracking-tighter text-muted-foreground/30 mb-3 sm:mb-4 select-none">404</p>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2">Page not found</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-md px-2">
          This page does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center">
          <Button asChild className="w-full sm:w-auto min-w-[130px]">
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto min-w-[130px]">
            <Link href="/essays">Browse essays</Link>
          </Button>
        </div>
        <div className="w-full max-w-full overflow-hidden flex justify-center">
          <NotFoundGame />
        </div>
        <nav aria-label="Recovery links" className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs sm:text-sm text-muted-foreground max-w-md px-2">
          {recoveryLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
              <Link href={link.href} className="underline underline-offset-4 hover:text-foreground transition-colors py-1">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </PageLayout>
  );
}
