'use client';

import React, { useState } from 'react';
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

interface KnowledgeCheckProps {
  // Format A: array of Q&A pairs
  questions?: QuestionItem[];
  // Format B: single multiple-choice question
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
}

export function KnowledgeCheck({ questions, question, options, correctAnswerIndex, explanation }: KnowledgeCheckProps) {
  // Format A: accordion Q&A list
  if (questions && Array.isArray(questions) && questions.length > 0) {
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

  // Format B: single multiple-choice question
  if (question && options && correctAnswerIndex !== undefined) {
    return <MultipleChoice question={question} options={options} correctAnswerIndex={correctAnswerIndex} explanation={explanation} />;
  }

  return null;
}

function MultipleChoice({ question, options, correctAnswerIndex, explanation }: { question: string; options: string[]; correctAnswerIndex: number; explanation?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === correctAnswerIndex;

  return (
    <div className="not-prose my-8 p-6 rounded-xl border bg-card">
      <h4 className="font-semibold text-base mb-4">{question}</h4>
      <div className="space-y-2">
        {options.map((opt, i) => {
          const isThis = selected === i;
          const correct = i === correctAnswerIndex;
          let border = 'border-border';
          let bg = 'bg-background';
          if (selected !== null) {
            if (correct) { border = 'border-green-500'; bg = 'bg-green-500/5'; }
            else if (isThis && !correct) { border = 'border-red-500'; bg = 'bg-red-500/5'; }
          }
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={selected !== null}
              className={`w-full text-left p-3 rounded-lg border ${border} ${bg} text-sm transition-colors ${selected === null ? 'hover:border-primary/50 cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'}`}>
          <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Not quite.'}</p>
          {explanation && <p className="text-muted-foreground">{explanation}</p>}
        </div>
      )}
    </div>
  );
}
