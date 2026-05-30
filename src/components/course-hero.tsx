import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseHeroProps {
  title: string;
  subtitle: string;
  prerequisite: string;
  startHref: string;
  align?: 'center' | 'left';
  youtubeUrl?: string;
  youtubeMaxWidth?: string; // e.g. 'max-w-3xl' or 'max-w-4xl'
}

export function CourseHero({ title, subtitle, prerequisite, startHref, align = 'center', youtubeUrl, youtubeMaxWidth = 'max-w-3xl' }: CourseHeroProps) {
  const isCenter = align === 'center';
  return (
    <section className={`${isCenter ? 'text-center' : 'text-left'} pt-16 pb-12`}>
      <div>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">{title}</h1>
        <p className={`mt-4 text-base md:text-lg text-muted-foreground max-w-3xl ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
        <div className={`mt-8 flex ${isCenter ? 'justify-center' : 'justify-start'} items-center gap-4`}>
          <Badge variant="outline">By: Vedang Vatsa</Badge>
          <Badge variant="outline">Prerequisite: {prerequisite}</Badge>
        </div>
        <div className={`mt-8 flex ${isCenter ? 'justify-center' : 'justify-start'}`}>
          <Button asChild size="lg" className="px-8">
            <Link href={startHref}>
              Start Course <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
        {youtubeUrl && (
          <div className={`mt-8 aspect-video rounded-lg overflow-hidden shadow-2xl border ${youtubeMaxWidth} ${isCenter ? 'mx-auto' : ''}`}>
            <iframe
              className="w-full h-full"
              src={youtubeUrl}
              title="Course Introduction"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
