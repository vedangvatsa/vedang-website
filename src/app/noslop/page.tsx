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
      <div className='space-y-6 pb-12'>
        <Card className='mx-auto w-full max-w-2xl'>
          <CardHeader className='text-center'>
            <CardTitle>Add to your agent</CardTitle>
            <CardDescription>Pick your agent and run the matching command in your project root.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4 text-center'>
            <pre className='overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono text-left'>{`
Claude Code:  curl -fsSL https://veda.ng/noslop.md >> ~/.claude/CLAUDE.md
Cursor:       curl -fsSL https://veda.ng/noslop.md > .cursorrules
Windsurf:     curl -fsSL https://veda.ng/noslop.md > .windsurfrules
Aider:        curl -fsSL https://veda.ng/noslop.md > .aider-instructions.md
            `}</pre>
            <Button asChild>
              <a href='/noslop.md' download>Download noslop.md</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
