import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { AuthorByline } from '@/components/author-byline';
import { Card, CardContent } from '@/components/ui/card';
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
    <PageLayout wide>
      <header className='pt-10 sm:pt-12 md:pt-20 pb-6 sm:pb-8'>
        <div className='text-center min-w-0 px-0'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] break-words'>
            NoSlop
          </h1>
          <p className='mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-0'>
            A prompt that keeps your agent from writing generic AI prose.
          </p>
          <AuthorByline links={[{ label: 'GitHub', href: 'https://github.com/vedangvatsa/vedang-website' }]} />
        </div>
      </header>
      <div className='space-y-6 pb-12'>
        <Card className='mx-auto w-full max-w-2xl border-0 shadow-none'>
          <CardContent className='space-y-4 text-center'>
            <CommandBlock command='curl -fsSL https://veda.ng/noslop.md -o noslop.md' />
            <div className='flex flex-wrap justify-center gap-3'>
              <Button asChild className='bg-black text-white hover:bg-zinc-800'>
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
