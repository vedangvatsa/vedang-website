import { PageLayout } from '@/components/page-layout';
import { PageHero } from '@/components/page-hero';
import { Metadata } from 'next';
import { pageMetadata, generateMetadata } from '@/lib/metadata';
import { CalEmbed } from '@/components/cal-embed';
import Link from 'next/link';
import { Linkedin, Twitter, Mail, FileText, GraduationCap, Users, Mic } from 'lucide-react';

export const metadata: Metadata = generateMetadata({
  title: pageMetadata.meeting.title,
  description: pageMetadata.meeting.description,
  url: pageMetadata.meeting.url,
  ogImageAlt: 'Book a meeting with Vedang Vatsa',
});

const credentials = [
  { icon: GraduationCap, text: 'IIT Kanpur alumnus, Fellow of the Royal Society of Arts (FRSA)' },
  { icon: Users, text: 'Founder of Hashtag Web3 (120,000+ member community)' },
  { icon: FileText, text: '22 published research papers, 40+ essays on AI and Web3' },
  { icon: Mic, text: 'Speaker at 50+ conferences across 15 countries' },
];

export default function MeetingPage() {
  return (
    <PageLayout>
      <PageHero
        title="Book a Meeting"
        subtitle="Schedule a 1:1 conversation with Vedang Vatsa."
        showAvatar
      />

      {/* Bio + credentials */}
      <section className="pb-10 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/60">
              <item.icon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Available for AI strategy consulting, Web3 advisory, speaking engagements, podcast appearances, research collaboration, and partnerships. If you have a specific topic in mind, mention it in the booking notes.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Full profile
          </Link>
          <Link href="/writings" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Essays
          </Link>
          <Link href="/media" className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
            Media
          </Link>
          <span className="text-border">|</span>
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </Link>
          <Link href="mailto:vedangvatsa.2019@iitkalumni.org" className="text-muted-foreground hover:text-[#EA4335] transition-colors" aria-label="Email">
            <Mail className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Calendar embed */}
      <section className="pb-16">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Select a Time</h2>
        <CalEmbed calLink="vedangvatsa" />
      </section>
    </PageLayout>
  );
}
