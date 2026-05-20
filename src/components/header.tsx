
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function MobileNavLink({ href, children, onClose }: { href: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <Link href={href} onClick={onClose} className="block py-2 text-sm text-foreground hover:text-primary transition-colors">
      {children}
    </Link>
  );
}

function MobileNavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
      <div className="pl-1">{children}</div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-background/30 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          veda.ng
        </Link>
        <div className="flex items-center justify-end gap-2 sm:gap-4 ml-auto">
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-4 text-[13px] sm:text-sm font-medium">
            <Link href="/writings" className="text-foreground transition-colors hover:text-primary px-1.5 py-1 sm:px-2">
              Writings
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground transition-colors hover:text-primary px-1.5 py-1 sm:px-2 text-[13px] sm:text-sm font-medium outline-none">
                Resources <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/ai-automation">AI Automation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mcp-development">MCP Development</Link>
                </DropdownMenuItem>
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
                  <Link href="/web3-101">Web3 Fundamentals</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/ai-discovery-standards">AI Discovery Standards</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/glossary">Glossary</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lit">LinkedIn Translator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/swarm-prediction">Swarm Prediction</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/health-protocols">Health Protocols</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-reports">AI Reports Library</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/web3-reports">Web3 Reports Library</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground transition-colors hover:text-primary px-1.5 py-1 sm:px-2 text-[13px] sm:text-sm font-medium outline-none">
                About <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Full Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/media">Media & Speaking</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 px-6 pt-8">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav className="flex flex-col">
                <MobileNavLink href="/writings" onClose={closeMobile}>Writings</MobileNavLink>
                <MobileNavLink href="/profile" onClose={closeMobile}>Profile</MobileNavLink>
                <MobileNavLink href="/media" onClose={closeMobile}>Media & Speaking</MobileNavLink>

                <Separator className="my-4" />

                <MobileNavSection title="Courses">
                  <MobileNavLink href="/ai-automation" onClose={closeMobile}>AI Automation</MobileNavLink>
                  <MobileNavLink href="/mcp-development" onClose={closeMobile}>MCP Development</MobileNavLink>
                  <MobileNavLink href="/agentic-web" onClose={closeMobile}>Agentic Web</MobileNavLink>
                  <MobileNavLink href="/vibe-coding" onClose={closeMobile}>Vibe Coding</MobileNavLink>
                  <MobileNavLink href="/prompt-engineering-101" onClose={closeMobile}>Prompt Engineering</MobileNavLink>
                  <MobileNavLink href="/web3-101" onClose={closeMobile}>Web3 Fundamentals</MobileNavLink>
                </MobileNavSection>

                <MobileNavSection title="Tools">
                  <MobileNavLink href="/glossary" onClose={closeMobile}>Glossary</MobileNavLink>
                  <MobileNavLink href="/lit" onClose={closeMobile}>LinkedIn Translator</MobileNavLink>
                  <MobileNavLink href="/swarm-prediction" onClose={closeMobile}>Swarm Prediction</MobileNavLink>
                  <MobileNavLink href="/ai-discovery-standards" onClose={closeMobile}>AI Discovery Standards</MobileNavLink>
                </MobileNavSection>

                <MobileNavSection title="Libraries">
                  <MobileNavLink href="/ai-reports" onClose={closeMobile}>AI Reports</MobileNavLink>
                  <MobileNavLink href="/web3-reports" onClose={closeMobile}>Web3 Reports</MobileNavLink>
                  <MobileNavLink href="/health-protocols" onClose={closeMobile}>Health Protocols</MobileNavLink>
                </MobileNavSection>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
    