
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PredictionEngine, CoreTechniques, AdvancedReasoning, CodePrompting, BestPractices } from '@/components/courses/pe-visuals';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.promptEngineering.title,
  description: pageMetadata.promptEngineering.description,
  url: pageMetadata.promptEngineering.url,
  ogImageAlt: 'Prompt Engineering Course - Master AI Interactions',
});

const faqItems = [
  {
    question: "Do I need a technical background for prompt engineering?",
    answer: "Not at all. Anyone can write a prompt. This course is designed for everyone, from writers and marketers to developers and entrepreneurs. The key skill is clear communication, not coding."
  },
  {
    question: "Is 'zero-shot' or 'few-shot' prompting better?",
    answer: "It depends on the task. Start with zero-shot for simple, direct tasks. If the output isn't quite right or you need a specific format, add one or more examples (one-shot or few-shot) to guide the model. For complex reasoning, few-shot with Chain of Thought is very powerful."
  },
  {
    question: "What is 'temperature' and how should I use it?",
    answer: "Temperature controls the randomness of the output. For factual, predictable answers (like extraction or classification), use a low temperature (e.g., 0.1-0.2). For creative tasks like brainstorming or writing stories, use a higher temperature (e.g., 0.7-1.0) to get more diverse results."
  },
  {
    question: "Why is providing context so important?",
    answer: "Context is everything. An LLM without context is just a powerful prediction engine. By providing context, like a persona for the AI, background information, or examples, you narrow down the infinite possibilities and guide the model toward the specific, high-quality output you need."
  },
  {
    question: "Can I use prompt engineering to generate code?",
    answer: "Absolutely. Prompt engineering is extremely effective for coding tasks. You can ask an LLM to write functions, explain complex code, translate between languages, and even debug errors. Module 4 of this course is dedicated entirely to code prompting."
  },
  {
    question: "How do I avoid getting generic or wrong answers?",
    answer: "Be specific. The more detailed your instructions, the better the output. Use the techniques in this course: give examples, define a role for the AI, provide context, and clearly state your desired output format (like JSON or a bulleted list). Don't be afraid to iterate and refine your prompt."
  },
  {
    question: "Which AI model should I use for prompt engineering?",
    answer: "For most tasks, GPT-4o, Claude 3.5 Sonnet, or Gemini 2.0 Flash are excellent choices. GPT-4o is strong across all categories. Claude excels at long documents and nuanced writing. Gemini is fast and handles multimodal inputs well. For simple tasks, smaller and cheaper models like GPT-4o Mini work fine. The best approach is to experiment with the same prompt across models and compare outputs."
  },
  {
    question: "Will prompt engineering become obsolete as AI improves?",
    answer: "The opposite is happening. As models become more capable, the value of a well-crafted prompt increases. What is changing is the style of prompting. Early prompting was about tricking models into performing. Modern prompting is about clear, structured communication, which is a skill that becomes more valuable over time, not less."
  },
  {
    question: "What are hallucinations and how do I prevent them?",
    answer: "Hallucinations are when the model generates plausible-sounding but factually incorrect information. To reduce them, be specific about what the model does and does not know, ask it to cite sources, use lower temperature settings, and include instructions like 'If you are unsure, say so rather than guessing.' For critical tasks, always verify the output independently."
  },
  {
    question: "What is the difference between a system prompt and a user prompt?",
    answer: "A system prompt sets the overall behavior, constraints, and persona for the AI across the entire conversation. It is like setting the rules of the game. A user prompt is the specific request within that conversation. For example, you might set a system prompt of 'You are a legal assistant who responds in plain English' and then send user prompts like 'Summarize this contract.' The system prompt shapes every response the model gives."
  },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Prompt Engineering',
  description: 'A free, self-paced course on crafting effective prompts for AI models: zero-shot, few-shot, chain of thought, and code prompting.',
  url: 'https://veda.ng/prompt-engineering-101',
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

export default function PromptEngineeringCoursePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <section className="text-center pt-16 pb-12">
             <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    Prompt Engineering
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Learn the art and science of communicating with Large Language Models. This course will teach you how to craft prompts that guide AI to generate accurate, creative, and useful results, turning you into an expert communicator for the new age of technology.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: Curiosity</Badge>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/prompt-engineering-101/module-1-core-idea">
                            Start Course <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-16 space-y-12">
            
        <section id="curriculum" className="py-16 bg-muted/30 border-y -mx-4 px-4 md:-mx-6 md:px-6">
            <div className="max-w-none">
                <div className="text-left mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Course Curriculum</h2>
                    <p className="mt-2 text-muted-foreground">Seven modules to master the art of prompt engineering.</p>
                </div>
                <div className="space-y-4">
                    <Link href="/prompt-engineering-101/module-1-core-idea" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">1. The Core Idea: Guiding the Prediction Engine</h3>
                                <p className="text-sm text-muted-foreground mt-1">Understand LLMs as prediction engines and learn essential configurations.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-2-core-techniques" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">2. Core Prompting Techniques</h3>
                                <p className="text-sm text-muted-foreground mt-1">Master Zero-Shot, Few-Shot, Role, System, and Structured prompting.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-3-advanced-reasoning" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">3. Advanced Reasoning Techniques</h3>
                                <p className="text-sm text-muted-foreground mt-1">Explore Chain of Thought, Self-Consistency, ReAct, and Multimodal Prompting.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-4-code-prompting" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">4. Code Prompting: Your AI Pair Programmer</h3>
                                <p className="text-sm text-muted-foreground mt-1">Use LLMs to write, explain, translate, and debug code effectively.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-5-best-practices" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">5. Best Practices for Expert Prompting</h3>
                                <p className="text-sm text-muted-foreground mt-1">Learn to iterate, provide clarity, and defend against prompt injections.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-6-rag-functions" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">6. RAG & Function Calling</h3>
                                <p className="text-sm text-muted-foreground mt-1">Connect LLMs to your own data with embeddings, vector databases, and tool use.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                    <Link href="/prompt-engineering-101/module-7-chaining-agents" className="block p-6 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg">7. Prompt Chaining & Agents</h3>
                                <p className="text-sm text-muted-foreground mt-1">Orchestrate multi-step workflows and build autonomous agent systems.</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 ml-4" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>

            <section id="faq" className="py-16">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your common questions about prompt engineering, answered.
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

             <section id="learn-more" className="pb-16">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Learn More</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                        Here’s a list of the best sources to learn about prompt engineering. It covers everything from beginner guides to academic-level surveys and is useful for casual users, developers, and researchers.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto mt-12 prose dark:prose-invert">
                    
                    <h3 className="text-2xl font-semibold tracking-tight">Starting Guides & Tutorials</h3>
                    <ul>
                        <li><Link href="https://github.com/dair-ai/Prompt-Engineering-Guide?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DAIR.AI Prompt Engineering Guide</Link>: A community-driven guide that collects many of the latest papers, tutorials, tools and best practices.</li>
                        <li><Link href="https://learnprompting.org/docs/introduction?srsltid=AfmBOoofk_9KZ9_AF0jWr8FFquJNivbNDE0Zhha-pATc_fHk6MHgZh3o&utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">LearnPrompting.org</Link>: A free, well-structured online guide to generative AI and prompt engineering.</li>
                        <li><Link href="https://platform.openai.com/docs/guides/prompt-engineering?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">OpenAI Prompt Engineering Documentation / Guide</Link>: This official guide lays out core principles and best practices.</li>
                        <li><Link href="https://developers.google.com/machine-learning/resources/prompt-eng?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Google Prompt Engineering Guide</Link>: A practical guide for developers using Google’s AI services.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold tracking-tight mt-12">Courses & Structured Learning Paths</h3>
                    <ul>
                        <li><Link href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DeepLearning.AI in partnership with OpenAI</Link>: “ChatGPT Prompt Engineering for Developers” a short, practical course.</li>
                        <li><Link href="https://www.coursera.org/learn/prompt-engineering?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Vanderbilt University on Coursera</Link>: “Prompt Engineering for ChatGPT” a beginner-friendly course with structured modules.</li>
                        <li>Other course lists like this one from <Link href="https://www.analyticsvidhya.com/blog/2024/03/free-chatgpt-prompt-engineering-courses-and-resources/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Analytics Vidhya</Link> can highlight a mix of free and paid offerings.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold tracking-tight mt-12">Academic & Deep-Dive Surveys / Papers</h3>
                    <ul>
                        <li><Link href="https://arxiv.org/abs/2402.07927?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">A Systematic Survey of Prompt Engineering in Large Language Models (2024)</Link>: A peer-reviewed survey on methods, applications, and limitations.</li>
                        <li><Link href="https://arxiv.org/abs/2412.05127?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">The Prompt Canvas: A Literature-Based Practitioner Guide (2024)</Link>: Synthesizes techniques into a unified practical framework.</li>
                        <li><Link href="https://arxiv.org/abs/2407.12994?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">A Survey of Prompt Engineering Methods for Different NLP Tasks (2024)</Link>: Examines methods across various NLP tasks.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold tracking-tight mt-12">Practical & Opinion-Driven Guides / Blogs</h3>
                    <ul>
                        <li><Link href="https://www.cognativ.com/blogs/post/ai-prompt-engineering-techniques-and-strategies-for-success/509?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">cognativ.com</Link>: An up-to-date article offering practical techniques geared for real-world AI tools.</li>
                        <li><Link href="https://medium.com/waits-on-prompt-engineering/prompt-engineering-1-top-10-best-prompting-practices-for-llms-4ffa0449c005?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Medium</Link>: A quick, digestible article on good practical habits for writing prompts.</li>
                        <li><Link href="https://generativeprogrammer.com/p/must-read-free-ai-resources?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">The Generative Programmer</Link>: Broader AI resource lists to stay updated with evolving tools and practices.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold tracking-tight mt-12">Recommendations on What to Read / Do First</h3>
                    <ul>
                        <li>If you’re new: start with <strong><Link href="https://learnprompting.org/docs/introduction?srsltid=AfmBOoofk_9KZ9_AF0jWr8FFquJNivbNDE0Zhha-pATc_fHk6MHgZh3o&utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">LearnPrompting.org</Link></strong> or the <strong><Link href="https://github.com/dair-ai/Prompt-Engineering-Guide?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DAIR.AI guide</Link></strong>.</li>
                        <li>If you prefer guided learning: take the <strong><Link href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DeepLearning.AI</Link></strong> or <strong><Link href="https://www.coursera.org/learn/prompt-engineering?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Vanderbilt University</Link></strong> course.</li>
                        <li>Once you’re comfortable: skim one of the academic surveys to get a deeper, principled understanding.</li>
                        <li>For long-term skill: follow blogs and resource lists to stay updated as prompt engineering evolves rapidly.</li>
                    </ul>
                </div>
            </section>
        </div>
    </>
  );
}