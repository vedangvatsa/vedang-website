import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'linkedin-assets');
const FONTS_DIR = path.join(__dirname, '..', 'public', 'fonts');

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const interRegular = fs.readFileSync(path.join(FONTS_DIR, 'Inter-Regular.ttf'));
const interBold = fs.readFileSync(path.join(FONTS_DIR, 'Inter-Bold.ttf'));

const fonts = [
  { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
  { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
  { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
  { name: 'Inter', data: interBold, weight: 900, style: 'normal' },
];

async function render(jsx, filename) {
  const svg = await satori(jsx, { width: 1080, height: 1080, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 2160 } });
  const png = resvg.render().asPng();
  fs.writeFileSync(path.join(OUT, filename), png);
  console.log(`✅ ${filename}`);
}

// ─── Shared design tokens (matching Gemini style) ────────────────────────────
const PAD = 56;

// Full-height page wrapper. Content fills the entire 1080x1080.
// justify-content: space-between pushes title to top, source to bottom.
const page = (children) => ({
  type: 'div',
  props: {
    style: {
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      width: 1080, height: 1080, padding: `${PAD}px ${PAD}px 40px ${PAD}px`,
      backgroundColor: '#fff', fontFamily: 'Inter',
    },
    children,
  },
});

// Big centered title like Gemini
const bigTitle = (text, size = 56) => ({
  type: 'div', props: {
    style: { fontSize: size, fontWeight: 900, color: '#111', lineHeight: 1.15, textAlign: 'center' },
    children: text,
  },
});

// Centered footer block (source + handle)
const footer = (srcText) => ({
  type: 'div', props: {
    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto' },
    children: [
      { type: 'div', props: { style: { fontSize: 18, color: '#999', fontStyle: 'italic', marginBottom: 12 }, children: srcText } },
      { type: 'div', props: { style: { fontSize: 20, color: '#bbb' }, children: '@vedangvatsa' } },
    ],
  },
});


// ═══════════════════════════════════════════════════════════════════════════════
// HORIZONTAL BAR CHART (Gemini style: labels right-aligned, bars extend right)
// ═══════════════════════════════════════════════════════════════════════════════
function HBarChart({ headline, sub, bars, src, headlineSize }) {
  const maxVal = Math.max(...bars.map(b => b.value));
  const barH = bars.length <= 3 ? 64 : bars.length <= 5 ? 44 : 36;
  const valSize = bars.length <= 4 ? 30 : 24;
  const labelSize = bars.length <= 4 ? 28 : 22;
  // Use space-between for few items so bars fill the canvas
  const useSpaceBetween = bars.length <= 4;
  const gap = bars.length <= 3 ? 48 : bars.length <= 5 ? 28 : 16;

  return page([
    // Title block
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [
      bigTitle(headline, headlineSize || 56),
      sub ? { type: 'div', props: { style: { fontSize: 22, color: '#888', marginTop: 10, textAlign: 'center' }, children: sub } } : null,
    ].filter(Boolean) } },
    // Chart area
    {
      type: 'div', props: {
        style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', width: '100%' },
        children: [
          {
            type: 'div', props: {
              style: { display: 'flex', flexDirection: 'column', gap, justifyContent: 'space-around', flex: 1, width: '100%' },
              children: bars.map(b => ({
                type: 'div', props: {
                  style: { display: 'flex', alignItems: 'center', width: '100%' },
                  children: [
                    // Label
                    { type: 'div', props: { style: { width: 220, fontSize: labelSize, fontWeight: 400, color: '#444', flexShrink: 0 }, children: b.label } },
                    // Bar + value
                    { type: 'div', props: { style: { flex: 1, display: 'flex', alignItems: 'center' }, children: [
                      { type: 'div', props: { style: { width: `${Math.max(3, (b.value / maxVal) * 100)}%`, height: barH, backgroundColor: '#111', borderRadius: 6 }, children: '' } },
                      { type: 'div', props: { style: { fontSize: valSize, fontWeight: 700, color: '#111', paddingLeft: 14, whiteSpace: 'nowrap' }, children: b.display } },
                    ] } },
                  ],
                },
              })),
            },
          },
        ],
      },
    },
    footer(src),
  ]);
}


