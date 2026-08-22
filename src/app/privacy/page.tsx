import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import Link from 'next/link';
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from '@/lib/trust-content';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Privacy Policy - veda.ng',
  description:
    'How veda.ng handles data: no accounts, no profiles. Google Analytics 4 and Microsoft Clarity analytics plus a Cal.com booking embed, described in plain language.',
  url: '/privacy',
});

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  url: 'https://veda.ng/privacy',
  description: PRIVACY_INTRO,
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Vedang Vatsa',
    url: 'https://veda.ng',
  },
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <PageHero title="Privacy Policy" subtitle={PRIVACY_INTRO} />
      <article className="pb-16">
        {PRIVACY_SECTIONS.map((section) => (
          <section key={section.heading} className="mb-8">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">{section.heading}</h2>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-3">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <p className="text-sm text-muted-foreground">
          Questions about this policy? The <Link href="/meeting" className="underline underline-offset-4 hover:text-foreground">meeting page</Link> lists every way to reach the site owner.
        </p>
      </article>
    </PageLayout>
  );
}
