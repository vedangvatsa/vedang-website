

import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Award,
  BookOpen,
  Briefcase,
  Globe,
  Linkedin,
  MessageSquare,
  Mic,
  PenSquare,
  Send,
  Star,
  Twitter,
  Users,
  Wrench,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AsSeenIn } from '@/components/as-seen-in';
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

      <div className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <section className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <Image
                src="/images/icon.png"
                alt="Headshot of Vedang Vatsa, a content and community strategist."
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover border-4 border-card"
                priority
              />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Community Building & Content Strategy</h1>
              <p className="mt-1 text-base md:text-lg font-medium text-muted-foreground">Vedang Vatsa | Web3 & Tech</p>
              <p className="mx-auto mt-2 max-w-xl text-base text-muted-foreground">
                Community architect and content creator with a proven record of building engaged professional networks from the ground up, driving conversations, and achieving tens of millions in content reach.
              </p>
              <div className="mt-4 flex justify-center md:justify-start items-center space-x-4">
                <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1.5">
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1.5">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary flex items-center gap-1.5">
                  <Send className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          <section className="my-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center p-4 bg-secondary/30">
              <Users className="h-8 w-8 mx-auto text-primary"/>
              <p className="text-3xl font-bold mt-2">100k+</p>
              <p className="text-sm text-muted-foreground">Web3 Community Founded</p>
            </Card>
            <Card className="text-center p-4 bg-secondary/30">
              <Globe className="h-8 w-8 mx-auto text-primary"/>
              <p className="text-3xl font-bold mt-2">~90M</p>
              <p className="text-sm text-muted-foreground">Annual Content Reach</p>
            </Card>
            <Card className="text-center p-4 bg-secondary/30">
                <Mic className="h-8 w-8 mx-auto text-primary"/>
                <p className="text-3xl font-bold mt-2">30k+</p>
                <p className="text-sm text-muted-foreground">Live Twitter Space Attendees</p>
            </Card>
          </section>

          <div className="space-y-8">
            <section id="competencies">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <Star className="w-6 h-6 text-primary" /> Core Competencies
                </h2>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">Community Building & Engagement</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Architected and scaled a 100k+ member professional Web3 community from scratch, fostering a highly engaged network of executives, developers, and enthusiasts.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Content Strategy & Creation</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Developed and executed a multi-platform content strategy, including research manuscripts, articles, and newsletters, achieving 80M+ LinkedIn views and 40,000 newsletter subscribers.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">Social Media & Audience Growth</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Engineered explosive growth on social channels, including scaling one of the largest Telegram channels for Web3 jobs to 55 million post views in its first year.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Event Hosting & Public Speaking</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Hosted high-profile weekly Twitter Spaces with up to 30k live attendees, featuring industry leaders from Microsoft, Pink Floyd, and Big4 firms. Guest lecturer at top universities.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">Partnerships & Network Effects</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Forged strategic partnerships with premier global organizations like Harvard Blockchain Club, ETH Oxford, and Token 2049 to amplify reach and community value.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Growth Marketing & Advisory</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Served as Head of Marketing and Growth Lead for multiple Web3 startups, leveraging community and content as primary organic acquisition channels.</p>
                    </div>
                </div>
            </section>
            
            <section id="toolkit">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                <Wrench className="w-6 h-6 text-primary" /> Platforms & Tools
              </h2>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground text-sm">
                  <ul className="space-y-1 list-disc list-inside">
                    <li><span className="font-semibold text-foreground">Social & Community Platforms:</span> X (Twitter), LinkedIn, Telegram, Discord, Social-messaging forums</li>
                    <li><span className="font-semibold text-foreground">Content & Analytics:</span> Medium, Substack, Google Analytics, LinkedIn Analytics, X Analytics</li>
                  </ul>
                  <ul className="space-y-1 list-disc list-inside">
                    <li><span className="font-semibold text-foreground">Creative & Design:</span> Figma, Canva, Adobe Photoshop, Midjourney</li>
                    <li><span className="font-semibold text-foreground">AI & Productivity:</span> Advanced use of GPT-4, Claude for content workflows, Notion, Slack</li>
                  </ul>
              </div>
            </section>

            <section id="experience">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" /> Community & Content Experience
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Founder & Community Architect | Hashtag Web3</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                      <li>Built a 100k+ member networking community for Web3, a social-messaging-first forum, and one of the largest Telegram channels for Web3 jobs.</li>
                      <li>Achieved 55 million post views in the first year on Telegram and 80 million annual post views on LinkedIn.</li>
                      <li>Hosted weekly Twitter Spaces with 20-30k live attendees, featuring guests like a Pink Floyd band member, Big4 partners, and the CSO of Microsoft.</li>
                      <li>Published influential crash courses on Web3 topics (NFT, Metaverse, DAO) with 50,000+ accesses in the first month.</li>
                      <li>Grew a newsletter to 40,000 subscribers and a Medium publication to 150,000 subscribers.</li>
                      <li>Formed partnerships with Harvard Blockchain Club, ETH Oxford, Token 2049, and other leading global entities.</li>
                      <li>Created an exclusive community for Indian Web3 executives from companies like Gemini, Circle, Coinbase, and KPMG.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Country Head (Content & User Growth) | Prosple</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                      <li>Led user growth from 5,000 to 200,000 (a 40x increase) primarily through content, social media, and community initiatives.</li>
                      <li>Generated over 1.5 million geo-targeted web hits, establishing a strong digital presence in a new market.</li>
                      <li>Hosted events and built relationships with executives from Microsoft, Bain & Company, and other top firms.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Program & Social Media Management | KPMG (for Ministry of IT, India)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                      <li>Worked directly in the Minister's Office to shape social media strategy for national digital initiatives.</li>
                      <li>Created content, managed a personal website, and liaised with diverse stakeholders to communicate program progress and impact.</li>
                       <li>Served as an evaluation committee member for a national government innovation challenge, assessing content and communication strategies.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section id="qualifications">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" /> Recognition & Thought Leadership
                </h2>
                <Card>
                    <CardContent className="pt-4">
                        <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                            <li><span className="font-semibold text-foreground">Top Global Influencer:</span> Ranked among the Top 50 in Metaverse (Thinkers360) and Top 50 in Fintech & Crypto (Favikon).</li>
                            <li><span className="font-semibold text-foreground">Featured Author:</span> Published articles for Government Blockchain Association, KPMG, IEEE, Economic Times, Business Insider, and YourStory.</li>
                             <li><span className="font-semibold text-foreground">Esteemed Public Speaker:</span> Guest lecturer at IIT Delhi, IIT Kanpur, OP Jindal University, TUM Munich, and The Responsible AI Forum.</li>
                            <li><span className="font-semibold text-foreground">Royal Society of Arts (FRSA):</span> Awarded a fellowship for outstanding achievements in social progress, joining a historic community including Charles Dickens and Stephen Hawking.</li>
                            <li><span className="font-semibold text-foreground">Extensive Research:</span> Authored 22+ publications on AI, Web3, and digital economies, featured by LinkedIn News UK & Europe.</li>
                        </ul>
                    </CardContent>
                </Card>
            </section>

            <AsSeenIn />

            <section id="testimonials">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary" /> Testimonials
                </h2>
                 <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes and always able to explain things to me when it's hard for me to get things. He has my highest endorsement."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">- Jack Alison</p>
                            <p className="text-xs text-muted-foreground text-right">Screenwriter for Academy Awards (Oscars)</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I am very comfortable to recommend him for any job that requires strict deadlines, taking on new challenges at short notice and dealing with altering priorities, efficient client communication and good analytical capabilities."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">- Bharath Visweswariah</p>
                            <p className="text-xs text-muted-foreground text-right">Director Investments, Omidyar Network</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "He helped me a lot in working closely with me and understand my requirements even though we had some language barriers between us but Vedang has never let these barriers be the reason of any delay in the work."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">- Eran Malovani</p>
                            <p className="text-xs text-muted-foreground text-right">Founder of CPA+</p>
                        </CardContent>
                    </Card>
                 </div>
            </section>

             <section id="writings">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <PenSquare className="w-6 h-6 text-primary" /> Writings
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Selected Research</h3>
                        <div className="space-y-2">
                           <Link href="https://dx.doi.org/10.2139/ssrn.5660270" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary">Device-to-Device Economics and AI Agent Transactions</Link>
                           <Link href="https://dx.doi.org/10.2139/ssrn.5325570" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary">Stablecoin Growth and Market Dynamics</Link>
                           <Link href="https://ieeexplore.ieee.org/document/9514979" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary">Analysis of Global Research Proceedings in AI</Link>
                           <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 inline-block">More on Google Scholar</Link>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Essays</h3>
                         <div className="space-y-2">
                           {recentEssays.map((essay) => (
                              <Link key={essay.slug} href={essay.url} className="block text-sm text-muted-foreground hover:text-primary">{essay.title}</Link>
                           ))}
                           <Link href="/writings" className="text-sm text-primary hover:underline mt-1 inline-block">Read More Essays</Link>
                        </div>
                    </div>
                </div>
            </section>

          </div>
        </div>
      </div>
    </PageLayout>
  );
}
