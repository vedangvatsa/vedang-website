import { Metadata } from 'next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.healthProtocols.title,
  description: pageMetadata.healthProtocols.description,
  url: pageMetadata.healthProtocols.url,
});

// ── Data ──────────────────────────────────────────────────────────────────────

const frequencyData = [
  { label: 'Nutrition', count: 93, color: 'bg-emerald-500' },
  { label: 'General Health', count: 60, color: 'bg-stone-500' },
  { label: 'Exercise', count: 55, color: 'bg-blue-500' },
  { label: 'Supplements', count: 25, color: 'bg-violet-500' },
  { label: 'Sleep', count: 24, color: 'bg-indigo-500' },
  { label: 'Mental Health', count: 18, color: 'bg-amber-500' },
  { label: 'Light / Circadian', count: 13, color: 'bg-orange-400' },
];

const quickStartRules = [
  'Sleep is the world\'s most powerful drug.',
  'Be in your bed for 8 hours.',
  'Same bedtime every night, before midnight.',
  'Don\'t eat right before bed.',
  'No screens 1 hour before bed.',
  'Avoid added sugar (it\'s in everything).',
  'Eat whole foods: veggies, fruits, nuts, legumes.',
  'Get your heart rate high routinely.',
  'Lift heavy things.',
  'Stretch daily.',
  'Water pik, floss, brush, tongue scrape.',
  'Drink water.',
  'Get sunlight when you wake up.',
  'Stand up straight.',
  'See a friend once a week.',
  'Avoid plastic where you can.',
  'When stressed, breathe.',
  'Alcohol is bad for you.',
  'Finish coffee before noon.',
  'Sleep in a cold room.',
  'Turn off all notifications.',
  'Don\'t smoke anything.',
  'Baby steps first.',
  'Do less. Most things don\'t work.',
];

