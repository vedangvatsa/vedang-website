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
import { AuthorByline } from '@/components/author-byline';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.healthProtocols.title,
  description: pageMetadata.healthProtocols.description,
  url: pageMetadata.healthProtocols.url,
});

// ── Data ──────────────────────────────────────────────────────────────────────

const quickStartRules = [
  'Sleep is the single most powerful biological intervention.',
  'Be in bed for 8 hours every night.',
  'Maintain the same bedtime every evening, before midnight.',
  'Do not eat within 4 hours of sleeping.',
  'Turn off all screens 1 hour before bed.',
  'Eliminate added sugars completely.',
  'Eat whole foods: vegetables, fruits, nuts, and legumes.',
  'Elevate heart rate into cardiovascular training zones routinely.',
  'Incorporate compound resistance training.',
  'Perform mobility work and dynamic stretching daily.',
  'Follow a multi-step oral hygiene routine: water flosser, floss, brush, tongue scrape.',
  'Maintain consistent hydration throughout the day.',
  'Get direct sunlight exposure immediately upon waking.',
  'Practice upright, active posture.',
  'Maintain meaningful social connection with friends weekly.',
  'Minimize contact with plastics in food and beverage storage.',
  'Practice structured diaphragmatic breathing during acute stress.',
  'Eliminate alcohol consumption.',
  'Stop all caffeine intake by noon.',
  'Keep bedroom temperature cool (around 68-70°F) for deep sleep.',
  'Disable non-essential smartphone notifications.',
  'Avoid smoking and inhaled toxins.',
  'Adopt protocol changes incrementally.',
  'Focus strictly on high-leverage habits backed by biomarker data.',
];

