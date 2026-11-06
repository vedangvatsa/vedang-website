'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoveUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TwitterEmbed } from '@/components/twitter-embed';

interface ParliamentCalloutProps {
  tweetId?: string;
  className?: string;
}

export function ParliamentCallout({
  tweetId = '1996239975906676795',
  className = '',
}: ParliamentCalloutProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg text-foreground">
            Parliament of India Consultation
          </h3>
          <p className="text-sm text-muted-foreground leading-snug">
            Invited to discuss Virtual Digital Assets and Web3 Policy with the Parliamentary Standing Committee on Finance (Lok Sabha).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmbed(!showEmbed)}
            className="text-xs h-8 gap-1"
            aria-expanded={showEmbed}
          >
            <span>{showEmbed ? 'Hide Tweet' : 'Preview Tweet'}</span>
            {showEmbed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>

          <Button variant="outline" size="sm" asChild className="text-xs h-8 gap-1">
            <Link
              href={`https://x.com/vedangvatsa/status/${tweetId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on X</span>
              <MoveUpRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>

      {showEmbed && (
        <div className="px-4 pb-5 pt-1 max-w-xl mx-auto border-t">
          <TwitterEmbed tweetId={tweetId} />
        </div>
      )}
    </Card>
  );
}
