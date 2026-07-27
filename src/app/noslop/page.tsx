import { Metadata } from 'next';
import { PageLayout } from '@/components/page-layout';
import { AuthorByline } from '@/components/author-byline';
import { Button } from '@/components/ui/button';
import { CopyButton } from './copy-button';
import { CommandBlock } from './command-block';

export const metadata: Metadata = {
  title: 'NoSlop',
  description: 'Standing agent law against AI slop in prose, UI, and code.',
  openGraph: {
    title: 'NoSlop',
    description: 'Standing agent law against AI slop in prose, UI, and code.',
    url: 'https://veda.ng/noslop',
    type: 'website',
    images: [
      {
        url: '/noslop/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'NoSlop: standing agent law against AI slop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NoSlop',
    description: 'Standing agent law against AI slop in prose, UI, and code.',
    images: ['/noslop/opengraph-image'],
  },
};

export default function NoSlopPage() {
  return (
    <PageLayout wide center>
      <div className='mx-auto flex w-full max-w-2xl flex-col items-center py-8 text-center'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] break-words'>
          NoSlop
        </h1>
        <p className='mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed'>
          Standing agent law against AI slop in prose, UI, and code.
        </p>
        <AuthorByline socials />
        <div className='mt-8 w-full space-y-4'>
          <CommandBlock command='curl -fsSL https://veda.ng/noslop.md -o noslop.md' />
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button asChild className='bg-black text-white hover:bg-zinc-800'>
              <a href='/noslop.md' download>Download noslop.md</a>
            </Button>
            <CopyButton />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
