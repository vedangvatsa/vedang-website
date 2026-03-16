

import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { Separator } from '@/components/ui/separator';
import { Linkedin, Send, Twitter } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { essays } from '@/lib/essays';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.seo.title,
  description: pageMetadata.seo.description,
  url: pageMetadata.seo.url,
  ogImageAlt: 'Vedang Vatsa - SEO & Growth Specialist',
});

export default function SeoProfilePage() {
  const recentEssays = essays.slice(0, 4);

  return (
    <PageLayout>
      <BreadcrumbSchema items={[{ name: "SEO & Growth", url: "https://veda.ng/seo" }]} />

      <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">&larr; Home</Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">SEO & growth marketing</h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Data-driven growth leader with 8+ years of experience scaling organic and paid acquisition channels for high-growth mobile and Web3 products. Proven track record in SEO, ASO, community building, and cross-functional leadership.
        </p>
        <div className="flex items-center gap-4 mt-3">
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></Link>
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter"><Twitter className="h-4 w-4" /></Link>
          <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Telegram"><Send className="h-4 w-4" /></Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">40x</p>
            <p className="text-xs text-muted-foreground mt-1">User growth (5k → 200k)</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">100k+</p>
            <p className="text-xs text-muted-foreground mt-1">Web3 community founded</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="text-2xl font-semibold">~90M</p>
            <p className="text-xs text-muted-foreground mt-1">Annual content reach</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Core competencies</h2>
          <div className="mt-6 space-y-4">
            {[
              ['SEO & Website Management', 'Achieved top 3 Google SERP rankings for target keywords within 4 months. Managed web properties achieving 2.3M+ views and a Google PageSpeed score of 98.'],
              ['ASO & Mobile Growth', 'Optimized app visibility and conversion using App Store Connect and Sensor Tower, driving user acquisition and retention for iOS and Android platforms.'],
              ['Data-driven Experimentation', 'Executed high-velocity A/B testing, funnel optimization, and lifecycle initiatives using GA4, Adjust, and Firebase.'],
              ['Paid Acquisition & Performance Media', 'Planned and executed paid campaigns across Meta, Google, and YouTube, focusing on cost-effective user acquisition and measurable ROI.'],
              ['Community & Content Marketing', 'Founded and scaled a 100,000+ member Web3 professional community, leveraging content strategy that generates ~90 million annual impressions.'],
              ['Cross-Functional Leadership', '8 years of experience, including growing a team from 3 to 28. Ex-KPMG & EY consultant working with product, engineering, and brand teams.'],
            ].map(([title, desc], i) => (
              <div key={i}>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Technical toolkit</h2>
          <ul className="mt-6 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li><span className="font-medium text-foreground">Analytics & ASO:</span> GA4, Firebase, Adjust, Sensor Tower, GSC, App Store Connect, Plausible, Ahrefs</li>
            <li><span className="font-medium text-foreground">Technical SEO:</span> Full-stack audits, schema markup, log analysis, site speed optimization, Screaming Frog</li>
            <li><span className="font-medium text-foreground">Paid Media:</span> Google Ads, Meta Ads, X Ads, YouTube Ads</li>
            <li><span className="font-medium text-foreground">Creative & Design:</span> Figma, Canva, Adobe Photoshop, Adobe Express</li>
            <li><span className="font-medium text-foreground">Web & CMS:</span> WordPress, Webflow, HTML/CSS, React, Wix, Shopify, Firebase Studio</li>
            <li><span className="font-medium text-foreground">AI Tools:</span> GPT-4, Claude, Midjourney for content and creative workflows</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Experience</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-medium">Growth Advisory · Hashtag Web3</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Established one of the largest global communities for Web3 professionals (100,000+ members).</li>
                <li>Published crash courses and newsletters with 40,000 subscribers.</li>
                <li>Revamped and SEO-optimized website, publishing 700 keyword-targeted pages and acquiring 1,500+ backlinks in 4 months.</li>
                <li>Served as growth advisor for Zeeve, Talent Protocol, Bobble AI, Bless Network, Cypher (YC), and others.</li>
                <li>Content strategy results in ~90 million annual impressions.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Marketing Lead · Routespring</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Led end-to-end growth marketing for a B2B SaaS travel platform.</li>
                <li>Built a 100% SEO-compliant website from scratch achieving 150k+ monthly impressions.</li>
                <li>Increased Domain Rating from 9 to 43 and grew backlinks from 109 to over 2,300.</li>
                <li>Drove a 50% increase in qualified sales leads through organic channels.</li>
                <li>Positioned the product among top 5 in its G2 category.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Country Head (Growth) · Prosple</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Led user growth to 200K through content and social media, generating 1.5M geo-targeted web hits.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Consultant · KPMG & EY</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Served in the Minister&apos;s Office, Ministry of Electronics & IT, India, on social media strategy and growth dashboards.</li>
                <li>Conducted research for high-value e-commerce, fintech, blockchain, and social media firms.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Project Manager · Studio Tesseract</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mt-2">
                <li>Co-founded and led a 30-member team to deliver 27 web and mobile products across 5 continents.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Qualifications & recognition</h2>
          <ul className="mt-6 list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Computer Engineer + MBA from IIT Kanpur</li>
            <li>Fellow of the Royal Society for Arts (FRSA)</li>
            <li>Top 50 Global Metaverse Influencer (Thinkers360) and Top 50 Fintech & Crypto Creators (Favikon)</li>
            <li>22 published manuscripts on AI, Web3, and digital economies</li>
            <li>Worked with companies across 5 continents; issued Japan&apos;s special visa for Intellectual Figures</li>
            <li>Endorsed by leaders from Google, EY, KPMG, Accenture, Omidyar Network</li>
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
          <h2 className="text-2xl font-semibold tracking-tight border-b border-border pb-2">Recent writing</h2>
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
