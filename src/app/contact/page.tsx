import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { CalEmbed } from '@/components/cal-embed';
import Link from 'next/link';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.contact.title,
  description: pageMetadata.contact.description,
  url: pageMetadata.contact.url,
  ogImage: '/og/contact.png',
  ogImageAlt: 'Book a meeting with Vedang Vatsa',
});

export default function MeetingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Book a Meeting"
        showAvatar
      >
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
          <a href="mailto:vatsvedang@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Email
          </a>
        </div>
      </PageHero>

      {/* Calendar embed */}
      <section className="pb-16">
        <CalEmbed />
      </section>
    </PageLayout>
  );
}
