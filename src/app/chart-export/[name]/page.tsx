import { notFound } from 'next/navigation';
import { essayChartComponents, essayChartNames } from '../chart-bundle';

type Props = { params: Promise<{ name: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return essayChartNames.map((name) => ({ name }));
}

export default async function SingleChartExportPage({ params }: Props) {
  const { name } = await params;
  if (!(name in essayChartComponents)) notFound();
  const Chart = essayChartComponents[name as keyof typeof essayChartComponents];
  return (
    <div className="bg-white min-h-screen p-8">
      <div id={`chart-${name}`} data-chart-export={name} className="chart-export-root max-w-4xl mx-auto">
        <Chart />
      </div>
    </div>
  );
}