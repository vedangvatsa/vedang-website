import { Linkedin, Mail, Twitter, Send } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-6">
      <div className="w-full md:w-[61.8%] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground/60">
          <Link href="/writings" className="hover:text-foreground transition-colors">Writings</Link>
          <span>·</span>
          <Link href="/profile" className="hover:text-foreground transition-colors">About</Link>
          <span>·</span>
          <Link href="mailto:vedangvats@gmail.com" className="hover:text-foreground transition-colors">Contact</Link>
          <span>·</span>
          <Link href="/ai-discovery-standards" className="hover:text-foreground transition-colors">AI Discovery</Link>
          <span>·</span>
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-foreground transition-colors">
            <Twitter className="h-4 w-4" />
          </Link>
          <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-foreground transition-colors">
            <Send className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
