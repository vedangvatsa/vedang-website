export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

export const metadata: Metadata = {
  title: { absolute: 'AI Automation - Automate Anything with AI Agents | Vedang Vatsa' },
  description: 'Free course on AI-powered automation. Learn to build pipelines with APIs, MCP servers, AI agents, n8n, and no-code tools. From social media broadcasting to data pipelines.',
  keywords: ['AI Automation', 'n8n', 'MCP Automation', 'AI Agents', 'API Automation', 'Zapier Alternative', 'No-Code AI', 'Workflow Automation', 'Telegram Bot'],
  alternates: { canonical: '/ai-automation' },
  openGraph: {
    title: 'AI Automation - Automate Anything with AI',
    description: 'Free course on building automated pipelines with AI agents, APIs, MCP servers, and no-code tools.',
    url: 'https://veda.ng/ai-automation',
    type: 'website',
  },
};

const curriculumItems = [
  { href: '/ai-automation/module-1-mindset', title: '1. The Automation Mindset', description: 'Identify automation opportunities, think in workflows, and choose the right tool for every job.' },
  { href: '/ai-automation/module-2-apis', title: '2. API Fundamentals', description: 'REST APIs, authentication, webhooks, pagination: the building blocks every automation uses.' },
  { href: '/ai-automation/module-3-nocode', title: '3. No-Code Automation', description: 'Build powerful workflows with n8n, Make, and Zapier. add AI nodes for intelligent processing.' },
  { href: '/ai-automation/module-4-agents', title: '4. AI Agents as Automators', description: 'Use Claude, Antigravity, and GPT as autonomous workflow executors for social media and beyond.' },
  { href: '/ai-automation/module-5-mcp-automation', title: '5. MCP-Powered Automation', description: 'Connect AI agents to Google Sheets, databases, Slack, and any service via MCP servers.' },
  { href: '/ai-automation/module-6-pipelines', title: '6. Building Custom Pipelines', description: 'Combine APIs + AI + MCP into end-to-end systems: job aggregation, content publishing, data quality.' },
  { href: '/ai-automation/module-7-production', title: '7. Production & Monitoring', description: 'Scheduling with cron/GitHub Actions, monitoring, alerting, cost management, and scaling.' },
];

const referenceLinks = [
    {
        name: 'No-Code Tools',
        links: [
            { name: 'n8n (Open Source)', url: 'https://n8n.io' },
            { name: 'Make (Integromat)', url: 'https://make.com' },
            { name: 'Zapier', url: 'https://zapier.com' },
            { name: 'Pipedream', url: 'https://pipedream.com' },
        ]
    },
    {
        name: 'AI APIs',
        links: [
            { name: 'Anthropic (Claude)', url: 'https://docs.anthropic.com' },
            { name: 'OpenAI API', url: 'https://platform.openai.com/docs' },
            { name: 'Google Gemini API', url: 'https://ai.google.dev' },
        ]
    },
    {
        name: 'Infrastructure',
        links: [
            { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions' },
            { name: 'Vercel Cron Jobs', url: 'https://vercel.com/docs/cron-jobs' },
            { name: 'Supabase', url: 'https://supabase.com' },
            { name: 'Resend (Email API)', url: 'https://resend.com' },
        ]
    },
    {
        name: 'Related Courses',
        links: [
            { name: 'MCP Development', url: '/mcp-development' },
            { name: 'Prompt Engineering', url: '/prompt-engineering-101' },
            { name: 'Vibe Coding', url: '/vibe-coding' },
            { name: 'The Agentic Web', url: '/agentic-web' },
        ]
    },
];

const faqItems = [
  { question: "Do I need coding experience?", answer: "Modules 1-3 are fully no-code. Modules 4-7 include code examples but are designed to be followed with AI assistance, and you can use Vibe Coding techniques to build automations even without deep coding skills." },
  { question: "Is this course just about n8n and Zapier?", answer: "No. This course covers the full automation spectrum: no-code tools (n8n, Make, Zapier), raw API integration, AI agents (Claude, Antigravity, GPT), and MCP-powered automation. The goal is to know when to use each approach." },
  { question: "What's the difference between this and the MCP Development course?", answer: "MCP Development teaches you to build MCP servers from scratch. This course teaches you to use MCP servers (and other tools) as building blocks for automated workflows. They're complementary. MCP Dev is 'build the tools,' this course is 'use the tools.'" },
  { question: "Can I automate social media posting?", answer: "Yes. Module 4 covers social media automation in detail, including Telegram broadcasting, Twitter/X threads, LinkedIn posts, content repurposing pipelines, and community engagement automation." },
  { question: "How much does it cost to run automations?", answer: "Many automations run for free: GitHub Actions has 2,000 free minutes/month, Supabase and Vercel have generous free tiers, and n8n is free to self-host. AI API costs are typically $1-10/month for moderate usage. Module 7 covers cost optimization in detail." },
  { question: "What real-world examples are included?", answer: "The course includes case studies from actual production systems: job aggregation pipelines that process 300+ listings daily, social media broadcasting to Telegram channels, content publishing workflows, competitor tracking, and data quality automation." },
];

const courseSchema = {
  '@context': 'https://schema.org', '@type': 'Course',
  name: 'AI Automation',
  description: 'A free, self-paced course on building AI-powered automations with agents, APIs, MCP servers, and no-code tools.',
  url: 'https://veda.ng/ai-automation',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true, educationalLevel: 'Beginner to Intermediate',
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', instructor: { '@type': 'Person', name: 'Vedang Vatsa' } },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqItems.map(({ question, answer }) => ({
    '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export default function AIAutomationCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CourseHero
        title="AI Automation"
        subtitle={<>Build pipelines that run without you.<br />APIs, MCP servers, n8n, and AI agents working together.</>}
      />

      <CurriculumSection
        description="Seven modules covering no-code, APIs, AI agents, MCP, and production pipelines."
        items={curriculumItems}
      />

      <CourseReferences
        categories={referenceLinks}
      />

      <CourseFAQ
        items={faqItems}
      />
    </div>
  );
}
