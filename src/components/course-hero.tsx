import Link from 'next/link';

interface CourseHeroProps {
  title: string;
  subtitle: string;
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
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/ved.png" alt="Vedang Vatsa" width={40} height={40} className="rounded-full" />
          </Link>
          <div className="flex items-center gap-0 text-sm">
            <Link href="/profile" className="font-medium text-foreground hover:text-primary transition-colors">Vedang Vatsa</Link>
          </div>
        </div>
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
