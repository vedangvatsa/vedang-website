export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/metadata';
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

export const metadata: Metadata = genMeta({
  title: 'Vibe Coding Bootcamp - From Zero to Shipped AI App in 7 Days',
  description: 'A free, 7-day intensive bootcamp that takes you from knowing nothing about AI to shipping a real app with paying users. No coding experience required.',
  url: '/vibecoding/bootcamp',
  ogImageAlt: 'Vibe Coding Bootcamp - From Zero to Shipped AI App in 7 Days',
});

const curriculumItems = [
  { href: '/vibecoding/bootcamp/day-1-ai-foundations', title: 'Day 1 - AI Foundations', description: 'What AI actually is, the 3 types of tools, your first hands-on prompting session' },
  { href: '/vibecoding/bootcamp/day-2-second-brain', title: 'Day 2 - Second Brain + AI', description: 'Build an AI-powered knowledge system with Obsidian and the PARA method' },
  { href: '/vibecoding/bootcamp/day-3-ai-for-organizations', title: 'Day 3 - AI for Organizations', description: 'The 7 categories of AI applications, boring niches, and why agents exist' },
  { href: '/vibecoding/bootcamp/day-4-vibe-coding', title: 'Day 4 - Build Your First App', description: 'Pick a tool, describe your app, ship something running in under an hour' },
  { href: '/vibecoding/bootcamp/day-5-polish-and-power', title: 'Day 5 - Polish and Power', description: 'Professional design, multi-modal AI, and the 5 security holes to fix' },
  { href: '/vibecoding/bootcamp/day-6-ship-and-grow', title: 'Day 6 - Ship and Grow', description: 'Deploy to a live URL, get 10 real testers, start building in public' },
  { href: '/vibecoding/bootcamp/day-7-sell-and-beyond', title: 'Day 7 - Sell and Beyond', description: 'Pricing, your first paying customer, pitch decks, and the post-bootcamp playbook' },
];
const referenceLinks = [
    // Cloud Builders
    {
        name: 'Lovable',
        links: [
            { name: 'Lovable Docs', url: 'https://docs.lovable.dev' },
        ],
    },
    {
        name: 'Replit',
        links: [
            { name: 'Replit Docs', url: 'https://docs.replit.com' },
            { name: 'Replit Agent', url: 'https://docs.replit.com/replitai/agent' },
        ],
    },
    {
        name: 'Vercel v0',
        links: [
            { name: 'v0 Docs', url: 'https://v0.dev/docs' },
            { name: 'Vercel Docs', url: 'https://vercel.com/docs' },
        ],
    },
    {
        name: 'Bolt.new (StackBlitz)',
        links: [
            { name: 'Bolt.new', url: 'https://bolt.new' },
            { name: 'StackBlitz Docs', url: 'https://developer.stackblitz.com' },
        ],
    },
    // AI-Native Editors
    {
        name: 'Cursor',
        links: [
            { name: 'Cursor Docs', url: 'https://docs.cursor.com' },
            { name: 'Cursor Directory', url: 'https://cursor.directory' },
        ],
    },
    {
        name: 'Windsurf (Codeium)',
        links: [
            { name: 'Windsurf IDE', url: 'https://windsurf.com' },
            { name: 'Windsurf Docs', url: 'https://docs.windsurf.com' },
        ],
    },
    {
        name: 'Trae IDE (ByteDance)',
        links: [
            { name: 'Trae', url: 'https://www.trae.ai' },
            { name: 'Trae Docs', url: 'https://docs.trae.ai' },
        ],
    },
    // Terminal Agents
    {
        name: 'Antigravity (Google)',
        links: [
            { name: 'Antigravity', url: 'https://antigravity.dev' },
            { name: 'Antigravity Docs', url: 'https://antigravity.dev/docs' },
        ],
    },
    {
        name: 'Claude Code (Anthropic)',
        links: [
            { name: 'Claude Code Docs', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
        ],
    },
    {
        name: 'Devin (Cognition AI)',
        links: [
            { name: 'Devin', url: 'https://devin.ai' },
        ],
    },
    // Tools
    {
        name: 'Obsidian',
        links: [
            { name: 'Obsidian', url: 'https://obsidian.md' },
            { name: 'Obsidian Docs', url: 'https://help.obsidian.md' },
        ],
    },
    {
        name: 'Supabase',
        links: [
            { name: 'Supabase Docs', url: 'https://supabase.com/docs' },
        ],
    },
];
const faqItems = [
  {
    question: "How is this different from the Vibe Coding course?",
    answer: "The Vibe Coding course teaches you the fundamentals of AI-assisted development. This bootcamp covers the full journey from understanding AI, building a knowledge system, finding problems worth solving, building and shipping an MVP, and selling it. Think of the course as the skills and the bootcamp as the complete playbook."
  },
  {
    question: "Do I need coding experience?",
    answer: "No. Day 1 starts from absolute zero. By Day 4 you'll be building apps using AI tools that write the code for you. The bootcamp is designed for people who have never written a line of code."
  },
  {
    question: "Can I really go from zero to a shipped app in 7 days?",
    answer: "Yes. The key is scope. You're not building the next Facebook. You're building one feature that solves one problem for one type of user. The bootcamp teaches you how to cut scope aggressively and ship something real."
  },
  {
    question: "What tools do I need?",
    answer: "A laptop and an internet connection. All the AI tools mentioned have free tiers that are more than enough to build your first app. Day 2 uses Obsidian (free). Day 4 uses tools like Lovable, Cursor, or Bolt.new."
  },
  {
    question: "Is this free?",
    answer: "Yes. Completely free. No signup, no paywall, no email gate. Just open the days and start building."
  },
  {
    question: "What if I already know some AI stuff?",
    answer: "Skip ahead. Each day is self-contained. If you already use ChatGPT daily, start at Day 3 or Day 4. If you've already built apps, jump to Day 6 for shipping and growth strategies."
  },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Vibe Coding Bootcamp',
  description: 'A free, 7-day intensive bootcamp from zero AI knowledge to a shipped app with paying users.',
  url: 'https://veda.ng/vibecoding/bootcamp',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  numberOfCredits: 7,
  timeRequired: 'P7D',
  teaches: [
    'AI fundamentals and tool categories',
    'AI-powered second brain with Obsidian',
    'AI applications for organizations',
    'Building your first app with AI tools',
    'Professional design and security',
    'Deployment and user testing',
    'Selling and scaling your app',
  ],
  coursePrerequisites: 'No coding experience required. Just a laptop and internet.',
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

export default function BootcampPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CourseHero
        title="Vibe Coding Bootcamp"
        subtitle={<>From zero AI knowledge to a shipped app in 7 days.<br />One day at a time. Free and self-paced.</>}
      />

      {/* Stats bar */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 py-6 border-y bg-muted/20">
        <div className="text-center">
          <div className="text-2xl font-bold">7</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">0 to 100</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Progression</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">Free</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Always</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">1</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Shipped App</div>
        </div>
      </div>

      <CurriculumSection
        description="Seven days to take you from knowing nothing about AI to shipping an app with real users. Each day builds on the last."
        items={curriculumItems}
      />

      <CourseReferences categories={referenceLinks} />
      <CourseFAQ items={faqItems} />
    </div>
  );
}
