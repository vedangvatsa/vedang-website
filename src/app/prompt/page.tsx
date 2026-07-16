import { CourseHero } from '@/components/course-hero';
import { CurriculumSection } from '@/components/curriculum-section';
import { CourseFAQ } from '@/components/course-faq';
import { CourseReferences } from '@/components/course-references';

import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.promptEngineering.title,
  description: pageMetadata.promptEngineering.description,
  url: pageMetadata.promptEngineering.url,
  ogImageAlt: 'Prompt Engineering Course - Master AI Interactions',
});

const curriculumItems = [
  {
    href: '/prompt/module-1-core-idea',
    title: '1. The Core Idea: Guiding the Prediction Engine',
    description: 'Understand LLMs as prediction engines and learn essential configurations.',
  },
  {
    href: '/prompt/module-2-core-techniques',
    title: '2. Core Prompting Techniques',
    description: 'Master Zero-Shot, Few-Shot, Role, System, and Structured prompting.',
  },
  {
    href: '/prompt/module-3-advanced-reasoning',
    title: '3. Advanced Reasoning Techniques',
    description: 'Chain of Thought, Tree of Thoughts, Self-Consistency, ReAct, and Multimodal Prompting.',
  },
  {
    href: '/prompt/module-4-code-prompting',
    title: '4. Code Prompting: Your AI Pair Programmer',
    description: 'Use LLMs to write, explain, translate, and debug code effectively.',
  },
  {
    href: '/prompt/module-5-best-practices',
    title: '5. Best Practices for Expert Prompting',
    description: 'Learn to iterate, provide clarity, and defend against prompt injections.',
  },
  {
    href: '/prompt/module-6-rag-functions',
    title: '6. RAG & Function Calling',
    description: 'Connect LLMs to your own data with embeddings, vector databases, and tool use.',
  },
  {
    href: '/prompt/module-7-chaining-agents',
    title: '7. Prompt Chaining & Agents',
    description: 'Orchestrate multi-step workflows and build autonomous agent systems.',
  },
];

const referenceLinks = [
  {
    name: 'Starting Guides',
    links: [
      { name: 'DAIR.AI Prompt Engineering Guide', url: 'https://github.com/dair-ai/Prompt-Engineering-Guide' },
      { name: 'LearnPrompting.org', url: 'https://learnprompting.org/docs/introduction' },
      { name: 'OpenAI Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { name: 'Google Prompt Engineering Guide', url: 'https://developers.google.com/machine-learning/resources/prompt-eng' },
    ],
  },
  {
    name: 'Courses',
    links: [
      { name: 'DeepLearning.AI + OpenAI', url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/' },
      { name: 'Vanderbilt on Coursera', url: 'https://www.coursera.org/learn/prompt-engineering' },
      { name: 'Analytics Vidhya (Free List)', url: 'https://www.analyticsvidhya.com/blog/2024/03/free-chatgpt-prompt-engineering-courses-and-resources/' },
    ],
  },
  {
    name: 'Academic Papers',
    links: [
      { name: 'Systematic Survey of PE (2024)', url: 'https://arxiv.org/abs/2402.07927' },
      { name: 'The Prompt Canvas (2024)', url: 'https://arxiv.org/abs/2412.05127' },
      { name: 'PE Methods for NLP Tasks (2024)', url: 'https://arxiv.org/abs/2407.12994' },
    ],
  },
  {
    name: 'Blogs & Resources',
    links: [
      { name: 'cognativ.com', url: 'https://www.cognativ.com/blogs/post/ai-prompt-engineering-techniques-and-strategies-for-success/509' },
      { name: 'Medium: Top 10 Practices', url: 'https://medium.com/waits-on-prompt-engineering/prompt-engineering-1-top-10-best-prompting-practices-for-llms-4ffa0449c005' },
      { name: 'The Generative Programmer', url: 'https://generativeprogrammer.com/p/must-read-free-ai-resources' },
    ],
  },
];

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
  url: 'https://veda.ng/prompt',
  provider: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  isAccessibleForFree: true,
  educationalLevel: 'Beginner',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    instructor: { '@type': 'Person', name: 'Vedang Vatsa', url: 'https://veda.ng' },
  },
  teaches: [
    'Zero-shot and few-shot prompting',
    'Role and system prompting',
    'Chain of Thought reasoning',
    'Self-consistency and ReAct',
    'Code prompting and debugging',
    'RAG and function calling',
    'Prompt chaining and agents',
  ],
  timeRequired: 'PT6H',
  coursePrerequisites: 'None. Familiarity with LLMs helpful but not required.',
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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <CourseHero
        title="Prompt Engineering"
        subtitle={<>Write prompts that get results.<br />Techniques for clear, structured communication with any LLM.</>}
      />

      <CurriculumSection
        description="Seven modules to write effective prompts for AI models."
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