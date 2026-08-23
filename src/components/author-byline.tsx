import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

interface AuthorBylineProps {
  /** Optional extra links or labels shown after the author name, e.g. { label: 'GitHub', href: '...' } */
  links?: { label: string; href?: string }[];
  /** Show X and LinkedIn icons after the name */
  socials?: boolean;
}

export function AuthorByline({ links, socials = false }: AuthorBylineProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Link href="/about">
        <img
          src="/images/ved.png"
          alt="Vedang Vatsa"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </Link>
      <div className="flex items-center gap-0 text-sm">
        <Link
          href="/about"
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          Vedang Vatsa
        </Link>
        {links?.map((link) => (
          <span key={link.label}>
            <span className="mx-2 text-muted-foreground">|</span>
            {link.href ? (
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{link.label}</span>
            )}
          </span>
        ))}
        {socials && (
          <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
            <Link
              href="https://x.com/vedangvatsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="p-1.5 hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </Link>
            <Link
              href="https://linkedin.com/in/vedangvatsa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-1.5 hover:text-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
