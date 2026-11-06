import { PageLayout } from '@/components/page-layout';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import Image from 'next/image';
import { AsSeenIn } from '@/components/as-seen-in';
import { PageHero } from '@/components/page-hero';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { ParliamentCallout } from '@/components/parliament-callout';
import { MediaMentionsGrid } from '@/components/media-mentions-grid';
import { SpeakingGallery } from '@/components/speaking-gallery';
import { mediaMentions } from '@/lib/media-data';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.media.title,
  description: pageMetadata.media.description,
  url: pageMetadata.media.url,
  ogImage: '/media/opengraph-image',
  ogImageAlt: 'Speaking Engagements & Media | Vedang Vatsa',
});

const mediaSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Press Coverage & Media Mentions of Vedang Vatsa',
  url: 'https://veda.ng/media',
  description: 'Verified press quotes, news features, and media citations of Vedang Vatsa across Decrypt, Yahoo Finance, Business Standard, The Tribune, Outlook Money, and ThePrint.',
  about: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng/about',
    sameAs: [
      'https://x.com/vedangvatsa',
      'https://linkedin.com/in/vedangvatsa',
      'https://github.com/vedangvatsa',
      'https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en',
    ],
  },
  hasPart: mediaMentions.map((m) => ({
    '@type': 'NewsArticle',
    headline: m.title,
    url: m.url,
    publisher: {
      '@type': 'Organization',
      name: m.source,
    },
  })),
};

export default function MediaPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "Media & Speaking", url: "https://veda.ng/media" }]} />
      <div>
        <div>
          <PageHero
            title="Speaker on Emerging Technologies"
          />

          <section className="max-w-4xl mx-auto py-8">
            <ul className="space-y-1 text-sm text-muted-foreground text-left md:columns-2 md:gap-4">
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Founder, Hashtag Web3 (100,000+ member community of AI & Web3 professionals)</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Featured in Favikon’s Top 50 Fintech & Crypto Creators, Thinkers360’s Top 50 Metaverse Thought Leaders, and Creator Chart's Top 200 Creator Professionals</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>BE, Mtech, MBA, Chartered Engineer, IIT Kanpur alumnus, Fellow of the Royal Society of Arts</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Speaker at IIT Delhi, IIT Kanpur, OP Jindal University, Bharati Vidyapeeth, TUM Munich, ISB Hyderabad, ETH Enugu, India Blockchain Month, Premier AI and Web3 Gala, The Responsible AI Forum, Bizthon, Code Africa Conference, NIFT Panchkula, etc.</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Young Researcher 2020 (with 25 publications) and Young Achiever 2020-21 awardee</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Ex-EY & KPMG Consultant, Former Country Head for one of the largest career-tech companies</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Recommendation by Jack Allison (Screenwriter for Oscars 2017), medal by the former director of Indian Prime Minister’s office</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>80 million Linkedin post views & 55 million views on Telegram channel</span></li>
              <li className="flex items-start gap-2"><span className="text-primary mt-1">◆</span><span>Issued Japan’s special visa for Intellectual people</span></li>
            </ul>
          </section>
          
          <ParliamentCallout />
        </div>
      </div>

      <AsSeenIn />

      <div className="py-8">
        <div>
          <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">Speaking Engagements</h2>
            <SpeakingGallery />
          </section>

          <section className="py-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-6">Media Mentions</h2>
            <MediaMentionsGrid />
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
