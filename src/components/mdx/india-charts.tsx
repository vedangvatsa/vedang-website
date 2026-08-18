'use client';

import React from 'react';

const EOL_REPORT = 'https://smartnet.niua.org/sites/default/files/resources/final_web_ease_of_living_report_2020_.pdf';
const HCES_REPORT = 'https://www.mospi.gov.in/sites/default/files/publication_reports/HCES%20FactSheet%202023-24.pdf';
const CPI_REPORT = 'https://www.mospi.gov.in/uploads/latestReleases/latest_release_1786529680747_3113661d-1a2b-4b9a-af06-b340193ef9a0_Press_Release_CPI_July_2026.pdf';
const AIR_REPORT = 'https://prana.cpcb.gov.in/ncapServices/robust/fetchFilesFromDrive/Swachh_Vayu_Survekshan_2024_Result.pdf';

type SourceLineProps = {
  children: React.ReactNode;
  href?: string;
};

function SourceLine({ children, href }: SourceLineProps) {
  return (
    <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground/60">
      Source: {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">{children}</a>
      ) : children}
    </p>
  );
}

function ChartFrame({ children, title, subtitle, source, sourceUrl, className = '' }: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  source: React.ReactNode;
  sourceUrl?: string;
  className?: string;
}) {
  return (
    <figure className={`not-prose my-10 w-full rounded-[3px] border border-[#e3e3e0] bg-white overflow-hidden ${className}`}>
      <div className="p-5 md:p-8">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#37352f]">{title}</h3>
        <p className="mt-1 mb-5 text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">{subtitle}</p>
        {children}
        <SourceLine href={sourceUrl}>{source}</SourceLine>
      </div>
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
  const chartHeight = 36 + overallRankings.length * rowHeight;

  return (
    <ChartFrame
      title="The official 2020 ranking"
      subtitle="Ease of Living Index score, 0 to 100, Million+ cities"
      source="MoHUA, Ease of Living Index 2020, Table 2"
      sourceUrl={EOL_REPORT}
    >
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 820 ${chartHeight}`}
          className="w-full min-w-[620px]"
          role="img"
          aria-label="Horizontal ranking of the top 20 Million-plus Indian cities in the Ease of Living Index 2020"
        >
          <title>Ease of Living Index 2020 ranking of 20 Million-plus Indian cities</title>
          {overallRankings.map(([city, score], index) => {
            const y = 24 + index * rowHeight;
            const barWidth = (score / max) * 510;
            const highlighted = index < 6;
            return (
              <g key={city}>
                <text x="0" y={y + 14} fontSize="11" fontWeight={highlighted ? 700 : 500} fill={highlighted ? '#18181b' : '#52525b'}>{index + 1}</text>
                <text x="28" y={y + 14} fontSize="11" fontWeight={highlighted ? 700 : 500} fill="#37352f">{city}</text>
                <rect x="174" y={y + 3} width="510" height="16" rx="2" fill="#f4f4f5" />
                <rect x="174" y={y + 3} width={barWidth} height="16" rx="2" fill={highlighted ? '#4f46e5' : '#94a3b8'} opacity={highlighted ? 0.78 : 0.62} />
                <text x="700" y={y + 15} fontSize="11" fontWeight={highlighted ? 700 : 600} textAnchor="end" fill="#18181b">{score.toFixed(2)}</text>
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

export function IndiaCityPillars() {
  const chartWidth = 820;
  const chartHeight = 350;
  const plot = { left: 54, top: 18, width: 730, height: 245 };
  const groupWidth = plot.width / pillarData.length;
  const barWidth = 13;
  const colors = [
    { key: 'quality', label: 'Quality of life', color: '#4f46e5' },
    { key: 'economy', label: 'Economic ability', color: '#d97706' },
    { key: 'sustainability', label: 'Sustainability', color: '#15803d' },
  ] as const;

  return (
    <ChartFrame
      title="One score hides three different cities"
      subtitle="Pillar scores for selected cities, 0 to 100"
      source="MoHUA, Ease of Living Index 2020, city tables"
      sourceUrl={EOL_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[700px]" role="img" aria-label="Grouped bars showing quality of life, economic ability and sustainability scores for ten Indian cities">
          <title>Three pillar comparison for ten Indian cities</title>
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = plot.top + plot.height - (tick / 100) * plot.height;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke="#e3e3e0" strokeWidth="1" />
                <text x={plot.left - 10} y={y + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}</text>
              </g>
            );
          })}
          {pillarData.map((item, index) => {
            const center = plot.left + groupWidth * index + groupWidth / 2;
            return (
              <g key={item.city}>
                {colors.map((series, seriesIndex) => {
                  const value = item[series.key];
                  const height = (value / 100) * plot.height;
                  return (
                    <rect
                      key={series.key}
                      x={center - 22 + seriesIndex * 17}
                      y={plot.top + plot.height - height}
                      width={barWidth}
                      height={height}
                      rx="2"
                      fill={series.color}
                      opacity="0.72"
                    >
                      <title>{`${item.city}: ${series.label} ${value}`}</title>
                    </rect>
                  );
                })}
                <text x={center} y={plot.top + plot.height + 17} fontSize="10" textAnchor="middle" fill="#52525b" transform={`rotate(-35 ${center} ${plot.top + plot.height + 17})`}>{item.city}</text>
              </g>
            );
          })}
          <g transform="translate(54 322)">
            {colors.map((series, index) => (
              <g key={series.key} transform={`translate(${index * 180} 0)`}>
                <rect width="10" height="10" rx="2" fill={series.color} opacity="0.72" />
                <text x="16" y="9" fontSize="10" fill="#52525b">{series.label}</text>
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
  const chartHeight = 34 + spendingProxy.length * rowHeight;

  return (
    <ChartFrame
      title="What households spend where"
      subtitle="Urban monthly per-capita consumption expenditure, ₹, 2023-24"
      source="MoSPI, Household Consumption Expenditure Survey 2023-24, state/UT averages"
      sourceUrl={HCES_REPORT}
    >
      <div className="mb-4 border-l-2 border-[#d97706] bg-[#fffbeb] px-3 py-2 text-xs leading-relaxed text-[#52525b]">
        This is a state or UT average attached to a representative city. It is a spending proxy, not a city rent table.
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 820 ${chartHeight}`} className="w-full min-w-[640px]" role="img" aria-label="Urban monthly per-capita consumption expenditure for twelve states and union territories represented by cities">
          <title>Urban monthly per-capita consumption expenditure in 2023-24</title>
          {spendingProxy.map(([city, state, value], index) => {
            const y = 22 + index * rowHeight;
            const width = (value / max) * 520;
            return (
              <g key={city}>
                <text x="0" y={y + 14} fontSize="11" fontWeight="600" fill="#37352f">{city}</text>
                <text x="105" y={y + 14} fontSize="10" fill="#71717a">{state}</text>
                <rect x="215" y={y + 3} width="520" height="16" rx="2" fill="#f4f4f5" />
                <rect x="215" y={y + 3} width={width} height="16" rx="2" fill="#d97706" opacity="0.68" />
                <text x="760" y={y + 15} fontSize="11" fontWeight="700" textAnchor="end" fill="#18181b">₹{value.toLocaleString('en-IN')}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartFrame>
  );
}

const quadrantData = [
  { city: 'Bengaluru', quality: 55.67, spending: 8076, dx: 7, dy: -8 },
  { city: 'Pune', quality: 58.10, spending: 7363, dx: 7, dy: -8 },
  { city: 'Ahmedabad', quality: 57.46, spending: 7175, dx: 7, dy: 14 },
  { city: 'Chennai', quality: 60.84, spending: 8165, dx: 7, dy: -8 },
  { city: 'Surat', quality: 57.96, spending: 7175, dx: 7, dy: -8 },
  { city: 'Coimbatore', quality: 60.33, spending: 8165, dx: 7, dy: 14 },
  { city: 'Indore', quality: 59.86, spending: 5538, dx: 7, dy: -8 },
  { city: 'Delhi', quality: 51.22, spending: 8534, dx: 7, dy: 14 },
  { city: 'Hyderabad', quality: 51.28, spending: 8978, dx: -58, dy: -8 },
  { city: 'Visakhapatnam', quality: 51.93, spending: 7182, dx: 7, dy: 14 },
  { city: 'Jaipur', quality: 47.66, spending: 6574, dx: 7, dy: 14 },
  { city: 'Lucknow', quality: 51.30, spending: 5395, dx: 7, dy: -8 },
] as const;

export function IndiaQualityCostQuadrant() {
  const plot = { left: 72, top: 28, width: 650, height: 300 };
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
      title="Cost of Living vs Quality of Life"
      subtitle="A shareable quadrant using the closest comparable government data"
      source={(
        <>
          Quality scores: <a href={EOL_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">MoHUA Ease of Living 2020</a>. Spending proxy: <a href={HCES_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">MoSPI HCES 2023-24</a>.
        </>
      )}
    >
      <div className="mb-4 border-l-2 border-[#4f46e5] bg-[#eef2ff] px-3 py-2 text-xs leading-relaxed text-[#52525b]">
        The horizontal axis uses urban MPCE for each city&apos;s state or UT. It is a spending proxy, not a city rent measure.
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 820 420" className="w-full min-w-[700px]" role="img" aria-label="Quadrant chart comparing official quality of life scores with state or union territory urban household spending proxies for twelve Indian cities">
          <title>Cost of Living versus Quality of Life quadrant using official data proxies</title>
          <rect x={plot.left} y={plot.top} width={medianX - plot.left} height={medianY - plot.top} fill="#eef2ff" />
          <rect x={medianX} y={plot.top} width={plot.left + plot.width - medianX} height={medianY - plot.top} fill="#fff7ed" />
          <rect x={plot.left} y={medianY} width={medianX - plot.left} height={plot.top + plot.height - medianY} fill="#f0fdf4" />
          <rect x={medianX} y={medianY} width={plot.left + plot.width - medianX} height={plot.top + plot.height - medianY} fill="#fafafa" />
          {[5000, 6000, 7000, 8000, 9000].map((tick) => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={plot.top} y2={plot.top + plot.height} stroke="#e3e3e0" />
              <text x={x(tick)} y={plot.top + plot.height + 22} fontSize="10" textAnchor="middle" fill="#71717a">₹{(tick / 1000).toFixed(0)}k</text>
            </g>
          ))}
          {[46, 50, 54, 58, 62].map((tick) => (
            <g key={tick}>
              <line x1={plot.left} x2={plot.left + plot.width} y1={y(tick)} y2={y(tick)} stroke="#e3e3e0" />
              <text x={plot.left - 10} y={y(tick) + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}</text>
            </g>
          ))}
          <line x1={medianX} x2={medianX} y1={plot.top} y2={plot.top + plot.height} stroke="#94a3b8" strokeDasharray="5 4" />
          <line x1={plot.left} x2={plot.left + plot.width} y1={medianY} y2={medianY} stroke="#94a3b8" strokeDasharray="5 4" />
          <text x={plot.left + 12} y={plot.top + 20} fontSize="11" fontWeight="700" fill="#4f46e5">Higher quality, lower spending proxy</text>
          <text x={medianX + 12} y={plot.top + 20} fontSize="11" fontWeight="700" fill="#b45309">Higher quality, higher spending proxy</text>
          <text x={plot.left + 12} y={plot.top + plot.height - 12} fontSize="11" fontWeight="700" fill="#15803d">Lower quality, lower spending proxy</text>
          <text x={medianX + 12} y={plot.top + plot.height - 12} fontSize="11" fontWeight="700" fill="#71717a">Lower quality, higher spending proxy</text>
          {quadrantData.map((item) => (
            <g key={item.city}>
              <circle cx={x(item.spending)} cy={y(item.quality)} r="6" fill="#18181b" stroke="#ffffff" strokeWidth="2">
                <title>{`${item.city}: Quality of Life ${item.quality}, state/UT urban MPCE ₹${item.spending.toLocaleString('en-IN')}`}</title>
              </circle>
              <text x={x(item.spending) + item.dx} y={y(item.quality) + item.dy} fontSize="10" fontWeight="700" fill="#37352f">{item.city}</text>
            </g>
          ))}
          <text x={plot.left + plot.width / 2} y="390" fontSize="11" textAnchor="middle" fontWeight="700" fill="#52525b">Urban MPCE proxy for the city&apos;s state or UT, 2023-24</text>
          <text x="16" y={plot.top + plot.height / 2} fontSize="11" textAnchor="middle" fontWeight="700" fill="#52525b" transform={`rotate(-90 16 ${plot.top + plot.height / 2})`}>Quality of Life score, 2020</text>
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
  const plot = { left: 48, top: 20, width: 700, height: 220 };
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
      title="The latest price pressure"
      subtitle="Year-on-year inflation in urban India, January to July 2026"
      source="MoSPI, CPI July 2026 release, base year 2024"
      sourceUrl={CPI_REPORT}
    >
      <div className="overflow-x-auto">
        <svg viewBox="0 0 820 320" className="w-full min-w-[650px]" role="img" aria-label="Line chart showing urban general inflation rising from 2.75 percent in January to 3.96 percent in July 2026, while housing inflation stays near 2 percent">
          <title>Urban CPI and housing inflation, January to July 2026</title>
          {[0, 1, 2, 3, 4, 5].map((tick) => {
            const y = plot.top + plot.height - (tick / yMax) * plot.height;
            return (
              <g key={tick}>
                <line x1={plot.left} x2={plot.left + plot.width} y1={y} y2={y} stroke="#e3e3e0" />
                <text x={plot.left - 10} y={y + 4} fontSize="10" textAnchor="end" fill="#71717a">{tick}%</text>
              </g>
            );
          })}
          <path d={linePath('general')} fill="none" stroke="#4f46e5" strokeWidth="3" />
          <path d={linePath('housing')} fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="5 4" />
          {pricePulse.map((item, index) => {
            const general = point(index, item.general);
            const housing = point(index, item.housing);
            return (
              <g key={item.month}>
                <circle cx={general.x} cy={general.y} r="4" fill="#4f46e5" />
                <circle cx={housing.x} cy={housing.y} r="4" fill="#d97706" />
                <text x={general.x} y={plot.top + plot.height + 22} fontSize="10" textAnchor="middle" fill="#52525b">{item.month}</text>
                {index === pricePulse.length - 1 && (
                  <g>
                    <text x={general.x - 8} y={general.y - 12} fontSize="10" fontWeight="700" textAnchor="end" fill="#4f46e5">{item.general.toFixed(2)}%</text>
                    <text x={housing.x - 8} y={housing.y + 20} fontSize="10" fontWeight="700" textAnchor="end" fill="#b45309">{item.housing.toFixed(2)}%</text>
                  </g>
                )}
              </g>
            );
          })}
          <g transform="translate(48 290)">
            <line x1="0" x2="22" y1="5" y2="5" stroke="#4f46e5" strokeWidth="3" />
            <text x="30" y="9" fontSize="10" fill="#52525b">Urban CPI, all items</text>
            <line x1="178" x2="200" y1="5" y2="5" stroke="#d97706" strokeWidth="3" strokeDasharray="5 4" />
            <text x="208" y="9" fontSize="10" fill="#52525b">Urban housing</text>
          </g>
        </svg>
      </div>
    </ChartFrame>
  );
}

const airLeaders = [
  { city: 'Surat', rank: '1st', note: 'Million+ category' },
  { city: 'Jabalpur', rank: '2nd', note: 'Million+ category' },
  { city: 'Agra', rank: '3rd', note: 'Million+ category' },
];

export function IndiaAirActionChart() {
  return (
    <ChartFrame
      title="Clean-air action has its own winners"
      subtitle="Swachh Vayu Survekshan 2024, cities above one million people"
      source="CPCB, Swachh Vayu Survekshan 2024 results"
      sourceUrl={AIR_REPORT}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {airLeaders.map((item, index) => (
          <div key={item.city} className={`border-l-2 p-4 ${index === 0 ? 'border-[#15803d] bg-[#f0fdf4]' : 'border-[#d4d4d8] bg-[#fafafa]'}`}>
            <div className="text-3xl font-bold tracking-tight text-[#18181b]">{item.rank}</div>
            <div className="mt-1 font-semibold text-[#37352f]">{item.city}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{item.note}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[#52525b]">
        This award measures city action and PM10 improvement under the National Clean Air Programme. It does not equal a simple annual PM2.5 ranking.
      </p>
    </ChartFrame>
  );
}

export function IndiaDataClock() {
  const points = [
    { label: 'City score', date: '2020', detail: 'Ease of Living Index', color: '#4f46e5' },
    { label: 'Household spending', date: '2023-24', detail: 'Urban MPCE', color: '#d97706' },
    { label: 'Air action', date: '2024', detail: 'Swachh Vayu Survekshan', color: '#15803d' },
    { label: 'Price pressure', date: 'Jul 2026', detail: 'Urban CPI and housing', color: '#be123c' },
  ];

  return (
    <ChartFrame
      title="The ranking has four clocks"
      subtitle="The evidence is current where the government publishes current city or state data"
      source={(
        <>
          <a href={EOL_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">MoHUA EoL 2020</a>,{' '}
          <a href={HCES_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">MoSPI HCES 2023-24</a>,{' '}
          <a href={AIR_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">CPCB Swachh Vayu 2024</a>,{' '}
          <a href={CPI_REPORT} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#37352f]">MoSPI CPI July 2026</a>
        </>
      )}
    >
      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4">
        {points.map((point) => (
          <div key={point.label} className="relative border border-[#e3e3e0] bg-[#fafafa] p-4">
            <div className="mb-5 h-2 w-2 rounded-full" style={{ backgroundColor: point.color }} />
            <div className="text-2xl font-bold tracking-tight text-[#18181b]">{point.date}</div>
            <div className="mt-2 text-xs font-semibold text-[#37352f]">{point.label}</div>
            <div className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{point.detail}</div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}
