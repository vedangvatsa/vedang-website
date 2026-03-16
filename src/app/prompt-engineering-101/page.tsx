
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainCircuit, Code, DraftingCompass, ExternalLink, Hand, Lightbulb, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.promptEngineering.title,
  description: pageMetadata.promptEngineering.description,
  url: pageMetadata.promptEngineering.url,
  ogImageAlt: 'Prompt Engineering 101 Course - Master AI Interactions',
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
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Prompt Engineering 101',
  description: 'A free, self-paced course on crafting effective prompts for AI models — zero-shot, few-shot, chain of thought, and code prompting.',
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
                    Prompt Engineering 101
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Learn the art and science of communicating with Large Language Models. This course will teach you how to craft prompts that guide AI to generate accurate, creative, and useful results, turning you into an expert communicator for the new age of technology.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: Curiosity</Badge>
                </div>
            </div>
        </section>

        <div className="container mx-auto px-4 md:px-6 max-w-5xl py-16 space-y-12">
            
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <BrainCircuit className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 1</CardDescription>
                            <CardTitle className="text-2xl">The Core Idea: Guiding the Prediction Engine</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                     <p className="text-muted-foreground">This module introduces the foundational concept of prompt engineering. You'll learn that LLMs are powerful prediction engines and that your prompt is the guide that steers those predictions. We'll cover the essential configurations and the mindset needed to get started.</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">What is Prompt Engineering?</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>At its core, a Large Language Model (LLM) is a powerful prediction engine. It takes a sequence of text (your prompt) and predicts the most likely next word, token by token. Prompt engineering is the art and science of designing high-quality prompts that guide the LLM to produce accurate, relevant, and useful outputs.</p>
                                <p>You don't need to be a data scientist. Your job is not to build the model, but to communicate with it effectively. A well-crafted prompt can be the difference between a generic, useless response and a brilliant, insightful one.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">Key Model Configurations</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Beyond the words you write, you can control the AI's output with a few key settings:</p>
                                <ul className="my-6">
                                    <li><strong>Temperature:</strong> Controls randomness. Low temperature (e.g., 0.2) is deterministic and good for factual answers. High temperature (e.g., 0.9) is more creative and good for brainstorming.</li>
                                    <li><strong>Max Output Tokens:</strong> Limits the length of the response. This is crucial for controlling costs and ensuring responses are concise.</li>
                                    <li><strong>Top-K and Top-P:</strong> These settings control the sampling of tokens. Top-K limits the model to the 'K' most likely next tokens. Top-P (nucleus sampling) selects from the smallest set of tokens whose cumulative probability exceeds 'P'. They provide another way to tune the creativity versus predictability of the model.</li>
                                </ul>
                                <p>As a general starting point, a temperature of 0.2, Top-P of 0.95, and Top-K of 40 will give you coherent, safe results. For creative tasks, try a temperature of 0.9.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Hand className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 2</CardDescription>
                            <CardTitle className="text-2xl">Core Prompting Techniques</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">This module covers the fundamental techniques every prompt engineer must know. These methods are the building blocks for all advanced prompting strategies.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Zero-Shot, One-Shot, and Few-Shot Prompting</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>These techniques refer to how many examples you provide in your prompt.</p>
                                <ul>
                                    <li><strong>Zero-Shot:</strong> You provide no examples, only the instruction. This is the simplest form of prompting and works well for straightforward tasks. <br/> <i>Example: "Classify this email as SPAM or NOT SPAM."</i></li>
                                    <li><strong>One-Shot:</strong> You provide a single example to show the model the desired output format or pattern. <br/> <i>Example: "Translate 'cat' to French: 'chat'. Now translate 'dog' to French:"</i></li>
                                    <li><strong>Few-Shot:</strong> You provide multiple examples (usually 3-5). This is highly effective for complex tasks or when you need the model to follow a very specific pattern. The more examples you provide, the better the model understands your intent.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">Role, System, and Contextual Prompting</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>These techniques help you frame the conversation and provide necessary background.</p>
                                 <ul>
                                    <li><strong>Role Prompting:</strong> You assign a specific persona to the AI. This is incredibly powerful for controlling the tone, style, and expertise of the response. <br/> <i>Example: "You are a world-class travel guide. Suggest three places to visit in Tokyo."</i></li>
                                    <li><strong>System Prompting:</strong> You provide overarching instructions that define the AI's purpose or constraints. <br/> <i>Example: "You are a helpful assistant. Only return your answer in JSON format."</i></li>
                                    <li><strong>Contextual Prompting:</strong> You give the AI specific background information relevant to the task. This helps the model generate a more tailored and accurate response. <br/> <i>Example: "Context: The user is writing for a blog about retro 80s video games. Suggest three article topics."</i></li>
                                </ul>
                                <p>Combining these techniques is key. A great prompt might assign a role, provide context, and give a few-shot example all at once.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Bot className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 3</CardDescription>
                            <CardTitle className="text-2xl">Advanced Reasoning Techniques</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">For complex problems, you need to guide the model's reasoning process. These techniques unlock the AI's ability to solve multi-step problems that require logic and planning.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Chain of Thought (CoT) Prompting</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Chain of Thought is a breakthrough technique for improving an LLM's reasoning. Instead of asking for an answer directly, you ask the model to "think step-by-step." This forces the model to generate intermediate reasoning steps, which dramatically improves its accuracy on math, logic, and multi-step problems.</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  "When I was 3 years old, my partner was 3 times my age. Now, I am 20 years old. How old is my partner? Let's think step by step."
                                </blockquote>
                                <p>By talking through the problem, the model is less likely to make a simple calculation error.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">Self-Consistency</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>This technique builds on CoT. Instead of generating one chain of thought, you generate several by using a higher temperature. Then, you take the most common answer from all the different reasoning paths. This "majority vote" approach significantly boosts accuracy for complex reasoning tasks.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg">ReAct (Reason and Act)</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>ReAct is a powerful paradigm for building agents. It allows an LLM to combine reasoning with actions (tools). The model generates a thought about what it needs to do, then an action (like calling an API or searching the web), and then an observation based on the result. This Thought-Action-Observation loop allows the model to solve dynamic problems that require external information.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Code className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 4</CardDescription>
                            <CardTitle className="text-2xl">Code Prompting: Your AI Pair Programmer</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">LLMs are incredibly powerful tools for developers. This module teaches you how to use prompts to speed up your coding workflow.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                         <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Writing, Explaining, and Translating Code</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <ul>
                                    <li><strong>Writing Code:</strong> Be specific about the language, libraries, and desired functionality.
                                        <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Write a Python function that takes a URL and returns the text content of the page using the 'requests' and 'BeautifulSoup' libraries."</blockquote>
                                    </li>
                                    <li><strong>Explaining Code:</strong> Paste a snippet of code and ask for an explanation. This is great for understanding legacy code or learning a new language.
                                        <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Explain this React hook line by line."</blockquote>
                                    </li>
                                    <li><strong>Translating Code:</strong> Provide a function in one language and ask for its equivalent in another.
                                        <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"Translate the following Bash script into a Python script with the same functionality."</blockquote>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg">Debugging and Reviewing Code</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>LLMs can be fantastic debuggers. When you have an error, provide the full context:</p>
                                <ol>
                                    <li>The code that caused the error.</li>
                                    <li>The full error message and traceback.</li>
                                    <li>Your intent: what were you trying to do?</li>
                                </ol>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">"The Python code below gives a `NameError: name 'toUpperCase' is not defined`. Please debug the code and fix it. Also, suggest any other improvements you see."</blockquote>
                                <p>Often, the model will not only fix the immediate bug but also identify other issues and suggest more robust, efficient code.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                     <div className="flex items-center gap-4">
                        <div>
                           <Lightbulb className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 5</CardDescription>
                            <CardTitle className="text-2xl">Best Practices for Expert Prompting</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">Becoming an expert prompt engineer is an iterative process. Here are some key best practices to keep in mind.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg">Clarity and Simplicity</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <ul>
                                    <li><strong>Be Specific:</strong> Instead of "write a blog post," say "Write a 3-paragraph blog post about the benefits of remote work for small businesses."</li>
                                    <li><strong>Use Clear Instructions:</strong> Start prompts with action verbs (e.g., "Analyze," "Generate," "Summarize," "Translate").</li>
                                    <li><strong>Tell the AI What to Do, Not What Not to Do:</strong> Positive instructions ("Only discuss the top 3 features.") are often more effective than negative constraints ("Don't discuss minor features.").</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg">Experiment and Iterate</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                               <ul>
                                    <li><strong>Try Different Formats:</strong> A question, a statement, or an instruction can yield different results.</li>
                                    <li><strong>Experiment with Output Formats:</strong> For data extraction, ask for the output in a structured format like JSON or XML. This forces the model to be precise and makes the output easier to parse in your application.</li>
                                    <li><strong>Document Your Attempts:</strong> Keep a record of what prompts work and what don't for specific tasks. This is the fastest way to learn and improve.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

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
                        Here’s a curated list of sources to learn about prompt engineering. It covers everything from beginner guides to academic-level surveys and is useful for casual users, developers, and researchers.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto mt-12 prose dark:prose-invert">
                    
                    <h3 className="text-2xl font-semibold tracking-tight">Starting Guides & Tutorials</h3>
                    <ul>
                        <li><Link href="https://github.com/dair-ai/Prompt-Engineering-Guide?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DAIR.AI Prompt Engineering Guide</Link>: A community-driven, comprehensive guide-hub that collects many of the latest papers, tutorials, tools and best practices.</li>
                        <li><Link href="https://learnprompting.org/docs/introduction?srsltid=AfmBOoofk_9KZ9_AF0jWr8FFquJNivbNDE0Zhha-pATc_fHk6MHgZh3o&utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">LearnPrompting.org</Link>: A free, well-structured online guide to generative AI and prompt engineering.</li>
                        <li><Link href="https://platform.openai.com/docs/guides/prompt-engineering?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">OpenAI Prompt Engineering Documentation / Guide</Link>: This official guide lays out core principles and best practices.</li>
                        <li><Link href="https://developers.google.com/machine-learning/resources/prompt-eng?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Google Prompt Engineering Guide</Link>: A practical guide for developers using Google’s AI services.</li>
                    </ul>

                    <h3 className="text-2xl font-semibold tracking-tight mt-12">Courses & Structured Learning Paths</h3>
                    <ul>
                        <li><Link href="https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">DeepLearning.AI in partnership with OpenAI</Link>: “ChatGPT Prompt Engineering for Developers” a short, practical course.</li>
                        <li><Link href="https://www.coursera.org/learn/prompt-engineering?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Vanderbilt University on Coursera</Link>: “Prompt Engineering for ChatGPT” a beginner-friendly course with structured modules.</li>
                        <li>Other curated course lists like this one from <Link href="https://www.analyticsvidhya.com/blog/2024/03/free-chatgpt-prompt-engineering-courses-and-resources/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer">Analytics Vidhya</Link> can highlight a mix of free and paid offerings.</li>
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
                        <li>For long-term skill: follow blogs and curated resource lists to stay updated as prompt engineering evolves rapidly.</li>
                    </ul>
                </div>
            </section>
        </div>
    </PageLayout>
  );
}