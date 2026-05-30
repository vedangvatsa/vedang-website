

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
      <section className="py-8 md:py-12 text-center">
        <div>
          <Image
            src="/images/icon.png"
            alt="Vedang Vatsa - product engineer, educator, and founder based in Singapore"
            width={96}
            height={96}
            className="mx-auto h-24 w-24 rounded-full object-cover"
            priority
          />
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Vedang Vatsa FRSA</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Founder, <Link href="https://hashtagweb3.com" className="underline hover:text-foreground">Hashtag Web3</Link> (120k community of AI & Web3 professionals)
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-sm text-muted-foreground">
            MTech, MBA, Chartered Engineer, IIT Kanpur alumnus, Fellow of the Royal Society of Arts
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild className="min-w-64 px-8">
              <Link href="/profile">View Full Profile</Link>
            </Button>
          </div>
        </div>
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

      <CardGrid
        id="learn"
        title="Resources"
        items={resources}
      />

      <section className="py-12 text-center">
        <div>
          <div className="flex justify-center">
            <Button asChild size="lg" className="min-w-64 px-8">
              <Link href="/media">Speaking Engagements & Media Mentions</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