// ═══════════════════════════════════════════════════════════════════════════════
// VERTICAL BAR CHART (Gemini style: thick bars, labels above, year below)
// ═══════════════════════════════════════════════════════════════════════════════
function VBarChart({ headline, sub, bars, src, headlineSize, baselineValue }) {
  const maxVal = Math.max(...bars.map(b => b.value));
  const minVal = baselineValue != null ? baselineValue : 0;
  const range = maxVal - minVal;
  const barMaxH = 520;
  const barW = Math.min(100, Math.floor(800 / bars.length));

  return page([
    // Title block
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [
      bigTitle(headline, headlineSize || 56),
      sub ? { type: 'div', props: { style: { fontSize: 22, color: '#888', marginTop: 10, textAlign: 'center' }, children: sub } } : null,
    ].filter(Boolean) } },
    // Chart area - flex:1 fills space, align bars to bottom
    {
      type: 'div', props: {
        style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flex: 1, paddingBottom: 0 },
        children: [
          // Bars row
          {
            type: 'div', props: {
              style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', height: barMaxH, borderBottom: '2px solid #ddd' },
              children: bars.map(b => {
                // If baselineValue set, show proportional height from baseline (min 15% of barMaxH)
                const h = baselineValue != null
                  ? Math.max(barMaxH * 0.15, ((b.value - minVal) / range) * barMaxH)
                  : Math.max(16, (b.value / maxVal) * barMaxH);
                return {
                  type: 'div', props: {
                    style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
                    children: [
                      { type: 'div', props: { style: { fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 8, whiteSpace: 'nowrap' }, children: b.display } },
                      { type: 'div', props: { style: { width: barW, height: h, backgroundColor: '#111', borderRadius: '4px 4px 0 0' }, children: '' } },
                    ],
                  },
                };
              }),
            },
          },
          // X-axis labels
          {
            type: 'div', props: {
              style: { display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: 16, marginBottom: 24 },
              children: bars.map(b => ({
                type: 'div', props: { style: { fontSize: 24, fontWeight: 700, color: '#444', textAlign: 'center', flex: 1 }, children: b.label },
              })),
            },
          },
        ],
      },
    },
    footer(src),
  ]);
}


// ═══════════════════════════════════════════════════════════════════════════════
// GROUPED VERTICAL BAR (China vs US style)
// ═══════════════════════════════════════════════════════════════════════════════
function GroupedBarChart({ headline, groups, legendA, legendB, src, headlineSize }) {
  const allVals = groups.flatMap(g => [g.a, g.b]);
  const maxVal = Math.max(...allVals);
  const barMaxH = 480;
  const barW = 70;

  return page([
    // Title
    bigTitle(headline, headlineSize || 56),
    // Legend + chart area
    {
      type: 'div', props: {
        style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flex: 1 },
        children: [
          // Legend
          {
            type: 'div', props: {
              style: { display: 'flex', gap: 32, marginBottom: 28, marginLeft: 80 },
              children: [
                { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [
                  { type: 'div', props: { style: { width: 20, height: 20, backgroundColor: '#111', borderRadius: 3 }, children: '' } },
                  { type: 'div', props: { style: { fontSize: 22, color: '#444' }, children: legendA } },
                ] } },
                { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [
                  { type: 'div', props: { style: { width: 20, height: 20, backgroundColor: '#bbb', borderRadius: 3 }, children: '' } },
                  { type: 'div', props: { style: { fontSize: 22, color: '#444' }, children: legendB } },
                ] } },
              ],
            },
          },
          // Bars
          {
            type: 'div', props: {
              style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', height: barMaxH, borderBottom: '2px solid #ddd' },
              children: groups.flatMap(g => {
                const hA = Math.max(16, (g.a / maxVal) * barMaxH);
                const hB = Math.max(16, (g.b / maxVal) * barMaxH);
                return [
                  // China bar
                  { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, children: [
                    { type: 'div', props: { style: { fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6, whiteSpace: 'nowrap' }, children: g.displayA } },
                    { type: 'div', props: { style: { width: barW, height: hA, backgroundColor: '#111', borderRadius: '4px 4px 0 0' }, children: '' } },
                  ] } },
                  // US bar
                  { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 20 }, children: [
                    { type: 'div', props: { style: { fontSize: 18, fontWeight: 700, color: '#999', marginBottom: 6, whiteSpace: 'nowrap' }, children: g.displayB } },
                    { type: 'div', props: { style: { width: barW, height: hB, backgroundColor: '#bbb', borderRadius: '4px 4px 0 0' }, children: '' } },
                  ] } },
                ];
              }),
            },
          },
          // Year labels
          {
            type: 'div', props: {
              style: { display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: 16, marginBottom: 24 },
              children: groups.map(g => ({
                type: 'div', props: { style: { fontSize: 26, fontWeight: 700, color: '#444', textAlign: 'center', flex: 1 }, children: g.label },
              })),
            },
          },
        ],
      },
    },
    footer(src),
  ]);
}


