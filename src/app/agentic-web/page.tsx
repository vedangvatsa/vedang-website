
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PageLayout } from '@/components/page-layout';

import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Users, Hand, ShieldCheck, Zap, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.agenticWeb.title,
  description: pageMetadata.agenticWeb.description,
  url: pageMetadata.agenticWeb.url,
  ogImage: '/agentic-web/AgenticAIPreview.png',
  ogImageAlt: 'The Agentic Web - AI Agents & Autonomous Systems',
});

const faqItems = [
  {
    question: "How is an 'AI Agent' different from a regular chatbot like ChatGPT?",
    answer: "A chatbot responds to your prompts. An AI agent acts on your goals. You tell a chatbot, 'What are the steps to book a flight?' You tell an agent, 'Book me the cheapest flight to Tokyo for next Tuesday.' The agent then performs the steps autonomously, interacting with websites and services on your behalf."
  },
  {
    question: "Is the Agentic Web just a theoretical concept?",
    answer: "No, it's already emerging. Services like ChatGPT Agent, Google's Project Mariner, and Genspark's Super Agent are early examples of agentic systems that can perform multi-step tasks. The underlying protocols and architectures are being built now to support a more widespread agentic ecosystem."
  },
  {
    question: "Will agents replace jobs like web developers or travel agents?",
    answer: "The roles will evolve. Just as the web didn't eliminate all information-based jobs, the Agentic Web won't eliminate developers or service professionals. It will automate tedious tasks, allowing humans to focus on higher-level strategy, creativity, complex problem-solving, and managing the agents themselves."
  },
  {
    question: "What is the 'Agent Attention Economy'?",
    answer: "In the current web, companies compete for human attention (clicks, views). In the Agentic Web, a new economy emerges where services and tools compete for agent attention. An agent choosing to use Service A's API over Service B's becomes the new form of a 'click,' driving value and creating a new marketplace."
  },
  {
    question: "Is this secure? What are the risks?",
    answer: "This is one of the most critical challenges. Security and alignment are paramount. An agent with access to your digital life could be misused if not properly constrained. Module 5 of this course is dedicated to these challenges, discussing the need for robust permissions, monitoring, and ensuring agents act ethically and in your best interest."
  },
  {
    question: "Do I need to be a programmer to understand the Agentic Web?",
    answer: "Not at all. This course is designed for a broad audience. The concepts are explained in a way that is accessible to everyone, regardless of technical background. It's more about understanding the paradigm shift, similar to how one might learn about the social media revolution without needing to code."
  },
];

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'The Agentic Web — Introduction',
  description: 'An introduction to the Agentic Web: how autonomous AI agents are transforming the internet from a place to find information into a platform for getting things done.',
  thumbnailUrl: 'https://img.youtube.com/vi/Gqgk25SOIMM/maxresdefault.jpg',
  uploadDate: '2025-01-01',
  embedUrl: 'https://www.youtube.com/embed/Gqgk25SOIMM',
  url: 'https://www.youtube.com/watch?v=Gqgk25SOIMM',
  publisher: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
};

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'The Agentic Web',
  description: 'A free, self-paced course on autonomous AI agents, multi-agent systems, and the emerging agentic internet economy.',
  url: 'https://veda.ng/agentic-web',
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

