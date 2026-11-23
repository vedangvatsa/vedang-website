import { essayChartComponents, essayChartNames } from './chart-bundle';

export const dynamic = 'force-static';

/**
 * Local-only page for scripts/capture-essay-charts.mts — exports charts to static images.
 * Not linked from the site; robots disallow via layout metadata.
 */
export default function ChartExportPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="mx-auto max-w-4xl space-y-16 px-6">
        {essayChartNames.map((name) => {
          const Chart = essayChartComponents[name];
          return (
            <div key={name} id={`chart-${name}`} data-chart-export={name} className="chart-export-root">
              <Chart />
            </div>
          );
        })}
      </div>
    </div>
  );
}