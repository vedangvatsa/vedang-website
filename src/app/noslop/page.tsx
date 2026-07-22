import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'NoSlop',
  description: 'Install the anti-slop agent prompt for Claude, Cursor, and other agents.',
  openGraph: {
    title: 'NoSlop',
    description: 'Install the anti-slop agent prompt for Claude, Cursor, and other agents.',
    url: 'https://veda.ng/noslop',
    type: 'website',
  },
};

export default function NoSlopPage() {
  return (
    <PageLayout>
      <PageHero
        title='NoSlop'
        subtitle='A prompt that keeps your agent from writing generic AI prose.'
      />
      <AuthorByline />
      <div className='space-y-8 pb-20'>
        <Card>
          <CardHeader className='text-center'>
            <CardTitle>Add to your agent</CardTitle>
            <CardDescription>Paste this into your terminal.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-center'>
            <pre className='overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono text-left'>
              curl -fsSL https://veda.ng/noslop.md {'>>'} ~/.claude/CLAUDE.md
            </pre>
            <Button asChild>
              <a href='/noslop.md' download>Download noslop.md</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
