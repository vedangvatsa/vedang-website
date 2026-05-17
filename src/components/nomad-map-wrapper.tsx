'use client';

import dynamic from 'next/dynamic';

const NomadMap = dynamic(
  () => import('@/components/nomad-map').then(m => m.NomadMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    ),
  }
);

export function NomadMapWrapper({ data }: { data: any[] }) {
  return <NomadMap data={data} />;
}
