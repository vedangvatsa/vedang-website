
import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

const referenceLinks = [
    {
        name: 'Protocols and Standards',
        links: [
            { name: 'Model Context Protocol (MCP)', url: 'https://modelcontextprotocol.io' },
        ],
    },
    {
        name: 'Agent Frameworks',
        links: [
            { name: 'LangGraph Docs', url: 'https://langchain-ai.github.io/langgraph/' },
            { name: 'CrewAI Docs', url: 'https://docs.crewai.com' },
            { name: 'Google Agent Development Kit', url: 'https://google.github.io/adk-docs/' },
            { name: 'AutoGen (Microsoft)', url: 'https://microsoft.github.io/autogen/' },
        ],
    },
    {
        name: 'Agent Products',
        links: [
            { name: 'ChatGPT Operator', url: 'https://openai.com/index/introducing-operator/' },
            { name: 'Google Project Mariner', url: 'https://deepmind.google/technologies/project-mariner/' },
            { name: 'Genspark Super Agent', url: 'https://www.genspark.ai' },
        ],
    },
    {
        name: 'Further Reading',
        links: [
            { name: 'Google Cloud: What are AI Agents?', url: 'https://cloud.google.com/discover/what-are-ai-agents' },
            { name: 'Anthropic: Building Effective Agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
        ],
    },
];

const curriculumItems = [
    {
        href: '/agentic-web/module-1-core-idea',
        title: '1. The Core Idea: From Information Web to Action Web',
        description: 'Understand the shift from a human-driven web to an agent-driven one.',
    },
    {
        href: '/agentic-web/module-2-components',
        title: '2. The Core Components of Agentic Systems',
        description: 'Explore the building blocks that enable agents to function.',
    },
    {
        href: '/agentic-web/module-3-dimensions',
        title: '3. The Three Dimensions of the Agentic Web',
        description: 'Understand Intelligence, Interaction, and the Economic dimensions.',
    },
    {
        href: '/agentic-web/module-4-applications',
        title: '4. Applications: The Agentic Web in Action',
        description: 'Discover informational, transactional, and communicational agents.',
    },
    {
        href: '/agentic-web/module-5-future',
        title: '5. The Future: Challenges and Opportunities',
        description: 'Explore the security, ethics, and economics of the agentic future.',
    },
    {
        href: '/agentic-web/module-6-protocols',
        title: '6. Protocols Deep Dive: MCP & A2A',
        description: 'The standardized languages that let agents connect to tools and each other.',
    },
    {
        href: '/agentic-web/module-7-build-agent',
        title: '7. Build Your First Agent',
        description: 'A practical guide from design document to testing and deployment.',
    },
];

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.agenticWeb.title,
  description: pageMetadata.agenticWeb.description,
  url: pageMetadata.agenticWeb.url,

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
    answer: "This is one of the most critical challenges. Security and alignment are key. An agent with access to your digital life could be misused if not properly constrained. Module 5 of this course is dedicated to these challenges, discussing the need for strict permissions, monitoring, and ensuring agents act ethically and in your best interest."
  },
  {
    question: "Do I need to be a programmer to understand the Agentic Web?",
    answer: "Not at all. This course is designed for a broad audience. The concepts are explained in a way that is accessible to everyone, regardless of technical background. It's more about understanding this fundamental shift, similar to how one might learn about the social media revolution without needing to code."
  },
  {
    question: "What are MCP and A2A, and why do they matter?",
    answer: "MCP (Model Context Protocol) and A2A (Agent-to-Agent Protocol) are two open standards that define how agents interact with the world. MCP, created by Anthropic, is a universal connector that lets any agent use any tool through a single standard interface. A2A, created by Google, lets agents from different vendors discover and communicate with each other. Together, they are doing for agents what HTTP did for the web."
  },
  {
    question: "How can I build my first AI agent?",
    answer: "The fastest way to start is with a framework like Google's Agent Development Kit (ADK), LangGraph, or CrewAI. These frameworks handle the complex plumbing, so you can focus on defining your agent's goal, tools, and behavior. Many have getting-started tutorials that let you build a simple research or coding agent in under an hour. You will need basic Python knowledge."
  },
  {
    question: "What happens to my data when I use an AI agent?",
    answer: "This depends on the provider and how the agent is built. Cloud-based agents from OpenAI or Google process data on their servers, subject to their privacy policies. Open-source frameworks let you run agents locally for maximum privacy. The best practice is to give agents the minimum permissions necessary for the task, use sandboxed environments, and never give a single agent access to everything in your digital life."
  },
  {
    question: "Can agents communicate with each other across companies?",
    answer: "Yes, and this is exactly what the A2A protocol enables. Before A2A, an agent built with one vendor's tools could not easily work with an agent from another vendor. A2A creates a common language, Agent Cards, that lets agents discover each other's capabilities and collaborate, regardless of who built them. This interoperability is what will enable the true potential of multi-agent workflows across organizations."
  },
];

const videoSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'The Agentic Web - Introduction',
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <CourseHero
          title="The Agentic Web"
          subtitle="The internet is evolving. It's no longer just a place to find information-it's becoming a platform for autonomous AI agents to get things done. This course demystifies the Agentic Web, where you delegate goals, and AI handles the execution."
          prerequisite="Curiosity"
          startHref="/agentic-web/what-is-agentic-web"
          youtubeUrl="https://www.youtube.com/embed/Gqgk25SOIMM"
          youtubeMaxWidth="max-w-3xl"
        />

        <div className="py-16 space-y-12">
            
        <CurriculumSection
          description="Seven modules to understand the Agentic Web."
          items={curriculumItems}
        />

            <CourseReferences
              subtitle="Protocols, frameworks, and platforms for exploring the Agentic Web."
              categories={referenceLinks}
              layout="columns"
              align="center"
            />

            <CourseFAQ
              subtitle="Your common questions about the Agentic Web, answered."
              items={faqItems}
            />
        </div>
    </>
  );
}