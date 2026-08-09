import { ReactNode } from 'react';
import Image from 'next/image';

interface PageHeroProps {
  /** Page title rendered as h1 */
  title: string | ReactNode;
  /** Optional subtitle rendered below the title */
  subtitle?: ReactNode;
  /** Show the author avatar (centered). Defaults to false. */
  showAvatar?: boolean;
  /** Optional children rendered below subtitle (e.g. social links, byline) */
  children?: ReactNode;
}

/**
 * Shared hero section used across all pages.
 * Ensures consistent top padding so navigating between pages
 * does not cause layout flicker.
 *
 * Padding: pt-12 md:pt-20 pb-8 (matches homepage baseline)
 */
export function PageHero({ title, subtitle, showAvatar = false, children }: PageHeroProps) {
  return (
    <section className="pt-12 md:pt-20 pb-8 text-center">
      {showAvatar && (
        <Image
          src="/images/icon.webp"
          alt="Vedang Vatsa"
          width={96}
          height={96}
          className="mx-auto h-24 w-24 rounded-full object-cover"
          priority
        />
      )}
      <h1 className={`text-4xl md:text-5xl font-semibold tracking-tight${showAvatar ? ' mt-5' : ''}`}>
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
      {children}
    </section>
  );
}
