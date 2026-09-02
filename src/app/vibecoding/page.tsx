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
  { href: '/vibecoding/module-1-philosophy', title: '1. The Philosophy', description: 'Shift from coder to creative director. Learn to articulate your vision.' },
  { href: '/vibecoding/module-2-toolkit', title: '2. The Modern Toolkit', description: 'Cursor, Replit, Antigravity, Lovable, and when to use each.' },
  { href: '/vibecoding/module-3-prompts', title: '3. The Art of the Prompt', description: 'Master the GCES framework for writing effective instructions.' },
  { href: '/vibecoding/module-4-lab', title: '4. Lab: Name Generator', description: 'Build your first functional micro-app entirely with AI.' },
  { href: '/vibecoding/module-5-product', title: '5. To Professional Product', description: 'Implement security rules, databases, and authentication.' },
  { href: '/vibecoding/module-6-debugging', title: '6. Debugging & Iteration', description: 'Read errors, iterate effectively, and use version control.' },
  { href: '/vibecoding/module-7-deployment', title: '7. Deployment & Databases', description: 'Deploy to Vercel, connect a database, and set up a custom domain.' },
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
    {
        name: 'VS Code + AI',
        links: [
            { name: 'VS Code', url: 'https://code.visualstudio.com/' },
            { name: 'Gemini Code Assist', url: 'https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist' },
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
            { name: 'Getting Started', url: 'https://docs.anthropic.com/en/docs/claude-code/getting-started' },
        ],
    },
    {
        name: 'Gemini CLI (Google)',
        links: [
            { name: 'Gemini CLI', url: 'https://github.com/google-gemini/gemini-cli' },
            { name: 'Gemini API Docs', url: 'https://ai.google.dev/gemini-api/docs' },
        ],
    },
    {
        name: 'OpenAI Codex CLI',
        links: [
            { name: 'Codex CLI', url: 'https://github.com/openai/codex' },
            { name: 'Platform Docs', url: 'https://platform.openai.com/docs' },
        ],
    },
    {
        name: 'OpenCode',
        links: [
            { name: 'OpenCode', url: 'https://opencode.ai' },
            { name: 'GitHub Repo', url: 'https://github.com/sst/opencode' },
        ],
    },
    {
        name: 'Aider',
        links: [
            { name: 'Aider', url: 'https://aider.chat' },
            { name: 'Aider Docs', url: 'https://aider.chat/docs' },
        ],
    },
    {
        name: 'Cline',
        links: [
            { name: 'Cline', url: 'https://cline.bot' },
            { name: 'GitHub Repo', url: 'https://github.com/cline/cline' },
        ],
    },
    {
        name: 'Devin (Cognition AI)',
        links: [
            { name: 'Devin', url: 'https://devin.ai' },
            { name: 'Devin Docs', url: 'https://docs.devin.ai' },
        ],
    },
    {
        name: 'Kiro (AWS)',
        links: [
            { name: 'Kiro', url: 'https://kiro.dev' },
            { name: 'Kiro Docs', url: 'https://kiro.dev/docs' },
        ],
    },
    {
        name: 'Jules (Google)',
        links: [
            { name: 'Jules', url: 'https://jules.google' },
        ],
    },
    // IDE Assistants
    {
        name: 'GitHub Copilot',
        links: [
            { name: 'Copilot Docs', url: 'https://docs.github.com/en/copilot' },
            { name: 'Copilot Workspace', url: 'https://githubnext.com/projects/copilot-workspace' },
        ],
    },
    {
        name: 'Sourcegraph Cody',
        links: [
            { name: 'Cody', url: 'https://sourcegraph.com/cody' },
            { name: 'Cody Docs', url: 'https://docs.sourcegraph.com/cody' },
        ],
    },
    {
        name: 'JetBrains AI',
        links: [
            { name: 'JetBrains AI', url: 'https://www.jetbrains.com/ai' },
            { name: 'AI Assistant Docs', url: 'https://www.jetbrains.com/help/idea/ai-assistant.html' },
        ],
    },
    {
        name: 'Amazon Q Developer',
        links: [
            { name: 'Amazon Q', url: 'https://aws.amazon.com/q/developer' },
            { name: 'Q Developer Docs', url: 'https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug' },
        ],
    },
    {
        name: 'Zed Editor',
        links: [
            { name: 'Zed', url: 'https://zed.dev' },
            { name: 'Zed Docs', url: 'https://zed.dev/docs' },
        ],
    },
    {
        name: 'Warp Terminal',
        links: [
            { name: 'Warp', url: 'https://warp.dev' },
            { name: 'Warp Docs', url: 'https://docs.warp.dev' },
        ],
    },
    // Free / Cloud API Providers
    {
        name: 'OpenRouter',
        links: [
            { name: 'OpenRouter', url: 'https://openrouter.ai' },
            { name: 'OpenRouter Docs', url: 'https://openrouter.ai/docs' },
        ],
    },
    {
        name: 'Groq (Free API)',
        links: [
            { name: 'Groq Console', url: 'https://console.groq.com' },
            { name: 'Groq Docs', url: 'https://console.groq.com/docs' },
        ],
    },
    {
        name: 'NVIDIA NIM (Free API)',
        links: [
            { name: 'NVIDIA NIM', url: 'https://build.nvidia.com' },
            { name: 'NIM Docs', url: 'https://docs.nvidia.com/nim' },
        ],
    },
    {
        name: 'Anthropic Claude',
        links: [
            { name: 'Claude Docs', url: 'https://docs.anthropic.com/en/docs/welcome' },
            { name: 'System Prompts', url: 'https://docs.anthropic.com/en/docs/system-prompts' },
        ],
    },
    {
        name: 'OpenAI',
        links: [
            { name: 'Platform Docs', url: 'https://platform.openai.com/docs' },
            { name: 'Cookbook', url: 'https://cookbook.openai.com' },
        ],
    },
    // Local / Private Models
    {
        name: 'Ollama',
        links: [
            { name: 'Ollama', url: 'https://ollama.com' },
            { name: 'Model Library', url: 'https://ollama.com/library' },
        ],
    },
    {
        name: 'LM Studio',
        links: [
            { name: 'LM Studio', url: 'https://lmstudio.ai' },
            { name: 'LM Studio Docs', url: 'https://lmstudio.ai/docs' },
        ],
    },
    // Backend & Deploy
    {
        name: 'Supabase',
        links: [
            { name: 'Supabase Docs', url: 'https://supabase.com/docs' },
            { name: 'Learn', url: 'https://supabase.com/learn' },
        ],
    },
    {
        name: 'Firebase',
        links: [
            { name: 'Firebase Docs', url: 'https://firebase.google.com/docs' },
            { name: 'Firebase App Hosting', url: 'https://firebase.google.com/docs/app-hosting' },
        ],
    },
    // Templates, Infra & UI Registries
    {
        name: 'Templates & App Forking',
        links: [
            { name: 'Vercel Marketplace', url: 'https://vercel.com/marketplace' },
            { name: 'Vercel Templates', url: 'https://vercel.com/templates' },
            { name: 'v0 Templates', url: 'https://v0.app/templates' },
            { name: 'Lovable Templates', url: 'https://lovable.dev/templates' },
            { name: 'Lovable Academy', url: 'https://academy.lovable.app/academy/templates' },
            { name: 'Bolt.new Remix Engine', url: 'https://bolt.new' },
        ],
    },
    {
        name: 'UI Component Registries',
        links: [
            { name: 'shadcn/ui Registry', url: 'https://ui.shadcn.com' },
            { name: '21st.dev Component Index', url: 'https://21st.dev' },
            { name: 'Magic UI Design', url: 'https://magicui.design' },
            { name: 'Shadcnblocks Catalog', url: 'https://shadcnblocks.com' },
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
  description: 'A free course on building real apps with AI. Learn to build software in plain English using Cursor, Replit, Antigravity, and Lovable.',
  url: 'https://veda.ng/vibecoding',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
  teaches: [
    'Creative director mindset shift',
    'Modern AI toolkit: Cursor, Replit, Antigravity, Lovable',
    'GCES framework for prompt engineering',
    'Building micro-apps entirely with AI',
    'Security, databases, and authentication',
    'Debugging and iteration with AI',
    'Deployment, databases, and custom domains',
  ],
  timeRequired: 'PT6H',
  coursePrerequisites: 'No coding experience required.',
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

import { BreadcrumbSchema } from '@/components/breadcrumb-schema';

export default function VibeCodingCoursePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema items={[{ name: "Vibe Coding", url: "https://veda.ng/vibecoding" }]} />

      {/* Semantic definition block for AI engines */}
      <div className="sr-only">
        <h2>What is Vibe Coding?</h2>
        <p>
          Vibe coding is an AI-assisted software development approach coined by Andrej Karpathy where the human acts as an architect and creative director, describing intent in natural language while AI models generate and maintain the codebase.
        </p>
      </div>

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
