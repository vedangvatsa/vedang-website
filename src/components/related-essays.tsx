
import Link from 'next/link';
import { essays } from '@/lib/essays';

// AI-related topic keywords for intelligent linking
const AI_TOPICS = {
  'asi': ['intuition', 'simulation', 'governance', 'rationality'],
  'intuition': ['asi', 'rationality', 'agenteconomy'],
  'simulation': ['asi', 'intuition'],
  'agenteconomy': ['intuition', 'attention', 'trust'],
  'constitutions': ['apis', 'governance', 'trust'],
  'apis': ['constitutions', 'governance'],
  'socialscience': ['intuition', 'rationality', 'agenteconomy'],
  'governance': ['asi', 'constitutions', 'apis'],
  'trust': ['constitutions', 'apis', 'agenteconomy'],
  'rationality': ['intuition', 'asi', 'socialscience'],
  'ambient': ['intuition', 'agenteconomy', 'empathy'],
  'empathy': ['ambient', 'intuition'],
  'attention': ['agenteconomy', 'cognition'],
  'cognition': ['attention', 'monasticism'],
  'outlives': ['empathy', 'liminal', 'lawsuits'],
  'agentspeak': ['agenticweb', 'postinterface', 'darkforest'],
  'private': ['trust', 'godprotocol', 'darkforest'],
  'neocloud': ['aidebt', 'compute', 'agentstack'],
  'receipts': ['aieconomy', 'agentcommerce', 'agenteconomy'],
};

export function RelatedEssays({ currentSlug }: { currentSlug: string }) {
  // Do not show related essays at the bottom of legal pages
  if (currentSlug === 'privacy' || currentSlug === 'terms') {
    return null;
  }

  // Get related essays based on topic mapping, fallback to recent essays
  const relatedSlugs = AI_TOPICS[currentSlug as keyof typeof AI_TOPICS] || [];
  
  let relatedEssays = essays
    .filter(essay => essay.slug !== currentSlug && relatedSlugs.includes(essay.slug))
    .slice(0, 3);

  // If not enough related essays, fill with recent essays
  if (relatedEssays.length < 3) {
    const otherEssays = essays
      .filter(essay => 
        essay.slug !== currentSlug && 
        !relatedSlugs.includes(essay.slug) &&
        essay.slug !== 'privacy' &&
        essay.slug !== 'terms'
      )
      .slice(0, 3 - relatedEssays.length);
    relatedEssays = [...relatedEssays, ...otherEssays];
  }

  if (relatedEssays.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
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
