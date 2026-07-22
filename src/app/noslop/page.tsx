import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { AuthorByline } from '@/components/author-byline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from './copy-button';
import { CommandBlock } from './command-block';

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
      <div className='space-y-6 pb-12'>
        <Card className='mx-auto w-full max-w-2xl'>
          <CardHeader className='text-center'>
            <CardTitle>Add to your agent</CardTitle>
            <CardDescription>Run this in your project root, then point your agent at noslop.md.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-center'>
            <CommandBlock command='curl -fsSL https://veda.ng/noslop.md -o noslop.md' />
            <div className='flex flex-wrap justify-center gap-3'>
              <Button asChild>
                <a href='/noslop.md' download>Download noslop.md</a>
              </Button>
              <CopyButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
