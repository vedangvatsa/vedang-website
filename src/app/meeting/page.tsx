import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { CalEmbed } from '@/components/cal-embed';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.meeting.title,
  description: pageMetadata.meeting.description,
  url: pageMetadata.meeting.url,
  ogImageAlt: 'Book a meeting with Vedang Vatsa',
});

export default function MeetingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Book a Meeting"
        subtitle="Schedule a 1:1 conversation. Available for AI strategy, Web3 advisory, speaking engagements, and collaboration."
        showAvatar
      />
      <div className="pb-16">
        <CalEmbed calLink="vedangvatsa" />
      </div>
    </PageLayout>
  );
}
