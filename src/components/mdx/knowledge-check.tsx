'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface QuestionItem {
  q: string;
  a: string;
}

export function KnowledgeCheck({ questions }: { questions: QuestionItem[] }) {
  if (!questions || !Array.isArray(questions)) return null;
  
  return (
    <div className="not-prose my-8">
      <Accordion type="single" collapsible className="w-full">
        {questions.map((item, i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger className="text-lg text-left font-medium">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground border-l-4 border-primary/50 pl-4">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
