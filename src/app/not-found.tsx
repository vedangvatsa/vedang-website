import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/page-layout';

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
            <Link href="/writings">Browse essays</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
