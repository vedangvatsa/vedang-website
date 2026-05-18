

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { EssaysList } from '@/components/essays-list';
import { MoveUpRight } from 'lucide-react';
import { AsSeenIn } from '@/components/as-seen-in';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { RecentPapers } from '@/components/recent-papers';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  url: pageMetadata.home.url,
  ogImageAlt: 'Vedang Vatsa - AI & Web3 Innovator, Community Founder',
});

export default function Home() {
  return (
    <PageLayout>
      <section className="py-8 md:py-12 text-center">
        <div className="container mx-auto px-4 md:px-6">
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

      <RecentPapers />

      <section id="essays" className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-semibold tracking-tight">Recent Essays</h2>
          <EssaysList limit={10} />
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild className="min-w-64 px-8">
              <Link href="/writings">View all essays</Link>
            </Button>
          </div>
        </div>
      </section>

      <AsSeenIn />

      <section id="learn" className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-semibold tracking-tight">Resources</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/web3-101" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">Web3</h3>
                <p className="text-sm text-muted-foreground mb-2">Master blockchain, decentralization, and digital ownership.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/agentic-web" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">Agentic Web</h3>
                <p className="text-sm text-muted-foreground mb-2">Learn to build and interact with autonomous AI agents.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/prompt-engineering-101" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">Prompt Engineering</h3>
                <p className="text-sm text-muted-foreground mb-2">Master the art of communicating with Large Language Models.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/vibe-coding" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">Vibe Coding</h3>
                <p className="text-sm text-muted-foreground mb-2">Build software naturally using natural language and AI.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/mcp-development" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">MCP Development</h3>
                <p className="text-sm text-muted-foreground mb-2">Build servers that connect AI to databases, APIs, and tools.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/ai-automation" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">AI Automation</h3>
                <p className="text-sm text-muted-foreground mb-2">Automate anything with AI agents, APIs, MCP, and no-code tools.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/lit" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">LinkedIn Translator</h3>
                <p className="text-sm text-muted-foreground mb-2">Turn honest English into perfectly crafted LinkedIn-speak. A fun parody tool.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/swarm-prediction" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">Swarm Prediction</h3>
                <p className="text-sm text-muted-foreground mb-2">Multi-agent AI debate to forecast outcomes from any data.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/ai-discovery-standards" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">AI Discovery Standards</h3>
                <p className="text-sm text-muted-foreground mb-2">Reference and tools for AI web discoverability protocols.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/ai-reports" className="group">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">AI Reports Library</h3>
                <p className="text-sm text-muted-foreground mb-2">Browse 1000+ curated AI reports, papers, and analyses from top institutions.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
            <Link href="/glossary" className="group md:col-span-2 lg:col-span-2">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-2">The Web3 & AI Glossary</h3>
                <p className="text-sm text-muted-foreground mb-2">Explore our dictionary of 100+ technical terms, concepts, and jargon.</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="container mx-auto px-4 md:px-6">
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
