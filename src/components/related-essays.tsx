
import Link from 'next/link';
import { essays } from '@/lib/essays';

// AI-related topic keywords for intelligent linking
const AI_TOPICS = {
  'asi-timeline': ['artificial-intuition', 'simulation-hypothesis', 'agi-governance', 'rationality-in-ai'],
  'artificial-intuition': ['asi-timeline', 'rationality-in-ai', 'ai-agent-economy'],
  'simulation-hypothesis': ['asi-timeline', 'artificial-intuition'],
  'ai-agent-economy': ['artificial-intuition', 'attention-refinery', 'programmable-trust'],
  'computational-constitutions': ['api-states', 'agi-governance', 'programmable-trust'],
  'api-states': ['computational-constitutions', 'agi-governance'],
  'computational-social-science': ['artificial-intuition', 'rationality-in-ai', 'ai-agent-economy'],
  'agi-governance': ['asi-timeline', 'computational-constitutions', 'api-states'],
  'programmable-trust': ['computational-constitutions', 'api-states', 'ai-agent-economy'],
  'rationality-in-ai': ['artificial-intuition', 'asi-timeline', 'computational-social-science'],
  'ambient-intelligence': ['artificial-intuition', 'ai-agent-economy', 'synthetic-empathy'],
  'synthetic-empathy': ['ambient-intelligence', 'artificial-intuition'],
  'attention-refinery': ['ai-agent-economy', 'cognitive-load'],
  'cognitive-load': ['attention-refinery', 'digital-monasticism'],
};

export function RelatedEssays({ currentSlug }: { currentSlug: string }) {
  // Get related essays based on topic mapping, fallback to recent essays
  const relatedSlugs = AI_TOPICS[currentSlug as keyof typeof AI_TOPICS] || [];
  
  let relatedEssays = essays
    .filter(essay => essay.slug !== currentSlug && relatedSlugs.includes(essay.slug))
    .slice(0, 3);

  // If not enough related essays, fill with recent essays
  if (relatedEssays.length < 3) {
    const otherEssays = essays
      .filter(essay => essay.slug !== currentSlug && !relatedSlugs.includes(essay.slug))
      .slice(0, 3 - relatedEssays.length);
    relatedEssays = [...relatedEssays, ...otherEssays];
  }

  if (relatedEssays.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold tracking-tight mb-6">Related Essays</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedEssays.map((essay) => (
          <Link
            key={essay.slug}
            href={essay.url}
            className="group block rounded-lg border bg-card p-4 transition-colors duration-200 hover:border-primary/50"
          >
            <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-primary">
              {essay.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{essay.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
