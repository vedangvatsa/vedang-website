export const dynamic = 'force-dynamic';



import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainCircuit, DraftingCompass, ExternalLink, Hand, MonitorPlay, Star, BookOpen, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.vibeCoding.title,
  description: pageMetadata.vibeCoding.description,
  url: pageMetadata.vibeCoding.url,
  ogImage: '/images/courses/VibeCoding/VibeCodingPreview.webp',
  ogImageAlt: 'Vibe Coding 101 - Engineering Intuition & Creativity',
});

const referenceLinks = [
    { 
        name: 'Official Vibe Coding Resources', 
        links: [
            { name: 'What is Vibe Coding? (Google Cloud)', url: 'https://cloud.google.com/discover/what-is-vibe-coding' },
            { name: 'Introduction to Vibe Coding (Microsoft Learn)', url: 'https://learn.microsoft.com/en-us/training/modules/introduction-vibe-coding/' },
            { name: 'Vibe Coding Fundamentals (Coursera)', url: 'https://www.coursera.org/learn/vibe-coding-fundamentals' },
            { name: 'Vibe Coding 101 with Replit (DeepLearning.AI)', url: 'https://www.deeplearning.ai/short-courses/vibe-coding-101-with-replit/' },
        ]
    },
    { 
        name: 'Firebase / Firebase Studio', 
        links: [
            { name: 'Firebase Studio Docs', url: 'https://firebase.google.com/docs/studio' },
            { name: 'Firebase Docs', url: 'https://firebase.google.com/docs' }
        ]
    },
    { 
        name: 'Replit', 
        links: [
            { name: 'Replit Docs', url: 'https://docs.replit.com' },
            { name: 'Replit Learn', url: 'https://replit.com/learn' }
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
            { name: 'v0 Docs', url: 'https://v0.dev' },
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
        name: 'Claude Code', 
        links: [
            { name: 'Overview', url: 'https://code.claude.com/docs/en/overview' },
            { name: 'Platform Docs', url: 'https://platform.claude.com/docs/en/home' }
        ]
    },
    { 
        name: 'Cursor', 
        links: [
            { name: 'Cursor Docs', url: 'https://cursor.com/docs' },
            { name: 'Homepage', url: 'https://cursor.com' }
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
    answer: "If you're a visual person and want to build a web app, start with Lovable.dev. If you're more interested in logic, bots, or backend services, start with Replit. Both are excellent for beginners because they require zero setup. Firebase Studio is fantastic when you're ready to build something that can scale to a large audience."
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
  name: 'Vibe Coding 101',
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

        <section className="text-left pt-8 pb-12">
             <div className="max-w-3xl">
                <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1.5" />
                    A Free, Self-Paced Course
                </Badge>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    Vibe Coding 101
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
                Build real apps without writing code. Describe what you want in plain English and let AI handle the implementation. For founders, designers, marketers, and anyone with an idea.
                </p>

                <div className="mt-8 flex justify-start items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: None</Badge>
                </div>

                <div className="mt-8 flex justify-start">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/vibe-coding/module-1-philosophy">
                            Start Course <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 aspect-video rounded-lg overflow-hidden max-w-3xl border bg-muted">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/m6rhnlaNjDY" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen>
                  </iframe>
                </div>
            </div>
        </section>

        <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="max-w-3xl">
                <div className="text-left mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
                    <p className="mt-2 text-muted-foreground">Five modules to take you from concept to product.</p>
                </div>
                <div className="space-y-4">
                    <Link href="/vibe-coding/module-1-philosophy" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">1. The Philosophy</h3>
                                <p className="text-sm text-muted-foreground mt-1">Shift from coder to creative director. Learn to articulate your vision.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                    <Link href="/vibe-coding/module-2-toolkit" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">2. The Modern Toolkit</h3>
                                <p className="text-sm text-muted-foreground mt-1">Explore Firebase Studio, Replit, Cursor, and Lovable.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                    <Link href="/vibe-coding/module-3-prompts" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">3. The Art of the Prompt</h3>
                                <p className="text-sm text-muted-foreground mt-1">Master the GCES framework for writing effective instructions.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                    <Link href="/vibe-coding/module-4-lab" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">4. Lab: Name Generator</h3>
                                <p className="text-sm text-muted-foreground mt-1">Build your first functional micro-app entirely with AI.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                    <Link href="/vibe-coding/module-5-product" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">5. To Professional Product</h3>
                                <p className="text-sm text-muted-foreground mt-1">Implement security rules, databases, and authentication.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>

        <section id="references" className="py-16">
            <div className="text-left mb-8">
                <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Learn More</h2>
                <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl">
                    Resources for tools and platforms. Documentation and guides to build deeper knowledge.
                </p>
            </div>
             
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
                {referenceLinks.map((tool) => (
                    <div key={tool.name} className="break-inside-avoid">
                        <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                        <ul className="space-y-2">
                            {tool.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted-foreground hover:text-primary group">
                                        {link.name}
                                        <ExternalLink className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>

        <section id="faq" className="py-16">
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Common questions about Vibe Coding answered directly.
                </p>
            </div>
            <div className="max-w-5xl mx-auto mt-12">
                <Accordion type="single" collapsible className="w-full grid md:grid-cols-2 gap-x-8">
                   {faqItems.map((item, index) => (
                     <AccordionItem key={index} value={`faq-${index + 1}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                   ))}
                </Accordion>
            </div>
        </section>
    </div>
  );
}