export default function AgenticWebCoursePage() {
  return (
    <PageLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <section className="text-center pt-16 pb-12">
             <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1.5" />
                    A Free, Self-Paced Course
                </Badge>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
                    The Agentic Web
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                    The internet is evolving. It's no longer just a place to find information-it's becoming a platform for autonomous AI agents to get things done. This course demystifies the Agentic Web, where you delegate goals, and AI handles the execution.
                </p>

                <div className="mt-8 flex justify-center items-center gap-4">
                    <Badge variant="outline">By: Vedang Vatsa</Badge>
                    <Badge variant="outline">Prerequisite: Curiosity</Badge>
                </div>
                
                <div className="mt-8 aspect-video rounded-lg overflow-hidden shadow-2xl border max-w-3xl mx-auto">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Gqgk25SOIMM"
                    title="YouTube video player"
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen>
                  </iframe>
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
                            <CardTitle className="text-2xl">The Core Idea: From Information Web to Action Web</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                     <p className="text-muted-foreground">This module introduces the fundamental shift from a human-driven web to an agent-driven one. You'll learn how the internet is evolving from a passive library of information into a dynamic ecosystem where autonomous agents perform complex tasks on your behalf.</p>
                    <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">The Evolution of the Web</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The internet has gone through several distinct phases, each defined by how we interact with it. Understanding this evolution is key to grasping the significance of the Agentic Web.</p>
                                <ul className="my-6 space-y-4">
                                    <li>
                                        <strong>Web 1.0 (The Read Web, ~1990s):</strong> The early internet was a one-way street. It was a vast, decentralized collection of static documents connected by hyperlinks. You could read information from websites, much like a digital encyclopedia. Interaction was minimal, and the primary activities were browsing and searching. The protocols (like HTTP and SMTP) were open, but the average person was a passive consumer of information created by institutions.
                                    </li>
                                    <li>
                                        <strong>Web 2.0 (The Read-Write Web, ~2004-Present):</strong> The rise of social media, blogs, and wikis turned the internet into a two-way conversation. Platforms like Facebook, YouTube, and Twitter made it incredibly easy for anyone to create and share content. This led to an explosion of user-generated information and a more interactive, participatory web. However, this came at a cost: centralization. A handful of large tech companies became the new gatekeepers, controlling the platforms, owning user data, and setting the rules. You can create, but you don't truly own your content or your digital identity.
                                    </li>
                                    <li>
                                        <strong>The Agentic Web (The Read-Write-Act Web):</strong> This is the next great leap. It aims to combine the decentralized, open ethos of Web 1.0 with the rich, interactive experience of Web 2.0, while adding a new layer: action. In this paradigm, you delegate high-level goals ("Plan my vacation," "Research my competitors," "Manage my smart home") to autonomous AI agents. These agents then interact with the web and its services to execute those goals. The core innovation is moving from manual execution to intent delegation. You own the goal, and the agent performs the actions.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-left">What is an AI Agent?</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>An AI agent is much more than a simple chatbot. While a chatbot is designed for conversation and answering questions, an agent is designed for action. It's an autonomous system that can perceive its environment, reason about its goals, and act to achieve them.</p>
                                <p>Think of it this way:</p>
                                <ul>
                                    <li>You ask a chatbot: "What are the best Italian restaurants near me?"</li>
                                    <li>You tell an agent: "Book a table for two at a highly-rated Italian restaurant near me for 8 PM on Saturday."</li>
                                </ul>
                                <p>An effective AI agent possesses four key capabilities:</p>
                                <ol className="my-6 space-y-4">
                                    <li>
                                        <strong>Perception:</strong> The ability to understand its digital environment. This isn't just about reading text; it's about interpreting the structure of a webpage (the DOM), understanding an API response, or even parsing images and videos.
                                    </li>
                                    <li>
                                        <strong>Reasoning & Planning:</strong> The cognitive engine. The agent takes a complex, high-level goal and breaks it down into a sequence of smaller, manageable steps. It can form strategies, anticipate obstacles, and adapt its plan based on new information.
                                    </li>
                                    <li>
                                        <strong>Action:</strong> The ability to execute its plan. This involves interacting with the web-filling out forms, clicking buttons, calling APIs, sending emails, and even communicating with other agents. This is what separates an agent from a purely informational AI.
                                    </li>
                                    <li>
                                        <strong>Learning:</strong> The capacity to improve over time. An agent can learn from the results of its actions, remember user preferences, and adapt its behavior to become more effective and personalized.
                                    </li>
                                </ol>
                                <p>The defining characteristic is <strong>autonomy</strong>. You set the destination, and the agent figures out how to drive there, handling all the turns, traffic, and detours along the way. This shift from giving instructions to delegating intent is the central promise of the Agentic Web.</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Zap className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 2</CardDescription>
                            <CardTitle className="text-2xl">The Core Components of Agentic Systems</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">To understand the Agentic Web, you need to know its building blocks. This module explores the key components that enable agents to function, from their internal "minds" to the external tools they use to interact with the world.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">The Agent's Mind: Reasoning and Planning</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>At the heart of every agent is a Large Language Model (LLM) that acts as its cognitive engine. But the agent's intelligence isn't just the LLM; it's the framework around it that enables structured reasoning and memory.</p>
                                <ul>
                                    <li>
                                        <strong>Planning Frameworks:</strong> An agent doesn't just improvise. It uses structured techniques to break down a high-level goal into a sequence of executable actions. Common frameworks include:
                                        <ul className="my-2">
                                            <li><strong>Chain of Thought (CoT):</strong> The simplest method, where the agent is prompted to "think step-by-step," verbalizing its reasoning process before taking an action. This significantly improves accuracy on complex tasks.</li>
                                            <li><strong>Tree of Thoughts (ToT):</strong> A more advanced technique where the agent explores multiple reasoning paths simultaneously, like branches of a tree. It can evaluate different approaches and backtrack if a path leads to a dead end, making it more robust for problems with many possible solutions.</li>
                                            <li><strong>ReAct (Reason and Act):</strong> A popular paradigm that interleaves reasoning with action. The agent generates a thought about what to do, an action to take (like searching the web), and an observation of the result. This feedback loop allows it to dynamically adjust its plan based on real-world information.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Memory Architecture:</strong> Since LLMs are stateless, agents need an external memory system to be effective over long tasks. This is often divided into:
                                        <ul className="my-2">
                                            <li><strong>Short-Term Memory (Working Memory):</strong> This holds the context for the current task, like conversation history and recent actions. It's often managed within the LLM's context window.</li>
                                            <li><strong>Long-Term Memory:</strong> This stores information across sessions, such as user preferences, past successful workflows, or key facts. This is typically implemented using vector databases, which allow the agent to retrieve relevant memories based on semantic similarity.</li>
                                        </ul>
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">Tool Use: The Agent's Hands</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>An agent without tools is just a thinker, confined to its own internal knowledge. Tools are what allow an agent to perceive and act upon the external world. An agent's ability to seamlessly select, use, and interpret the output of these tools is what makes it so powerful.</p>
                                <p>A "tool" can be almost anything that provides a capability:</p>
                                 <ul className="my-6 space-y-4">
                                    <li><strong>Web Search:</strong> To get real-time, up-to-date information that isn't contained in the LLM's training data.</li>
                                    <li><strong>APIs (Application Programming Interfaces):</strong> To interact with other software and services in a structured way. This is the most common and reliable way for agents to perform actions like booking a flight, checking the weather, or posting to social media.</li>
                                    <li><strong>Code Execution:</strong> To run code (often Python) in a sandboxed environment. This allows the agent to perform complex calculations, data analysis, or file manipulation that would be impossible with text alone.</li>
                                    <li><strong>Web Browsing:</strong> To navigate and interact with websites that don't have APIs. This involves parsing HTML, identifying interactive elements, and simulating user actions like clicking buttons and filling out forms. This is a powerful but often brittle method.</li>
                                    <li><strong>Database Access:</strong> To query and retrieve information from private or enterprise databases, giving the agent access to specific, proprietary knowledge.</li>
                                </ul>
                                <p>The agent decides which tool to use based on the task at hand. For example, if asked "What's the weather in London?", the agent's reasoning process would be: "The user is asking for real-time information. I should use the Weather API tool."</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">Multi-Agent Systems: Teamwork Makes the Dream Work</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>Just as in human society, complex problems often require a team of specialists rather than a single generalist. In the Agentic Web, this means creating multi-agent systems where different agents with specialized skills collaborate to achieve a common goal.</p>
                                <p><strong>Example:</strong> A high-level "Vacation Planner" agent might act as the project manager. It would decompose the goal and delegate sub-tasks to a team of specialized agents:</p>
                                 <ul>
                                    <li>A <strong>"Flight Booker" agent</strong> that is an expert at finding the best flights and navigating airline APIs.</li>
                                    <li>A <strong>"Hotel Finder" agent</strong> that knows how to compare accommodations and considers user preferences for location and amenities.</li>
                                    <li>A <strong>"Local Activities" agent</strong> that can research and suggest things to do at the destination.</li>
                                    <li>A <strong>"Budget Manager" agent</strong> that tracks expenses and ensures the entire plan stays within the user's budget.</li>
                                </ul>
                                <p>This collaboration can be organized in different ways:</p>
                                 <ul>
                                    <li><strong>Hierarchical Architecture:</strong> A "manager" agent directs the workflow and assigns tasks to "worker" agents. This is a common and effective pattern.</li>
                                    <li><strong>Peer-to-Peer (Collaborative) Architecture:</strong> Agents work together as equals, debating solutions, sharing information, and arriving at a consensus. This is more complex but can be more robust for creative or open-ended problems.</li>
                                </ul>
                                <p>Multi-agent systems allow for a division of labor, making it possible to tackle incredibly complex, multi-domain problems that would be beyond the capability of any single agent.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                    <div className="flex items-center gap-4">
                        <div>
                           <Users className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 3</CardDescription>
                            <CardTitle className="text-2xl">The Three Dimensions of the Agentic Web</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">The Agentic Web isn't just one thing; it can be understood through three interconnected layers or dimensions. Each dimension builds on the one before it, showing how agents evolve from simple reasoners to active participants in a new digital economy.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">The Intelligence Dimension</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>This is the foundation. It's the agent's ability to think, plan, and learn. It encompasses the core cognitive abilities powered by LLMs, such as contextual understanding, long-horizon planning, and adapting based on feedback. This dimension is about making the agent smart.</p>
                                <p>Key capabilities in this dimension include:</p>
                                <ul>
                                    <li><strong>Contextual Understanding:</strong> Interpreting user requests, web content, and API responses within a given context.</li>
                                    <li><strong>Long-Horizon Planning:</strong> Devising and maintaining multi-step strategies to achieve complex goals over time.</li>
                                    <li><strong>Adaptive Learning:</strong> Improving performance by learning from successes and failures, and incorporating user feedback.</li>
                                </ul>
                                <p>Without a strong Intelligence Dimension, an agent is just a simple script, unable to handle ambiguity or recover from errors.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">The Interaction Dimension</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>This layer is about communication and coordination. If intelligence is what an agent thinks, interaction is how it communicates its thoughts and actions to the digital world. This dimension is about making agents capable of working with others.</p>
                                <p>It includes:</p>
                                <ul>
                                  <li><strong>Agent-to-Tool Communication:</strong> How does an agent reliably use any tool or API it encounters? This requires standardized protocols (like the <strong>Model Context Protocol or MCP</strong>) that allow an agent to discover a tool's capabilities and use it correctly without being pre-programmed for that specific tool.</li>
                                  <li><strong>Agent-to-Agent Communication:</strong> How do agents from different developers and platforms collaborate? This requires protocols (like <strong>A2A or Agent-to-Agent Protocol</strong>) that let agents negotiate, share information, and work together on a shared goal.</li>
                                  <li><strong>Agent-to-Human Communication:</strong> How does an agent communicate its progress, ask for clarification, and present results to the user in an understandable way?</li>
                                </ul>
                                <p>This dimension is creating the "HTTP for agents"-a universal language that will allow the entire ecosystem of agents and tools to connect and interoperate seamlessly.</p>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">The Economic Dimension</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>This is the most transformative and disruptive layer. Once agents can intelligently interact, they can exchange value. This dimension is about building new economies native to machines.</p>
                                <p>It includes several key shifts:</p>
                                <ul>
                                  <li><strong>Agent-as-User:</strong> Agents become the primary "users" of many online services. For example, a restaurant's booking system will be used more by automated agents than by humans.</li>
                                  <li><strong>The Agent Attention Economy:</strong> In Web 2.0, companies compete for human clicks and views. In the Agentic Web, services will compete to be chosen by agents. An agent selecting your API to book a flight becomes a valuable economic event, creating a new B2B (Business-to-Agent) marketplace.</li>
                                  <li><strong>Autonomous Transactions:</strong> Agents will be able to manage budgets, make purchases, negotiate prices, and even earn value on behalf of their users. This could lead to a world of micro-transactions and value exchange happening at a speed and scale impossible for humans to manage.</li>
                                </ul>
                                <p>The Economic Dimension moves the Agentic Web from a technical curiosity to a powerful new economic engine, fundamentally changing how digital value is created and distributed.</p>
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
                            <CardDescription>Module 4</CardDescription>
                            <CardTitle className="text-2xl">Applications: The Agentic Web in Action</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">The Agentic Web is not science fiction; it's being built today. This module explores the three main ways agents are currently being applied, showcasing how they are already changing our digital lives.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                         <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">Informational Agents: Your Personal Researcher</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>These agents are designed to autonomously find, synthesize, and analyze information. They go far beyond a simple web search, acting as tireless researchers that can work for hours or days on a complex query.</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  <strong>Example: A "Deep Research Agent."</strong> You could give it a high-level task like: "Create a comprehensive report on the current state of quantum computing. The report should cover the top research labs, recent breakthroughs in qubit stability, and the major technical and economic challenges to building a scalable quantum computer. Include a list of key companies and a summary of their approaches."
                                </blockquote>
                                <p>The agent would then:</p>
                                <ol>
                                    <li>Decompose the task into sub-queries.</li>
                                    <li>Search academic databases (like Arxiv), news articles, and company websites.</li>
                                    <li>Parse dozens or hundreds of documents, extracting key information.</li>
                                    <li>Synthesize the findings, identifying common themes and conflicting reports.</li>
                                    <li>Structure the information into a well-organized report, complete with summaries, tables, and citations.</li>
                                </ol>
                                <p>This turns hours or days of manual research into a single delegated task.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-lg text-left">Transactional Agents: Your Personal Assistant</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>These agents execute tasks and make transactions on your behalf. They are designed to interact with the web's services to get things done in the real world.</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  <strong>Example: A "Travel Agent."</strong> You tell it, "Book a round-trip flight to San Francisco for the first week of June. I need to arrive before Monday morning and leave after Friday afternoon. Find a 4-star hotel near the Moscone Center. My total budget for flight and hotel is $1500. I prefer flying with airlines where I have status."
                                </blockquote>
                                <p>The agent would then:</p>
                                <ol>
                                    <li>Access your calendar to confirm the exact dates.</li>
                                    <li>Query airline APIs, filtering by your preferences and budget.</li>
                                    <li>Simultaneously query hotel booking sites, checking for proximity and ratings.</li>
                                    <li>Compare different flight and hotel combinations to find the optimal package.</li>
                                    <li>Present you with the top 3 options for final approval.</li>
                                    <li>Once approved, use your stored payment information to complete the bookings and add the details to your calendar.</li>
                                </ol>
                                <p>This automates a complex, multi-step process that today requires significant manual effort and coordination.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-lg text-left">Communicational Agents: Your Digital Diplomat</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>These agents excel at coordinating with other agents to achieve a common goal. This is the foundation of complex, multi-agent systems and is where the Agentic Web becomes a truly interconnected network.</p>
                                <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4">
                                  <strong>Example: A "Supply Chain Automation System."</strong> In a manufacturing company, multiple agents work together to manage the supply chain.
                                </blockquote>
                                <ol>
                                    <li>A supplier's <strong>"Shipment Agent"</strong> detects a delay in raw materials and sends a standardized A2A message to its partners.</li>
                                    <li>The manufacturing company's <strong>"Logistics Agent"</strong> receives this message and automatically queries alternative shipping providers to find a faster route.</li>
                                    <li>Simultaneously, it communicates with the <strong>"Factory Agent"</strong> to adjust the production schedule to account for the potential delay, minimizing downtime.</li>
                                    <li>The "Factory Agent" then notifies the <strong>"Sales Agent"</strong> that the delivery date for a specific customer order might be at risk, allowing the sales team to proactively manage customer expectations.</li>
                                </ol>
                                <p>All of this happens autonomously, in real-time, without any direct human intervention. This kind of inter-agent communication and coordination can create vastly more efficient and resilient systems.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
                <CardHeader className="bg-secondary/30 p-6">
                     <div className="flex items-center gap-4">
                        <div>
                           <ShieldCheck className="w-6 h-6 text-muted-foreground"/>
                        </div>
                        <div>
                            <CardDescription>Module 5</CardDescription>
                            <CardTitle className="text-2xl">The Future: Challenges and Opportunities</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">The Agentic Web holds incredible promise, but it also presents significant challenges in security, ethics, and economics. This module explores the open questions we must solve to build a safe and prosperous agentic future.</p>
                     <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-lg text-left">Security and Trust: The Tool-Use Paradox</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                                <p>The very tools that give agents their power also create their biggest vulnerability. To be useful, an agent must trust its tools (like APIs and websites) to provide accurate information and execute actions correctly. But to be secure, it must assume any tool could be compromised at any time.</p>
                                <p>This creates the <strong>"Tool-Use Paradox."</strong> A malicious API could return false information to poison an agent's knowledge, or a compromised website could trick an agent into performing a harmful action.</p>
                                <p>Solving this requires several key innovations:</p>
                                <ul>
                                    <li><strong>"Zero-Trust" Agent Architecture:</strong> Agents must be designed with an inherent skepticism. Every piece of information received from an external tool should be validated against a security policy or cross-referenced with other sources before being fully trusted.</li>
                                    <li><strong>Robust Permissions and Sandboxing:</strong> Agents must operate in sandboxed environments with clearly defined permissions. An agent tasked with reading news should not have permission to access your email or make purchases.</li>
                                    <li><strong>Reputation Systems:</strong> Just as humans rely on reviews and reputation, agents will need decentralized reputation systems to assess the trustworthiness of other agents and tools they interact with.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="item-2">
                             <AccordionTrigger className="text-lg text-left">Human-Agent Alignment: Who's in Control?</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                               <p>How do we ensure that an autonomous agent truly understands and acts on our intentions, especially when our instructions are vague or our preferences change over time? This is the alignment problem, a central challenge in AI safety.</p>
                               <p>An agent might interpret "find me a cheap flight" in a way that leads to a terrible travel experience (e.g., multiple long layovers). Ensuring alignment requires building agents that can:</p>
                                <ul>
                                    <li><strong>Ask Clarifying Questions:</strong> To resolve ambiguity before taking action. A well-aligned agent, when given a vague goal, should respond with, "I can do that. What is more important to you: cost or travel time?"</li>
                                    <li><strong>Elicit Preferences:</strong> Help users discover what they really want. Many users don't have perfectly formed preferences. A good agent should be able to guide the user through a collaborative process to define their goals more clearly.</li>
                                    <li><strong>Enable Meaningful Oversight:</strong> Provide clear, intuitive ways for humans to monitor an agent's progress, understand its reasoning, intervene if necessary, and take back control at any moment. The user should always have a "stop button."</li>
                                </ul>
                                <p>Building this collaborative relationship, where the human provides strategic direction and the agent handles tactical execution, is key to making agentic systems both powerful and safe.</p>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                             <AccordionTrigger className="text-lg text-left">The New Economy: Beyond Advertising</AccordionTrigger>
                            <AccordionContent className="prose dark:prose-invert max-w-none text-base">
                               <p>The current internet is largely funded by advertising. This economic model is based on capturing and selling human attention. This model breaks down when the primary "users" of web services are no longer humans, but autonomous agents.</p>
                               <p>The Agentic Web will require new, machine-native business models. This presents both a massive challenge and a huge opportunity:</p>
                                <ul>
                                    <li><strong>Transactional Fees / Pay-per-Action:</strong> The most direct model. Instead of paying for ads, services will charge a small fee for each successful action an agent performs (e.g., a micro-payment for a successful booking or a successful API call).</li>
                                    <li><strong>Subscription Services:</strong> Users might pay a monthly fee for access to a powerful, specialized agent (e.g., a "Pro" subscription for a financial analysis agent).</li>
                                    <li><strong>Value-Based Pricing:</strong> Paying for the outcome. For example, a "Negotiation Agent" that saves you money on a large purchase could take a small percentage of the savings as its fee.</li>
                                    <li><strong>Agent-Targeted Advertising:</strong> A new form of advertising could emerge where tool providers pay to have their services ranked higher in an agent's consideration set. This "advertising" would be based on performance, reliability, and cost, not on emotional appeal.</li>
                                </ul>
                                <p>This transition represents a monumental shift away from the attention economy and toward a more direct and efficient "intention economy," where value is tied directly to the successful fulfillment of user goals.</p>
                            </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                </CardContent>
            </Card>

            <section id="faq" className="py-16">
                <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
                    <p className="mt-2 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your common questions about the Agentic Web, answered.
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