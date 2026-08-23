import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/page-layout';
import { NotFoundGame } from '@/app/not-found-game';

const recoveryLinks = [
  { href: '/llms.txt', label: 'llms.txt index' },
  { href: '/sitemap.xml', label: 'Sitemap' },
  { href: '/essays', label: 'Essays' },
  { href: '/glossary', label: 'Glossary' },
  { href: '/meeting', label: 'Contact' },
];

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-bold tracking-tighter text-muted-foreground/30 mb-4">404</p>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/essays">Browse essays</Link>
          </Button>
        </div>
        <NotFoundGame />
        <nav aria-label="Recovery links" className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {recoveryLinks.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
              <Link href={link.href} className="underline underline-offset-4 hover:text-foreground transition-colors">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </PageLayout>
  );
}
