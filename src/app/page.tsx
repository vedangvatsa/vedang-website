

import Link from 'next/link';
import { EssaysList } from '@/components/essays-list';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { PageLayout } from '@/components/page-layout';
import { RecentPapers } from '@/components/recent-papers';
import { MoveUpRight } from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  url: pageMetadata.home.url,
  ogImageAlt: 'Vedang Vatsa - AI & Web3 Innovator, Community Founder',
});

const courses = [
  { href: '/agentic-web', title: 'Agentic Web', desc: 'Build and interact with autonomous AI agents' },
  { href: '/vibe-coding', title: 'Vibe Coding', desc: 'Build software using natural language and AI' },
  { href: '/prompt-engineering-101', title: 'Prompt Engineering', desc: 'Communicate effectively with LLMs' },
  { href: '/web3-101', title: 'Web3 101', desc: 'Blockchain, decentralization, and digital ownership' },
];

const tools = [
  { href: '/swarm-prediction', title: 'Swarm Prediction', desc: 'Multi-agent AI debate to forecast outcomes' },
  { href: '/glossary', title: 'Glossary', desc: '200+ technical terms in AI and Web3' },
];

export default function Home() {
  return (
    <PageLayout>
      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-16">

        <section>
          <h1 className="text-4xl font-semibold tracking-tight">Vedang Vatsa</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Founder of <Link href="https://hashtagweb3.com" className="text-foreground hover:text-primary transition-colors underline underline-offset-4">Hashtag Web3</Link>, a 120k community of AI and Web3 professionals. MTech and MBA from IIT Kanpur. Chartered Engineer. Fellow of the Royal Society of Arts.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">Full profile</Link>
            <Link href="/media" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">Speaking & media</Link>
          </div>
        </section>

        <RecentPapers />

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Recent essays</h2>
          <div className="mt-6">
            <EssaysList limit={8} />
          </div>
          <Link href="/writings" className="inline-block mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            View all essays
          </Link>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {courses.map((c) => (
              <Link key={c.href} href={c.href} className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{c.title}</h3>
                  <MoveUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="group rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{t.title}</h3>
                  <MoveUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </PageLayout>
  );
}
