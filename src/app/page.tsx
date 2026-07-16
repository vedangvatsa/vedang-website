

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AsSeenIn } from '@/components/as-seen-in';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { CardGrid } from '@/components/card-grid';
import { recentPapers } from '@/components/recent-papers';
import { essays } from '@/lib/essays';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  url: pageMetadata.home.url,
  ogImageAlt: 'Vedang Vatsa - AI & Web3 Innovator, Community Founder',
});

const resources = [
  { title: 'Learn Web3', url: '/web3' },
  { title: 'Learn Agentic Web', url: '/agentic' },
  { title: 'Learn Prompt Engineering', url: '/prompt' },
  { title: 'Learn Vibe Coding', url: '/vibecoding' },
  { title: 'Learn MCP Development', url: '/mcp' },
  { title: 'Learn AI Automation', url: '/automation' },
  { title: 'LinkedIn Translator', url: '/lit' },
  { title: 'Swarm Prediction', url: '/swarm-prediction' },
  { title: 'AI Discovery Standards', url: '/aistandards' },
  { title: 'Website Checklist', url: '/sitecheck' },
  { title: 'AI Reports Library', url: '/ailib' },
  { title: 'Web3 Reports Library', url: '/web3lib' },
  { title: 'Web3 & AI Glossary', url: '/glossary' },
  { title: 'Health Protocols', url: '/health-protocols' },
];


export default function Home() {
  const recentEssays = essays.slice(0, 12).map(e => ({
    title: e.title,
    url: e.url,
    date: e.date,
  }));

  return (
    <PageLayout>
      <PageHero
        title="Vedang Vatsa FRSA"
        showAvatar
        subtitle={
          <>
            Founder: <Link href="https://hashtagweb3.com?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">Hashtag Web3</Link> and <Link href="https://cvin.bio?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">CVinBio</Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <Link href="/profile" className="text-primary hover:text-primary/80 transition-colors">Profile →</Link>
          </>
        }
      />

      <CardGrid
        id="papers"
        title="Recent Papers"
        items={recentPapers.map(p => ({ ...p, external: true }))}
        cta={{ label: 'More on Google Scholar', url: 'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en', external: true }}
      />

      <CardGrid
        id="essays"
        title="Recent Essays"
        items={recentEssays}
        cta={{ label: 'View all essays', url: '/essays' }}
      />

      <AsSeenIn />

      <section className="py-8 text-center">
        <div className="flex justify-center">
          <Button variant="outline" asChild size="lg" className="w-full md:max-w-sm">
            <Link href="/media">Speaking Engagements & Media Mentions</Link>
          </Button>
        </div>
      </section>

      <CardGrid
        id="learn"
        title="Resources"
        items={resources}
      />
    </PageLayout>
  );
}
