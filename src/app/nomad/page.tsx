import { Metadata } from 'next';
import { NomadMapWrapper } from '@/components/nomad-map-wrapper';
import { PageLayout } from '@/components/page-layout';

export const metadata: Metadata = {
  title: 'Digital Nomad Directory - Coliving & Stays in 95 Cities',
  description: 'Interactive directory of 4,400+ coliving houses, hostels, apartments, and guesthouses across 95 digital nomad cities in 52 countries. Quality-scored, open-source data.',
  keywords: ['digital nomad', 'coliving', 'remote work', 'nomad directory', 'hostel', 'apartment'],
  alternates: { canonical: '/nomad' },
  openGraph: {
    title: 'Digital Nomad Directory',
    description: '4,400+ coliving, hostels, and apartments across 95 cities in 52 countries.',
    url: 'https://veda.ng/nomad',
    type: 'website',
  },
};

export default function NomadMapPage() {
  return (
    <PageLayout>
      <section className="text-center pt-12 pb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Digital Nomad Directory
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            4,400+ coliving houses, hostels, apartments, and guesthouses across 95 cities in 52 countries.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-[1600px] pb-16">
        <NomadMapWrapper />
      </div>
    </PageLayout>
  );
}
