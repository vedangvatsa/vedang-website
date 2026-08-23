import { ReactNode } from 'react';

interface ContentSectionProps {
  heading: string;
  children: ReactNode;
}

export function ContentSection({ heading, children }: ContentSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">{heading}</h2>
      {children}
    </section>
  );
}

export function SectionParagraph({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground leading-relaxed mb-3">{children}</p>;
}