// Supplements: pills/capsules taken with breakfast
// Sources: vedangvatsa7/health-protocols repo – timestamped YouTube transcripts
const supplements = [
  { name: 'Essential Capsules', dose: '3 servings/day', purpose: 'Vitamin D3, B-complex, Zinc (15 mg), Selenium, Iodine – "26 critical nutrients"', source: 'https://www.youtube.com/watch?v=foa9ZhtyrfM&t=182' },
  { name: 'Advanced Antioxidants', dose: '1 softgel', purpose: 'Vitamin K1 (1,500 mcg), K2-MK4 (5 mg), K2-MK7 (600 mcg), Lycopene, Lutein (20 mg), Zeaxanthin', source: 'https://www.youtube.com/watch?v=58rZylfxnjE&t=280' },
  { name: 'NAC (N-Acetyl Cysteine)', dose: '3 caps', purpose: 'Glutathione precursor, liver support, manage reactive oxygen species', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Ginger + Cumin', dose: 'per stack', purpose: 'Anti-inflammatory, digestive support', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Red Yeast Rice', dose: '1 cap', purpose: 'Cholesterol management (natural statin)', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Garlic Extract', dose: '1 softgel', purpose: 'Odor-free, cardiovascular and blood pressure support', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Proferrin (Heme Iron)', dose: '10 mg', purpose: 'Iron optimization; take with 250 mg Vitamin C for absorption', source: 'https://www.youtube.com/watch?v=OJZ4pjzwDLU&t=96' },
  { name: 'Hyaluronic Acid', dose: '300 mg', purpose: 'Joint health support', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=136' },
  { name: 'Collagen Peptides', dose: '20 g', purpose: 'Oral collagen for joint and skin health', source: 'https://www.youtube.com/watch?v=F_3p81GmHEg&t=258' },
  { name: 'Creatine Monohydrate', dose: '2.5 g + 5 g', purpose: '2.5 g in Longevity Mix + 5 g separate; cognitive and muscle performance', source: 'https://www.youtube.com/watch?v=djiU_pFTEVE&t=1032' },
  { name: 'DHEA + Melatonin', dose: 'PM', purpose: 'Taken before bed as part of nighttime routine', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=187' },
  { name: 'Calcium + Vitamin D', dose: 'daily', purpose: 'Bone health across all life phases', source: 'https://www.youtube.com/watch?v=Y2vpvcMzTVU&t=391' },
  { name: 'Liquid Iodine', dose: '125-250 mcg', purpose: '125 mcg odd days, 250 mcg even days', source: 'https://www.youtube.com/watch?v=F_3p81GmHEg&t=238' },
];

// Longevity Mix ingredients (dissolved in water, pre-workout)
// Source: blueprint.bryanjohnson.com/products/blueprint-longevity-mix
const LONGEVITY_MIX_SOURCE = 'https://blueprint.bryanjohnson.com/products/blueprint-longevity-mix';
const longevityMix = [
  { ingredient: 'Creatine Monohydrate', amount: '2.5 g', note: '+5 g separate = 7.5 g total' },
  { ingredient: 'Ca-AKG (Calcium Alpha-Ketoglutarate)', amount: '2,000 mg', note: 'Epigenetic aging marker' },
  { ingredient: 'Taurine', amount: '1,500 mg', note: 'Longevity amino acid' },
  { ingredient: 'Glycine', amount: '1,200 mg', note: 'Collagen synthesis, sleep' },
  { ingredient: 'L-Lysine', amount: '1,000 mg', note: 'Tissue repair' },
  { ingredient: 'Glucosamine Sulfate', amount: '750 mg', note: 'Joint cartilage' },
  { ingredient: 'L-Glutathione', amount: '250 mg', note: 'Master antioxidant' },
  { ingredient: 'L-Theanine', amount: '200 mg', note: 'Calm focus' },
  { ingredient: 'Vitamin C', amount: '250 mg', note: 'Collagen cofactor' },
  { ingredient: 'Magnesium', amount: '150 mg', note: 'Muscle, nerve, sleep' },
  { ingredient: 'Sodium Hyaluronate', amount: '120 mg', note: 'Skin hydration' },
  { ingredient: 'Calcium', amount: '400 mg', note: 'Bone density' },
];

const meals = [
  { time: '5:25 AM', name: 'Pre-Workout Drink', items: 'Longevity Mix + Collagen peptides + Creatine (5 g) + Prebiotics (GOS, Inulin, Arabinogalactan)', source: 'https://www.youtube.com/watch?v=XSaDL4EO0-g&t=79' },
  { time: '5:35 AM', name: 'Longevity Protein', items: 'Macadamias, walnuts, flaxseed + Pea protein + EVOO (1 tbsp) + Berries + Pomegranate juice', source: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=594' },
  { time: '~11 AM', name: 'Super Veggie', items: 'Black lentils (300 g) + Broccoli (250 g) + Cauliflower (150 g) + Mushrooms + Garlic + Ginger + Cumin + Hemp seeds + EVOO + ACV', source: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=281' },
];

const sleepHabits = [
  { habit: 'Bed by 8:30 PM, wake naturally ~5:00 AM without alarm. Same time every day, no exceptions.', source: 'https://www.youtube.com/watch?v=XSaDL4EO0-g&t=36' },
  { habit: '30-60 min wind-down routine before bed: reading, warm bath, breathing. Set a bedtime alarm.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2460' },
  { habit: 'Finish last meal at least 4 hours before bed to lower resting heart rate during sleep.', source: 'https://www.youtube.com/watch?v=VGY_XMXMSZc&t=327' },
  { habit: 'Bedroom temp: ~73°F when going to bed, drop to 69°F for deep sleep. Use Eight Sleep mattress.', source: 'https://www.youtube.com/watch?v=3kAiPSEnrHI&t=471' },
  { habit: 'Reserve bed for sleep and sex only. Create a dedicated sleep environment - no screens, no work.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2782' },
  { habit: 'Lower resting heart rate before bed: eat earlier, avoid alcohol, late-night snacks, high stress.', source: 'https://www.youtube.com/watch?v=ev01uC8uUXI&t=610' },
  { habit: 'Use earplugs, white noise machine, or pink noise. Full blackout in bedroom.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2656' },
  { habit: 'Turn off screens 60 minutes before bed. No phone in bedroom.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2196' },
  { habit: 'Track sleep with wearable (WHOOP/Oura). Correlate scores with daily performance.', source: 'https://www.youtube.com/watch?v=8_iIB7_fYCg&t=1899' },
  { habit: 'Take DHEA + melatonin (instant + extended release) before bed.', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=187' },
];

const EXERCISE_SOURCE = 'https://www.youtube.com/watch?v=sYyVi-H-ozI&t=19';
const weeklySchedule = [
  { day: 'Monday', focus: 'Sled + Lower Body', detail: 'Sled push (95 lbs, 3-4 laps) + split squats (3x10 each leg) + tibialis raises (25 reps)' },
  { day: 'Tuesday', focus: 'Upper Body + Core', detail: 'Push-ups, pull-ups, tricep extensions (25 reps), reverse push-ups, banded anti-rotation press' },
  { day: 'Wednesday', focus: 'Zone 2 Cardio', detail: '4.5 hrs/week target at zone 2-4 HR. Cycling, swimming, or brisk walk (45-60 min)' },
  { day: 'Thursday', focus: 'Power + Compound', detail: 'Medicine ball throws/slams (2x5), power skips (2x5), kettlebell swings, deadlifts' },
  { day: 'Friday', focus: 'HIIT + Mobility', detail: '4x4 min intervals at 90-100% effort + 5-7 min ground movement routine' },
  { day: 'Saturday', focus: 'Reactive Activity', detail: 'Tennis, surfing, or sport. Enhances balance and proprioception.' },
  { day: 'Sunday', focus: 'Active Recovery', detail: 'Walking, stretching, foam rolling. 10-min evening walk to wind down.' },
];

const SKIN_SOURCE = 'https://www.youtube.com/watch?v=y3uNl3j5c3k&t=112';
const skincare = [
  { step: 'Red Light (AM)', detail: '30 seconds each side of face every morning for complexion.' },
  { step: 'Mineral Sunscreen', detail: 'UVA+UVB mineral-based, environmentally friendly. Reapply in sun.' },
  { step: 'UV Protection', detail: 'Hat, UV umbrella, driving gloves. Avoid peak UV hours.' },
  { step: 'Tixel Therapy', detail: 'Every 4-8 weeks for skin quality. Exosomes for absorption.' },
  { step: 'Tretinoin (PM)', detail: 'Prescription retinoid applied at night for cell turnover.' },
  { step: 'Collagen Peptides', detail: '20 g oral daily. Paired with Vitamin C (250 mg) for absorption.' },
  { step: 'Red/NIR Light', detail: 'Whole body after sauna. Reduces inflammation, supports collagen.' },
  { step: 'Low-dose Accutane', detail: '40 mg, 2x/week for sebaceous gland regulation.' },
];

const ORAL_SOURCE = 'https://www.youtube.com/watch?v=Z7veiyN4LqU&t=853';
const oralHealth = [
  { step: '1. Water Pick', detail: 'High-pressure irrigation to remove plaque from gum line and between teeth.' },
  { step: '2. Floss', detail: 'Thick floss to remove debris loosened by water pick.' },
  { step: '3. Brush', detail: 'Electric toothbrush, soft bristles. Wait 30 min after eating to protect enamel.' },
  { step: '4. Tongue Scrape', detail: 'Stainless steel scraper. Reduces bacterial load and bad breath.' },
  { step: '5. Tea Tree Oil', detail: 'Applied for gum health. Anti-plaque, anti-inflammatory.' },
];

const BIOMARKER_SOURCE = 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers';
const biomarkers = [
  { marker: 'VO2 Max', value: '58.7 ml/kg/min', context: 'Top 1% of 18-year-olds', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'DunedinPACE', value: '0.64-0.67', context: 'Aging at ~64-67% normal speed', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'Biological Age Reduction', value: '5.1 years', context: 'Cumulative vs chronological age', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'hs-CRP (Inflammation)', value: '<0.15 mg/L', context: 'Near undetectable systemic inflammation', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'Blood Panels', value: '100+ markers', context: 'Monthly testing, algorithmic interpretation', source: 'https://blueprint.bryanjohnson.com/products/blueprint-panel' },
  { marker: 'Epigenetic Testing', value: '2x/year', context: 'TruDiagnostic DNA methylation clocks', source: 'https://www.trudiagnostic.com' },
  { marker: 'Whole-body MRI', value: 'Annual', context: 'Full organ and vessel imaging', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
];

const RX_SOURCE = 'https://www.youtube.com/watch?v=Al-CG7ULYtk&t=877';
const prescriptions = [
  { drug: 'Levothyroxine 112mg + Armour Thyroid 30mg', purpose: 'Hypothyroidism management (daily)' },
  { drug: 'Testosterone 2mg patch (Androderm)', purpose: 'Maintain normal levels (~850) while on caloric restriction' },
  { drug: 'Tadalafil', purpose: 'Offset bladder enlargement, improve urinary function' },
  { drug: 'Low-dose Aspirin', purpose: '81 mg daily, cardiovascular protection' },
  { drug: 'Acarbose', purpose: 'Slows carbohydrate absorption, reduces glucose spikes' },
  { drug: 'Metformin', purpose: 'Insulin sensitivity, cellular energy regulation' },
];

const faqItems = [
  { question: 'Is this page affiliated with Bryan Johnson?', answer: 'No. Independent summary based on public sources. Not endorsed by or affiliated with Bryan Johnson, Blueprint, or Kernel.' },
  { question: 'Should I follow the full protocol?', answer: 'No. Bryan himself advises against copying it. Start with sleep, exercise, and diet. Consult a professional before adding supplements.' },
  { question: 'How much does it cost?', answer: 'Supplement stack: ~$11/day. Full protocol with devices, testing, and prep: significantly more. Prescription medications, blood panels, and MRIs add thousands per year.' },
  { question: 'Where are the sources from?', answer: 'All data is cross-referenced against 327 Bryan Johnson protocols extracted from 1,876 analyzed YouTube videos with timestamped transcripts. Official protocol: blueprint.bryanjohnson.com' },
  { question: 'What changed in 2026?', answer: 'NMN/NR reduced to 6 days/week. Rapamycin discontinued. Low-dose Lithium added. Longevity Mix reformulated. Simplified from 100+ pills to consolidated Blueprint-branded blends.' },
  { question: 'What is the "Don\'t Die" philosophy?', answer: 'Bryan treats the body as a "self-driving" system. Biological data overrides emotional impulses. AI analyzes biomarkers and dictates adjustments to supplements and lifestyle in real-time.' },
  { question: 'Are prescription medications required?', answer: 'No. The prescription stack (Metformin, Acarbose, etc.) is specific to Bryan\'s physiology and requires medical supervision. The supplement and lifestyle protocols can be adopted independently.' },
];

const articleSchema = {
  '@context': 'https://schema.org', '@type': 'Article',
  headline: 'Bryan Johnson Blueprint Protocol – Curated Health Guide',
  url: 'https://veda.ng/health-protocols',
  author: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  datePublished: '2025-05-15',
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function Src({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-primary transition-colors">
      {children || 'source'} <ExternalLink className="h-2.5 w-2.5" />
    </Link>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HealthProtocolsPage() {
  const maxCount = Math.max(...frequencyData.map(d => d.count));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ── */}
      <section className="text-center pt-16 pb-12 border-b border-border/30">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-2">
            Bryan Johnson&apos;s Blueprint Protocol
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            327 protocols extracted from 900+ YouTube transcripts, ranked by mention frequency.
            Every claim links to a timestamped video or the official protocol page.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            By Vedang Vatsa · <Link href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary font-medium">Primary source →</Link>
          </p>
        </div>
      </section>

      <div className="space-y-24">

        {/* ── Frequency ── */}
        <section>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">What Bryan talks about most</p>
          <div className="space-y-2.5">
            {frequencyData.map(d => (
              <div key={d.label} className="flex items-center gap-4">
                <span className="text-sm w-36 shrink-0 truncate">{d.label}</span>
                <div className="flex-1 h-5 rounded bg-muted/40 overflow-hidden">
                  <div className={`h-full rounded ${d.color}`} style={{ width: `${(d.count / maxCount) * 100}%` }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Based on transcript analysis of Bryan Johnson&apos;s YouTube content. Cross-referenced with the{' '}
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol">official protocol</Src> and{' '}
            <Src href="https://x.com/bryan_johnson/status/2054294779194982637">41-rules tweet</Src>.
          </p>
        </section>

        {/* ── Quick Start ── */}
        <section id="quick-start">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Quick Start</h2>
            <Src href="https://x.com/bryan_johnson/status/2054294779194982637">original tweet</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Bryan&apos;s own distilled advice. No supplements. No cost. Start here.</p>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {quickStartRules.map((rule, idx) => (
              <div key={idx} className="break-inside-avoid flex gap-3 p-3 rounded-lg border bg-card">
                <span className="text-xs font-mono text-muted-foreground/60 mt-0.5 shrink-0 w-5 text-right">{idx}</span>
                <p className="text-sm leading-snug">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Nutrition ── */}
        <section id="nutrition">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Nutrition</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#nutrition">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">&ldquo;Every calorie must fight for its life.&rdquo;</p>

          <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden border mb-8">
            {[
              { val: '2,250', lab: 'Calories', sub: '10% restriction' },
              { val: '130g', lab: 'Protein', sub: '25%' },
              { val: '206g', lab: 'Carbs', sub: '35%' },
              { val: '101g', lab: 'Fat', sub: '40%' },
            ].map(s => (
              <div key={s.lab} className="bg-card text-center py-5 px-2">
                <p className="text-xl md:text-2xl font-bold tracking-tight">{s.val}</p>
                <p className="text-xs mt-0.5">{s.lab}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {meals.map(meal => (
              <div key={meal.name} className="bg-card flex gap-4 p-4">
                <span className="text-xs font-mono text-muted-foreground shrink-0 w-16 pt-0.5">{meal.time}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{meal.name}</span>
                    <Src href={meal.source} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{meal.items}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-4 mt-8 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Longevity Mix Ingredients</p>
            <Src href={LONGEVITY_MIX_SOURCE}>product page</Src>
          </div>
          <div className="space-y-px rounded-xl overflow-hidden border">
            {longevityMix.map(item => (
              <div key={item.ingredient} className="bg-card flex items-baseline gap-4 p-4">
                <span className="font-medium text-sm flex-1 min-w-0">{item.ingredient}</span>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{item.amount}</span>
                <span className="text-xs text-muted-foreground/60 shrink-0 w-40 text-right">{item.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Exercise ── */}
        <section id="exercise">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Exercise</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#exercise">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">6 hours per week. 3 strength + 3 cardio. Injury prevention is priority #1.</p>

          <div className="grid grid-cols-4 gap-px rounded-xl overflow-hidden border mb-8">
            {[
              { val: '6 hrs', lab: 'Weekly Total', sub: '~50 min/day' },
              { val: '150 min', lab: 'Zone 2 Cardio', sub: '60-70% max HR' },
              { val: '75 min', lab: 'HIIT', sub: '85-95% max HR' },
              { val: '3x', lab: 'Strength', sub: 'sessions/week' },
            ].map(s => (
              <div key={s.lab} className="bg-card text-center py-5 px-2">
                <p className="text-xl md:text-2xl font-bold tracking-tight">{s.val}</p>
                <p className="text-xs mt-0.5">{s.lab}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-4 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Weekly Schedule</p>
            <Src href={EXERCISE_SOURCE}>exercise guide</Src>
          </div>
          <div className="space-y-px rounded-xl overflow-hidden border mb-6">
            {weeklySchedule.map(day => (
              <div key={day.day} className="bg-card flex gap-4 p-4">
                <span className="text-xs font-mono text-muted-foreground shrink-0 w-20 pt-0.5">{day.day}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{day.focus}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{day.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Flexibility + Balance', detail: 'Built into every session. Dynamic stretching, hip CARs, wall slides.' },
              { label: 'Post-meal movement', detail: '5-10 min walk or air squats after meals to blunt glucose spikes.' },
              { label: 'Desk breaks', detail: 'Every 30 min, stand and move. 5 min of bodyweight movement.' },
              { label: 'Injury prevention', detail: 'Priority #1. Form first, progressive overload second. Cautious > ambitious.' },
            ].map(tip => (
              <div key={tip.label} className="p-4 rounded-lg border bg-card">
                <p className="font-medium text-sm">{tip.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Supplements ── */}
        <section id="supplements">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Supplements</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">Pills and capsules taken with breakfast. Food-based supplements (Longevity Mix, EVOO, Collagen, Creatine) are listed in the Nutrition section. Consolidated from 100+ pills into Blueprint-branded blends in 2026.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {supplements.map(supp => (
              <div key={supp.name} className="bg-card flex items-baseline gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm">{supp.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">{supp.purpose}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{supp.dose}</span>
                <Src href={supp.source} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Sleep ── */}
        <section id="sleep">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Sleep</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#sleep">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            &ldquo;Sleep is the world&apos;s most powerful drug.&rdquo; Bryan treats sleep as the single highest-ROI health investment.
          </p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {sleepHabits.map((item, idx) => (
              <div key={idx} className="bg-card flex items-start gap-4 p-4">
                <span className="text-xs font-mono text-muted-foreground/50 shrink-0 w-5 text-right mt-0.5">{idx + 1}</span>
                <p className="text-sm flex-1">{item.habit}</p>
                <Src href={item.source} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Skincare ── */}
        <section id="skincare">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Skincare</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#skin">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">Protection-first approach. Prevent sun damage, support collagen, use targeted actives.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {skincare.map((item, idx) => (
              <div key={idx} className="bg-card flex items-start gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-36">{item.step}</span>
                <p className="text-sm text-muted-foreground flex-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Oral Health ── */}
        <section id="oral-health">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Oral Health</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#oral">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">Oral microbiome health is linked to cardiovascular disease, dementia, and systemic inflammation. This 5-step routine is performed morning, after lunch, and evening.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {oralHealth.map((item, idx) => (
              <div key={idx} className="bg-card flex items-start gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-36">{item.step}</span>
                <p className="text-sm text-muted-foreground flex-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Biomarkers ── */}
        <section id="biomarkers">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Biomarkers</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">The protocol is a closed-loop system. Diet, exercise, and supplements are adjusted based on real-time biomarker feedback. AI analyzes blood and urine markers to dictate changes.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {biomarkers.map(item => (
              <div key={item.marker} className="bg-card flex items-baseline gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-44">{item.marker}</span>
                <span className="text-sm font-mono shrink-0">{item.value}</span>
                <span className="text-xs text-muted-foreground flex-1 text-right">{item.context}</span>
                <Src href={item.source} />
              </div>
            ))}
          </div>
        </section>

        {/* ── Prescription Stack ── */}
        <section id="prescriptions">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Prescription Stack</h2>
            <Src href={RX_SOURCE}>official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">These are prescription medications specific to Bryan&apos;s medical profile and biomarker targets. They require physician supervision and are not recommended for replication.</p>

          <div className="space-y-px rounded-xl overflow-hidden border">
            {prescriptions.map(item => (
              <div key={item.drug} className="bg-card flex items-baseline gap-4 p-4">
                <span className="font-medium text-sm shrink-0 w-52">{item.drug}</span>
                <p className="text-sm text-muted-foreground flex-1">{item.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sources ── */}
        <section id="sources">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Sources</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'Official Protocol Page', url: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol', desc: 'Primary source. Written by Bryan Johnson.' },
              { title: '41 Longevity Rules', url: 'https://x.com/bryan_johnson/status/2054294779194982637', desc: '"Everything learned spending millions." 42K likes.' },
              { title: 'Top 10 Sleep Habits', url: 'https://www.youtube.com/watch?v=Wk9p3dhMYdk', desc: 'Sleep protocol walkthrough video.' },
              { title: 'Exercise Guide', url: 'https://blueprint.bryanjohnson.com/blogs/news/exercise-and-fitness-protocol-for-longevity', desc: 'Detailed workout protocol.' },
              { title: 'Full Daily Routine', url: 'https://www.youtube.com/watch?v=LPzRwzivklA', desc: 'Schedule, wind-down, meals.' },
              { title: 'Nutty Pudding Recipe', url: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=594', desc: 'How Bryan prepares his signature meal.' },
              { title: 'Skincare Protocol', url: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#skin', desc: 'Detailed skincare and anti-aging routine.' },
              { title: 'Oral Health Protocol', url: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#oral', desc: '5-step dental routine 3x/day.' },
              { title: 'Don\'t Die (Philosophy)', url: 'https://dontdie.com', desc: 'The governing philosophy behind Blueprint.' },
              { title: 'Blueprint Blood Panel', url: 'https://blueprint.bryanjohnson.com/products/blueprint-panel', desc: '100+ biomarker testing, commercial offering.' },
            ].map(s => (
              <Link key={s.title} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors group">
                <div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary/60" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm">{item.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── Disclaimer ── */}
        <p className="text-xs text-muted-foreground/60 text-center pb-4">
          This is an independent summary. Not affiliated with Bryan Johnson, Blueprint, or Kernel.
          Do not replicate without consulting a healthcare professional. Prescription medications require physician supervision.
        </p>

      </div>
    </>
  );
}
