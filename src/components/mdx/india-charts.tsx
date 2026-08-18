'use client';

import React from 'react';

const EOL_REPORT = 'https://smartnet.niua.org/sites/default/files/resources/final_web_ease_of_living_report_2020_.pdf';
const HCES_REPORT = 'https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf';
const CPI_REPORT = 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1786529680747_3113661d-1a2b-4b9a-af06-b340193ef9a0_Press_Release_CPI_July_2026.pdf';
const AIR_REPORT = 'https://prana.cpcb.gov.in/ncapServices/robust/fetchFilesFromDrive/Swachh_Vayu_Survekshan_2024_Result.pdf';

type ChartFrameProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  source: string;
  sourceUrl: string;
};

function ChartFrame({ children, title, subtitle, source, sourceUrl }: ChartFrameProps) {
  return (
    <figure className="not-prose my-10 w-full">
      <h3 className="text-lg font-semibold tracking-tight text-[#18181b]">{title}</h3>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">{subtitle}</p>
      {children}
      <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Source:{' '}
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#18181b]">
          {source}
        </a>
      </figcaption>
    </figure>
  );
}

const overallRankings = [
  ['Bengaluru', 66.70],
  ['Pune', 66.27],
  ['Ahmedabad', 64.87],
  ['Chennai', 62.61],
  ['Surat', 61.73],
  ['Navi Mumbai', 61.60],
  ['Coimbatore', 59.72],
  ['Vadodara', 59.24],
  ['Indore', 58.58],
  ['Greater Mumbai', 58.23],
  ['Thane', 58.16],
  ['Kalyan Dombivali', 57.71],
  ['Delhi', 57.56],
  ['Ludhiana', 57.36],
  ['Visakhapatnam', 57.28],
  ['Pimpri Chinchwad', 57.16],
  ['Solapur', 56.58],
  ['Raipur', 56.26],
  ['Bhopal', 56.26],
  ['Rajkot', 55.94],
] as const;

