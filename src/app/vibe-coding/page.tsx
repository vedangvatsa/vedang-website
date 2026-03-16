

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainCircuit, Code, DraftingCompass, ExternalLink, Hand, Lightbulb, MonitorPlay, Palette, ShieldCheck, Star, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.vibeCoding.title,
  description: pageMetadata.vibeCoding.description,
  url: pageMetadata.vibeCoding.url,
  ogImage: '/images/courses/VibeCoding/VibeCodingPreview.png',
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
  description: 'A free, self-paced course on intuitive, human-centered software development — combining technical excellence with creative intuition.',
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
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <section className="text-center pt-16 pb-12">
             <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1.5" />
                    A Free, Self-Paced Course
                </Badge>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    Vibe Coding 101
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Build real apps without writing code. Describe what you want in plain English and let AI handle the implementation. For founders, designers, marketers, and anyone with an idea.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: None</Badge>
                    
                </div>

                <div className="mt-8 aspect-video rounded-lg overflow-hidden max-w-3xl mx-auto">
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

        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-16 space-y-12">
            
            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <BrainCircuit className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 1</CardDescription>
                            <CardTitle className="text-2xl">The Philosophy: From Coder to Director</CardTitle>
                        </div>
                    </div>
                     <p className="text-muted-foreground mt-4">Shift from coder to creative director. Learn to articulate your vision and guide AI toward the product you want. Focus on the "what" and "why," not the "how."</p>
                </CardHeader>
                <CardContent className="p-6">
                    <Image
                        src="/images/courses/VibeCoding/Vibe_coding_module1_vedang_vatsa.webp"
                        alt="An infographic for Module 1 of the Vibe Coding course, showing a brain icon and titled 'From Coder to Director'."
                        width={1200}
                        height={675}
                        className="w-full rounded-lg mb-6"
                    />
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">What is Vibe Coding?</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The term “vibe coding” comes from AI researcher <Link href="https://twitter.com/karpathy" target="_blank" rel="noopener noreferrer">Andrej Karpathy</Link>. It describes a new way for humans and machines to work together. Instead of writing code line-by-line, you describe your goal in plain language, and the AI generates the app. Your job changes. You are less like a coder who writes code, and more like a director who guides the project.</p>
                                <div className="grid md:grid-cols-2 gap-6 my-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">The Old Way: Architect & Bricklayer</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">In the past, you had to design the house and lay every brick yourself. You needed to know JavaScript, Python, and CSS. A small mistake, like a missing semicolon, could break everything. This made it hard for new people to start building.</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="border-primary/50">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">The Vibe Way: Product Manager & Creative Director</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">Now, you are the person with the vision. You say, "I need a recipe app with a clean design," and the AI writes the code. Your value is in having a clear idea and guiding the AI to get it right. The AI works like a junior developer who never gets tired and does all the boring work.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                                <p>The goal is to focus on the product, not the code. You work at a higher level, and the AI helps you create what you imagine. This makes it possible for anyone with a good idea to build it.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-left">The GCES Framework for Prompting</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The quality of what the AI creates depends on how good your instructions are. The GCES framework helps you write clear prompts so the AI knows exactly what you want. This helps you get it right the first time.</p>
                                <div className="space-y-4 my-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><Star className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">1. Goal: What do you want the AI to do?</h4>
                                            <p className="text-muted-foreground">Be specific and use action words. Start with a verb. This tells the AI its main task. Example: "Create a contact form with name, email, and message fields."</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><BrainCircuit className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">2. Context: What does the AI need to know?</h4>
                                            <p className="text-muted-foreground">Who will use this? Why are you building it? This helps the AI make better choices about the style. Example: "This is for a local bakery's website. The feeling should be warm and friendly."</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><DraftingCompass className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">3. Expectations: What should the final result look like?</h4>
                                            <p className="text-muted-foreground">Define the rules. Be specific about design and how it should work. Example: "Use the 'Card' and 'Button' components. The main color should be a light pink. The form must work on mobile phones."</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><MonitorPlay className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">4. Source: Can you provide an example?</h4>
                                            <p className="text-muted-foreground">AI learns patterns from examples. Show a reference. Example: "For the design, reference Stripe.com's homepage. Use it as a visual guide for spacing and fonts."</p>
                                        </div>
                                    </div>
                                </div>
                                <p>Using this framework turns a simple idea into a clear plan. This makes the AI's first version much better and saves you time.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Palette className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 2</CardDescription>
                            <CardTitle className="text-2xl">The Modern Toolkit</CardTitle>
                        </div>
                    </div>
                     <p className="text-muted-foreground mt-4">Tool choice determines development speed. There is no universal best tool—only the right one for your project. This module surveys tools from visual builders to professional editors.</p>
                </CardHeader>
                <CardContent className="p-6">
                    <Image
                        src="/images/courses/VibeCoding/Vibe_coding_module2_vedang_vatsa.webp"
                        alt="An infographic for Module 2 of the Vibe Coding course, showing various tool logos and titled 'The Modern Toolkit'."
                        width={1200}
                        height={675}
                        className="w-full rounded-lg mb-6"
                    />
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">Choosing Your Environment: Cloud vs. Local</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Your first choice is where to code. Think of it like a workshop: do you want to use a fully equipped space online, or set one up on your own computer?</p>
                                <div className="grid md:grid-cols-2 gap-6 my-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">Cloud IDEs (Online Workshop)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">Examples: <strong><Link href="https://replit.com" target="_blank" rel="noopener noreferrer">Replit</Link>, <Link href="https://studio.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Studio</Link>, <Link href="https://lovable.dev" target="_blank" rel="noopener noreferrer">Lovable.dev</Link>.</strong><br/><br/>These tools run in your web browser. They need no setup, which is perfect for beginners. You can sign up and start building right away. This lets you focus on creating, not on setup.</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">Local IDEs (Your Own Workshop)</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <p className="text-sm text-muted-foreground">Examples: <strong><Link href="https://cursor.com" target="_blank" rel="noopener noreferrer">Cursor</Link>, VS Code with Gemini.</strong><br/><br/>This is software you install on your own computer. It gives you more control and is what many professionals use. It needs some setup but gives you the most power.</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">A Tour of Your Options</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Popular tools, each optimized for different project types:</p>
                                
                                <Card className="my-6">
                                    <CardHeader>
                                        <CardTitle><Link href="https://studio.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Firebase Studio</Link>: The Production Scaler</CardTitle>
                                    </CardHeader>
                                     <CardContent>
                                        <div>
                                             <Image src="/images/courses/VibeCoding/Google_Firebase_Studio_Vedang_Vatsa.jpg" alt="Screenshot of the Firebase Studio interface for Vibe Coding." width={800} height={450} className="w-full rounded-md mb-4" />
                                            <h5 className="mt-0 font-semibold text-foreground">Best For: Building strong apps that can support millions of users.</h5>
                                            <p className="text-sm text-muted-foreground"><strong>How it works:</strong> Firebase Studio first makes a "Blueprint" (a detailed plan of all file changes) for you to check. This gives you full control and stops the AI from making changes you do not want. It puts your app on Google Cloud, which gives you strong security and lets it grow to handle many users automatically.</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="my-6">
                                    <CardHeader>
                                        <CardTitle><Link href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="hover:underline">Lovable.dev</Link>: The Visual App Builder</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <Image src="/images/courses/VibeCoding/lovable_vedang_vatsa.webp" alt="Screenshot of the Lovable.dev interface for visual Vibe Coding." width={800} height={450} className="w-full rounded-md mb-4" />
                                            <h5 className="mt-0 font-semibold text-foreground">Best For: Beautiful, visual web apps, like dashboards.</h5>
                                            <p className="text-sm text-muted-foreground">
                                              <strong>How it works:</strong> You chat with the AI, and it builds the user interface visually in real time. It feels like a no-code tool, but it creates high-quality code that you own. It can also connect to <strong><Link href="https://supabase.com/" target="_blank" rel="noopener noreferrer">Supabase</Link></strong> to handle user accounts and data with simple prompts.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="my-6">
                                    <CardHeader>
                                        <CardTitle><Link href="https://replit.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Replit</Link>: The All-in-One Workshop</CardTitle>
                                    </CardHeader>
                                     <CardContent>
                                        <div>
                                            <Image src="/images/courses/VibeCoding/replit_vedang_vatsa.jpeg" alt="Screenshot of the Replit IDE, a tool for Vibe Coding." width={800} height={450} className="w-full rounded-md mb-4" />
                                            <h5 className="mt-0 font-semibold text-foreground">Best For: Apps with a lot of logic, bots, backend services, and learning any programming language.</h5>
                                            <p className="text-sm text-muted-foreground"><strong>How it works:</strong> Replit gives you a full computer in the cloud with a code editor, a command line, and a live preview. Its AI can create entire projects from one detailed prompt. You can put your project online with one click.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="my-6">
                                    <CardHeader>
                                        <CardTitle><Link href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Cursor</Link>: The AI-Native Code Editor</CardTitle>
                                    </CardHeader>
                                     <CardContent>
                                        <div>
                                            <Image src="/images/courses/VibeCoding/Cursor_vedang_vatsa.jpg" alt="Screenshot of the Cursor IDE, an AI-native code editor for Vibe Coding." width={800} height={450} className="w-full rounded-md mb-4" />
                                            <h5 className="mt-0 font-semibold text-foreground">Best For: Professional developers who want AI help in their usual workflow.</h5>
                                            <p className="text-sm text-muted-foreground"><strong>How it works:</strong> Cursor is a special version of the VS Code editor, made for coding with AI. It lets you chat with your code, create code with a keyboard shortcut, and accept AI suggestions with one click. It helps developers work faster; it does not replace them.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Hand className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 3</CardDescription>
                            <CardTitle className="text-2xl">The Art of the Prompt</CardTitle>
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-4">Good prompts produce good products. This module teaches clear communication and instruction-writing to guide AI effectively.</p>
                </CardHeader>
                 <CardContent className="p-6">
                    <Image
                        src="/images/courses/VibeCoding/Vibe_coding_module3_vedang_vatsa.webp"
                        alt="An infographic for Module 3 of the Vibe Coding course, showing a hand icon and titled 'The Art of the Prompt'."
                        width={1200}
                        height={675}
                        className="w-full rounded-lg mb-6"
                    />
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">The PRD (Product Requirements Document)</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Never start a project with an empty chat. You need a plan. In product management, this plan is called a PRD. For us, it is a simple text file that tells the AI exactly what to build. It is like a blueprint for a house.</p>
                                <h5>What a Good PRD Contains:</h5>
                                <ul>
                                    <li><strong>Problem:</strong> What problem are you solving? Who has this problem? (e.g., "Busy people forget to drink water.")</li>
                                    <li><strong>Users:</strong> A short description of your ideal user. (e.g., "Sarah, a 30-year-old manager who works from home.")</li>
                                    <li><strong>Features:</strong> A list of the most important features. (e.g., "User signup/login," "Set daily water goal," "Log water," "Send reminders.")</li>
                                    <li><strong>Data Model:</strong> How will you store information? (e.g., "A `users` table with email and password. A `water_logs` table with user_id and amount.")</li>
                                    <li><strong>What Not to Build:</strong> What will you NOT build in the first version? (e.g., "No social features," "No integrations.")</li>
                                </ul>
                                <p><strong>A Useful Trick:</strong> You can use one AI to help you make a plan for another AI. For example, you can prompt a powerful model like <Link href="https://claude.ai" target="_blank" rel="noopener noreferrer">Claude</Link> or <Link href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">ChatGPT</Link> with this:</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">"You are an expert product manager. I want to build a [Recipe App for users with food allergies]. Ask me questions to create a detailed Product Requirements Document (PRD)."</blockquote>
                                <p>The AI will ask you questions to help you think about all the details. The final document becomes the main prompt for your project.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">The Iterative Loop: Your Conversation with the AI</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Vibe coding is a conversation, not a single command. Good products are made by making small changes over time. It’s like sculpting: you start with a block and slowly shape it. Nobody gets it perfect on the first try.</p>
                                <h5>Example: Fixing a Login Button</h5>
                                <ol className="my-6 space-y-4">
                                  <li>
                                    <strong>Prompt:</strong> Give your clear instruction from your PRD.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Build the login page with email and password fields and a 'Login' button. Use our brand's main blue color for the button."</blockquote>
                                  </li>
                                  <li>
                                    <strong>Review:</strong> The AI builds the page. It works, but you see problems. The button is too small, and the color is too bright.
                                  </li>
                                  <li>
                                    <strong>Refine (The Wrong Way):</strong> "That's wrong, fix it." This is not clear. The AI does not know what "fix it" means.
                                  </li>
                                  <li>
                                    <strong>Refine (The Right Way):</strong> Give specific, clear feedback.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Make the login button 20% larger and use a darker blue (#4A90E2). Add a 'Forgot Password?' link below it."</blockquote>
                                  </li>
                                </ol>
                                <p>Repeating this process is the key to creating something great. It is a partnership between your idea and the AI's work, and your job is to lead.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">Advanced Prompting Techniques</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>After you learn the basics, you can use advanced methods to get even better results. These techniques give you more control and create higher-quality code.</p>
                                <div className="space-y-4 my-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><Bot className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Persona Prompting: Get Expert Advice</h4>
                                            <p className="text-muted-foreground">Start your prompt by telling the AI what its job is. This helps it give you expert-level advice instead of a general answer.</p>
                                            <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2 text-sm">"You are an expert security engineer. Check this code for security problems and suggest how to fix them."</blockquote>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><BrainCircuit className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Chain of Thought: See the AI's Reasoning</h4>
                                            <p className="text-muted-foreground">For a difficult task, ask the AI to "think step-by-step." This makes the AI break down the problem and show its work. This often leads to a better answer and makes it easier for you to see and fix its logic.</p>
                                             <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2 text-sm">"I need to connect to a new API. First, think step-by-step about what to do. Then, write the code."</blockquote>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1"><Hand className="w-4 h-4 text-muted-foreground flex-shrink-0" /></div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Negative Prompts: State What to Avoid</h4>
                                            <p className="text-muted-foreground">Specify what you *don't* want. Tell the AI what to avoid.</p>
                                             <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2 text-sm">"Generate a list of startup names. Do not use generic words like 'synergy,' 'cloud,' or 'link'."</blockquote>
                                        </div>
                                    </div>
                                </div>
                                <p>By using these techniques with the GCES framework, your prompts become better directives. This results in a product that matches your vision much more closely from the start.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/30 p-6">
                     <div className="flex items-center gap-4">
                        <div>
                           <Code className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 4</CardDescription>
                            <CardTitle className="text-2xl">Lab: Building a "Startup Name Generator"</CardTitle>
                        </div>
                    </div>
                    <p className="text-muted-foreground mt-4">Build a real "Startup Name Generator" app from concept to deployment. Practice everything you've learned, iterate, and publish.</p>
                </CardHeader>
                <CardContent className="p-6">
                    <Image
                        src="/images/courses/VibeCoding/Vibe_coding_module4_vedang_vatsa.webp"
                        alt="An infographic for Module 4 of the Vibe Coding course, showing a code icon and titled 'Lab: Building a Startup Name Generator'."
                        width={1200}
                        height={675}
                        className="w-full rounded-lg mb-6"
                    />
                     <Accordion type="single" collapsible className="w-full">
                         <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">Building with Firebase Studio</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>For this project, we can use <Link href="https://studio.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Studio</Link>. It is one of the fastest ways to go from an idea to a live app. It can handle the frontend, backend, and putting it online all in one place.</p>
                                
                                <ol className="space-y-4">
                                  <li>To use this tool, go to <strong>Firebase Studio</strong> and start a new project.</li>
                                  <li><strong>Initial Prompt (The Big Idea):</strong> In the main prompt box, describe the entire app you want to build. This is where your PRD is useful.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Create a 'startup name generator' app. It needs a text box to enter an industry, and a 'Generate' button. When I click the button, it should show a list of 10 creative names. The design should be modern, with a dark gray background and bright green text. The app must work well on mobile."</blockquote>
                                  </li>
                                  <li><strong>Review the Blueprint:</strong> Firebase Studio will generate a blueprint for you to check. This is its plan. You can give feedback here before it writes any code. Example feedback: <br/><blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"This looks good, but add a 'Copy to Clipboard' button next to each generated name."</blockquote></li>
                                  <li><strong>Generate and Refine:</strong> After you approve the blueprint, the AI generates the full app. Now you can use the chat to make it better.
                                     <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"The generated names are too simple. Change the AI's instructions to be more creative. Tell it to 'think like a Silicon Valley branding expert.' Also, make the loading icon smaller."</blockquote>
                                  </li>
                                   <li><strong>Deploy to the World:</strong> In the Firebase Studio dashboard, click the <strong>Publish</strong> button. This will make your app live on the internet, running on Google's powerful servers. Congratulations, you have just built and launched a full AI app.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-left">Building with Lovable.dev</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>For a more visual and interactive way to build, use <Link href="https://lovable.dev" target="_blank" rel="noopener noreferrer">Lovable.dev</Link>. Frontend design and rapid prototyping.</p>
                                
                                <ol className="space-y-4">
                                  <li>To start, go to <strong>Lovable.dev</strong> and create a new project.</li>
                                  <li><strong>Initial Prompt:</strong> You can start by describing the user interface.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Create a page with a title that says 'Startup Name Generator'. Below it, add a text input with the placeholder 'Enter an industry...' and a button next to it that says 'Generate'. Below that, add a section to show a list of names."</blockquote>
                                  </li>
                                  <li><strong>Refine the UI:</strong> Use more prompts to change the style.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Style the page with a dark theme. Make the main button have a gradient from purple to blue. The generated names should appear inside a card with a small shadow."</blockquote>
                                  </li>
                                   <li><strong>Add Logic:</strong> Now, you can add the AI part.
                                     <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"When the 'Generate' button is clicked, use an AI to generate 10 startup names based on the text in the input field. Show them in the list section."</blockquote>
                                  </li>
                                   <li><strong>Deploy:</strong> Lovable has a built-in deploy option, which lets you publish your app with a single click.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">Building with Replit</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>If you want more control over the backend, you can use <Link href="https://replit.com" target="_blank" rel="noopener noreferrer">Replit</Link>.</p>
                                
                                <ol className="space-y-4">
                                  <li>To get started, go to <strong>Replit</strong> and start a new project from a template (like "Next.js").</li>
                                  <li><strong>Initial Prompt:</strong> You can ask the Replit AI to create files for you.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Create a Next.js page component for a startup name generator. It should have a state for the industry input and another for the list of names. Include a text input, a button, and a list to show the results. For the backend, create an API route that takes an 'industry' and uses an AI to generate 10 names."</blockquote>
                                  </li>
                                  <li><strong>Review and Debug:</strong> The AI will create the code. Check each file. If there is an error, you can copy the error message and paste it into the chat. "I got this error when running the app, please fix it: [paste error message]".</li>
                                   <li><strong>Refine:</strong>
                                     <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"The style is too plain. Add Tailwind CSS and use it to give the page a modern, dark theme. Center everything on the page."</blockquote>
                                  </li>
                                   <li><strong>Deploy:</strong> Clicking the "Deploy" button in Replit will publish your app to a live website.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-lg text-left">Building with Cursor</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>For professional developers who want AI help on their local computer, <Link href="https://cursor.com" target="_blank" rel="noopener noreferrer">Cursor</Link> is the AI-native code editor.</p>
                                
                                <ol className="space-y-4">
                                  <li>First, set up a new Next.js project on your computer and open the project folder in <strong>Cursor</strong>.</li>
                                  <li><strong>Generate Code:</strong> Use the chat (Cmd/Ctrl + K) to create code or entire files.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Generate the code for a React component called 'NameGenerator'. It should have a form with an input for 'industry' and a button. When submitted, it should get names from the '/api/generate' endpoint and show them."</blockquote>
                                  </li>
                                  <li><strong>Edit with AI:</strong> You can select code and ask the AI to edit it. For example, select your list of names and prompt:
                                     <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"For each name in this list, add a 'Copy' button next to it that copies the name to the clipboard."</blockquote>
                                  </li>
                                   <li><strong>Debug with AI:</strong> If you have an error, you can use the "Debug" feature. The AI will analyze the problem and suggest a fix.</li>
                                   <li><strong>Deploy:</strong> Since this is on your local computer, you can deploy it any way you like (for example, by pushing to GitHub and deploying with <Link href="https://vercel.com" target="_blank" rel="noopener noreferrer">Vercel</Link>).</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden">
                <CardHeader className="bg-secondary/30 p-6">
                     <div className="flex items-center gap-4">
                        <div>
                           <ShieldCheck className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 5</CardDescription>
                            <CardTitle className="text-2xl">From Project to Professional Product</CardTitle>
                        </div>
                    </div>
                     <p className="text-muted-foreground mt-4">Building is the first step. The goal is to create something valuable and lasting. This module explains how to turn your project into a secure product that can make money. It also covers how this new skill can change your career. This is about going from a test project to a professional one.</p>
                </CardHeader>
                 <CardContent className="p-6">
                    <Image
                        src="/images/courses/VibeCoding/Vibe_coding_module5_vedang_vatsa.webp"
                        alt="An infographic for Module 5 of the Vibe Coding course, showing a shield icon and titled 'From Project to Professional Product'."
                        width={1200}
                        height={675}
                        className="w-full rounded-lg mb-6"
                    />
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">Security: Your Responsibility as Director</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Building fast can create security problems. The AI is like a junior developer; it does not know your security rules. You must be the senior developer who sets the rules. This is very important for professional vibe coding.</p>
                                <ul>
                                  <li><strong>The Risk:</strong> An AI might put your private API keys in public code. It might create a login page that is not secure. It does not know what is secret unless you tell it.</li>
                                  <li><strong>The Fix: The Rule File.</strong> Most AI coding tools let you create a special file (like `.cursorrules` or `CLAUDE.md`) with permanent instructions. You must create one.
                                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                    <strong>Rule #1 (Secrets):</strong> Always use environment variables for secret keys. Never write them directly in the code. Call them using `process.env.VARIABLE_NAME`.<br/><br/>
                                    <strong>Rule #2 (Passwords):</strong> All user passwords must be securely hashed (encrypted) before you store them. Never store passwords as plain text.<br/><br/>
                                    <strong>Rule #3 (Database Access):</strong> Always check data on the server side. Use your platform's security rules (like Firebase Security Rules or Supabase RLS) to protect data. Do not only rely on checks in the browser, because they can be skipped.
                                    </blockquote>
                                  </li>
                                </ul>
                                <p>Setting these rules at the start helps the AI build safely for you. This makes it a trusted partner, not a risk.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">Monetization: From Project to Profit</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>How do you turn your app into a business? Vibe coding makes it faster than ever because it costs less to try new ideas. You can test ideas in a weekend that used to take months.</p>
                                <ul>
                                  <li><strong>SaaS (Software as a Service):</strong> This is the most common way. Do not try to build a huge app like Facebook. Instead, build a tool that solves a specific problem for a small group of people. For example, build a "Meal Planner for Vegan Athletes" and charge $10 per month. You can add payment tools like <Link href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</Link> with simple prompts.</li>
                                  <li><strong>Freelancing and Consulting:</strong> Your new skill is speed. You can build apps for clients much faster than a traditional developer. You can market yourself as someone who builds prototypes quickly. Building a client's first version in days, not months, is very valuable.</li>
                                   <li><strong>Marketplace Apps & Plugins:</strong> Build an app for a store like the <Link href="https://marketplace.visualstudio.com/" target="_blank" rel="noopener noreferrer">VS Code Marketplace</Link>, <Link href="https://apps.shopify.com/" target="_blank" rel="noopener noreferrer">Shopify App Store</Link>, or <Link href="https://workspace.google.com/marketplace" target="_blank" rel="noopener noreferrer">Google Workspace Marketplace</Link>. These platforms already have users and payment systems, which solves two of the hardest problems for a new product.</li>
                                </ul>
                                <p>It has never been easier to start a business. With Vibe Coding, one person with a good idea can build a successful business from home.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">The "Product Engineer": Your New Career</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>By learning Vibe Coding, you are becoming a <strong>"Product Engineer."</strong> This is a new and valuable job that combines product management, design, and engineering. It is one of the most wanted roles in tech companies today.</p>
                                <div className="my-6">
                                    <h4 className="font-semibold text-foreground">The Skill Stack Shift</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full mt-2">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-2 font-semibold">Traditional Developer Skills</th>
                                                    <th className="text-left p-2 font-semibold">Vibe Coding Skills</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b"><td className="p-2">Knowing code syntax</td><td className="p-2">Breaking down problems</td></tr>
                                                <tr className="border-b"><td className="p-2">Knowing algorithms</td><td className="p-2">Clear communication with AI</td></tr>
                                                <tr className="border-b"><td className="p-2">Knowing frameworks</td><td className="p-2">System and architecture design</td></tr>
                                                <tr><td className="p-2">Database design</td><td className="p-2">Thinking about the user</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <p>Your value is no longer just your ability to type code. Your value is your ability to <strong>find important problems, design good solutions, and guide an AI to build them.</strong> You are the architect and the leader. The AI is your team of junior developers. This is the future of building software.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <section className="py-16">
                 
                <div className="mt-8 max-w-4xl mx-auto">
                     <Image
                        src="/images/courses/VibeCoding/Vibe_coding_infographic_Vedang_Vatsa.webp"
                        alt="A detailed infographic summarizing the key concepts of Vibe Coding, from philosophy to monetization."
                        width={1200}
                        height={1600}
                        className="w-full rounded-lg"
                    />
                </div>
            </section>

            <section id="references" className="py-16">
                <div className="text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">Learn More</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Resources for tools and platforms. Documentation and guides to build deeper knowledge.
                    </p>
                </div>
                 
                 <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
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
    </PageLayout>
  );
}