const supplements = [
  { name: 'Essential Capsules', dose: '3 servings/day', purpose: 'Vitamin D3, B-complex, Zinc (15 mg), Selenium, Iodine', source: 'https://www.youtube.com/watch?v=foa9ZhtyrfM&t=182' },
  { name: 'Advanced Antioxidants', dose: '1 softgel', purpose: 'Vitamin K1 (1,500 mcg), K2-MK4 (5 mg), K2-MK7 (600 mcg), Lycopene, Lutein (20 mg), Zeaxanthin', source: 'https://www.youtube.com/watch?v=58rZylfxnjE&t=280' },
  { name: 'NAC (N-Acetyl Cysteine)', dose: '3 caps', purpose: 'Glutathione precursor, liver support, antioxidant defense', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Ginger + Cumin', dose: 'per stack', purpose: 'Anti-inflammatory and digestive support', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Red Yeast Rice', dose: '1 cap', purpose: 'Lipid management and cardiovascular support', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Garlic Extract', dose: '1 softgel', purpose: 'Cardiovascular and arterial elasticity support', source: 'https://www.youtube.com/watch?v=rioVRj7uSRk&t=13' },
  { name: 'Proferrin (Heme Iron)', dose: '10 mg', purpose: 'Targeted iron levels; paired with Vitamin C for absorption', source: 'https://www.youtube.com/watch?v=OJZ4pjzwDLU&t=96' },
  { name: 'Hyaluronic Acid', dose: '300 mg', purpose: 'Joint mobility and tissue hydration', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=136' },
  { name: 'Collagen Peptides', dose: '20 g', purpose: 'Oral peptides for joint connective tissue and dermal health', source: 'https://www.youtube.com/watch?v=F_3p81GmHEg&t=258' },
  { name: 'Creatine Monohydrate', dose: '7.5 g total', purpose: 'Cognitive function, cellular hydration, and ATP regeneration', source: 'https://www.youtube.com/watch?v=djiU_pFTEVE&t=1032' },
  { name: 'DHEA + Melatonin', dose: 'PM', purpose: 'Targeted nighttime hormone and sleep architecture support', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=187' },
  { name: 'Calcium + Vitamin D', dose: 'daily', purpose: 'Bone density and skeletal system preservation', source: 'https://www.youtube.com/watch?v=Y2vpvcMzTVU&t=391' },
  { name: 'Liquid Iodine', dose: '125-250 mcg', purpose: 'Thyroid function support (alternating daily dosing)', source: 'https://www.youtube.com/watch?v=F_3p81GmHEg&t=238' },
];

const LONGEVITY_MIX_SOURCE = 'https://blueprint.bryanjohnson.com/products/blueprint-longevity-mix';
const longevityMix = [
  { ingredient: 'Creatine Monohydrate', amount: '2.5 g', note: 'ATP and cognitive support' },
  { ingredient: 'Ca-AKG (Calcium Alpha-Ketoglutarate)', amount: '2,000 mg', note: 'Cellular metabolism marker' },
  { ingredient: 'Taurine', amount: '1,500 mg', note: 'Cardiovascular and mitochondrial support' },
  { ingredient: 'Glycine', amount: '1,200 mg', note: 'Collagen synthesis cofactor' },
  { ingredient: 'L-Lysine', amount: '1,000 mg', note: 'Connective tissue repair' },
  { ingredient: 'Glucosamine Sulfate', amount: '750 mg', note: 'Joint cartilage integrity' },
  { ingredient: 'L-Glutathione', amount: '250 mg', note: 'Cellular antioxidant protection' },
  { ingredient: 'L-Theanine', amount: '200 mg', note: 'Focused neurochemical calm' },
  { ingredient: 'Vitamin C', amount: '250 mg', note: 'Collagen synthesis cofactor' },
  { ingredient: 'Magnesium', amount: '150 mg', note: 'Neuromuscular function' },
  { ingredient: 'Sodium Hyaluronate', amount: '120 mg', note: 'Extracellular matrix hydration' },
  { ingredient: 'Calcium', amount: '400 mg', note: 'Bone density maintenance' },
];

const meals = [
  { time: '5:25 AM', name: 'Pre-Workout Drink', items: 'Longevity Mix, Collagen Peptides, Creatine, Prebiotic Blend (GOS, Inulin, Arabinogalactan)', source: 'https://www.youtube.com/watch?v=XSaDL4EO0-g&t=79' },
  { time: '5:35 AM', name: 'Longevity Protein', items: 'Macadamias, walnuts, flaxseed, Pea protein, Extra Virgin Olive Oil (1 tbsp), Berries, Pomegranate juice', source: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=594' },
  { time: '11:00 AM', name: 'Super Veggie', items: 'Black lentils (300 g), Broccoli (250 g), Cauliflower (150 g), Shiitake/Maitake mushrooms, Garlic, Ginger, Cumin, Hemp seeds, EVOO, Apple cider vinegar', source: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=281' },
];

const sleepHabits = [
  { habit: 'Bedtime at 8:30 PM, waking naturally around 5:00 AM without alarms. Consistent schedule every day.', source: 'https://www.youtube.com/watch?v=XSaDL4EO0-g&t=36' },
  { habit: 'Dedicated 30-60 minute evening wind-down routine: reading, warm bath, and breathing exercises.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2460' },
  { habit: 'Finish final meal at least 4 hours before bedtime to keep resting heart rate low during sleep.', source: 'https://www.youtube.com/watch?v=VGY_XMXMSZc&t=327' },
  { habit: 'Temperature-controlled sleep surface with progressive cooling for deep sleep cycles.', source: 'https://www.youtube.com/watch?v=3kAiPSEnrHI&t=471' },
  { habit: 'Reserve bedroom strictly for sleep and recovery. Complete blackout environment.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2782' },
  { habit: 'Optimize resting heart rate and HRV prior to sleep through early meal timing and stress regulation.', source: 'https://www.youtube.com/watch?v=ev01uC8uUXI&t=610' },
  { habit: 'Auditory control with high-grade earplugs or consistent low-frequency sound mask.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2656' },
  { habit: 'Eliminate digital screens and blue spectrum exposure 60 minutes prior to sleep.', source: 'https://www.youtube.com/watch?v=LPzRwzivklA&t=2196' },
  { habit: 'Daily wearable biometric sleep tracking (WHOOP and Oura) correlated against physiological recovery.', source: 'https://www.youtube.com/watch?v=8_iIB7_fYCg&t=1899' },
  { habit: 'Targeted evening supplementation: low-dose melatonin and DHEA.', source: 'https://www.youtube.com/watch?v=User8_dkz9s&t=187' },
];

const EXERCISE_SOURCE = 'https://www.youtube.com/watch?v=sYyVi-H-ozI&t=19';
const weeklySchedule = [
  { day: 'Monday', focus: 'Sled & Lower Body', detail: 'Sled push (95 lbs, 3-4 laps), split squats (3x10 each leg), tibialis raises (25 reps)' },
  { day: 'Tuesday', focus: 'Upper Body & Core', detail: 'Push-ups, pull-ups, tricep extensions, reverse push-ups, banded anti-rotation press' },
  { day: 'Wednesday', focus: 'Zone 2 Cardio', detail: '4.5 hours weekly target across Zone 2-4 heart rate zones via cycling or rowing' },
  { day: 'Thursday', focus: 'Power & Compound Lifts', detail: 'Medicine ball slams, power skips, kettlebell swings, and deadlifts' },
  { day: 'Friday', focus: 'HIIT & Ground Mobility', detail: '4x4 minute high-intensity intervals paired with structured ground movement work' },
  { day: 'Saturday', focus: 'Dynamic Athletic Activity', detail: 'Tennis, surfing, or sport-specific movement for balance and proprioception' },
  { day: 'Sunday', focus: 'Active Recovery', detail: 'Targeted mobility, light walking, foam rolling, and joint decompression' },
];

const skincare = [
  { step: 'Red Light Therapy (AM)', detail: 'Targeted photobiomodulation every morning for facial skin health.' },
  { step: 'Mineral Sunscreen', detail: 'Broad-spectrum UVA/UVB mineral physical barrier applied before daylight exposure.' },
  { step: 'Physical UV Defense', detail: 'UV-blocking hats and clothing to avoid peak solar radiation damage.' },
  { step: 'Thermal Fractional Therapy', detail: 'Periodic clinical fractional skin treatments for dermal collagen turnover.' },
  { step: 'Topical Retinoid (PM)', detail: 'Prescription-grade tretinoin applied in the evening for cellular renewal.' },
  { step: 'Oral Collagen Peptides', detail: '20 g daily paired with Vitamin C to support internal collagen synthesis.' },
  { step: 'Near-Infrared Full Body', detail: 'Full-body light therapy following heat exposure for systemic anti-inflammatory benefits.' },
];

const oralHealth = [
  { step: '1. Water Flosser', detail: 'High-pressure targeted water irrigation to clean gingival margins and interdental spaces.' },
  { step: '2. Dental Floss', detail: 'Mechanical flossing to remove plaque and biofilm between contact points.' },
  { step: '3. Sonic Brushing', detail: 'Soft-bristle electric toothbrush. Wait 30 minutes post-meal to safeguard enamel.' },
  { step: '4. Tongue Scraper', detail: 'Stainless steel scraping to clear tongue bacteria and improve oral microbiome health.' },
  { step: '5. Botanical Gum Care', detail: 'Topical tea tree oil application for antimicrobial gum tissue support.' },
];

const biomarkers = [
  { marker: 'VO2 Max', value: '58.7 ml/kg/min', context: 'Top percentile of young adult athletic cohort', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'DunedinPACE Pace of Aging', value: '0.64-0.67', context: 'Aging at approximately 65% of chronological baseline', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'Biological Age Shift', value: '-5.1 years', context: 'Overall biological epigenetic marker reduction', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'hs-CRP (Systemic Inflammation)', value: '<0.15 mg/L', context: 'Minimal detectable baseline systemic inflammation', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
  { marker: 'Blood Chemistry Panels', value: '100+ biomarkers', context: 'Monthly comprehensive testing guiding iterative adjustments', source: 'https://blueprint.bryanjohnson.com/products/blueprint-panel' },
  { marker: 'Epigenetic Methylation Clocks', value: 'Bi-annual testing', context: 'TruDiagnostic DNA methylation analysis', source: 'https://www.trudiagnostic.com' },
  { marker: 'Full-Body MRI', value: 'Annual scan', context: 'Comprehensive anatomical and vascular imaging', source: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers' },
];

const prescriptions = [
  { drug: 'Levothyroxine & Armour Thyroid', purpose: 'Thyroid hormone optimization under continuous blood test monitoring' },
  { drug: 'Low-Dose Testosterone', purpose: 'Maintenance of baseline physiological levels while on caloric restriction' },
  { drug: 'Tadalafil', purpose: 'Microvascular circulation and urinary tract support' },
  { drug: 'Low-Dose Aspirin (81 mg)', purpose: 'Cardiovascular risk mitigation' },
  { drug: 'Acarbose', purpose: 'Blunts post-prandial glycemic excursions by slowing carbohydrate breakdown' },
  { drug: 'Metformin', purpose: 'AMPK activation, hepatic glucose output regulation, and insulin sensitivity' },
];

const faqItems = [
  { question: 'Is this guide affiliated with Bryan Johnson?', answer: 'No. This is an independent reference guide compiled from public documentation, interviews, and clinical protocol updates. It is not endorsed by Bryan Johnson, Blueprint, or Kernel.' },
  { question: 'Should individuals copy this entire protocol?', answer: 'No. Bryan Johnson explicitly notes that this protocol is tailored to his unique physiology under 24/7 medical supervision. Foundation habits like sleep consistency, whole foods, and cardiovascular training provide the vast majority of benefits.' },
  { question: 'What is the estimated cost of the full protocol?', answer: 'The basic core supplement stack runs roughly $10-12 daily. The complete protocol with private clinical physician oversight, monthly blood panels, and advanced imaging runs well into six figures annually.' },
  { question: 'How is the data verified?', answer: 'Information is cross-referenced with Bryan Johnson\'s official documentation at blueprint.bryanjohnson.com, clinical publications, and timestamped walkthroughs.' },
  { question: 'What changed in the recent protocol updates?', answer: 'The regimen shifted from 100+ separate loose pills into consolidated formulations. Rapamycin was paused, lithium microdosing was evaluated, and meal composition was streamlined.' },
  { question: 'Are the prescription medications mandatory?', answer: 'No. Prescription pharmaceuticals require individualized medical supervision and are specifically calibrated for Bryan Johnson\'s physiological biomarkers.' },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Bryan Johnson Blueprint Protocol - Reference Guide',
  url: 'https://veda.ng/health-protocols',
  author: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  datePublished: '2025-05-15',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

function SourceLink({ href, label = 'source' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
    >
      <span>{label}</span>
      <ExternalLink className="h-3 w-3" />
    </Link>
  );
}

export default function HealthProtocolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-12 space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[{ name: 'Health Protocols', url: 'https://veda.ng/health-protocols' }]} />

      {/* ── Editorial Header ── */}
      <header className="border-b border-border/40 pb-10">
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Longevity & Biomarkers</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Bryan Johnson&apos;s Blueprint Protocol
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            A structured, evidence-based reference guide to the Blueprint protocol: nutrition, biomarker targets, exercise programming, and sleep architecture.
          </p>
          <div className="pt-2">
            <AuthorByline />
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Primary source:{' '}
            <Link
              href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary transition-colors font-medium"
            >
              blueprint.bryanjohnson.com
            </Link>
          </p>
        </div>
      </header>

      {/* ── Quick Start: Core Principles ── */}
      <section id="quick-start" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Core Lifestyle Rules</h2>
            <SourceLink href="https://x.com/bryan_johnson/status/2054294779194982637" label="Bryan's distilled rules" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            High-leverage foundational habits that require zero supplements or financial investment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3.5 py-4 border-y border-border/30">
          {quickStartRules.map((rule, idx) => (
            <div key={idx} className="flex items-baseline gap-3 text-sm text-foreground/90">
              <span className="text-xs font-mono text-muted-foreground/50 w-5 shrink-0 text-right">{idx + 1}.</span>
              <span className="leading-snug">{rule}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Nutrition ── */}
      <section id="nutrition" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Nutrition & Daily Meals</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#nutrition" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Calorically restricted diet calibrated for nutrient density and minimal post-prandial glycemic response.
          </p>
        </div>

        {/* Clean Typographic Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-border/30">
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">2,250</div>
            <div className="text-xs text-muted-foreground mt-0.5">Calories (10% restriction)</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">130g</div>
            <div className="text-xs text-muted-foreground mt-0.5">Protein (25%)</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">206g</div>
            <div className="text-xs text-muted-foreground mt-0.5">Carbohydrates (35%)</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">101g</div>
            <div className="text-xs text-muted-foreground mt-0.5">Fats (40%)</div>
          </div>
        </div>

        {/* Meal Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Meal Schedule</h3>
          <div className="divide-y divide-border/30 border-y border-border/30">
            {meals.map((meal) => (
              <div key={meal.name} className="py-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                <span className="text-xs font-mono text-muted-foreground/70 shrink-0 sm:w-20 pt-0.5">{meal.time}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{meal.name}</span>
                    <SourceLink href={meal.source} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{meal.items}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Longevity Mix */}
        <div className="space-y-3 pt-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Longevity Mix Composition</h3>
            <SourceLink href={LONGEVITY_MIX_SOURCE} label="specifications" />
          </div>
          <div className="divide-y divide-border/30 border-y border-border/30">
            {longevityMix.map((item) => (
              <div key={item.ingredient} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 text-sm">
                <div className="flex items-baseline gap-3">
                  <span className="font-medium text-foreground">{item.ingredient}</span>
                  <span className="text-xs font-mono text-muted-foreground">{item.amount}</span>
                </div>
                <span className="text-xs text-muted-foreground sm:text-right">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exercise ── */}
      <section id="exercise" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Exercise Programming</h2>
            <SourceLink href={EXERCISE_SOURCE} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Structured 6-hour weekly protocol split evenly between resistance work and cardiovascular conditioning.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-border/30">
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">6 hrs</div>
            <div className="text-xs text-muted-foreground mt-0.5">Weekly Training Volume</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">150 min</div>
            <div className="text-xs text-muted-foreground mt-0.5">Zone 2 Aerobic Base</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">75 min</div>
            <div className="text-xs text-muted-foreground mt-0.5">High-Intensity Intervals</div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">3x</div>
            <div className="text-xs text-muted-foreground mt-0.5">Resistance Sessions / Week</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Weekly Training Split</h3>
          <div className="divide-y divide-border/30 border-y border-border/30">
            {weeklySchedule.map((day) => (
              <div key={day.day} className="py-3.5 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6 text-sm">
                <span className="text-xs font-mono text-muted-foreground/70 shrink-0 sm:w-24 pt-0.5">{day.day}</span>
                <div className="flex-1">
                  <span className="font-semibold text-foreground">{day.focus}</span>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{day.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sleep ── */}
      <section id="sleep" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Sleep Protocol</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#sleep" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Treated as the single highest-ROI health investment, strictly protected with environment and timing controls.
          </p>
        </div>

        <div className="divide-y divide-border/30 border-y border-border/30">
          {sleepHabits.map((item, idx) => (
            <div key={idx} className="py-3.5 flex items-start justify-between gap-4 text-sm">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xs font-mono text-muted-foreground/50 w-5 shrink-0 text-right mt-0.5">{idx + 1}.</span>
                <p className="text-foreground/90 leading-relaxed">{item.habit}</p>
              </div>
              <SourceLink href={item.source} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Supplements ── */}
      <section id="supplements" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Supplement Regimen</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#daily-routine" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidated capsule and liquid formulations taken with meals, guided by monthly blood panel results.
          </p>
        </div>

        <div className="divide-y divide-border/30 border-y border-border/30">
          {supplements.map((supp) => (
            <div key={supp.name} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 text-sm">
              <div className="flex-1">
                <span className="font-semibold text-foreground">{supp.name}</span>
                <span className="text-muted-foreground text-xs sm:ml-2 block sm:inline mt-0.5 sm:mt-0">{supp.purpose}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">{supp.dose}</span>
                <SourceLink href={supp.source} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Biomarkers ── */}
      <section id="biomarkers" className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Biomarker Targets</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#biomarkers" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Iterative physiological targets used to objectively evaluate the protocol efficacy.
          </p>
        </div>

        <div className="divide-y divide-border/30 border-y border-border/30">
          {biomarkers.map((item) => (
            <div key={item.marker} className="py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 text-sm">
              <div className="sm:w-64 shrink-0">
                <span className="font-semibold text-foreground">{item.marker}</span>
              </div>
              <div className="flex-1 sm:text-left">
                <span className="font-mono text-xs text-foreground bg-muted/30 px-1.5 py-0.5 rounded">{item.value}</span>
                <span className="text-xs text-muted-foreground ml-3">{item.context}</span>
              </div>
              <div className="shrink-0 pt-1 sm:pt-0">
                <SourceLink href={item.source} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skincare & Oral Health ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section id="skincare" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Skincare</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#skin" />
          </div>
          <div className="divide-y divide-border/30 border-y border-border/30">
            {skincare.map((item, idx) => (
              <div key={idx} className="py-3 text-sm">
                <div className="font-semibold text-foreground text-xs">{item.step}</div>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="oral-health" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">Oral Health</h2>
            <SourceLink href="https://blueprint.bryanjohnson.com/pages/blueprint-protocol#oral" />
          </div>
          <div className="divide-y divide-border/30 border-y border-border/30">
            {oralHealth.map((item, idx) => (
              <div key={idx} className="py-3 text-sm">
                <div className="font-semibold text-foreground text-xs">{item.step}</div>
                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Prescription Stack ── */}
      <section id="prescriptions" className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Prescription Medications</h2>
            <SourceLink href="https://www.youtube.com/watch?v=Al-CG7ULYtk&t=877" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Physician-supervised pharmaceutical interventions calibrated strictly for Bryan Johnson&apos;s personal clinical biomarkers.
          </p>
        </div>

        <div className="divide-y divide-border/30 border-y border-border/30">
          {prescriptions.map((item) => (
            <div key={item.drug} className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6 text-sm">
              <span className="font-semibold text-foreground sm:w-60 shrink-0 text-xs sm:text-sm">{item.drug}</span>
              <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{item.purpose}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sources Directory ── */}
      <section id="sources" className="space-y-4 pt-4 border-t border-border/40">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Primary Documentation & Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {[
            { title: 'Official Blueprint Protocol', url: 'https://blueprint.bryanjohnson.com/pages/blueprint-protocol', desc: 'Primary specification written by Bryan Johnson' },
            { title: '41 Longevity Rules', url: 'https://x.com/bryan_johnson/status/2054294779194982637', desc: 'Distilled principles and core lifestyle directives' },
            { title: 'Daily Routine Walkthrough', url: 'https://www.youtube.com/watch?v=LPzRwzivklA', desc: 'Schedule, meal preparation, and evening wind-down' },
            { title: 'Exercise & Fitness Guide', url: 'https://blueprint.bryanjohnson.com/blogs/news/exercise-and-fitness-protocol-for-longevity', desc: 'Workout methodology and injury mitigation' },
            { title: 'Nutty Pudding Formulation', url: 'https://www.youtube.com/watch?v=LB9ovOjrw6U&t=594', desc: 'Preparation details for primary meal' },
            { title: 'Biomarker Testing Panel', url: 'https://blueprint.bryanjohnson.com/products/blueprint-panel', desc: '100+ clinical biomarker tracking protocol' },
          ].map((s) => (
            <Link
              key={s.title}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 group flex items-start justify-between gap-3 text-sm hover:text-foreground transition-colors"
            >
              <div>
                <span className="font-medium text-foreground group-hover:underline underline-offset-4">{s.title}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-1 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="space-y-4 pt-4 border-t border-border/40">
        <h2 className="text-xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">{item.question}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Clinical Disclaimer ── */}
      <footer className="pt-8 border-t border-border/30 text-center">
        <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
          Independent informational reference guide. Not affiliated with Bryan Johnson, Blueprint, or Kernel.
          Consult a licensed healthcare professional before making changes to dietary, supplement, or exercise routines.
          Prescription medications require direct physician oversight.
        </p>
      </footer>
    </div>
  );
}
