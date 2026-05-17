

import { PageLayout } from '@/components/page-layout';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Twitter,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AsSeenIn } from '@/components/as-seen-in';
import { TwitterEmbed } from '@/components/twitter-embed';
import { Button } from '@/components/ui/button';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.profile.title,
  description: pageMetadata.profile.description,
  url: pageMetadata.profile.url,
  ogImageAlt: 'Vedang Vatsa - Full Profile',
});

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vedang Vatsa',
  url: 'https://veda.ng/profile',
  image: 'https://veda.ng/images/icon.png',
  jobTitle: ['Founder', 'AI Researcher', 'Web3 Innovator', 'Entrepreneur'],
  worksFor: {
    '@type': 'Organization',
    name: 'Hashtag Web3',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Indian Institute of Technology, Kanpur',
  },
  award: 'Fellow of the Royal Society of Arts',
  sameAs: [
    'https://linkedin.com/in/vedangvatsa',
    'https://www.youtube.com/@vedangvatsa',
    'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    'https://x.com/vedangvatsa',
    'https://www.t.me/vedangvatsa',
    'https://www.instagram.com/vedangvatsa',
  ],
  knowsAbout: ['Artificial Intelligence', 'Web3', 'Blockchain', 'Cryptocurrency', 'Community Building'],
};

