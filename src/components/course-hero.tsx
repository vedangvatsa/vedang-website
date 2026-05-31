import { ReactNode } from 'react';
import { AuthorByline } from '@/components/author-byline';

interface CourseHeroProps {
  title: string;
  subtitle: ReactNode;
  youtubeUrl?: string;
  youtubeMaxWidth?: string;
}

export function CourseHero({ title, subtitle, youtubeUrl, youtubeMaxWidth = 'max-w-3xl' }: CourseHeroProps) {
  return (
    <section className="text-center pt-16 pb-12">
      <div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
          {title}
        </h1>
        <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <AuthorByline />
        {youtubeUrl && (
          <div className={`mt-8 aspect-video rounded-lg overflow-hidden shadow-2xl border ${youtubeMaxWidth} mx-auto`}>
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
