import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_URL } from '@/lib/site';

export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export const CONTACT_INTRO =
  'Vedang Vatsa is available for AI strategy and Web3 advisory calls, speaking engagements, podcast interviews, research collaboration, and press requests. The fastest way to reach him is to book a slot on the calendar on this page. Email works too, and every message gets a reply within a few business days.';

export const CONTACT_SECTIONS: ContentSection[] = [
  {
    heading: 'Direct email',
    paragraphs: [
      `For speaking invitations, advisory work, research questions, corrections to any essay, or partnership inquiries, email ${CONTACT_EMAIL}. Include the word "speaking", "advisory", or "press" in the subject line so it routes faster.`,
    ],
  },
  {
    heading: 'Book a call',
    paragraphs: [
      'Use the calendar above to reserve a 1:1 slot. Slots cover AI strategy reviews, Web3 product feedback, career conversations, and media interviews. If no slot fits your timezone, email and one will be arranged.',
    ],
  },
  {
    heading: 'Elsewhere',
    paragraphs: [
      'Active on X as @vedangvatsa and on LinkedIn at linkedin.com/in/vedangvatsa. Long-form video lives on the YouTube channel @vedangvatsa. Research indexing sits on Google Scholar.',
    ],
  },
];

export const PRIVACY_INTRO =
  `This policy explains what happens to data when you use ${SITE_URL}. Short version: the site has no accounts, stores no personal profiles, and runs two third-party analytics scripts plus an embedded booking calendar. This page describes each one so you can decide with full information.`;

export const PRIVACY_SECTIONS: ContentSection[] = [
  {
    heading: 'What the site is',
    paragraphs: [
      `${SITE_URL} publishes essays, free courses, a glossary, and research libraries written by Vedang Vatsa. All published content is public by design. There are no comment threads, no forums, no newsletters stored on this site, and no visitor accounts of any kind.`,
    ],
  },
  {
    heading: 'Analytics',
    paragraphs: [
      'Two analytics tools run on every page: Google Analytics 4 and Microsoft Clarity. Google Analytics records page views, referrers, device class, and country. Microsoft Clarity records anonymized interaction patterns such as scroll depth and cursor movement for usability analysis. Clarity masks form inputs and never captures passwords. Neither tool receives your name unless your browser already exposes it to the page.',
    ],
  },
  {
    heading: 'Booking a meeting',
    paragraphs: [
      'When you book a call through the embedded Cal.com scheduler on /contact, the booking details you type (name, email, notes) go to Cal.com as the processor and to Vedang Vatsa as the recipient. They are used only to run the scheduled conversation and are not added to any marketing list.',
    ],
  },
  {
    heading: 'Email',
    paragraphs: [
      `Messages sent to ${CONTACT_EMAIL} live in the Gmail mailbox of the recipient. Replies stay in that thread. Nothing from that mailbox is published without explicit permission.`,
    ],
  },
  {
    heading: 'Machine-readable endpoints',
    paragraphs: [
      'Crawlers and AI agents can fetch llms.txt, llms-full.txt, feed.xml, sitemap.xml, and the MCP endpoint at /.well-known/mcp. These endpoints serve public content only and set no cookies. Sending Accept: text/markdown on a normal page URL returns the same content as Markdown.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      'You can block both analytics tools with any standard tracker blocker or browser tracking protection. You can browse the entire site with JavaScript disabled except the booking calendar and interactive course visualizers. For any question about this policy, email ' + CONTACT_EMAIL + '. Policy last reviewed August 2026.',
    ],
  },
];

export const PROFILE_SUMMARY = {
  heading: 'About Vedang Vatsa',
  paragraphs: [
    'Vedang Vatsa FRSA is the founder of Hashtag Web3, a community of more than 120,000 AI and Web3 professionals, and of CVinBio. He is a computer engineer with an MBA, a Chartered Engineer, and a Fellow of the Royal Society of Arts. He was named Young Researcher 2020 with 25 publications and won the Young Achiever 2020-21 award.',
    'He writes data-driven essays on AI agents, AI policy, and Web3 infrastructure, teaches six free courses including Vibe Coding 101 and MCP Development 101, and maintains a glossary of more than 100 technical terms. His peer-reviewed work covers stablecoins, blockchain ecosystems, and digital governance, with papers in SSRN and IEEE venues.',
    `Full profile: ${SITE_URL}/about. Speaking history: ${SITE_URL}/media. Book a conversation: ${SITE_URL}/contact.`,
  ],
};

export function sectionsToMarkdown(intro: string, sections: ContentSection[]): string {
  const body = sections.map((s) => `## ${s.heading}\n\n${s.paragraphs.join('\n\n')}`).join('\n\n');
  return `${intro}\n\n${body}`;
}
