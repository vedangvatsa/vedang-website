

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AsSeenIn } from '@/components/as-seen-in';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
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
  { title: 'Learn Web3', url: '/web3-101' },
  { title: 'Learn Agentic Web', url: '/agentic-web' },
  { title: 'Learn Prompt Engineering', url: '/prompt-engineering-101' },
  { title: 'Learn Vibe Coding', url: '/vibe-coding' },
  { title: 'Learn MCP Development', url: '/mcp-development' },
  { title: 'Learn AI Automation', url: '/ai-automation' },
  { title: 'LinkedIn Translator', url: '/lit' },
  { title: 'Swarm Prediction', url: '/swarm-prediction' },
  { title: 'AI Discovery Standards', url: '/ai-discovery-standards' },
  { title: 'AI Reports Library', url: '/ai-reports' },
  { title: 'Web3 & AI Glossary', url: '/glossary' },
];

export default function Home() {
  const recentEssays = essays.slice(0, 12).map(e => ({
    title: e.title,
    url: e.url,
    date: e.date,
  }));

  return (
    <PageLayout>
      <section className="pt-12 md:pt-20 pb-8 text-center">
          <Image
            src="/images/icon.png"
            alt="Vedang Vatsa - product engineer, educator, and founder based in Singapore"
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-full object-cover"
            priority
          />
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">Vedang Vatsa FRSA</h1>
          <p className="mx-auto mt-3 max-w-3xl text-base md:text-lg leading-relaxed">
            Founder: <Link href="https://hashtagweb3.com?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">Hashtag Web3</Link> and <Link href="https://cvin.bio?utm_source=veda.ng&utm_medium=website&utm_campaign=homepage" className="underline hover:text-foreground">CvinBio</Link>
            <span className="mx-2 text-muted-foreground">|</span>
            <Link href="/profile" className="text-primary hover:text-primary/80 transition-colors">Profile →</Link>
          </p>
      </section>

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
        cta={{ label: 'View all essays', url: '/writings' }}
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
