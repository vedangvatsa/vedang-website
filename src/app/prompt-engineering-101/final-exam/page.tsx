import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | Prompt Engineering 101',
  description: 'Test your knowledge and earn your Prompt Engineering 101 certificate.',
  alternates: { canonical: '/prompt-engineering-101/final-exam' },
};

export default function FinalExam() {
  return <FinalExamClient courseId="prompt-engineering-101" questions={examQuestions['prompt-engineering-101']} />;
}
