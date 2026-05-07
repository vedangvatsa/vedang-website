import { FinalExamClient } from '@/components/final-exam-client';
import { examQuestions } from '@/lib/exam-questions';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Final Exam | The Agentic Web',
  description: 'Test your knowledge and earn your The Agentic Web certificate.',
  alternates: { canonical: '/agentic-web/final-exam' },
};

export default function FinalExam() {
  return <FinalExamClient courseId="agentic-web" questions={examQuestions['agentic-web']} />;
}
