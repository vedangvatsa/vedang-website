
'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/30 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          veda.ng
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center space-x-2 sm:space-x-4 text-sm font-medium">
            <Link href="/writings" className="text-foreground transition-colors hover:text-primary px-2 py-1">
              Writings
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground transition-colors hover:text-primary px-2 py-1 text-sm font-medium outline-none">
                Courses <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/agentic-web">Agentic Web</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/vibe-coding">Vibe Coding</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/prompt-engineering-101">Prompt Engineering</Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/web3-101">Fundamentals of Web3</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/glossary">Glossary</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/swarm-prediction">Swarm Prediction</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground transition-colors hover:text-primary px-2 py-1 text-sm font-medium outline-none">
                About <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Full Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/media">Media & Speaking</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/seo">SEO & Growth</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/community">Content & Community</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

    