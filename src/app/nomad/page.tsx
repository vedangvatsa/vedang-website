import { Metadata } from 'next';
import { NomadMap } from '@/components/nomad-map';
import { PageLayout } from '@/components/page-layout';
import nomadData from '@/lib/nomad-data.json';

export const metadata: Metadata = {
  title: 'Digital Nomad Directory — Coworking, Coliving & Stays in 74 Cities',
  description: 'Interactive directory of 3,600+ coworking spaces, coliving houses, hostels, apartments, and guesthouses across 74 digital nomad cities in 47 countries. Quality-scored, open-source data.',
  keywords: ['digital nomad', 'coworking spaces', 'coliving', 'remote work', 'nomad directory', 'hostel', 'apartment'],
  alternates: { canonical: '/nomad' },
  openGraph: {
    title: 'Digital Nomad Directory',
    description: '3,600+ coworking spaces, coliving, hostels, and apartments across 74 cities in 47 countries.',
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
            3,600+ coworking spaces, coliving houses, hostels, apartments, and guesthouses across 74 cities in 47 countries. Quality-scored and sorted by data completeness.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-[1600px] pb-16">
        <NomadMap data={nomadData as any} />
      </div>
    </PageLayout>
  );
}
