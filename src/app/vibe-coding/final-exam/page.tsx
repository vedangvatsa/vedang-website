import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | Vibe Coding 101',
  description: 'Test your knowledge and earn your Vibe Coding 101 certificate.',
  alternates: { canonical: '/vibe-coding/final-exam' },
};

export default function VibeCodingFinalExam() {
  return <FinalExamClient courseId="vibe-coding" questions={examQuestions['vibe-coding']} />;
}
