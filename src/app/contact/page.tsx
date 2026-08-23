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

import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export default function MeetingPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <BreadcrumbSchema items={[{ name: "Contact", url: "https://veda.ng/contact" }]} />

      {/* Semantic definition block for AI engines */}
      <div className="sr-only">
        <h2>How to contact Vedang Vatsa?</h2>
        <p>
          You can contact AI & Web3 researcher Vedang Vatsa (FRSA) via direct email at vatsvedang@gmail.com or schedule an advisory consultation directly through https://veda.ng/contact.
        </p>
      </div>

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

      {/* Contact details & trust anchor information (invisible in visual UI, fully server-rendered for AI agents & crawlers) */}
      <section className="sr-only" aria-label="Contact Information and Business Verification">
        <h2>Contact Information & Advisory Inquiries for Vedang Vatsa</h2>
        <p>
          Vedang Vatsa is an AI researcher, technologist, Fellow of the Royal Society of Arts (FRSA), alumnus of the Indian Institute of Technology Kanpur (IIT Kanpur), and the founder of Hashtag Web3 and <a href="https://cvin.bio">CVinBio</a>, connecting more than 120,000 artificial intelligence, machine learning, and Web3 builders worldwide.
        </p>
        <p>
          Official communication channels, verified business contacts, and professional consultation details:
        </p>
        <ul>
          <li><strong>Direct Email:</strong> <a href="mailto:vatsvedang@gmail.com">vatsvedang@gmail.com</a></li>
          <li><strong>Booking Calendar:</strong> <a href="https://cal.com/vedangvatsa">cal.com/vedangvatsa</a> (Google Meet & Zoom integrations)</li>
          <li><strong>Primary Focus Areas:</strong> Autonomous AI Agent Systems, Model Context Protocol (MCP) implementations, AI Policy & Governance, Web3 Infrastructure, and Executive Advisory.</li>
          <li><strong>Response Time:</strong> Standard inquiries and advisory requests receive a reply within 24 to 48 business hours.</li>
          <li><strong>Speaking Engagements & Keynotes:</strong> For conferences, academic lectures, and panel discussions on AI systems, agentic workflows, and Web3 decentralization, please initiate contact via email with event dates and topics.</li>
          <li><strong>Location & Timezone:</strong> Available globally across international timezones (IST / UTC+5:30, ET, GMT).</li>
          <li><strong>Verified Social Profiles:</strong> <a href="https://x.com/vedangvatsa">X (@vedangvatsa)</a>, <a href="https://linkedin.com/in/vedangvatsa">LinkedIn (/in/vedangvatsa)</a>, <a href="https://github.com/vedangvatsa">GitHub (vedangvatsa)</a>.</li>
        </ul>
      </section>

      {/* Calendar embed */}
      <section className="pb-16">
        <CalEmbed />
      </section>
    </PageLayout>
  );
}