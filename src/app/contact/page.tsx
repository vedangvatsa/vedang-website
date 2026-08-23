import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { CalEmbed } from '@/components/cal-embed';
import Link from 'next/link';

const baseMetadata = generateMetadata({
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  url: pageMetadata.contact.url,
  ogImage: '/og/contact.png',
  ogImageAlt: 'Book a meeting with Vedang Vatsa',
});

export const metadata: Metadata = {
  ...baseMetadata,
  other: {
    ...(baseMetadata.other ?? {}),
    contact: 'vatsvedang@gmail.com',
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Vedang Vatsa',
  url: 'https://veda.ng/contact',
  description: pageMetadata.contact.description,
  mainEntity: {
    '@type': 'Person',
    name: 'Vedang Vatsa',
    email: 'vatsvedang@gmail.com',
    url: 'https://veda.ng/about',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'vatsvedang@gmail.com',
      contactType: 'customer support',
      availableLanguage: ['English'],
    },
  },
};

export default function MeetingPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageHero
        title="Book a Meeting"
        showAvatar
      >
        <a href="mailto:vatsvedang@gmail.com" className="sr-only">
          Email Vedang Vatsa at vatsvedang@gmail.com
        </a>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Profile
          </Link>
          <Link href="/essays" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Essays
          </Link>
          <Link href="/media" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Media
          </Link>
        </div>
      </PageHero>

      {/* Contact details & consultation information (invisible in visual UI, machine/screen-reader accessible) */}
      <section className="sr-only">
        <p>
          Vedang Vatsa is an AI & Web3 researcher, Fellow of the Royal Society of Arts (FRSA), alumnus of IIT Kanpur, and the founder of Hashtag Web3.
        </p>
        <p>
          For executive advisory, keynote speaking engagements, AI agent architecture consulting, or research collaborations, schedule a session using the calendar below or email directly at <a href="mailto:vatsvedang@gmail.com">vatsvedang@gmail.com</a>.
        </p>
        <p>
          Typical response time for inquiries is within 24 to 48 business hours. Meetings are conducted via Google Meet or Zoom.
        </p>
      </section>

      {/* Calendar embed */}
      <section className="pb-16">
        <CalEmbed />
      </section>
    </PageLayout>
  );
}