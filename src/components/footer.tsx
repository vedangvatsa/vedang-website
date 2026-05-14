import { BookOpen, Instagram, Linkedin, Mail, Send, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8">
      <div className="container mx-auto flex flex-col items-center justify-center px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-muted-foreground mb-4">
          <Link href="/writings" className="hover:text-primary transition-colors">Writings</Link>
          <Link href="/#learn" className="hover:text-primary transition-colors">Resources</Link>
          <Link href="/glossary" className="hover:text-primary transition-colors">Glossary</Link>
          <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="https://x.com/vedangvatsa" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="https://linkedin.com/in/vedangvatsa" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="https://www.youtube.com/@vedangvatsa" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <Youtube className="h-5 w-5" />
          </Link>
          <Link href="https://www.instagram.com/vedangvatsa" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-5 w-5" />
          </Link>
          <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" aria-label="Google Scholar" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <BookOpen className="h-5 w-5" />
          </Link>
          <Link href="https://t.me/vedangvatsa" aria-label="Telegram" className="text-muted-foreground hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            <Send className="h-5 w-5" />
          </Link>
          <Link href="mailto:vedangvats@gmail.com" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
