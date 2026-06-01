import { Metadata } from 'next';
import { NomadMapWrapper } from '@/components/nomad-map-wrapper';
import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';

export const metadata: Metadata = {
  title: 'Digital Nomad Directory - Coliving & Stays in 95 Cities',
  description: 'Interactive directory of 4,300+ coliving houses, hostels, apartments, and guesthouses across 95 digital nomad cities in 52 countries. Quality-scored, open-source data.',
  keywords: ['digital nomad', 'coliving', 'remote work', 'nomad directory', 'hostel', 'apartment'],
  alternates: { canonical: '/nomad' },
  openGraph: {
    title: 'Digital Nomad Directory',
    description: '4,300+ coliving, hostels, and apartments across 95 cities in 52 countries.',
    url: 'https://veda.ng/nomad',
    type: 'website',
  },
};

export default function NomadMapPage() {
  return (
    <PageLayout>
      <PageHero
        title="Digital Nomad Directory"
        subtitle="4,300+ coliving houses, hostels, apartments, and guesthouses across 95 cities in 52 countries."
      />

      <div className="max-w-[1600px] mx-auto pb-16">
        <NomadMapWrapper />
      </div>
    </PageLayout>
  );
}
