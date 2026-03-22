import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const recentPapers = [
  {
    title: 'Device-to-Device Economics and AI Agent Transactions',
    url: 'https://dx.doi.org/10.2139/ssrn.5660270',
  },
  {
    title: 'Stablecoin Growth and Market Dynamics',
    url: 'https://dx.doi.org/10.2139/ssrn.5325570',
  },
  {
    title: 'Stablecoins in the Modern Financial System',
    url: 'https://dx.doi.org/10.2139/ssrn.5329957',
  },
  {
    title: 'Global Stablecoin Regulations and Policies',
    url: 'https://dx.doi.org/10.2139/ssrn.5386707',
  },
  {
    title: 'Blockchain Ecosystem Evolution',
    url: 'https://dx.doi.org/10.2139/ssrn.5357534',
  },
  {
    title: "Estonia's e-gov and digital public service delivery solutions",
    url: 'https://ieeexplore.ieee.org/document/9515004',
  },
  {
    title: 'Analysis of Global Research Proceedings in AI',
    url: 'https://ieeexplore.ieee.org/document/9514979',
  },
  {
    title: 'Identification of Algorithmic Bias Through Policy Instruments',
    url: 'https://dx.doi.org/10.21474/IJAR01/11418',
  },
];

export function RecentPapers() {
  return (
    <section id="papers" className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-8 text-center text-2xl md:text-3xl font-semibold tracking-tight">Recent Papers</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentPapers.map((paper, index) => (
            <Link
              href={paper.url || '#'}
              key={index}
              className="group"
              target={paper.url ? '_blank' : undefined}
              rel={paper.url ? 'noopener noreferrer' : undefined}
            >
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-4 transition-colors duration-200 hover:border-primary/50">
                <p className="font-medium relative z-10">{paper.title}</p>
                <MoveUpRight className="h-4 w-4 self-end text-muted-foreground mt-4" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild className="min-w-64 px-8">
            <Link href="https://scholar.google.com/citations?user=aW2dd0IAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Read More on Google Scholar</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
