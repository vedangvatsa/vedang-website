import { Metadata } from 'next';
import { NomadMap } from '@/components/nomad-map';
import nomadData from '@/lib/nomad-data.json';

export const metadata: Metadata = {
  title: 'Digital Nomad Map - Coworking, Hostels, Cafes Worldwide',
  description: 'Interactive map of coworking spaces, hostels, wifi cafes, libraries, and gyms across 30+ digital nomad cities worldwide. Free, open-source data from OpenStreetMap.',
  keywords: ['digital nomad', 'coworking spaces', 'remote work', 'nomad map', 'wifi cafe', 'hostel directory'],
  alternates: { canonical: '/nomad-map' },
  openGraph: {
    title: 'Digital Nomad Map',
    description: 'Interactive directory of coworking spaces, hostels, and wifi cafes across 30+ cities.',
    url: 'https://veda.ng/nomad-map',
    type: 'website',
  },
};

export default function NomadMapPage() {
  return (
    <>
      <section className="text-center pt-16 pb-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Digital Nomad Map
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Coworking spaces, hostels, wifi cafes, libraries, gyms, and laundromats across 30+ cities worldwide. All data sourced from OpenStreetMap.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-[1600px] pb-16">
        <NomadMap data={nomadData as any} />
      </div>
    </>
  );
}
