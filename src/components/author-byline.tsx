import Link from 'next/link';

interface AuthorBylineProps {
  /** Optional extra links or labels shown after the author name, e.g. { label: 'GitHub', href: '...' } */
  links?: { label: string; href?: string }[];
}

export function AuthorByline({ links }: AuthorBylineProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Link href="/profile">
        <img
          src="/images/ved.png"
          alt="Vedang Vatsa"
          width={40}
          height={40}
          className="rounded-full"
        />
      </Link>
      <div className="flex items-center gap-0 text-sm">
        <Link
          href="/profile"
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
      </div>
    </div>
  );
}
