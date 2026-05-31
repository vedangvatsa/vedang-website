export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.vibeCoding.title,
  description: pageMetadata.vibeCoding.description,
  url: pageMetadata.vibeCoding.url,

  ogImageAlt: 'Vibe Coding - Engineering Intuition & Creativity',
});

const curriculumItems = [
  { href: '/vibe-coding/module-1-philosophy', title: '1. The Philosophy', description: 'Shift from coder to creative director. Learn to articulate your vision.' },
  { href: '/vibe-coding/module-2-toolkit', title: '2. The Modern Toolkit', description: 'Explore Cursor, Replit, Antigravity, and Lovable.' },
  { href: '/vibe-coding/module-3-prompts', title: '3. The Art of the Prompt', description: 'Master the GCES framework for writing effective instructions.' },
  { href: '/vibe-coding/module-4-lab', title: '4. Lab: Name Generator', description: 'Build your first functional micro-app entirely with AI.' },
  { href: '/vibe-coding/module-5-product', title: '5. To Professional Product', description: 'Implement security rules, databases, and authentication.' },
  { href: '/vibe-coding/module-6-debugging', title: '6. Debugging & Iteration', description: 'Read errors, iterate effectively, and use version control.' },
  { href: '/vibe-coding/module-7-deployment', title: '7. Deployment & Databases', description: 'Deploy to Vercel, connect a database, and set up a custom domain.' },
];

const referenceLinks = [
    { 
        name: 'Firebase', 
        links: [
            { name: 'Firebase Docs', url: 'https://firebase.google.com/docs' },
            { name: 'Firebase App Hosting', url: 'https://firebase.google.com/docs/app-hosting' }
        ]
    },
    { 
        name: 'Replit', 
        links: [
            { name: 'Replit Docs', url: 'https://docs.replit.com' },
            { name: 'Replit Agent', url: 'https://docs.replit.com/replitai/agent' }
        ]
    },
     { 
        name: 'Lovable', 
        links: [
            { name: 'Lovable Docs', url: 'https://docs.lovable.dev' }
        ]
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
    { 
        name: 'Anthropic Claude', 
        links: [
            { name: 'Claude Docs', url: 'https://docs.anthropic.com/en/docs/welcome' },
            { name: 'System Prompts', url: 'https://docs.anthropic.com/en/docs/system-prompts' }
        ]
    },
    { 
        name: 'Cursor', 
        links: [
            { name: 'Cursor Docs', url: 'https://docs.cursor.com' },
            { name: 'Cursor Directory', url: 'https://cursor.directory' }
        ]
    },
    { 
        name: 'GitHub Copilot', 
        links: [
            { name: 'Copilot Docs', url: 'https://docs.github.com/en/copilot' }
        ]
    },
    { 
        name: 'OpenAI (ChatGPT / APIs)', 
        links: [
            { name: 'Platform Docs', url: 'https://platform.openai.com/docs' },
            { name: 'Cookbook', url: 'https://cookbook.openai.com' }
        ]
    },
    { 
        name: 'Supabase', 
        links: [
            { name: 'Supabase Docs', url: 'https://supabase.com/docs' },
            { name: 'Learn', url: 'https://supabase.com/learn' }
        ]
    },
    {
        name: 'VS Code + AI Extensions',
        links: [
            { name: 'VS Code', url: 'https://code.visualstudio.com/' },
            { name: 'Gemini Code Assist', url: 'https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist' },
        ],
    },
    {
        name: 'Antigravity',
        links: [
            { name: 'Antigravity', url: 'https://antigravity.dev' },
        ],
    },
];

const faqItems = [
  {
    question: "Do I need to know how to code at all?",
    answer: "Not to get started. The tools are designed to work with plain English. However, understanding basic HTML and CSS concepts will help you communicate more effectively with the AI. You'll naturally pick up these concepts as you build."
  },
  {
    question: "Is this 'real' programming?",
    answer: "Yes. You are creating real, production-quality code. The only thing that's changed is the interface. Instead of typing code, you are describing it. The end result is the same: a functional software application. Your role shifts from a 'coder' to a 'technical director.'"
  },
  {
    question: "Can I build complex applications with this method?",
    answer: "Yes. You can build complex applications with multi-step workflows, databases, and integrations. Break down the complexity into manageable parts and guide the AI step-by-step, just as a project manager would guide a development team."
  },
  {
    question: "What are the biggest mistakes beginners make?",
    answer: "The biggest mistake is giving vague, one-shot prompts like 'build me a social media app.' Vibe coding is a conversation. The second biggest mistake is not using version control ('Checkpoints'). You must save your progress after every successful step, because the AI will occasionally make mistakes."
  },
  {
    question: "Which tool should I start with?",
    answer: "If you're a visual person and want to build a web app, start with Lovable.dev. If you're more interested in logic, bots, or backend services, start with Replit. Both are excellent for beginners because they require zero setup. For professional projects, Cursor or Windsurf with Antigravity gives you full control and scales well."
  },
  {
    question: "How do I handle errors and bugs?",
    answer: "Your new job isn't to fix the bug, but to report it correctly. When you get an error message, copy the entire message, paste it back to the AI, and say, 'We have an error, please fix this.' 9 times out of 10, the AI will understand and correct its own mistake."
  },
  {
    question: "Can I sell the apps I build?",
    answer: "Yes! You own the code and the final product. People are already building successful SaaS businesses, freelance careers, and agencies using Vibe Coding. Your ability to build and iterate quickly is a massive competitive advantage."
  },
  {
    question: "Is my job as a developer at risk?",
    answer: "No, but it is changing. Your value is shifting from writing boilerplate code to high-level architecture, system design, and product vision. Developers who embrace Vibe Coding become 10x more productive."
  },
  {
    question: "What about security and privacy?",
    answer: "This is critical. You are still responsible for the final code. You must instruct the AI on security best practices, such as never hard-coding API keys and always hashing user passwords. In Module 5, we cover how to create a 'rules' file to enforce these policies automatically."
  },
  {
    question: "Where can I learn more?",
    answer: "This course is your starting point. The best way to learn is by building. Pick a small project and build it with one of the tools mentioned. Follow people like Andrej Karpathy and other Vibe Coders on social media to see what's possible. The community is the best resource."
  },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Vibe Coding',
  description: 'A free, self-paced course on building software with AI. Learn to describe what you want in plain English and let AI handle the code.',
  url: 'https://veda.ng/vibe-coding',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
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

export default function VibeCodingCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CourseHero
        title="Vibe Coding"
        subtitle={<>Describe what you want in plain English. AI writes the code.<br />Ship real apps without being a developer.</>}
        youtubeUrl="https://www.youtube.com/embed/m6rhnlaNjDY"
        youtubeMaxWidth="max-w-4xl"
      />

      <CurriculumSection
        description="Seven modules to take you from concept to deployed product."
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
