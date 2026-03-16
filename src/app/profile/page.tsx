

import { PageLayout } from '@/components/page-layout';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
  Twitter,
} from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AsSeenIn } from '@/components/as-seen-in';
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
              <Link href="mailto:vedangvatsa.2019@iitkalumni.org" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
                <Send className="h-5 w-5" />
              </Link>
              <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Google Scholar">
                <BookOpen className="h-5 w-5" />
              </Link>
            </div>
          </section>

          <Separator className="my-6" />

          <div className="space-y-6">
            <section id="experience">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                <Briefcase className="w-6 h-6" /> Professional Experience
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
                        <li>Served as Head of Marketing and Growth Lead for several Web3 companies.</li>
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
                <section id="education">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6" /> Education
                  </h2>
                  <Card>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">BE - Computer Engineering &amp; MBA</CardTitle>
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

                <section id="achievements">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <Award className="w-6 h-6" /> Key Achievements
                  </h2>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Awarded as a Fellow of the Royal Society for the Encouragement of Arts, Manufactures and Commerce (Previous Fellows have included Stephen Hawking, Charles Dickens, Karl Marx and Benjamin Franklin).</li>
                        <li>Issued Japan’s special visa for Intellectual Figures.</li>
                        <li>Presented my prototype for a low-cost laptop among the top entries at IIT Delhi; appreciated by the Head of MIT Media Labs and Alberto Minetti (Nobel Laureate).</li>
                        <li>Young Researcher Awardee 2020 and Young Achiever Awardee 2020-21.</li>
                        <li>Felicitated with a medal by the Former Director of India’s Prime Minister's Office for winning the Beat Plastic Hackathon.</li>
                        <li>Represented Indian delegation in the India-Venezuela Youth Dialogue, Harvard Project for Asian & International Relations, India-China Roundtable, India-Norway Youth Conference, India-Azerbaijan Roundtable Dialogue, India-Botswana Dialogue 2018, World Business Dialogue, etc.</li>
                      </ul>
                    </CardContent>
                  </Card>
                </section>
            </div>

            <section id="publications">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6" /> Publications
                </h2>
                 <Card>
                    <CardContent className="p-4">
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground columns-1 md:columns-2 lg:columns-3 md:gap-4">
                            <li>Estonia's e-governance and public service delivery solution; IEEE</li>
                            <li>Decoding identity in the Metaverse; Yourstory</li>
                            <li>China's approach to AI: A review of policy, ethics, and research advancements; The Responsible AI Forum 2021 in Munich</li>
                            <li>Ethical implications in Artificial Intelligence and Brain Computer Interfaces (under review)</li>
                            <li>Analysis of Global Research Proceedings in Artificial Intelligence; IEEE</li>
                            <li>The emerging Internet of Value; Inc42</li>
                            <li>Framework to evaluate the impact of Algorithmic bias; International Journal of Advanced Research</li>
                            <li>Emergence of TechFin in the emerging economies; International Organization of Scientific Research</li>
                            <li>Base erosion and profit shifting in multinational corporations; Theoretical & Applied Economics</li>
                            <li>Growth of Digital Payments and the emergence of FinTech ecosystem in India; Indian Journal of Research</li>
                            <li>Coronavirus Outbreak: Trillion-Dollar Crisis and Evolution of New Global Order; Diplomacy and Beyond</li>
                            <li>A literature review on Internet of Things (IoT); International Journal of Computer Systems</li>
                            <li>Current Trends and Approaches of Network Intrusion Detection System, IJCSMC</li>
                            <li>Case Study on Mobile Applications Industry; Imperial Journal of Interdisciplinary Research</li>
                            <li>Security in Ubiquitous Computing: Location-Based Applications, Study and Analysis of security threats and attacks in MANET; National Conference on Recent Trends and Developments in Statistics (UGC SAP Sponsored)</li>
                            <li>A Review on the Multi-Modal Biometric Systems; International Journal of Comp. Tech. & Applications</li>
                            <li>Comparative Analysis of Coverage Schemes in Wireless Sensor Network; Communications on Applied Electronics</li>
                            <li>Raspberry Pi based Implementation of Internet of Things using mobile messaging application - Telegram</li>
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
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <Lightbulb className="w-6 h-6" /> Other Projects
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

             <section id="interests">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <Heart className="w-6 h-6" /> Interests
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
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6" /> Testimonials
                </h2>
                 <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes and always able to explain things to me when it's hard for me to get things. He has my highest endorsement."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">Jack Alison</p>
                            <p className="text-xs text-muted-foreground text-right">Screenwriter for Academy Awards (Oscars)</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "I am very comfortable to recommend him for any job that requires strict deadlines, taking on new challenges at short notice and dealing with altering priorities, efficient client communication and good analytical capabilities."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">Bharath Visweswariah</p>
                            <p className="text-xs text-muted-foreground text-right">Director Investments, Omidyar Network</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="p-4">
                            <blockquote className="border-l-2 pl-4 italic text-sm text-muted-foreground">
                            "He helped me a lot in working closely with me and understand my requirements even though we had some language barriers between us but Vedang has never let these barriers be the reason of any delay in the work."
                            </blockquote>
                            <p className="mt-3 font-semibold text-right text-sm">Eran Malovani</p>
                            <p className="text-xs text-muted-foreground text-right">Founder of CPA+</p>
                        </CardContent>
                    </Card>
                 </div>
            </section>

            <AsSeenIn />

            <section id="media-link" className="text-center">
                <Button asChild size="lg">
                    <Link href="/media">Speaking Engagements &amp; Media Mentions</Link>
                </Button>
            </section>

          </div>
        </div>
      </div>

    </PageLayout>
  );
}