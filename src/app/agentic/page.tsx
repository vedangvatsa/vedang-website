
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
            { name: 'A2A Protocol (Google)', url: 'https://google.github.io/A2A/' },
            { name: 'A2A Spec on GitHub', url: 'https://github.com/google/A2A' },
        ],
    },
    {
        name: 'Agent Frameworks',
        links: [
            { name: 'LangGraph Docs', url: 'https://langchain-ai.github.io/langgraph/' },
            { name: 'CrewAI Docs', url: 'https://docs.crewai.com' },
            { name: 'Google Agent Development Kit', url: 'https://google.github.io/adk-docs/' },
            { name: 'AutoGen (Microsoft)', url: 'https://microsoft.github.io/autogen/' },
            { name: 'OpenAI Agents SDK', url: 'https://openai.github.io/openai-agents-python/' },
            { name: 'Pydantic AI', url: 'https://ai.pydantic.dev' },
            { name: 'Smolagents (HuggingFace)', url: 'https://huggingface.co/docs/smolagents' },
            { name: 'Agno', url: 'https://docs.agno.com' },
        ],
    },
    {
        name: 'Agent Products',
        links: [
            { name: 'ChatGPT Operator', url: 'https://openai.com/index/introducing-operator/' },
            { name: 'Google Project Mariner', url: 'https://deepmind.google/technologies/project-mariner/' },
            { name: 'Jules (Google)', url: 'https://jules.google' },
            { name: 'Devin (Cognition AI)', url: 'https://devin.ai' },
            { name: 'Genspark Super Agent', url: 'https://www.genspark.ai' },
            { name: 'Perplexity AI', url: 'https://www.perplexity.ai' },
        ],
    },
    {
        name: 'Further Reading',
        links: [
            { name: 'Google Cloud: What are AI Agents?', url: 'https://cloud.google.com/discover/what-are-ai-agents' },
            { name: 'Anthropic: Building Effective Agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
            { name: 'OpenAI: Practical Guide to Agents', url: 'https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf' },
            { name: "Lilian Weng: LLM-Powered Agents", url: 'https://lilianweng.github.io/posts/2023-06-23-agent/' },
        ],
    },
];

const curriculumItems = [
    {
        href: '/agentic/module-1-core-idea',
        title: '1. The Core Idea: From Information Web to Action Web',
        description: 'Understand the shift from a human-driven web to an agent-driven one.',
    },
    {
        href: '/agentic/module-2-components',
        title: '2. The Core Components of Agentic Systems',
        description: 'Explore the building blocks that enable agents to function.',
    },
    {
        href: '/agentic/module-3-dimensions',
        title: '3. The Three Dimensions of the Agentic Web',
        description: 'Understand Intelligence, Interaction, and the Economic dimensions.',
    },
    {
        href: '/agentic/module-4-applications',
        title: '4. Applications: The Agentic Web in Action',
        description: 'Discover informational, transactional, and communicational agents.',
    },
    {
        href: '/agentic/module-5-future',
        title: '5. The Future: Challenges and Opportunities',
        description: 'Explore the security, ethics, and economics of the agentic future.',
    },
    {
        href: '/agentic/module-6-protocols',
        title: '6. Protocols: MCP & A2A',
        description: 'The standardized languages that let agents connect to tools and each other.',
    },
    {
        href: '/agentic/module-7-build-agent',
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
    question: "What are MCP and A2A, and why do they matter?",
    answer: "MCP (Model Context Protocol) and A2A (Agent-to-Agent Protocol) are two open standards that define how agents interact with the world. MCP, created by Anthropic, is a universal connector that lets any agent use any tool through a single standard interface. A2A, created by Google, lets agents from different vendors discover and communicate with each other. Together, they are doing for agents what HTTP did for the web."
  },
  {
    question: "Is this secure? What are the risks?",
    answer: "This is one of the most critical challenges. Security and alignment are key. An agent with access to your digital life could be misused if not properly constrained. Module 5 of this course is dedicated to these challenges, discussing the need for strict permissions, monitoring, and ensuring agents act ethically and in your best interest."
  },
  {
    question: "How can I build my first AI agent?",
    answer: "The fastest way to start is with a framework like Google's Agent Development Kit (ADK), LangGraph, or CrewAI. These frameworks handle the complex plumbing, so you can focus on defining your agent's goal, tools, and behavior. Many have getting-started tutorials that let you build a simple research or coding agent in under an hour. You will need basic Python knowledge."
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
  url: 'https://veda.ng/agentic',
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CourseHero
        title="The Agentic Web"
        subtitle={<>How autonomous AI agents are turning the web from a place you browse<br />into a platform that acts on your behalf.</>}
        youtubeUrl="https://www.youtube.com/embed/Gqgk25SOIMM"
      />

      <CurriculumSection
        description="Seven modules to understand the Agentic Web."
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