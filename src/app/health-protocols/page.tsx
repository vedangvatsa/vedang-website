import { Metadata } from 'next';

import { Card, CardContent } from '@/components/ui/card';
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

// Supplements listed here are pills/capsules only. Items consumed as food
// (Longevity Mix, EVOO, Collagen, Creatine) appear in the Meals section.
const supplements = [
  { name: 'Essential Capsules', dose: '2 caps', purpose: 'Vitamin D3, K2, C, minerals', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { name: 'Advanced Antioxidants', dose: '1 cap', purpose: 'Lycopene, astaxanthin, fisetin', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { name: 'Ashwagandha + Rhodiola', dose: '1 cap', purpose: 'Cortisol, stress management', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { name: 'Omega-3 (EPA/DHA/DPA)', dose: '800 mg', purpose: 'Heart, brain, inflammation', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { name: 'NR or NMN', dose: '450–500 mg', purpose: 'NAD+ replenishment', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { name: 'Proferrin (Heme Iron)', dose: '10.5 mg', purpose: 'Iron optimization', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
];

const meals = [
  { time: '5:25 AM', name: 'Pre-Workout Drink', items: 'Longevity Mix · Creatine (5g) · Prebiotic fiber blend', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine' },
  { time: '5:35 AM', name: 'Longevity Protein', items: 'Blueberry Nut Mix · Collagen (11g) · EVOO · Mixed berries', source: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=594' },
  { time: '~11 AM', name: 'Super Veggie', items: 'Black lentils · Broccoli · Cauliflower · Mushrooms · Garlic · Ginger · EVOO', source: 'https://www.youtube.com/watch?v=0bUieoJ6FI4&t=49' },
];

// Sleep habits here expand on Quick Start rules with specifics Bryan gives
// in dedicated sleep videos. No duplication of the Quick Start wording.
const sleepHabits = [
  { habit: 'Reframe your identity: "I am a professional sleeper."', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#sleep' },
  { habit: '30–60 min wind-down routine: reading, warm bath, breathing exercises.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2460' },
  { habit: 'Regulate evening light: warm/red tones only after sunset. Full blackout in bedroom.', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#sleep' },
  { habit: 'Temperature-controlled mattress. Bedroom at 65–68°F (18–20°C).', source: 'https://www.youtube.com/watch?v=Wk9p3dhMYdk&t=358' },
  { habit: 'Reserve bed for sleep only — no work, no scrolling.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2782' },
  { habit: 'Lower resting heart rate before bed: eat earlier, avoid alcohol, reduce stress.', source: 'https://www.youtube.com/watch?v=ev01uC8uUXI&t=610' },
  { habit: 'Use earplugs or a white noise machine. Minimize disturbances.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2656' },
  { habit: 'Track sleep with a wearable. Use data to make adjustments.', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#sleep' },
];

const faqItems = [
  { question: 'Is this page affiliated with Bryan Johnson?', answer: 'No. Independent summary based on public sources. Not endorsed by or affiliated with Bryan Johnson, Blueprint, or Kernel.' },
  { question: 'Should I follow the full protocol?', answer: 'No. Bryan himself advises against copying it. Start with sleep, exercise, and diet. Consult a professional before adding supplements.' },
  { question: 'How much does it cost?', answer: 'Supplement stack: ~$11/day. Full protocol with devices, testing, and prep: significantly more.' },
  { question: 'Where is the official protocol?', answer: 'blueprint.bryanjohnson.com/pages/blueprint-protocol — updated regularly based on biomarker data.' },
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
      <section className="pb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          Bryan Johnson&apos;s Blueprint Protocol
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed">
          327 protocols extracted from 900+ YouTube transcripts, ranked by mention frequency.
          Every claim links to a timestamped video or the official protocol page.
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          By Vedang Vatsa · <Link href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Primary source</Link>
        </p>
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
        </section>

        {/* ── Exercise ── */}
        <section id="exercise">
          <div className="flex items-baseline justify-between gap-4 mb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Exercise</h2>
            <Src href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#exercise">official source</Src>
          </div>
          <p className="text-muted-foreground text-sm mb-8">6 hours per week. 3 strength + 3 cardio.</p>

          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Strength', detail: '3 sessions / week' },
              { label: 'Zone 2 Cardio', detail: '150 min / week' },
              { label: 'HIIT', detail: '75 min / week' },
            ].map(ex => (
              <Card key={ex.label}>
                <CardContent className="pt-5 pb-4 text-center">
                  <p className="font-semibold">{ex.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ex.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Flexibility + Balance', detail: 'Built into every session' },
              { label: 'Post-meal movement', detail: '5–10 min walk or air squats after meals' },
              { label: 'Desk breaks', detail: 'Every 30 min, stand and move' },
              { label: 'Injury prevention', detail: 'Priority #1. Cautious > ambitious.' },
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
          <p className="text-muted-foreground text-sm mb-8">Pills and capsules taken with breakfast. Food-based supplements (Longevity Mix, EVOO, Collagen, Creatine) are listed in the Nutrition section above.</p>

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
            Expanding on Quick Start rules 0–4 and 18–19. These are the specific techniques Bryan describes in his sleep videos.
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
          Do not replicate without consulting a healthcare professional.
        </p>

      </div>
    </>
  );
}
