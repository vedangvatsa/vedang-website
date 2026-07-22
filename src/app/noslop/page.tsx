import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'NoSlop',
  description: 'Install the anti-slop agent prompt and use the browser-based analyzer.',
  openGraph: {
    title: 'NoSlop',
    description: 'Install the anti-slop agent prompt and use the browser-based analyzer.',
    url: 'https://veda.ng/noslop',
    type: 'website',
  },
};

export default function NoSlopPage() {
  return (
    <PageLayout>
      <PageHero
        title='NoSlop'
        subtitle='Install taste. Your agent will never generate slop.'
      />
      <AuthorByline />
      <div className='space-y-8 pb-20'>
        <Card>
          <CardHeader>
            <CardTitle>Add to your agent</CardTitle>
            <CardDescription>Paste this into your terminal.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <pre className='overflow-x-auto rounded-lg border border-input bg-muted p-4 text-sm font-mono'>
              curl -fsSL https://veda.ng/noslop.md {'>>'} ~/.claude/CLAUDE.md
            </pre>
            <Button asChild>
              <a href='/noslop.md' download>Download noslop.md</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try the analyzer</CardTitle>
            <CardDescription>Paste prose and check the slop score in your browser.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant='outline'>
              <Link href='/noslop/analyze'>Open the analyzer</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
