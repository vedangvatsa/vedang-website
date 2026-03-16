

import { PageLayout } from '@/components/page-layout';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Linkedin,
  Mail,
  Send,
  Twitter,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
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
  worksFor: { '@type': 'Organization', name: 'Hashtag Web3' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology, Kanpur' },
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

const experience = [
  {
    title: 'Growth Advisory (Founder)', company: 'Hashtag Web3', period: 'October 2022 - Present',
    points: [
      'Served as Head of Marketing and Growth Lead for several Web3 companies.',
      'Built a 100k+ member networking community for Web3, a social-messaging-first forum, and one of the largest channels for Web3 jobs - 55 million post views in the first year.',
      'Featured among the top 3 Web3 products of the week by Smoothie and supported by Microsoft for Startups.',
      'Hosted weekly Twitter Spaces with high-profile guests (including a band member of Pink Floyd, partners of Big4 firms, the father of digital twin technology, and the CSO of Microsoft), attracting 20-30k live attendees.',
      'Partnered with leading organizations like Harvard Blockchain Club, ETH Oxford, Token 2049, ETH Vietnam, Taipei Blockchain Week, Oxford Blockchain Conference, Malaysia Blockchain Week, ETH Brussels, EDCON Tokyo, etc.',
      'Published crash courses on NFT, Metaverse, Tokenomics, DAO, Blockchain, and DeFi, with 50,000 accesses in the first month and 40,000 newsletter subscribers.',
      'Among top 100 thought leaders & influencers in Metaverse and Smart Cities by Thinkers360.',
      'Research reporting on AI and Web3 resulted in 80 million yearly LinkedIn post views & features by LinkedIn News UK & Europe.',
    ],
  },
  {
    title: 'Country Head', company: 'Prosple', period: 'September 2021 - October 2022',
    desc: 'Led user growth to 200K through content, social media & social messaging initiatives - generating over 1.5M geo-targeted web hits. Hosted events with top company executives (Microsoft, Bain & Company, etc.) and partnered with startups and educational institutions.',
  },
  {
    title: 'Consultant', company: 'KPMG', period: 'September 2019 - September 2021',
    subsections: [
      { heading: 'Program Management (Ministry of Electronics and IT, India)', points: [
        'Served as Program Manager for Digital-India products and projects under the Ministry.',
        "Worked on the Minister's social media strategy, created a personal website, and liaised with scientists, state officials, startup founders, CXOs, and bureaucrats.",
        'Served as an evaluation committee member for a government innovation challenge.',
      ]},
      { heading: 'Research and Due Diligence', points: [
        'Commercial Due Diligence (Ecommerce with $2B valuation, Digital Payments - 2500Mn transaction volume).',
        'Technical Due Diligence (HealthTech app with 220 million downloads, Social Media with $100 million valuation).',
        'Policy Research (National Policy on Software Products, Responsible AI, Data Protection Bill, Fake news, Proceedings on BigTechs, etc.).',
      ]},
      { heading: 'Business Strategy & Analysis', points: [
        "Designed strategies for KPMG's Analytics Centre of Excellence, a crowdfunding platform, and data centers.",
        "Monitored projects in Language Translation, Digital Villages, & AI. Prepared process architecture and delivery model for contactless tracking in India-Posts (world's largest postal network).",
        "Multiple Kudos + Top Scorer award in KPMG's Digital Premier League on Emerging Technologies.",
      ]},
    ],
  },
  {
    title: 'Project Manager (Co-Founder)', company: 'Studio Tesseract', period: 'April 2013 - June 2017',
    desc: 'Led a 30-member team, delivering 27 web and mobile products across the full development lifecycle. Expanded business development and UI design globally, serving clients on 5 continents. Secured recommendations from the screenwriter for Oscars and CPA+ Israel.',
  },
];

const publications = [
  "Estonia's e-governance and public service delivery solution; IEEE",
  'Decoding identity in the Metaverse; Yourstory',
  "China's approach to AI: A review of policy, ethics, and research advancements; The Responsible AI Forum 2021 in Munich",
  'Ethical implications in Artificial Intelligence and Brain Computer Interfaces (under review)',
  'Analysis of Global Research Proceedings in Artificial Intelligence; IEEE',
  'The emerging Internet of Value; Inc42',
  'Framework to evaluate the impact of Algorithmic bias; International Journal of Advanced Research',
  'Emergence of TechFin in the emerging economies; International Organization of Scientific Research',
  'Base erosion and profit shifting in multinational corporations; Theoretical & Applied Economics',
  'Growth of Digital Payments and the emergence of FinTech ecosystem in India; Indian Journal of Research',
  'Coronavirus Outbreak: Trillion-Dollar Crisis and Evolution of New Global Order; Diplomacy and Beyond',
  'A literature review on Internet of Things (IoT); International Journal of Computer Systems',
  'Current Trends and Approaches of Network Intrusion Detection System, IJCSMC',
  'Case Study on Mobile Applications Industry; Imperial Journal of Interdisciplinary Research',
  'Security in Ubiquitous Computing: Location-Based Applications, Study and Analysis of security threats and attacks in MANET; National Conference on Recent Trends and Developments in Statistics (UGC SAP Sponsored)',
  'A Review on the Multi-Modal Biometric Systems; International Journal of Comp. Tech. & Applications',
  'Comparative Analysis of Coverage Schemes in Wireless Sensor Network; Communications on Applied Electronics',
  'Raspberry Pi based Implementation of Internet of Things using mobile messaging application - Telegram',
];

const testimonials = [
  { quote: 'I always find his work to be of just the absolute high quality. He is always timely, so easy to work with, responsive to notes and always able to explain things to me when it\'s hard for me to get things. He has my highest endorsement.', name: 'Jack Alison', role: 'Screenwriter for Academy Awards (Oscars)' },
  { quote: 'I am very comfortable to recommend him for any job that requires strict deadlines, taking on new challenges at short notice and dealing with altering priorities, efficient client communication and good analytical capabilities.', name: 'Bharath Visweswariah', role: 'Director Investments, Omidyar Network' },
  { quote: 'He helped me a lot in working closely with me and understand my requirements even though we had some language barriers between us but Vedang has never let these barriers be the reason of any delay in the work.', name: 'Eran Malovani', role: 'Founder of CPA+' },
];

export default function ProfilePage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
        <h1 className="text-4xl font-semibold tracking-tight">Vedang Vatsa</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Computer Engineer, MBA, Chartered Engineer. IIT Kanpur alumnus. Fellow of the Royal Society of Arts. Young Researcher 2020 Awardee (22 publications), Young Achiever 2020-21 Awardee.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <Link href="mailto:vedangvatsa.2019@iitkalumni.org" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email"><Mail className="h-4 w-4" /></Link>
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter className="h-4 w-4" /></Link>
          <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Telegram"><Send className="h-4 w-4" /></Link>
          <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Google Scholar"><BookOpen className="h-4 w-4" /></Link>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Experience</h2>
          <div className="mt-6 space-y-8">
            {experience.map((job, i) => (
              <div key={i}>
                <div className="flex justify-between items-start flex-wrap gap-1">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{job.period}</p>
                </div>
                {job.desc && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{job.desc}</p>}
                {job.points && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                    {job.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                )}
                {job.subsections && job.subsections.map((sub, k) => (
                  <div key={k} className="mt-3">
                    <h4 className="font-medium text-sm">{sub.heading}</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-1">
                      {sub.points.map((p, j) => <li key={j}>{p}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Education</h2>
          <div className="mt-6">
            <h3 className="font-medium">BE - Computer Engineering & MBA</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
              <li>President&apos;s Gold Medal nominee at the Indian Institute of Technology Kanpur.</li>
              <li>Represented 100+ students as the department student representative, led a 40-member Entrepreneurship Cell team, and grew internship offers by 73%.</li>
              <li>Won &quot;Freshman of the Year,&quot; served as Training and Placement Cell Executive Head.</li>
              <li>Finished Management Development Program on leadership from Indian Institute of Management Indore.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Key achievements</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-6">
            <li>Awarded as a Fellow of the Royal Society for the Encouragement of Arts, Manufactures and Commerce (Previous Fellows have included Stephen Hawking, Charles Dickens, Karl Marx and Benjamin Franklin).</li>
            <li>Issued Japan&apos;s special visa for Intellectual Figures.</li>
            <li>Presented my prototype for a low-cost laptop among the top entries at IIT Delhi; appreciated by the Head of MIT Media Labs and Alberto Minetti (Nobel Laureate).</li>
            <li>Young Researcher Awardee 2020 and Young Achiever Awardee 2020-21.</li>
            <li>Felicitated with a medal by the Former Director of India&apos;s Prime Minister&apos;s Office for winning the Beat Plastic Hackathon.</li>
            <li>Represented Indian delegation in the India-Venezuela Youth Dialogue, Harvard Project for Asian & International Relations, India-China Roundtable, India-Norway Youth Conference, India-Azerbaijan Roundtable Dialogue, India-Botswana Dialogue 2018, World Business Dialogue, etc.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Publications</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-6">
            {publications.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
          <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            View on Google Scholar
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Testimonials</h2>
          <div className="mt-6 space-y-6">
            {testimonials.map((t, i) => (
              <div key={i}>
                <blockquote className="border-l-3 border-border pl-4 text-sm text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                <p className="mt-2 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />
        <div className="text-center">
          <Link href="/media" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Speaking engagements & media mentions
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}