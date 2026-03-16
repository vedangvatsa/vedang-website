

import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Send, Twitter } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { essays } from '@/lib/essays';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.community.title,
  description: pageMetadata.community.description,
  url: pageMetadata.community.url,
  ogImageAlt: 'Community Building & Content Strategy - Vedang Vatsa',
});

export default function CommunityProfilePage() {
  const recentEssays = essays.slice(0, 4);

  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "Content & Community", url: "https://veda.ng/community" }]} />

      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">&larr; Home</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Community building & content strategy</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Community architect and content creator with a proven record of building engaged professional networks from the ground up, driving conversations, and achieving tens of millions in content reach.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter className="h-4 w-4" /></Link>
          <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Telegram"><Send className="h-4 w-4" /></Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">100k+</p>
            <p className="text-xs text-muted-foreground mt-1">Web3 community founded</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">~90M</p>
            <p className="text-xs text-muted-foreground mt-1">Annual content reach</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">30k+</p>
            <p className="text-xs text-muted-foreground mt-1">Live Twitter Space attendees</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Core competencies</h2>
          <div className="mt-6 space-y-4">
            {[
              ['Community Building & Engagement', 'Architected and scaled a 100k+ member professional Web3 community from scratch, fostering a highly engaged network of executives, developers, and enthusiasts.'],
              ['Content Strategy & Creation', 'Developed and executed a multi-platform content strategy, including research manuscripts, articles, and newsletters, achieving 80M+ LinkedIn views and 40,000 newsletter subscribers.'],
              ['Social Media & Audience Growth', 'Engineered explosive growth on social channels, including scaling one of the largest Telegram channels for Web3 jobs to 55 million post views in its first year.'],
              ['Event Hosting & Public Speaking', 'Hosted high-profile weekly Twitter Spaces with up to 30k live attendees, featuring industry leaders from Microsoft, Pink Floyd, and Big4 firms. Guest lecturer at top universities.'],
              ['Partnerships & Network Effects', 'Forged strategic partnerships with premier global organizations like Harvard Blockchain Club, ETH Oxford, and Token 2049 to amplify reach and community value.'],
              ['Growth Marketing & Advisory', 'Served as Head of Marketing and Growth Lead for multiple Web3 startups, leveraging community and content as primary organic acquisition channels.'],
            ].map(([title, desc], i) => (
              <div key={i}>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Platforms & tools</h2>
          <ul className="mt-6 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li><span className="font-medium text-foreground">Social & Community:</span> X (Twitter), LinkedIn, Telegram, Discord, Social-messaging forums</li>
            <li><span className="font-medium text-foreground">Content & Analytics:</span> Medium, Substack, Google Analytics, LinkedIn Analytics, X Analytics</li>
            <li><span className="font-medium text-foreground">Creative & Design:</span> Figma, Canva, Adobe Photoshop, Midjourney</li>
            <li><span className="font-medium text-foreground">AI & Productivity:</span> GPT-4, Claude for content workflows, Notion, Slack</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Experience</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-medium">Founder & Community Architect · Hashtag Web3</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Built a 100k+ member networking community for Web3 with 55 million post views in the first year.</li>
                <li>Hosted weekly Twitter Spaces with 20-30k live attendees featuring high-profile guests.</li>
                <li>Published crash courses with 50,000+ accesses in the first month and 40,000 newsletter subscribers.</li>
                <li>Formed partnerships with Harvard Blockchain Club, ETH Oxford, Token 2049, etc.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Country Head (Content & Growth) · Prosple</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Led user growth to 200K through content and social media, generating 1.5M geo-targeted web hits.</li>
                <li>Hosted events with executives from Microsoft, Bain & Company, etc.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Program & Social Media Management · KPMG (Ministry of IT, India)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Shaped social media strategy for national digital initiatives in the Minister&apos;s Office.</li>
                <li>Created content and managed website for the IT Minister of India.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Recognition</h2>
          <ul className="mt-6 list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Top 50 in Metaverse (Thinkers360) and Top 50 in Fintech & Crypto (Favikon)</li>
            <li>Published in IEEE, Economic Times, Business Insider, YourStory</li>
            <li>Guest lecturer at IIT Delhi, IIT Kanpur, OP Jindal, TUM Munich</li>
            <li>Fellow of the Royal Society of Arts (FRSA)</li>
            <li>22+ publications on AI, Web3, and digital economies</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Testimonials</h2>
          <div className="mt-6 space-y-6">
            {[
              { quote: 'I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes and always able to explain things to me.', name: 'Jack Alison', role: 'Screenwriter for Academy Awards (Oscars)' },
              { quote: 'I am very comfortable to recommend him for any job that requires strict deadlines, taking on new challenges at short notice and efficient client communication.', name: 'Bharath Visweswariah', role: 'Director Investments, Omidyar Network' },
              { quote: 'He helped me a lot in working closely with me and understanding my requirements even though we had language barriers. Vedang never let these barriers delay the work.', name: 'Eran Malovani', role: 'Founder of CPA+' },
            ].map((t, i) => (
              <div key={i}>
                <blockquote className="border-l-3 border-border pl-4 text-sm text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <p className="mt-2 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Writings</h2>
          <div className="mt-6 space-y-1">
            {recentEssays.map((essay) => (
              <Link key={essay.slug} href={essay.url} className="block text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">{essay.title}</Link>
            ))}
            <Separator className="my-3" />
            <Link href="/writings" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">View all essays</Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