// ═══════════════════════════════════════════════════════════════════════════════
// TWO COLUMN (Gemini style: items spread to fill the entire vertical space)
// ═══════════════════════════════════════════════════════════════════════════════
function TwoCol({ headline, leftLabel, leftItems, rightLabel, rightItems, src, headlineSize }) {
  const itemSize = leftItems.length <= 3 ? 32 : leftItems.length <= 4 ? 28 : 24;

  return page([
    // Title
    bigTitle(headline, headlineSize || 52),
    // Two columns - flex:1 to fill space, justify space-between to spread items
    {
      type: 'div', props: {
        style: { display: 'flex', flex: 1, width: '100%', marginTop: 16, paddingBottom: 20 },
        children: [
          // Left column
          { type: 'div', props: {
            style: { flex: 1, paddingRight: 36, borderRight: '2px solid #ddd', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
            children: [
              { type: 'div', props: { style: { fontSize: 16, fontWeight: 700, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase' }, children: leftLabel } },
              ...leftItems.map(i => ({ type: 'div', props: { style: { fontSize: itemSize, fontWeight: 400, color: '#999', lineHeight: 1.35 }, children: i } })),
              { type: 'div', props: { style: { height: 1 }, children: '' } },
            ],
          } },
          // Right column
          { type: 'div', props: {
            style: { flex: 1, paddingLeft: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
            children: [
              { type: 'div', props: { style: { fontSize: 16, fontWeight: 700, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase' }, children: rightLabel } },
              ...rightItems.map(i => ({ type: 'div', props: { style: { fontSize: itemSize, fontWeight: 800, color: '#111', lineHeight: 1.35 }, children: i } })),
              { type: 'div', props: { style: { height: 1 }, children: '' } },
            ],
          } },
        ],
      },
    },
    footer(src),
  ]);
}


// ═══════════════════════════════════════════════════════════════════════════════
// TABLE LAYOUT (for protocols-style grid)
// ═══════════════════════════════════════════════════════════════════════════════
function TableLayout({ headline, rows, src, headlineSize }) {
  const rowH = Math.floor(600 / rows.length);
  const fontSize = rows.length <= 4 ? 36 : rows.length <= 6 ? 30 : 26;

  return page([
    bigTitle(headline, headlineSize || 56),
    // Table
    {
      type: 'div', props: {
        style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' },
        children: rows.map((r, i) => ({
          type: 'div', props: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: rowH,
              borderBottom: i < rows.length - 1 ? '1px solid #ddd' : 'none', padding: '0 40px' },
            children: [
              { type: 'div', props: { style: { fontSize, fontWeight: 800, color: '#111' }, children: r.bold } },
              { type: 'div', props: { style: { fontSize, fontWeight: 400, color: '#888', marginLeft: 12 }, children: ` - ${r.light}` } },
            ],
          },
        })),
      },
    },
    footer(src),
  ]);
}


// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE ALL IMAGES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Post 4: China vs US ──────────────────────────────────────────────────────
await render(
  GroupedBarChart({
    headline: 'China overtook the US in AI research output',
    headlineSize: 52,
    legendA: 'China', legendB: 'US',
    groups: [
      { label: '2013', a: 12074, b: 13829, displayA: '12,074', displayB: '13,829' },
      { label: '2021', a: 71273, b: 64931, displayA: '71,273', displayB: '64,931' },
      { label: '2025', a: 187887, b: 122449, displayA: '187,887', displayB: '122,449' },
    ],
    src: 'Source: OpenAlex corpus, 5M papers',
  }),
  'post4_china_us.png'
);

// ── Post 7: Consumer concerns ────────────────────────────────────────────────
await render(
  HBarChart({
    headline: "Why people don't trust AI to buy for them",
    headlineSize: 52,
    bars: [
      { label: 'Payment security', value: 32, display: '32%' },
      { label: 'Privacy', value: 26, display: '26%' },
      { label: 'Agent errors', value: 18, display: '18%' },
      { label: 'Loss of control', value: 17, display: '17%' },
    ],
    src: 'Source: Kearney US Consumer Study',
  }),
  'post7_consumer_concerns.png'
);

// ── Post 14: Check Size Paradox ──────────────────────────────────────────────
await render(
  HBarChart({
    headline: 'Median check sizes hit all-time highs at every stage',
    headlineSize: 48,
    sub: '2015 to 2026 growth multiples',
    bars: [
      { label: 'Pre-Seed', value: 4.2, display: '4.2x' },
      { label: 'Seed', value: 6.3, display: '6.3x' },
      { label: 'Series A', value: 3.8, display: '3.8x' },
      { label: 'Series B', value: 2.5, display: '2.5x' },
    ],
    src: 'Source: Proprietary venture corpus, 795,924 rounds',
  }),
  'post14_check_size.png'
);

// ── Post 15: Seed growth ─────────────────────────────────────────────────────
await render(
  VBarChart({
    headline: 'Seed rounds used to be $440K',
    sub: '6.3x growth in 11 years',
    bars: [
      { label: '2015', value: 440, display: '$440K' },
      { label: '2018', value: 800, display: '$800K' },
      { label: '2021', value: 1500, display: '$1.5M' },
      { label: '2024', value: 2100, display: '$2.1M' },
      { label: '2026', value: 2800, display: '$2.8M' },
    ],
    src: 'Source: Proprietary venture corpus, 795,924 rounds',
  }),
  'post15_seed_growth.png'
);

// ── Post 16: Death Valley ────────────────────────────────────────────────────
await render(
  VBarChart({
    headline: 'Seed-to-Series A conversion is dropping',
    headlineSize: 52,
    sub: 'Fewer startups make it through',
    bars: [
      { label: '2015', value: 17.76, display: '17.8%' },
      { label: '2018', value: 15.41, display: '15.4%' },
      { label: '2021', value: 12.75, display: '12.8%' },
      { label: '2022', value: 9.04, display: '9.0%' },
      { label: '2023', value: 7.83, display: '7.8%' },
    ],
    src: 'Source: Proprietary venture corpus, 795,924 rounds',
  }),
  'post16_death_valley.png'
);

// ── Post 17: Gini coefficient ────────────────────────────────────────────────
await render(
  VBarChart({
    headline: 'Venture capital concentration at all-time high',
    headlineSize: 48,
    sub: 'Gini coefficient (1.0 = one company gets everything)',
    baselineValue: 850,
    bars: [
      { label: '2015-20', value: 890, display: '0.890' },
      { label: '2021', value: 886, display: '0.886' },
      { label: '2023', value: 931, display: '0.931' },
      { label: '2025', value: 913, display: '0.913' },
      { label: '2026', value: 916, display: '0.916' },
    ],
    src: 'Source: Proprietary venture corpus, 795,924 rounds',
  }),
  'post17_gini.png'
);

// ── Post 18: Agent infra funding ─────────────────────────────────────────────
await render(
  HBarChart({
    headline: 'Over $5 billion into agent infrastructure',
    headlineSize: 48,
    sub: 'Funding by stack layer',
    bars: [
      { label: 'Compute', value: 4000, display: '~$4B+' },
      { label: 'Orchestration', value: 709, display: '$709M' },
      { label: 'Memory', value: 348, display: '$348M' },
      { label: 'Perception', value: 339, display: '$339M' },
      { label: 'Evaluation', value: 255, display: '$255M' },
      { label: 'Security', value: 244, display: '$244M' },
      { label: 'Sandbox', value: 32, display: '$32M' },
    ],
    src: 'Source: Company disclosures, SEC filings',
  }),
  'post18_agent_funding.png'
);

// ── Post 19: Security acquisitions ───────────────────────────────────────────
await render(
  TwoCol({
    headline: 'Agent security got acquired',
    headlineSize: 52,
    leftLabel: 'ACQUIRED (18 MONTHS)',
    leftItems: [
      'Lakera (Check Point, ~$300M)',
      'Robust Intelligence (Cisco)',
      'Galileo AI (Cisco)',
      'Portkey (Palo Alto Networks)',
    ],
    rightLabel: 'STILL INDEPENDENT',
    rightItems: [
      'Patronus AI ($40M raised)',
      'Corridor ($30M raised)',
      'Arcjet ($12M raised)',
      'Descope ($88M raised)',
    ],
    src: 'Source: Company disclosures',
  }),
  'post19_security_acquired.png'
);

// ── Post 20: Coding agents ──────────────────────────────────────────────────
await render(
  HBarChart({
    headline: 'Coding agents are the hottest vertical',
    headlineSize: 52,
    sub: 'Combined valuation of roughly $28 billion',
    bars: [
      { label: 'Cognition', value: 26, display: '$26B' },
      { label: 'Factory AI', value: 1.5, display: '$1.5B' },
      { label: 'CodeRabbit', value: 0.55, display: '$550M' },
    ],
    src: 'Source: Company disclosures, Crunchbase',
  }),
  'post20_coding_agents.png'
);

// ── Post 21: Blockchain 118x ─────────────────────────────────────────────────
await render(
  VBarChart({
    headline: 'Blockchain research grew 118x in twelve years',
    headlineSize: 48,
    sub: '128,286 papers in the OpenAlex corpus',
    bars: [
      { label: '2013', value: 176, display: '176' },
      { label: '2016', value: 955, display: '955' },
      { label: '2019', value: 10591, display: '10,591' },
      { label: '2022', value: 18680, display: '18,680' },
      { label: '2025', value: 20668, display: '20,668' },
    ],
    src: 'Source: OpenAlex corpus, 128,286 papers',
  }),
  'post21_blockchain_growth.png'
);

// ── Post 22: DeFi vs NFT ────────────────────────────────────────────────────
await render(
  TwoCol({
    headline: 'DeFi keeps growing. NFTs peaked in 2023.',
    headlineSize: 48,
    leftLabel: 'DEFI PAPERS',
    leftItems: ['7 papers in 2019', '63 in 2021', '516 in 2025', '74x growth, still rising'],
    rightLabel: 'NFT PAPERS',
    rightItems: ['60 in 2021', 'Peaked at 426 in 2023', 'Dropped to 334 in 2024', 'Recovery to 366 in 2025'],
    src: 'Source: OpenAlex corpus, 128,286 papers',
  }),
  'post22_defi_nft.png'
);

// ── Post 23: Post-quantum keywords ───────────────────────────────────────────
await render(
  HBarChart({
    headline: 'Fastest-rising blockchain research keywords',
    headlineSize: 44,
    sub: 'Growth multiples, 2022-2023 vs 2025-2026',
    bars: [
      { label: 'Quantum resistant', value: 6.6, display: '6.6x' },
      { label: 'Real world asset', value: 5.6, display: '5.6x' },
      { label: 'Layer 2', value: 4.2, display: '4.2x' },
      { label: 'Post-quantum', value: 3.9, display: '3.9x' },
      { label: 'Regulatory', value: 3.5, display: '3.5x' },
      { label: 'ZK rollup', value: 3.4, display: '3.4x' },
      { label: 'Stablecoin', value: 2.7, display: '2.7x' },
      { label: 'DeFi', value: 2.6, display: '2.6x' },
    ],
    src: 'Source: OpenAlex corpus, 128,286 papers',
  }),
  'post23_quantum_keywords.png'
);

console.log(`\n✅ All 12 images saved to ${OUT}`);