export default function ProfilePage() {
  
  return (
    <PageLayout>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      <div className="py-8">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <section className="text-center">
            
              <Image
                src="/images/icon.png"
                alt="Professional headshot of Vedang Vatsa."
                width={96}
                height={96}
                className="mx-auto h-24 w-24 rounded-full object-cover"
                priority
              />
            
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Vedang Vatsa FRSA</h1>
            <p className="mx-auto mt-2 max-w-3xl text-base md:text-lg text-muted-foreground">
             Computer Engineer, MBA, Chartered Engineer | Young Researcher 2020 Awardee (22 publications) & Young Achiever 2020-21 Awardee
            </p>
            <div className="mt-4 flex justify-center items-center space-x-4">
              <Link href="mailto:vedangvatsa.2019@iitkalumni.org" className="text-[#EA4335] hover:text-[#D93025] transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-[#0A66C2] hover:text-[#004182] transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/70 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-[#26A5E4] hover:text-[#1E8ECB] transition-colors" aria-label="Telegram">
                <Send className="h-5 w-5" />
              </Link>
              <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-[#4285F4] hover:text-[#2B6ED4] transition-colors" aria-label="Google Scholar">
                <BookOpen className="h-5 w-5" />
              </Link>
              <Link href="https://www.instagram.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-[#E4405F] hover:text-[#C13584] transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </section>

          <Separator className="my-6" />

          <div className="space-y-6">
            <section id="experience">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                Professional Experience
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Growth Advisory (Founder)</CardTitle>
                        <p className="text-sm text-muted-foreground">Hashtag Web3</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0">October 2022 - Present</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ecosystem Strategist at The Hashgraph Group (Hedera), Head of Marketing at Routespring, and Software Engineer at Network School (by Balaji Srinivasan).</li>
                        <li>Built a 100k+ member networking community for Web3, a social-messaging-first forum, and one of the largest channels for Web3 jobs - 55 million post views in the first year.</li>
                        <li>Featured among the top 3 Web3 products of the week by Smoothie and supported by Microsoft for Startups.</li>
                        <li>Hosted weekly Twitter Spaces with high-profile guests (including a band member of Pink Floyd, partners of Big4 firms, the father of digital twin technology, and the CSO of Microsoft), attracting 20-30k live attendees.</li>
                        <li>Partnered with leading organizations like Harvard Blockchain Club, ETH Oxford, Token 2049, ETH Vietnam, Taipei Blockchain Week, Oxford Blockchain Conference, Malaysia Blockchain Week, ETH Brussels, EDCON Tokyo, etc.</li>
                        <li>Published crash courses on NFT, Metaverse, Tokenomics, DAO, Blockchain, and DeFi, with 50,000 accesses in the first month and 40,000 newsletter subscribers.</li>
                        <li>Among top 100 thought leaders & influencers in Metaverse and Smart Cities by Thinkers360.</li>
                        <li>Research reporting on AI and Web3 resulted in 80 million yearly LinkedIn post views & features by LinkedIn News UK & Europe.</li>
                    </ul>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Country Head</CardTitle>
                        <p className="text-sm text-muted-foreground">Prosple</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0">September 2021 - October 2022</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Led user growth to 200K through content, social media & social messaging initiatives - generating over 1.5M geo-targeted web hits. I hosted events with top company executives (Microsoft, Bain & Company, etc.) and partnered with startups and educational institutions.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Consultant</CardTitle>
                        <p className="text-sm text-muted-foreground">KPMG</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0">September 2019 - September 2021</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <div>
                      <h4 className="font-semibold text-base">Program Management (Minister's Office, Ministry of Electronics and IT, India):</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-1">
                        <li>Served as Program Manager for Digital-India products and projects under the Ministry.</li>
                        <li>Worked on the Minister's social media strategy, created a personal website, and liaised with scientists, state officials, startup founders, CXOs, and bureaucrats. I gathered data, built dashboards, led growth initiatives, and facilitated high-level reviews.</li>
                        <li>Served as an evaluation committee member for a government innovation challenge.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Research and Due Diligence:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-1">
                         <li>Commercial Due Diligence (Ecommerce with $2B valuation, Digital Payments - 2500Mn transaction volume).</li>
                         <li>Technical Due Diligence (HealthTech app with 220 million downloads, Social Media with $100 million valuation).</li>
                         <li>Policy Research (National Policy on Software Products, Responsible AI, Data Protection Bill, Fake news, Proceedings on BigTechs, etc.).</li>
                      </ul>
                    </div>
                     <div>
                      <h4 className="font-semibold text-base">Business Strategy &amp; Analysis:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-1">
                         <li>Designed strategies for KPMG's Analytics Centre of Excellence, a crowdfunding platform, and data centers.</li>
                         <li>Monitored projects in Language Translation, Digital Villages, & AI. Prepared process architecture and delivery model for contactless tracking in India-Posts (world's largest postal network).</li>
                         <li>Multiple Kudos + Top Scorer award in KPMG's Digital Premier League on Emerging Technologies: Received special appreciation by the Partner.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Project Manager (Co-Founder)</CardTitle>
                        <p className="text-sm text-muted-foreground">Studio Tesseract</p>
                      </div>
                      <p className="text-xs text-muted-foreground flex-shrink-0">April 2013 - June 2017</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Led a 30-member team, delivering 27 web and mobile products across the full development lifecycle. Expanded business development and UI design globally, serving clients on 5 continents. Secured recommendations from the screenwriter for Oscars and CPA+ Israel.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

             <div className="grid md:grid-cols-2 gap-6">
                <section id="education" className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Education
                  </h2>
                  <Card className="flex-1">
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">Computer Engineer &amp; MBA</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>President's Gold Medal nominee at the Indian Institute of Technology Kanpur.</li>
                        <li>Represented 100+ students as the department student representative, led a 40-member Entrepreneurship Cell team, and grew internship offers by 73%.</li>
                        <li>Won "Freshman of the Year," served as Training and Placement Cell Executive Head.</li>
                        <li>Finished Management Development Program on leadership from Indian Institute of Management Indore.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>

                <section id="achievements" className="flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Key Achievements
                  </h2>
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Awarded as a Fellow of the Royal Society for the Encouragement of Arts, Manufactures and Commerce (Previous Fellows have included Stephen Hawking, Charles Dickens, Karl Marx and Benjamin Franklin).</li>
                        <li>Issued Japan's special visa for Intellectual Figures.</li>
                        <li>Presented my prototype for a low-cost laptop among the top entries at IIT Delhi; appreciated by the Head of MIT Media Labs and Alberto Minetti (Nobel Laureate).</li>
                        <li>Young Researcher Awardee 2020 and Young Achiever Awardee 2020-21.</li>
                        <li>Felicitated with a medal by the Former Director of India's Prime Minister's Office for winning the Beat Plastic Hackathon.</li>
                        <li>Represented Indian delegation in the India-Venezuela Youth Dialogue, Harvard Project for Asian & International Relations, India-China Roundtable, India-Norway Youth Conference, India-Azerbaijan Roundtable Dialogue, India-Botswana Dialogue 2018, World Business Dialogue, etc.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>
            </div>

            <section id="publications">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Publications
                </h2>
                 <Card>
                    <CardContent className="p-4">
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground columns-1 md:columns-2 lg:columns-3 md:gap-6">
                            <li><Link href="https://dx.doi.org/10.2139/ssrn.5660270" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Device-to-Device Economics and AI Agent Transactions</Link>; SSRN</li>
                            <li><Link href="https://dx.doi.org/10.2139/ssrn.5325570" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Stablecoin Growth and Market Dynamics</Link>; SSRN</li>
                            <li><Link href="https://dx.doi.org/10.2139/ssrn.5329957" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Stablecoins in the Modern Financial System</Link>; SSRN</li>
                            <li><Link href="https://dx.doi.org/10.2139/ssrn.5386707" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Global Stablecoin Regulations and Policies</Link>; SSRN</li>
                            <li><Link href="https://dx.doi.org/10.2139/ssrn.5357534" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Blockchain Ecosystem Evolution</Link>; SSRN</li>
                            <li><Link href="https://ieeexplore.ieee.org/document/9515004" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Estonia&apos;s e-governance and public service delivery solution</Link>; IEEE</li>
                            <li><Link href="https://ieeexplore.ieee.org/document/9514979" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Analysis of Global Research Proceedings in Artificial Intelligence</Link>; IEEE</li>
                            <li><Link href="https://dx.doi.org/10.21474/IJAR01/11418" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Identification of Algorithmic Bias Through Policy Instruments</Link>; IJAR</li>
                            <li>China&apos;s approach to AI: A review of policy, ethics, and research advancements; Responsible AI Forum 2021, Munich</li>
                            <li>Decoding identity in the Metaverse; Yourstory</li>
                            <li>Ethical implications in Artificial Intelligence and Brain Computer Interfaces</li>
                            <li>The emerging Internet of Value; Inc42</li>
                            <li>Emergence of TechFin in the emerging economies; IOSR</li>
                            <li>Base erosion and profit shifting in multinational corporations; Theoretical &amp; Applied Economics</li>
                            <li>Growth of Digital Payments and the emergence of FinTech ecosystem in India; Indian Journal of Research</li>
                            <li>Coronavirus Outbreak: Trillion-Dollar Crisis and Evolution of New Global Order; Diplomacy and Beyond</li>
                            <li>A literature review on Internet of Things (IoT); IJCS</li>
                            <li>Current Trends and Approaches of Network Intrusion Detection System; IJCSMC</li>
                            <li>Case Study on Mobile Applications Industry; IJIR</li>
                            <li>Security in Common Computing and Analysis of security threats in MANET; UGC SAP Conference</li>
                            <li>A Review on Multi-Modal Biometric Systems; IJCTA</li>
                            <li>Comparative Analysis of Coverage Schemes in Wireless Sensor Network; CAE</li>
                            <li>Raspberry Pi based Implementation of IoT using Telegram</li>
                        </ul>
                    </CardContent>
                </Card>
                <div className="mt-6 flex justify-center">
                    <Button variant="outline" asChild>
                        <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                            Read More on Google Scholar
                        </Link>
                    </Button>
                </div>
            </section>
            
            <section id="projects">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Other Projects
                </h2>
                 <Card>
                    <CardContent className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-semibold text-base">ERNST & YOUNG</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Sectoral impact of OECD's action plans on Base Erosion & Profit Shifting.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">OMIDYAR NETWORK</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Led creative strategy for startups in CivicTech event - 3 got funded.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">HINDUSTAN PETROLEUM</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Analytics tool to monitor sales data of 50+ petrol pumps across the National Capital Region in India.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">JOURNALISM WEEK by University of Chicago</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Led the media & content for the 7-day multi-city event.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">DELL</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Intranet portal for micro project management via team update submission.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section id="ai-automation">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    AI &amp; Automation
                </h2>
                 <Card>
                    <CardContent className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-semibold text-base">Programmatic SEO</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">1,000+ auto-generated pages on hashtagweb3.com. Grew Google Search impressions from zero to 1 million in 3 months.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">Swarm Intelligence Engine</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">10-100 AI agents debate across multiple rounds to produce consensus forecasts. 8 LLM providers supported. Live at veda.ng/swarm-prediction.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">Autonomous Social Distribution</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Auto-publishes to 7 platforms, 3x/day, zero manual work. Deployed across 3 projects (veda.ng, CVin.Bio, hashtagweb3.com).</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">Programmatic Video Factory</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">100+ short-form videos produced end-to-end by AI: script, voiceover, animated visuals, captions, and final render.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">Health Protocol Extraction</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">6,300+ protocols extracted from 1,200+ Huberman Lab, Bryan Johnson, and Peter Attia videos using local AI inference.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-base">AI Content Generation Engine</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Built an AI-powered content engine that produces long-form research reports on AI, Web3, and emerging tech, and distributes them across 10 platforms.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

             <section id="interests">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Interests
                </h2>
                 <Card>
                    <CardContent className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-semibold text-base">Traveling & Photography</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Selected among a few photographers to cover the world's largest festival by gathering. Solo-traveled to 17 countries.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">Adventure Sports</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">World's highest canyon swing, National Mountain Biking Expedition.</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-base">Public Speaking</h4>
                            <p className="text-muted-foreground mt-0.5 text-sm">Workshops on Computational Social Science, China’s Approach to AI, Citizens of the Metaverse, Digital Payments in India, Data Privacy, Blockchain use-cases, e-Governance in Estonia, Network States, Responsible AI, etc.</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section id="testimonials">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                    Testimonials
                </h2>
                 <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes, and always able to explain things to me when it's hard for me to get them. He has my highest endorsement."
                            </blockquote>
                            <p className="mt-4 font-semibold text-right text-sm">Jack Alison</p>
                            <p className="text-xs text-muted-foreground text-right">Screenwriter for Academy Awards (Oscars)</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I am very comfortable recommending him for any job that requires strict deadlines, taking on new challenges at short notice, dealing with altering priorities, efficient client communication, and good analytical capabilities."
                            </blockquote>
                            <p className="mt-4 font-semibold text-right text-sm">Bharath Visweswariah</p>
                            <p className="text-xs text-muted-foreground text-right">Director Investments, Omidyar Network</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "He helped me a lot by working closely with me and understanding my requirements, even though we had some language barriers between us. Vedang has never let these barriers be the reason for any delay in the work."
                            </blockquote>
                            <p className="mt-4 font-semibold text-right text-sm">Eran Malovani</p>
                            <p className="text-xs text-muted-foreground text-right">Founder of CPA+</p>
                        </CardContent>
                    </Card>
                 </div>
            </section>
          </div>
        </div>
      </div>

      <AsSeenIn />

      <section id="media-link" className="text-center pb-16">
          <Button asChild size="lg" className="min-w-64 px-8">
              <Link href="/media">Speaking Engagements &amp; Media Mentions</Link>
          </Button>
      </section>

    </PageLayout>
  );
}