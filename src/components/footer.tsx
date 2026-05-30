import { BookOpen, Instagram, Linkedin, Mail, Send, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/30 py-6">
      <div className="content-width">
        <div className="flex items-center justify-center gap-4 text-muted-foreground/50">
          <Link href="https://x.com/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-foreground transition-colors">
            <Twitter className="h-4 w-4" />
          </Link>
          <Link href="https://linkedin.com/in/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link href="https://www.youtube.com/@vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-foreground transition-colors">
            <Youtube className="h-4 w-4" />
          </Link>
          <Link href="https://www.instagram.com/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-foreground transition-colors">
            <Instagram className="h-4 w-4" />
          </Link>
          <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" className="hover:text-foreground transition-colors">
            <BookOpen className="h-4 w-4" />
          </Link>
          <Link href="https://t.me/vedangvatsa" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-foreground transition-colors">
            <Send className="h-4 w-4" />
          </Link>
          <Link href="mailto:vedangvats@gmail.com" aria-label="Email" className="hover:text-foreground transition-colors">
            <Mail className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