export function IndiaCityRankings() {
  const max = 70;
  const rowHeight = 27;
  const chartHeight = 24 + overallRankings.length * rowHeight;

  return (
    <ChartFrame
      title="Ease of Living Index, 2020"
      subtitle="Overall scores for the top 20 cities above one million people"
      source="MoHUA, Ease of Living Index 2020, Table 2"
      sourceUrl={EOL_REPORT}
    >
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 820 ${chartHeight}`}
          className="w-full min-w-[620px]"
          role="img"
          aria-label="Bar chart of Ease of Living scores for the top 20 Million-plus Indian cities in 2020"
        >
          <title>Ease of Living Index 2020 ranking</title>
          {overallRankings.map(([city, score], index) => {
            const y = 12 + index * rowHeight;
            const barWidth = (score / max) * 500;
            return (
              <g key={city}>
                <text x="0" y={y + 13} fontSize="11" fill="#52525b">{index + 1}</text>
                <text x="26" y={y + 13} fontSize="11" fontWeight="500" fill="#18181b">{city}</text>
                <line x1="164" x2="674" y1={y + 10} y2={y + 10} stroke="#f1f5f9" />
                <rect x="164" y={y + 3} width={barWidth} height="14" fill={index < 3 ? '#4f46e5' : '#94a3b8'} />
                <text x="694" y={y + 13} fontSize="11" fontWeight="600" fill="#18181b">{score.toFixed(2)}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartFrame>
  );
}

const pillarData = [
  { city: 'Bengaluru', quality: 55.67, economy: 78.82, sustainability: 59.97 },
  { city: 'Pune', quality: 58.10, economy: 48.88, sustainability: 75.74 },
  { city: 'Chennai', quality: 60.84, economy: 34.16, sustainability: 57.05 },
  { city: 'Ahmedabad', quality: 57.46, economy: 48.19, sustainability: 64.22 },
  { city: 'Surat', quality: 57.96, economy: 30.29, sustainability: 62.41 },
  { city: 'Indore', quality: 59.86, economy: 15.09, sustainability: 61.62 },
  { city: 'Mumbai', quality: 51.12, economy: 32.12, sustainability: 60.74 },
  { city: 'Delhi', quality: 51.22, economy: 50.73, sustainability: 56.02 },
  { city: 'Hyderabad', quality: 51.28, economy: 30.05, sustainability: 58.69 },
  { city: 'Coimbatore', quality: 60.33, economy: 32.48, sustainability: 48.25 },
];

const pillarSeries = [
  { key: 'quality', label: 'Quality of life', color: '#4f46e5' },
  { key: 'economy', label: 'Economic ability', color: '#d97706' },
  { key: 'sustainability', label: 'Sustainability', color: '#15803d' },
] as const;

export function IndiaCityPillars() {
  const plot = { left: 44, top: 16, width: 736, height: 220 };
  const groupWidth = plot.width / pillarData.length;
  const barWidth = 12;

  return (
    <ChartFrame
      title="Pillar scores by city"
      subtitle="Quality of life, economic ability and sustainability, selected cities"
      source="MoHUA, Ease of Living Index 2020, city tables"
      sourceUrl={EOL_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 820 320" className="w-full min-w-[700px]" role="img" aria-label="Grouped bar chart of quality, economic and sustainability scores for ten Indian cities">
          <title>Pillar scores for ten Indian cities</title>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = plot.top + plot.height - (tick / 100) * plot.height;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke="#e3e3e0" />
                <text x={plot.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}</text>
              </g>
            );
          })}
          {pillarData.map((item, index) => {
            const center = plot.left + groupWidth * index + groupWidth / 2;
            return (
              <g key={item.city}>
                {pillarSeries.map((series, seriesIndex) => {
                  const value = item[series.key];
                  const height = (value / 100) * plot.height;
                  return (
                    <rect
                      key={series.key}
                      x={center - 21 + seriesIndex * 15}
                      y={plot.top + plot.height - height}
                      width={barWidth}
                      height={height}
                      fill={series.color}
                    >
                      <title>{`${item.city}: ${series.label} ${value}`}</title>
                    </rect>
                  );
                })}
                <text x={center} y={plot.top + plot.height + 16} fontSize="10" textAnchor="middle" fill="#52525b" transform={`rotate(-35 ${center} ${plot.top + plot.height + 16})`}>{item.city}</text>
              </g>
            );
          })}
          <g transform="translate(44 294)">
            {pillarSeries.map((series, index) => (
              <g key={series.key} transform={`translate(${index * 165} 0)`}>
                <rect width="9" height="9" fill={series.color} />
                <text x="15" y="8" fontSize="10" fill="#52525b">{series.label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </ChartFrame>
  );
}

const spendingProxy = [
  ['Chandigarh', 'Chandigarh', 13425],
  ['Hyderabad', 'Telangana', 8978],
  ['Delhi', 'Delhi', 8534],
  ['Chennai', 'Tamil Nadu', 8165],
  ['Bengaluru', 'Karnataka', 8076],
  ['Pune', 'Maharashtra', 7363],
  ['Visakhapatnam', 'Andhra Pradesh', 7182],
  ['Ahmedabad', 'Gujarat', 7175],
  ['Jaipur', 'Rajasthan', 6574],
  ['Bhubaneswar', 'Odisha', 5825],
  ['Indore', 'Madhya Pradesh', 5538],
  ['Lucknow', 'Uttar Pradesh', 5395],
] as const;

export function IndiaAffordabilityProxy() {
  const max = 14000;
  const rowHeight = 29;
  const chartHeight = 20 + spendingProxy.length * rowHeight;

  return (
    <ChartFrame
      title="Urban household spending"
      subtitle="Monthly per-capita consumption expenditure by state or UT, 2023-24"
      source="MoSPI, Household Consumption Expenditure Survey 2023-24"
      sourceUrl={HCES_REPORT}
    >
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Each city is mapped to its state or UT average. This is household spending, not a city rent index.
      </p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 820 ${chartHeight}`} className="w-full min-w-[640px]" role="img" aria-label="Bar chart of urban monthly per-capita household spending for selected states and union territories">
          <title>Urban monthly per-capita consumption expenditure, 2023-24</title>
          {spendingProxy.map(([city, state, value], index) => {
            const y = 10 + index * rowHeight;
            const width = (value / max) * 500;
            return (
              <g key={city}>
                <text x="0" y={y + 13} fontSize="11" fontWeight="500" fill="#18181b">{city}</text>
                <text x="100" y={y + 13} fontSize="10" fill="#71717a">{state}</text>
                <line x1="204" x2="704" y1={y + 10} y2={y + 10} stroke="#f1f5f9" />
                <rect x="204" y={y + 3} width={width} height="14" fill="#d97706" />
                <text x="724" y={y + 13} fontSize="11" fontWeight="600" fill="#18181b">₹{value.toLocaleString('en-IN')}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartFrame>
  );
}

const quadrantData = [
  { city: 'Bengaluru', quality: 55.67, spending: 8076, labelX: 9, labelY: -7 },
  { city: 'Pune', quality: 58.10, spending: 7363, labelX: 9, labelY: -7 },
  { city: 'Ahmedabad', quality: 57.46, spending: 7175, labelX: 9, labelY: 15 },
  { city: 'Chennai', quality: 60.84, spending: 8165, labelX: 9, labelY: -7 },
  { city: 'Surat', quality: 57.96, spending: 7175, labelX: 9, labelY: -7 },
  { city: 'Coimbatore', quality: 60.33, spending: 8165, labelX: 9, labelY: 15 },
  { city: 'Indore', quality: 59.86, spending: 5538, labelX: 9, labelY: -7 },
  { city: 'Delhi', quality: 51.22, spending: 8534, labelX: 9, labelY: 15 },
  { city: 'Hyderabad', quality: 51.28, spending: 8978, labelX: -70, labelY: -7 },
  { city: 'Visakhapatnam', quality: 51.93, spending: 7182, labelX: 9, labelY: 15 },
  { city: 'Jaipur', quality: 47.66, spending: 6574, labelX: 9, labelY: 15 },
  { city: 'Lucknow', quality: 51.30, spending: 5395, labelX: 9, labelY: -7 },
] as const;

export function IndiaQualityCostQuadrant() {
  const plot = { left: 62, top: 24, width: 650, height: 290 };
  const xMin = 5000;
  const xMax = 9500;
  const yMin = 45;
  const yMax = 62;
  const xMedian = 7272.5;
  const yMedian = 56.565;
  const x = (value: number) => plot.left + ((value - xMin) / (xMax - xMin)) * plot.width;
  const y = (value: number) => plot.top + plot.height - ((value - yMin) / (yMax - yMin)) * plot.height;
  const medianX = x(xMedian);
  const medianY = y(yMedian);

  return (
    <ChartFrame
      title="Quality of life and household spending"
      subtitle="Official quality scores against state or UT urban MPCE"
      source="MoHUA Ease of Living Index 2020; MoSPI HCES 2023-24"
      sourceUrl={EOL_REPORT}
    >
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        The x-axis uses urban MPCE for each city&apos;s state or UT because India does not publish a city-level cost-of-living index.
      </p>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 820 390" className="w-full min-w-[700px]" role="img" aria-label="Quadrant scatter plot comparing Quality of Life scores with urban household spending proxies for twelve Indian cities">
          <title>Quality of life versus household spending</title>
          <rect x={plot.left} y={plot.top} width={plot.width} height={plot.height} fill="#ffffff" stroke="#cbd5e1" />
          {[5000, 6000, 7000, 8000, 9000].map((tick) => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={plot.top} y2={plot.top + plot.height} stroke="#e3e3e0" />
              <text x={x(tick)} y={plot.top + plot.height + 20} fontSize="10" textAnchor="middle" fill="#71717a">₹{tick / 1000}k</text>
            </g>
          ))}
          {[46, 50, 54, 58, 62].map((tick) => (
            <g key={tick}>
              <line x1={plot.left} x2={plot.left + plot.width} y1={y(tick)} y2={y(tick)} stroke="#e3e3e0" />
              <text x={plot.left - 8} y={y(tick) + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}</text>
            </g>
          ))}
          <line x1={medianX} x2={medianX} y1={plot.top} y2={plot.top + plot.height} stroke="#94a3b8" strokeDasharray="4 4" />
          <line x1={plot.left} x2={plot.left + plot.width} y1={medianY} y2={medianY} stroke="#94a3b8" strokeDasharray="4 4" />
          <text x={plot.left + 10} y={plot.top + 17} fontSize="11" fontWeight="600" fill="#4f46e5">Higher quality / lower spending</text>
          <text x={medianX + 10} y={plot.top + 17} fontSize="11" fontWeight="600" fill="#b45309">Higher quality / higher spending</text>
          <text x={plot.left + 10} y={plot.top + plot.height - 10} fontSize="11" fontWeight="600" fill="#15803d">Lower quality / lower spending</text>
          <text x={medianX + 10} y={plot.top + plot.height - 10} fontSize="11" fontWeight="600" fill="#71717a">Lower quality / higher spending</text>
          {quadrantData.map((item) => (
            <g key={item.city}>
              <circle cx={x(item.spending)} cy={y(item.quality)} r="5" fill="#18181b" stroke="#ffffff" strokeWidth="1.5">
                <title>{`${item.city}: Quality of Life ${item.quality}, urban MPCE ₹${item.spending.toLocaleString('en-IN')}`}</title>
              </circle>
              <text x={x(item.spending) + item.labelX} y={y(item.quality) + item.labelY} fontSize="10" fontWeight="600" fill="#18181b">{item.city}</text>
            </g>
          ))}
          <text x={plot.left + plot.width / 2} y="368" fontSize="11" textAnchor="middle" fill="#52525b">Urban MPCE, 2023-24</text>
          <text x="15" y={plot.top + plot.height / 2} fontSize="11" textAnchor="middle" fill="#52525b" transform={`rotate(-90 15 ${plot.top + plot.height / 2})`}>Quality of Life score, 2020</text>
        </svg>
      </div>
    </ChartFrame>
  );
}

const pricePulse = [
  { month: 'Jan', general: 2.75, housing: 1.92 },
  { month: 'Feb', general: 3.02, housing: 2.00 },
  { month: 'Mar', general: 3.11, housing: 1.95 },
  { month: 'Apr', general: 3.16, housing: 1.89 },
  { month: 'May', general: 3.53, housing: 1.91 },
  { month: 'Jun', general: 3.92, housing: 1.90 },
  { month: 'Jul', general: 3.96, housing: 2.01 },
];

export function IndiaPricePulse() {
  const plot = { left: 44, top: 16, width: 700, height: 205 };
  const yMax = 5;
  const point = (index: number, value: number) => ({
    x: plot.left + (index / (pricePulse.length - 1)) * plot.width,
    y: plot.top + plot.height - (value / yMax) * plot.height,
  });
  const linePath = (key: 'general' | 'housing') => pricePulse.map((item, index) => {
    const p = point(index, item[key]);
    return `${index === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }).join(' ');

  return (
    <ChartFrame
      title="Urban inflation, January to July 2026"
      subtitle="Year-on-year change in all-items CPI and housing"
      source="MoSPI, CPI July 2026 release"
      sourceUrl={CPI_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 820 300" className="w-full min-w-[650px]" role="img" aria-label="Line chart of urban CPI and housing inflation from January to July 2026">
          <title>Urban CPI and housing inflation, January to July 2026</title>
          {[0, 1, 2, 3, 4, 5].map((tick) => {
            const y = plot.top + plot.height - (tick / yMax) * plot.height;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke="#e3e3e0" />
                <text x={plot.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}%</text>
              </g>
            );
          })}
          <path d={linePath('general')} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
          <path d={linePath('housing')} fill="none" stroke="#d97706" strokeWidth="2.5" />
          {pricePulse.map((item, index) => {
            const general = point(index, item.general);
            const housing = point(index, item.housing);
            return (
              <g key={item.month}>
                <circle cx={general.x} cy={general.y} r="3.5" fill="#4f46e5" />
                <circle cx={housing.x} cy={housing.y} r="3.5" fill="#d97706" />
                <text x={general.x} y={plot.top + plot.height + 20} fontSize="10" textAnchor="middle" fill="#52525b">{item.month}</text>
              </g>
            );
          })}
          <g transform="translate(44 276)">
            <line x1="0" x2="18" y1="4" y2="4" stroke="#4f46e5" strokeWidth="2.5" />
            <text x="25" y="8" fontSize="10" fill="#52525b">Urban CPI</text>
            <line x1="105" x2="123" y1="4" y2="4" stroke="#d97706" strokeWidth="2.5" />
            <text x="130" y="8" fontSize="10" fill="#52525b">Housing</text>
          </g>
        </svg>
      </div>
    </ChartFrame>
  );
}

const airLeaders = [
  { city: 'Surat', rank: 1 },
  { city: 'Jabalpur', rank: 2 },
  { city: 'Agra', rank: 3 },
] as const;

export function IndiaAirActionChart() {
  const rowHeight = 42;
  const chartHeight = 30 + airLeaders.length * rowHeight;

  return (
    <ChartFrame
      title="Swachh Vayu Survekshan, 2024"
      subtitle="Top three cities above one million people"
      source="CPCB, Swachh Vayu Survekshan 2024 results"
      sourceUrl={AIR_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 620 ${chartHeight}`} className="w-full min-w-[520px]" role="img" aria-label="Ranked bar chart of the top three cities in Swachh Vayu Survekshan 2024">
          <title>Top three cities in Swachh Vayu Survekshan 2024</title>
          {airLeaders.map((item, index) => {
            const y = 10 + index * rowHeight;
            return (
              <g key={item.city}>
                <text x="0" y={y + 15} fontSize="11" fontWeight="600" fill="#18181b">{item.rank}</text>
                <text x="28" y={y + 15} fontSize="11" fill="#18181b">{item.city}</text>
                <rect x="110" y={y + 3} width={(4 - item.rank) * 120} height="14" fill="#15803d" opacity={1 - index * 0.18} />
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        This measures assessed city action and PM10 improvement under the National Clean Air Programme. It is not an annual PM2.5 exposure ranking.
      </p>
    </ChartFrame>
  );
}

const dataYears = [
  ['City score', '2020', 'Ease of Living Index'],
  ['Household spending', '2023-24', 'Urban MPCE'],
  ['Air action', '2024', 'Swachh Vayu Survekshan'],
  ['Prices', 'July 2026', 'Urban CPI and housing'],
] as const;

export function IndiaDataClock() {
  const rowHeight = 32;
  const chartHeight = 18 + dataYears.length * rowHeight;

  return (
    <ChartFrame
      title="Publication dates"
      subtitle="The datasets use different reference periods"
      source="MoHUA, MoSPI and CPCB publications"
      sourceUrl={EOL_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 620 ${chartHeight}`} className="w-full min-w-[520px]" role="img" aria-label="Timeline of the four government datasets used in this essay">
          <title>Publication dates for the four government datasets</title>
          <line x1="88" x2="88" y1="10" y2={chartHeight - 12} stroke="#cbd5e1" />
          {dataYears.map(([label, year, detail], index) => {
            const y = 15 + index * rowHeight;
            return (
              <g key={label}>
                <circle cx="88" cy={y + 8} r="4" fill="#4f46e5" />
                <text x="108" y={y + 12} fontSize="11" fontWeight="600" fill="#18181b">{year}</text>
                <text x="185" y={y + 12} fontSize="11" fill="#18181b">{label}</text>
                <text x="360" y={y + 12} fontSize="11" fill="#71717a">{detail}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartFrame>
  );
}
